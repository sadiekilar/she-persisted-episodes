#!/usr/bin/env node
// Show RSS feed (the host's) + Apple's episode lookup → audio_url, duration_sec,
// apple_episode_url, and from Flightcast: the timestamped transcript (source of truth)
// and chapters. Matched to episodes by the leading number in the title.
//   node scripts/rss-sync.js          transcripts only for episodes that don't have Flightcast's yet
//   node scripts/rss-sync.js --all    re-fetch every transcript
const { readEpisodes, writeEpisode, decodeEntities, sleep } = require('./lib');
const { vttToParagraphs, paragraphsToMarkdown, withTranscript, chaptersFromNotes, chaptersFromJson } = require('./flightcast');
const REFETCH = process.argv.includes('--all');

const FEED = process.env.SHOW_RSS || 'https://rss2.flightcast.com/zpjo9decpjwnj5srl30kahnx.xml';
const APPLE_ID = process.env.APPLE_PODCAST_ID || '1463051730';

const numberOf = (title) => { const m = /^\s*(\d+)[.:]/.exec(decodeEntities(String(title || ''))); return m ? +m[1] : null; };
// Newer feed items carry the number in the description ("ep. 264") rather than the title.
const numberIn = (s) => { const m = /\b(?:ep|episode)\.?\s*#?\s*(\d{1,3})\b/i.exec(decodeEntities(String(s || ''))) || /(?:^|\n)\s*#?(\d{1,3})\s*(?:\n|$)/.exec(String(s || '')); return m ? +m[1] : null; };
const norm = (s) => decodeEntities(String(s || '')).toLowerCase().replace(/^\s*\d+[.:]\s*/, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
function toSeconds(d) {
  if (d == null) return null;
  d = String(d).trim();
  if (/^\d+$/.test(d)) return +d;
  const parts = d.split(':').map(Number);
  if (parts.some(isNaN)) return null;
  return parts.reduce((acc, n) => acc * 60 + n, 0);
}

async function main() {
  const episodes = readEpisodes();
  const byNumber = new Map(episodes.map((e) => [e.meta.number, e]));
  const found = { rss: 0, apple: 0 };

  const xml = await (await fetch(FEED)).text();
  const items = xml.split(/<item\b[^>]*>/).slice(1).map((chunk) => chunk.split('</item>')[0]);
  const rss = new Map();
  for (const it of items) {
    const title = (/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/.exec(it) || [])[1];
    const notes = (/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/.exec(it) || [])[1] || (/<itunes:summary>([\s\S]*?)<\/itunes:summary>/.exec(it) || [])[1] || '';
    let n = numberOf(title);
    if (n == null) n = numberIn(notes.replace(/<[^>]+>/g, '\n'));
    if (n == null) { // last resort: the episode whose title matches best
      const t = norm(title); let best = null, score = 0;
      for (const e of episodes) { const et = norm(e.meta.title); if (!t || !et) continue; const sc = t === et ? 1 : (et.includes(t) || t.includes(et)) ? 0.8 : 0; if (sc > score) { score = sc; best = e; } }
      if (best && score >= 0.8) n = best.meta.number;
    }
    if (n == null || rss.has(n)) continue;
    rss.set(n, {
      audio: (/<enclosure\b[^>]*\burl="([^"]+)"/.exec(it) || [])[1] || '',
      duration: toSeconds((/<itunes:duration>([^<]*)<\/itunes:duration>/.exec(it) || [])[1]),
      guid: ((/<guid\b[^>]*>([^<]*)<\/guid>/.exec(it) || [])[1] || '').trim(),
      vtt: (/<podcast:transcript\b[^>]*\burl="([^"]+)"[^>]*\btype="text\/vtt"/.exec(it) || /<podcast:transcript\b[^>]*\burl="([^"]+\.vtt)"/.exec(it) || [])[1] || '',
      chaptersUrl: (/<podcast:chapters\b[^>]*\burl="([^"]+)"/.exec(it) || [])[1] || '',
      notesChapters: chaptersFromNotes(notes),
    });
  }
  console.log(`rss: ${items.length} items, ${rss.size} with episode numbers`);

  // Apple lists episodes by show id (newest 200 only); older episodes keep no Apple link.
  const apple = new Map();
  try {
    const data = await (await fetch(`https://itunes.apple.com/lookup?id=${APPLE_ID}&entity=podcastEpisode&limit=300`)).json();
    for (const r of data.results || []) {
      if (r.kind !== 'podcast-episode') continue;
      const n = numberOf(r.trackName);
      if (n != null && !apple.has(n)) apple.set(n, { url: r.trackViewUrl, duration: r.trackTimeMillis ? Math.round(r.trackTimeMillis / 1000) : null });
    }
    console.log(`apple: ${apple.size} episodes with numbers`);
  } catch (err) {
    console.error(`apple lookup failed: ${err.message}`);
  }

  let transcripts = 0, chapters = 0;
  for (const ep of episodes) {
    const meta = { ...ep.meta };
    let body = ep.body;
    const r = rss.get(meta.number);
    const a = apple.get(meta.number);
    if (r) {
      found.rss++;
      if (r.audio && (!meta.audio_url || /embedly|spotify\.com\/embed|creators\.spotify/.test(meta.audio_url))) meta.audio_url = r.audio;
      if (r.duration && !meta.duration_sec) meta.duration_sec = r.duration;
      // chapters: a chapters file beats show-notes timestamps beats whatever was generated before
      let ch = [];
      if (r.chaptersUrl) { try { ch = chaptersFromJson(await (await fetch(r.chaptersUrl)).json()); } catch (err) { console.error(`chapters ${meta.number}: ${err.message}`); } }
      if (!ch.length) ch = r.notesChapters;
      if (ch.length) { meta.chapters = ch; meta.chapters_source = 'feed'; chapters++; }
      // transcript: Flightcast's timestamped VTT replaces the blog copy
      if (r.vtt && (REFETCH || meta.transcript_source !== 'flightcast')) {
        try {
          const paragraphs = vttToParagraphs(await (await fetch(r.vtt)).text());
          if (paragraphs.length > 20) {
            body = withTranscript(body, paragraphsToMarkdown(paragraphs));
            meta.transcript_source = 'flightcast';
            meta.transcript_url = r.vtt;
            transcripts++;
          }
          await sleep(150);
        } catch (err) { console.error(`transcript ${meta.number}: ${err.message}`); }
      }
    }
    if (a) {
      found.apple++;
      meta.apple_episode_url = a.url;
      if (a.duration && !meta.duration_sec) meta.duration_sec = a.duration;
    }
    if (JSON.stringify(meta) !== JSON.stringify(ep.meta) || body !== ep.body) writeEpisode(ep.file, meta, body);
  }
  console.log(`matched ${found.rss} episodes in the feed, ${found.apple} on apple; ${transcripts} transcripts fetched, ${chapters} episodes with feed chapters`);
  await sleep(0);
}

main().catch((err) => { console.error(err); process.exit(1); });

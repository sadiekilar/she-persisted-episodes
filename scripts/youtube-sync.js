#!/usr/bin/env node
// YouTube Data API v3 → youtube_id and duration for long-form videos, shorts[] for
// each episode. Needs YOUTUBE_API_KEY. Unmatched videos → index/youtube-unmatched.md.
const fs = require('fs');
const path = require('path');
const { INDEX_DIR, readEpisodes, writeEpisode, decodeEntities } = require('./lib');

const KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL = process.env.YOUTUBE_CHANNEL_ID || 'UCs1GxrDGrl0TbcPrQWPYfIA';
const SHORT_MAX_SEC = 180;
// uploads that are not episodes but whose titles look like one (fuzzy matching would pair them)
const IGNORE = new Set(['PCJ0R6vAUnw']); // "DBT Mindfulness Skills | MARSHA LINEHAN" (was matched to 17 and 18)
const API = 'https://www.googleapis.com/youtube/v3/';

async function api(method, params) {
  const url = API + method + '?' + new URLSearchParams({ ...params, key: KEY });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${method}: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

function isoToSeconds(iso) {
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso || '');
  return m ? (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0) : null;
}
const norm = (s) => decodeEntities(String(s || '')).toLowerCase().replace(/^\s*\d+[.:]\s*/, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
// "264. title", "ep. 264", "episode 264", "#264", or a line that is just the number.
const numberIn = (s) => {
  const m = /^\s*(\d{1,3})[.:]\s/.exec(s || '') || /\b(?:ep|episode)\.?\s*#?\s*(\d{1,3})\b/i.exec(s || '') || /(?:^|\n)\s*#?(\d{1,3})\s*(?:\n|$)/.exec(s || '');
  return m ? +m[1] : null;
};
// Dice coefficient on word bigrams: good enough to pair a video title with an episode title.
function similarity(a, b) {
  const grams = (s) => { const w = s.split(' '); const g = new Set(); for (let i = 0; i < w.length - 1; i++) g.add(w[i] + ' ' + w[i + 1]); return g; };
  const A = grams(a), B = grams(b);
  if (!A.size || !B.size) return 0;
  let hit = 0;
  A.forEach((g) => { if (B.has(g)) hit++; });
  return (2 * hit) / (A.size + B.size);
}

async function listUploads() {
  const ch = await api('channels', { part: 'contentDetails', id: CHANNEL });
  const uploads = ch.items && ch.items[0] && ch.items[0].contentDetails.relatedPlaylists.uploads;
  if (!uploads) throw new Error('channel not found');
  const ids = [];
  let pageToken = '';
  do {
    const page = await api('playlistItems', { part: 'contentDetails', playlistId: uploads, maxResults: 50, pageToken });
    ids.push(...page.items.map((i) => i.contentDetails.videoId));
    pageToken = page.nextPageToken || '';
  } while (pageToken);
  const videos = [];
  for (let i = 0; i < ids.length; i += 50) {
    const page = await api('videos', { part: 'snippet,contentDetails', id: ids.slice(i, i + 50).join(','), maxResults: 50 });
    for (const v of page.items) {
      const t = v.snippet.thumbnails || {};
      videos.push({
        id: v.id,
        title: decodeEntities(v.snippet.title),
        description: v.snippet.description || '',
        published: v.snippet.publishedAt,
        duration: isoToSeconds(v.contentDetails.duration),
        thumbnail: (t.maxres || t.standard || t.high || t.medium || t.default || {}).url || '',
      });
    }
  }
  return videos;
}

async function main() {
  if (!KEY) return console.log('youtube-sync: YOUTUBE_API_KEY is not set; skipping');
  const episodes = readEpisodes();
  const byNumber = new Map(episodes.map((e) => [e.meta.number, e]));
  const videos = await listUploads();
  const longs = videos.filter((v) => v.duration > SHORT_MAX_SEC);
  const shorts = videos.filter((v) => v.duration != null && v.duration <= SHORT_MAX_SEC);
  console.log(`youtube: ${videos.length} videos (${longs.length} long-form, ${shorts.length} shorts)`);

  const unmatched = { longs: [], shorts: [] };
  const minis = []; // "MINI:" uploads are cut-downs of episodes; minis.js links them to their parent
  const match = new Map(); // episode number → video
  // a youtube_id that is not one of the channel's own uploads came from a clip embedded in the post
  // (a John Oliver segment, a documentary trailer): drop it so the episode gets its real video or the audio player
  const uploads = new Set(videos.map((v) => v.id));
  for (const ep of episodes) {
    if (ep.meta.youtube_id && (!uploads.has(ep.meta.youtube_id) || IGNORE.has(ep.meta.youtube_id))) {
      console.log(`youtube ${ep.meta.number}: ${ep.meta.youtube_id} is not on the channel; dropped`);
      ep.meta.youtube_id = null;
    }
  }
  const alreadyKnown = new Map(episodes.filter((e) => e.meta.youtube_id).map((e) => [e.meta.youtube_id, e.meta.number]));
  for (const v of longs) {
    if (IGNORE.has(v.id)) continue;
    // a "MINI:" upload is a cut-down of an episode, never the episode itself (202 was matched to one)
    if (/^\s*mini\b/i.test(v.title)) { minis.push({ id: v.id, title: v.title, published: v.published, duration: v.duration, thumbnail: v.thumbnail }); continue; }
    let n = alreadyKnown.get(v.id);
    if (n == null) n = numberIn(v.title);
    if (n == null) n = numberIn(v.description);
    if (n == null || !byNumber.has(n)) {
      // fuzzy: best title similarity across the archive
      let best = null, score = 0;
      const vt = norm(v.title);
      for (const e of episodes) { const s = similarity(vt, norm(e.meta.title)); if (s > score) { score = s; best = e; } }
      if (best && score >= 0.5) n = best.meta.number;
      else { unmatched.longs.push({ v, best, score }); continue; }
    }
    if (!match.has(n)) match.set(n, v);
  }
  const shortsFor = new Map();
  for (const s of shorts) {
    const n = numberIn(s.description) || numberIn(s.title);
    if (n == null || !byNumber.has(n)) { unmatched.shorts.push(s); continue; }
    if (!shortsFor.has(n)) shortsFor.set(n, []);
    shortsFor.get(n).push({ youtube_id: s.id, title: s.title, duration_sec: s.duration, thumbnail_url: s.thumbnail });
  }

  let changed = 0;
  for (const ep of episodes) {
    const meta = { ...ep.meta };
    const v = match.get(meta.number);
    if (v) {
      if (!meta.youtube_id) meta.youtube_id = v.id;
      if (meta.youtube_id === v.id && v.duration) meta.duration_sec = meta.duration_sec || v.duration;
    }
    meta.shorts = shortsFor.get(meta.number) || [];
    if (JSON.stringify(meta) !== JSON.stringify(ep.meta)) { writeEpisode(ep.file, meta, ep.body); changed++; }
  }
  const withVideo = episodes.filter((e) => e.meta.youtube_id || match.has(e.meta.number)).length;
  console.log(`matched ${match.size} long-form videos; ${withVideo} episodes have a video; ${shortsFor.size} episodes have shorts; ${changed} files updated`);

  fs.mkdirSync(INDEX_DIR, { recursive: true });
  fs.writeFileSync(path.join(INDEX_DIR, 'youtube-minis.json'), JSON.stringify(minis, null, 1));
  fs.writeFileSync(path.join(INDEX_DIR, 'youtube-unmatched.md'), `# youtube videos not matched to an episode

Long-form videos match by the episode number at the start of the title (or "ep. NNN"), else by title similarity. Shorts match by "ep. NNN" / "episode NNN" in the description or title. To fix one, add the episode number to the video's title or description on YouTube.

## long-form (${unmatched.longs.length})

${unmatched.longs.map(({ v, best, score }) => `- [${v.title}](https://www.youtube.com/watch?v=${v.id}) (${v.published.slice(0, 10)}, ${Math.round(v.duration / 60)} min)${best ? ` — closest title: ${best.meta.number} (${Math.round(score * 100)}%)` : ''}`).join('\n') || 'none'}

## shorts (${unmatched.shorts.length})

${unmatched.shorts.map((s) => `- [${s.title}](https://www.youtube.com/shorts/${s.id}) (${s.published.slice(0, 10)})`).join('\n') || 'none'}
`);
}

main().catch((err) => { console.error(err); process.exit(1); });

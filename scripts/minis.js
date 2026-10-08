#!/usr/bin/env node
// Mental Health Minis: five-minute cut-downs of past episodes, published in the podcast feed (titles
// "mini: …") and on YouTube ("MINI: …"). They are not episodes; each is linked to the episode it was
// pulled from (the "listen to the full episode" link in its show notes) and listed on that episode.
// index/minis-review.md is read back first, so a parent set there wins.
//   node scripts/minis.js
const fs = require('fs');
const path = require('path');
const { INDEX_DIR, readEpisodes, decodeEntities } = require('./lib');

const FEED = process.env.PODCAST_FEED || 'https://rss2.flightcast.com/zpjo9decpjwnj5srl30kahnx.xml';
const reviewFile = path.join(INDEX_DIR, 'minis-review.md');
const norm = (s) => decodeEntities(String(s)).toLowerCase().replace(/^\s*mini:\s*/i, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
const dice = (a, b) => { const g = (s) => { const w = s.split(' '); const r = new Set(); for (let i = 0; i < w.length - 1; i++) r.add(w[i] + ' ' + w[i + 1]); return r; }; const A = g(a), B = g(b); if (!A.size || !B.size) return 0; let h = 0; A.forEach((x) => { if (B.has(x)) h++; }); return (2 * h) / (A.size + B.size); };
const tag = (xml, name) => { const m = new RegExp(`<${name}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${name}>`).exec(xml); return m ? m[1].trim() : ''; };

function readReview() {
  const out = new Map();
  if (!fs.existsSync(reviewFile)) return out;
  for (const line of fs.readFileSync(reviewFile, 'utf8').split('\n')) {
    const m = /^- (\S+): .*?→\s*(\d+|none)\s*$/.exec(line);
    if (m) out.set(m[1], m[2] === 'none' ? null : +m[2]);
  }
  return out;
}

async function main() {
  const episodes = readEpisodes();
  const bySlug = new Map(episodes.map((e) => [String(e.meta.slug).toLowerCase(), e.meta.number]));
  const byNumber = new Set(episodes.map((e) => e.meta.number));
  const xml = await (await fetch(FEED)).text();
  const items = xml.split('<item>').slice(1);
  // YouTube minis: written by youtube-sync (index/youtube-minis.json)
  const ytFile = path.join(INDEX_DIR, 'youtube-minis.json');
  const yt = fs.existsSync(ytFile) ? JSON.parse(fs.readFileSync(ytFile, 'utf8')) : [];
  const review = readReview();
  const minis = [];
  for (const it of items) {
    const title = decodeEntities(tag(it, 'title'));
    if (!/^\s*mini:/i.test(title)) continue;
    const guid = tag(it, 'guid') || title;
    const id = guid.replace(/[^A-Za-z0-9]+/g, '').slice(-16) || norm(title).replace(/ /g, '-').slice(0, 40);
    const descRaw = decodeEntities(tag(it, 'description') + ' ' + tag(it, 'content:encoded'));
    const text = descRaw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    let parent = null;
    const link = /shepersistedpodcast\.com\/(?:podcast-)?episodes\/([\w-]+)/i.exec(descRaw);
    if (link) { const slug = link[1].toLowerCase(); parent = bySlug.get(slug) || (/^ep(\d+)$/.test(slug) && byNumber.has(+RegExp.$1) ? +RegExp.$1 : null) || (/^\d+$/.test(slug) && byNumber.has(+slug) ? +slug : null); }
    if (!parent) { const m = /\b(?:ep(?:isode)?\.?\s*#?)(\d{1,3})\b/i.exec(text); if (m && byNumber.has(+m[1])) parent = +m[1]; }
    if (review.has(id)) parent = review.get(id);
    const enclosure = /<enclosure[^>]*url="([^"]+)"/.exec(it);
    const durRaw = tag(it, 'itunes:duration');
    const duration = /^\d+$/.test(durRaw) ? +durRaw : durRaw.split(':').reduce((a, b) => a * 60 + +b, 0) || null;
    const cleanTitle = title.replace(/^\s*mini:\s*/i, '').trim();
    const ytMatch = yt.map((v) => ({ v, s: dice(norm(v.title), norm(cleanTitle)) })).sort((a, b) => b.s - a.s)[0];
    const blurb = (/in this mini[- ]episode,?\s*(.*?)(?:\s+to listen to the full episode|$)/i.exec(text) || [])[1] || '';
    minis.push({
      id, title: cleanTitle, date: new Date(tag(it, 'pubDate')).toISOString().slice(0, 10), duration_sec: duration,
      audio_url: enclosure ? enclosure[1] : null, youtube_id: ytMatch && ytMatch.s >= 0.5 ? ytMatch.v.id : null,
      parent, blurb: blurb.replace(/[.!]*$/, '').trim(),
    });
  }
  minis.sort((a, b) => (a.date < b.date ? 1 : -1));
  fs.writeFileSync(path.join(INDEX_DIR, 'minis.json'), JSON.stringify({ generatedAt: new Date().toISOString(), count: minis.length, minis }, null, 1));
  fs.writeFileSync(reviewFile, `# mental health minis

${minis.length} five-minute minis from the podcast feed, each linked to the episode it was pulled from (the "full episode" link in its notes). They are not counted as episodes. To change a parent, edit the number after the arrow and commit ("none" for no parent).

${minis.map((m) => `- ${m.id}: ${m.date} ${m.title}${m.youtube_id ? ' (video)' : ''} → ${m.parent ?? 'none'}`).join('\n')}

Without a parent: ${minis.filter((m) => !m.parent).map((m) => m.title).join('; ') || 'none'}. Without a YouTube video: ${minis.filter((m) => !m.youtube_id).length}.
`);
  console.log(`minis: ${minis.length} in the feed, ${minis.filter((m) => m.parent).length} linked to a parent episode, ${minis.filter((m) => m.youtube_id).length} with a YouTube video -> index/minis.json`);
}
main().catch((err) => { console.error(err); process.exit(1); });

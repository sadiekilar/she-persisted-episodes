#!/usr/bin/env node
// YouTube statistics for every episode video, short and mini, snapshotted nightly so history is kept:
//   analytics/youtube/YYYY-MM-DD.json   { videoId: { v: views, l: likes, c: comments } } for that day
//   index/analytics.json                 per-episode totals and 7/30/90-day deltas, from the snapshots
// Needs YOUTUBE_API_KEY (statistics are public; the key is only for quota).
const fs = require('fs');
const path = require('path');
const { INDEX_DIR, readEpisodes } = require('./lib');

const KEY = process.env.YOUTUBE_API_KEY;
const ROOT = path.join(__dirname, '..');
const SNAP_DIR = path.join(ROOT, 'analytics', 'youtube');
const today = new Date().toISOString().slice(0, 10);

async function stats(ids) {
  const out = {};
  for (let i = 0; i < ids.length; i += 50) {
    const url = 'https://www.googleapis.com/youtube/v3/videos?' + new URLSearchParams({ part: 'statistics', id: ids.slice(i, i + 50).join(','), key: KEY });
    const res = await fetch(url);
    if (!res.ok) throw new Error(`videos.list HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
    for (const v of (await res.json()).items || []) out[v.id] = { v: +v.statistics.viewCount || 0, l: +v.statistics.likeCount || 0, c: +v.statistics.commentCount || 0 };
  }
  return out;
}

function derive(episodes, minis) {
  const files = fs.existsSync(SNAP_DIR) ? fs.readdirSync(SNAP_DIR).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort() : [];
  if (!files.length) return null;
  const load = (f) => JSON.parse(fs.readFileSync(path.join(SNAP_DIR, f), 'utf8'));
  const latest = load(files[files.length - 1]);
  const at = (daysAgo) => { const target = new Date(Date.now() - daysAgo * 86400e3).toISOString().slice(0, 10); const f = [...files].reverse().find((x) => x.slice(0, 10) <= target); return f ? load(f) : null; };
  const d7 = at(7), d30 = at(30), d90 = at(90);
  const sum = (snap, ids, k) => ids.reduce((a, id) => a + ((snap && snap[id] && snap[id][k]) || 0), 0);
  const rows = episodes.map((e) => {
    const m = e.meta;
    const video = m.youtube_id ? [m.youtube_id] : [];
    const shorts = (m.shorts || []).map((s) => s.youtube_id);
    const miniIds = minis.filter((x) => x.parent === m.number && x.youtube_id).map((x) => x.youtube_id);
    const row = { number: m.number, date: String(m.date || '').slice(0, 10), youtube: { views: sum(latest, video, 'v'), likes: sum(latest, video, 'l'), comments: sum(latest, video, 'c') }, shorts: { count: shorts.length, views: sum(latest, shorts, 'v') }, minis: { count: miniIds.length, views: sum(latest, miniIds, 'v') } };
    for (const [k, snap] of [['7d', d7], ['30d', d30], ['90d', d90]]) if (snap) row.youtube['views_' + k] = row.youtube.views - sum(snap, video, 'v');
    return row;
  });
  return { generatedAt: new Date().toISOString(), snapshots: files.length, first: files[0].slice(0, 10), latest: files[files.length - 1].slice(0, 10), episodes: rows };
}

async function main() {
  const episodes = readEpisodes();
  const minisFile = path.join(INDEX_DIR, 'minis.json');
  const minis = fs.existsSync(minisFile) ? JSON.parse(fs.readFileSync(minisFile, 'utf8')).minis : [];
  const ids = [...new Set([...episodes.map((e) => e.meta.youtube_id), ...episodes.flatMap((e) => (e.meta.shorts || []).map((s) => s.youtube_id)), ...minis.map((x) => x.youtube_id)].filter(Boolean))];
  if (!KEY) console.log(`analytics-youtube: YOUTUBE_API_KEY is not set; no snapshot taken (${ids.length} videos known)`);
  else {
    fs.mkdirSync(SNAP_DIR, { recursive: true });
    const snap = await stats(ids);
    fs.writeFileSync(path.join(SNAP_DIR, today + '.json'), JSON.stringify(snap));
    console.log(`analytics-youtube: ${Object.keys(snap).length} videos snapshotted -> analytics/youtube/${today}.json`);
  }
  const out = derive(episodes, minis);
  if (out) { fs.writeFileSync(path.join(INDEX_DIR, 'analytics.json'), JSON.stringify(out, null, 1)); console.log(`analytics: ${out.snapshots} snapshot(s) from ${out.first}; index/analytics.json rebuilt`); }
}
main().catch((err) => { console.error(err); process.exit(1); });

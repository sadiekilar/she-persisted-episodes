#!/usr/bin/env node
// YouTube statistics for every episode video, short and mini, snapshotted nightly so history is kept:
//   analytics/youtube/YYYY-MM-DD.json   { videoId: { v: views, l: likes, c: comments } } for that day
//   index/analytics.json                 per-episode totals and 7/30/90-day deltas, from the snapshots
// Needs YOUTUBE_API_KEY (statistics are public; the key is only for quota).
const fs = require('fs');
const path = require('path');
const { INDEX_DIR, readEpisodes } = require('./lib');

const KEY = process.env.YOUTUBE_API_KEY;
// Only videos in the podcast playlist count as episode views (the number the monthly tracker used).
// Shorts are clips: snapshotted, reported separately, never counted as plays or downloads.
const PLAYLIST = process.env.YOUTUBE_PODCAST_PLAYLIST || 'PLGLC3-iJIHRQBUXr2D4FfHv7tCyn6wqyu';
const ROOT = path.join(__dirname, '..');
const SNAP_DIR = path.join(ROOT, 'analytics', 'youtube');
const today = new Date().toISOString().slice(0, 10);

async function playlistIds() {
  const ids = new Set();
  let pageToken = '';
  do {
    const url = 'https://www.googleapis.com/youtube/v3/playlistItems?' + new URLSearchParams({ part: 'contentDetails', playlistId: PLAYLIST, maxResults: 50, pageToken, key: KEY });
    const res = await fetch(url);
    if (!res.ok) throw new Error(`playlistItems HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
    const data = await res.json();
    (data.items || []).forEach((i) => ids.add(i.contentDetails.videoId));
    pageToken = data.nextPageToken || '';
  } while (pageToken);
  return ids;
}
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
  const inPlaylist = new Set(latest._playlist || []);
  const at = (daysAgo) => { const target = new Date(Date.now() - daysAgo * 86400e3).toISOString().slice(0, 10); const f = [...files].reverse().find((x) => x.slice(0, 10) <= target); return f ? load(f) : null; };
  const d7 = at(7), d30 = at(30), d90 = at(90);
  // Apple Podcasts Connect lifetime figures (analytics-apple.js): latest all-time snapshot, app-side plays only
  const appleDir = path.join(path.dirname(SNAP_DIR), 'apple');
  const appleFiles = fs.existsSync(appleDir) ? fs.readdirSync(appleDir).filter((f) => /^\d{4}-\d{2}-\d{2}-all-time\.json$/.test(f)).sort() : [];
  const apple = appleFiles.length ? JSON.parse(fs.readFileSync(path.join(appleDir, appleFiles[appleFiles.length - 1]), 'utf8')) : null;
  const appleMonthlyFile = path.join(appleDir, 'episode-monthly.json');
  const appleMonthly = fs.existsSync(appleMonthlyFile) ? JSON.parse(fs.readFileSync(appleMonthlyFile, 'utf8')) : null;
  const lastFull = apple ? (() => { const d = new Date(apple.date + 'T00:00:00Z'); d.setUTCDate(0); return d.toISOString().slice(0, 7); })() : null;
  const sum = (snap, ids, k) => ids.reduce((a, id) => a + ((snap && snap[id] && snap[id][k]) || 0), 0);
  const rows = episodes.map((e) => {
    const m = e.meta;
    const video = m.youtube_id && (!inPlaylist.size || inPlaylist.has(m.youtube_id)) ? [m.youtube_id] : [];
    const shorts = (m.shorts || []).map((s) => s.youtube_id);
    const miniIds = minis.filter((x) => x.parent === m.number && x.youtube_id).map((x) => x.youtube_id);
    const row = { number: m.number, date: String(m.date || '').slice(0, 10), youtube: { in_playlist: video.length > 0, views: sum(latest, video, 'v'), likes: sum(latest, video, 'l'), comments: sum(latest, video, 'c') }, clips: { note: 'shorts: not plays or downloads', count: shorts.length, views: sum(latest, shorts, 'v') }, minis: { count: miniIds.length, views: sum(latest, miniIds, 'v') } };
    for (const [k, snap] of [['7d', d7], ['30d', d30], ['90d', d90]]) if (snap) row.youtube['views_' + k] = row.youtube.views - sum(snap, video, 'v');
    const a = apple && apple.episodes[String(m.number)];
    if (a) {
      row.apple = { note: 'Apple Podcasts app plays, lifetime, as of ' + apple.date + '; a subset of RSS downloads', plays: a.plays, listeners: a.listeners, engaged: a.engaged, consumption_pct: a.consumption_pct };
      const mm = appleMonthly && appleMonthly.episodes[String(m.number)];
      if (mm && lastFull) { row.apple.last_full_month = lastFull; row.apple.plays_last_full_month = (mm[lastFull] && mm[lastFull].plays) || 0; }
    }
    return row;
  });
  return { generatedAt: new Date().toISOString(), rule: 'youtube.views counts only videos in the podcast playlist; clips (shorts) are reported separately and are never plays or downloads', playlist: PLAYLIST, snapshots: files.length, first: files[0].slice(0, 10), latest: files[files.length - 1].slice(0, 10), episodes: rows };
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
    try { snap._playlist = [...await playlistIds()]; } catch (e) { console.error('analytics-youtube: playlist lookup failed, counting every episode video: ' + e.message); }
    fs.writeFileSync(path.join(SNAP_DIR, today + '.json'), JSON.stringify(snap));
    console.log(`analytics-youtube: ${Object.keys(snap).length} videos snapshotted -> analytics/youtube/${today}.json`);
  }
  const out = derive(episodes, minis);
  if (out) { fs.writeFileSync(path.join(INDEX_DIR, 'analytics.json'), JSON.stringify(out, null, 1)); console.log(`analytics: ${out.snapshots} snapshot(s) from ${out.first}; index/analytics.json rebuilt`); }
}
main().catch((err) => { console.error(err); process.exit(1); });

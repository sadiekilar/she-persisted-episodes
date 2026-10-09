#!/usr/bin/env node
// Apple Podcasts Connect analytics, from the CSV exports Connect offers on every Analytics page
// (date range: the show's whole life). Drop them into analytics/imports/apple/ as
//   episodes-summary-<date>.csv            Episodes table, all time (listeners, engaged, plays, consumption)
//   engagement-trends-<date>.csv           show by month: time listened, plays, listeners, engaged
//   follower-trends-<date>.csv             show by month: net / gross followers, unfollowers
//   time-by-follower-state-<date>.csv      show by month: time listened, following vs not
//   episode-trends-all-<date>.csv          per episode by month (the Episode Trends export, all listeners)
//   episode-trends-following-<date>.csv    same, filtered to followers
//   episode-trends-not-following-<date>.csv same, filtered to non-followers
//   reviews-<COUNTRY>-<date>.csv           Ratings & Reviews export (written reviews only)
// The latest file of each kind wins (exports cover the full history, so a new one supersedes).
// Output:
//   analytics/apple/<date>-all-time.json   per-episode lifetime figures (episodes by number, minis by id)
//   analytics/apple/show-monthly.json      show-level months
//   analytics/apple/episode-monthly.json   per-episode months
//   analytics/apple/reviews.json           reviews merged by id
// Apple plays are verified plays inside the Apple Podcasts app only: a subset of the RSS downloads in
// analytics/show-monthly.json, never added to them. Listeners = unique devices; engaged = 20+ minutes
// or 40% of the episode; consumption = average share of the episode played. Time listened is seconds.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const IN = path.join(ROOT, 'analytics', 'imports', 'apple');
const OUT = path.join(ROOT, 'analytics', 'apple');
const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '');
const num = (v) => (v === undefined || v === '' || v === '-' || v === 'NaN' ? null : +String(v).replace(/,/g, ''));
const ym = (d) => `${String(d).slice(0, 4)}-${String(d).slice(4, 6)}`;

function parseCsv(text) {
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += ch; }
    else if (ch === '"') q = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.length > 1 || r[0]);
}
function readCsv(file) {
  const [head, ...rows] = parseCsv(fs.readFileSync(file, 'utf8').replace(/^﻿/, ''));
  const keys = head.map((h) => h.trim().toLowerCase());
  return rows.map((r) => Object.fromEntries(keys.map((k, i) => [k, r[i] === undefined ? '' : r[i]])));
}
const latest = (files, prefix) => { const m = files.filter((f) => f.startsWith(prefix + '-') && f.endsWith('.csv')).sort(); return m.length ? m[m.length - 1] : null; };
const dateOf = (f) => (/(\d{4}-\d{2}-\d{2})\.csv$/.exec(f) || [])[1];

// classify an Apple episode title: {kind:'episode', number} | {kind:'mini', id} | {kind:'other'}
function classify(title, release, minis) {
  const t = String(title).trim();
  let m = /^(\d{1,3})\.\s/.exec(t);
  if (m) return { kind: 'episode', number: +m[1] };
  if (/^mini:/i.test(t)) {
    const n = norm(t.replace(/^mini:/i, ''));
    let x = minis.find((mi) => norm(mi.title).startsWith(n) || n.startsWith(norm(mi.title)));
    if (!x && release) x = minis.find((mi) => Math.abs((new Date(mi.date) - new Date(release)) / 864e3) <= 3);
    if (x) return { kind: 'mini', id: x.id, mini: x };
  }
  return { kind: 'other' };
}

function allTime(files, minis) {
  const f = latest(files, 'episodes-summary'); if (!f) return null;
  const date = dateOf(f);
  const out = { date, range: 'all_time', source: 'Apple Podcasts Connect > Analytics > Episodes, CSV export, all time', note: 'Verified plays in the Apple Podcasts app only: a subset of RSS downloads, never added to analytics/show-monthly.json. listeners = unique devices; engaged = 20+ min or 40%; consumption_pct = average share played (null where Apple has a wrong duration and the value is nonsense). Episodes hidden from the feed and the trailers sit under other.', episodes: {}, minis: {}, other: [], anomalies: [], ids: {} };
  const rec = (r) => { const c = num(r['average consumption']); return { apple_id: r['episode id'], guid: r['episode guid'], release: r['release date'], duration_sec: num(r.duration), listeners: num(r['unique listeners']), engaged: num(r['unique engaged listeners']), plays: num(r.plays), consumption_pct: c === null ? null : (c <= 1.5 ? Math.round(c * 1000) / 10 : null) }; };
  for (const r of readCsv(path.join(IN, f))) {
    const k = classify(r['episode title'], r['release date'], minis); const x = rec(r);
    if (k.kind === 'episode') {
      if (!x.release || x.release < '2019') { out.other.push({ title: `${r['episode title']} (duplicate item dated ${x.release})`, ...x }); out.anomalies.push(`episode ${k.number} listed twice; the copy dated ${x.release} kept under other`); continue; }
      if (out.episodes[k.number]) { out.anomalies.push(`duplicate row for ${k.number}`); continue; }
      if (x.consumption_pct === null && r['average consumption']) out.anomalies.push(`episode ${k.number}: consumption ${r['average consumption']} discarded (Apple duration ${x.duration_sec}s)`);
      out.episodes[k.number] = x; out.ids[x.apple_id] = { kind: 'episode', key: k.number };
    } else if (k.kind === 'mini') { out.minis[k.id] = { title: k.mini.title, parent: k.mini.parent, ...x }; out.ids[x.apple_id] = { kind: 'mini', key: k.id }; }
    else { out.other.push({ title: r['episode title'], ...x }); if (/^mini:/i.test(r['episode title'])) out.anomalies.push(`mini not matched: ${r['episode title']}`); }
  }
  out.episodes = Object.fromEntries(Object.entries(out.episodes).sort((a, b) => +a[0] - +b[0]));
  const sum = (arr) => arr.reduce((a, x) => a + (x.plays || 0), 0);
  out.totals = { episodes: Object.keys(out.episodes).length, minis: Object.keys(out.minis).length, episode_plays: sum(Object.values(out.episodes)), mini_plays: sum(Object.values(out.minis)), other_plays: sum(out.other) };
  const ids = out.ids; delete out.ids;
  fs.writeFileSync(path.join(OUT, `${date}-all-time.json`), JSON.stringify(out, null, 1) + '\n');
  console.log(`analytics-apple: ${date}-all-time → ${out.totals.episodes} episodes / ${out.totals.minis} minis, ${out.totals.episode_plays} episode plays${out.anomalies.length ? `, ${out.anomalies.length} note(s)` : ''}`);
  return ids;
}

function showMonthly(files) {
  const months = {}; const at = (m) => (months[m] = months[m] || {});
  let used = [];
  const e = latest(files, 'engagement-trends');
  if (e) { used.push(e); for (const r of readCsv(path.join(IN, e))) Object.assign(at(ym(r.date)), { time_listened_sec: num(r['total time listened']), plays: num(r.plays), listeners: num(r['unique listeners']), engaged: num(r['unique engaged listeners']) }); }
  const t = latest(files, 'time-by-follower-state');
  if (t) { used.push(t); for (const r of readCsv(path.join(IN, t))) Object.assign(at(ym(r.date)), { time_following_sec: num(r.following) || 0, time_not_following_sec: num(r['not following']) || 0 }); }
  const f = latest(files, 'follower-trends');
  if (f) { used.push(f); for (const r of readCsv(path.join(IN, f))) Object.assign(at(ym(r.date)), { followers_net: num(r['net followers']), followers_gross: num(r['gross followers']), unfollowers_gross: num(r['gross unfollowers']) }); }
  if (!used.length) return;
  const out = { source: 'Apple Podcasts Connect CSV exports (' + used.map(dateOf).filter(Boolean).sort().pop() + ')', note: 'Apple app plays only, never added to RSS downloads. followers_* are cumulative at month end; the other fields are the month\'s activity. The last month is partial up to the export date.', months: Object.fromEntries(Object.entries(months).sort()) };
  fs.writeFileSync(path.join(OUT, 'show-monthly.json'), JSON.stringify(out, null, 1) + '\n');
  console.log(`analytics-apple: show-monthly.json ${Object.keys(months).length} months`);
}

function episodeMonthly(files, ids, minis) {
  const kinds = [['all', ''], ['following', '_following'], ['not-following', '_not_following']];
  const eps = {}, mins = {}, other = {}; let used = [];
  for (const [kind, suffix] of kinds) {
    const f = latest(files, 'episode-trends-' + kind); if (!f) continue; used.push(f);
    for (const r of readCsv(path.join(IN, f))) {
      const id = r['episode id']; let target;
      const known = ids && ids[id];
      if (known) target = known.kind === 'episode' ? (eps[known.key] = eps[known.key] || {}) : (mins[known.key] = mins[known.key] || { title: minis.find((m) => m.id === known.key)?.title, months: {} }).months;
      else { const k = classify(r['episode title'], null, minis); target = k.kind === 'episode' ? (eps[k.number] = eps[k.number] || {}) : k.kind === 'mini' ? (mins[k.id] = mins[k.id] || { title: k.mini.title, months: {} }).months : (other[r['episode title']] = other[r['episode title']] || {}); }
      const m = (target[ym(r.date)] = target[ym(r.date)] || {});
      m['plays' + suffix] = num(r.plays); m['listeners' + suffix] = num(r['unique listeners']); m['engaged' + suffix] = num(r['unique engaged listeners']); m['time_listened_sec' + suffix] = num(r['total time listened']);
    }
  }
  if (!used.length) return;
  const sortM = (o) => Object.fromEntries(Object.entries(o).sort());
  const out = { source: 'Apple Podcasts Connect Episode Trends CSV exports (' + used.map(dateOf).filter(Boolean).sort().pop() + ')', note: 'Apple app plays per episode per month (all listeners, and split by whether the listener follows the show). Months with no plays are absent. The last month is partial.', episodes: Object.fromEntries(Object.entries(eps).sort((a, b) => +a[0] - +b[0]).map(([k, v]) => [k, sortM(v)])), minis: Object.fromEntries(Object.entries(mins).map(([k, v]) => [k, { title: v.title, months: sortM(v.months) }])), other: Object.fromEntries(Object.entries(other).map(([k, v]) => [k, sortM(v)])) };
  fs.writeFileSync(path.join(OUT, 'episode-monthly.json'), JSON.stringify(out, null, 1) + '\n');
  console.log(`analytics-apple: episode-monthly.json ${Object.keys(eps).length} episodes / ${Object.keys(mins).length} minis`);
}

function reviews(files) {
  const rf = files.filter((f) => /^reviews-.*\.csv$/.test(f)).sort(); if (!rf.length) return;
  const byId = {};
  for (const f of rf) {
    const country = (/^reviews-([A-Za-z]{2})-/.exec(f) || [, '??'])[1].toUpperCase();
    for (const r of readCsv(path.join(IN, f))) { const id = r['review id']; if (!id) continue; byId[id] = { id, country, date: (r.date || '').slice(0, 10), rating: +r.rating || null, title: r.title || '', review: r.review || '', user: r.user || '' }; }
  }
  const list = Object.values(byId).sort((a, b) => (a.date < b.date ? 1 : -1));
  const byYear = {}, byRating = {};
  for (const r of list) { const y = r.date.slice(0, 4); byYear[y] = (byYear[y] || 0) + 1; byRating[r.rating] = (byRating[r.rating] || 0) + 1; }
  const avg = list.length ? +(list.reduce((a, r) => a + (r.rating || 0), 0) / list.length).toFixed(2) : null;
  fs.writeFileSync(path.join(OUT, 'reviews.json'), JSON.stringify({ source: 'Apple Podcasts Connect ratings & reviews CSV export (written reviews only; star ratings without text are not exported)', countries: [...new Set(list.map((r) => r.country))], count: list.length, average_rating: avg, by_rating: byRating, by_year: byYear, reviews: list }, null, 1) + '\n');
  console.log(`analytics-apple: ${list.length} reviews from ${rf.length} export(s) → reviews.json`);
}

function main() {
  if (!fs.existsSync(IN)) return console.log('analytics-apple: no imports');
  fs.mkdirSync(OUT, { recursive: true });
  const minisFile = path.join(ROOT, 'index', 'minis.json');
  const minisRaw = fs.existsSync(minisFile) ? JSON.parse(fs.readFileSync(minisFile, 'utf8')) : [];
  const minis = Array.isArray(minisRaw) ? minisRaw : (minisRaw.minis || []);
  const files = fs.readdirSync(IN);
  const ids = allTime(files, minis);
  showMonthly(files);
  episodeMonthly(files, ids, minis);
  reviews(files);
}

main();

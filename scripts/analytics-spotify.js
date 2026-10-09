#!/usr/bin/env node
// Spotify for Creators analytics, from the CSV exports on each dashboard page. Drop them into
// analytics/imports/spotify/ with these names (date = export date; ranged exports carry their
// own start--end; the newest file of each kind wins, daily series are merged by date):
//   performance-daily-all-time-<date>.csv       Date, Plays, Audience (daily since 2019-07)
//   engagement-daily-all-time-<date>.csv        Date, consumption hours, avg consumption, comments, followers
//   episodes-plays-<date>.csv                   Trends chart exports, one metric per file, every episode:
//   episodes-audience-<date>.csv                  plays since published, Spotify audience,
//   episodes-consumption-hours-<date>.csv         consumption hours, average consumption hours,
//   episodes-avg-consumption-hours-<date>.csv     watch time %, comments,
//   episodes-watch-time-pct-<date>.csv            discovery impressions (first 30 days, with the
//   episodes-comments-<date>.csv                  "x% above/below normal" label),
//   episodes-discovery-impressions-30d-<date>.csv completion rate (first 7 days, with label)
//   episodes-completion-7d-<date>.csv
//   completion-rates-latest-<date>.csv          completion rate of the latest episodes, with Spotify URIs
//   top-<metric>-all-time-<date>.csv            top-10 lists (consumption-hours, avg-consumption-hours, comments)
//   top-impressions-<start>--<end>.csv          top-10 by impressions with Home / Search / Library split
//   impressions-daily-<start>--<end>.csv        Date, Impressions
//   retention-weekly-<start>--<end>.csv         Week starting, Retention rate (%)
//   audience-segments-<start>--<end>.csv        Date, Total, Returning, New (daily)
//   geo-<start>--<end>.csv                      Geo, Percentage
//   gender-all-time-<date>.csv / gender-<start>--<end>.csv
//   age-gender-all-time-<date>.csv / age-gender-<start>--<end>.csv
// Output: analytics/spotify/show-daily.json, show-monthly.json, episodes.json, audience.json.
//
// Spotify plays are plays inside Spotify only. They overlap the RSS downloads in
// analytics/show-monthly.json and the Flightcast counts (which include Spotify streams) and are never
// added to either. Use them for Spotify-only ranking, audience make-up and discovery.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const IN = path.join(ROOT, 'analytics', 'imports', 'spotify');
const OUT = path.join(ROOT, 'analytics', 'spotify');
const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '');
const num = (v) => (v === undefined || v === '' || v === '-' ? null : Math.round(+String(v).replace(/[,%]/g, '') * 100) / 100);
const int = (v) => (v === undefined || v === '' ? null : parseInt(String(v).replace(/,/g, ''), 10));
const iso = (d) => { const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(String(d).trim()); return m ? `${m[3]}-${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}` : String(d).trim(); };

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
  return rows.map((r) => Object.fromEntries(keys.map((k, i) => [k, r[i] === undefined ? '' : r[i].trim()])));
}
const files = () => (fs.existsSync(IN) ? fs.readdirSync(IN).filter((f) => f.endsWith('.csv')).sort() : []);
const ofKind = (all, prefix) => all.filter((f) => f.startsWith(prefix + '-') && /\d{4}-\d{2}-\d{2}\.csv$/.test(f));
const latest = (all, prefix) => { const m = ofKind(all, prefix); return m.length ? m[m.length - 1] : null; };
const rangeOf = (f) => { const m = /(\d{4}-\d{2}-\d{2})--(\d{4}-\d{2}-\d{2})\.csv$/.exec(f); return m ? { from: m[1], to: m[2] } : { all_time: true, exported: (/(\d{4}-\d{2}-\d{2})\.csv$/.exec(f) || [])[1] }; };

function classify(title, minis) {
  const t = String(title).trim();
  const m = /^(\d{1,3})\.\s/.exec(t);
  if (m) return { kind: 'episode', key: +m[1] };
  if (/^mini:/i.test(t)) {
    const n = norm(t.replace(/^mini:/i, ''));
    const x = minis.find((mi) => norm(mi.title).startsWith(n) || n.startsWith(norm(mi.title)));
    if (x) return { kind: 'mini', key: x.id, title: x.title };
  }
  return { kind: 'other', key: t };
}

function showDaily(all) {
  const days = {}; const at = (d) => (days[d] = days[d] || {});
  let used = [];
  for (const f of ofKind(all, 'performance-daily-all-time')) { used.push(f); for (const r of readCsv(path.join(IN, f))) Object.assign(at(iso(r.date)), { plays: int(r.plays), audience: int(r.audience) }); }
  for (const f of ofKind(all, 'engagement-daily-all-time')) { used.push(f); for (const r of readCsv(path.join(IN, f))) Object.assign(at(iso(r.date)), { consumption_hours: num(r['consumption time (hours)']), avg_consumption_hours: num(r['average consumption time (hours)']), comments: int(r.comments), followers: int(r.followers) }); }
  for (const f of ofKind(all, 'impressions-daily')) { used.push(f); for (const r of readCsv(path.join(IN, f))) at(iso(r.date)).impressions = int(r.impressions); }
  for (const f of ofKind(all, 'audience-segments')) { used.push(f); for (const r of readCsv(path.join(IN, f))) Object.assign(at(iso(r.date)), { listeners: int(r.total), listeners_returning: int(r.returning), listeners_new: int(r.new) }); }
  if (!used.length) return null;
  const sorted = Object.fromEntries(Object.entries(days).sort());
  fs.writeFileSync(path.join(OUT, 'show-daily.json'), JSON.stringify({ source: 'Spotify for Creators CSV exports', note: 'Spotify plays only, never added to RSS downloads or Flightcast. followers is cumulative; listeners (new/returning) and impressions exist only for the exported ranges.', days: sorted }, null, 1) + '\n');
  const months = {};
  for (const [d, v] of Object.entries(sorted)) {
    const m = d.slice(0, 7); const o = (months[m] = months[m] || { plays: 0, consumption_hours: 0, days: 0 });
    o.plays += v.plays || 0; o.consumption_hours = Math.round((o.consumption_hours + (v.consumption_hours || 0)) * 100) / 100; o.days++;
    if (v.followers != null) o.followers_end = v.followers;
    if (v.impressions != null) o.impressions = (o.impressions || 0) + v.impressions;
    if (v.listeners_new != null) { o.listeners_new = (o.listeners_new || 0) + v.listeners_new; o.listeners_returning = (o.listeners_returning || 0) + (v.listeners_returning || 0); }
  }
  fs.writeFileSync(path.join(OUT, 'show-monthly.json'), JSON.stringify({ source: 'rolled up from show-daily.json', note: 'Spotify plays only. The last month is partial. listeners_new/returning are day-level sums (a listener active on several days is counted each day).', months }, null, 1) + '\n');
  console.log(`analytics-spotify: show-daily.json ${Object.keys(sorted).length} days, show-monthly.json ${Object.keys(months).length} months`);
  return sorted;
}

function episodes(all, minis) {
  const eps = {}, mins = {}, other = {};
  const slot = (title, pub) => {
    const k = classify(title, minis);
    const store = k.kind === 'episode' ? eps : k.kind === 'mini' ? mins : other;
    const o = (store[k.key] = store[k.key] || (k.kind === 'episode' ? {} : { title: k.kind === 'mini' ? k.title : title }));
    if (pub && !o.spotify_publish_date) o.spotify_publish_date = iso(pub);
    return o;
  };
  const metrics = [
    ['episodes-plays', 'plays', 'plays_since_published', int],
    ['episodes-audience', 'spotify audience', 'audience', int],
    ['episodes-consumption-hours', 'consumption time (hours)', 'consumption_hours', num],
    ['episodes-avg-consumption-hours', 'average consumption time (hours)', 'avg_consumption_hours', num],
    ['episodes-watch-time-pct', 'watch time % (%)', 'watch_time_pct', num],
    ['episodes-comments', 'comments', 'comments', int],
    ['episodes-discovery-impressions-30d', 'discovery impressions', 'discovery_impressions_30d', int],
    ['episodes-completion-7d', 'completion rate (%)', 'completion_7d_pct', num],
  ];
  let used = 0;
  for (const [prefix, col, key, cast] of metrics) {
    const f = latest(all, prefix); if (!f) continue; used++;
    for (const r of readCsv(path.join(IN, f))) {
      const o = slot(r['episode name'], r['publish date']);
      o[key] = cast(r[col]);
      if (r.performance) o[key + '_vs_normal'] = r.performance;
    }
  }
  const uriFiles = all.filter((f) => /^(completion-rates-latest|top-)/.test(f));
  for (const f of uriFiles) for (const r of readCsv(path.join(IN, f))) {
    if (!r['episode uri']) continue;
    const o = slot(r['episode title'], r['publish date']);
    o.spotify_id = r['episode uri'].replace('spotify:episode:', '');
    if (r['completion rate (%)'] != null && r['completion rate (%)'] !== '') o.completion_pct_all_time = num(r['completion rate (%)']);
  }
  if (!used) return;
  const sortNum = (o) => Object.fromEntries(Object.entries(o).sort((a, b) => +a[0] - +b[0]));
  fs.writeFileSync(path.join(OUT, 'episodes.json'), JSON.stringify({ source: 'Spotify for Creators trends-chart exports (' + (latest(all, 'episodes-plays') || '').slice(-14, -4) + ')', note: 'Per-episode Spotify-only figures since publish. discovery_impressions_30d and completion_7d_pct cover the first 30 / 7 days and carry Spotify\'s "vs normal" label. completion_pct_all_time and spotify_id come from the latest-episodes and top-10 exports, so only some episodes have them.', episodes: sortNum(eps), minis: mins, other }, null, 1) + '\n');
  console.log(`analytics-spotify: episodes.json ${Object.keys(eps).length} episodes / ${Object.keys(mins).length} minis`);
}

function audience(all) {
  const out = { source: 'Spotify for Creators audience exports', note: 'Percentages are of Spotify listeners in the stated range. retention is the share of listeners from one week who listened the next.' };
  const ranged = (prefix, fn) => ofKind(all, prefix).map((f) => ({ range: rangeOf(f), ...fn(readCsv(path.join(IN, f))) }));
  out.geo = ranged('geo', (rows) => ({ countries: Object.fromEntries(rows.map((r) => [r.geo, num(r.percentage)])) }));
  out.gender = ranged('gender', (rows) => ({ pct: Object.fromEntries(rows.map((r) => [r.gender.toLowerCase().replace(/[^a-z0-9]+/g, '_'), num(r.percentage)])) }));
  out.age_gender = ranged('age-gender', (rows) => ({ rows: rows.map((r) => ({ age: r.age, total_pct: num(r['total percentage']), male_pct: num(r['male percentage']), female_pct: num(r['female percentage']), non_binary_pct: num(r['non-binary percentage']), not_specified_pct: num(r['not specified percentage']) })) }));
  out.retention_weekly = ranged('retention-weekly', (rows) => ({ weeks: Object.fromEntries(rows.map((r) => [iso(r['week starting']), num(r['retention rate (%)'])])) }));
  out.top_impressions = ranged('top-impressions', (rows) => ({ episodes: rows.map((r) => ({ title: r['episode title'], spotify_id: (r['episode uri'] || '').replace('spotify:episode:', ''), total: int(r['total impressions']), home: int(r.home), search: int(r.search), library: int(r.library), other: int(r['other spotify features']) })) }));
  for (const k of ['consumption-hours', 'avg-consumption-hours', 'comments']) {
    const f = latest(all, 'top-' + k + '-all-time'); if (!f) continue;
    out['top_' + k.replace(/-/g, '_') + '_all_time'] = readCsv(path.join(IN, f)).map((r) => ({ title: r['episode title'], spotify_id: (r['episode uri'] || '').replace('spotify:episode:', ''), value: num(Object.values(r)[1]) }));
  }
  fs.writeFileSync(path.join(OUT, 'audience.json'), JSON.stringify(out, null, 1) + '\n');
  console.log(`analytics-spotify: audience.json (${out.geo.length} geo, ${out.retention_weekly.length} retention, ${out.top_impressions.length} impressions range(s))`);
}

function main() {
  const all = files();
  if (!all.length) return console.log('analytics-spotify: no imports');
  fs.mkdirSync(OUT, { recursive: true });
  const minisFile = path.join(ROOT, 'index', 'minis.json');
  const minisRaw = fs.existsSync(minisFile) ? JSON.parse(fs.readFileSync(minisFile, 'utf8')) : [];
  const minis = Array.isArray(minisRaw) ? minisRaw : (minisRaw.minis || []);
  showDaily(all);
  episodes(all, minis);
  audience(all);
}

main();

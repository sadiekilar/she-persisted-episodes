#!/usr/bin/env node
// Apple Podcasts Connect analytics. Apple has no API for these numbers (the Connect API only
// lists shows/episodes), so the Episodes table is captured from the dashboard by hand into
//   analytics/imports/apple/YYYY-MM-DD-<range>.txt     key|date|listeners|engaged|plays|consumption
// (key: episode number, "M:<mini title>", "T:<anything else>"; "# show: ..." line carries the
// show-level KPIs) and this script turns each one into
//   analytics/apple/YYYY-MM-DD-<range>.json
// Ranges: all-time (lifetime, captured now and then) and month (the dashboard's "Month" range,
// captured on the 1st for the month just ended).
//
// Apple plays are verified plays inside the Apple Podcasts app only: a subset of the RSS downloads
// in show-monthly.json, never added to them. Listeners = unique devices; engaged = 20+ minutes or
// 40% of the episode; consumption = average share of the episode played.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const IN = path.join(ROOT, 'analytics', 'imports', 'apple');
const OUT = path.join(ROOT, 'analytics', 'apple');
const MON = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };

const iso = (d) => { const m = /^(\w{3}) (\d+),? (\d{4})$/.exec(d.trim()); return m ? `${m[3]}-${String(MON[m[1]]).padStart(2, '0')}-${String(m[2]).padStart(2, '0')}` : null; };
const num = (v) => (v === '-' || v === '' ? null : +String(v).replace(/,/g, ''));
const pct = (v) => { if (v === '-' || v === '') return null; const n = +String(v).replace(/[%,]/g, ''); return n > 100 ? null : n; };
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');

function convert(file, minis) {
  const name = path.basename(file, '.txt');
  const [, date, range] = /^(\d{4}-\d{2}-\d{2})-(.+)$/.exec(name) || [];
  if (!date) throw new Error(`bad import name ${name} (want YYYY-MM-DD-<range>.txt)`);
  const lines = fs.readFileSync(file, 'utf8').split('\n').map((l) => l.trim()).filter(Boolean);
  const out = { date, range: range.replace(/-/g, '_'), source: 'Apple Podcasts Connect > Analytics > Episodes (dashboard table)', note: 'Verified plays in the Apple Podcasts app only: a subset of RSS downloads, never added to show-monthly.json. listeners = unique devices; engaged = 20+ min or 40%; consumption_pct = average share played (null where Apple shows a nonsense value).', show: null, episodes: {}, minis: {}, other: [], anomalies: [] };
  const rec = (c) => ({ date: iso(c[1]), listeners: num(c[2]), engaged: num(c[3]), plays: num(c[4]), consumption_pct: pct(c[5]) });
  for (const line of lines) {
    if (line.startsWith('#')) {
      const m = /^#\s*show:\s*(.+)$/i.exec(line);
      if (m) { out.show = {}; for (const kv of m[1].split('|')) { const [k, v] = kv.trim().split(/\s+/); out.show[k.toLowerCase()] = num(v); } }
      continue;
    }
    const c = line.split('|').map((x) => x.trim());
    if (c.length < 6) { out.anomalies.push(`unreadable row: ${line}`); continue; }
    const key = c[0];
    if (/^\d+$/.test(key)) {
      const d = iso(c[1]);
      if (!d || d < '2019') { out.other.push({ title: `${key} (duplicate item dated ${c[1]})`, ...rec(c) }); out.anomalies.push(`episode ${key} listed twice; the copy dated ${c[1]} kept under other`); continue; }
      if (out.episodes[key]) { out.anomalies.push(`duplicate row for ${key}`); continue; }
      const x = rec(c);
      if (x.consumption_pct === null && c[5] !== '-') out.anomalies.push(`episode ${key}: consumption ${c[5]} discarded`);
      out.episodes[key] = x;
    } else if (/^M:/i.test(key)) {
      const t = norm(key.slice(2)); const d = iso(c[1]);
      let m = minis.find((x) => norm(x.title).startsWith(t) || t.startsWith(norm(x.title)));
      if (!m && d) m = minis.find((x) => Math.abs((new Date(x.date) - new Date(d)) / 864e5) <= 3);
      if (!m) { out.other.push({ title: key.slice(2), ...rec(c) }); out.anomalies.push(`mini not matched: ${key}`); continue; }
      out.minis[m.id] = { title: m.title, parent: m.parent, ...rec(c) };
    } else {
      out.other.push({ title: key.replace(/^T:/i, ''), ...rec(c) });
    }
  }
  out.episodes = Object.fromEntries(Object.entries(out.episodes).sort((a, b) => +a[0] - +b[0]));
  const sum = (arr) => arr.reduce((a, x) => a + (x.plays || 0), 0);
  out.totals = { episodes: Object.keys(out.episodes).length, minis: Object.keys(out.minis).length, episode_plays: sum(Object.values(out.episodes)), mini_plays: sum(Object.values(out.minis)), other_plays: sum(out.other) };
  const dest = path.join(OUT, `${name}.json`);
  fs.writeFileSync(dest, JSON.stringify(out, null, 1) + '\n');
  return { name, totals: out.totals, anomalies: out.anomalies.length };
}

function main() {
  const minisFile = path.join(ROOT, 'index', 'minis.json');
  const minisRaw = fs.existsSync(minisFile) ? JSON.parse(fs.readFileSync(minisFile, 'utf8')) : [];
  const minis = Array.isArray(minisRaw) ? minisRaw : (minisRaw.minis || []);
  if (!fs.existsSync(IN)) return console.log('analytics-apple: no imports');
  fs.mkdirSync(OUT, { recursive: true });
  const files = fs.readdirSync(IN).filter((f) => f.endsWith('.txt')).sort();
  for (const f of files) {
    const r = convert(path.join(IN, f), minis);
    console.log(`analytics-apple: ${r.name} → ${r.totals.episodes} episodes / ${r.totals.minis} minis, ${r.totals.episode_plays} episode plays${r.anomalies ? `, ${r.anomalies} note(s)` : ''}`);
  }
}

main();

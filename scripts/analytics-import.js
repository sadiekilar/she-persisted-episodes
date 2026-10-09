#!/usr/bin/env node
// Hand-kept history: analytics/imports/lifetime-tracker-monthly.csv is Sadie's monthly tracker
// (RSS downloads + YouTube views per month, Apr 2019 onward) from before and during the earlier hosts.
// It is the source of truth for show-level history up to FLIGHTCAST_FROM; Flightcast imported that same
// history, so Flightcast figures are only used from FLIGHTCAST_FROM on — never added on top.
//   -> analytics/show-monthly.json, index/analytics-show.json
const fs = require('fs');
const path = require('path');
const { INDEX_DIR } = require('./lib');

const ROOT = path.join(__dirname, '..');
// Hosting: Spotify for Podcasters/Creators until the move to Flightcast on 2026-07-15, which imported the
// Spotify-era history. The tracker is the monthly record through its last filled month; Flightcast's monthly
// numbers take over from the month after that. Neither is ever added to the other.
const HOSTING = [{ host: 'spotify for podcasters', until: '2026-07-14' }, { host: 'flightcast', from: '2026-07-15', note: 'imported the Spotify-era history' }];
const FLIGHTCAST_FROM = '2026-05'; // first month the tracker does not cover; monthly figures come from Flightcast from here
const MONTHS = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
const num = (s) => { const t = String(s || '').replace(/[",\s]/g, ''); return t === '' ? null : +t; };

function parseCsv(text) {
  const rows = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const cells = []; let cur = '', q = false;
    for (const ch of line) { if (ch === '"') q = !q; else if (ch === ',' && !q) { cells.push(cur); cur = ''; } else cur += ch; }
    cells.push(cur); rows.push(cells);
  }
  return rows;
}

const file = path.join(ROOT, 'analytics', 'imports', 'lifetime-tracker-monthly.csv');
const rows = parseCsv(fs.readFileSync(file, 'utf8')).slice(1); // TIMEPERIOD,,,Quarterly,Annual,RSS,YouTube,SUM,TOTAL
// the year sits on the December row of each year; months run upward to it
const out = [];
let pending = [];
for (const r of rows) {
  const [year, , mon, , , rss, yt, sum] = r;
  if (!MONTHS[mon]) continue;
  pending.push({ mon, rss: num(rss), youtube: num(yt), total: num(sum) });
  if (year) { for (const p of pending) out.push({ month: `${year}-${String(MONTHS[p.mon]).padStart(2, '0')}`, ...p }); pending = []; }
}
if (pending.length) { const last = out[out.length - 1]; const y = +last.month.slice(0, 4) + 1; for (const p of pending) out.push({ month: `${y}-${String(MONTHS[p.mon]).padStart(2, '0')}`, ...p }); }
const months = out.filter((m) => m.rss != null || m.youtube != null).map(({ mon, ...m }) => ({ ...m, source: m.month < FLIGHTCAST_FROM ? 'tracker' : 'flightcast' }));
fs.mkdirSync(path.join(ROOT, 'analytics'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'analytics', 'show-monthly.json'), JSON.stringify({ generatedAt: new Date().toISOString(), hosting: HOSTING, tracker_through: months[months.length - 1].month, flightcast_monthly_from: FLIGHTCAST_FROM, months }, null, 1));
const by = (len) => { const g = {}; for (const m of months) { const k = m.month.slice(0, len); g[k] = g[k] || { rss: 0, youtube: 0, total: 0 }; g[k].rss += m.rss || 0; g[k].youtube += m.youtube || 0; g[k].total += m.total || 0; } return g; };
const years = by(4);
const lifetime = months.reduce((a, m) => ({ rss: a.rss + (m.rss || 0), youtube: a.youtube + (m.youtube || 0), total: a.total + (m.total || 0) }), { rss: 0, youtube: 0, total: 0 });
fs.writeFileSync(path.join(INDEX_DIR, 'analytics-show.json'), JSON.stringify({ generatedAt: new Date().toISOString(), hosting: HOSTING, note: 'show-level monthly history from the hand-kept tracker (RSS downloads + YouTube views) through ' + months[months.length - 1].month + '; Flightcast monthly figures from ' + FLIGHTCAST_FROM + '; Flightcast imported the Spotify-era history, so its lifetime totals overlap the tracker and are never added to it', first: months[0].month, last: months[months.length - 1].month, lifetime, years, months }, null, 1));
console.log(`analytics-import: ${months.length} months ${months[0].month}..${months[months.length - 1].month}; lifetime rss ${lifetime.rss.toLocaleString()}, youtube ${lifetime.youtube.toLocaleString()}, total ${lifetime.total.toLocaleString()}`);

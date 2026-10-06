#!/usr/bin/env node
// Pull-quote emphasis, decided by hand. build-index.js writes index/quotes-emphasis.md with
// every approved quote in lowercase; capitalise the words to emphasise, commit, and this
// script copies the result into the episode's quote_display. Lines without any CAPS are left alone.
const fs = require('fs');
const path = require('path');
const { INDEX_DIR, readEpisodes, writeEpisode } = require('./lib');

const file = path.join(INDEX_DIR, 'quotes-emphasis.md');
if (!fs.existsSync(file)) { console.log('apply-emphasis: no file yet'); process.exit(0); }
const byNumber = new Map(readEpisodes().map((e) => [e.meta.number, e]));
let applied = 0;
for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
  const m = /^- (\d+): (.*)$/.exec(line);
  if (!m) continue;
  const ep = byNumber.get(+m[1]);
  const text = m[2].trim();
  if (!ep || !ep.meta.quotes_approved || !text) continue;
  const hasCaps = /\b[A-Z][A-Z'’-]+\b/.test(text);
  const next = hasCaps ? text : '';
  if (text.toLowerCase().replace(/\s+/g, ' ') !== String(ep.meta.quote).toLowerCase().replace(/\s+/g, ' ')) continue; // quote changed since; skip
  if ((ep.meta.quote_display || '') !== next) { writeEpisode(ep.file, { ...ep.meta, quote_display: next }, ep.body); applied++; }
}
console.log(`apply-emphasis: ${applied} quotes updated`);

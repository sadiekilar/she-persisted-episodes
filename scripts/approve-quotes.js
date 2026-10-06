#!/usr/bin/env node
// Pull quotes go live only after approval. build-index.js writes index/quotes-review.md
// with a checkbox per candidate quote; tick one ("- [x]") and commit, and this script
// copies it into the episode's front matter as `quote` with quotes_approved: true.
// Ticking "- [x] none" marks the episode approved with no quote (band omitted).
const fs = require('fs');
const path = require('path');
const { INDEX_DIR, readEpisodes, writeEpisode } = require('./lib');

const file = path.join(INDEX_DIR, 'quotes-review.md');
if (!fs.existsSync(file)) { console.log('approve-quotes: no review file yet'); process.exit(0); }
const md = fs.readFileSync(file, 'utf8');
const byNumber = new Map(readEpisodes().map((e) => [e.meta.number, e]));
let current = null, applied = 0;
for (const line of md.split('\n')) {
  const h = /^## (\d+)\./.exec(line);
  if (h) { current = byNumber.get(+h[1]) || null; continue; }
  const tick = /^- \[[xX]\] (.*)$/.exec(line);
  if (!tick || !current) continue;
  const text = tick[1].trim();
  const quote = /^none\b/i.test(text) ? '' : text.replace(/^[“"]|[”"]$/g, '');
  const meta = { ...current.meta, quote, quotes_approved: true };
  if (JSON.stringify(meta) !== JSON.stringify(current.meta)) { writeEpisode(current.file, meta, current.body); applied++; }
  current = null; // first ticked box wins
}
console.log(`approve-quotes: ${applied} episodes updated`);

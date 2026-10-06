#!/usr/bin/env node
// Pull quotes go live only after approval. Candidates are listed with a checkbox per
// quote in two places: the GitHub issue "pull quotes awaiting approval" (clickable boxes,
// kept up to date by quotes-issue.js) and index/quotes-review.md (edit the file). Tick
// one per episode and this script copies it into the episode's front matter as `quote`
// with quotes_approved: true. Ticking "none" approves the episode with no quote.
const fs = require('fs');
const path = require('path');
const { INDEX_DIR, readEpisodes, writeEpisode } = require('./lib');
const { findQuotesIssue } = require('./github');

function applyTicks(md, byNumber) {
  let current = null, applied = 0;
  for (const line of md.split('\n')) {
    const h = /^#+ (\d+)\./.exec(line);
    if (h) { current = byNumber.get(+h[1]) || null; continue; }
    const tick = /^\s*[-*] \[\s*[xX]\s*\] (.*)$/.exec(line);
    if (!tick || !current) continue;
    const text = tick[1].trim();
    const quote = /^none\b/i.test(text) ? '' : text.replace(/^[\u201c"]|[\u201d"]$/g, '');
    const meta = { ...current.meta, quote, quotes_approved: true };
    if (JSON.stringify(meta) !== JSON.stringify(current.meta)) { writeEpisode(current.file, meta, current.body); applied++; }
    current = null; // first ticked box wins
  }
  return applied;
}

async function main() {
  const byNumber = new Map(readEpisodes().map((e) => [e.meta.number, e]));
  let applied = 0;
  const file = path.join(INDEX_DIR, 'quotes-review.md');
  if (fs.existsSync(file)) applied += applyTicks(fs.readFileSync(file, 'utf8'), byNumber);
  try {
    const issue = await findQuotesIssue();
    if (issue && issue.body) applied += applyTicks(issue.body, byNumber);
  } catch (err) { console.error(`approve-quotes: issue read failed: ${err.message}`); }
  console.log(`approve-quotes: ${applied} episodes updated`);
}

main().catch((err) => { console.error(err); process.exit(1); });

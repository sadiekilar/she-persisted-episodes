#!/usr/bin/env node
// Keeps the GitHub issue "pull quotes awaiting approval" in sync with index/quotes-review.md
// so quotes can be approved by clicking checkboxes (no file editing). Runs in the workflow.
const fs = require('fs');
const path = require('path');
const { INDEX_DIR } = require('./lib');
const { gh, TOKEN, REPO, QUOTES_LABEL, QUOTES_TITLE, findQuotesIssue } = require('./github');

const MAX_EPISODES = 60; // GitHub caps issue bodies at 65k characters; the rest queue up

async function main() {
  if (!TOKEN || !REPO) return console.log('quotes-issue: not in GitHub Actions; skipping');
  const file = path.join(INDEX_DIR, 'quotes-review.md');
  const md = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  const sections = md.split(/\n(?=## )/).filter((s) => /^## \d+\./.test(s));
  const shown = sections.slice(0, MAX_EPISODES).map((s) => s.replace(/^## /, '### ').trim());
  const body = sections.length
    ? `Tick **one** box per episode: the quote to show on its page, or **none** for no quote. Ticks are applied by the nightly refresh (or run it from the Actions tab), and approved episodes disappear from this list.\n\n${sections.length} episodes waiting${sections.length > MAX_EPISODES ? ` (showing the first ${MAX_EPISODES})` : ''}.\n\n${shown.join('\n\n')}`
    : 'Nothing waiting. New episodes appear here after their summaries are generated.';
  const issue = await findQuotesIssue();
  if (issue) {
    if (issue.body !== body) await gh('PATCH', `/repos/${REPO}/issues/${issue.number}`, { body });
    console.log(`quotes-issue: updated #${issue.number} (${sections.length} waiting)`);
  } else {
    try { await gh('POST', `/repos/${REPO}/labels`, { name: QUOTES_LABEL, color: '740000', description: 'pull quote approval' }); } catch (e) { /* exists */ }
    const created = await gh('POST', `/repos/${REPO}/issues`, { title: QUOTES_TITLE, body, labels: [QUOTES_LABEL] });
    console.log(`quotes-issue: created #${created.number}`);
  }
}

main().catch((err) => { console.error(err); process.exit(1); });

#!/usr/bin/env node
// Tags kept in this repo, on top of Squarespace's:
//  - tags_override: suggested for episodes that have no Squarespace tags (Squarespace wins once it has any)
//  - tags_extra: site-only tags (EXTRA) proposed per episode from its summary, added to the Squarespace tags
//  - HIDDEN: Squarespace tags not shown on the site
// Suggestions come from the Claude API; index/tags-review.md lists everything and is read back, so edits there win.
//   ANTHROPIC_API_KEY=… node scripts/tags.js [--limit N]
const fs = require('fs');
const path = require('path');
const { INDEX_DIR, readEpisodes, writeEpisode, sleep } = require('./lib');

const MODEL = process.env.SUMMARY_MODEL || 'claude-sonnet-4-5';
const NOT_TOPICS = new Set(['sadie recommends']);
const HIDDEN = ['teen mental health', 'sleep'];
const EXTRA = {
  'therapy & treatment': 'finding or doing therapy, what treatment (inpatient, residential, DBT programs, medication) is like, getting help',
  parents: 'aimed at parents or about the parent/child relationship, supporting a child, family perspectives',
};
const reviewFile = path.join(INDEX_DIR, 'tags-review.md');
const shortTitle = (m) => m.title.replace(/^\d+[.:]\s*/, '').slice(0, 70);

function readReview(byNumber) {
  if (!fs.existsSync(reviewFile)) return 0;
  let applied = 0;
  for (const line of fs.readFileSync(reviewFile, 'utf8').split('\n')) {
    const extra = /^- (\d+)\. .*? \+ (.*)$/.exec(line);
    if (extra) {
      const ep = byNumber.get(+extra[1]);
      const tags = extra[2].split(',').map((t) => t.trim().toLowerCase()).filter((t) => t in EXTRA);
      if (ep && JSON.stringify(tags) !== JSON.stringify(ep.meta.tags_extra || [])) {
        writeEpisode(ep.file, { ...ep.meta, tags_extra: tags, tags_extra_checked: true }, ep.body);
        ep.meta.tags_extra = tags; ep.meta.tags_extra_checked = true; applied++;
      }
      continue;
    }
    const m = /^- (\d+)\. .*?→\s*(.*)$/.exec(line) || /^- (\d+):\s*(.*)$/.exec(line);
    if (!m) continue;
    const ep = byNumber.get(+m[1]);
    if (!ep) continue;
    const tags = m[2].split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
    if (JSON.stringify(tags) !== JSON.stringify(ep.meta.tags_override || [])) {
      writeEpisode(ep.file, { ...ep.meta, tags_override: tags, tags_source: 'edited' }, ep.body);
      ep.meta.tags_override = tags; ep.meta.tags_source = 'edited'; applied++;
    }
  }
  return applied;
}

async function ask(system, user, key) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: MODEL, max_tokens: 200, system, messages: [{ role: 'user', content: user }] }),
  });
  if (!res.ok) throw new Error(`Claude API ${res.status}`);
  const data = await res.json();
  const text = (data.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('');
  const m = /\[[\s\S]*\]/.exec(text);
  return (m ? JSON.parse(m[0]) : []).map((t) => String(t).toLowerCase().trim());
}
const describe = (ep) => `title: ${ep.meta.title}\nsummary: ${ep.meta.summary || ep.meta.excerpt || ''}\ntopics: ${(ep.meta.talk_about || []).join('; ')}`;

async function suggest(ep, tagList, key) {
  const out = await ask(`You tag podcast episodes. Choose 1 to 3 tags from this list only, best fit first: ${tagList.join(', ')}. Return only a JSON array of strings.`, describe(ep), key);
  return out.filter((t) => tagList.includes(t)).slice(0, 3);
}
async function suggestExtra(ep, key) {
  const out = await ask(`Decide which of these tags apply to a podcast episode. Tags: ${Object.entries(EXTRA).map(([t, d]) => `"${t}" = ${d}`).join('; ')}. Apply a tag only when the episode is substantially about it. Return only a JSON array of the applicable tag names, possibly empty.`, describe(ep), key);
  return out.filter((t) => t in EXTRA);
}

function writeReview(episodes) {
  const rows = episodes.filter((e) => (e.meta.tags_override || []).length || !(e.meta.tags || []).length);
  const extras = episodes.filter((e) => (e.meta.tags_extra || []).length);
  const available = [...new Set(episodes.flatMap((e) => e.meta.tags || []))].filter((t) => !NOT_TOPICS.has(t) && !HIDDEN.includes(t)).sort();
  fs.writeFileSync(reviewFile, `# tags kept in this repo

Hidden on the site (still in Squarespace): ${HIDDEN.join(', ')}.

## added tags (on top of the Squarespace tags)

${Object.keys(EXTRA).join(', ')} are site-only tags, proposed per episode from its summary. Edit the tags after the "+" and commit to change one; leave it empty to remove them.

${extras.map((e) => `- ${e.meta.number}. ${shortTitle(e.meta)} + ${e.meta.tags_extra.join(', ')}`).join('\n') || 'none yet'}

## tags for episodes that have none in Squarespace

Squarespace's own tags always win when a post has any. Available tags: ${available.join(', ')}.

${rows.map((e) => `- ${e.meta.number}. ${shortTitle(e.meta)} → ${(e.meta.tags_override || []).join(', ')}`).join('\n')}
`);
  return { rows: rows.length, extras: extras.length };
}

async function main() {
  const li = process.argv.indexOf('--limit');
  const limit = li > -1 ? parseInt(process.argv[li + 1], 10) : Infinity;
  const episodes = readEpisodes();
  const byNumber = new Map(episodes.map((e) => [e.meta.number, e]));
  const edited = readReview(byNumber);
  const key = process.env.ANTHROPIC_API_KEY;
  const tagList = [...new Set(episodes.flatMap((e) => e.meta.tags || []))].filter((t) => !NOT_TOPICS.has(t) && !HIDDEN.includes(t)).sort();

  const todo = episodes.filter((e) => !(e.meta.tags || []).length && !(e.meta.tags_override || []).length).slice(0, limit);
  let done = 0;
  if (todo.length && !key) console.log(`tags: ${todo.length} untagged episodes but ANTHROPIC_API_KEY is not set; skipping suggestions`);
  else for (const ep of todo) {
    try {
      const tags = await suggest(ep, tagList, key);
      if (tags.length) { writeEpisode(ep.file, { ...ep.meta, tags_override: tags, tags_source: 'suggested' }, ep.body); ep.meta.tags_override = tags; done++; }
    } catch (err) { console.error(`tags ${ep.meta.number}: ${err.message}`); }
    await sleep(200);
  }

  const extraTodo = episodes.filter((e) => e.meta.summary && !e.meta.tags_extra_checked).slice(0, limit);
  let extraDone = 0;
  if (extraTodo.length && !key) console.log(`tags: ${extraTodo.length} episodes to check for added tags but ANTHROPIC_API_KEY is not set`);
  else for (const ep of extraTodo) {
    try {
      const t = await suggestExtra(ep, key);
      writeEpisode(ep.file, { ...ep.meta, tags_extra: t, tags_extra_checked: true }, ep.body);
      ep.meta.tags_extra = t; ep.meta.tags_extra_checked = true; extraDone++;
    } catch (err) { console.error(`tags extra ${ep.meta.number}: ${err.message}`); }
    await sleep(200);
  }

  const listed = writeReview(episodes);
  console.log(`tags: ${edited} edited from the review file, ${done} suggested, ${extraDone} checked for added tags; ${listed.extras} with added tags, ${listed.rows} untagged listed in index/tags-review.md`);
}

main().catch((err) => { console.error(err); process.exit(1); });

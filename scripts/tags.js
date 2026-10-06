#!/usr/bin/env node
// Tag overrides for episodes with no Squarespace tags. Suggestions come from the Claude
// API (chosen from the show's existing tags); they're written to `tags_override` and
// listed in index/tags-review.md, which is also read back so edits there win.
//   ANTHROPIC_API_KEY=… node scripts/tags.js [--limit N]
// Squarespace tags, when present, always take precedence; the override only fills gaps.
const fs = require('fs');
const path = require('path');
const { INDEX_DIR, readEpisodes, writeEpisode, sleep } = require('./lib');

const MODEL = process.env.SUMMARY_MODEL || 'claude-sonnet-4-5';
const NOT_TOPICS = new Set(['sadie recommends']);
const reviewFile = path.join(INDEX_DIR, 'tags-review.md');

function readReview(byNumber) {
  if (!fs.existsSync(reviewFile)) return 0;
  let applied = 0;
  for (const line of fs.readFileSync(reviewFile, 'utf8').split('\n')) {
    const m = /^- (\d+)\. .*?→\s*(.*)$/.exec(line) || /^- (\d+):\s*(.*)$/.exec(line);
    if (!m) continue;
    const ep = byNumber.get(+m[1]);
    if (!ep) continue;
    const tags = m[2].split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
    if (JSON.stringify(tags) !== JSON.stringify(ep.meta.tags_override || [])) {
      writeEpisode(ep.file, { ...ep.meta, tags_override: tags, tags_source: 'edited' }, ep.body);
      ep.meta.tags_override = tags; ep.meta.tags_source = 'edited';
      applied++;
    }
  }
  return applied;
}

async function suggest(ep, tagList, key) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: MODEL, max_tokens: 200,
      system: `You tag podcast episodes. Choose 1 to 3 tags from this list only, best fit first: ${tagList.join(', ')}. Return only a JSON array of strings.`,
      messages: [{ role: 'user', content: `title: ${ep.meta.title}\nsummary: ${ep.meta.summary || ep.meta.excerpt || ''}\ntopics: ${(ep.meta.talk_about || []).join('; ')}` }],
    }),
  });
  if (!res.ok) throw new Error(`Claude API ${res.status}`);
  const data = await res.json();
  const text = (data.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('');
  const m = /\[[\s\S]*\]/.exec(text);
  const out = m ? JSON.parse(m[0]) : [];
  return out.map((t) => String(t).toLowerCase().trim()).filter((t) => tagList.includes(t)).slice(0, 3);
}

function writeReview(episodes) {
  const rows = episodes.filter((e) => (e.meta.tags_override || []).length || !(e.meta.tags || []).length);
  fs.writeFileSync(reviewFile, `# tags for episodes that have none in Squarespace

These tags exist only in this repo (the episodes page and archive use them); Squarespace's own tags always win when a post has any. To change one, edit the tags after the arrow and commit; the next refresh applies it. Available tags: ${[...new Set(episodes.flatMap((e) => e.meta.tags || []))].filter((t) => !NOT_TOPICS.has(t)).sort().join(', ')}.

${rows.map((e) => `- ${e.meta.number}. ${e.meta.title.replace(/^\d+[.:]\s*/, '').slice(0, 70)} → ${(e.meta.tags_override || []).join(', ')}`).join('\n')}
`);
  return rows.length;
}

async function main() {
  const li = process.argv.indexOf('--limit');
  const limit = li > -1 ? parseInt(process.argv[li + 1], 10) : Infinity;
  const episodes = readEpisodes();
  const byNumber = new Map(episodes.map((e) => [e.meta.number, e]));
  const edited = readReview(byNumber);
  const tagList = [...new Set(episodes.flatMap((e) => e.meta.tags || []))].filter((t) => !NOT_TOPICS.has(t)).sort();
  const todo = episodes.filter((e) => !(e.meta.tags || []).length && !(e.meta.tags_override || []).length).slice(0, limit);
  const key = process.env.ANTHROPIC_API_KEY;
  let done = 0;
  if (todo.length && !key) console.log(`tags: ${todo.length} untagged episodes but ANTHROPIC_API_KEY is not set; skipping suggestions`);
  else for (const ep of todo) {
    try {
      const tags = await suggest(ep, tagList, key);
      if (tags.length) { writeEpisode(ep.file, { ...ep.meta, tags_override: tags, tags_source: 'suggested' }, ep.body); ep.meta.tags_override = tags; done++; }
    } catch (err) { console.error(`tags ${ep.meta.number}: ${err.message}`); }
    await sleep(200);
  }
  const listed = writeReview(episodes);
  console.log(`tags: ${edited} edited from the review file, ${done} suggested, ${listed} listed in index/tags-review.md`);
}

main().catch((err) => { console.error(err); process.exit(1); });

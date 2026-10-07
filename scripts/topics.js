#!/usr/bin/env node
// Topics for episodes whose post has no "we talk about" list but whose description says what
// was covered in prose ("We discuss X, Y, and Z…"): the Claude API turns that sentence into a
// short list of chapter titles, written to talk_about so chapters.js can align them.
// index/topics-review.md lists every result and is read back first, so edits there win and
// an episode is only asked about once.
//   ANTHROPIC_API_KEY=… node scripts/topics.js [--limit N]
const fs = require('fs');
const path = require('path');
const { INDEX_DIR, readEpisodes, writeEpisode, htmlToText, sleep } = require('./lib');

const MODEL = process.env.SUMMARY_MODEL || 'claude-sonnet-4-5';
const reviewFile = path.join(INDEX_DIR, 'topics-review.md');
const COVERS = /\b(discuss|talk(ed)? about|cover|dive into|share|explain|answer|walk through|break down|unpack)\w*\b/i;
const shortTitle = (m) => m.title.replace(/^\d+[.:]\s*/, '').slice(0, 70);
const text = (m) => htmlToText(m.description_html || '').replace(/\s+/g, ' ').trim();

function readReview() {
  const out = new Map();
  if (!fs.existsSync(reviewFile)) return out;
  for (const line of fs.readFileSync(reviewFile, 'utf8').split('\n')) {
    const m = /^- (\d+)\. .*? → (.*)$/.exec(line);
    if (!m) continue;
    const topics = m[2].trim().toLowerCase() === 'none' ? [] : m[2].split(';').map((t) => t.trim()).filter(Boolean);
    out.set(+m[1], topics);
  }
  return out;
}

async function ask(ep, key) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: MODEL, max_tokens: 400,
      system: 'A podcast episode description says in prose what the episode covers. Turn that into the list of topics, in the order mentioned: 3 to 10 short chapter titles, lowercase, each a phrase lifted from the description (never a topic the description does not mention; never the guest bio or the host\'s outro). Return only a JSON array of strings; return [] if the description does not say what is covered.',
      messages: [{ role: 'user', content: `title: ${ep.meta.title}\ndescription: ${text(ep.meta)}` }],
    }),
  });
  if (!res.ok) throw new Error(`Claude API ${res.status}`);
  const data = await res.json();
  const out = (data.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('');
  const m = /\[[\s\S]*\]/.exec(out);
  return (m ? JSON.parse(m[0]) : []).map((t) => String(t).trim().replace(/[.;]+$/, '')).filter((t) => t && t.length <= 120).slice(0, 10);
}

function writeReview(rows) {
  rows.sort((a, b) => b.number - a.number);
  fs.writeFileSync(reviewFile, `# topics taken from the description

For posts with no "we talk about" list, these chapter titles were read out of the description's "we discuss…" sentence. Edit the list after the arrow (separate topics with ";", or write "none") and commit; chapters.js aligns them to the transcript.

${rows.map((r) => `- ${r.number}. ${r.title} → ${r.topics.length ? r.topics.join('; ') : 'none'}`).join('\n')}
`);
}

async function main() {
  const li = process.argv.indexOf('--limit');
  const limit = li > -1 ? parseInt(process.argv[li + 1], 10) : Infinity;
  const episodes = readEpisodes();
  const review = readReview();
  let edited = 0;
  for (const ep of episodes) {
    if (!review.has(ep.meta.number)) continue;
    const topics = review.get(ep.meta.number);
    // a list in the post always wins; a review entry only fills or replaces a description-derived one
    if (JSON.stringify(topics) !== JSON.stringify(ep.meta.talk_about || []) && (!(ep.meta.talk_about || []).length || review.get(ep.meta.number).length)) {
      writeEpisode(ep.file, { ...ep.meta, talk_about: topics }, ep.body); ep.meta.talk_about = topics; edited++;
    }
  }
  const todo = episodes.filter((e) => !(e.meta.talk_about || []).length && !review.has(e.meta.number) && COVERS.test(text(e.meta))).slice(0, limit);
  const key = process.env.ANTHROPIC_API_KEY;
  let done = 0;
  if (todo.length && !key) console.log(`topics: ${todo.length} episodes could get topics from their description but ANTHROPIC_API_KEY is not set; skipping`);
  else for (const ep of todo) {
    try {
      const topics = await ask(ep, key);
      review.set(ep.meta.number, topics);
      if (topics.length) { writeEpisode(ep.file, { ...ep.meta, talk_about: topics }, ep.body); ep.meta.talk_about = topics; }
      done++;
    } catch (err) { console.error(`topics ${ep.meta.number}: ${err.message}`); }
    await sleep(200);
  }
  const rows = [...review.entries()].map(([number, topics]) => { const ep = episodes.find((e) => e.meta.number === number); return ep ? { number, title: shortTitle(ep.meta), topics } : null; }).filter(Boolean);
  if (rows.length) writeReview(rows);
  console.log(`topics: ${edited} edited from the review file, ${done} read from descriptions, ${rows.length} listed in index/topics-review.md`);
}

main().catch((err) => { console.error(err); process.exit(1); });

#!/usr/bin/env node
// Summaries, guests and key quotes via the Claude API, written back into front matter.
// Runs only on episodes that have no `summary` yet.
//   ANTHROPIC_API_KEY=… node scripts/summarize.js [--limit N]
const { readEpisodes, writeEpisode, sleep } = require('./lib');

const MODEL = process.env.SUMMARY_MODEL || 'claude-sonnet-4-5';
const MAX_CHARS = 150000;

const SYSTEM = `You write archive metadata for "she persisted", a gen z mental health podcast hosted by sadie sutton. The audience is women 15–25. Write in the show's voice: all lowercase, plain, warm, no hype.

Return only a JSON object with these keys:
- "summary": 3–5 sentences on what the episode covers and what a listener takes away. Be specific (skills, topics, stories), not promotional.
- "guests": array of guest names in lowercase, with titles as the show writes them (e.g. "dr. blaise aguirre"). Empty array for a solo episode. Never include sadie.
- "key_quotes": 0–3 short verbatim quotes from the transcript worth citing. Empty array if there is no transcript or nothing stands out. Do not invent or paraphrase quotes.`;

async function summarize(ep, key) {
  const user = `title: ${ep.meta.title}\ndate: ${ep.meta.date}\ntags: ${(ep.meta.tags || []).join(', ')}\nexcerpt: ${ep.meta.excerpt || ''}\n\nshow notes and transcript:\n\n${ep.body.slice(0, MAX_CHARS)}`;
  for (let attempt = 1; ; attempt++) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: MODEL, max_tokens: 1024, system: SYSTEM, messages: [{ role: 'user', content: user }] }),
    });
    if ((res.status === 429 || res.status >= 500) && attempt < 5) { await sleep(5000 * attempt); continue; }
    if (!res.ok) throw new Error(`Claude API ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const data = await res.json();
    const text = (data.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('');
    const m = /\{[\s\S]*\}/.exec(text);
    if (!m) throw new Error('no JSON in response');
    const out = JSON.parse(m[0]);
    return {
      summary: String(out.summary || '').replace(/\s+/g, ' ').trim(),
      guests: (Array.isArray(out.guests) ? out.guests : []).map((g) => String(g).toLowerCase().trim()).filter(Boolean),
      key_quotes: (Array.isArray(out.key_quotes) ? out.key_quotes : []).map((q) => String(q).trim()).filter(Boolean).slice(0, 3),
    };
  }
}

async function main() {
  const li = process.argv.indexOf('--limit');
  const limit = li > -1 ? parseInt(process.argv[li + 1], 10) : Infinity;
  const todo = readEpisodes().filter((e) => !e.meta.summary).slice(0, limit);
  if (!todo.length) return console.log('summarize: nothing to do');
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return console.log(`summarize: ${todo.length} episodes need summaries but ANTHROPIC_API_KEY is not set; skipping`);

  const done = [];
  let failed = 0;
  for (const ep of todo) {
    try {
      const out = await summarize(ep, key);
      if (!out.summary) throw new Error('empty summary');
      writeEpisode(ep.file, { ...ep.meta, ...out }, ep.body);
      done.push({ title: ep.meta.title, ...out });
      console.log(`summarized ${ep.meta.number}`);
    } catch (err) {
      failed++;
      console.error(`failed ${ep.meta.number}: ${err.message}`);
    }
    await sleep(300);
  }

  // Print ~10% for a human spot check.
  const step = Math.max(1, Math.round(done.length / Math.max(1, Math.ceil(done.length / 10))));
  console.log(`\nsummarized ${done.length}, failed ${failed}. spot check:`);
  for (let i = 0; i < done.length; i += step) {
    const d = done[i];
    console.log(`\n${d.title}\n  guests: ${d.guests.join(', ') || '(solo)'}\n  summary: ${d.summary}\n  quotes: ${d.key_quotes.map((q) => `"${q}"`).join(' | ') || '(none)'}`);
  }
}

main().catch((err) => { console.error(err); process.exit(1); });

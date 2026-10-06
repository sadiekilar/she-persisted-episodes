#!/usr/bin/env node
// Chapters: aligns each "we/i talk about" bullet to the transcript timestamp where that
// topic starts, via the Claude API. Only for episodes whose transcript paragraphs carry
// timestamps and that have bullets but no chapters yet.
//   ANTHROPIC_API_KEY=… node scripts/chapters.js [--limit N]
const { readEpisodes, writeEpisode, sleep } = require('./lib');
const { transcriptParagraphs } = require('./transcript');

const MODEL = process.env.SUMMARY_MODEL || 'claude-sonnet-4-5';
const fmt = (t) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;

const SYSTEM = `You align podcast show-notes bullets to a timestamped transcript. For each bullet, find the paragraph where that topic genuinely begins. Return only a JSON array of objects {"title": <bullet, verbatim>, "t": <seconds, an integer taken from the paragraph timestamps>} in the order the topics occur in the episode. Chapters must have strictly increasing t; the first chapter may use t = 0 if its topic opens the episode. If a bullet never clearly starts anywhere, leave it out.`;

async function align(ep, paragraphs, key) {
  const lines = paragraphs.filter((p) => p.t != null).map((p) => `[${p.t}s ${fmt(p.t)}] ${p.text.slice(0, 400)}`).join('\n');
  const user = `bullets:\n${ep.meta.talk_about.map((b) => `- ${b}`).join('\n')}\n\ntranscript (timestamp in seconds, then text):\n${lines.slice(0, 180000)}`;
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: MODEL, max_tokens: 1500, system: SYSTEM, messages: [{ role: 'user', content: user }] }),
  });
  if (!res.ok) throw new Error(`Claude API ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  const text = (data.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('');
  const m = /\[[\s\S]*\]/.exec(text);
  if (!m) throw new Error('no JSON in response');
  const out = JSON.parse(m[0]).map((c) => ({ t: Math.max(0, Math.round(+c.t || 0)), title: String(c.title || '').trim() })).filter((c) => c.title);
  // sanity: monotonic, first at the start
  out.sort((a, b) => a.t - b.t);
  const dedup = out.filter((c, i) => !i || c.t > out[i - 1].t);
  if (dedup.length && dedup[0].t > 60) dedup[0].t = 0;
  return dedup;
}

async function main() {
  const li = process.argv.indexOf('--limit');
  const limit = li > -1 ? parseInt(process.argv[li + 1], 10) : Infinity;
  const todo = [];
  for (const ep of readEpisodes()) {
    if ((ep.meta.chapters || []).length || !(ep.meta.talk_about || []).length) continue;
    const paragraphs = transcriptParagraphs(ep.body);
    if (paragraphs.filter((p) => p.t != null).length < 5) continue;
    todo.push({ ep, paragraphs });
    if (todo.length >= limit) break;
  }
  if (!todo.length) return console.log('chapters: nothing to do');
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return console.log(`chapters: ${todo.length} episodes could get chapters but ANTHROPIC_API_KEY is not set; skipping`);
  let done = 0, failed = 0;
  for (const { ep, paragraphs } of todo) {
    try {
      const chapters = await align(ep, paragraphs, key);
      const need = Math.max(2, Math.ceil(ep.meta.talk_about.length / 2));
      if (chapters.length < need) throw new Error(`only ${chapters.length} of ${ep.meta.talk_about.length} bullets placed`);
      writeEpisode(ep.file, { ...ep.meta, chapters }, ep.body);
      done++;
      console.log(`chapters ${ep.meta.number}: ${chapters.map((c) => fmt(c.t)).join(', ')}`);
    } catch (err) {
      failed++;
      console.error(`failed ${ep.meta.number}: ${err.message}`);
    }
    await sleep(300);
  }
  console.log(`chapters: ${done} done, ${failed} failed`);
}

main().catch((err) => { console.error(err); process.exit(1); });

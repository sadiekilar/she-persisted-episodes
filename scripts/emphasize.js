#!/usr/bin/env node
// Pull-quote emphasis: for each approved quote, ask Claude which short phrase (2-5 words)
// carries the weight and write it back in CAPS as `quote_display`. The page renders CAPS
// words upright and uppercase, everything else lowercase italic. Edit quote_display to
// change the emphasis by hand; it is only generated when missing.
const { readEpisodes, writeEpisode, sleep } = require('./lib');
const MODEL = process.env.SUMMARY_MODEL || 'claude-sonnet-4-5';

async function pick(quote, key) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: MODEL, max_tokens: 200,
      system: 'You typeset pull quotes. Return the quote verbatim, all lowercase, except ONE phrase of 2 to 5 consecutive words written in CAPITALS: the phrase that carries the quote\'s weight. Never capitalise more than one phrase. Return only the quote.',
      messages: [{ role: 'user', content: quote }],
    }),
  });
  if (!res.ok) throw new Error(`Claude API ${res.status}`);
  const data = await res.json();
  const text = (data.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('').trim().replace(/^["“]|["”]$/g, '');
  // accept only if the words match the original (ignoring case)
  const norm = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim();
  if (norm(text) !== norm(quote)) throw new Error('rewrote the quote');
  if (!/\b[A-Z][A-Z'’-]+(\s+[A-Z][A-Z'’-]*){0,4}\b/.test(text)) throw new Error('no emphasis');
  return text;
}

async function main() {
  const todo = readEpisodes().filter((e) => e.meta.quotes_approved && e.meta.quote && !e.meta.quote_display);
  if (!todo.length) return console.log('emphasize: nothing to do');
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return console.log(`emphasize: ${todo.length} quotes need emphasis but ANTHROPIC_API_KEY is not set; skipping`);
  let done = 0, failed = 0;
  for (const ep of todo) {
    try {
      const display = await pick(ep.meta.quote, key);
      writeEpisode(ep.file, { ...ep.meta, quote_display: display }, ep.body);
      done++;
    } catch (err) { failed++; console.error(`emphasize ${ep.meta.number}: ${err.message}`); }
    await sleep(250);
  }
  console.log(`emphasize: ${done} done, ${failed} failed`);
}

main().catch((err) => { console.error(err); process.exit(1); });

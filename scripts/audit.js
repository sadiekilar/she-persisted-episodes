#!/usr/bin/env node
// Transcript quality flags → front matter `transcript_status` + index/backfill.md
// (the list of episodes to re-export from Descript).
const fs = require('fs');
const path = require('path');
const { INDEX_DIR, readEpisodes, writeEpisode, transcriptOf, wordCount } = require('./lib');

const MIN_WORDS = 2000;
const GUEST_TITLE = /\b(feat|ft)\b\.?/i;
const SPEAKER_LABEL = /^(\*\*[^*\n]{1,40}:\*\*|\*\*[^*\n]{1,40}\*\*:|[A-Za-z][A-Za-z .'’-]{1,30}:\s)/m;

function audit(ep) {
  const transcript = transcriptOf(ep.body);
  const words = wordCount(transcript);
  const flags = [];
  if (!transcript) flags.push('no transcript');
  else {
    if (words < MIN_WORDS) flags.push(`short (${words} words)`);
    const last = transcript.replace(/[\s*_]+$/, '').slice(-1);
    if (!/[.?!…"”'’)\]]/.test(last)) flags.push('ends mid-sentence');
    // Solo episodes have no labels to lose; only guest episodes need them.
    if (GUEST_TITLE.test(ep.meta.title) && !SPEAKER_LABEL.test(transcript)) flags.push('no speaker labels');
  }
  return { words, flags };
}

const episodes = readEpisodes();
const rows = [];
const tally = {};
for (const ep of episodes) {
  const { words, flags } = audit(ep);
  const status = !flags.length ? 'full' : flags[0] === 'no transcript' ? 'needs-descript' : words >= MIN_WORDS ? 'partial' : 'needs-descript';
  tally[status] = (tally[status] || 0) + 1;
  if (flags.length) rows.push({ ep, words, flags, status });
  const meta = { ...ep.meta, transcript_status: status, transcript_words: words, audit_flags: flags };
  if (JSON.stringify(meta) !== JSON.stringify(ep.meta)) writeEpisode(ep.file, meta, ep.body);
}

const need = rows.filter((r) => r.status === 'needs-descript');
const partial = rows.filter((r) => r.status === 'partial');
const table = (list) => list.length
  ? ['| episode | words | flags |', '| --- | ---: | --- |', ...list.map((r) => `| [${r.ep.meta.title.replace(/\|/g, '\\|')}](${r.ep.meta.original_url}) | ${r.words} | ${r.flags.join('; ')} |`)].join('\n')
  : 'none';
const out = `# transcript backfill

${episodes.length} episodes: ${tally.full || 0} full, ${partial.length} partial, ${need.length} needs-descript.

- **needs-descript**: no transcript on the post, or fewer than ${MIN_WORDS} words. Re-export from Descript, paste under \`## transcript\` in the episode file and set \`transcript_source: descript\`.
- **partial**: ${MIN_WORDS}+ words but ends mid-sentence or has no speaker labels. Usable for search and the Claude Project; worth a re-export when convenient.

## needs-descript (${need.length})

${table(need)}

## partial (${partial.length})

${table(partial)}
`;
fs.mkdirSync(INDEX_DIR, { recursive: true });
fs.writeFileSync(path.join(INDEX_DIR, 'backfill.md'), out);
console.log(`audit: ${tally.full || 0} full, ${partial.length} partial, ${need.length} needs-descript → index/backfill.md`);

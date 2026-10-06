#!/usr/bin/env node
// Transcript quality flags → front matter `transcript_status` + index/backfill.md
// (the list of episodes to re-export from Descript).
const fs = require('fs');
const path = require('path');
const { INDEX_DIR, readEpisodes, writeEpisode, transcriptOf, wordCount } = require('./lib');
const { transcriptParagraphs } = require('./transcript');

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
const complete = [];
const tally = {};
for (const ep of episodes) {
  const { words, flags } = audit(ep);
  const status = ep.meta.transcript_source === 'flightcast' && words >= 300 ? 'full' : !flags.length ? 'full' : flags[0] === 'no transcript' ? 'needs-descript' : words >= MIN_WORDS ? 'partial' : 'needs-descript';
  tally[status] = (tally[status] || 0) + 1;
  if (flags.length) rows.push({ ep, words, flags, status });
  // Episode-page completeness (template A needs all of these; anything missing → the page degrades per section).
  const paragraphs = transcriptParagraphs(ep.body);
  const stamped = paragraphs.filter((p) => p.t != null).length;
  const missing = [];
  if (!ep.meta.youtube_id) missing.push('youtube_id');
  if (status !== 'full') missing.push('transcript');
  else if (stamped < 5) missing.push('transcript_timestamps');
  if (!(ep.meta.chapters || []).length) missing.push('chapters');
  if (!ep.meta.apple_episode_url) missing.push('apple_episode_url');
  if (!ep.meta.spotify_episode_id && !ep.meta.creators_embed_url) missing.push('spotify_episode_id');
  const completeness = missing.length ? 'partial' : 'full';
  complete.push({ ep, completeness, missing });
  const meta = { ...ep.meta, transcript_status: status, transcript_words: words, audit_flags: flags, completeness, missing };
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
// index/completeness.md: what would unblock the most episode pages.
const full = complete.filter((c) => c.completeness === 'full');
const counts = {};
complete.forEach((c) => c.missing.forEach((m) => { counts[m] = (counts[m] || 0) + 1; }));
const why = { youtube_id: 'no YouTube video found for the episode (embed in the post, or a channel upload with the episode number in its title)', transcript: 'no full transcript on the post (see backfill.md)', transcript_timestamps: 'transcript has no timestamps, so paragraphs and chapters cannot seek the player (needs a timestamped Descript export)', chapters: 'no chapters yet (needs "we talk about" bullets plus a timestamped transcript, then chapters.js)', apple_episode_url: 'not in Apple\'s episode listing (Apple returns the newest 200 only)', spotify_episode_id: 'no Spotify or Spotify for Creators player embedded in the post' };
fs.writeFileSync(path.join(INDEX_DIR, 'completeness.md'), `# episode page completeness

${full.length} of ${complete.length} episodes have everything the full episode page uses. The rest render the fallback version, section by section: each missing field only removes or simplifies its own section.

## what would unblock the most pages

${Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([k, n]) => `- **${n} episodes** need \`${k}\`: ${why[k] || ''}`).join('\n') || 'nothing missing'}

## every episode

| episode | missing |
| --- | --- |
${complete.map((c) => `| [${c.ep.meta.number}](${c.ep.meta.original_url}) | ${c.missing.join(', ') || 'complete'} |`).join('\n')}
`);
console.log(`completeness: ${full.length} full → index/completeness.md`);
console.log(`audit: ${tally.full || 0} full, ${partial.length} partial, ${need.length} needs-descript → index/backfill.md`);

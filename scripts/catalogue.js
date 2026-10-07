#!/usr/bin/env node
// index/catalogue.md: the whole catalogue in one compact, plain-text file (one block per episode)
// meant for reading or for feeding to an assistant: number, title, date, link, tags, guests,
// summary, pull quote and chapter titles. Rebuilt nightly after build-index.
const fs = require('fs');
const path = require('path');
const { INDEX_DIR, readEpisodes, htmlToText } = require('./lib');

const HIDDEN_TAGS = ['teen mental health', 'sleep'];
const eps = readEpisodes().sort((a, b) => b.meta.number - a.meta.number);
const blocks = eps.map((e) => {
  const m = e.meta;
  const sq = (m.tags || []).filter((t) => !HIDDEN_TAGS.includes(t));
  const tags = [...new Set([...(sq.length ? sq : (m.tags_override || [])), ...(m.tags_extra || [])])].filter((t) => !HIDDEN_TAGS.includes(t));
  const desc = htmlToText(m.description_html || '').replace(/\s+/g, ' ').trim();
  const lines = [
    `## ${m.number}. ${m.title.replace(/^\d+[.:]\s*/, '')}`,
    `date: ${String(m.date || '').slice(0, 10)} | ${m.original_url} | ${m.duration_sec ? Math.round(m.duration_sec / 60) + ' min' : ''}${m.youtube_id ? ' | video' : ' | audio'}`,
    `tags: ${tags.join(', ') || '-'}`,
    (m.guests || []).length ? `guests: ${m.guests.join(', ')}` : 'solo',
    `summary: ${m.summary || desc || '-'}`,
  ];
  if (m.quote && m.quotes_approved) lines.push(`quote: ${m.quote}`);
  if ((m.chapters || []).length > 1) lines.push(`chapters: ${m.chapters.map((c) => c.title).join('; ')}`);
  return lines.join('\n');
});
const tagCounts = {};
eps.forEach((e) => (e.meta.tags || []).forEach((t) => { if (!HIDDEN_TAGS.includes(t)) tagCounts[t] = (tagCounts[t] || 0) + 1; }));
const out = `# she persisted — episode catalogue

${eps.length} episodes, newest first. Each block: title, date, link, length, tags, guests, summary, pull quote, chapter titles. Episode pages live at shepersistedpodcast.com/episodes/<slug>. Regenerated nightly.

tags: ${Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).map(([t, c]) => `${t} (${c})`).join(', ')}

${blocks.join('\n\n')}
`;
fs.writeFileSync(path.join(INDEX_DIR, 'catalogue.md'), out);
console.log(`catalogue: ${eps.length} episodes, ${Math.round(out.length / 1024)} KB -> index/catalogue.md`);

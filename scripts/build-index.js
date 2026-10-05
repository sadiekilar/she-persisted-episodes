#!/usr/bin/env node
// episodes/*.md → index/episodes.json (what the website reads, transcript-free)
// and index/summaries.md (Claude Project knowledge).
const fs = require('fs');
const path = require('path');
const { INDEX_DIR, readEpisodes } = require('./lib');

const EXCERPT_MAX = 300;
const clip = (s, n) => {
  s = String(s || '').replace(/\s+/g, ' ').trim();
  if (s.length <= n) return s;
  const cut = s.slice(0, n - 1);
  return cut.slice(0, Math.max(cut.lastIndexOf(' '), n - 40)).replace(/[\s,;:—–-]+$/, '') + '…';
};

const episodes = readEpisodes();

// Tag order comes from the Squarespace collection; fall back to most-used first.
let tags = [];
const collectionFile = path.join(INDEX_DIR, 'collection.json');
if (fs.existsSync(collectionFile)) tags = JSON.parse(fs.readFileSync(collectionFile, 'utf8')).tags || [];
const used = new Map();
for (const ep of episodes) for (const t of ep.meta.tags || []) used.set(t, (used.get(t) || 0) + 1);
tags = tags.filter((t) => used.has(t));
for (const t of [...used.keys()].sort((a, b) => used.get(b) - used.get(a))) if (!tags.includes(t)) tags.push(t);

const index = {
  tags,
  episodes: episodes.map(({ meta }) => ({
    number: meta.number,
    title: meta.title,
    url: meta.original_url,
    image: meta.image_url || '',
    tags: meta.tags || [],
    excerpt: clip(meta.excerpt, EXCERPT_MAX),
    publishOn: Number(meta.publish_on) || Date.parse(meta.date) || 0,
    guests: meta.guests || [],
    summary: meta.summary || '',
  })),
};

// Only bump generatedAt when the content changed, so the nightly job doesn't
// commit a no-op diff.
const indexFile = path.join(INDEX_DIR, 'episodes.json');
let generatedAt = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
if (fs.existsSync(indexFile)) {
  try {
    const { generatedAt: prevAt, ...prev } = JSON.parse(fs.readFileSync(indexFile, 'utf8'));
    if (prevAt && JSON.stringify(prev) === JSON.stringify(index)) generatedAt = prevAt;
  } catch { /* rewrite */ }
}
fs.mkdirSync(INDEX_DIR, { recursive: true });
const json = JSON.stringify({ generatedAt, ...index });
fs.writeFileSync(indexFile, json + '\n');

const blocks = episodes.map(({ meta }) => {
  const lines = [`## ${meta.title}`, '', `- date: ${meta.date}`, `- tags: ${(meta.tags || []).join(', ') || 'none'}`, `- guests: ${(meta.guests || []).join(', ') || (meta.summary ? 'none (solo)' : 'not extracted yet')}`, `- url: ${meta.original_url}`, `- transcript: episodes/ep-${String(meta.number).padStart(3, '0')}.md (${meta.transcript_status || 'unaudited'})`, '', meta.summary || meta.excerpt || ''];
  if ((meta.key_quotes || []).length) lines.push('', ...meta.key_quotes.map((q) => `> ${q}`));
  return lines.join('\n');
});
fs.writeFileSync(path.join(INDEX_DIR, 'summaries.md'), `# she persisted — episode summaries\n\n${episodes.length} episodes, newest first. Full transcripts live in \`episodes/ep-NNN.md\`.\n\n${blocks.join('\n\n')}\n`);

console.log(`index: ${episodes.length} episodes, ${tags.length} tags, episodes.json ${(Buffer.byteLength(json) / 1024).toFixed(0)} KB`);

#!/usr/bin/env node
// episodes/*.md → index/episodes.json (what the website reads, transcript-free)
// and index/summaries.md (Claude Project knowledge).
const fs = require('fs');
const path = require('path');
const { INDEX_DIR, readEpisodes, htmlToText } = require('./lib');
const { transcriptParagraphs } = require('./transcript');

const EXCERPT_MAX = 300;
const clip = (s, n) => {
  s = String(s || '').replace(/\s+/g, ' ').trim();
  if (s.length <= n) return s;
  const cut = s.slice(0, n - 1);
  return cut.slice(0, Math.max(cut.lastIndexOf(' '), n - 40)).replace(/[\s,;:—–-]+$/, '') + '…';
};

// Final tags: Squarespace tags (or the repo override when the post has none) plus site-only
// additions (tags_extra), minus tags hidden on the site. See scripts/tags.js.
const HIDDEN_TAGS = ['teen mental health', 'sleep'];
const episodes = readEpisodes().map((e) => {
  const base = (e.meta.tags || []).length ? e.meta.tags : (e.meta.tags_override || []);
  const tags = [...new Set([...base, ...(e.meta.tags_extra || [])])].filter((t) => !HIDDEN_TAGS.includes(t));
  e.meta = { ...e.meta, tags };
  return e;
});

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
    // Squarespace's excerpt field is sometimes a stub ("Today..."); fall back to the description, then the summary.
    excerpt: clip(String(meta.excerpt || '').length >= 60 ? meta.excerpt : (htmlToText(meta.description_html) || meta.summary || meta.excerpt), EXCERPT_MAX),
    publishOn: Number(meta.publish_on) || Date.parse(meta.date) || 0,
    guests: meta.guests || [],
    summary: meta.summary || '',
    youtube_id: meta.youtube_id || null,
    spotify_episode_id: meta.spotify_episode_id || null,
    apple_episode_url: meta.apple_episode_url || null,
    duration_sec: meta.duration_sec || null,
    slug: meta.slug,
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

// One small file per episode for the episode page: notes, links, chapters, transcript.
const epDir = path.join(INDEX_DIR, 'episodes');
fs.mkdirSync(epDir, { recursive: true });
const keep = new Set();
for (const ep of episodes) {
  const m = ep.meta;
  const paragraphs = transcriptParagraphs(ep.body);
  const name = `ep-${String(m.number).padStart(3, '0')}.json`;
  keep.add(name);
  const data = {
    number: m.number, title: m.title, slug: m.slug, url: m.original_url, date: m.date, tags: m.tags || [], image: m.image_url || '',
    description_html: m.description_html || '', talk_about: m.talk_about || [], mentioned_html: m.mentioned_html || '',
    guests: m.guests || [], summary: m.summary || '',
    youtube_id: m.youtube_id || null, spotify_episode_id: m.spotify_episode_id || null, creators_embed_url: m.creators_embed_url || null, apple_episode_url: m.apple_episode_url || null,
    audio_url: m.audio_url || null, duration_sec: m.duration_sec || null,
    quote: m.quotes_approved ? (m.quote || '') : '',
    quote_display: m.quotes_approved ? (m.quote_display || '') : '',
    chapters: m.chapters || [], shorts: m.shorts || [],
    transcript: { source: m.transcript_source || 'blog', status: m.transcript_status || '', paragraphs },
    completeness: m.completeness || 'partial', missing: m.missing || [],
  };
  const file = path.join(epDir, name);
  const json = JSON.stringify(data);
  if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== json + '\n') fs.writeFileSync(file, json + '\n');
}
for (const f of fs.readdirSync(epDir)) if (!keep.has(f)) fs.unlinkSync(path.join(epDir, f));

// Pull-quote emphasis: every approved quote, lowercase, for the owner to capitalise (apply-emphasis.js reads it back).
const approvedQuotes = episodes.filter(({ meta }) => meta.quotes_approved && meta.quote);
fs.writeFileSync(path.join(INDEX_DIR, 'quotes-emphasis.md'), `# pull quote emphasis

${approvedQuotes.length} approved quotes. Capitalise the words to emphasise (2 to 5 words, one phrase), commit, and the next refresh shows them upright in CAPS; the rest of the quote stays lowercase italic. A line with no CAPS shows the whole quote in italic. Don't change the words themselves here; edit the quote on the episode instead.

${approvedQuotes.map(({ meta }) => `- ${meta.number}: ${meta.quote_display || meta.quote}`).join('\n')}
`);

// Pull-quote review: one checkbox per candidate; approve-quotes.js reads the ticks.
const pending = episodes.filter(({ meta }) => (meta.key_quotes || []).length && !meta.quotes_approved);
fs.writeFileSync(path.join(INDEX_DIR, 'quotes-review.md'), `# pull quotes awaiting approval

${pending.length} episodes. Tick ONE box per episode (change \`[ ]\` to \`[x]\`), commit, and the next refresh puts that quote on the episode page. Tick "none" to approve the episode with no quote. Approved episodes drop off this list.

${pending.map(({ meta }) => `## ${meta.title}\n\n${meta.key_quotes.map((q) => `- [ ] ${q}`).join('\n')}\n- [ ] none`).join('\n\n')}
`);

console.log(`index: ${episodes.length} episodes, ${tags.length} tags, episodes.json ${(Buffer.byteLength(json) / 1024).toFixed(0)} KB`);

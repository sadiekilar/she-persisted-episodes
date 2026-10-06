// Shared helpers for the import / audit / summarize / build-index scripts.
// No dependencies; needs Node 20+ (global fetch).
const fs = require('fs');
const path = require('path');

const SITE = 'https://shepersistedpodcast.com';
const COLLECTION = '/episodes';
const ROOT = path.join(__dirname, '..');
const EPISODES_DIR = path.join(ROOT, 'episodes');
const INDEX_DIR = path.join(ROOT, 'index');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url, tries = 3) {
  for (let i = 1; ; i++) {
    try {
      const res = await fetch(url, { headers: { accept: 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (i >= tries) throw new Error(`${url}: ${err.message}`);
      await sleep(2000 * i);
    }
  }
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', hellip: '…', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”' };
function decodeEntities(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') {
      const code = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return ENTITIES[e.toLowerCase()] ?? m;
  });
}

function htmlToText(html) {
  return decodeEntities(String(html || '').replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function htmlToMarkdown(html) {
  let s = String(html || '');
  s = s.replace(/<(script|style|figure|iframe|noscript|svg|button|form)\b[\s\S]*?<\/\1>/gi, '');
  s = s.replace(/<!--[\s\S]*?-->/g, '');
  s = s.replace(/\r/g, '').replace(/\s*\n\s*/g, ' ');
  s = s.replace(/<br\s*\/?>/gi, '\n');
  const inline = (mark) => (m, tag, inner) => {
    const t = inner.trim();
    if (!t) return ' ';
    return (/^\s/.test(inner) ? ' ' : '') + mark + t + mark + (/\s$/.test(inner) ? ' ' : '');
  };
  s = s.replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, inline('**'));
  s = s.replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, inline('*'));
  s = s.replace(/<a\b[^>]*?href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (m, href, inner) => {
    const t = inner.replace(/<[^>]+>/g, '').trim();
    if (!t) return '';
    return /^(https?:|mailto:|\/)/.test(href) ? `[${t}](${href.startsWith('/') ? SITE + href : href})` : t;
  });
  s = s.replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (m, n, inner) => {
    const t = inner.replace(/<[^>]+>/g, '').replace(/\*\*/g, '').trim();
    return t ? `\n\n${'#'.repeat(Math.max(3, +n))} ${t}\n\n` : '\n\n';
  });
  s = s.replace(/<ol\b[^>]*>([\s\S]*?)<\/ol>/gi, (m, inner) => {
    let n = 0;
    return '\n\n' + inner.replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (m2, li) => `\n${++n}. ${li.replace(/<\/?p\b[^>]*>/gi, ' ').trim()}`) + '\n\n';
  });
  s = s.replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (m, li) => `\n- ${li.replace(/<\/?p\b[^>]*>/gi, ' ').trim()}`);
  s = s.replace(/<\/(p|div|ul|blockquote|section|article)>/gi, '\n\n');
  s = s.replace(/<[^>]+>/g, '');
  s = decodeEntities(s);
  return s.split('\n').map((l) => l.replace(/[ \t]+/g, ' ').trim()).join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

const wordCount = (s) => (String(s).match(/\S+/g) || []).length;

// Front matter: one `key: value` per line. Values are written as JSON (valid
// YAML) except bare numbers, dates and URLs, so parsing stays trivial.
const FIELD_ORDER = ['title', 'number', 'date', 'publish_on', 'slug', 'original_url', 'image_url', 'tags', 'guests', 'summary', 'key_quotes', 'quote', 'quotes_approved', 'excerpt', 'youtube_id', 'spotify_episode_id', 'apple_episode_url', 'audio_url', 'duration_sec', 'talk_about', 'chapters', 'shorts', 'description_html', 'mentioned_html', 'transcript_source', 'transcript_status', 'transcript_words', 'audit_flags', 'completeness', 'missing'];
const BARE = new Set(['number', 'date', 'publish_on', 'original_url', 'image_url', 'apple_episode_url', 'audio_url', 'duration_sec', 'youtube_id', 'spotify_episode_id', 'transcript_source', 'transcript_status', 'transcript_words', 'completeness']);

function parseEpisode(text) {
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(text);
  if (!m) throw new Error('missing front matter');
  const meta = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i < 1) continue;
    const key = line.slice(0, i).trim();
    const raw = line.slice(i + 1).trim();
    if (raw === '') { meta[key] = ''; continue; }
    try { meta[key] = JSON.parse(raw); } catch { meta[key] = raw; }
  }
  return { meta, body: m[2].replace(/^\n+/, '') };
}

function serializeEpisode(meta, body) {
  const keys = [...FIELD_ORDER.filter((k) => k in meta), ...Object.keys(meta).filter((k) => !FIELD_ORDER.includes(k))];
  const lines = keys.map((k) => {
    const v = meta[k];
    if (v === '' || v == null) return `${k}:`;
    return `${k}: ${BARE.has(k) ? v : JSON.stringify(v)}`;
  });
  return `---\n${lines.join('\n')}\n---\n\n${body.trim()}\n`;
}

const episodeFile = (n) => path.join(EPISODES_DIR, `ep-${String(n).padStart(3, '0')}.md`);

function readEpisodes() {
  if (!fs.existsSync(EPISODES_DIR)) return [];
  return fs.readdirSync(EPISODES_DIR).filter((f) => /^ep-\d+\.md$/.test(f)).map((f) => {
    const file = path.join(EPISODES_DIR, f);
    return { file, ...parseEpisode(fs.readFileSync(file, 'utf8')) };
  }).sort((a, b) => b.meta.number - a.meta.number);
}

function writeEpisode(file, meta, body) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, serializeEpisode(meta, body));
}

// Everything under the "## transcript" heading that import.js inserts.
function transcriptOf(body) {
  const i = body.search(/^## transcript\s*$/m);
  return i < 0 ? '' : body.slice(i).replace(/^## transcript\s*/, '').trim();
}

module.exports = { SITE, COLLECTION, ROOT, EPISODES_DIR, INDEX_DIR, sleep, fetchJson, decodeEntities, htmlToText, htmlToMarkdown, wordCount, parseEpisode, serializeEpisode, episodeFile, readEpisodes, writeEpisode, transcriptOf };

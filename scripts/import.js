#!/usr/bin/env node
// Squarespace → episodes/ep-NNN.md.
//   node scripts/import.js --all          every post (first run, or a full re-sync)
//   node scripts/import.js --since-last   only posts newer than the newest one already imported
// Existing files keep their generated fields (guests, summary, key_quotes) and any
// Descript transcript; metadata (title, tags, image, excerpt) is refreshed for every
// post on the pages that get fetched.
const fs = require('fs');
const path = require('path');
const { SITE, COLLECTION, INDEX_DIR, sleep, fetchJson, htmlToText, htmlToMarkdown, wordCount, decodeEntities, episodeFile, readEpisodes, parseEpisode, writeEpisode } = require('./lib');

const DELAY_MS = 600;
const BOILERPLATE = /^(#+\s*)?(listen to this episode|about she persisted|recent episodes|more episodes)\b/i;

// The one place Squarespace's (undocumented) item shape is read.
function normalize(item) {
  const title = decodeEntities(String(item.title || '')).replace(/\s+/g, ' ').trim();
  // "219: …" (colon typo) still counts as an episode number.
  const m = /^(\d+)[.:]/.exec(title);
  return {
    number: m ? parseInt(m[1], 10) : null,
    title,
    slug: String(item.urlId || ''),
    url: SITE + (item.fullUrl || `${COLLECTION}/${item.urlId}`),
    image: item.assetUrl || '',
    tags: (item.tags || []).map((t) => String(t).toLowerCase().trim()),
    excerpt: htmlToText(item.excerpt),
    publishOn: item.publishOn || item.addedOn || 0,
    bodyHtml: item.body || '',
  };
}

function splitBlocks(bodyHtml) {
  return bodyHtml.split(/(?=<div class="sqs-block )/).slice(1).map((html) => ({
    cls: (/^<div class="sqs-block ([^"]+)"/.exec(html) || [, ''])[1],
    html,
  }));
}

function audioUrl(bodyHtml) {
  const decoded = decodeEntities(bodyHtml);
  const urls = [...decoded.matchAll(/<(?:iframe|audio|source)\b[^>]*?\bsrc="([^"]+)"/gi)].map((m) => m[1]);
  const mp3 = decoded.match(/https?:\/\/[^\s"'<>]+\.mp3[^\s"'<>]*/i);
  const player = urls.find((u) => !/youtube\.com|youtu\.be|vimeo\.com/i.test(u));
  let url = player || (mp3 && mp3[0]) || '';
  // Squarespace wraps players in an embedly iframe; keep the real player URL.
  const wrapped = /[?&]src=([^&]+)/.exec(/embedly\.com/.test(url) ? url : '');
  if (wrapped) url = decodeURIComponent(wrapped[1]);
  if (url.startsWith('//')) url = 'https:' + url;
  return url;
}

// Older posts keep the show blurb and platform links inside the notes block.
function stripFooter(md) {
  return md
    .replace(/^#+ About She Persisted[^\n]*\n+[^\n#]*$/gim, '')
    .replace(/^\*\*Tune in and subscribe[^\n]*$/gim, '')
    .replace(/\n{3,}/g, '\n\n').trim();
}

// Post body → markdown. Text blocks only; players, images, share buttons and the
// site-wide footer blocks are dropped. The transcript goes under "## transcript".
function bodyToMarkdown(bodyHtml) {
  const blocks = splitBlocks(bodyHtml)
    .filter((b) => /\b(html-block|sqs-block-html|markdown-block|sqs-block-markdown)\b/.test(b.cls))
    .map((b) => stripFooter(htmlToMarkdown(b.html)))
    .filter((md) => md && !BOILERPLATE.test(md));
  if (!blocks.length) {
    const md = htmlToMarkdown(bodyHtml);
    return wordCount(md) > 1500 ? `## transcript\n\n${md}` : md;
  }
  let ti = blocks.findIndex((md) => /automated transcription|^(#+\s*)?(episode )?transcript\b/i.test(md.slice(0, 300)));
  if (ti < 0) {
    const counts = blocks.map(wordCount);
    const max = Math.max(...counts);
    if (max > 1500) ti = counts.indexOf(max);
  }
  if (ti < 0) return blocks.join('\n\n');
  const notes = blocks.filter((_, i) => i !== ti);
  const transcript = blocks[ti].replace(/^(#+\s*)?(episode )?transcript:?\s*\n+/i, '');
  return [...notes, '## transcript', transcript].join('\n\n');
}

async function main() {
  const all = process.argv.includes('--all');
  const sinceLast = process.argv.includes('--since-last');
  if (all === sinceLast) {
    console.error('usage: node scripts/import.js --all | --since-last');
    process.exit(1);
  }
  const existing = new Map(readEpisodes().map((e) => [e.meta.number, e]));
  const lastPublish = Math.max(0, ...[...existing.values()].map((e) => Number(e.meta.publish_on) || 0));
  const counts = { added: 0, updated: 0, unchanged: 0 };
  const skipped = [];
  let collection = null;
  let url = `${SITE}${COLLECTION}?format=json`;

  for (let page = 1; url; page++) {
    const data = await fetchJson(url);
    collection = collection || data.collection || {};
    const items = data.items || [];
    let sawNew = false;
    for (const item of items) {
      const ep = normalize(item);
      if (ep.number == null) { skipped.push(`${ep.title} (${ep.url})`); continue; }
      const prev = existing.get(ep.number);
      const isNew = !prev;
      if (isNew || ep.publishOn > lastPublish) sawNew = true;
      const meta = {
        title: ep.title,
        number: ep.number,
        date: new Date(ep.publishOn).toISOString().slice(0, 10),
        publish_on: ep.publishOn,
        slug: ep.slug,
        original_url: ep.url,
        image_url: ep.image,
        tags: ep.tags,
        guests: prev ? prev.meta.guests ?? [] : [],
        summary: prev ? prev.meta.summary ?? '' : '',
        key_quotes: prev ? prev.meta.key_quotes ?? [] : [],
        excerpt: ep.excerpt,
        audio_url: audioUrl(ep.bodyHtml) || (prev ? prev.meta.audio_url : '') || '',
        transcript_source: prev ? prev.meta.transcript_source || 'blog' : 'blog',
        transcript_status: prev ? prev.meta.transcript_status || '' : '',
      };
      for (const k of ['transcript_words', 'audit_flags']) if (prev && k in prev.meta) meta[k] = prev.meta[k];
      // A Descript backfill is hand-placed; never overwrite it with the blog body.
      const body = prev && prev.meta.transcript_source === 'descript' ? prev.body : bodyToMarkdown(ep.bodyHtml);
      const file = episodeFile(ep.number);
      const before = prev ? fs.readFileSync(file, 'utf8') : null;
      writeEpisode(file, meta, body);
      const after = fs.readFileSync(file, 'utf8');
      counts[isNew ? 'added' : before === after ? 'unchanged' : 'updated']++;
      existing.set(ep.number, { file, ...parseEpisode(after) });
    }
    console.log(`page ${page}: ${items.length} posts`);
    const next = data.pagination && data.pagination.nextPageOffset;
    if (!next || (sinceLast && !sawNew)) break;
    url = `${SITE}${COLLECTION}?format=json&offset=${next}`;
    await sleep(DELAY_MS);
  }

  if (collection) {
    fs.mkdirSync(INDEX_DIR, { recursive: true });
    fs.writeFileSync(path.join(INDEX_DIR, 'collection.json'), JSON.stringify({
      tags: (collection.tags || []).map((t) => String(t).toLowerCase().trim()),
      itemCount: collection.itemCount ?? null,
    }, null, 1) + '\n');
  }
  console.log(`added ${counts.added}, updated ${counts.updated}, unchanged ${counts.unchanged}; ${existing.size} episodes on disk`);
  if (skipped.length) {
    console.log(`skipped ${skipped.length} posts without a leading episode number:`);
    for (const s of skipped) console.log(`  - ${s}`);
  }
}

main().catch((err) => { console.error(err); process.exit(1); });

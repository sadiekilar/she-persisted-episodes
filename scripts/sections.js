// Splits a Squarespace post body into the pieces the episode page needs:
// description, "we/i talk about" bullets, "mentioned" block, transcript, and
// the YouTube / Spotify ids embedded in the post. Used by import.js.
const { decodeEntities, htmlToText } = require('./lib');

const MARKERS = {
  listen: /^(listen|tune in)\b.*(episode|here)|^(apple podcasts|spotify)\b/i,
  talkAbout: /\b(talk|chat|discuss|cover|dive|touch|share)\w*\b.*\b(about|topics?|following|including|into)\b|^(in (this|today'?s) episode|topics?( covered| discussed)?|what we|key takeaways|talking points|timestamps?|here,? (i|we)('|\u2019)?ll)/i,
  mentioned: /^(mentioned|resources?|links?|references?|books? mentioned|shop|episode resources?)\b|\bmentioned in\b/i,
  about: /^about\s+(\*\*)?(nevertheless, )?she persisted/i,
  transcript: /automated transcri|^(episode |full )?transcript\b/i,
  recent: /^(recent|more|related|other) episodes/i,
};

// Top-level elements of an HTML fragment (p, h*, ul, ol, div, blockquote ...), in order.
function topLevel(html) {
  const out = [];
  const re = /<(p|h[1-6]|ul|ol|div|blockquote|figure|section|span|a|strong|em|br)\b[^>]*\/?>|<\/(p|h[1-6]|ul|ol|div|blockquote|figure|section|span|a|strong|em)>/gi;
  let depth = 0, start = -1, tag = '', m;
  while ((m = re.exec(html))) {
    const isClose = m[0][1] === '/';
    const name = (isClose ? m[2] : m[1]).toLowerCase();
    if (name === 'br' || m[0].endsWith('/>')) continue;
    if (!isClose) {
      if (depth === 0) { start = m.index; tag = name; }
      depth++;
    } else {
      depth = Math.max(0, depth - 1);
      if (depth === 0 && start > -1) {
        const frag = html.slice(start, m.index + m[0].length);
        out.push({ tag, html: frag, text: htmlToText(frag) });
        start = -1;
      }
    }
  }
  return out;
}

// Flattens wrapper divs so paragraphs and headings sit at the top level.
function flatten(els) {
  const out = [];
  els.forEach((el) => {
    if (el.tag === 'div' || el.tag === 'section' || el.tag === 'span') {
      const inner = el.html.replace(/^<[^>]+>/, '').replace(/<\/[^>]+>$/, '');
      const kids = topLevel(inner);
      if (kids.length) out.push(...flatten(kids));
      else if (el.text) out.push({ tag: 'p', html: `<p>${inner}</p>`, text: el.text });
    } else out.push(el);
  });
  return out;
}

function isHeading(el) { return /^h[1-6]$/.test(el.tag) || (el.tag === 'p' && /^<p[^>]*>\s*<(strong|b)\b[^>]*>[^<]{1,60}<\/(strong|b)>\s*:?\s*<\/p>$/i.test(el.html)); }
function markerOf(el) {
  const t = el.text.replace(/^[\s*:\u2013\u2026-]+|[\s*:\u2013\u2026-]+$/g, '');
  if (t.length > 160) return null; // markers are headings or short lead-ins, never paragraphs
  for (const k of Object.keys(MARKERS)) if (MARKERS[k].test(t)) return k;
  return null;
}
const hasPlatformLinks = (el) => /podcasts\.apple\.com|open\.spotify\.com|youtube\.com|music\.amazon|castbox|iheart|goodpods|stitcher|overcast|pocketcasts/i.test(el.html);

// Markdown-ish list items from a <ul>/<ol> fragment.
function listItems(html) {
  return [...html.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map((m) => htmlToText(m[1])).filter(Boolean);
}

function cleanHtml(html) {
  return html
    .replace(/\s(style|class|id|data-[\w-]+|dir|aria-[\w-]+)="[^"]*"/gi, '')
    .replace(/<(\/?)(span|div|section)\b[^>]*>/gi, '')
    .replace(/<p[^>]*>\s*(&nbsp;|\s)*<\/p>/gi, '')
    .replace(/\s+/g, ' ')
    .replace(/> </g, '><')
    .trim();
}

function extract(bodyHtml) {
  const blocks = bodyHtml.split(/(?=<div class="sqs-block )/).slice(1).map((html) => ({
    cls: (/^<div class="sqs-block ([^"]+)"/.exec(html) || [, ''])[1],
    html,
  }));
  const textBlocks = blocks.filter((b) => /\b(html-block|sqs-block-html|markdown-block|sqs-block-markdown)\b/.test(b.cls));
  const videoBlocks = blocks.filter((b) => /\b(video-block|embed-block)\b/.test(b.cls));

  const youtube = /youtube\.com\/embed\/([\w-]{6,})|youtu\.be\/([\w-]{6,})|youtube\.com\/watch\?v=([\w-]{6,})/i.exec(decodeEntities(videoBlocks.map((b) => b.html).join('\n')) + '\n' + decodeEntities(bodyHtml));
  // Squarespace wraps the Spotify player in an embedly iframe with the real URL percent-encoded.
  const flat = decodeEntities(bodyHtml);
  let unescaped = flat;
  try { unescaped = decodeURIComponent(flat.replace(/\+/g, ' ')); } catch (e) { /* keep flat */ }
  const SPOTIFY = /open\.spotify\.com\/(?:embed\/)?episode\/([A-Za-z0-9]{10,})/i;
  // embedly wraps the player: src=https%3A%2F%2Fopen.spotify.com%2Fembed%2Fepisode%2F<id>
  const wrapped = /[?&]src=(https?%3A%2F%2Fopen\.spotify\.com[^&"'\s]+)/i.exec(flat);
  const spotify = SPOTIFY.exec(flat) || SPOTIFY.exec(unescaped) || (wrapped && SPOTIFY.exec(decodeURIComponent(wrapped[1])));

  const els = [];
  const seenMarkers = new Set();
  const headings = [];
  textBlocks.forEach((b, bi) => {
    let inner = b.html.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, '');
    const m = /<div[^>]*(?:data-sqsp-text-block-content|class="sqs-html-content")[^>]*>([\s\S]*)$/i.exec(inner);
    if (m) inner = m[1];
    inner = inner.replace(/<div class="sqs-block-content">/i, '');
    const words = htmlToText(inner).split(/\s+/).length;
    flatten(topLevel(inner)).forEach((el) => {
      el.block = bi; el.blockWords = words;
      if (isHeading(el)) headings.push(el.text.trim().slice(0, 60));
      els.push(el);
    });
  });

  // Transcript block: the one that announces itself, else the longest text block (> 1500 words).
  let transcriptBlock = -1;
  textBlocks.forEach((b, bi) => {
    if (transcriptBlock < 0 && /automated transcri|^\s*(episode |full )?transcript\b/i.test(htmlToText(b.html).slice(0, 300))) transcriptBlock = bi;
  });
  if (transcriptBlock < 0) {
    let max = 1500;
    textBlocks.forEach((b, bi) => { const w = htmlToText(b.html).split(/\s+/).length; if (w > max) { max = w; transcriptBlock = bi; } });
  }

  let state = 'pre';
  const description = [], mentioned = [];
  let talkAbout = [];
  for (const el of els) {
    if (el.block === transcriptBlock) continue;
    const marker = markerOf(el);
    if (marker) seenMarkers.add(marker);
    if (marker === 'listen' || (state === 'pre' && hasPlatformLinks(el))) { state = 'listen'; continue; }
    if (marker === 'talkAbout') { state = 'talkAbout'; continue; }
    if (marker === 'mentioned') { state = 'mentioned'; continue; }
    if (marker === 'about' || marker === 'recent' || marker === 'transcript') { state = 'done'; continue; }
    if (state === 'listen') {
      if (hasPlatformLinks(el) || !el.text) continue;
      state = 'description';
    }
    if (state === 'pre' && el.text) state = 'description';
    if (state === 'description') {
      if (el.tag === 'ul' || el.tag === 'ol') { if (!talkAbout.length && !seenMarkers.has('talkAbout')) { talkAbout = listItems(el.html); } continue; }
      if (isHeading(el)) { state = 'other'; continue; }
      if (el.text) description.push(el);
    } else if (state === 'talkAbout') {
      if (el.tag === 'ul' || el.tag === 'ol') { if (!talkAbout.length) talkAbout = listItems(el.html); continue; }
      if (el.text && !talkAbout.length && !isHeading(el)) talkAbout.push(el.text);
      if (isHeading(el)) state = 'other';
    } else if (state === 'mentioned') {
      if (isHeading(el) && !/^(call|text|visit|go to)\b/i.test(el.text)) { state = 'other'; continue; }
      if (el.text) mentioned.push(el);
    }
  }

  const missing = ['listen', 'talkAbout', 'mentioned'].filter((k) => !seenMarkers.has(k));
  return {
    description_html: cleanHtml(description.map((e) => e.html).join('')),
    talk_about: talkAbout,
    mentioned_html: cleanHtml(mentioned.map((e) => e.html).join('')),
    youtube_id: youtube ? youtube[1] || youtube[2] || youtube[3] : null,
    spotify_episode_id: spotify ? spotify[1] : null,
    transcriptBlock,
    headings,
    missing,
  };
}

module.exports = { extract };

// Flightcast (the podcast host) is the source of truth for transcripts and chapters.
// The feed links a WebVTT transcript per episode; chapters come from a chapters file
// when the feed has one, else from timestamped lines in the episode's show notes.
const { decodeEntities } = require('./lib');

const fmt = (t) => { t = Math.floor(t); const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), s = t % 60; return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(s).padStart(2, '0'); };
const toSec = (hms) => hms.split(':').map(Number).reduce((a, n) => a * 60 + n, 0);

// WebVTT → paragraphs [{t, text}]. Cues are sentence-sized; group them into readable
// paragraphs, breaking on a pause of 1.2s+, 4 cues, or ~60 words.
function vttToParagraphs(vtt) {
  const cues = [];
  const blocks = vtt.replace(/\r/g, '').split(/\n\n+/);
  for (const b of blocks) {
    const m = /(\d{1,2}:)?(\d{2}):(\d{2})\.(\d{3})\s*-->\s*(\d{1,2}:)?(\d{2}):(\d{2})\.(\d{3})/.exec(b);
    if (!m) continue;
    const start = (m[1] ? parseInt(m[1], 10) * 3600 : 0) + (+m[2]) * 60 + (+m[3]) + (+m[4]) / 1000;
    const end = (m[5] ? parseInt(m[5], 10) * 3600 : 0) + (+m[6]) * 60 + (+m[7]) + (+m[8]) / 1000;
    const text = b.slice(b.indexOf(m[0]) + m[0].length).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (text) cues.push({ start, end, text });
  }
  const out = [];
  let cur = null;
  for (const c of cues) {
    const words = cur ? cur.text.split(' ').length : 0;
    if (!cur || c.start - cur.end > 1.2 || cur.n >= 4 || words >= 60) {
      cur = { t: c.start, end: c.end, text: c.text, n: 1 };
      out.push(cur);
    } else {
      cur.text += ' ' + c.text; cur.end = c.end; cur.n++;
    }
  }
  return out.map((p) => ({ t: Math.floor(p.t), text: p.text }));
}

function paragraphsToMarkdown(paragraphs) {
  return paragraphs.map((p) => `[${fmt(p.t)}] ${p.text}`).join('\n\n');
}

// Replace (or add) the "## transcript" section of an episode body.
function withTranscript(body, markdown) {
  const i = body.search(/^## transcript\s*$/m);
  const notes = (i < 0 ? body : body.slice(0, i)).trim();
  return `${notes}\n\n## transcript\n\n${markdown}\n`;
}

// "00:53 when i was hospitalized…" lines in the show notes → chapters.
function chaptersFromNotes(html) {
  const text = decodeEntities(String(html || '').replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|li|div|h[1-6])>/gi, '\n').replace(/<[^>]+>/g, ''));
  const out = [];
  for (const line of text.split('\n')) {
    const m = /^\s*[→\-•*]?\s*\(?(\d{1,2}:\d{2}(?::\d{2})?)\)?\s*[-–—:]?\s*(.+?)\s*$/.exec(line);
    if (m && m[2].length > 2) out.push({ t: toSec(m[1]), title: m[2].replace(/^[-–—:\s]+/, '') });
  }
  out.sort((a, b) => a.t - b.t);
  return out.filter((c, i) => !i || c.t > out[i - 1].t);
}

// Podcasting 2.0 chapters JSON ({"chapters":[{"startTime":53,"title":"…"}]}).
function chaptersFromJson(json) {
  const list = (json && json.chapters) || [];
  const out = list.map((c) => ({ t: Math.floor(+c.startTime || 0), title: String(c.title || '').trim() })).filter((c) => c.title);
  out.sort((a, b) => a.t - b.t);
  return out.filter((c, i) => !i || c.t > out[i - 1].t);
}

module.exports = { vttToParagraphs, paragraphsToMarkdown, withTranscript, chaptersFromNotes, chaptersFromJson, fmt };

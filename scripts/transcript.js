// Transcript markdown (everything under "## transcript") → paragraphs with optional
// timestamps and speaker labels. Timestamps come from inline "[00:27:00]" markers
// (Descript's export style) or a leading "27:00" / "[27:00]" on the paragraph.
const { transcriptOf } = require('./lib');

const INLINE = /\[(\d{1,2}):(\d{2})(?::(\d{2}))?\]/g;
const LEAD = /^\[?(\d{1,2}):(\d{2})(?::(\d{2}))?\]?\s*[-–—]?\s*/;
const SPEAKER = /^\*\*([^*\n]{1,40}?):?\*\*:?\s*/;

const seconds = (h, m, s) => (s == null ? (+h) * 60 + (+m) : (+h) * 3600 + (+m) * 60 + (+s));

function transcriptParagraphs(body) {
  const md = transcriptOf(body);
  if (!md) return [];
  const out = [];
  let last = null;
  md.split(/\n\s*\n/).forEach((raw) => {
    let text = raw.trim();
    if (!text || /^\*a note: this is an automated transcription/i.test(text)) return;
    // the post's own outro and copyright line are not transcript
    if (/^\*?(\u00a9|\(c\)) ?\d{4}|she persisted llc|^if you enjoyed this episode/i.test(text)) return;
    let t = null, speaker = null;
    const sp = SPEAKER.exec(text);
    if (sp) { speaker = sp[1].trim().toLowerCase(); text = text.slice(sp[0].length); }
    const lead = LEAD.exec(text);
    if (lead) { t = seconds(lead[1], lead[2], lead[3]); text = text.slice(lead[0].length); }
    const inline = [...text.matchAll(INLINE)];
    if (t == null && inline.length) t = seconds(inline[0][1], inline[0][2], inline[0][3]);
    text = text.replace(INLINE, '').replace(/\s+/g, ' ').trim();
    if (!text) return;
    // paragraphs between markers inherit nothing; the page shows the stamp only where known
    out.push({ t, speaker, text });
    if (t != null) last = t;
  });
  // A paragraph that carried its marker mid-text starts before that time; keep as-is (close enough for seeking).
  return out;
}

module.exports = { transcriptParagraphs };

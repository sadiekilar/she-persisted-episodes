#!/usr/bin/env node
// Guests: one record per person across the catalogue, built from the episode files:
// name (normalised), credentials, a bio sentence from the description, website/instagram from the
// show notes, the episodes they appear on, and a headshot (the Squarespace thumbnail of their newest
// episode). index/guests-review.md lists every record and is read back first, so edits there win.
//   node scripts/guests.js
const fs = require('fs');
const path = require('path');
const { INDEX_DIR, readEpisodes, htmlToText } = require('./lib');

const reviewFile = path.join(INDEX_DIR, 'guests-review.md');
const TITLES = /\b(dr\.?|md|m\.d\.|phd|ph\.d\.?|psyd|psy\.d\.?|lcsw|licsw|lmft|lpc|lpcc|ma|m\.a\.|mph|ms|m\.s\.|rd|rdn|ctrs|icf|pcc|ncc|mba|esq|jd|rn|np|do)\b/gi;
const key = (s) => String(s).toLowerCase().replace(/\([^)]*\)/g, ' ').replace(TITLES, ' ').replace(/[^a-z\s'-]/g, ' ').replace(/\s+/g, ' ').trim();
const slug = (s) => key(s).replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');

// "dr. blaise aguirre, child and adolescent psychiatrist and …" → name + role
function splitGuest(raw) {
  const s = String(raw).trim().replace(/\s+/g, ' ');
  const m = /^([^,(–—]+?)(?:\s*[,(–—]\s*(.*))?$/.exec(s);
  let name = (m ? m[1] : s).trim().replace(/\.$/, '');
  let role = m && m[2] ? m[2].replace(/\)$/, '').trim() : '';
  const of = /^(.+?)\s+(?:from|of)\s+(.+)$/i.exec(name);
  if (of) { name = of[1]; role = role || of[2]; }
  return { name: name.toLowerCase(), role };
}
// guests named in the title: "feat. dr. jane smith", "with jane & jo", "Jane Smith (LMFT) on …"
function fromTitle(title) {
  const t = title.replace(/^\d+[.:]\s*/, '');
  const m = /(?:feat\.?|ft\.|featuring|with)\s+([^()|:!?]+?)(?:\s*[(|:]|\s+on\b|\s*$)/i.exec(t);
  if (!m) return [];
  return m[1].split(/\s*(?:,|&|\+|\band\b)\s*/i).map((n) => n.trim().toLowerCase()).filter((n) => n && !/^(my|her|his|the|a|an|sadie|two|three|you|your)\b/.test(n) && n.split(' ').length <= 4 && /^[a-z][a-z'. -]+$/.test(n));
}
const credsOf = (s) => { const out = new Set(); for (const m of String(s).matchAll(/\b(m\.?d\.?|ph\.?d\.?|psy\.?d\.?|lcsw|licsw|lmft|lpc|lpcc|mph|rdn?|ctrs|ncc|mba|rn|np)\b/gi)) out.add(m[1].toUpperCase().replace(/\./g, '')); return [...out]; };

function readReview() {
  const out = new Map();
  if (!fs.existsSync(reviewFile)) return out;
  for (const line of fs.readFileSync(reviewFile, 'utf8').split('\n')) {
    const m = /^- ([a-z0-9-]+): (.*)$/.exec(line);
    if (!m) continue;
    const f = m[2].split('|').map((s) => s.trim());
    out.set(m[1], { name: f[0] || '', credentials: f[1] || '', website: f[2] || '', instagram: f[3] || '', headshot: f[4] || '', bio: f[5] || '' });
  }
  return out;
}

const eps = readEpisodes().sort((a, b) => b.meta.number - a.meta.number);
const guests = new Map(); // slug → record
const noGuest = [];
for (const e of eps) {
  const m = e.meta;
  let found = (m.guests || []).map(splitGuest);
  if (!found.length) found = fromTitle(m.title).map((name) => ({ name, role: '' }));
  if (!found.length) { if (/feat\.?|\bwith\b|\bft\./i.test(m.title)) noGuest.push(m); continue; }
  const text = htmlToText(m.description_html || '').replace(/\s+/g, ' ');
  const html = (m.description_html || '') + (m.mentioned_html || '');
  for (const g of found) {
    const id = slug(g.name);
    if (!id || id.length < 3) continue;
    const rec = guests.get(id) || { id, names: {}, credentials: new Set(), roles: [], bio: '', website: '', instagram: '', episodes: [], headshot: '' };
    rec.names[g.name] = (rec.names[g.name] || 0) + 1;
    credsOf(g.name + ' ' + g.role + ' ' + m.title).forEach((c) => rec.credentials.add(c));
    if (g.role) rec.roles.push(g.role);
    const last = key(g.name).split(' ').pop();
    if (!rec.bio && last && last.length > 2) {
      const sent = text.split(/(?<=[.!?])\s+/).find((s) => new RegExp('\\b' + last + '\\b', 'i').test(s) && /\b(is|who|founder|author|psych|therap|coach|host|director|specializ|works|teach|student|survivor)/i.test(s) && s.length < 400);
      if (sent) rec.bio = sent.trim().replace(/^(today'?s|this week'?s) guest is [^,—–]+[,—–]\s*/i, '').replace(/^[a-z' .-]+\s[—–]\s*/i, (x) => new RegExp(last, 'i').test(x) ? '' : x);
    }
    for (const a of html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)) {
      const href = a[1].replace(/&amp;/g, '&'), label = htmlToText(a[2]).toLowerCase();
      const mine = new RegExp('\\b' + last + '\\b', 'i').test(label) || new RegExp('\\b' + last, 'i').test(href);
      if (!mine) continue;
      if (/instagram\.com/i.test(href)) { if (!rec.instagram) rec.instagram = href; }
      else if (!/youtube|spotify|apple\.com|amazon|tiktok|linkedin|twitter|x\.com|facebook|shepersistedpodcast|anchor\.fm/i.test(href) && !rec.website) rec.website = href;
    }
    if (!rec.episodes.includes(m.number)) rec.episodes.push(m.number);
    if (found.length === 1 && !rec.headshot && m.image_url) rec.headshot = m.image_url; // newest solo-guest episode first
    if (found.length > 1 && !rec.sharedThumb && m.image_url) rec.sharedThumb = m.image_url;
    guests.set(id, rec);
  }
}

// merge near-duplicates: a name that is a prefix of another (olivia / olivia nicastro) or spelled almost the same
const dice = (a, b) => { const g = (s) => { const w = s.replace(/ /g, ''); const r = new Set(); for (let i = 0; i < w.length - 1; i++) r.add(w.slice(i, i + 2)); return r; }; const A = g(a), B = g(b); let h = 0; A.forEach((x) => { if (B.has(x)) h++; }); return (2 * h) / (A.size + B.size || 1); };
for (const [id, r] of [...guests.entries()]) {
  const k = key(Object.keys(r.names)[0]);
  const sameish = (a, b) => { const A = a.split(' '), B = b.split(' '); return A.length > 1 && B.length > 1 && A[A.length - 1] === B[B.length - 1] && A[0].slice(0, 3) === B[0].slice(0, 3); };
  const target = [...guests.values()].find((o) => o !== r && (o.id.length > id.length || (o.id.length === id.length && o.id < id)) && (key(Object.keys(o.names)[0]).startsWith(k + ' ') || dice(o.id, id) >= 0.8 || sameish(key(Object.keys(o.names)[0]), k)));
  if (!target) continue;
  for (const [n, c] of Object.entries(r.names)) target.names[n] = (target.names[n] || 0) + c;
  r.credentials.forEach((c) => target.credentials.add(c));
  target.episodes.push(...r.episodes.filter((n) => !target.episodes.includes(n)));
  target.bio = target.bio || r.bio; target.website = target.website || r.website; target.instagram = target.instagram || r.instagram; target.headshot = target.headshot || r.headshot;
  guests.delete(id);
}
const review = readReview();
const list = [...guests.values()].map((r) => {
  const name = Object.entries(r.names).sort((a, b) => b[1] - a[1])[0][0];
  const rv = review.get(r.id) || {};
  return {
    id: r.id,
    name: rv.name || name,
    credentials: rv.credentials || [...r.credentials].join(', '),
    bio: rv.bio || r.bio,
    website: rv.website || r.website,
    instagram: rv.instagram || r.instagram,
    headshot: rv.headshot || r.headshot || '',
    headshot_note: rv.headshot || r.headshot ? '' : (r.sharedThumb ? 'only appears with other guests; thumbnail is shared' : 'no thumbnail'),
    episodes: r.episodes.sort((a, b) => b - a),
  };
}).sort((a, b) => b.episodes[0] - a.episodes[0]);

fs.writeFileSync(path.join(INDEX_DIR, 'guests.json'), JSON.stringify({ generatedAt: new Date().toISOString(), count: list.length, guests: list }, null, 1));
const shared = {}; list.forEach((g) => { if (g.headshot) (shared[g.headshot] = shared[g.headshot] || []).push(g.name); });
const sharedHeadshots = Object.values(shared).filter((a) => a.length > 1);
fs.writeFileSync(reviewFile, `# guests

${list.length} people, built from the episode files (names from the summaries and titles, bios from the descriptions, links from the show notes, headshot = the Squarespace thumbnail of the newest episode they appear on). One line per guest:

\`- id: name | credentials | website | instagram | headshot url | bio\`

Edit any field and commit; the next run keeps your version. Leave a field empty to keep the generated value.

${list.map((g) => `- ${g.id}: ${g.name} | ${g.credentials} | ${g.website} | ${g.instagram} | ${g.headshot} | ${g.bio}`).join('\n')}

## to check by hand

Guests with no headshot of their own (they only appear alongside other guests, so the episode thumbnail is shared — add one by hand in the headshot column): ${list.filter((g) => !g.headshot).map((g) => `${g.name} (${g.episodes.join(', ')})`).join('; ') || 'none'}.

Guests whose headshot is the same image as another guest's: ${sharedHeadshots.length ? sharedHeadshots.map((a) => a.join(' / ')).join('; ') : 'none'}.

Episodes whose title says feat./with but no guest could be read (${noGuest.length}): ${noGuest.map((m) => m.number).join(', ') || 'none'}.

Guests with no bio sentence found: ${list.filter((g) => !g.bio).map((g) => g.name).join(', ') || 'none'}.
`);
console.log(`guests: ${list.length} people across ${list.reduce((a, g) => a + g.episodes.length, 0)} appearances; ${list.filter((g) => g.bio).length} with a bio, ${list.filter((g) => g.website || g.instagram).length} with a link; ${noGuest.length} guest episodes unresolved -> index/guests.json, index/guests-review.md`);

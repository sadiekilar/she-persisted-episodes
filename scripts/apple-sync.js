#!/usr/bin/env node
// Apple Podcasts Connect API (signed JWT with the show's API key): every episode's Apple id, so every
// episode gets an Apple link (the public lookup only returns the newest 200). Writes index/apple-episodes.json
// and fills apple_episode_url where it is missing.
// Needs APPLE_KEY_ID, APPLE_ISSUER_ID and APPLE_PRIVATE_KEY (PEM text) or APPLE_PRIVATE_KEY_FILE.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { INDEX_DIR, readEpisodes, writeEpisode } = require('./lib');

const SHOW = process.env.APPLE_SHOW_ID || '1463051730';
const KID = process.env.APPLE_KEY_ID, ISS = process.env.APPLE_ISSUER_ID;
const PEM = process.env.APPLE_PRIVATE_KEY || (process.env.APPLE_PRIVATE_KEY_FILE && fs.readFileSync(process.env.APPLE_PRIVATE_KEY_FILE, 'utf8'));
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
function jwt() {
  const now = Math.floor(Date.now() / 1000);
  const h = b64({ alg: 'ES256', kid: KID, typ: 'JWT' }), p = b64({ iss: ISS, iat: now, exp: now + 1200, aud: 'podcastsconnect-v1' });
  const sig = crypto.sign('sha256', Buffer.from(h + '.' + p), { key: PEM, dsaEncoding: 'ieee-p1363' }).toString('base64url');
  return `${h}.${p}.${sig}`;
}
async function get(url) {
  const res = await fetch(url, { headers: { authorization: 'Bearer ' + jwt() } });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
  return res.json();
}
const numberOf = (title) => { const m = /^\s*(\d{1,3})[.:]\s/.exec(title || ''); return m ? +m[1] : null; };

async function main() {
  if (!KID || !ISS || !PEM) return console.log('apple-sync: APPLE_KEY_ID / APPLE_ISSUER_ID / APPLE_PRIVATE_KEY not set; skipping');
  const items = [];
  let url = `https://api.podcastsconnect.apple.com/v1/shows/${SHOW}/episodes?limit=200`;
  while (url) { const page = await get(url); items.push(...page.data); url = page.links && page.links.next; }
  const rows = items.map((e) => ({ apple_id: e.id, number: numberOf(e.attributes.title), title: e.attributes.title, guid: e.attributes.guid, date: e.attributes.originalReleaseDate, duration_sec: e.attributes.rssContentDurationInSeconds || e.attributes.appleHostedAudioDurationInSeconds || null, url: `https://podcasts.apple.com/us/podcast/id${SHOW}?i=${e.id}`, kind: /^\s*mini:/i.test(e.attributes.title) ? 'mini' : /trailer/i.test(e.attributes.title) ? 'trailer' : 'episode' }));
  fs.writeFileSync(path.join(INDEX_DIR, 'apple-episodes.json'), JSON.stringify({ generatedAt: new Date().toISOString(), show: SHOW, count: rows.length, items: rows }, null, 1));
  const byNumber = new Map(rows.filter((r) => r.number).map((r) => [r.number, r]));
  let filled = 0;
  for (const ep of readEpisodes()) {
    const r = byNumber.get(ep.meta.number);
    if (r && !ep.meta.apple_episode_url) { writeEpisode(ep.file, { ...ep.meta, apple_episode_url: r.url }, ep.body); filled++; }
  }
  console.log(`apple-sync: ${rows.length} items on Apple (${rows.filter((r) => r.kind === 'episode').length} episodes, ${rows.filter((r) => r.kind === 'mini').length} minis); apple_episode_url filled on ${filled} episodes`);
}
main().catch((err) => { console.error(err); process.exit(1); });

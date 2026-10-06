#!/usr/bin/env node
// Spotify episode ids from the Spotify for Creators (Anchor) episode page that every post
// embeds: the page carries "spotifyUrl" for the episode. Only episodes still missing
// spotify_episode_id are fetched, so after the first pass this is one request per new episode.
const { readEpisodes, writeEpisode, sleep } = require('./lib');

const UA = 'Mozilla/5.0 (she-persisted-episodes sync)';

async function lookup(creatorsEmbedUrl) {
  const pageUrl = creatorsEmbedUrl.replace('/embed/', '/');
  const slugId = (/-(e[0-9a-z]{5,})(?:\/|$)/i.exec(pageUrl) || [])[1];
  const res = await fetch(pageUrl, { headers: { 'user-agent': UA, accept: 'text/html' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  let from = slugId ? html.indexOf(`"episodeId":"${slugId}"`) : -1;
  if (from < 0) from = 0; // fall back to the first spotifyUrl on the page
  const chunk = html.slice(from, from + 20000);
  const m = /"spotifyUrl":"(https:(?:\\u002F|\/)(?:\\u002F|\/)open\.spotify\.com(?:\\u002F|\/)episode(?:\\u002F|\/)([A-Za-z0-9]{10,}))"/.exec(chunk);
  if (!m) throw new Error('no spotifyUrl');
  return m[2];
}

async function main() {
  const limit = (() => { const i = process.argv.indexOf('--limit'); return i > -1 ? +process.argv[i + 1] : Infinity; })();
  const todo = readEpisodes().filter((e) => !e.meta.spotify_episode_id && e.meta.creators_embed_url).slice(0, limit);
  if (!todo.length) return console.log('spotify-sync: nothing to do');
  let done = 0, failed = 0;
  for (const ep of todo) {
    try {
      const id = await lookup(ep.meta.creators_embed_url);
      writeEpisode(ep.file, { ...ep.meta, spotify_episode_id: id }, ep.body);
      done++;
    } catch (err) { failed++; console.error(`spotify ${ep.meta.number}: ${err.message}`); }
    await sleep(400);
  }
  console.log(`spotify-sync: ${done} found, ${failed} failed, of ${todo.length}`);
}

main().catch((err) => { console.error(err); process.exit(1); });

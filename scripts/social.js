#!/usr/bin/env node
// Social posts: what was posted, how it did, what the framings have in common, and drafts for the
// next ones. Runs nightly after analytics-youtube.js.
//
//   index/social/posts.json         one record per post (YouTube Shorts, minis and episode videos
//                                   from the YouTube snapshots; Instagram / TikTok / X rows from
//                                   analytics/imports/social/*.csv), with the hook, its features,
//                                   latest stats, 7/30-day deltas and a lift against the platform
//                                   baseline
//   index/social/insights.json      lift by feature (hook type, length, CAPS, topic, guest/solo,
//                                   duration, weekday) per platform, plus top and bottom posts
//   index/social/insights.md        the same, read by Claude into a playbook of what works and
//                                   which phrasings travel (stats-only when there is no API key)
//   index/social/drafts-review.md   hooks for the newest episodes, one block per clip moment, per
//                                   platform. Edit the lines you would post; when a post goes out,
//                                   its published title is matched back to the draft and the edit is
//                                   kept in index/social/edits.json and shown to the next drafting run
//
// Imports (analytics/imports/social/<platform>-<date>.csv, platform = instagram | tiktok | x):
//   any CSV with these columns (case-insensitive, extra columns ignored):
//     post_id, date, caption|title|description, url, views|plays, likes, comments, shares, saves, episode
//   episode is optional: "ep. 212" in the caption, or a hook matching a known YouTube Short, fills it.
const fs = require('fs');
const path = require('path');
const { INDEX_DIR, readEpisodes, sleep } = require('./lib');
const { formatOf } = require('./format');

const ROOT = path.join(__dirname, '..');
const SNAP_DIR = path.join(ROOT, 'analytics', 'youtube');
const IMPORT_DIR = path.join(ROOT, 'analytics', 'imports', 'social');
const OUT = path.join(INDEX_DIR, 'social');
const KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.SUMMARY_MODEL || 'claude-sonnet-4-5';
const today = new Date().toISOString().slice(0, 10);
const DAY = 86400e3;

const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const words = (s) => norm(s).split(' ').filter(Boolean);
function dice(a, b) {
  const g = (s) => { const w = norm(s); const o = new Set(); for (let i = 0; i < w.length - 1; i++) o.add(w.slice(i, i + 2)); return o; };
  const A = g(a), B = g(b); if (!A.size || !B.size) return 0; let n = 0; for (const x of A) if (B.has(x)) n++; return (2 * n) / (A.size + B.size);
}
const median = (arr) => { const a = arr.filter((x) => x != null).sort((x, y) => x - y); if (!a.length) return null; const m = Math.floor(a.length / 2); return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2; };

function parseCsv(text) {
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += ch; }
    else if (ch === '"') q = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.length > 1 || r[0]);
}

// ---------- features of a hook ----------
const HOOK_TYPES = [
  ['question', /\?/],
  ['what if', /^what if\b/i],
  ['pov', /^pov\b/i],
  ['why', /^why\b/i],
  ['how to', /^how (to|i|we)\b/i],
  ['this is', /^(this is|here'?s)\b/i],
  ['the truth / secret', /\b(truth|secret|nobody tells you|no one tells you)\b/i],
  ['i wish i knew', /\b(wish i knew|wish i'?d known|what i wish)\b/i],
  ['watch this if', /^(watch|listen to) this if\b/i],
  ['numbered list', /\b\d+ (things|ways|signs|steps|tips|skills|reasons)\b/i],
  ['stop / never', /^(stop|never|don'?t)\b/i],
  ['my story', /\b(my (story|depression|anxiety|experience)|when i was|i was (hospitalized|depressed|anxious))\b/i],
  ['you / your', /\b(you|your|you'?re)\b/i],
  ['statement', /./],
];
function features(post, ep) {
  const hook = post.hook || '';
  const caps = (hook.match(/\b[A-Z]{3,}\b/g) || []).length;
  const w = words(hook).length;
  const types = HOOK_TYPES.filter(([, re]) => re.test(hook)).map(([n]) => n);
  const primary = types.find((t) => !['you / your', 'statement', 'question'].includes(t)) || (types.includes('question') ? 'question' : types.includes('you / your') ? 'you / your' : 'statement');
  const d = post.published ? new Date(post.published) : null;
  return {
    hook_type: primary,
    is_question: /\?/.test(hook),
    addresses_you: /\b(you|your|you'?re)\b/i.test(hook),
    caps_words: caps > 3 ? '4+' : String(caps),
    length: w <= 6 ? 'short (≤6 words)' : w <= 11 ? 'medium (7–11)' : 'long (12+)',
    has_number: /\d/.test(hook) ? 'yes' : 'no',
    hashtags: post.hashtags.length ? (post.hashtags.length <= 2 ? '1–2' : '3+') : '0',
    duration: post.duration_sec == null ? 'unknown' : post.duration_sec <= 20 ? '≤20s' : post.duration_sec <= 40 ? '21–40s' : post.duration_sec <= 60 ? '41–60s' : '>60s',
    format: ep ? (ep.format || formatOf(ep) || 'unknown') : 'unknown',
    topics: ep ? (ep.tags || []) : [],
    weekday: d ? ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][d.getUTCDay()] : 'unknown',
  };
}

// ---------- posts ----------
function loadSnapshots() {
  if (!fs.existsSync(SNAP_DIR)) return [];
  return fs.readdirSync(SNAP_DIR).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort().map((f) => ({ date: f.slice(0, 10), data: JSON.parse(fs.readFileSync(path.join(SNAP_DIR, f), 'utf8')) }));
}
function splitHook(title) {
  const tags = (title.match(/#[\p{L}\p{N}_]+/gu) || []).map((t) => t.toLowerCase());
  const hook = title.replace(/#[\p{L}\p{N}_]+/gu, '').replace(/\s+/g, ' ').trim();
  return { hook, hashtags: tags };
}
function youtubePosts(episodes, minis, snaps) {
  const latest = snaps.length ? snaps[snaps.length - 1] : null;
  const at = (daysAgo) => { const target = new Date(Date.now() - daysAgo * DAY).toISOString().slice(0, 10); return [...snaps].reverse().find((s) => s.date <= target) || null; };
  const d7 = at(7), d30 = at(30);
  const firstSeen = {}; for (const s of snaps) for (const id of Object.keys(s.data)) if (id !== '_playlist' && !firstSeen[id]) firstSeen[id] = s.date;
  const out = [];
  const push = (kind, id, title, ep, extra) => {
    const { hook, hashtags } = splitHook(title || '');
    const st = latest && latest.data[id];
    const post = { id: 'yt:' + id, platform: 'youtube', kind, episode: ep ? ep.number : null, ...extra, title: title || '', hook, hashtags, url: kind === 'short' ? 'https://www.youtube.com/shorts/' + id : 'https://www.youtube.com/watch?v=' + id, source: 'youtube-api' };
    post.published = post.published || null;
    post.first_seen = firstSeen[id] || null;
    if (st) {
      post.stats = { as_of: latest.date, views: st.v, likes: st.l, comments: st.c };
      const back = (snap) => (snap && snap.data[id] ? st.v - snap.data[id].v : null);
      post.stats.views_7d = back(d7); post.stats.views_30d = back(d30);
    } else post.stats = null;
    out.push(post);
  };
  for (const ep of episodes) {
    const m = ep.meta;
    for (const s of m.shorts || []) push('short', s.youtube_id, s.title, m, { duration_sec: s.duration_sec, published: s.published || null });
    if (m.youtube_id) push('episode', m.youtube_id, m.title, m, { duration_sec: m.duration_sec || null, published: String(m.date || '').slice(0, 10) });
  }
  for (const x of minis) if (x.youtube_id) push('mini', x.youtube_id, 'MINI: ' + x.title, episodes.find((e) => e.meta.number === x.parent) && episodes.find((e) => e.meta.number === x.parent).meta, { duration_sec: x.duration_sec || null, published: x.date || null, mini: x.id });
  return out;
}
function importedPosts(episodes, ytPosts) {
  if (!fs.existsSync(IMPORT_DIR)) return [];
  const out = []; const seen = new Set();
  for (const f of fs.readdirSync(IMPORT_DIR).filter((x) => x.endsWith('.csv')).sort()) {
    const platform = (/^([a-z]+)-/.exec(f) || [])[1]; if (!platform) continue;
    const [head, ...rows] = parseCsv(fs.readFileSync(path.join(IMPORT_DIR, f), 'utf8').replace(/^﻿/, ''));
    const keys = head.map((h) => h.trim().toLowerCase());
    const col = (...names) => { for (const n of names) { const i = keys.indexOf(n); if (i >= 0) return i; } return -1; };
    const c = { id: col('post_id', 'id', 'post id', 'video id'), date: col('date', 'posted', 'publish time', 'post time', 'created'), text: col('caption', 'title', 'description', 'text', 'post'), url: col('url', 'link', 'permalink'), views: col('views', 'plays', 'video views', 'reach', 'impressions'), likes: col('likes'), comments: col('comments'), shares: col('shares', 'reposts'), saves: col('saves', 'bookmarks'), episode: col('episode', 'ep') };
    const num = (v) => (v === undefined || v === '' ? null : +String(v).replace(/[^0-9.]/g, '') || 0);
    for (const r of rows) {
      const text = c.text >= 0 ? r[c.text] : ''; const id = platform + ':' + (c.id >= 0 && r[c.id] ? r[c.id] : norm(text).slice(0, 40) + '|' + (c.date >= 0 ? r[c.date] : ''));
      if (seen.has(id)) continue; seen.add(id);
      const { hook, hashtags } = splitHook(text);
      let episode = c.episode >= 0 && r[c.episode] ? +String(r[c.episode]).replace(/\D/g, '') : null;
      if (!episode) { const m = /\bep(?:isode)?\.?\s*(\d{1,3})\b/i.exec(text); if (m) episode = +m[1]; }
      if (!episode && hook) { let best = null, score = 0; for (const p of ytPosts) { const s = dice(p.hook, hook); if (s > score) { score = s; best = p; } } if (best && score >= 0.6) episode = best.episode; }
      const d = c.date >= 0 ? r[c.date] : ''; let published = null; const m1 = /(\d{4})-(\d{2})-(\d{2})/.exec(d); const m2 = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(d);
      if (m1) published = m1[0]; else if (m2) published = `${m2[3]}-${m2[1].padStart(2, '0')}-${m2[2].padStart(2, '0')}`;
      out.push({ id, platform, kind: 'clip', episode, title: text, hook, hashtags, url: c.url >= 0 ? r[c.url] : '', source: f, published, duration_sec: null, stats: { as_of: (/(\d{4}-\d{2}-\d{2})\.csv$/.exec(f) || [, today])[1], views: num(r[c.views]), likes: num(r[c.likes]), comments: num(r[c.comments]), shares: num(r[c.shares]), saves: num(r[c.saves]) } });
    }
  }
  return out;
}

// ---------- learning ----------
function annotate(posts, epByNumber) {
  const groups = {};
  for (const p of posts) {
    p.features = features(p, p.episode != null ? epByNumber[p.episode] : null);
    const pub = p.published || p.first_seen;
    p.age_days = pub ? Math.max(1, Math.round((Date.now() - new Date(pub).getTime()) / DAY)) : null;
    p.views_per_day = p.stats && p.stats.views != null && p.age_days ? Math.round((p.stats.views / p.age_days) * 10) / 10 : null;
    const k = p.platform + ':' + p.kind; (groups[k] = groups[k] || []).push(p);
  }
  const baselines = {};
  for (const [k, list] of Object.entries(groups)) {
    // posts old enough to have settled, within the last 18 months, so the baseline moves with the channel
    const settled = list.filter((p) => p.stats && p.stats.views != null && p.age_days != null && p.age_days >= 14 && p.age_days <= 548);
    const base = median(settled.map((p) => p.stats.views));
    baselines[k] = { median_views: base, posts: settled.length };
    for (const p of list) p.lift = base && p.stats && p.stats.views != null && p.age_days >= 14 ? Math.round((p.stats.views / base) * 100) / 100 : null;
  }
  return baselines;
}
function insights(posts, baselines) {
  const out = { generatedAt: new Date().toISOString(), note: 'lift = views / median views of settled posts (14+ days old) of the same platform and kind. Values are medians of lift across posts with that feature; n is the number of posts. Read patterns only where n is 8 or more.', baselines, platforms: {} };
  const byKey = {};
  for (const p of posts) { if (p.lift == null) continue; const k = p.platform + ':' + p.kind; (byKey[k] = byKey[k] || []).push(p); }
  for (const [k, list] of Object.entries(byKey)) {
    const feats = {};
    const add = (name, value, lift) => { const f = (feats[name] = feats[name] || {}); const v = (f[value] = f[value] || []); v.push(lift); };
    for (const p of list) {
      for (const [name, value] of Object.entries(p.features)) {
        if (name === 'topics') { for (const t of value) add('topic', t, p.lift); continue; }
        add(name, String(value), p.lift);
      }
    }
    const table = {};
    for (const [name, values] of Object.entries(feats)) table[name] = Object.fromEntries(Object.entries(values).map(([v, lifts]) => [v, { n: lifts.length, median_lift: Math.round(median(lifts) * 100) / 100, share_above_1: Math.round((lifts.filter((x) => x >= 1).length / lifts.length) * 100) }]).sort((a, b) => b[1].median_lift - a[1].median_lift));
    const sorted = [...list].sort((a, b) => b.lift - a.lift);
    const brief = (p) => ({ id: p.id, episode: p.episode, hook: p.hook, lift: p.lift, views: p.stats.views, published: p.published, hook_type: p.features.hook_type });
    out.platforms[k] = { posts: list.length, features: table, top: sorted.slice(0, 12).map(brief), bottom: sorted.slice(-8).reverse().map(brief) };
  }
  return out;
}
function insightsMarkdown(ins, playbook) {
  let md = `# social insights\n\nGenerated ${ins.generatedAt.slice(0, 10)} from index/social/posts.json. ${ins.note}\n\n`;
  if (playbook) md += `## playbook (Claude's read of the numbers)\n\n${playbook.trim()}\n\n`;
  for (const [k, v] of Object.entries(ins.platforms)) {
    md += `## ${k} (${v.posts} posts with a lift; baseline ${ins.baselines[k].median_views} views)\n\n`;
    for (const [name, values] of Object.entries(v.features)) {
      const rows = Object.entries(values).filter(([, x]) => x.n >= 3);
      if (!rows.length) continue;
      md += `**${name}**\n\n| value | n | median lift | above baseline |\n| --- | ---: | ---: | ---: |\n` + rows.map(([val, x]) => `| ${val} | ${x.n} | ${x.median_lift} | ${x.share_above_1}% |`).join('\n') + '\n\n';
    }
    md += `**top posts**\n\n` + v.top.map((p) => `- ${p.lift}× · ${p.views} views · ep ${p.episode} · ${p.hook}`).join('\n') + `\n\n**bottom posts**\n\n` + v.bottom.map((p) => `- ${p.lift}× · ${p.views} views · ep ${p.episode} · ${p.hook}`).join('\n') + '\n\n';
  }
  return md;
}

// ---------- Claude ----------
async function claude(system, user, maxTokens) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': KEY, 'anthropic-version': '2023-06-01' }, body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system, messages: [{ role: 'user', content: user }] }) });
    if ((res.status === 429 || res.status >= 500) && attempt < 5) { await sleep(5000 * attempt); continue; }
    if (!res.ok) throw new Error(`Claude API ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const data = await res.json();
    return (data.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('');
  }
}
const VOICE = `"she persisted" is a gen z mental health podcast hosted by sadie sutton; the audience is women 15–25. The show writes in lowercase with a few CAPS words for emphasis, plain and warm, no hype, no emojis.`;
async function playbook(ins, edits) {
  const sys = `You are the show's social editor. ${VOICE}\n\nYou are given per-feature lift tables and the top and bottom posts per platform, plus a log of how sadie edited past draft hooks before posting. Write a short playbook in markdown (no title), lowercase, under 450 words:\n1. "what travels": 4–7 bullets on which hook types, lengths, phrasings and topics beat the baseline, each citing n and lift and quoting one real hook.\n2. "what sinks": 2–4 bullets.\n3. "phrasings to reuse": 6–10 reusable hook templates in the show's voice, derived from the winners, with a blank like ___ where the topic goes.\n4. "how sadie edits": 2–4 bullets on what her edits to drafts have in common, if there are any edits; otherwise say there are none yet.\nOnly claim a pattern where n ≥ 8. Say when the data is thin.`;
  const user = `insights:\n${JSON.stringify(ins, null, 0).slice(0, 60000)}\n\nedits log (draft → what was actually posted):\n${JSON.stringify((edits || []).slice(-40), null, 0)}`;
  return claude(sys, user, 1800);
}

// ---------- drafts and edits ----------
const DRAFTS = path.join(OUT, 'drafts-review.md');
const EDITS = path.join(OUT, 'edits.json');
function parseDrafts(text) {
  // ## ep 264 … then "- [youtube] hook" / "- [instagram] hook" / "- [tiktok] hook" lines under "### moment N · mm:ss"
  const out = []; let ep = null, moment = null;
  for (const line of text.split('\n')) {
    let m;
    if ((m = /^## ep (\d+)/.exec(line))) { ep = +m[1]; continue; }
    if ((m = /^### (.+)$/.exec(line))) { moment = m[1].trim(); continue; }
    if ((m = /^- \[(youtube|instagram|tiktok|x)\]\s*(.+)$/.exec(line)) && ep) out.push({ episode: ep, moment, platform: m[1], hook: m[2].trim() });
  }
  return out;
}
function recordEdits(posts) {
  if (!fs.existsSync(DRAFTS)) return [];
  const drafts = parseDrafts(fs.readFileSync(DRAFTS, 'utf8'));
  const edits = fs.existsSync(EDITS) ? JSON.parse(fs.readFileSync(EDITS, 'utf8')) : [];
  const known = new Set(edits.map((e) => e.post));
  for (const p of posts) {
    if (!p.hook || known.has(p.id) || p.kind === 'episode') continue;
    const cands = drafts.filter((d) => d.episode === p.episode && (d.platform === p.platform || (p.platform === 'youtube' && d.platform === 'youtube')));
    let best = null, score = 0;
    for (const d of cands) { const s = dice(d.hook, p.hook); if (s > score) { score = s; best = d; } }
    if (best && score >= 0.45) { edits.push({ post: p.id, platform: p.platform, episode: p.episode, moment: best.moment, draft: best.hook, posted: p.hook, edited: norm(best.hook) !== norm(p.hook), similarity: Math.round(score * 100) / 100, recorded: today }); known.add(p.id); }
  }
  fs.writeFileSync(EDITS, JSON.stringify(edits, null, 1) + '\n');
  return edits;
}
async function drafts(episodes, posts, playbookText, edits) {
  // newest 3 episodes with a transcript that have fewer than 4 shorts and no draft block yet
  const existing = fs.existsSync(DRAFTS) ? fs.readFileSync(DRAFTS, 'utf8') : '';
  const have = new Set(parseDrafts(existing).map((d) => d.episode));
  const targets = episodes.filter((e) => e.meta.number && (e.meta.shorts || []).length < 4 && !have.has(e.meta.number)).sort((a, b) => b.meta.number - a.meta.number).slice(0, 3);
  if (!targets.length) return 0;
  const sys = `You are the show's social editor. ${VOICE}\n\nFrom the transcript, pick 6 clip moments (20–60 seconds each) that work without the episode: a clear claim, a surprising reframe, a concrete tip, or a personal line. For each moment give the start time as m:ss from the paragraph timestamps, one line on why it travels, and a hook per platform:\n- youtube: a Shorts title, under 70 characters, then 2 hashtags.\n- instagram: a Reels caption first line, under 90 characters, no hashtags.\n- tiktok: an on-screen hook, under 50 characters.\nFollow the playbook below, and copy how sadie edited past drafts. Return markdown only, exactly:\n\n### moment N · m:ss\nwhy: …\n- [youtube] …\n- [instagram] …\n- [tiktok] …`;
  let added = 0, blocks = '';
  for (const ep of targets) {
    const rec = JSON.parse(fs.readFileSync(path.join(INDEX_DIR, 'episodes', `ep-${ep.meta.number}.json`), 'utf8'));
    const paras = ((rec.transcript || {}).paragraphs || []).map((p) => `[${Math.floor(p.t / 60)}:${String(p.t % 60).padStart(2, '0')}] ${p.text}`).join('\n');
    if (!paras) continue;
    const user = `episode ${ep.meta.number}: ${ep.meta.title}\nformat: ${ep.meta.format || ''}; tags: ${(ep.meta.tags || []).join(', ')}\n\nplaybook:\n${playbookText || '(none yet: use clear, specific, second-person hooks)'}\n\nhow sadie edited past drafts (draft → posted):\n${(edits || []).filter((e) => e.edited).slice(-15).map((e) => `- ${e.draft} → ${e.posted}`).join('\n') || '(no edits yet)'}\n\ntranscript:\n${paras.slice(0, 120000)}`;
    try {
      const md = await claude(sys, user, 2500);
      blocks += `\n## ep ${ep.meta.number} · ${ep.meta.title}\n\n${md.trim()}\n`;
      added++;
    } catch (e) { console.error(`social: drafts for ${ep.meta.number} failed: ${e.message}`); }
  }
  if (added) {
    const header = existing.trim() ? existing.trimEnd() + '\n' : `# social drafts\n\nHooks for the newest episodes, one block per clip moment. Edit the lines you would actually post; leave the \`- [platform]\` prefix in place. When a post goes out its title is matched back here and the change is kept in edits.json, which the next run learns from. Delete a block once the episode is done.\n`;
    fs.writeFileSync(DRAFTS, header + blocks);
  }
  return added;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const episodes = readEpisodes();
  const epByNumber = Object.fromEntries(episodes.map((e) => [e.meta.number, e.meta]));
  const minisFile = path.join(INDEX_DIR, 'minis.json');
  const minis = fs.existsSync(minisFile) ? JSON.parse(fs.readFileSync(minisFile, 'utf8')).minis || [] : [];
  const snaps = loadSnapshots();
  const yt = youtubePosts(episodes, minis, snaps);
  const posts = [...yt, ...importedPosts(episodes, yt)];
  const baselines = annotate(posts, epByNumber);
  const withStats = posts.filter((p) => p.stats && p.stats.views != null).length;
  fs.writeFileSync(path.join(OUT, 'posts.json'), JSON.stringify({ generatedAt: new Date().toISOString(), snapshots: snaps.length, posts: posts.length, with_stats: withStats, baselines, posts_list: posts }, null, 1) + '\n');
  console.log(`social: ${posts.length} posts (${yt.length} youtube, ${posts.length - yt.length} imported), ${withStats} with stats, ${snaps.length} snapshot(s)`);
  const edits = recordEdits(posts);
  const ins = insights(posts, baselines);
  let pb = null;
  const liftCount = posts.filter((p) => p.lift != null).length;
  if (KEY && liftCount >= 20) { try { pb = await playbook(ins, edits); } catch (e) { console.error('social: playbook failed: ' + e.message); } }
  else if (liftCount < 20) console.log(`social: ${liftCount} posts with a lift; the playbook needs 20 (stats-only insights written)`);
  fs.writeFileSync(path.join(OUT, 'insights.json'), JSON.stringify(ins, null, 1) + '\n');
  fs.writeFileSync(path.join(OUT, 'insights.md'), insightsMarkdown(ins, pb));
  if (KEY) { const n = await drafts(episodes, posts, pb, edits); if (n) console.log(`social: drafts written for ${n} episode(s) -> index/social/drafts-review.md`); }
  else console.log('social: ANTHROPIC_API_KEY not set; no playbook or drafts');
}
main().catch((err) => { console.error(err); process.exit(1); });

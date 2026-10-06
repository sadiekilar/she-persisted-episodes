/* she persisted - episode page. Loaded site-wide from Squarespace Code Injection; it only acts on
   /episodes/<slug> posts, where it re-renders the post into the episode layout from
   index/episodes.json + index/episodes/ep-NNN.json and hides (never removes) Squarespace's own post.
   This file is plain ASCII on purpose. */
(function () {
  var CFG = {
    PAGES_BASE: 'https://sadiekilar.github.io/she-persisted-episodes/',
    COLLECTION: '/episodes',
    SITE_NAME: 'she persisted',
    SOCIAL: {
      instagram: 'https://www.instagram.com/shepersistedpodcast/',
      tiktok: 'https://www.tiktok.com/@shepersistedpodcast',
      youtube: 'https://www.youtube.com/@ShePersistedPodcast'
    },
    LLC: 'She Persisted LLC',
    CACHE_KEY: 'sp:episodes:v1',
    CACHE_TTL: 60 * 60 * 1000,
    slug: null // set by the local preview; on the site it comes from the address
  };
  var over = window.SP_EPISODE_CONFIG || {};
  for (var k in over) CFG[k] = over[k];
  if (window.__spEpisodeLoaded) return;
  window.__spEpisodeLoaded = true;

  var ICONS = 'https://cdn.jsdelivr.net/npm/simple-icons@13/icons/';
  var SHARE_ICON = 'https://cdn.jsdelivr.net/npm/lucide-static@0.452.0/icons/share.svg';

  // ---------- which post? ----------
  var wrapper = document.querySelector('.blog-item-wrapper');
  var m = new RegExp('^' + CFG.COLLECTION.replace(/[/.]/g, '\\$&') + '/([^/?#]+)/?$').exec(location.pathname);
  var slug = CFG.slug || (m && decodeURIComponent(m[1]));
  if (!wrapper || !slug) return;

  var html = document.documentElement;
  var mobile = window.matchMedia('(max-width:600px)');
  var reduced = window.matchMedia('(prefers-reduced-motion:reduce)');

  // ---------- styles ----------
  var css = [
    "@font-face{font-family:'SP Perfectly Nineties';src:url(" + CFG.PAGES_BASE + "site/assets/fonts/perfectly-nineties.otf) format('opentype');font-weight:400;font-style:normal;font-display:swap}",
    'html.sp-post-custom .blog-item-wrapper,html.sp-post-custom #itemPagination{display:none!important}',
    'section.sp-post-section{padding-right:0!important;padding-bottom:0!important;padding-left:0!important;min-height:0!important}',
    'section.sp-post-section>.content-wrapper{padding:0!important;max-width:none!important;width:100%!important}',
    '#sp-episode{container-type:inline-size;background:#f7f7ef;color:#740000;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.2;letter-spacing:-.44px;text-align:left;text-transform:none;-webkit-text-size-adjust:100%}',
    '#sp-episode .sp-in{--red:#740000;--cream:#f7f7ef;--ink:#1c1c1c;--hair:rgba(116,0,0,.2);--g:64px;--g:clamp(32px,4.444cqw,64px)}',
    '#sp-episode *,#sp-episode *::before,#sp-episode *::after{box-sizing:border-box}',
    '#sp-episode a{color:inherit;text-decoration:none;background:none;border:0;transition:opacity 150ms}',
    '#sp-episode a.sp-text:hover,#sp-episode .sp-badge:hover,#sp-episode .sp-poster:hover,#sp-episode .sp-social a:hover{opacity:.75}',
    '#sp-episode a:focus{outline:none}#sp-episode a:focus-visible,#sp-episode button:focus-visible{outline:2px solid currentColor;outline-offset:2px}',
    '#sp-episode img{display:block;max-width:none;margin:0;border:0}',
    '#sp-episode h1,#sp-episode h2,#sp-episode h3,#sp-episode p,#sp-episode ul,#sp-episode ol,#sp-episode blockquote{margin:0;padding:0;font-family:inherit;color:inherit;text-transform:none}',
    '#sp-episode .sp-glyph{display:inline-block;flex:none;background:currentColor;-webkit-mask:var(--icon) center/contain no-repeat;mask:var(--icon) center/contain no-repeat}',
    /* top: back link, header, player, notes */
    '#sp-episode .sp-top{display:flex;flex-direction:column;gap:36px;padding:40px var(--g) 0}',
    '#sp-episode .sp-back{display:inline-flex;align-items:center;gap:6px;align-self:flex-start;font-size:14px}',
    '#sp-episode .sp-back span{font-size:18px;line-height:1}',
    '#sp-episode .sp-head{display:flex;flex-direction:column;align-items:center;gap:16px;width:100%;max-width:860px;margin:0 auto;text-align:center}',
    '#sp-episode .sp-meta{display:flex;flex-direction:column;align-items:center;gap:6px;font-size:13px;letter-spacing:.04em;text-transform:uppercase}',
    '#sp-episode .sp-meta b{font-weight:700}',
    '#sp-episode .sp-topics{display:flex;flex-wrap:wrap;justify-content:center;gap:10px}',
    '#sp-episode .sp-topics i{font-style:normal;opacity:.5}',
    '#sp-episode h1{font-size:48px;font-size:clamp(30px,3.333cqw,48px);font-weight:700;line-height:1.02;letter-spacing:-.9px}',
    '#sp-episode .sp-player-wrap{display:flex;flex-direction:column;gap:16px;width:100%;max-width:1120px;margin:0 auto}',
    '#sp-episode .sp-player{position:relative;width:100%;aspect-ratio:16/9;border-radius:16px;overflow:hidden;background:#1c1c1c;isolation:isolate}',
    '#sp-episode .sp-player img,#sp-episode .sp-player iframe{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border:0}',
    '#sp-episode .sp-play{position:absolute;left:50%;top:50%;width:72px;height:72px;margin:-36px 0 0 -36px;padding:0;border:0;border-radius:50%;background:var(--cream);cursor:pointer;-webkit-appearance:none;appearance:none;display:flex;align-items:center;justify-content:center}',
    '#sp-episode .sp-play::after{content:"";display:block;width:0;height:0;margin-left:6px;border-left:24px solid var(--red);border-top:14px solid transparent;border-bottom:14px solid transparent}',
    '#sp-episode .sp-player-cap{position:absolute;left:20px;bottom:16px;color:var(--cream);font-size:13px;font-weight:700}',
    '#sp-episode .sp-listen{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:inline-flex;align-items:center;gap:10px;padding:14px 22px;border-radius:999px;background:var(--cream);color:var(--red);font-size:15px;font-weight:700;white-space:nowrap}',
    '#sp-episode .sp-listen .sp-glyph{width:20px;height:20px}',
    '#sp-episode .sp-spotify{width:100%;height:152px;border:0;border-radius:12px}',
    '#sp-episode .sp-audio{display:block;width:100%;height:44px}',
    '#sp-episode .sp-creators{display:block;width:100%;height:102px;border:0;border-radius:12px;overflow:hidden}',
    '#sp-episode .sp-notes{display:flex;flex-direction:column;gap:36px;width:100%;max-width:860px;margin:0 auto}',
    '#sp-episode .sp-desc{display:flex;flex-direction:column;gap:16px;font-size:18px;line-height:1.5;color:var(--ink)}',
    '#sp-episode .sp-desc b.sp-lead{color:var(--red);font-weight:700}',
    '#sp-episode .sp-desc a,#sp-episode .sp-mentioned a{color:var(--red);text-decoration:underline;text-underline-offset:3px}',
    '#sp-episode .sp-desc ul,#sp-episode .sp-desc ol,#sp-episode .sp-mentioned ul,#sp-episode .sp-mentioned ol{display:flex;flex-direction:column;gap:6px;padding-left:20px}',
    '#sp-episode .sp-desc li>p,#sp-episode .sp-mentioned li>p{display:inline}',
    '#sp-episode .sp-desc u,#sp-episode .sp-mentioned u{text-decoration:none}',
    '#sp-episode .sp-hr{height:1px;background:var(--hair)}',
    '#sp-episode .sp-badges{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}',
    '#sp-episode .sp-badges.sp-n3{grid-template-columns:repeat(3,minmax(0,1fr))}#sp-episode .sp-badges.sp-n2{grid-template-columns:repeat(2,minmax(0,1fr))}#sp-episode .sp-badges.sp-n1{grid-template-columns:minmax(0,1fr)}',
    '#sp-episode .sp-badge{display:flex;align-items:center;gap:14px;min-width:0;margin:0;padding:14px 16px;border:0;border-radius:12px;background:var(--red);color:var(--cream);font:inherit;letter-spacing:inherit;text-align:left;cursor:pointer;-webkit-appearance:none;appearance:none;transition:opacity 150ms}',
    '#sp-episode .sp-badge .sp-glyph{width:26px;height:26px}',
    '#sp-episode .sp-badge span{display:flex;flex-direction:column;min-width:0;line-height:1}',
    '#sp-episode .sp-badge small{font-size:11px;font-weight:400}',
    '#sp-episode .sp-badge strong{font-size:16px;font-weight:700;white-space:nowrap}',
    '#sp-episode .sp-mentioned{display:flex;flex-direction:column;gap:10px}',
    '#sp-episode .sp-mentioned h2{font-size:18px;font-weight:700}',
    '#sp-episode .sp-mentioned-body{display:flex;flex-direction:column;gap:12px;font-size:18px;line-height:1.5;color:var(--ink)}',
    /* quote band */
    '#sp-episode .sp-quote-wrap{padding-top:56px}',
    '#sp-episode .sp-quote{display:flex;justify-content:center;padding:56px var(--g);background:var(--red);color:var(--cream);text-align:center}',
    "#sp-episode .sp-quote blockquote{max-width:980px;font-family:'SP Perfectly Nineties','Perfectly Nineties',Georgia,serif;font-size:44px;font-size:clamp(28px,3.056cqw,44px);line-height:1.05;letter-spacing:-.05em}",
    /* transcript */
    '#sp-episode .sp-transcript{display:flex;flex-direction:column;gap:20px;width:100%;max-width:860px;margin:0 auto;padding:56px 0 0}',
    '#sp-episode .sp-transcript-wrap{padding:0 var(--g)}',
    '#sp-episode .sp-transcript h2{font-size:20px;font-weight:700}',
    '#sp-episode .sp-chapters{display:flex;flex-direction:column;border-bottom:1px solid var(--hair)}',
    '#sp-episode .sp-chapter{border-top:1px solid var(--hair)}',
    '#sp-episode .sp-chapter-head{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:14px 0;cursor:pointer}',
    '#sp-episode .sp-chapter-head h3{display:flex;gap:16px;align-items:baseline;font-size:17px;font-weight:700;line-height:1.35}',
    '#sp-episode .sp-stamp{flex:none;width:44px;font-size:12px;font-weight:700;line-height:1.8;letter-spacing:.04em;color:var(--red)}',
    '#sp-episode .sp-toggle{flex:none;margin:0;padding:0 2px;border:0;background:none;color:inherit;font:inherit;font-size:22px;line-height:1;cursor:pointer;-webkit-appearance:none;appearance:none}',
    '#sp-episode .sp-chapter-body{display:flex;flex-direction:column;gap:14px;padding:4px 0 22px}',
    '#sp-episode .sp-chapter:not(.sp-open) .sp-chapter-body{display:none}',
    '#sp-episode .sp-para{display:flex;gap:16px}',
    '#sp-episode .sp-para p{font-size:17px;line-height:1.6;color:var(--ink)}',
    '#sp-episode .sp-para p b{color:var(--red);font-weight:700}',
    '#sp-episode .sp-transcript.sp-nostamp .sp-stamp{display:none}',
    '#sp-episode .sp-copy{width:100%;max-width:860px;margin:0 auto;padding:24px 0 56px;font-size:13px;line-height:1.5;color:var(--ink);opacity:.75}',
    '#sp-episode .sp-copy-wrap{padding:0 var(--g)}',
    /* top moments */
    '#sp-episode .sp-moments{padding:48px var(--g);background:var(--red);color:var(--cream)}',
    '#sp-episode .sp-moments-in{display:flex;flex-direction:column;gap:18px;width:100%;max-width:1120px;margin:0 auto}',
    '#sp-episode .sp-moments-head{display:flex;justify-content:space-between;align-items:baseline}',
    '#sp-episode .sp-moments h2{font-size:20px;font-weight:700}',
    '#sp-episode .sp-social{display:flex;gap:10px;align-items:center}#sp-episode .sp-social a{display:flex}#sp-episode .sp-social .sp-glyph{width:18px;height:18px}',
    '#sp-episode .sp-posters{display:flex;gap:16px;overflow-x:auto;scrollbar-width:none;margin:0 calc(var(--g)*-1);padding:0 var(--g)}#sp-episode .sp-posters::-webkit-scrollbar{display:none}',
    '#sp-episode .sp-poster{position:relative;display:block;flex:none;width:173px;aspect-ratio:9/16;border-radius:12px;overflow:hidden;background:#1c1c1c;isolation:isolate}',
    '#sp-episode .sp-poster img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}',
    '#sp-episode .sp-poster i{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.8) 0%,rgba(0,0,0,0) 50%)}',
    '#sp-episode .sp-poster b{position:absolute;left:12px;right:12px;bottom:12px;color:var(--cream);font-size:14px;font-weight:700;line-height:1.3}',
    '#sp-episode .sp-poster small{position:absolute;right:10px;top:10px;color:var(--cream);font-size:12px;font-weight:700}',
    /* new episodes */
    '#sp-episode .sp-new{display:flex;flex-direction:column;gap:18px;padding:72px var(--g) 96px}',
    '#sp-episode .sp-new-head{display:flex;justify-content:space-between;align-items:baseline}',
    '#sp-episode .sp-new h2{font-size:28px;font-weight:700;line-height:1;letter-spacing:-.6px}#sp-episode .sp-new h2 span{font-weight:400}',
    '#sp-episode .sp-new-head>.sp-text{font-size:13px;opacity:.8}',
    '#sp-episode .sp-new-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px}',
    '#sp-episode .sp-card{display:flex;flex-direction:column}',
    '#sp-episode .sp-thumb{display:block;overflow:hidden;border-radius:16px;background:var(--cream);isolation:isolate}',
    '#sp-episode .sp-card img{width:100%;aspect-ratio:1;object-fit:cover;object-position:center 30%;filter:grayscale(1);transition:transform 300ms ease,filter 300ms ease}',
    '#sp-episode .sp-card-title{padding:12px 4px 0;font-size:16px;font-weight:700;line-height:1.2;color:var(--ink)}',
    '@media (hover:hover){#sp-episode .sp-card:hover img{transform:scale(1.05);filter:grayscale(0)}#sp-episode .sp-card:hover .sp-card-title{text-decoration:underline;text-decoration-thickness:1.5px;text-underline-offset:3px}}',
    '@media (prefers-reduced-motion:reduce){#sp-episode .sp-card:hover img{transform:none}}',
    /* mobile (390 design) */
    '@media (max-width:600px){',
    '#sp-episode .sp-in{--g:20px}',
    '#sp-episode .sp-top{gap:24px;padding:20px 20px 0}',
    '#sp-episode .sp-head{gap:14px}#sp-episode .sp-meta{font-size:12px;letter-spacing:.06em}#sp-episode .sp-topics{gap:8px}',
    '#sp-episode h1{font-size:30px;line-height:1.05;letter-spacing:-.7px}',
    '#sp-episode .sp-player{border-radius:12px}#sp-episode .sp-play{width:56px;height:56px;margin:-28px 0 0 -28px}#sp-episode .sp-play::after{margin-left:5px;border-left-width:18px;border-top-width:11px;border-bottom-width:11px}',
    '#sp-episode .sp-player-cap{left:14px;bottom:12px;font-size:12px}',
    '#sp-episode .sp-notes{gap:18px}#sp-episode .sp-desc{gap:14px;font-size:16px}',
    '#sp-episode .sp-badges,#sp-episode .sp-badges.sp-n3{grid-template-columns:1fr 1fr;gap:10px}',
    '#sp-episode .sp-badge{gap:14px;padding:12px 14px}#sp-episode .sp-badge .sp-glyph{width:22px;height:22px}#sp-episode .sp-badge strong{font-size:15px}',
    '#sp-episode .sp-mentioned h2,#sp-episode .sp-mentioned-body{font-size:16px}',
    '#sp-episode .sp-quote-wrap{padding-top:32px}#sp-episode .sp-quote{padding:40px 24px}#sp-episode .sp-quote blockquote{font-size:28px}',
    '#sp-episode .sp-transcript{padding-top:32px;gap:16px}',
    '#sp-episode .sp-chapter-head h3{gap:12px;font-size:15px}#sp-episode .sp-stamp{width:40px}#sp-episode .sp-para{gap:12px}#sp-episode .sp-para p{font-size:15px}',
    '#sp-episode .sp-copy{padding:20px 0 40px}',
    '#sp-episode .sp-moments{padding:36px 20px}#sp-episode .sp-poster{width:150px}',
    '#sp-episode .sp-new{gap:14px;padding:40px 20px 64px}#sp-episode .sp-new h2{font-size:22px;letter-spacing:-.44px}#sp-episode .sp-new-head>.sp-text{font-size:12px}',
    '#sp-episode .sp-new-grid{grid-template-columns:1fr 1fr;gap:12px}#sp-episode .sp-thumb{border-radius:14px}#sp-episode .sp-card-title{padding:8px 2px 0;font-size:14px}',
    '}'
  ].join('\n');

  // ---------- helpers ----------
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fmt(t) { t = Math.max(0, Math.round(t)); var h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), s = t % 60; return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(s).padStart(2, '0'); }
  function iso(t) { t = Math.max(0, Math.round(t)); return 'PT' + (Math.floor(t / 3600) ? Math.floor(t / 3600) + 'H' : '') + (Math.floor((t % 3600) / 60) ? Math.floor((t % 3600) / 60) + 'M' : '') + (t % 60) + 'S'; }
  function thumb(url, w) { return /squarespace-cdn\.com/.test(url || '') ? url.split('?')[0] + '?format=' + w : (url || ''); }
  function tagUrl(tag) { return CFG.COLLECTION + '?tag=' + encodeURIComponent(tag); }
  function glyph(url, cls) { return '<span class="sp-glyph' + (cls ? ' ' + cls : '') + '" style="--icon:url(' + url + ')" aria-hidden="true"></span>'; }
  function titleOf(t) { return String(t || '').replace(/^\s*\d+[.:]\s*/, ''); }
  function stripTags(h) { var d = document.createElement('div'); d.innerHTML = h || ''; return (d.textContent || '').replace(/\s+/g, ' ').trim(); }
  // Trusted markup from the post body (via the index): drop anything executable just in case.
  function safeHtml(h) { var d = document.createElement('div'); d.innerHTML = h || ''; [].forEach.call(d.querySelectorAll('script,style,iframe,object,embed'), function (n) { n.remove(); }); [].forEach.call(d.querySelectorAll('*'), function (n) { [].slice.call(n.attributes).forEach(function (a) { if (/^on/i.test(a.name) || (a.name === 'href' && /^\s*javascript:/i.test(a.value))) n.removeAttribute(a.name); }); }); return d.innerHTML; }
  // First sentence (through the first ? or ?!) of the description in bold red.
  function leadBold(h) {
    var d = document.createElement('div'); d.innerHTML = h;
    var p = d.querySelector('p'); if (!p) return d.innerHTML;
    var text = p.textContent || '';
    var i = text.search(/\?!?/); if (i < 0) return d.innerHTML;
    var end = i + (text[i + 1] === '!' ? 2 : 1);
    var walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT), seen = 0, node;
    while ((node = walker.nextNode())) {
      var len = node.nodeValue.length;
      if (seen + len >= end) {
        var cut = end - seen;
        var before = node.nodeValue.slice(0, cut), after = node.nodeValue.slice(cut);
        var b = document.createElement('b'); b.className = 'sp-lead';
        var range = document.createRange(); range.setStart(p, 0); range.setEnd(node, cut);
        b.appendChild(range.extractContents());
        p.insertBefore(b, p.firstChild);
        void before; void after;
        break;
      }
      seen += len;
    }
    return d.innerHTML;
  }

  function readCache() { try { var c = JSON.parse(localStorage.getItem(CFG.CACHE_KEY)); if (c && c.expires > Date.now() && c.data && c.data.episodes) return c.data; } catch (e) {} return null; }
  function writeCache(d) { try { localStorage.setItem(CFG.CACHE_KEY, JSON.stringify({ expires: Date.now() + CFG.CACHE_TTL, data: d })); } catch (e) {} }
  function getJson(url) { return fetch(url).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }); }

  // ---------- render ----------
  var root, inner, ep, index;
  function badge(href, icon, top, name, extra) {
    return '<a class="sp-badge" href="' + esc(href) + '" target="_blank" rel="noopener"' + (extra || '') + '>' + glyph(icon) + '<span><small>' + top + '</small><strong>' + name + '</strong></span></a>';
  }
  function transcriptHtml() {
    var paras = (ep.transcript && ep.transcript.paragraphs) || [];
    if (!paras.length) return '';
    var stamped = paras.some(function (p) { return p.t != null; });
    var chapters = stamped && ep.chapters && ep.chapters.length ? ep.chapters.slice().sort(function (a, b) { return a.t - b.t; }) : [];
    function para(p) {
      return '<div class="sp-para">' + (p.t != null ? '<a class="sp-stamp" href="#t=' + p.t + '" data-seek="' + p.t + '" title="play from ' + fmt(p.t) + '"><time datetime="' + iso(p.t) + '">' + fmt(p.t) + '</time></a>' : '<span class="sp-stamp"></span>') +
        '<p>' + (p.speaker ? '<b>' + esc(p.speaker) + ':</b> ' : '') + esc(p.text) + '</p></div>';
    }
    var sections = '';
    if (chapters.length) {
      var last = null;
      chapters.forEach(function (c, i) {
        var next = chapters[i + 1] ? chapters[i + 1].t : Infinity;
        var mine = paras.filter(function (p) { var t = p.t == null ? last : p.t; if (p.t != null) last = p.t; return t != null && t >= c.t && t < next; });
        sections += '<section class="sp-chapter' + (i === 0 ? ' sp-open' : '') + '"><div class="sp-chapter-head"><h3><a class="sp-stamp" href="#t=' + c.t + '" data-seek="' + c.t + '"><time datetime="' + iso(c.t) + '">' + fmt(c.t) + '</time></a><a href="#t=' + c.t + '" data-seek="' + c.t + '">' + esc(c.title) + '</a></h3><button type="button" class="sp-toggle" aria-expanded="' + (i === 0) + '" aria-label="' + (i === 0 ? 'collapse' : 'expand') + '">' + (i === 0 ? '\u2013' : '+') + '</button></div><div class="sp-chapter-body">' + mine.map(para).join('') + '</div></section>';
      });
    } else {
      sections = '<section class="sp-chapter sp-open"><div class="sp-chapter-body">' + paras.map(para).join('') + '</div></section>';
    }
    return '<div class="sp-transcript-wrap"><div class="sp-transcript' + (stamped ? '' : ' sp-nostamp') + '"><h2>transcript</h2><div class="sp-chapters">' + sections + '</div></div></div>';
  }
  function render() {
    var number = ep.number;
    var title = titleOf(ep.title);
    var yt = ep.youtube_id;
    var cap = ep.duration_sec ? (yt ? 'youtube' : 'audio') + ' \u00b7 ' + fmt(ep.duration_sec) : '';
    var badges = [];
    if (yt) badges.push(badge('https://www.youtube.com/watch?v=' + yt, ICONS + 'youtube.svg', 'watch &amp; listen on', 'youtube'));
    var spotifyUrl = ep.spotify_episode_id ? 'https://open.spotify.com/episode/' + ep.spotify_episode_id : ep.creators_embed_url ? ep.creators_embed_url.replace('/embed/', '/') : '';
    if (spotifyUrl) badges.push(badge(spotifyUrl, ICONS + 'spotify.svg', 'watch &amp; listen on', 'spotify'));
    if (ep.apple_episode_url) badges.push(badge(ep.apple_episode_url, ICONS + 'applepodcasts.svg', 'listen on', 'apple podcasts'));
    badges.push('<button type="button" class="sp-badge sp-share">' + glyph(SHARE_ICON) + '<span><small>share</small><strong>the episode</strong></span></button>');
    var others = index.episodes.filter(function (e) { return e.number !== number; }).sort(function (a, b) { return b.number - a.number; }).slice(0, 4);

    inner.innerHTML =
      '<div class="sp-top">' +
        '<a class="sp-back sp-text" href="' + esc(CFG.COLLECTION) + '"><span>\u2039</span>episodes</a>' +
        '<header class="sp-head"><div class="sp-meta"><b>episode ' + number + '</b>' + (ep.tags.length ? '<span class="sp-topics">' + ep.tags.map(function (t) { return '<a class="sp-text" href="' + esc(tagUrl(t)) + '" title="all ' + esc(t) + ' episodes">' + esc(t) + '</a>'; }).join('<i>\u00b7</i>') + '</span>' : '') + '</div><h1>' + esc(title) + '</h1></header>' +
        '<div class="sp-player-wrap">' +
          (yt
            ? '<div class="sp-player sp-yt"><img src="https://i.ytimg.com/vi/' + esc(yt) + '/maxresdefault.jpg" alt="" onerror="this.onerror=null;this.src=\'https://i.ytimg.com/vi/' + esc(yt) + '/hqdefault.jpg\'"><button type="button" class="sp-play" aria-label="play"></button>' + (cap ? '<span class="sp-player-cap">' + cap + '</span>' : '') + '</div>'
            : '<div class="sp-player"><img src="' + esc(thumb(ep.image, '1500w')) + '" alt="">' + (spotifyUrl ? '<a class="sp-listen" href="' + esc(spotifyUrl) + '" target="_blank" rel="noopener">' + glyph(ICONS + 'spotify.svg') + 'listen on spotify</a>' : ep.apple_episode_url ? '<a class="sp-listen" href="' + esc(ep.apple_episode_url) + '" target="_blank" rel="noopener">' + glyph(ICONS + 'applepodcasts.svg') + 'listen on apple podcasts</a>' : '') + '</div>' +
              // the player under the photo: the post's Spotify for Creators embed, else a Spotify episode embed, else the plain audio
              (ep.creators_embed_url ? '<iframe class="sp-creators" src="' + esc(ep.creators_embed_url) + '" loading="lazy" title="spotify player"></iframe>'
                : ep.spotify_episode_id ? '<iframe class="sp-spotify" src="https://open.spotify.com/embed/episode/' + esc(ep.spotify_episode_id) + '?theme=0" loading="lazy" allow="encrypted-media" title="spotify player"></iframe>'
                : ep.audio_url ? '<audio class="sp-audio" controls preload="none" src="' + esc(ep.audio_url) + '"></audio>' : '')) +
        '</div>' +
        '<div class="sp-notes">' +
          (ep.description_html ? '<div class="sp-desc">' + leadBold(safeHtml(ep.description_html)) + '</div><div class="sp-hr"></div>' : '') +
          '<div class="sp-badges sp-n' + badges.length + '">' + badges.join('') + '</div>' +
          (ep.mentioned_html ? '<div class="sp-hr"></div><div class="sp-mentioned"><h2>mentioned:</h2><div class="sp-mentioned-body">' + safeHtml(ep.mentioned_html) + '</div></div>' : '') +
        '</div>' +
      '</div>' +
      (ep.quote ? '<div class="sp-quote-wrap"><div class="sp-quote"><blockquote>' + esc(ep.quote) + '</blockquote></div></div>' : '') +
      transcriptHtml() +
      '<div class="sp-copy-wrap"><p class="sp-copy">\u00a9 ' + new Date().getFullYear() + ' ' + esc(CFG.LLC) + '. This podcast is copyrighted subject matter owned by ' + esc(CFG.LLC) + ' and ' + esc(CFG.LLC) + ' reserves all rights in and to the podcast. Any use without ' + esc(CFG.LLC) + '\u2019s express prior written consent is prohibited.</p></div>' +
      (ep.shorts && ep.shorts.length ? '<div class="sp-moments"><div class="sp-moments-in"><div class="sp-moments-head"><h2>top moments</h2><div class="sp-social">' +
        ['instagram', 'tiktok', 'youtube'].map(function (s) { return CFG.SOCIAL[s] ? '<a href="' + esc(CFG.SOCIAL[s]) + '" target="_blank" rel="noopener" title="' + s + '">' + glyph(ICONS + s + '.svg') + '</a>' : ''; }).join('') +
        '</div></div><div class="sp-posters">' + ep.shorts.map(function (s) {
          return '<a class="sp-poster" href="https://www.youtube.com/shorts/' + esc(s.youtube_id) + '" target="_blank" rel="noopener"><img src="' + esc(s.thumbnail_url) + '" alt="" loading="lazy"><i></i><b>' + esc(s.title) + '</b>' + (s.duration_sec ? '<small>' + fmt(s.duration_sec) + '</small>' : '') + '</a>';
        }).join('') + '</div></div></div>' : '') +
      (others.length ? '<div class="sp-new"><div class="sp-new-head"><h2><a class="sp-text" href="' + esc(CFG.COLLECTION) + '?view=all">new episodes <span>\u203a</span></a></h2><a class="sp-text" href="' + esc(CFG.COLLECTION) + '?view=all">see all</a></div><div class="sp-new-grid">' + others.map(function (e) {
        return '<a class="sp-card" href="' + esc(e.url) + '"><span class="sp-thumb"><img src="' + esc(thumb(e.image, mobile.matches ? '750w' : '1000w')) + '" alt="" loading="lazy"></span><span class="sp-card-title">' + esc(e.title) + '</span></a>';
      }).join('') + '</div></div>' : '');

    jsonLd();
    wire();
  }

  // ---------- structured data ----------
  function jsonLd() {
    var paras = (ep.transcript && ep.transcript.paragraphs) || [];
    var data = {
      '@context': 'https://schema.org', '@type': 'PodcastEpisode',
      name: titleOf(ep.title), episodeNumber: ep.number, datePublished: ep.date, url: ep.url,
      description: stripTags(ep.description_html) || ep.summary || undefined,
      partOfSeries: { '@type': 'PodcastSeries', name: CFG.SITE_NAME, url: location.origin },
      image: ep.image || undefined,
      timeRequired: ep.duration_sec ? iso(ep.duration_sec) : undefined
    };
    if (ep.youtube_id) data.associatedMedia = { '@type': 'VideoObject', name: titleOf(ep.title), embedUrl: 'https://www.youtube.com/embed/' + ep.youtube_id, thumbnailUrl: 'https://i.ytimg.com/vi/' + ep.youtube_id + '/hqdefault.jpg', uploadDate: ep.date, duration: ep.duration_sec ? iso(ep.duration_sec) : undefined };
    else if (ep.audio_url) data.associatedMedia = { '@type': 'AudioObject', contentUrl: ep.audio_url, duration: ep.duration_sec ? iso(ep.duration_sec) : undefined };
    if (paras.length) data.transcript = paras.map(function (p) { return (p.speaker ? p.speaker + ': ' : '') + p.text; }).join('\n');
    var s = document.createElement('script'); s.type = 'application/ld+json'; s.textContent = JSON.stringify(data); document.head.appendChild(s);
  }

  // ---------- player + interactions ----------
  var player = null, playerReady = false, pending = null;
  function loadYouTubeApi(cb) {
    if (window.YT && window.YT.Player) return cb();
    var prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () { if (prev) prev(); cb(); };
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) { var s = document.createElement('script'); s.src = 'https://www.youtube.com/iframe_api'; document.head.appendChild(s); }
  }
  function ensurePlayer(then) {
    if (player && playerReady) return then();
    pending = then;
    if (player) return;
    var box = inner.querySelector('.sp-player.sp-yt');
    if (!box) return;
    loadYouTubeApi(function () {
      var holder = document.createElement('div'); box.appendChild(holder);
      player = new YT.Player(holder, {
        videoId: ep.youtube_id, playerVars: { rel: 0, playsinline: 1, modestbranding: 1 },
        events: { onReady: function () { playerReady = true; [].forEach.call(box.querySelectorAll('img,.sp-play,.sp-player-cap'), function (n) { n.remove(); }); if (pending) { var f = pending; pending = null; f(); } } }
      });
    });
  }
  function seek(t) {
    ensurePlayer(function () {
      player.seekTo(t, true); player.playVideo();
      if (mobile.matches) { var top = inner.querySelector('.sp-player').getBoundingClientRect().top + window.pageYOffset - 70; window.scrollTo({ top: Math.max(0, top), behavior: reduced.matches ? 'auto' : 'smooth' }); }
    });
  }
  function wire() {
    var play = inner.querySelector('.sp-play');
    if (play) play.addEventListener('click', function () { ensurePlayer(function () { player.playVideo(); }); });
    inner.addEventListener('click', function (e) {
      var share = e.target.closest('.sp-share');
      if (share) {
        var data = { title: ep.title, url: ep.url };
        if (navigator.share) navigator.share(data).catch(function () {});
        else if (navigator.clipboard) navigator.clipboard.writeText(ep.url).then(function () { var s = share.querySelector('strong'); var was = s.textContent; s.textContent = 'link copied'; setTimeout(function () { s.textContent = was; }, 1600); });
        return;
      }
      var toggle = e.target.closest('.sp-toggle');
      if (toggle) {
        var sec = toggle.closest('.sp-chapter'); var open = !sec.classList.contains('sp-open');
        sec.classList.toggle('sp-open', open); toggle.textContent = open ? '\u2013' : '+'; toggle.setAttribute('aria-expanded', open); toggle.setAttribute('aria-label', open ? 'collapse' : 'expand');
        return;
      }
      var s = e.target.closest('[data-seek]');
      if (s && inner.querySelector('.sp-player.sp-yt')) {
        e.preventDefault();
        var sec2 = s.closest('.sp-chapter'); if (sec2 && !sec2.classList.contains('sp-open')) { sec2.classList.add('sp-open'); var tg = sec2.querySelector('.sp-toggle'); if (tg) { tg.textContent = '\u2013'; tg.setAttribute('aria-expanded', 'true'); } }
        seek(+s.getAttribute('data-seek'));
      }
    });
    // #t=123 in the address opens at that point once the visitor presses play
    var tm = /[#&]t=(\d+)/.exec(location.hash);
    if (tm && play) play.addEventListener('click', function once() { play.removeEventListener('click', once); ensurePlayer(function () { player.seekTo(+tm[1], true); }); }, true);
  }

  function fullBleed() {
    root.style.width = ''; root.style.marginLeft = '';
    var parent = root.parentElement; if (!parent) return;
    var vw = html.clientWidth;
    var left = parent.getBoundingClientRect().left + parseFloat(getComputedStyle(parent).paddingLeft || 0);
    if (Math.abs(left) > 0.5 || Math.abs(parent.clientWidth - vw) > 0.5) { root.style.width = vw + 'px'; root.style.marginLeft = -left + 'px'; }
  }

  // ---------- go ----------
  var cached = readCache();
  (cached ? Promise.resolve(cached) : getJson(CFG.PAGES_BASE + 'index/episodes.json').then(function (d) { writeCache(d); return d; })).then(function (data) {
    index = data;
    var hit = data.episodes.filter(function (e) { return e.slug === slug || (e.url || '').replace(/\/+$/, '').split('/').pop() === slug; })[0];
    if (!hit) throw new Error('not in index');
    return getJson(CFG.PAGES_BASE + 'index/episodes/ep-' + String(hit.number).padStart(3, '0') + '.json');
  }).then(function (data) {
    ep = data;
    var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);
    root = document.createElement('div'); root.id = 'sp-episode';
    inner = document.createElement('div'); inner.className = 'sp-in'; root.appendChild(inner);
    var section = wrapper.closest('section') || wrapper.parentElement;
    if (section.tagName === 'SECTION') section.classList.add('sp-post-section');
    var mount = (section.querySelector('.content-wrapper') || section);
    mount.insertBefore(root, mount.firstChild);
    render();
    html.classList.add('sp-post-custom');
    fullBleed();
    window.addEventListener('resize', fullBleed);
  }).catch(function () { /* leave Squarespace's own post showing */ });
})();

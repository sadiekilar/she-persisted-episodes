# she-persisted-episodes

Generated archive of every she persisted episode. Squarespace stays the only place episodes are edited; this repo is a cache and index, refreshed nightly.

It feeds three things:

1. **The episodes page** on shepersistedpodcast.com: `site/embed.html`, pasted into a Code Block, reads `index/episodes.json` from GitHub Pages.
2. **Every episode post**: `site/episode.js`, loaded site-wide from Code Injection, re-renders each `/episodes/<slug>` post into the episode layout from `index/episodes/ep-NNN.json`.
3. **A Claude Project**: `index/summaries.md` plus one transcript file per episode in `episodes/`.

```
episodes/ep-NNN.md        one file per episode: front matter + show notes + transcript
index/episodes.json       what the website reads (no transcripts)
index/summaries.md        Claude Project knowledge
index/backfill.md         episodes whose transcript needs a Descript re-export
index/collection.json     tag order from Squarespace
index/episodes/ep-NNN.json one file per episode for the episode page (notes, links, chapters, transcript)
index/completeness.md     which episodes have everything the full episode page uses, and what's missing
index/quotes-review.md    pull quotes awaiting approval (tick a box, commit)
index/section-variants.md posts whose show-notes headings the extractor didn't recognise
index/youtube-unmatched.md channel videos that couldn't be paired with an episode
scripts/import.js         Squarespace → episodes/*.md (with scripts/sections.js: description, bullets, mentioned, video ids)
scripts/rss-sync.js       show RSS + Apple lookup → audio, duration, Apple episode links
scripts/youtube-sync.js   YouTube Data API → video ids, durations, Shorts per episode
scripts/summarize.js      summaries / guests / quotes via the Claude API
scripts/chapters.js       aligns "we talk about" bullets to transcript timestamps via the Claude API
scripts/approve-quotes.js applies ticks in quotes-review.md
scripts/audit.js          transcript quality flags → backfill.md; page completeness → completeness.md
scripts/build-index.js    episodes.json, summaries.md, index/episodes/*.json, quotes-review.md
site/embed.html           the Squarespace Code Block (browse + archive pages)
site/episode.js           the episode page (Code Injection)
site/preview.html         local harness for embed.html
site/preview-episode.html local harness for episode.js (?slug=263)
site/assets/              thumbnails, topic photos and the brand font
```

## Running it

Node 20+, no dependencies.

```bash
npm run refresh      # new posts → audit → summarize → index (what the nightly job runs)
npm run import:all   # full re-sync of every post (picks up tag or title edits on old episodes)
npm run preview      # then open http://localhost:4173/site/preview.html
```

`summarize` and `chapters` need `ANTHROPIC_API_KEY`, `youtube` needs `YOUTUBE_API_KEY`; each skips itself without its key. They only touch episodes that still lack their output. Set `SUMMARY_MODEL` to use a different model.

The nightly job only looks at the newest page of posts. If you change tags or titles on older episodes in Squarespace, run `npm run import:all && npm run build` (or trigger it by hand) to pick them up.

## One-time setup

1. **GitHub**: create a public repo named `she-persisted-episodes`, push this folder to `main`.
2. **Pages**: Settings → Pages → deploy from branch `main`, folder `/ (root)`.
3. **Secrets**: Settings → Secrets and variables → Actions → add `ANTHROPIC_API_KEY` and `YOUTUBE_API_KEY`.
4. **Embed**: in `site/embed.html`, `PAGES_BASE` is set to `https://sadiekilar.github.io/she-persisted-episodes/`; change it if the repo moves. Commit and push.
5. **Squarespace, episodes page**: edit the `/episodes` page, add a section above the blog list, add a Code Block (mode HTML, "display source" off) and paste in all of `site/embed.html`. Scripts in Code Blocks do not run while you are logged in and editing; check the result in a private window.
6. **Squarespace, episode posts**: Settings → Developer tools → Code Injection → Footer, paste:

   ```html
   <script defer src="https://sadiekilar.github.io/she-persisted-episodes/site/episode.js"></script>
   ```

   It runs on every page but only acts on `/episodes/<slug>` posts. Squarespace's own post stays in the page, hidden; if the data can't load, the original post shows as before.

### How the embed shares the page with the blog list

The Code Block lives on the blog page itself, so no URLs change. The embed draws three views and swaps between them without reloading:

- `/episodes`: the browse page (hero, shelves, topics, search).
- `/episodes?view=all`: the archive, every episode in a list with a topic sidebar.
- `/episodes?tag=anxiety` (and Squarespace's own `/episodes/tag/anxiety` links): the archive filtered to one tag.

Squarespace's own post grid stays hidden on all three. It only shows for Squarespace's paginated, category or author views (`?offset=`, `?category=`, `?author=`), or if the index and the Squarespace fallback both fail to load.

Hiding the stock grid relies on the template's `.collection-content-wrapper`, `.blog-list-pagination` and `#itemPagination` names (see the first lines of the `<style>` block). If a Squarespace update renames them, that is the place to fix.

### The episode page

Each post is rebuilt from `index/episodes/ep-NNN.json`: back link, episode number and topics, title, player, description (first sentence in red), platform badges, "mentioned", approved pull quote, transcript, copyright, "top moments" (Shorts) and "new episodes". Sections whose data is missing are left out rather than shown empty:

- no YouTube video → the post photo with a "listen on spotify / apple podcasts" button, and the Spotify player when there is one;
- no timestamps → transcript without the time column; no chapters → one open section instead of the accordion;
- no approved quote → no quote band; no Shorts → no "top moments".

`index/completeness.md` lists what each episode is missing and what would unblock the most pages.

**Pull quotes** go live only after approval. The refresh job keeps a GitHub issue, "pull quotes awaiting approval", listing every pending episode with a clickable checkbox per candidate quote (and "none"). Tick one per episode; the next refresh applies the ticks and removes those episodes from the issue. `index/quotes-review.md` is the same list as a file, for editing by hand.

**Tags** for posts that have none in Squarespace are suggested by `tags.js` from the existing tag list and kept in the repo only (`tags_override`, listed in `index/tags-review.md`, editable). Squarespace tags always win once a post has any.

**Chapters** need "we/i talk about" bullets and a transcript with timestamps (Descript's `[00:27:00]` markers); `chapters.js` then asks Claude where each bullet starts. Timestamps are the usual blocker, see `completeness.md`.

## Transcript backfill

`index/backfill.md` lists episodes with no usable transcript. To fix one: paste the Descript export under `## transcript` in its `episodes/ep-NNN.md` and set `transcript_source: descript`. The importer never overwrites a file marked `descript`.

## Claude Project

- Knowledge files: `index/summaries.md` and `index/episodes.json`.
- Connect this GitHub repo so `episodes/ep-NNN.md` can be opened on demand.
- Project instructions:
  - cite the episode number and title for every claim.
  - check summaries first, then open the transcript.
  - if it isn't in the archive, say so; don't guess.

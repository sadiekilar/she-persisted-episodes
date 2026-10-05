# she-persisted-episodes

Generated archive of every she persisted episode. Squarespace stays the only place episodes are edited; this repo is a cache and index, refreshed nightly.

It feeds two things:

1. **The episodes page** on shepersistedpodcast.com: `site/embed.html`, pasted into a Code Block, reads `index/episodes.json` from GitHub Pages.
2. **A Claude Project**: `index/summaries.md` plus one transcript file per episode in `episodes/`.

```
episodes/ep-NNN.md        one file per episode: front matter + show notes + transcript
index/episodes.json       what the website reads (no transcripts)
index/summaries.md        Claude Project knowledge
index/backfill.md         episodes whose transcript needs a Descript re-export
index/collection.json     tag order from Squarespace
scripts/import.js         Squarespace → episodes/*.md
scripts/audit.js          transcript quality flags → backfill.md
scripts/summarize.js      summaries / guests / quotes via the Claude API
scripts/build-index.js    episodes.json + summaries.md
site/embed.html           the Squarespace Code Block
site/preview.html         local harness for embed.html
site/assets/              thumbnails and topic photos the embed loads
```

## Running it

Node 20+, no dependencies.

```bash
npm run refresh      # new posts → audit → summarize → index (what the nightly job runs)
npm run import:all   # full re-sync of every post (picks up tag or title edits on old episodes)
npm run preview      # then open http://localhost:4173/site/preview.html
```

`summarize` needs `ANTHROPIC_API_KEY` and skips itself without one. It only touches episodes that have no summary yet. Set `SUMMARY_MODEL` to use a different model.

The nightly job only looks at the newest page of posts. If you change tags or titles on older episodes in Squarespace, run `npm run import:all && npm run build` (or trigger it by hand) to pick them up.

## One-time setup

1. **GitHub**: create a public repo named `she-persisted-episodes`, push this folder to `main`.
2. **Pages**: Settings → Pages → deploy from branch `main`, folder `/ (root)`.
3. **Secret**: Settings → Secrets and variables → Actions → add `ANTHROPIC_API_KEY`.
4. **Embed**: in `site/embed.html`, `PAGES_BASE` is set to `https://sadiekilar.github.io/she-persisted-episodes/`; change it if the repo moves. Commit and push.
5. **Squarespace**: edit the `/episodes` page, add a section above the blog list, add a Code Block (mode HTML, "display source" off) and paste in all of `site/embed.html`. Scripts in Code Blocks do not run while you are logged in and editing; check the result in a private window.

### How the embed shares the page with the blog list

The Code Block lives on the blog page itself, so no URLs change. The embed draws three views and swaps between them without reloading:

- `/episodes`: the browse page (hero, shelves, topics, search).
- `/episodes?view=all`: the archive, every episode in a list with a topic sidebar.
- `/episodes?tag=anxiety` (and Squarespace's own `/episodes/tag/anxiety` links): the archive filtered to one tag.

Squarespace's own post grid stays hidden on all three. It only shows for Squarespace's paginated, category or author views (`?offset=`, `?category=`, `?author=`), or if the index and the Squarespace fallback both fail to load.

Hiding the stock grid relies on the template's `.collection-content-wrapper`, `.blog-list-pagination` and `#itemPagination` names (see the first lines of the `<style>` block). If a Squarespace update renames them, that is the place to fix.

## Transcript backfill

`index/backfill.md` lists episodes with no usable transcript. To fix one: paste the Descript export under `## transcript` in its `episodes/ep-NNN.md` and set `transcript_source: descript`. The importer never overwrites a file marked `descript`.

## Claude Project

- Knowledge files: `index/summaries.md` and `index/episodes.json`.
- Connect this GitHub repo so `episodes/ep-NNN.md` can be opened on demand.
- Project instructions:
  - cite the episode number and title for every claim.
  - check summaries first, then open the transcript.
  - if it isn't in the archive, say so; don't guess.

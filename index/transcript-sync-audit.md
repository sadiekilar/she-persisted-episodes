# transcript sync audit

Read-only audit of whether the episode pages can highlight the current transcript paragraph and seek on click. Audited locally on 2026-10-06 against the 256 episodes in `episodes/` and `index/episodes/`.

Some of the prompt's assumptions are out of date, so the short answer first: **every episode already has a per-paragraph timestamp**, the transcripts come from the Flightcast feed (not blog/Descript/YouTube), and the page already seeks on click. The only missing piece is the highlight itself, which is a page-script change, not a data one.

## 1. schema

Each episode has `index/episodes/ep-NNN.json` (there is no `index/transcripts/` directory; the per-episode file carries the transcript). Shape of `ep-263.json`, trimmed:

```json
{
  "number": 263,
  "title": "263. what i wish i knew when i didn't want to be alive",
  "slug": "263",
  "youtube_id": "…",
  "audio_url": "https://….mp3",
  "duration_sec": 1534,
  "chapters": [
    { "t": 53,  "title": "when i was hospitalized for depression at age 13" },
    { "t": 180, "title": "what to do if you’re feeling hopeless about your future" }
  ],
  "transcript": {
    "source": "flightcast",
    "status": "full",
    "paragraphs": [
      { "t": 0,  "speaker": null, "text": "But I truly believed that I wasn't capable of happiness. …" },
      { "t": 14, "speaker": null, "text": "But what I do want you to do is leave enough room for the po…" }
    ]
  }
}
```

`t` is an integer number of seconds on every paragraph (90 paragraphs in this record). The paragraphs are built by `scripts/flightcast.js` from the feed's VTT: cues are grouped into a paragraph at a pause longer than 1.2 s, every 4 cues, or at about 60 words, and the paragraph takes the first cue's start time. `speaker` is null for Flightcast transcripts (the VTT has no speaker labels).

## 2. coverage

| state | episodes |
| --- | ---: |
| has a transcript | 256 of 256 |
| every paragraph has a numeric `t` | **256** |
| some paragraphs have `t` | 0 |
| `t` null everywhere | 0 |
| no transcript | 0 |
| has `chapters[]`, all with numeric `t` | 47 (7 from feed show notes, 40 aligned by `chapters.js`) |

By `transcript.source`: flightcast 256 (blog 0, descript 0, youtube 0 — the older blog-pasted transcripts were replaced wholesale once the Flightcast VTTs were available; `rss-sync.js --all` refetched every episode).
By `transcript_status`: full 256.

## 3. scripts

- `scripts/timestamps.js` does not exist and is not needed: timestamps arrive with the transcript in `rss-sync.js` (feed → `<podcast:transcript>` VTT → `[m:ss]` prefix on every paragraph in the episode file).
- `scripts/chapters.js` exists and runs nightly (`.github/workflows/refresh.yml` step `node scripts/chapters.js`, with `ANTHROPIC_API_KEY`). It aligns the post's "we talk about" bullets to paragraph timestamps. Backlog right now: 69 episodes have bullets but no chapters yet (they were cleared after the alignment threshold was raised; they regenerate on the next run), 140 older episodes have no bullets at all, so nothing to align. `gh` is not installed here, so the last run's log was not read; the last bot commit touching the index is `8bd3669 refresh episodes`.

## 4. raw inputs

- Flightcast VTT per episode, referenced by `transcript_url` in each `episodes/ep-NNN.md` (e.g. `https://rss.flightcast.com/transcripts/….vtt`), re-downloadable at any time. These are the source of truth.
- The episode files themselves: 256 of 256 bodies carry `[m:ss]` on every paragraph (the `[12:04]` pattern the prompt asks about), 0 use bare `12:04` or `(0:45)` forms.
- No Descript exports and no YouTube caption downloads on disk; there is no `uploads/` directory (`import.js` writes straight to `episodes/`).

## 5. serving

`scripts/build-index.js` writes `index/episodes/ep-NNN.json` for all 256 episodes with `transcript.paragraphs[].t` populated. `site/episode.js` fetches that file for the current `/episodes/<slug>` post and renders each paragraph with a timestamp link (`data-seek`); clicking it seeks the YouTube IFrame player (`seekTo`) or the audio player (`currentTime`). The audio player dispatches `sp-timeupdate {seconds}` on `window` on every `timeupdate` and listens for `sp-seek`. **Nothing listens to `sp-timeupdate` yet**, and the YouTube path has no polling of `getCurrentTime()`, so no paragraph is highlighted while playing.

## 6. granularity

Paragraph level only in the served JSON. The Flightcast VTT has cue-level timing (a cue every few seconds, which is what gets grouped into paragraphs); no word-level timing anywhere. Paragraph level is enough for highlight-and-seek.

## verdict

100% of episodes (256 of 256) could sync today: every paragraph has an integer `t`, the JSON is already served and already read by the page, and seek-on-click already works for both players. The single smallest step is in `site/episode.js`: listen for `sp-timeupdate` (audio) and poll `player.getCurrentTime()` about twice a second while the YouTube player is playing, then mark the last paragraph whose `t` is at or before the current time (also expanding its chapter and, optionally, uncapping the first chapter's preview). No pipeline change, no new data source, no new script.

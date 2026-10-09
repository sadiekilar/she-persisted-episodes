# analytics

Dated snapshots, never overwritten.

- youtube/YYYY-MM-DD.json — views/likes/comments per video, short and mini (nightly, analytics-youtube.js)
- flightcast/YYYY-MM-DD.json — total plays per episode from the Flightcast episode list (periodic)
- apple/YYYY-MM-DD-<range>.json — Apple Podcasts Connect per-episode listeners / engaged listeners / plays / consumption, converted by analytics-apple.js from imports/apple/ (all-time now and then; month on the 1st for the month just ended)
- apple/reviews.json — every written Apple review (title, text, rating, date, country), merged from imports/apple/reviews-<COUNTRY>-<date>.csv exports; qualitative input for topics and testimonials
- imports/ — CSV exports dropped in by hand (Spotify for Creators, Apple, Flightcast channel export), ingested by analytics-import.js

Rules
- Downloads/plays never include Shorts. YouTube episode views count only videos in the podcast playlist (PLGLC3-iJIHRQBUXr2D4FfHv7tCyn6wqyu); Shorts are reported as clips.
- Hosting: Spotify for Podcasters until 2026-07-14, Flightcast from 2026-07-15 (which imported the Spotify-era history). show-monthly.json (the hand-kept tracker) is the monthly record through 2026-04; Flightcast monthly figures apply from 2026-05. Flightcast lifetime numbers overlap the tracker and are never added to it.
- flightcast/<date>.json list snapshots are rounded and of mixed provenance: use for ranking and deltas, not totals.
- Apple has no analytics API (the Connect API only lists episodes). Apple plays are verified plays inside the Apple Podcasts app: a subset of RSS downloads, never added to the tracker or to Flightcast. Use for Apple-only ranking, engaged-listener share and consumption.

Apple monthly routine (first days of each month)
1. Open podcastsconnect.apple.com > Analytics > Episodes, set the range to Month (the month just ended).
2. Capture every row as `key|Mon D YYYY|listeners|engaged|plays|consumption` into `analytics/imports/apple/YYYY-MM-01-month.txt` (key = episode number, `M:` + mini title, `T:` + anything else); put the Overview KPIs on a `# show: followers N | listeners N | engaged N | plays N | hours N` line. Claude in Chrome does this from the open tab.
3. `node scripts/analytics-apple.js` writes `analytics/apple/YYYY-MM-01-month.json`; commit both files. Re-capture All Time a few times a year the same way (`-all-time`).


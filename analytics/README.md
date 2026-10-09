# analytics

Dated snapshots, never overwritten.

- youtube/YYYY-MM-DD.json — views/likes/comments per video, short and mini (nightly, analytics-youtube.js)
- flightcast/YYYY-MM-DD.json — total plays per episode from the Flightcast episode list (periodic)
- apple/YYYY-MM-DD-all-time.json — Apple Podcasts Connect per-episode lifetime listeners / engaged listeners / plays / consumption (Episodes table export)
- apple/show-monthly.json — Apple show by month since 2019-07: time listened, plays, listeners, engaged, followers (net/gross/unfollowers), time by follower state
- apple/episode-monthly.json — Apple plays / listeners / engaged / time per episode per month, all listeners and split following vs not following
- apple/reviews.json — every written Apple review (title, text, rating, date, country), merged from imports/apple/reviews-<COUNTRY>-<date>.csv exports; qualitative input for topics and testimonials
- imports/ — CSV exports dropped in by hand (Spotify for Creators, Apple, Flightcast channel export), ingested by analytics-import.js

Rules
- Downloads/plays never include Shorts. YouTube episode views count only videos in the podcast playlist (PLGLC3-iJIHRQBUXr2D4FfHv7tCyn6wqyu); Shorts are reported as clips.
- Hosting: Spotify for Podcasters until 2026-07-14, Flightcast from 2026-07-15 (which imported the Spotify-era history). show-monthly.json (the hand-kept tracker) is the monthly record through 2026-04; Flightcast monthly figures apply from 2026-05. Flightcast lifetime numbers overlap the tracker and are never added to it.
- flightcast/<date>.json list snapshots are rounded and of mixed provenance: use for ranking and deltas, not totals.
- Apple has no analytics API (the Connect API only lists episodes). Apple plays are verified plays inside the Apple Podcasts app: a subset of RSS downloads, never added to the tracker or to Flightcast. Use for Apple-only ranking, engaged-listener share and consumption.

Apple monthly routine (first days of each month, about five minutes)
1. In podcastsconnect.apple.com > Analytics, set the date range to the show's whole life (2017-09-19 to today) and use the export button on each page: Overview (Engagement Trends, Follower Trends, Time Listened by Follower State), Episodes (the table export, plus Episode Trends three times: all listeners, Following, Not Following), and Ratings & Reviews.
2. Drop the files into `analytics/imports/apple/` with the names analytics-apple.js lists in its header, dated with the export date (e.g. `engagement-trends-2026-11-01.csv`). Older dated copies can stay; the newest of each kind wins.
3. `node scripts/analytics-apple.js` rebuilds `analytics/apple/<date>-all-time.json`, `show-monthly.json`, `episode-monthly.json` and `reviews.json`; commit the imports and outputs.

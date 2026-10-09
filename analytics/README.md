# analytics

Dated snapshots, never overwritten.

- youtube/YYYY-MM-DD.json — views/likes/comments per video, short and mini (nightly, analytics-youtube.js)
- flightcast/YYYY-MM-DD.json — total plays per episode from the Flightcast episode list (periodic)
- imports/ — CSV exports dropped in by hand (Spotify for Creators, Apple, Flightcast channel export), ingested by analytics-import.js

Rules
- Downloads/plays never include Shorts. YouTube episode views count only videos in the podcast playlist (PLGLC3-iJIHRQBUXr2D4FfHv7tCyn6wqyu); Shorts are reported as clips.
- Hosting: Spotify for Podcasters until 2026-07-14, Flightcast from 2026-07-15 (which imported the Spotify-era history). show-monthly.json (the hand-kept tracker) is the monthly record through 2026-04; Flightcast monthly figures apply from 2026-05. Flightcast lifetime numbers overlap the tracker and are never added to it.
- flightcast/<date>.json list snapshots are rounded and of mixed provenance: use for ranking and deltas, not totals.

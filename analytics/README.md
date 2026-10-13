# analytics

Dated snapshots, never overwritten.

- youtube/YYYY-MM-DD.json — views/likes/comments per video, short and mini (nightly, analytics-youtube.js)
- flightcast/YYYY-MM-DD.json — total plays per episode from the Flightcast episode list (periodic)
- apple/YYYY-MM-DD-all-time.json — Apple Podcasts Connect per-episode lifetime listeners / engaged listeners / plays / consumption (Episodes table export)
- apple/show-monthly.json — Apple show by month since 2019-07: time listened, plays, listeners, engaged, followers (net/gross/unfollowers), time by follower state
- apple/episode-monthly.json — Apple plays / listeners / engaged / time per episode per month, all listeners and split following vs not following
- apple/reviews.json — every written Apple review (title, text, rating, date, country), merged from imports/apple/reviews-<COUNTRY>-<date>.csv exports; qualitative input for topics and testimonials
- spotify/show-daily.json, show-monthly.json — Spotify-only plays, audience, consumption hours, followers, impressions and new/returning listeners by day and month since 2019-07 (Spotify for Creators exports, analytics-spotify.js)
- spotify/episodes.json — per-episode Spotify-only plays, audience, watch time %, first-7-day completion, first-30-day discovery impressions, comments (the trends-chart exports stop at the 250 most recent items, so episodes 1–41 are absent)
- spotify/audience.json — Spotify listener geography, gender, age, weekly retention, top-10 lists, impressions by source
- events.json — dated context (hosting moves, platform features) to read the series against; add a row whenever something outside the content moves the numbers
- imports/social/<platform>-<date>.csv — Instagram, TikTok or X post exports (platform = instagram | tiktok | x); any CSV with post_id, date, caption/title, url, views/plays, likes, comments, shares, saves and an optional episode column
- imports/ — CSV exports dropped in by hand (Spotify for Creators, Apple, Flightcast channel export), ingested by analytics-import.js

Rules
- Downloads/plays never include Shorts. YouTube episode views count only videos in the podcast playlist (PLGLC3-iJIHRQBUXr2D4FfHv7tCyn6wqyu); Shorts are reported as clips.
- Hosting: Spotify for Podcasters until 2026-07-14, Flightcast from 2026-07-15 (which imported the Spotify-era history). show-monthly.json (the hand-kept tracker) is the monthly record through 2026-04; Flightcast monthly figures apply from 2026-05. Flightcast lifetime numbers overlap the tracker and are never added to it.
- flightcast/<date>.json list snapshots are rounded and of mixed provenance: use for ranking and deltas, not totals.
- Spotify for Creators plays are Spotify-only. Flightcast's Total Plays already include Spotify streams, and the tracker's RSS downloads include Spotify's feed pulls, so Spotify figures are never added to either. Use them for Spotify-only ranking, audience demographics, discovery (impressions by Home / Search / Library) and retention.
- Apple has no analytics API (the Connect API only lists episodes). Apple plays are verified plays inside the Apple Podcasts app: a subset of RSS downloads, never added to the tracker or to Flightcast. Use for Apple-only ranking, engaged-listener share and consumption.

Apple monthly routine (first days of each month, about five minutes)
1. In podcastsconnect.apple.com > Analytics, set the date range to the show's whole life (2017-09-19 to today) and use the export button on each page: Overview (Engagement Trends, Follower Trends, Time Listened by Follower State), Episodes (the table export, plus Episode Trends three times: all listeners, Following, Not Following), and Ratings & Reviews.
2. Drop the files into `analytics/imports/apple/` with the names analytics-apple.js lists in its header, dated with the export date (e.g. `engagement-trends-2026-11-01.csv`). Older dated copies can stay; the newest of each kind wins.
3. `node scripts/analytics-apple.js` rebuilds `analytics/apple/<date>-all-time.json`, `show-monthly.json`, `episode-monthly.json` and `reviews.json`; commit the imports and outputs.

Spotify monthly routine (same day as Apple)
1. In Spotify for Creators > Analytics, export with the date range set to all time where offered: Performance (daily plays/audience), Engagement (daily consumption/followers), each Trends chart (plays, audience, consumption, avg consumption, watch time %, comments, discovery impressions, completion rate), the top-10 lists and Episode completion rates. Export the ranged pages (impressions, retention, audience segments, geo, gender, age) for the month just ended.
2. Drop them into `analytics/imports/spotify/` under the names in analytics-spotify.js's header, then `node scripts/analytics-spotify.js`; commit imports and outputs.

Social posts and framings (scripts/social.js, nightly)
- index/social/posts.json: every YouTube Short, mini and episode video plus imported Instagram / TikTok / X posts, with the hook (title without hashtags), its features (hook type, length, CAPS, question, topic, guest/solo, duration, weekday), latest stats, 7/30-day deltas and a lift against the median of settled posts (14+ days old, last 18 months) of the same platform and kind.
- index/social/insights.json + insights.md: median lift per feature value with n, top and bottom posts per platform, and (once 20+ posts have a lift and ANTHROPIC_API_KEY is set) a Claude playbook: what travels, what sinks, phrasings to reuse, how sadie edits drafts.
- index/social/drafts-review.md: for the newest episodes with fewer than 4 Shorts, six clip moments with a hook per platform, written from the transcript, the playbook and past edits. Edit the lines you would post. When a post goes out, its title is matched back to the draft and the change lands in index/social/edits.json, which the next drafting run reads.
- Needs the nightly YouTube snapshots to accumulate (analytics/youtube is now committed by the workflow). Lifts appear once posts are 14 days old in the snapshots; publish dates come from the YouTube API on the next sync.


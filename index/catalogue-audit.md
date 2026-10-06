# catalogue audit

A pass over all 256 episodes (episode files, `index/episodes.json`, the per-episode JSON) plus a check of every stored Spotify id and YouTube id against the real title, run on 2026-10-06 after the episode 259 description bug. Fixed items are in the pipeline now; "left as is" items are content decisions or genuinely absent data.

## fixed

| problem | episodes | fix |
| --- | --- | --- |
| description empty because a sentence like "so let's talk about it!" was read as the topics heading | 259, 84; the last description sentence was also lost on 222, 223, 224, 225, 233, 235, 237, 239, 251, 257 | `sections.js`: a plain paragraph is a marker only if short or ending in `:` / `…` / `...` |
| description empty because the first paragraph links to the guest's own podcast and was mistaken for the "listen on" row | 32, 37, 60 | the listen row must be link-dense |
| description empty because a bold content warning counted as a heading | 107 | a bold line before any description text stays in it |
| © copyright line glued onto the description | 2, 45–59 (12 episodes) | dropped |
| "+ so much more!" as a chapter/topic title | 54 episodes | dropped; a guest's website line (84) and a "2. Start by…" fragment (24) too |
| **wrong YouTube video** — a clip embedded in the post (John Oliver, a documentary trailer, Marsha Linehan, SNL…) was used as the episode video | 17, 18, 29, 47, 53, 54, 75, 76, 79, 110, 122, 202 | ids cleared (audio player shows instead); `youtube-sync.js` now drops any id that is not one of the channel's uploads, and ignores the Linehan upload that fuzzy-matched 17/18 |
| deleted YouTube video (404) | 130 | cleared |
| **wrong Spotify episode** — the Creators page scrape fell back to the newest episode on the page | 134, 245, 250 | correct ids written (verified against Spotify's title); `spotify-sync.js` only takes the id next to the episode's own entry |
| Apple badge missing (Apple's lookup only returns the newest 200 episodes) | 86 episodes, 1–93 | badge links to the show page on Apple when there is no episode link |
| red "hook" sentence running for 300–1000 characters because the first `?` is deep in the paragraph | 42 episodes | the lead is only coloured when the question ends within 200 characters |
| quote pass returned nothing and gave up | 17, 18, 21, 24, 69, 71, 94, 99, 171 | re-queued for the next refresh (they have full transcripts now) |

## left as is

- **No description at all:** 52, 48, 42, 33 — the posts open with the topics or a "mentioned" list. The page shows the AI summary instead.
- **No topics / chapters:** 141 older episodes never had a "we talk about" list. Chapters need the list, so those transcripts show as one block (capped preview, "keep reading").
- **No video:** 60 episodes (48 before this pass, plus the 12 cleared above) — all have the branded audio player. The nightly YouTube step will attach a real upload if one exists with `ep. NNN` in the title/description.
- **Episode numbers that do not exist anywhere:** 4, 7, 9, 12, 13, 43, 70 — not on the blog, not in the feed.
- **Title case:** episodes up to ~180 use Title Case ("DBT Education: Intro to Mindfulness…"); newer ones are lowercase. Shown as written. Lower-casing on the site would also flatten deliberate CAPS in new titles ("why you feel LOST"), so this is a content choice.
- **Long bios in the description:** 97, 169 (~2000 characters) — real content.
- **Shared thumbnails:** 2/8/23 (the dad episodes) and 15/22/58 reuse one photo.
- **Pending on the next refresh:** 13 episodes with no visible tag get suggestions; therapy & treatment / parents / high school proposals; 69 chapter sets regenerate; 252 and 98 have quote candidates waiting in `index/quotes-review.md`.

## checks that came back clean

Numbering and slugs unique; every episode has a date, thumbnail, summary, audio URL and duration; transcripts all Flightcast, timestamps on every paragraph, none shorter than the audio; no chapter beyond the audio length or out of order; no listen row, footer or transcript text inside a description or "mentioned" block; shorts titles lose their hashtags on the page; `index/episodes/*.json` matches the episode files.

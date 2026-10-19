# squarespace publishing steps

What has to happen by hand after the repo changes from 2026-10-06 and 2026-10-19 are pushed. The index, the episode pages and the note on 249 go live on their own through GitHub Pages once `main` is pushed.

## 1. push the repo, then re-paste the Code Block

`site/embed.html` changed (topic pages now show a one-line intro and a starting episode under the heading). Pages → **episodes** → Edit → the section above the blog list → the Code Block → replace its whole content with the current `site/embed.html`. Save, then check `/episodes?tag=dbt` in a private window.

## 2. episode 244: fix the excerpt

The post's title, body and transcript are about habits; only the **excerpt** field holds episode 243's text (loneliness after college), and Squarespace uses the excerpt for the post's meta description and social preview.

Blog → post **244** → Settings → **Options** → Excerpt. Replace with:

```
new year, same resolutions? in this solo episode, sadie explains why willpower is the least effective way to change and how to design your situations instead: science-backed habits for sleep, friendships and work in 2026.
```

## 3. episode 249: remove the absolute promise

The description and excerpt say the skill ends "100% of your panic attacks" and the first topic bullet says it "stops all panic attacks". The transcript keeps what was said in the audio; the episode page now shows a note under the description instead (`note_html` in `episodes/ep-249.md`).

Blog → post **249** → Edit.

- Description, first two paragraphs → replace with:

  ```
  struggling with panic attacks and nothing seems to help? in this solo episode, i share a psychology-backed dbt skill, the ice dive, that reliably interrupts a panic attack by triggering your body’s dive reflex.

  by the end of this episode, you’ll have a crisis skill in your toolbox for getting through a panic attack, wherever you are and however much anxiety you’re facing.
  ```

- Under **i talk about:**, first bullet → `a dbt skill for stopping a panic attack`
- Settings → **Options** → Excerpt → replace with:

  ```
  struggling with panic attacks and nothing seems to help? in this solo episode, i share a psychology-backed dbt skill, the ice dive, that reliably interrupts a panic attack by triggering your body’s dive reflex. by the end of this episode, you’ll have a crisis skill in your toolbox for getting through a panic attack, wherever you are and however much anxiety you’re facing.
  ```

## 4. typos that are in the posts themselves (2026-10-19)

Most of the spacing typos on episode pages (`dr.blaise`, `solo episode,i`, `usingpsychology`, the blank line in 246 and 261, the doubled space in 260) came from the importer swallowing spaces between bold/italic runs. That's fixed in `scripts/sections.js` and `scripts/lib.js`, and every post was re-imported, so they need nothing in Squarespace. The red opening question now runs through `??` and `??!` too (`site/episode.js`).

These few are in the Squarespace text itself. The episode pages already show the corrected text (`description_override_html` / `excerpt_override` in each episode file); fix the posts so the overrides can go:

- **261**, description: `dr.blaise aguirre` → `dr. blaise aguirre`
- **243**, description: `dr.jeffrey hall` → `dr. jeffrey hall`
- **188**, description: `twentysomethings.A recent` → `twentysomethings. A recent`
- **88**, description and excerpt: `an M.S in` → `an M.S. in`, and `(bit and little t)` → `(big and little t)`
- **199**, excerpt only (Settings → Options → Excerpt): `work,The Breakthrough Years` → `work, The Breakthrough Years`

## 5. afterwards: re-sync and drop the repo-side overrides

The nightly job only looks at the newest page of posts, so after editing the posts run:

```bash
npm run import:all && npm run build
```

Then remove `excerpt_override` from `episodes/ep-244.md` and `excerpt_override` + `description_override_html` from `episodes/ep-249.md` (keep `note_html`), and the overrides from step 4 (`description_override_html` in 261, 243, 188 and 88; `excerpt_override` in 88 and 199) once those posts are fixed. Run `npm run build` again and push.

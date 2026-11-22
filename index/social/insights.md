# social insights

Generated 2026-11-22 from index/social/posts.json. lift = views / median views of settled posts (14+ days old) of the same platform and kind. Values are medians of lift across posts with that feature; n is the number of posts. Read patterns only where n is 8 or more.

## playbook (Claude's read of the numbers)

**what travels**

- shorts with 1–2 hashtags: n=204, median lift 1.0 (50% above baseline) vs 0.16 for no hashtags (n=367). the biggest single gap in the data.
- shorts with no number in the hook: n=199, lift 1.0, vs 0.17 with a number (n=372). some of that is the episode-number format in older titles, so read it loosely.
- exactly one CAPS word in a short: n=198, lift 0.82. zero, two or three+ all sit around 0.17–0.28. one word, not a shout.
- short hooks (≤6 words) on shorts: n=62, lift 0.94, vs 0.14 for 12+ words (n=107).
- "this is ___" hooks on shorts: n=13, lift 1.24, 85% above baseline. small but consistent.
- topics on shorts: social media (n=34, 1.05), 20s (n=40, 0.93), troubled teen industry (n=28, 0.96). on episodes, troubled teen industry (n=11, 1.35) and trauma (n=17, 1.27). example: "198. Chrysalis School Montana: My Troubled Teen Industry Experience".
- long-form episodes: guest episodes (n=138, 0.85) beat solo (n=65, 0.60). a promise of practical help also shows up in the top: "254. how to help someone who doesn't want help (without making it worse)".

thin data: minis (n=28 total) and episode topics like adhd (n=4) are too small to call.

**what sinks**

- 12+ word short hooks: n=107, lift 0.14, only 8% above baseline.
- stacking CAPS: 3+ caps words (n=94) lifts 0.24–0.25 with just 10–14% above baseline.
- "you / your" and "how to" shorts: n=85 (0.33) and n=33 (0.27). "watch this if" (n=7) is too thin to call.
- shorts on trauma (n=29, 0.08), body image (n=34, 0.18) and anxiety (n=47, 0.21). on episodes, "you / your" titles (n=65, 0.63) and q+a or recap titles trail.

**phrasings to reuse**

- this is what ___ actually looks like
- this is why ___
- ___ and social media
- why ___ in your 20s
- what ___ taught me about ___
- the ___ nobody talks about
- what if part of you ___?
- how to help someone who ___ (without making it worse)
- ___: my experience

keep each to six words or fewer, add one or two hashtags, and use one CAPS word at most.

**how sadie edits**

n=16 edits, all rewritten (similarity 0.45–0.72).

- she drops quotes and turns them into topic-led, how-to or "signs" framings: "nobody gets what a BATTLE it is..." became "how to tell if a teen is STRUGGLING with their mental health".
- she removes hashtags in nearly every post, which cuts against the hashtag lift above. worth testing.
- she lengthens hooks and often adds "!!" or "?!!", while the data favors short ones.
- she keeps one CAPS word, which fits the data. on long-form clips she adds the guest name and episode.

## youtube:episode (205 posts with a lift; baseline 140 views)

**hook_type**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| i wish i knew | 4 | 1.84 | 75% |
| numbered list | 4 | 1.72 | 50% |
| statement | 113 | 0.85 | 44% |
| question | 15 | 0.66 | 33% |
| you / your | 65 | 0.63 | 31% |
| the truth / secret | 3 | 0.61 | 33% |

**is_question**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| false | 190 | 0.76 | 40% |
| true | 15 | 0.66 | 33% |

**addresses_you**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| false | 132 | 0.86 | 45% |
| true | 73 | 0.61 | 30% |

**caps_words**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| 0 | 142 | 0.7 | 39% |
| 1 | 39 | 0.84 | 44% |
| 2 | 12 | 0.94 | 50% |
| 3 | 7 | 0.64 | 14% |
| 4+ | 5 | 0.42 | 20% |

**length**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| long (12+) | 160 | 0.79 | 42% |
| medium (7–11) | 42 | 0.68 | 33% |
| short (≤6 words) | 3 | 0.37 | 0% |

**has_number**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| yes | 205 | 0.76 | 40% |

**hashtags**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| 0 | 205 | 0.76 | 40% |

**duration**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| >60s | 205 | 0.76 | 40% |

**format**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| guest | 138 | 0.85 | 46% |
| solo | 65 | 0.6 | 28% |

**topic**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| sadie recommends | 3 | 39.38 | 100% |
| adhd | 4 | 2.64 | 75% |
| troubled teen industry | 11 | 1.35 | 64% |
| trauma | 17 | 1.27 | 53% |
| body image | 12 | 0.98 | 50% |
| depression | 42 | 0.91 | 48% |
| teen mental health | 50 | 0.82 | 42% |
| career | 11 | 0.76 | 45% |
| dbt | 32 | 0.74 | 38% |
| relationships | 36 | 0.71 | 36% |
| social media | 12 | 0.71 | 33% |
| anxiety | 29 | 0.66 | 31% |
| emotions | 24 | 0.64 | 38% |
| self-improvement | 37 | 0.61 | 32% |
| 20s | 14 | 0.6 | 29% |
| college | 29 | 0.56 | 34% |
| sleep | 4 | 0.43 | 25% |

**weekday**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| sat | 38 | 0.86 | 42% |
| wed | 12 | 0.85 | 50% |
| mon | 22 | 0.84 | 41% |
| fri | 37 | 0.77 | 43% |
| thu | 41 | 0.76 | 37% |
| sun | 25 | 0.64 | 32% |
| tue | 30 | 0.6 | 37% |

**top posts**

- 61.28× · 8579 views · ep 228 · 228. dr. angela duckworth on how to be gritty + set yourself up for SUCCESS!
- 39.38× · 5513 views · ep 261 · 261. what if part of you doesn’t want to get better? (feat. dr. blaise aguirre)
- 28.23× · 3952 views · ep 220 · 220. how to succeed as a psychology major (& what we wish we knew sooner)
- 25.91× · 3627 views · ep 96 · 96. Eileen Kelly on DBT at McLean, Her Treatment Takeaways, + the Day-to-Day of Living in a Mental Hosptial
- 24.87× · 3482 views · ep 198 · 198. Chrysalis School Montana: My Troubled Teen Industry Experience
- 22.49× · 3149 views · ep 197 · 197. Life After The Program feat. Netflix Director & TTI Survivor Katherine Kubler
- 13.49× · 1889 views · ep 254 · 254. how to help someone who doesn’t want help (without making it worse)
- 9.01× · 1261 views · ep 77 · 77. Dr. Kojo Sarfo on ADHD in Women: Presentations, Diagnosis, and Treatment
- 8.81× · 1234 views · ep 211 · 211. grit (I took angela duckworth's class at upenn)
- 7.93× · 1110 views · ep 86 · 86. The Teenage Girl's Guide to Increasing Confidence, Self-Esteem, and Self-Love feat. The Teen Life Coach, Sami Halvorsen
- 6.51× · 912 views · ep 60 · 60. Vulnerability, Relatability, and Empowerment feat. Zachery Dereniowski
- 6.22× · 871 views · ep 106 · 106. Dr. Judy Ho on Why We Self-Sabotage + How to Stop

**bottom posts**

- 0.09× · 12 views · ep 71 · 71. 1st Month of College DEBRIEF: Tips for Move-In, Socializing, Productivity, Studying, and more!
- 0.11× · 15 views · ep 67 · 67. High School RECAP
- 0.12× · 17 views · ep 123 · 123. Q+A: Staying Healthy in College, Eating Habits, Starting Therapy, & More!
- 0.13× · 18 views · ep 83 · 83. Freeing Yourself from Stress + Struggle by Understanding the Human Experience feat. Beth Segaloff
- 0.16× · 23 views · ep 140 · 140. Q+A: Trusting Yourself, Willfulness, Advocating for Your Needs, & Building Healthy Relationships
- 0.18× · 25 views · ep 130 · 130. Making Goals and Getting Motivated: Easy Ways to Increase Productivity & Achieve Your Ambitions feat. Kate Stone
- 0.19× · 27 views · ep 129 · 129. New Years Resolutions For Your Mental Health: SMART Goals, My 2023 Intentions, + More
- 0.21× · 30 views · ep 126 · 126. YOUR MENTAL HEALTH TOOLKIT for the Holiday Season (Navigating Finals Stress, Family Relationships, Seasonal Depression, + Body Image)

## youtube:short (571 posts with a lift; baseline 1033 views)

**hook_type**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| this is | 13 | 1.24 | 85% |
| my story | 4 | 0.87 | 25% |
| the truth / secret | 13 | 0.78 | 38% |
| why | 46 | 0.65 | 35% |
| question | 55 | 0.39 | 31% |
| statement | 306 | 0.36 | 26% |
| you / your | 85 | 0.33 | 24% |
| how to | 33 | 0.27 | 27% |
| stop / never | 6 | 0.19 | 33% |
| watch this if | 7 | 0.07 | 0% |

**is_question**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| true | 67 | 0.56 | 31% |
| false | 504 | 0.38 | 28% |

**addresses_you**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| false | 406 | 0.4 | 29% |
| true | 165 | 0.35 | 27% |

**caps_words**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| 0 | 190 | 0.28 | 25% |
| 1 | 198 | 0.82 | 42% |
| 2 | 89 | 0.17 | 25% |
| 3 | 58 | 0.25 | 10% |
| 4+ | 36 | 0.24 | 14% |

**length**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| short (≤6 words) | 62 | 0.94 | 47% |
| medium (7–11) | 402 | 0.43 | 31% |
| long (12+) | 107 | 0.14 | 8% |

**has_number**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| no | 199 | 1 | 51% |
| yes | 372 | 0.17 | 17% |

**hashtags**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| 0 | 367 | 0.16 | 17% |
| 1–2 | 204 | 1 | 50% |

**duration**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| ≤20s | 125 | 0.4 | 34% |
| 21–40s | 287 | 0.39 | 27% |
| 41–60s | 158 | 0.35 | 28% |

**format**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| solo | 206 | 0.39 | 29% |
| guest | 365 | 0.38 | 28% |

**topic**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| parents | 8 | 1.16 | 63% |
| social media | 34 | 1.05 | 50% |
| sadie recommends | 27 | 1.02 | 56% |
| troubled teen industry | 28 | 0.96 | 46% |
| 20s | 40 | 0.93 | 43% |
| career | 12 | 0.83 | 42% |
| depression | 122 | 0.79 | 40% |
| relationships | 133 | 0.78 | 41% |
| dbt | 127 | 0.75 | 43% |
| adhd | 8 | 0.68 | 38% |
| teen mental health | 158 | 0.59 | 34% |
| emotions | 90 | 0.41 | 30% |
| college | 50 | 0.34 | 14% |
| self-improvement | 110 | 0.23 | 21% |
| anxiety | 47 | 0.21 | 13% |
| sleep | 15 | 0.2 | 20% |
| body image | 34 | 0.18 | 18% |
| trauma | 29 | 0.08 | 17% |

**weekday**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| fri | 82 | 0.51 | 30% |
| mon | 75 | 0.43 | 28% |
| sun | 74 | 0.41 | 30% |
| tue | 72 | 0.39 | 26% |
| sat | 90 | 0.38 | 31% |
| thu | 85 | 0.35 | 25% |
| wed | 93 | 0.3 | 29% |

**top posts**

- 2.82× · 2916 views · ep 121 · just keep going | Ep. 121. feat. Mary's Cup of Tea
- 2.76× · 2849 views · ep 125 · Ep. 125: Tips for Teens feat. Talk With Zach
- 2.71× · 2796 views · ep 172 · The Problem of People in Therapy | She Persisted Ep. 172 Terri Cole
- 2.61× · 2691 views · ep 125 · Ep. 125: Tips for Teens feat. Talk With Zach
- 2.53× · 2617 views · ep 104 · TEEN SLEEP NEEDS | Ep. 104 Heather Turgeon + Julie Wright
- 2.51× · 2593 views · ep 258 · how our CHILDHOOD affects our current emotions
- 2.46× · 2545 views · ep 154 · RE-FEEDING in ED Treatment | Ep. 154 Erin Treloar
- 2.45× · 2529 views · ep 172 · Red Flags That You Don't Have Enough BOUNDARIES | She Persisted Ep. 172 Terri Cole
- 2.43× · 2513 views · ep 172 · A Therapist's Advice on BOUNDARIES | She Persisted Ep. 172 Terri Cole
- 2.37× · 2450 views · ep 120 · ANXIETY 101 | Ep. 120 SOLO EP
- 2.33× · 2410 views · ep 130 · Making Goals & Getting Motivated | Ep. 130 feat. Kate Stone
- 2.32× · 2396 views · ep 134 · Ellie Zeiler’s Advice for Teens | Ep. 134

**bottom posts**

- 0× · 5 views · ep 100 · EMOTIONS don't have to be ISOLATING | Ep. 100
- 0× · 3 views · ep 111 · GRATITUDE JARS | Ep. 111 Ashley Blaine Featherson-Jenkins
- 0.01× · 13 views · ep 85 · 10 Coping Skills You NEED to Know | SOLO Ep. 132
- 0.01× · 8 views · ep 87 · WHY you should’ve advocating at SCHOOL | Ep. 87 feat. Sarah Hernholm
- 0.01× · 12 views · ep 87 · AGE is not a determinant of WORK ETHIC | Ep. 87 feat. Sarah Hernholm
- 0.01× · 11 views · ep 100 · PREVENTATIVE MENTAL HEALTH CARE | Ep. 100
- 0.01× · 10 views · ep 103 · THIS 1 THING PREDICTS YOUR THERAPY SUCCESS?! | Ep. 103 Emmalee Bierly + Jennifer Chaiken
- 0.01× · 13 views · ep 104 · EXTERNAL FACTORS IMPACTING SLEEP? | Ep. 104 Heather Turgeon + Julie Wright

## youtube:mini (28 posts with a lift; baseline 38 views)

**hook_type**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| question | 3 | 2.61 | 100% |
| numbered list | 3 | 1.45 | 67% |
| you / your | 12 | 1.07 | 58% |
| statement | 10 | 0.91 | 50% |

**is_question**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| true | 3 | 2.61 | 100% |
| false | 25 | 1.05 | 56% |

**addresses_you**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| false | 13 | 1.13 | 62% |
| true | 15 | 1.08 | 60% |

**caps_words**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| 1 | 15 | 0.89 | 47% |
| 2 | 8 | 1.27 | 75% |
| 3 | 5 | 1.18 | 80% |

**length**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| short (≤6 words) | 5 | 1.45 | 80% |
| medium (7–11) | 21 | 1.08 | 57% |

**has_number**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| yes | 7 | 4.29 | 86% |
| no | 21 | 1 | 52% |

**hashtags**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| 0 | 28 | 1.11 | 61% |

**duration**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| >60s | 28 | 1.11 | 61% |

**format**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| guest | 20 | 1.15 | 60% |
| solo | 8 | 1.07 | 63% |

**topic**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| relationships | 5 | 4.45 | 80% |
| dbt | 6 | 2.49 | 67% |
| depression | 5 | 2.37 | 80% |
| self-improvement | 4 | 1.69 | 100% |
| anxiety | 6 | 1.29 | 67% |
| college | 3 | 0.89 | 33% |
| teen mental health | 5 | 0.82 | 40% |
| social media | 3 | 0.76 | 33% |

**weekday**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| wed | 3 | 4.45 | 67% |
| mon | 15 | 1.18 | 73% |
| tue | 10 | 0.86 | 40% |

**top posts**

- 41.34× · 1571 views · ep 132 · MINI: Learn 5 DBT Skills in 5 Mins!
- 16.34× · 621 views · ep 202 · MINI: 5 Ways to Form a SECURE ATTACHMENT in 5 Mins!
- 12.29× · 467 views · ep 172 · MINI: How do I set boundaries?
- 4.45× · 169 views · ep 187 · MINI: why your 20s can be so lonely
- 4.29× · 163 views · ep 146 · MINI: a dbt crash course– everything you need to know about this therapy in 5 mins!
- 2.61× · 99 views · ep 96 · MINI: a day in the life in mental health residential treatment?!!
- 2.39× · 91 views · ep 86 · MINI: Fix Your Self-Confidence in Five Minutes!
- 2.39× · 91 views · ep 113 · MINI: Friendship Guide for SOCIAL ANXIETY!
- 2.37× · 90 views · ep 80 · MINI: depression hacks you need to know!
- 2.21× · 84 views · ep 228 · MINI: reverse engineer your life for SUCCESS in just 5 mins!
- 1.45× · 55 views · ep 91 · MINI: 5 Ways to Fix Your ANXIETY
- 1.45× · 55 views · ep 109 · MINI: Is STRESS Causing Your Depression?!

**bottom posts**

- 0.32× · 12 views · ep 167 · MINI: how to find a therapist + start therapy
- 0.45× · 17 views · ep 138 · MINI: Two Quick Tricks to Prevent a Panic Attack!
- 0.53× · 20 views · ep 112 · MINI: 5 Steps for Healing Your Hidden Depression in 5 Mins!
- 0.55× · 21 views · ep 142 · MINI: What you need to know about ADHD...
- 0.68× · 26 views · ep 66 · MINI: How to Heal from Addiction
- 0.74× · 28 views · ep 149 · MINI: Thrive in Your College Social Life Through DBT!
- 0.76× · 29 views · ep 218 · MINI: stop comparing yourself on social media
- 0.82× · 31 views · ep 136 · MINI: How to Find a Teen Treatment Program & What to Expect


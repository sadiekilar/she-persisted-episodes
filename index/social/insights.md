# social insights

Generated 2026-11-11 from index/social/posts.json. lift = views / median views of settled posts (14+ days old) of the same platform and kind. Values are medians of lift across posts with that feature; n is the number of posts. Read patterns only where n is 8 or more.

## playbook (Claude's read of the numbers)

what travels
- one CAPS word is the strongest lever on shorts: n=198, median lift 0.82 vs 0.27 for none (n=186). two or more CAPS words fall back to 0.17–0.25. example: "how our CHILDHOOD affects our current emotions" (2.51).
- short hooks (6 words or fewer) on shorts: n=62, lift 0.94, against 0.13 for 12+ words (n=107). 
- no number in the hook: n=195, lift 1.00 vs 0.17 with a number (n=372). note the "has_number" flag may be catching things like "ep. 125" in titles, so treat it with some care.
- 1–2 hashtags on shorts: n=200, lift 1.00 vs 0.16 with none (n=367).
- "this is" hooks: n=13, lift 1.24, 85% above baseline. thin, but the best hook type.
- topics on shorts: social media (n=34, 1.05), sadie recommends (n=27, 1.02), troubled teen industry (n=28, 0.96), 20s (n=40, 0.93). depression (n=122, 0.79) and relationships (n=133, 0.78) are solid and high-volume.
- full episodes: guest episodes beat solo (n=138, 0.91 vs n=64, 0.64), and titles that don't address "you" do better (n=131, 0.91 vs 0.63). top example: "228. dr. angela duckworth on how to be gritty + set yourself up for SUCCESS!"

what sinks
- long hooks on shorts: 12+ words, n=107, lift 0.13, only 8% above baseline.
- trauma (n=29, 0.08), body image (n=34, 0.18), anxiety (n=47, 0.21) and self-improvement (n=110, 0.23) on shorts. example: "10 Coping Skills You NEED to Know" got 13 views.
- 3+ CAPS words, and "you / your" hooks (n=85, 0.33) or "how to" (n=33, 0.27) on shorts.
- the "you / your" pattern also hurts episode titles: the worst ones are Q+A and toolkit titles like "126. YOUR MENTAL HEALTH TOOLKIT for the Holiday Season".

data is thin for minis (28 posts total, nothing at n≥8 beyond "you / your" at n=12, lift 1.06) and for "i wish i knew", "numbered list" and "sadie recommends" on episodes. don't build on those yet.

phrasings to reuse
- this is ___
- why ___ is so lonely
- ___ and the truth nobody says
- what ___ actually looks like
- the ___ problem
- how our ___ shapes our emotions
- ___ advice from a therapist
- ___ 101

how sadie edits
- 8 of 8 drafts were edited, and most similarity scores sit around 0.5, so these are real rewrites.
- she turns quoted lines and feelings into "how to / signs / what teens ACTUALLY" framings, e.g. "signs a teenager is STRUGGLING with their mental health".
- she drops the hashtags from the draft and keeps a single CAPS word, which matches what's working.
- she adds the guest's name or credential when there's one ("dr. angela duckworth on..."). note that her new hooks run longer than the data favors, and her "how to" framings sit in a weak hook type, so it's worth testing shorter versions.

## youtube:short (567 posts with a lift; baseline 1033 views)

**hook_type**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| this is | 13 | 1.24 | 85% |
| my story | 4 | 0.87 | 25% |
| the truth / secret | 13 | 0.78 | 38% |
| why | 45 | 0.61 | 33% |
| question | 55 | 0.39 | 31% |
| statement | 303 | 0.37 | 26% |
| you / your | 85 | 0.33 | 24% |
| how to | 33 | 0.27 | 27% |
| stop / never | 6 | 0.19 | 33% |
| watch this if | 7 | 0.07 | 0% |

**is_question**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| true | 66 | 0.5 | 30% |
| false | 501 | 0.38 | 28% |

**addresses_you**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| false | 402 | 0.4 | 29% |
| true | 165 | 0.35 | 27% |

**caps_words**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| 0 | 186 | 0.27 | 24% |
| 1 | 198 | 0.82 | 42% |
| 2 | 89 | 0.17 | 25% |
| 3 | 58 | 0.25 | 10% |
| 4+ | 36 | 0.24 | 14% |

**length**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| short (≤6 words) | 62 | 0.94 | 47% |
| medium (7–11) | 398 | 0.43 | 31% |
| long (12+) | 107 | 0.13 | 8% |

**has_number**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| no | 195 | 1 | 51% |
| yes | 372 | 0.17 | 17% |

**hashtags**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| 0 | 367 | 0.16 | 17% |
| 1–2 | 200 | 1 | 50% |

**duration**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| ≤20s | 125 | 0.4 | 34% |
| 21–40s | 287 | 0.39 | 27% |
| 41–60s | 154 | 0.35 | 27% |

**format**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| solo | 206 | 0.39 | 29% |
| guest | 361 | 0.38 | 28% |

**topic**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| parents | 4 | 1.16 | 75% |
| social media | 34 | 1.05 | 50% |
| sadie recommends | 27 | 1.02 | 56% |
| troubled teen industry | 28 | 0.96 | 46% |
| 20s | 40 | 0.93 | 43% |
| career | 12 | 0.83 | 42% |
| depression | 122 | 0.79 | 40% |
| relationships | 133 | 0.78 | 41% |
| dbt | 123 | 0.75 | 42% |
| adhd | 8 | 0.68 | 38% |
| teen mental health | 154 | 0.59 | 33% |
| emotions | 90 | 0.41 | 30% |
| college | 50 | 0.33 | 14% |
| self-improvement | 110 | 0.23 | 21% |
| anxiety | 47 | 0.21 | 13% |
| sleep | 15 | 0.2 | 20% |
| body image | 34 | 0.18 | 18% |
| trauma | 29 | 0.08 | 17% |

**weekday**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| fri | 81 | 0.49 | 30% |
| mon | 74 | 0.42 | 27% |
| sun | 74 | 0.41 | 30% |
| sat | 89 | 0.4 | 31% |
| tue | 71 | 0.39 | 27% |
| thu | 85 | 0.35 | 25% |
| wed | 93 | 0.3 | 29% |

**top posts**

- 2.82× · 2916 views · ep 121 · just keep going | Ep. 121. feat. Mary's Cup of Tea
- 2.76× · 2849 views · ep 125 · Ep. 125: Tips for Teens feat. Talk With Zach
- 2.71× · 2795 views · ep 172 · The Problem of People in Therapy | She Persisted Ep. 172 Terri Cole
- 2.6× · 2690 views · ep 125 · Ep. 125: Tips for Teens feat. Talk With Zach
- 2.53× · 2617 views · ep 104 · TEEN SLEEP NEEDS | Ep. 104 Heather Turgeon + Julie Wright
- 2.51× · 2593 views · ep 258 · how our CHILDHOOD affects our current emotions
- 2.45× · 2529 views · ep 172 · Red Flags That You Don't Have Enough BOUNDARIES | She Persisted Ep. 172 Terri Cole
- 2.45× · 2533 views · ep 154 · RE-FEEDING in ED Treatment | Ep. 154 Erin Treloar
- 2.43× · 2510 views · ep 172 · A Therapist's Advice on BOUNDARIES | She Persisted Ep. 172 Terri Cole
- 2.37× · 2450 views · ep 120 · ANXIETY 101 | Ep. 120 SOLO EP
- 2.33× · 2410 views · ep 130 · Making Goals & Getting Motivated | Ep. 130 feat. Kate Stone
- 2.32× · 2395 views · ep 134 · Ellie Zeiler’s Advice for Teens | Ep. 134

**bottom posts**

- 0× · 5 views · ep 100 · EMOTIONS don't have to be ISOLATING | Ep. 100
- 0× · 3 views · ep 111 · GRATITUDE JARS | Ep. 111 Ashley Blaine Featherson-Jenkins
- 0.01× · 13 views · ep 85 · 10 Coping Skills You NEED to Know | SOLO Ep. 132
- 0.01× · 8 views · ep 87 · WHY you should’ve advocating at SCHOOL | Ep. 87 feat. Sarah Hernholm
- 0.01× · 12 views · ep 87 · AGE is not a determinant of WORK ETHIC | Ep. 87 feat. Sarah Hernholm
- 0.01× · 11 views · ep 100 · PREVENTATIVE MENTAL HEALTH CARE | Ep. 100
- 0.01× · 10 views · ep 103 · THIS 1 THING PREDICTS YOUR THERAPY SUCCESS?! | Ep. 103 Emmalee Bierly + Jennifer Chaiken
- 0.01× · 13 views · ep 104 · EXTERNAL FACTORS IMPACTING SLEEP? | Ep. 104 Heather Turgeon + Julie Wright

## youtube:episode (204 posts with a lift; baseline 130 views)

**hook_type**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| i wish i knew | 3 | 1.89 | 67% |
| numbered list | 4 | 1.82 | 50% |
| statement | 113 | 0.92 | 46% |
| question | 15 | 0.71 | 27% |
| you / your | 65 | 0.66 | 31% |
| the truth / secret | 3 | 0.64 | 33% |

**is_question**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| false | 189 | 0.78 | 41% |
| true | 15 | 0.71 | 27% |

**addresses_you**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| false | 131 | 0.91 | 45% |
| true | 73 | 0.63 | 30% |

**caps_words**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| 0 | 141 | 0.74 | 39% |
| 1 | 39 | 0.91 | 46% |
| 2 | 12 | 0.99 | 50% |
| 3 | 7 | 0.68 | 14% |
| 4+ | 5 | 0.45 | 20% |

**length**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| long (12+) | 159 | 0.83 | 43% |
| medium (7–11) | 42 | 0.74 | 31% |
| short (≤6 words) | 3 | 0.4 | 0% |

**has_number**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| yes | 204 | 0.78 | 40% |

**hashtags**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| 0 | 204 | 0.78 | 40% |

**duration**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| >60s | 204 | 0.78 | 40% |

**format**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| guest | 138 | 0.91 | 46% |
| solo | 64 | 0.64 | 28% |

**topic**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| sadie recommends | 3 | 42.25 | 100% |
| adhd | 4 | 2.84 | 100% |
| troubled teen industry | 11 | 1.42 | 64% |
| trauma | 17 | 1.36 | 53% |
| body image | 12 | 1.04 | 50% |
| depression | 42 | 0.98 | 50% |
| teen mental health | 50 | 0.83 | 42% |
| dbt | 32 | 0.79 | 38% |
| career | 11 | 0.78 | 45% |
| relationships | 36 | 0.75 | 36% |
| social media | 12 | 0.74 | 33% |
| anxiety | 29 | 0.71 | 34% |
| emotions | 24 | 0.68 | 38% |
| self-improvement | 37 | 0.65 | 32% |
| college | 28 | 0.6 | 32% |
| 20s | 13 | 0.58 | 23% |
| sleep | 4 | 0.47 | 25% |

**weekday**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| wed | 12 | 0.91 | 50% |
| mon | 22 | 0.89 | 41% |
| sat | 37 | 0.87 | 41% |
| fri | 37 | 0.83 | 46% |
| thu | 41 | 0.78 | 37% |
| sun | 25 | 0.66 | 32% |
| tue | 30 | 0.63 | 37% |

**top posts**

- 64.88× · 8435 views · ep 228 · 228. dr. angela duckworth on how to be gritty + set yourself up for SUCCESS!
- 42.25× · 5492 views · ep 261 · 261. what if part of you doesn’t want to get better? (feat. dr. blaise aguirre)
- 27.42× · 3565 views · ep 220 · 220. how to succeed as a psychology major (& what we wish we knew sooner)
- 27.35× · 3556 views · ep 96 · 96. Eileen Kelly on DBT at McLean, Her Treatment Takeaways, + the Day-to-Day of Living in a Mental Hosptial
- 26.26× · 3414 views · ep 198 · 198. Chrysalis School Montana: My Troubled Teen Industry Experience
- 23.61× · 3069 views · ep 197 · 197. Life After The Program feat. Netflix Director & TTI Survivor Katherine Kubler
- 10.54× · 1370 views · ep 254 · 254. how to help someone who doesn’t want help (without making it worse)
- 9.65× · 1254 views · ep 77 · 77. Dr. Kojo Sarfo on ADHD in Women: Presentations, Diagnosis, and Treatment
- 9.42× · 1224 views · ep 211 · 211. grit (I took angela duckworth's class at upenn)
- 8.5× · 1105 views · ep 86 · 86. The Teenage Girl's Guide to Increasing Confidence, Self-Esteem, and Self-Love feat. The Teen Life Coach, Sami Halvorsen
- 6.9× · 897 views · ep 60 · 60. Vulnerability, Relatability, and Empowerment feat. Zachery Dereniowski
- 6.68× · 868 views · ep 106 · 106. Dr. Judy Ho on Why We Self-Sabotage + How to Stop

**bottom posts**

- 0.09× · 12 views · ep 71 · 71. 1st Month of College DEBRIEF: Tips for Move-In, Socializing, Productivity, Studying, and more!
- 0.12× · 15 views · ep 67 · 67. High School RECAP
- 0.12× · 16 views · ep 123 · 123. Q+A: Staying Healthy in College, Eating Habits, Starting Therapy, & More!
- 0.14× · 18 views · ep 83 · 83. Freeing Yourself from Stress + Struggle by Understanding the Human Experience feat. Beth Segaloff
- 0.18× · 23 views · ep 140 · 140. Q+A: Trusting Yourself, Willfulness, Advocating for Your Needs, & Building Healthy Relationships
- 0.19× · 25 views · ep 130 · 130. Making Goals and Getting Motivated: Easy Ways to Increase Productivity & Achieve Your Ambitions feat. Kate Stone
- 0.21× · 27 views · ep 129 · 129. New Years Resolutions For Your Mental Health: SMART Goals, My 2023 Intentions, + More
- 0.22× · 28 views · ep 126 · 126. YOUR MENTAL HEALTH TOOLKIT for the Holiday Season (Navigating Finals Stress, Family Relationships, Seasonal Depression, + Body Image)

## youtube:mini (28 posts with a lift; baseline 38 views)

**hook_type**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| question | 3 | 2.53 | 100% |
| numbered list | 3 | 1.45 | 67% |
| you / your | 12 | 1.06 | 58% |
| statement | 10 | 0.9 | 50% |

**is_question**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| true | 3 | 2.53 | 100% |
| false | 25 | 1.03 | 56% |

**addresses_you**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| false | 13 | 1.11 | 62% |
| true | 15 | 1.08 | 60% |

**caps_words**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| 1 | 15 | 0.89 | 47% |
| 2 | 8 | 1.27 | 75% |
| 3 | 5 | 1.16 | 80% |

**length**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| short (≤6 words) | 5 | 1.45 | 80% |
| medium (7–11) | 21 | 1.08 | 57% |

**has_number**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| yes | 7 | 4.11 | 86% |
| no | 21 | 1 | 52% |

**hashtags**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| 0 | 28 | 1.1 | 61% |

**duration**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| >60s | 28 | 1.1 | 61% |

**format**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| guest | 20 | 1.14 | 60% |
| solo | 8 | 1.06 | 63% |

**topic**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| relationships | 5 | 4.42 | 80% |
| dbt | 6 | 2.45 | 67% |
| depression | 5 | 2.37 | 80% |
| self-improvement | 4 | 1.69 | 100% |
| anxiety | 6 | 1.28 | 67% |
| college | 3 | 0.89 | 33% |
| teen mental health | 5 | 0.79 | 40% |
| social media | 3 | 0.76 | 33% |

**weekday**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| wed | 3 | 4.42 | 67% |
| mon | 15 | 1.16 | 73% |
| tue | 10 | 0.84 | 40% |

**top posts**

- 41.29× · 1569 views · ep 132 · MINI: Learn 5 DBT Skills in 5 Mins!
- 16.34× · 621 views · ep 202 · MINI: 5 Ways to Form a SECURE ATTACHMENT in 5 Mins!
- 12.29× · 467 views · ep 172 · MINI: How do I set boundaries?
- 4.42× · 168 views · ep 187 · MINI: why your 20s can be so lonely
- 4.11× · 156 views · ep 146 · MINI: a dbt crash course– everything you need to know about this therapy in 5 mins!
- 2.53× · 96 views · ep 96 · MINI: a day in the life in mental health residential treatment?!!
- 2.39× · 91 views · ep 86 · MINI: Fix Your Self-Confidence in Five Minutes!
- 2.37× · 90 views · ep 80 · MINI: depression hacks you need to know!
- 2.37× · 90 views · ep 113 · MINI: Friendship Guide for SOCIAL ANXIETY!
- 2.21× · 84 views · ep 228 · MINI: reverse engineer your life for SUCCESS in just 5 mins!
- 1.45× · 55 views · ep 91 · MINI: 5 Ways to Fix Your ANXIETY
- 1.45× · 55 views · ep 109 · MINI: Is STRESS Causing Your Depression?!

**bottom posts**

- 0.32× · 12 views · ep 167 · MINI: how to find a therapist + start therapy
- 0.45× · 17 views · ep 138 · MINI: Two Quick Tricks to Prevent a Panic Attack!
- 0.53× · 20 views · ep 112 · MINI: 5 Steps for Healing Your Hidden Depression in 5 Mins!
- 0.55× · 21 views · ep 142 · MINI: What you need to know about ADHD...
- 0.63× · 24 views · ep 66 · MINI: How to Heal from Addiction
- 0.74× · 28 views · ep 149 · MINI: Thrive in Your College Social Life Through DBT!
- 0.76× · 29 views · ep 218 · MINI: stop comparing yourself on social media
- 0.79× · 30 views · ep 136 · MINI: How to Find a Teen Treatment Program & What to Expect


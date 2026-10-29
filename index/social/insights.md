# social insights

Generated 2026-10-29 from index/social/posts.json. lift = views / median views of settled posts (14+ days old) of the same platform and kind. Values are medians of lift across posts with that feature; n is the number of posts. Read patterns only where n is 8 or more.

## playbook (Claude's read of the numbers)

**what travels**

- **short hooks (≤6 words)** lift views 94% on shorts (n=60, lift 0.94 vs. baseline), and 45% beat baseline. "just keep going | Ep. 121. feat. Mary's Cup of Tea" (lift 2.91) shows the power of a crisp five-worder.
- **exactly 1 caps word** drives a 79% lift on shorts (n=187, lift 0.79, 41% beat baseline). zero caps sinks to 0.28 lift; two+ caps hover around 0.18–0.26.
- **1–2 hashtags** on shorts nearly double views (n=187, lift 0.99, 50% beat baseline) vs. no hashtags (n=367, lift 0.17).
- **"this is" hooks** beat baseline by 28% on shorts (n=13, lift 1.28, 85% beat baseline). episodes also favor plain statements (n=113, lift 0.94, 47% beat baseline) over "you/your" frames (lift 0.65).
- **no numbers** in the hook lifts shorts by 100% (n=182, lift 1.00, 51% beat baseline). numbers drag performance down to 0.17 lift (n=372).
- **social media, recommendations, troubled teen industry, 20s, depression** topics consistently outperform on shorts: social media (n=34, lift 1.09), sadie recommends (n=27, lift 1.05), depression (n=122, lift 0.82). "how our CHILDHOOD affects our current emotions" (lift 2.59) is a depression winner.
- **guest episodes** edge out solo for full episodes (n=137, lift 0.94 vs. solo 0.66), though solo shorts hold steady.

**what sinks**

- **long hooks (12+ words)** on shorts collapse to 0.14 lift (n=106, only 8% beat baseline). save detail for episodes, where long hooks work (n=159, lift 0.86).
- **addressing "you/your"** and questions both drag shorts down (you: n=160, lift 0.34; questions: n=63, lift 0.41). "10 Coping Skills You NEED to Know" lifted only 0.01.
- **college, anxiety, body image, trauma** topics underperform on shorts: college (n=50, lift 0.34), anxiety (n=47, lift 0.22), trauma (n=29, lift 0.08).

**phrasings to reuse**

- this is ___
- ___ | ep. ___ feat. ___
- how ___ affects ___
- the problem of ___
- ___ in ___ treatment
- ___ advice for teens
- ___ 101
- making ___ & getting ___
- tips for ___
- re-___ in ___

**how sadie edits**

- strips hashtags and meta-language ("nobody gets," "teens open up when") for cleaner topic framing: "\"nobody gets what a BATTLE it is…\" #teenstruggles" → "signs a teenager is STRUGGLING with their mental health."
- replaces self-referential statements with HOW TO or WHAT frames: "we don't apply…" → "how to achieve your goals this year using PSYCHOLOGY."
- keeps one caps word, drops extras. stays plain, frontloads the answer.

## youtube:short (554 posts with a lift; baseline 1001.5 views)

**hook_type**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| this is | 13 | 1.28 | 85% |
| my story | 4 | 0.9 | 25% |
| the truth / secret | 13 | 0.81 | 46% |
| why | 44 | 0.57 | 32% |
| statement | 297 | 0.35 | 26% |
| question | 52 | 0.34 | 27% |
| you / your | 83 | 0.33 | 23% |
| how to | 32 | 0.28 | 25% |
| stop / never | 6 | 0.2 | 33% |
| watch this if | 7 | 0.07 | 0% |

**is_question**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| true | 63 | 0.41 | 27% |
| false | 491 | 0.37 | 28% |

**addresses_you**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| false | 394 | 0.4 | 29% |
| true | 160 | 0.34 | 26% |

**caps_words**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| 0 | 185 | 0.28 | 24% |
| 1 | 187 | 0.79 | 41% |
| 2 | 88 | 0.18 | 26% |
| 3 | 58 | 0.26 | 10% |
| 4+ | 36 | 0.25 | 14% |

**length**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| short (≤6 words) | 60 | 0.94 | 45% |
| medium (7–11) | 388 | 0.43 | 31% |
| long (12+) | 106 | 0.14 | 8% |

**has_number**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| no | 182 | 1 | 51% |
| yes | 372 | 0.17 | 17% |

**hashtags**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| 0 | 367 | 0.17 | 17% |
| 1–2 | 187 | 0.99 | 50% |

**duration**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| ≤20s | 125 | 0.41 | 34% |
| 21–40s | 282 | 0.4 | 27% |
| 41–60s | 146 | 0.33 | 24% |

**format**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| solo | 206 | 0.41 | 29% |
| guest | 348 | 0.35 | 27% |

**topic**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| social media | 34 | 1.09 | 50% |
| sadie recommends | 27 | 1.05 | 59% |
| troubled teen industry | 28 | 0.99 | 46% |
| 20s | 40 | 0.95 | 43% |
| career | 12 | 0.86 | 42% |
| depression | 122 | 0.82 | 42% |
| relationships | 133 | 0.81 | 41% |
| dbt | 110 | 0.72 | 38% |
| adhd | 8 | 0.7 | 38% |
| teen mental health | 150 | 0.52 | 33% |
| college | 50 | 0.34 | 14% |
| emotions | 81 | 0.32 | 26% |
| self-improvement | 110 | 0.24 | 22% |
| anxiety | 47 | 0.22 | 13% |
| sleep | 15 | 0.21 | 20% |
| body image | 34 | 0.19 | 18% |
| trauma | 29 | 0.08 | 17% |

**weekday**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| fri | 80 | 0.46 | 31% |
| mon | 72 | 0.4 | 26% |
| sun | 72 | 0.4 | 28% |
| tue | 69 | 0.39 | 25% |
| sat | 87 | 0.36 | 32% |
| thu | 83 | 0.34 | 24% |
| wed | 91 | 0.3 | 27% |

**top posts**

- 2.91× · 2915 views · ep 121 · just keep going | Ep. 121. feat. Mary's Cup of Tea
- 2.84× · 2848 views · ep 125 · Ep. 125: Tips for Teens feat. Talk With Zach
- 2.79× · 2794 views · ep 172 · The Problem of People in Therapy | She Persisted Ep. 172 Terri Cole
- 2.68× · 2688 views · ep 125 · Ep. 125: Tips for Teens feat. Talk With Zach
- 2.61× · 2616 views · ep 104 · TEEN SLEEP NEEDS | Ep. 104 Heather Turgeon + Julie Wright
- 2.59× · 2589 views · ep 258 · how our CHILDHOOD affects our current emotions
- 2.52× · 2528 views · ep 172 · Red Flags That You Don't Have Enough BOUNDARIES | She Persisted Ep. 172 Terri Cole
- 2.51× · 2516 views · ep 154 · RE-FEEDING in ED Treatment | Ep. 154 Erin Treloar
- 2.5× · 2505 views · ep 172 · A Therapist's Advice on BOUNDARIES | She Persisted Ep. 172 Terri Cole
- 2.45× · 2449 views · ep 120 · ANXIETY 101 | Ep. 120 SOLO EP
- 2.41× · 2409 views · ep 130 · Making Goals & Getting Motivated | Ep. 130 feat. Kate Stone
- 2.39× · 2394 views · ep 134 · Ellie Zeiler’s Advice for Teens | Ep. 134

**bottom posts**

- 0× · 5 views · ep 100 · EMOTIONS don't have to be ISOLATING | Ep. 100
- 0× · 3 views · ep 111 · GRATITUDE JARS | Ep. 111 Ashley Blaine Featherson-Jenkins
- 0.01× · 13 views · ep 85 · 10 Coping Skills You NEED to Know | SOLO Ep. 132
- 0.01× · 8 views · ep 87 · WHY you should’ve advocating at SCHOOL | Ep. 87 feat. Sarah Hernholm
- 0.01× · 12 views · ep 87 · AGE is not a determinant of WORK ETHIC | Ep. 87 feat. Sarah Hernholm
- 0.01× · 11 views · ep 100 · PREVENTATIVE MENTAL HEALTH CARE | Ep. 100
- 0.01× · 10 views · ep 103 · THIS 1 THING PREDICTS YOUR THERAPY SUCCESS?! | Ep. 103 Emmalee Bierly + Jennifer Chaiken
- 0.01× · 13 views · ep 104 · EXTERNAL FACTORS IMPACTING SLEEP? | Ep. 104 Heather Turgeon + Julie Wright

## youtube:episode (203 posts with a lift; baseline 126 views)

**hook_type**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| numbered list | 4 | 1.84 | 50% |
| i wish i knew | 3 | 1.83 | 67% |
| statement | 113 | 0.94 | 47% |
| question | 14 | 0.72 | 36% |
| you / your | 65 | 0.65 | 29% |
| the truth / secret | 3 | 0.64 | 33% |

**is_question**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| false | 189 | 0.8 | 41% |
| true | 14 | 0.72 | 36% |

**addresses_you**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| false | 130 | 0.94 | 47% |
| true | 73 | 0.65 | 29% |

**caps_words**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| 0 | 140 | 0.75 | 40% |
| 1 | 39 | 0.94 | 46% |
| 2 | 12 | 1.01 | 50% |
| 3 | 7 | 0.71 | 14% |
| 4+ | 5 | 0.47 | 20% |

**length**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| long (12+) | 159 | 0.86 | 43% |
| medium (7–11) | 41 | 0.74 | 32% |
| short (≤6 words) | 3 | 0.41 | 0% |

**has_number**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| yes | 203 | 0.79 | 40% |

**hashtags**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| 0 | 203 | 0.79 | 40% |

**duration**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| >60s | 203 | 0.79 | 40% |

**format**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| guest | 137 | 0.94 | 47% |
| solo | 64 | 0.66 | 28% |

**topic**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| sadie recommends | 3 | 43.48 | 100% |
| adhd | 4 | 2.93 | 100% |
| troubled teen industry | 11 | 1.43 | 64% |
| trauma | 17 | 1.4 | 53% |
| body image | 12 | 1.08 | 58% |
| depression | 42 | 1 | 50% |
| teen mental health | 49 | 0.86 | 43% |
| career | 11 | 0.78 | 45% |
| dbt | 31 | 0.77 | 39% |
| relationships | 36 | 0.77 | 36% |
| social media | 12 | 0.75 | 33% |
| anxiety | 29 | 0.72 | 34% |
| emotions | 24 | 0.71 | 38% |
| self-improvement | 37 | 0.67 | 32% |
| college | 28 | 0.61 | 32% |
| 20s | 13 | 0.6 | 23% |
| sleep | 4 | 0.48 | 25% |

**weekday**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| sat | 36 | 0.91 | 44% |
| mon | 22 | 0.91 | 45% |
| wed | 12 | 0.9 | 50% |
| fri | 37 | 0.86 | 43% |
| thu | 41 | 0.79 | 37% |
| sun | 25 | 0.67 | 32% |
| tue | 30 | 0.64 | 37% |

**top posts**

- 65.8× · 8291 views · ep 228 · 228. dr. angela duckworth on how to be gritty + set yourself up for SUCCESS!
- 43.48× · 5479 views · ep 261 · 261. what if part of you doesn’t want to get better? (feat. dr. blaise aguirre)
- 27.67× · 3487 views · ep 96 · 96. Eileen Kelly on DBT at McLean, Her Treatment Takeaways, + the Day-to-Day of Living in a Mental Hosptial
- 26.69× · 3363 views · ep 198 · 198. Chrysalis School Montana: My Troubled Teen Industry Experience
- 25.41× · 3202 views · ep 220 · 220. how to succeed as a psychology major (& what we wish we knew sooner)
- 23.7× · 2986 views · ep 197 · 197. Life After The Program feat. Netflix Director & TTI Survivor Katherine Kubler
- 9.94× · 1252 views · ep 77 · 77. Dr. Kojo Sarfo on ADHD in Women: Presentations, Diagnosis, and Treatment
- 9.7× · 1222 views · ep 211 · 211. grit (I took angela duckworth's class at upenn)
- 8.75× · 1102 views · ep 86 · 86. The Teenage Girl's Guide to Increasing Confidence, Self-Esteem, and Self-Love feat. The Teen Life Coach, Sami Halvorsen
- 7.29× · 918 views · ep 254 · 254. how to help someone who doesn’t want help (without making it worse)
- 7.05× · 888 views · ep 60 · 60. Vulnerability, Relatability, and Empowerment feat. Zachery Dereniowski
- 6.81× · 858 views · ep 106 · 106. Dr. Judy Ho on Why We Self-Sabotage + How to Stop

**bottom posts**

- 0.1× · 12 views · ep 71 · 71. 1st Month of College DEBRIEF: Tips for Move-In, Socializing, Productivity, Studying, and more!
- 0.12× · 15 views · ep 67 · 67. High School RECAP
- 0.13× · 16 views · ep 123 · 123. Q+A: Staying Healthy in College, Eating Habits, Starting Therapy, & More!
- 0.14× · 18 views · ep 83 · 83. Freeing Yourself from Stress + Struggle by Understanding the Human Experience feat. Beth Segaloff
- 0.18× · 23 views · ep 140 · 140. Q+A: Trusting Yourself, Willfulness, Advocating for Your Needs, & Building Healthy Relationships
- 0.2× · 25 views · ep 130 · 130. Making Goals and Getting Motivated: Easy Ways to Increase Productivity & Achieve Your Ambitions feat. Kate Stone
- 0.21× · 26 views · ep 126 · 126. YOUR MENTAL HEALTH TOOLKIT for the Holiday Season (Navigating Finals Stress, Family Relationships, Seasonal Depression, + Body Image)
- 0.21× · 27 views · ep 129 · 129. New Years Resolutions For Your Mental Health: SMART Goals, My 2023 Intentions, + More

## youtube:mini (28 posts with a lift; baseline 38 views)

**hook_type**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| question | 3 | 2.5 | 100% |
| numbered list | 3 | 1.45 | 67% |
| you / your | 12 | 1.04 | 58% |
| statement | 10 | 0.88 | 50% |

**is_question**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| true | 3 | 2.5 | 100% |
| false | 25 | 1 | 56% |

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
| yes | 7 | 3.92 | 86% |
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
| solo | 8 | 1.04 | 63% |

**topic**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| relationships | 5 | 4.37 | 80% |
| dbt | 6 | 2.42 | 67% |
| depression | 5 | 2.34 | 80% |
| self-improvement | 4 | 1.69 | 100% |
| anxiety | 6 | 1.28 | 67% |
| college | 3 | 0.89 | 33% |
| social media | 3 | 0.76 | 33% |
| teen mental health | 5 | 0.76 | 40% |

**weekday**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| wed | 3 | 4.37 | 67% |
| mon | 15 | 1.16 | 73% |
| tue | 10 | 0.83 | 40% |

**top posts**

- 41.26× · 1568 views · ep 132 · MINI: Learn 5 DBT Skills in 5 Mins!
- 16.34× · 621 views · ep 202 · MINI: 5 Ways to Form a SECURE ATTACHMENT in 5 Mins!
- 12.29× · 467 views · ep 172 · MINI: How do I set boundaries?
- 4.37× · 166 views · ep 187 · MINI: why your 20s can be so lonely
- 3.92× · 149 views · ep 146 · MINI: a dbt crash course– everything you need to know about this therapy in 5 mins!
- 2.5× · 95 views · ep 96 · MINI: a day in the life in mental health residential treatment?!!
- 2.39× · 91 views · ep 86 · MINI: Fix Your Self-Confidence in Five Minutes!
- 2.37× · 90 views · ep 113 · MINI: Friendship Guide for SOCIAL ANXIETY!
- 2.34× · 89 views · ep 80 · MINI: depression hacks you need to know!
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
- 0.76× · 29 views · ep 136 · MINI: How to Find a Teen Treatment Program & What to Expect
- 0.76× · 29 views · ep 218 · MINI: stop comparing yourself on social media


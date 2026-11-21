# social insights

Generated 2026-11-21 from index/social/posts.json. lift = views / median views of settled posts (14+ days old) of the same platform and kind. Values are medians of lift across posts with that feature; n is the number of posts. Read patterns only where n is 8 or more.

## playbook (Claude's read of the numbers)

**what travels**

- shorts with 1–2 hashtags: n=204, lift 1.0 vs 0.16 for none (n=367). the strongest signal in the data, though it could be partly a posting-era effect.
- shorts with no number in the hook: n=199, lift 1.0 vs 0.17 with a number (n=372).
- shorts with exactly one CAPS word: n=198, lift 0.82. zero caps is 0.28, two is 0.17, 3+ is lower still. one word, not a shout. e.g. "how our CHILDHOOD affects our current emotions".
- short hooks (≤6 words) on shorts: n=62, lift 0.94 vs 0.14 for 12+ words (n=107).
- "this is" shorts: n=13, lift 1.24, 85% above baseline. thin, but consistent.
- episode topics: troubled teen industry (n=11, lift 1.36) and trauma (n=17, 1.29). guest episodes beat solo (n=138, 0.86 vs n=65, 0.61). "254. how to help someone who doesn't want help (without making it worse)" hit 13.4x.
- minis with a number: n=7, lift 4.29, but minis are small. "MINI: Learn 5 DBT Skills in 5 Mins!" hit 41x.

**what sinks**

- long shorts hooks (12+ words): n=107, lift 0.14, and only 8% beat baseline.
- "how to" (n=33, 0.27) and "you / your" (n=85, 0.33) shorts both sit well under baseline. "watch this if" (n=7) is thin but looks bad too.
- shorts about trauma (n=29, 0.08), body image (n=34, 0.18) and anxiety (n=47, 0.21). episodes about college (n=29, 0.57) and "you" framing (n=73, 0.62) also trail.
- 3+ caps words on shorts: n=94, lift ~0.25.

**phrasings to reuse**

- this is ___
- how our ___ affects our current emotions
- how to help someone who doesn't want help (without making it worse)
- what if part of you doesn't want ___?
- ___ and what we wish we knew sooner
- ___ in 5 mins (minis)
- why your 20s can be so ___
- a day in the life of ___
- ___ | one CAPS word only

**how sadie edits**

n=13 edits, so read these as tendencies.

- she swaps quote-style drafts for plain "how to / signs / what" framings: "signs a teenager is STRUGGLING with their mental health". that runs against the "how to" data on shorts, so worth testing.
- she drops hashtags from every hook. the data says 1–2 hashtags lift shorts, so that is worth rechecking.
- she keeps roughly one CAPS word per hook, matching what works.
- she adds "!!" and "?!!" in several, and names the guest or topic more directly.

## youtube:episode (205 posts with a lift; baseline 138 views)

**hook_type**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| i wish i knew | 4 | 1.82 | 75% |
| numbered list | 4 | 1.74 | 50% |
| statement | 113 | 0.86 | 44% |
| question | 15 | 0.67 | 33% |
| you / your | 65 | 0.64 | 31% |
| the truth / secret | 3 | 0.62 | 33% |

**is_question**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| false | 190 | 0.77 | 40% |
| true | 15 | 0.67 | 33% |

**addresses_you**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| false | 132 | 0.87 | 45% |
| true | 73 | 0.62 | 30% |

**caps_words**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| 0 | 142 | 0.71 | 39% |
| 1 | 39 | 0.86 | 44% |
| 2 | 12 | 0.95 | 50% |
| 3 | 7 | 0.65 | 14% |
| 4+ | 5 | 0.43 | 20% |

**length**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| long (12+) | 160 | 0.8 | 42% |
| medium (7–11) | 42 | 0.69 | 33% |
| short (≤6 words) | 3 | 0.38 | 0% |

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
| guest | 138 | 0.86 | 46% |
| solo | 65 | 0.61 | 28% |

**topic**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| sadie recommends | 3 | 39.93 | 100% |
| adhd | 4 | 2.68 | 75% |
| troubled teen industry | 11 | 1.36 | 64% |
| trauma | 17 | 1.29 | 53% |
| body image | 12 | 0.99 | 50% |
| depression | 42 | 0.92 | 48% |
| teen mental health | 50 | 0.83 | 42% |
| career | 11 | 0.76 | 45% |
| dbt | 32 | 0.75 | 38% |
| relationships | 36 | 0.72 | 36% |
| social media | 12 | 0.71 | 33% |
| anxiety | 29 | 0.67 | 31% |
| emotions | 24 | 0.64 | 38% |
| self-improvement | 37 | 0.62 | 32% |
| 20s | 14 | 0.6 | 29% |
| college | 29 | 0.57 | 34% |
| sleep | 4 | 0.44 | 25% |

**weekday**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| sat | 38 | 0.87 | 42% |
| wed | 12 | 0.86 | 50% |
| mon | 22 | 0.85 | 41% |
| fri | 37 | 0.78 | 43% |
| thu | 41 | 0.76 | 37% |
| sun | 25 | 0.64 | 32% |
| tue | 30 | 0.61 | 37% |

**top posts**

- 62.1× · 8570 views · ep 228 · 228. dr. angela duckworth on how to be gritty + set yourself up for SUCCESS!
- 39.93× · 5511 views · ep 261 · 261. what if part of you doesn’t want to get better? (feat. dr. blaise aguirre)
- 28.4× · 3919 views · ep 220 · 220. how to succeed as a psychology major (& what we wish we knew sooner)
- 26.22× · 3619 views · ep 96 · 96. Eileen Kelly on DBT at McLean, Her Treatment Takeaways, + the Day-to-Day of Living in a Mental Hosptial
- 25.19× · 3476 views · ep 198 · 198. Chrysalis School Montana: My Troubled Teen Industry Experience
- 22.79× · 3145 views · ep 197 · 197. Life After The Program feat. Netflix Director & TTI Survivor Katherine Kubler
- 13.41× · 1851 views · ep 254 · 254. how to help someone who doesn’t want help (without making it worse)
- 9.14× · 1261 views · ep 77 · 77. Dr. Kojo Sarfo on ADHD in Women: Presentations, Diagnosis, and Treatment
- 8.93× · 1233 views · ep 211 · 211. grit (I took angela duckworth's class at upenn)
- 8.04× · 1110 views · ep 86 · 86. The Teenage Girl's Guide to Increasing Confidence, Self-Esteem, and Self-Love feat. The Teen Life Coach, Sami Halvorsen
- 6.6× · 911 views · ep 60 · 60. Vulnerability, Relatability, and Empowerment feat. Zachery Dereniowski
- 6.31× · 871 views · ep 106 · 106. Dr. Judy Ho on Why We Self-Sabotage + How to Stop

**bottom posts**

- 0.09× · 12 views · ep 71 · 71. 1st Month of College DEBRIEF: Tips for Move-In, Socializing, Productivity, Studying, and more!
- 0.11× · 15 views · ep 67 · 67. High School RECAP
- 0.12× · 17 views · ep 123 · 123. Q+A: Staying Healthy in College, Eating Habits, Starting Therapy, & More!
- 0.13× · 18 views · ep 83 · 83. Freeing Yourself from Stress + Struggle by Understanding the Human Experience feat. Beth Segaloff
- 0.17× · 23 views · ep 140 · 140. Q+A: Trusting Yourself, Willfulness, Advocating for Your Needs, & Building Healthy Relationships
- 0.18× · 25 views · ep 130 · 130. Making Goals and Getting Motivated: Easy Ways to Increase Productivity & Achieve Your Ambitions feat. Kate Stone
- 0.2× · 27 views · ep 129 · 129. New Years Resolutions For Your Mental Health: SMART Goals, My 2023 Intentions, + More
- 0.22× · 30 views · ep 126 · 126. YOUR MENTAL HEALTH TOOLKIT for the Holiday Season (Navigating Finals Stress, Family Relationships, Seasonal Depression, + Body Image)

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
- 2.46× · 2543 views · ep 154 · RE-FEEDING in ED Treatment | Ep. 154 Erin Treloar
- 2.45× · 2529 views · ep 172 · Red Flags That You Don't Have Enough BOUNDARIES | She Persisted Ep. 172 Terri Cole
- 2.43× · 2512 views · ep 172 · A Therapist's Advice on BOUNDARIES | She Persisted Ep. 172 Terri Cole
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
- 0.68× · 26 views · ep 66 · MINI: How to Heal from Addiction
- 0.74× · 28 views · ep 149 · MINI: Thrive in Your College Social Life Through DBT!
- 0.76× · 29 views · ep 218 · MINI: stop comparing yourself on social media
- 0.82× · 31 views · ep 136 · MINI: How to Find a Teen Treatment Program & What to Expect


# social insights

Generated 2026-11-15 from index/social/posts.json. lift = views / median views of settled posts (14+ days old) of the same platform and kind. Values are medians of lift across posts with that feature; n is the number of posts. Read patterns only where n is 8 or more.

## playbook (Claude's read of the numbers)

**what travels**
all lifts are medians vs. the platform baseline. only shorts have enough n to read patterns, and the top-post lists skew toward older, bigger episodes, so treat them as color, not rules.

- **hashtags on shorts:** 1–2 hashtags had a median lift of 0.99 (n=203) vs 0.16 with none (n=367). this is the biggest gap in the data.
- **exactly one CAPS word on shorts:** 0.81 (n=198), vs 0.28 with none (n=189) and 0.17 with two (n=89). one is the sweet spot. example: "how our CHILDHOOD affects our current emotions" (2.5).
- **short hooks, 6 words or fewer:** 0.94 (n=62), vs 0.43 at 7–11 words (n=401) and 0.13 at 12+ (n=107).
- **no number in the hook on shorts:** 1.0 (n=198) vs 0.17 with a number (n=372). note that episode numbers in titles may be driving this.
- **"this is" hooks:** 1.24 (n=13), with 85% beating baseline. that's the best hook type with real n.
- **topics on shorts:** social media 1.05 (n=34), troubled teen industry 0.96 (n=28), sadie recommends 1.02 (n=27), 20s 0.92 (n=40). "A Therapist's Advice on BOUNDARIES" (2.42) is a good example of the plain-advice style.
- **minis:** thin. n=28 total, and a number in the title shows 4.16 but on only n=7, so don't read it as a rule yet.

**what sinks**
- **long hooks (12+ words) on shorts:** 0.13, and only 8% beat baseline (n=107).
- **"how to" (0.27, n=33), "you / your" (0.33, n=85) and "watch this if" (0.07, n=7, thin):** all well under baseline.
- **heavy CAPS (3+ words):** 0.25 or lower (n=94 combined). the shouty hooks like "THIS 1 THING PREDICTS YOUR THERAPY SUCCESS?!" landed near zero.
- **trauma (0.08, n=29), body image (0.18, n=34), anxiety (0.21, n=47) and sleep (0.20, n=15) on shorts.** weak as short topics, though trauma does better as full episodes (1.38, n=17).

**phrasings to reuse**
- this is what ___ actually looks like
- this is why ___ feels so hard
- the truth about ___
- what nobody tells you about ___
- a therapist's advice on ___
- why ___ is so lonely
- how ___ affects our emotions
- ___ and your 20s

(the last few are loose; "the truth / secret" runs 0.78, n=13, so it's decent but not a winner.)

**how sadie edits**
- **she drops the quote-style drafts and hashtags.** nearly every draft had hashtags and many were pulled quotes, but posted versions are plain titles. this runs against the hashtag lift above, so it's worth a test.
- **she moves toward "how to / signs / what teens ACTUALLY say" framings** that name the audience or topic clearly, often adding one CAPS word.
- **she adds the guest or the format when it helps**, like "dr. angela duckworth on..." and the "MINI:" prefix.
- **posted hooks are longer than the drafts**, usually 8–11 words, against the short-hook data. all 10 edits were made, so this is a clear habit, but the sample is small and recent.

## youtube:short (570 posts with a lift; baseline 1036.5 views)

**hook_type**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| this is | 13 | 1.24 | 85% |
| my story | 4 | 0.87 | 25% |
| the truth / secret | 13 | 0.78 | 38% |
| why | 46 | 0.65 | 35% |
| question | 55 | 0.39 | 31% |
| statement | 305 | 0.37 | 26% |
| you / your | 85 | 0.33 | 24% |
| how to | 33 | 0.27 | 27% |
| stop / never | 6 | 0.19 | 33% |
| watch this if | 7 | 0.07 | 0% |

**is_question**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| true | 67 | 0.56 | 31% |
| false | 503 | 0.38 | 28% |

**addresses_you**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| false | 405 | 0.4 | 29% |
| true | 165 | 0.35 | 27% |

**caps_words**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| 0 | 189 | 0.28 | 25% |
| 1 | 198 | 0.81 | 41% |
| 2 | 89 | 0.17 | 25% |
| 3 | 58 | 0.25 | 10% |
| 4+ | 36 | 0.24 | 14% |

**length**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| short (≤6 words) | 62 | 0.94 | 45% |
| medium (7–11) | 401 | 0.43 | 31% |
| long (12+) | 107 | 0.13 | 8% |

**has_number**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| no | 198 | 1 | 51% |
| yes | 372 | 0.17 | 17% |

**hashtags**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| 0 | 367 | 0.16 | 17% |
| 1–2 | 203 | 0.99 | 50% |

**duration**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| ≤20s | 125 | 0.4 | 34% |
| 21–40s | 287 | 0.39 | 27% |
| 41–60s | 157 | 0.36 | 27% |

**format**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| guest | 364 | 0.39 | 28% |
| solo | 206 | 0.39 | 29% |

**topic**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| parents | 7 | 1.2 | 71% |
| social media | 34 | 1.05 | 50% |
| sadie recommends | 27 | 1.02 | 56% |
| troubled teen industry | 28 | 0.96 | 46% |
| 20s | 40 | 0.92 | 40% |
| career | 12 | 0.83 | 42% |
| depression | 122 | 0.79 | 40% |
| relationships | 133 | 0.78 | 40% |
| dbt | 126 | 0.75 | 43% |
| adhd | 8 | 0.68 | 38% |
| teen mental health | 157 | 0.58 | 34% |
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
| fri | 82 | 0.51 | 29% |
| mon | 75 | 0.43 | 28% |
| sun | 74 | 0.4 | 30% |
| tue | 71 | 0.39 | 27% |
| sat | 90 | 0.38 | 31% |
| thu | 85 | 0.35 | 25% |
| wed | 93 | 0.3 | 29% |

**top posts**

- 2.81× · 2916 views · ep 121 · just keep going | Ep. 121. feat. Mary's Cup of Tea
- 2.75× · 2849 views · ep 125 · Ep. 125: Tips for Teens feat. Talk With Zach
- 2.7× · 2795 views · ep 172 · The Problem of People in Therapy | She Persisted Ep. 172 Terri Cole
- 2.6× · 2690 views · ep 125 · Ep. 125: Tips for Teens feat. Talk With Zach
- 2.52× · 2617 views · ep 104 · TEEN SLEEP NEEDS | Ep. 104 Heather Turgeon + Julie Wright
- 2.5× · 2593 views · ep 258 · how our CHILDHOOD affects our current emotions
- 2.45× · 2539 views · ep 154 · RE-FEEDING in ED Treatment | Ep. 154 Erin Treloar
- 2.44× · 2529 views · ep 172 · Red Flags That You Don't Have Enough BOUNDARIES | She Persisted Ep. 172 Terri Cole
- 2.42× · 2511 views · ep 172 · A Therapist's Advice on BOUNDARIES | She Persisted Ep. 172 Terri Cole
- 2.36× · 2450 views · ep 120 · ANXIETY 101 | Ep. 120 SOLO EP
- 2.33× · 2410 views · ep 130 · Making Goals & Getting Motivated | Ep. 130 feat. Kate Stone
- 2.31× · 2395 views · ep 134 · Ellie Zeiler’s Advice for Teens | Ep. 134

**bottom posts**

- 0× · 5 views · ep 100 · EMOTIONS don't have to be ISOLATING | Ep. 100
- 0× · 3 views · ep 111 · GRATITUDE JARS | Ep. 111 Ashley Blaine Featherson-Jenkins
- 0.01× · 13 views · ep 85 · 10 Coping Skills You NEED to Know | SOLO Ep. 132
- 0.01× · 8 views · ep 87 · WHY you should’ve advocating at SCHOOL | Ep. 87 feat. Sarah Hernholm
- 0.01× · 12 views · ep 87 · AGE is not a determinant of WORK ETHIC | Ep. 87 feat. Sarah Hernholm
- 0.01× · 11 views · ep 100 · PREVENTATIVE MENTAL HEALTH CARE | Ep. 100
- 0.01× · 10 views · ep 103 · THIS 1 THING PREDICTS YOUR THERAPY SUCCESS?! | Ep. 103 Emmalee Bierly + Jennifer Chaiken
- 0.01× · 13 views · ep 104 · EXTERNAL FACTORS IMPACTING SLEEP? | Ep. 104 Heather Turgeon + Julie Wright

## youtube:episode (204 posts with a lift; baseline 128.5 views)

**hook_type**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| i wish i knew | 3 | 1.95 | 67% |
| numbered list | 4 | 1.85 | 50% |
| statement | 113 | 0.93 | 47% |
| question | 15 | 0.72 | 33% |
| you / your | 65 | 0.68 | 31% |
| the truth / secret | 3 | 0.65 | 33% |

**is_question**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| false | 189 | 0.8 | 41% |
| true | 15 | 0.72 | 33% |

**addresses_you**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| false | 131 | 0.93 | 47% |
| true | 73 | 0.64 | 30% |

**caps_words**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| 0 | 141 | 0.75 | 40% |
| 1 | 39 | 0.92 | 46% |
| 2 | 12 | 1 | 50% |
| 3 | 7 | 0.7 | 14% |
| 4+ | 5 | 0.46 | 20% |

**length**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| long (12+) | 159 | 0.84 | 43% |
| medium (7–11) | 42 | 0.74 | 33% |
| short (≤6 words) | 3 | 0.4 | 0% |

**has_number**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| yes | 204 | 0.8 | 41% |

**hashtags**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| 0 | 204 | 0.8 | 41% |

**duration**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| >60s | 204 | 0.8 | 41% |

**format**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| guest | 138 | 0.93 | 47% |
| solo | 64 | 0.65 | 28% |

**topic**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| sadie recommends | 3 | 42.79 | 100% |
| adhd | 4 | 2.87 | 100% |
| troubled teen industry | 11 | 1.44 | 64% |
| trauma | 17 | 1.38 | 53% |
| body image | 12 | 1.06 | 58% |
| depression | 42 | 0.99 | 50% |
| teen mental health | 50 | 0.89 | 44% |
| dbt | 32 | 0.8 | 41% |
| career | 11 | 0.8 | 45% |
| relationships | 36 | 0.77 | 36% |
| social media | 12 | 0.76 | 33% |
| anxiety | 29 | 0.72 | 34% |
| emotions | 24 | 0.69 | 38% |
| self-improvement | 37 | 0.65 | 32% |
| 20s | 13 | 0.61 | 23% |
| college | 28 | 0.61 | 32% |
| sleep | 4 | 0.47 | 25% |

**weekday**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| sat | 37 | 0.92 | 46% |
| wed | 12 | 0.92 | 50% |
| mon | 22 | 0.91 | 41% |
| fri | 37 | 0.84 | 46% |
| thu | 41 | 0.8 | 37% |
| sun | 25 | 0.68 | 32% |
| tue | 30 | 0.64 | 37% |

**top posts**

- 66.13× · 8498 views · ep 228 · 228. dr. angela duckworth on how to be gritty + set yourself up for SUCCESS!
- 42.79× · 5499 views · ep 261 · 261. what if part of you doesn’t want to get better? (feat. dr. blaise aguirre)
- 28.68× · 3686 views · ep 220 · 220. how to succeed as a psychology major (& what we wish we knew sooner)
- 27.81× · 3573 views · ep 96 · 96. Eileen Kelly on DBT at McLean, Her Treatment Takeaways, + the Day-to-Day of Living in a Mental Hosptial
- 26.85× · 3450 views · ep 198 · 198. Chrysalis School Montana: My Troubled Teen Industry Experience
- 24.09× · 3095 views · ep 197 · 197. Life After The Program feat. Netflix Director & TTI Survivor Katherine Kubler
- 12.18× · 1565 views · ep 254 · 254. how to help someone who doesn’t want help (without making it worse)
- 9.81× · 1260 views · ep 77 · 77. Dr. Kojo Sarfo on ADHD in Women: Presentations, Diagnosis, and Treatment
- 9.56× · 1229 views · ep 211 · 211. grit (I took angela duckworth's class at upenn)
- 8.6× · 1105 views · ep 86 · 86. The Teenage Girl's Guide to Increasing Confidence, Self-Esteem, and Self-Love feat. The Teen Life Coach, Sami Halvorsen
- 7× · 900 views · ep 60 · 60. Vulnerability, Relatability, and Empowerment feat. Zachery Dereniowski
- 6.76× · 869 views · ep 106 · 106. Dr. Judy Ho on Why We Self-Sabotage + How to Stop

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
| question | 3 | 2.58 | 100% |
| numbered list | 3 | 1.45 | 67% |
| you / your | 12 | 1.06 | 58% |
| statement | 10 | 0.91 | 50% |

**is_question**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| true | 3 | 2.58 | 100% |
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
| 3 | 5 | 1.18 | 80% |

**length**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| short (≤6 words) | 5 | 1.45 | 80% |
| medium (7–11) | 21 | 1.08 | 57% |

**has_number**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| yes | 7 | 4.16 | 86% |
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
| guest | 20 | 1.15 | 60% |
| solo | 8 | 1.06 | 63% |

**topic**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| relationships | 5 | 4.45 | 80% |
| dbt | 6 | 2.48 | 67% |
| depression | 5 | 2.37 | 80% |
| self-improvement | 4 | 1.69 | 100% |
| anxiety | 6 | 1.28 | 67% |
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

- 41.32× · 1570 views · ep 132 · MINI: Learn 5 DBT Skills in 5 Mins!
- 16.34× · 621 views · ep 202 · MINI: 5 Ways to Form a SECURE ATTACHMENT in 5 Mins!
- 12.29× · 467 views · ep 172 · MINI: How do I set boundaries?
- 4.45× · 169 views · ep 187 · MINI: why your 20s can be so lonely
- 4.16× · 158 views · ep 146 · MINI: a dbt crash course– everything you need to know about this therapy in 5 mins!
- 2.58× · 98 views · ep 96 · MINI: a day in the life in mental health residential treatment?!!
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
- 0.82× · 31 views · ep 136 · MINI: How to Find a Teen Treatment Program & What to Expect


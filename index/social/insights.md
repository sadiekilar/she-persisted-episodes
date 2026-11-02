# social insights

Generated 2026-11-02 from index/social/posts.json. lift = views / median views of settled posts (14+ days old) of the same platform and kind. Values are medians of lift across posts with that feature; n is the number of posts. Read patterns only where n is 8 or more.

## playbook (Claude's read of the numbers)

**what travels**

- **"this is" framing** (n=13, lift 1.26): simple declarative titles like "just keep going | Ep. 121. feat. Mary's Cup of Tea" beat the baseline without hype. let the content speak.
- **short hooks** (n=61, lift 0.94): six words or fewer land harder than medium or long. "TEEN SLEEP NEEDS | Ep. 104 Heather Turgeon + Julie Wright" works.
- **exactly ONE caps word** (n=190, lift 0.81): one word of emphasis (not zero, not two) consistently lifts. "how our CHILDHOOD affects our current emotions" hits that sweet spot.
- **1–2 hashtags on shorts** (n=191, lift 0.98): one or two hashtags nearly match no-hashtag performance on shorts; zero hashtags tank (n=367, lift 0.17).
- **topics: social media, sadie recommends, troubled teen industry, 20s** (all n ≥ 27, lifts 0.94–1.07): these subjects reliably travel. depression and relationships also perform (both n > 120, lift ~0.80).
- **no numbers in the hook** (n=186, lift 1.00 on shorts): numbered listicles underperform badly (n=372, lift 0.17). counterintuitively, episode numbers seem fine in context like "Ep. 125: Tips for Teens feat. Talk With Zach."
- **questions on minis** (n=3, lift 2.5): tiny sample, but "how do I set boundaries?" and "Is STRESS Causing Your Depression?!" both crushed it.

**what sinks**

- **"watch this if," "stop / never," most questions** (all n ≥ 6, lifts 0.07–0.35): prescriptive or question hooks fall flat on shorts. "why" hooks (n=45, lift 0.62) also lag.
- **long hooks on shorts** (n=106, lift 0.13): twelve-plus words kill performance. only 8% beat baseline.
- **addressing "you" on shorts** (n=163, lift 0.34): counter to intuition, "you / your" hooks underperform statements on shorts (though they do better on episodes when guest context is clear).

**phrasings to reuse**

- how ___ affects your ___
- ___ you NEED to know
- the problem of ___
- ___ advice for teens
- my ___ experience
- tips for ___
- what teens ACTUALLY say when ___
- why isn't ___ taken seriously??!
- signs a teen is ___
- dr. ___ on how to ___

**how sadie edits**

- **strips the in-moment quote, adds context**: drafts often quote the guest verbatim; sadie rewrites to say what the clip is *about*. "we don't apply the same thinking to our own goals" → "how to achieve your goals this year using PSYCHOLOGY."
- **pulls back on hashtags and specificity**: removes hashtags, trades niche phrasing ("battle," "validation") for broader accessible hooks ("how to tell if a teen is STRUGGLING").
- **frontloads the stakes or question**: moves from describing behavior to naming the outcome. "what makes teens STOP asking for help" → "this parenting style doesn't help teen mental health!!"

## youtube:short (558 posts with a lift; baseline 1015.5 views)

**hook_type**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| this is | 13 | 1.26 | 85% |
| my story | 4 | 0.89 | 25% |
| the truth / secret | 13 | 0.8 | 46% |
| why | 45 | 0.62 | 33% |
| question | 53 | 0.35 | 28% |
| statement | 297 | 0.35 | 26% |
| you / your | 85 | 0.33 | 24% |
| how to | 32 | 0.28 | 25% |
| stop / never | 6 | 0.2 | 33% |
| watch this if | 7 | 0.07 | 0% |

**is_question**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| true | 64 | 0.42 | 28% |
| false | 494 | 0.37 | 28% |

**addresses_you**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| false | 395 | 0.39 | 28% |
| true | 163 | 0.34 | 26% |

**caps_words**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| 0 | 185 | 0.28 | 24% |
| 1 | 190 | 0.81 | 41% |
| 2 | 89 | 0.18 | 25% |
| 3 | 58 | 0.25 | 10% |
| 4+ | 36 | 0.24 | 14% |

**length**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| short (≤6 words) | 61 | 0.94 | 46% |
| medium (7–11) | 391 | 0.43 | 30% |
| long (12+) | 106 | 0.13 | 8% |

**has_number**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| no | 186 | 1 | 50% |
| yes | 372 | 0.17 | 17% |

**hashtags**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| 0 | 367 | 0.17 | 17% |
| 1–2 | 191 | 0.98 | 49% |

**duration**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| ≤20s | 125 | 0.41 | 34% |
| 21–40s | 284 | 0.39 | 27% |
| 41–60s | 148 | 0.34 | 24% |

**format**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| solo | 206 | 0.4 | 29% |
| guest | 352 | 0.35 | 27% |

**topic**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| social media | 34 | 1.07 | 50% |
| sadie recommends | 27 | 1.04 | 59% |
| troubled teen industry | 28 | 0.97 | 46% |
| 20s | 40 | 0.94 | 43% |
| career | 12 | 0.85 | 42% |
| depression | 122 | 0.81 | 41% |
| relationships | 133 | 0.8 | 41% |
| dbt | 114 | 0.72 | 39% |
| adhd | 8 | 0.69 | 38% |
| teen mental health | 150 | 0.52 | 33% |
| emotions | 85 | 0.34 | 27% |
| college | 50 | 0.34 | 14% |
| self-improvement | 110 | 0.23 | 21% |
| anxiety | 47 | 0.21 | 13% |
| sleep | 15 | 0.2 | 20% |
| body image | 34 | 0.19 | 18% |
| trauma | 29 | 0.08 | 17% |

**weekday**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| fri | 80 | 0.45 | 30% |
| mon | 73 | 0.42 | 27% |
| tue | 70 | 0.4 | 26% |
| sun | 73 | 0.39 | 29% |
| sat | 88 | 0.38 | 32% |
| thu | 83 | 0.34 | 23% |
| wed | 91 | 0.3 | 27% |

**top posts**

- 2.87× · 2915 views · ep 121 · just keep going | Ep. 121. feat. Mary's Cup of Tea
- 2.8× · 2848 views · ep 125 · Ep. 125: Tips for Teens feat. Talk With Zach
- 2.75× · 2794 views · ep 172 · The Problem of People in Therapy | She Persisted Ep. 172 Terri Cole
- 2.65× · 2689 views · ep 125 · Ep. 125: Tips for Teens feat. Talk With Zach
- 2.58× · 2616 views · ep 104 · TEEN SLEEP NEEDS | Ep. 104 Heather Turgeon + Julie Wright
- 2.55× · 2592 views · ep 258 · how our CHILDHOOD affects our current emotions
- 2.49× · 2528 views · ep 172 · Red Flags That You Don't Have Enough BOUNDARIES | She Persisted Ep. 172 Terri Cole
- 2.49× · 2524 views · ep 154 · RE-FEEDING in ED Treatment | Ep. 154 Erin Treloar
- 2.47× · 2505 views · ep 172 · A Therapist's Advice on BOUNDARIES | She Persisted Ep. 172 Terri Cole
- 2.41× · 2449 views · ep 120 · ANXIETY 101 | Ep. 120 SOLO EP
- 2.37× · 2409 views · ep 130 · Making Goals & Getting Motivated | Ep. 130 feat. Kate Stone
- 2.36× · 2394 views · ep 134 · Ellie Zeiler’s Advice for Teens | Ep. 134

**bottom posts**

- 0× · 5 views · ep 100 · EMOTIONS don't have to be ISOLATING | Ep. 100
- 0× · 3 views · ep 111 · GRATITUDE JARS | Ep. 111 Ashley Blaine Featherson-Jenkins
- 0.01× · 13 views · ep 85 · 10 Coping Skills You NEED to Know | SOLO Ep. 132
- 0.01× · 8 views · ep 87 · WHY you should’ve advocating at SCHOOL | Ep. 87 feat. Sarah Hernholm
- 0.01× · 12 views · ep 87 · AGE is not a determinant of WORK ETHIC | Ep. 87 feat. Sarah Hernholm
- 0.01× · 11 views · ep 100 · PREVENTATIVE MENTAL HEALTH CARE | Ep. 100
- 0.01× · 10 views · ep 103 · THIS 1 THING PREDICTS YOUR THERAPY SUCCESS?! | Ep. 103 Emmalee Bierly + Jennifer Chaiken
- 0.01× · 13 views · ep 104 · EXTERNAL FACTORS IMPACTING SLEEP? | Ep. 104 Heather Turgeon + Julie Wright

## youtube:episode (203 posts with a lift; baseline 129 views)

**hook_type**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| i wish i knew | 3 | 1.83 | 67% |
| numbered list | 4 | 1.81 | 50% |
| statement | 113 | 0.91 | 46% |
| question | 14 | 0.7 | 29% |
| you / your | 65 | 0.64 | 31% |
| the truth / secret | 3 | 0.64 | 33% |

**is_question**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| false | 189 | 0.78 | 41% |
| true | 14 | 0.7 | 29% |

**addresses_you**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| false | 130 | 0.91 | 45% |
| true | 73 | 0.64 | 30% |

**caps_words**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| 0 | 140 | 0.74 | 39% |
| 1 | 39 | 0.91 | 46% |
| 2 | 12 | 0.99 | 50% |
| 3 | 7 | 0.69 | 14% |
| 4+ | 5 | 0.46 | 20% |

**length**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| long (12+) | 159 | 0.84 | 43% |
| medium (7–11) | 41 | 0.72 | 32% |
| short (≤6 words) | 3 | 0.4 | 0% |

**has_number**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| yes | 203 | 0.78 | 40% |

**hashtags**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| 0 | 203 | 0.78 | 40% |

**duration**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| >60s | 203 | 0.78 | 40% |

**format**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| guest | 137 | 0.91 | 46% |
| solo | 64 | 0.65 | 28% |

**topic**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| sadie recommends | 3 | 42.47 | 100% |
| adhd | 4 | 2.86 | 100% |
| troubled teen industry | 11 | 1.4 | 64% |
| trauma | 17 | 1.37 | 53% |
| body image | 12 | 1.05 | 50% |
| depression | 42 | 0.98 | 50% |
| teen mental health | 49 | 0.84 | 43% |
| career | 11 | 0.78 | 45% |
| dbt | 31 | 0.75 | 39% |
| relationships | 36 | 0.75 | 36% |
| social media | 12 | 0.74 | 33% |
| anxiety | 29 | 0.71 | 34% |
| emotions | 24 | 0.69 | 38% |
| self-improvement | 37 | 0.65 | 32% |
| college | 28 | 0.6 | 32% |
| 20s | 13 | 0.59 | 23% |
| sleep | 4 | 0.47 | 25% |

**weekday**

| value | n | median lift | above baseline |
| --- | ---: | ---: | ---: |
| wed | 12 | 0.9 | 50% |
| sat | 36 | 0.89 | 42% |
| mon | 22 | 0.89 | 41% |
| fri | 37 | 0.84 | 46% |
| thu | 41 | 0.78 | 37% |
| sun | 25 | 0.65 | 32% |
| tue | 30 | 0.64 | 37% |

**top posts**

- 64.54× · 8326 views · ep 228 · 228. dr. angela duckworth on how to be gritty + set yourself up for SUCCESS!
- 42.47× · 5479 views · ep 261 · 261. what if part of you doesn’t want to get better? (feat. dr. blaise aguirre)
- 27.25× · 3515 views · ep 96 · 96. Eileen Kelly on DBT at McLean, Her Treatment Takeaways, + the Day-to-Day of Living in a Mental Hosptial
- 26.19× · 3379 views · ep 198 · 198. Chrysalis School Montana: My Troubled Teen Industry Experience
- 25.53× · 3294 views · ep 220 · 220. how to succeed as a psychology major (& what we wish we knew sooner)
- 23.25× · 2999 views · ep 197 · 197. Life After The Program feat. Netflix Director & TTI Survivor Katherine Kubler
- 9.71× · 1253 views · ep 77 · 77. Dr. Kojo Sarfo on ADHD in Women: Presentations, Diagnosis, and Treatment
- 9.47× · 1222 views · ep 211 · 211. grit (I took angela duckworth's class at upenn)
- 8.54× · 1102 views · ep 86 · 86. The Teenage Girl's Guide to Increasing Confidence, Self-Esteem, and Self-Love feat. The Teen Life Coach, Sami Halvorsen
- 7.57× · 977 views · ep 254 · 254. how to help someone who doesn’t want help (without making it worse)
- 6.9× · 890 views · ep 60 · 60. Vulnerability, Relatability, and Empowerment feat. Zachery Dereniowski
- 6.67× · 860 views · ep 106 · 106. Dr. Judy Ho on Why We Self-Sabotage + How to Stop

**bottom posts**

- 0.09× · 12 views · ep 71 · 71. 1st Month of College DEBRIEF: Tips for Move-In, Socializing, Productivity, Studying, and more!
- 0.12× · 15 views · ep 67 · 67. High School RECAP
- 0.12× · 16 views · ep 123 · 123. Q+A: Staying Healthy in College, Eating Habits, Starting Therapy, & More!
- 0.14× · 18 views · ep 83 · 83. Freeing Yourself from Stress + Struggle by Understanding the Human Experience feat. Beth Segaloff
- 0.18× · 23 views · ep 140 · 140. Q+A: Trusting Yourself, Willfulness, Advocating for Your Needs, & Building Healthy Relationships
- 0.19× · 25 views · ep 130 · 130. Making Goals and Getting Motivated: Easy Ways to Increase Productivity & Achieve Your Ambitions feat. Kate Stone
- 0.2× · 26 views · ep 126 · 126. YOUR MENTAL HEALTH TOOLKIT for the Holiday Season (Navigating Finals Stress, Family Relationships, Seasonal Depression, + Body Image)
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
| relationships | 5 | 4.39 | 80% |
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
| wed | 3 | 4.39 | 67% |
| mon | 15 | 1.16 | 73% |
| tue | 10 | 0.83 | 40% |

**top posts**

- 41.26× · 1568 views · ep 132 · MINI: Learn 5 DBT Skills in 5 Mins!
- 16.34× · 621 views · ep 202 · MINI: 5 Ways to Form a SECURE ATTACHMENT in 5 Mins!
- 12.29× · 467 views · ep 172 · MINI: How do I set boundaries?
- 4.39× · 167 views · ep 187 · MINI: why your 20s can be so lonely
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


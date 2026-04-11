# Feasibility Analysis & Launch Strategy — Ball Up Top

*Last updated: 2026-04-10*
*This document synthesizes all research reports into a unified assessment and action plan.*

---

## Executive Summary

Ball Up Top is a technically sophisticated, culturally well-positioned product addressing two genuine, unmet needs in pickup basketball: real-time court activity visibility and portable peer skill reputation. The core product loop — check in, play, rate, get your archetype — is sound in concept and well-engineered in execution.

**The central feasibility question is not "is this a good product?" It is "can it reach critical mass before users churn from emptiness?"** Every other question is secondary. The product lives or dies on whether enough players at the same courts use it simultaneously to make the real-time data meaningful.

This document assesses feasibility across three dimensions, then outlines the launch strategy designed to solve the critical mass problem first.

---

## Part 1: Product Feasibility

### 1.1 The Check-In Workflow — Feasibility Assessment

**Rating: Feasible with identified friction points**

The check-in → play → check-out → rate loop is logically sound, but pickup basketball behavior creates specific friction points that must be actively managed.

**What works:**
- GPS proximity check (<100m) is the right mechanism — anti-spoofing without being onerous for a player who's physically at the court
- The "encountered player" 2-minute overlap filter is smart — it means you only rate people you genuinely played against
- Auto-navigation to the rating screen on checkout is exactly right — it captures the moment of maximum motivation
- Preset rating buttons (Avg/Solid/Great/Elite) dramatically reduce cognitive load. This is a critical UX decision that should never be removed.

**Where friction is real:**

*Check-in:*
Pickup players don't open apps when they arrive at a court — they start playing. The check-in habit doesn't exist yet and must be built from scratch. The geofence proximity notification ("6 players checked in at [Court] — pull up?") is the primary mechanism to prompt check-in without relying on the user to remember. This notification must be built and must fire reliably to solve this problem.

*Checkout:*
Players leave courts the same way they arrive — abruptly, when the run is over or they need to go. There is no natural "end of session" cue that prompts a checkout action. Dangling sessions (checked in but never checked out) will be a significant data quality problem without mitigation.
- *Mitigation:* Auto-checkout trigger after 6+ hours of inactivity. Push notification after 3+ hours: "Still at the court? Tap to wrap up." Both should be implemented before launch.

*Rating completion:*
Rating is mood-dependent. Players who had a good game or respected their opponents will rate. Players who are tired, frustrated, or in conflict will skip. This is acceptable — a 50–60% rating completion rate is a success, not a failure. Do not design the product to *require* rating completion; design it to make completion easy and rewarding for those who want to.

**Behavioral change requirement:**
Asking players to check in on an app is a new behavior that doesn't exist in the current routine. New habits form when: (a) there's an immediate reward, (b) the behavior is prompted at the right moment, (c) the behavior is easy enough to do in 10 seconds. Ball Up Top satisfies all three for players who already see the value proposition — the challenge is getting to that first check-in. The ambassador cohort's job is to demonstrate the habit publicly so others can imitate it.

---

### 1.2 The Rating & Archetype System — Feasibility Assessment

**Rating: High feasibility, strong differentiation**

The EMA-weighted rating algorithm is genuinely sophisticated and addresses the most common failure mode of peer rating systems (gaming, friendship inflation, outlier manipulation). The key design decisions — rater credibility weighting, overlap requirements, run competitiveness weighting, outlier penalties — are well-considered.

**What works:**
- The algorithm is meaningfully resistant to gaming compared to simple averages
- 40+ archetypes provide enough specificity that most players will feel accurately represented
- The 45–99 scale (not 0–100) is psychologically smart — no one starts at "zero"
- Rating history graph (last 25 data points) will become increasingly valuable as data accumulates

**Legitimate concerns:**

*Rating trust:*
The single biggest threat to the rating system is not the algorithm — it's whether players *believe* the algorithm is fair. If players perceive their rating as arbitrary or gameable, they disengage. The algorithm's sophistication must be communicated clearly and simply. "Your rating is weighted by who you played against and how long you played together — you can't inflate it by having your friends rate you" is the message that needs to reach every new user.

*Cold start for individual ratings:*
New players start at 65 overall regardless of actual skill. A genuinely elite player who's new to the app will have a 65 overall until they accumulate enough ratings from enough sessions. This can feel deflating for skilled players and validating for weaker players in the first weeks. This is unavoidable — the system needs data to work — but it should be communicated during onboarding: "Your rating starts at 65 and adjusts to reflect your real game over your first several sessions."

*Archetype accuracy:*
With only 4 skill dimensions and height as inputs, some players will feel their archetype misrepresents them. This is most likely when:
- A big who plays like a guard gets classified by height as a post player
- A player's statistical strengths don't match their self-perception
Consider adding a lightweight "does this feel right?" feedback mechanism post-archetype generation. It's not just a data signal — it creates emotional investment in the archetype.

---

### 1.3 Ball Up Top as a Digital Social Space for Pickup Basketball

**Rating: High long-term potential, dependent on critical mass**

The concept of Ball Up Top as a persistent digital layer on top of pickup basketball culture — courts as social nodes, players as persistent skill entities, reputation as portable — is not just feasible. It's the right paradigm for where pickup basketball is heading.

**Why this is the right moment:**
- Pickup basketball culture is more documented and celebrated than at any prior point (YouTube court vlogs, Instagram court culture accounts, SLAM's street basketball coverage)
- The "I have skills but no platform to show them" frustration is real, widespread, and growing
- The generation now playing pickup basketball (Gen Z / older millennials) expects apps to mediate and record their physical social experiences (Strava for running, Chess.com for chess, Peloton for cycling)
- No current product occupies this space. The shelf is empty.

**The digital social space vision realized looks like:**
- A court in Chicago, Purdue, LA with an active leaderboard, 2 years of activity data, and a community of known players
- Players who have portable skill profiles that travel when they move cities
- "What's your archetype?" as natural vocabulary in pickup basketball culture
- Court-level reputations ("the [Court Name] scene has a high average rating — good competition")
- Discovery for new-to-area players that previously didn't exist

**The risk to the vision:**
The primary risk is not competition — no direct competitor is close. The risk is fragmentation: Ball Up Top growing to 500 users spread across 50 cities with no single court achieving critical mass. This feels like growth but creates no network effect and no real-time utility.

**The solution is explicit sequencing:**
Build density before width. Purdue fully — then IU, Notre Dame. Then one urban market at full depth before expanding to the next. The temptation to grow wide fast will be strong; resist it. A single court with a 50-person active community is more valuable than 50 courts with one active user each.

---

## Part 2: Market Feasibility

### 2.1 Market Size

**Total Addressable Market:**
Pickup basketball players in the US. Per SFIA data, ~26 million Americans play basketball at least once per year; est. 8–12 million play pickup basketball regularly (once per week or more). This is the TAM.

**Serviceable Addressable Market:**
Players aged 16–35 with smartphones who play pickup at courts (not exclusively in organized leagues). Estimated at 4–7 million in the US.

**Initial Target Market:**
Purdue University — approximately 50,000 students. Estimated active pickup basketball players: 2,000–5,000. This is the beachhead.

**Why the beachhead approach is correct:**
Attempting to serve the full SAM immediately creates the fragmentation problem. Purdue as a beachhead allows Ball Up Top to achieve real critical mass at specific courts, generate proof of the model, develop the playbook for expansion, and build press narrative ("app that's dominating pickup ball at Purdue") before going wide.

### 2.2 Monetization Feasibility

**Current state:** Free. Correct for launch.

**Viable future paths (post critical-mass):**
1. **Freemium:** Premium features (extended rating history, advanced skill breakdown, verified court presence badges, seasonal awards). Core features remain free — monetization cannot interfere with network effects.
2. **Brand partnerships:** Sneaker brands, basketball apparel, basketball training content — direct access to engaged, skill-identified basketball players is valuable to endemic brands.
3. **Campus/rec-center licensing:** Universities and rec centers pay for Ball Up Top as a value-add service for their facilities. This is a B2B2C path that eliminates cold-start problems at new schools.
4. **Court data / intelligence:** Aggregate, anonymized court activity data has value to facility managers, city parks departments, and brands. Long-term, not immediate.

**What to avoid:**
Any monetization model that restricts the real-time data or rating system behind a paywall. This would directly undermine the core value proposition and kill network effects.

---

## Part 3: Launch Strategy

### 3.1 Purdue Launch Plan

**Objective:** Achieve reliable real-time utility at 2 courts within 60 days of launch.

**Definition of success:**
A court where, when you open Ball Up Top on a Saturday afternoon, there are 5+ players checked in. That single moment — opening the app and seeing that people are there — is the product-market fit signal.

**Pre-Launch (T-minus 14 days):**

| Action | Owner | Timeline |
|--------|-------|----------|
| Recruit 15 ambassador candidates (court observation method) | Founder | Weeks -4 to -2 |
| Confirm 10 committed ambassadors at 2 target courts | Founder | Week -2 |
| Brief ambassadors on app, Founding Player status, 2-week seeding commitment | Founder | Day -14 |
| Create Ball Up Top Purdue Instagram, post 2 teaser posts | Founder | Day -10 |
| Build archetype share card in-app | Dev | Day -7 |
| Ambassador pre-seeding begins (check in 3x/week minimum) | Ambassadors | Days -14 to -1 |
| Finalize geofence notification + auto-checkout logic | Dev | Day -7 |
| Test full loop (check-in → play → checkout → rate) with 3+ test users | Dev/Founder | Day -3 |

**Target courts at Purdue:**
1. CoRec main gymnasium (indoor, most active, highest visibility)
2. One outdoor court (to be determined by scouting — whichever has most regular spontaneous runs)

**Launch Day:**

| Action | Platform | Details |
|--------|----------|---------|
| Instagram launch post | Instagram | Court photography, "come get your rating," bio link |
| r/purdue post | Reddit | Personal story format, honest about being new |
| GroupMe drops (dorm, IM basketball channels) | GroupMe/Discord | Human, not promotional |
| Ambassador court takeover | Physical | 5+ ambassadors at CoRec, recruit in-person |
| Intramural coordinator outreach | Email | Value-add pitch |

**Weeks 2–4:**
- Weekly leaderboard update posts on Instagram
- Monitor check-in frequency by court; if a court falls below 3 check-ins/day for 3 consecutive days, reactivate ambassadors
- Collect qualitative feedback from first 50 users (in-person or DM)
- Identify any friction points in the loop from usage data

**KPIs for Purdue launch (Day 30):**
| Metric | Target |
|--------|--------|
| Total installs | 200+ |
| Users who completed first check-in (activation) | 100+ |
| Users who completed first rating submission | 60+ |
| Active sessions in a single Saturday (peak) | 15+ |
| Court leaderboard entries (CoRec) | 20+ unique players |
| D7 retention | >30% |
| Archetype cards shared on social | 25+ |

---

### 3.2 University Expansion Playbook

**When to expand:**
Do not expand to a second campus until Purdue hits the activation KPIs above AND maintains them for 30 consecutive days. Premature expansion before the model is proven wastes the playbook.

**Expansion sequence (recommended):**
1. Purdue — West Lafayette, IN (beachhead)
2. Indiana University — Bloomington, IN (driving distance, shared regional culture, known rivalry creates brand narrative)
3. Notre Dame — South Bend, IN (geography, strong basketball culture)
4. Michigan State — East Lansing, MI (Big Ten network)
5. University of Illinois — Champaign, IL

**Why this geographic sequencing:**
- Big Ten schools have cultural and geographic proximity — ambassador networks travel
- The "Ball Up Top is taking over the Big Ten" narrative is a natural press angle
- Staying in Indiana for the first 3 campuses allows for in-person visits without significant travel cost

**Per-campus timeline:**
- Week -3: Remote scouting (courts, active communities, Instagram accounts)
- Week -2: Ambassador lead identification (LinkedIn, Instagram, mutual connections)
- Week -1: Ambassador cohort briefing; pre-seeding begins
- Day 0: Launch (all channels simultaneously)
- Weeks 1–4: Monitoring + reactivation as needed

**Scaling the playbook:**
Document every Purdue decision, result, and lesson in a written playbook. The ambassador recruitment script, the court takeover guide, the GroupMe drop template, the Reddit post format — all of it. The goal is to reduce per-campus launch time from 3 weeks to 1 week by campus #5.

---

### 3.3 Beyond Campus — Broader Community Expansion

**When to go beyond campus:**
After 3–4 successful campus launches that collectively demonstrate the model works in different environments. This is likely 9–18 months post-Purdue launch.

**First urban market:**
Chicago. Rationale: proximity to Indiana campuses (ambassador pipeline), extremely strong pickup basketball culture (multiple legendary courts), large population density for court seeding.

**Urban market strategy differs from campus:**
- No centralized community to seed (no intramural programs, GroupMes, etc.)
- Must identify court-specific ambassadors rather than campus-wide ones
- Press outreach becomes more viable (Chicago Tribune sports desk, local basketball media)
- The "Rucker Park of Chicago" narrative — build the story around specific legendary courts

**The long-term vision (3–5 years):**
Ball Up Top as the persistent digital layer on top of every major pickup basketball scene in the US — where your skill profile follows you from city to city, where "what's your archetype?" is asked the way "what's your ELO?" is asked in chess, and where every serious pickup player has a rating history they've built over years of real games.

---

## Part 4: Critical Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Cold start — courts feel empty at launch | High | Critical | Pre-seeding with 10–15 ambassadors for 2 weeks before public launch |
| Players don't form check-in habit | High | High | Geofence notification + ambassador peer pressure + Founding Player scarcity |
| Rating system distrust | Medium | High | Transparent communication about algorithm; respected ambassadors as first raters |
| Checkout abandonment (dangling sessions) | High | Medium | Auto-checkout at 6hrs + push notification prompt at 3hrs |
| App fatigue / low D7 retention | Medium | High | Make first archetype reveal a memorable, shareable moment; defer non-essential onboarding |
| Social drama from disputed ratings | Low-Medium | Medium | Outlier detection + EMA smoothing already in place; community norms need seeding ("it's the algorithm, not personal") |
| Competitor launches at Purdue simultaneously | Low | High | Speed is the best mitigation; don't delay the launch; first-mover advantage in a network-effects product compounds |
| Fragmentation (too many courts, none dense) | Medium | High | Explicit "2 courts only" policy for Purdue launch; resist pressure to cover all courts at once |

---

## Part 5: What to Validate Before Scaling

The following questions must be answered with real data from Purdue before expanding:

1. **What % of users who install complete their first check-in?** (Activation rate — if below 40%, onboarding needs work before scaling)
2. **What % of check-ins result in completed ratings?** (Loop completion — if below 40%, checkout/rating UX needs improvement)
3. **What drives D7 retention?** (Is it the rating, the archetype, the leaderboard, or social pressure from friends?)
4. **What causes churn in the first week?** (Exit survey the first wave of churned users — their first objection is your most important product feedback)
5. **Does the archetype feel accurate to players?** (Net Promoter on archetype accuracy — is the 40+ archetype system resolving correctly for the height/skill combinations at play?)
6. **Is the geofence notification converting to check-ins?** (Notification → check-in conversion rate — if low, prompt timing or copy needs adjustment)

---

## Summary: The One Thing That Matters Most

Everything in this document — the ambassador program, the marketing strategy, the archetype sharing, the content calendar, the expansion playbook — exists to solve one problem:

**Getting enough players checked in at the same court at the same time.**

Every other metric is a proxy for this. The app does not work without it. The first 60 days at Purdue are entirely about engineering this condition at 2 courts through manual, high-touch, community-first effort.

If Ball Up Top achieves reliable court activity at even 2 Purdue courts by Day 60 — if opening the app on a Saturday afternoon reliably shows 5–10 players checked in — the product-market fit question is answered. Everything after that is execution.

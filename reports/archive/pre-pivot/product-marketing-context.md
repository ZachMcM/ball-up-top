# Product Marketing Context — Ball Up Top

*Last updated: 2026-04-10*

---

## Product Overview

**One-liner:**
Ball Up Top is the pickup basketball app — find active courts near you, check in, play, rate your opponents, and build your skill rep.

**What it does:**
Ball Up Top lets pickup basketball players discover nearby courts with real-time activity data, check in via GPS to start a session, play, and then rate every player they encountered. Ratings power a dynamic skill profile — an overall score (45–99 scale) across four dimensions (Shooting, Finishing, Playmaking, Defense) — and generate one of 40+ player archetypes (e.g., "Playmaking Shot Creator," "3 & D Wing," "Paint Beast") that evolve as your game does.

**Product category:**
Sports social / community app — sits on the shelf alongside apps like Strava (for runners), Chess.com (for chess players), and Hooper (street basketball). Customers searching for "basketball court finder," "pickup basketball app," "street ball rating app," or "who's at the court."

**Product type:**
Mobile-first consumer app (iOS + Android via React Native/Expo). Free to use; potential future monetization via premium features, court sponsorships, or affiliate partnerships.

**Business model:**
Currently free / growth-phase. Future paths: freemium (premium stats, extended history, verified badges), brand partnerships (sneaker/apparel brands reaching street ballers), and campus/rec-center licensing deals.

---

## Target Audience

**Primary:**
Pickup basketball players aged 16–35 who play at outdoor courts, rec centers, and campus gyms. Heavy urban and college demographics.

**Launch segment:**
Purdue University students and West Lafayette, IN basketball community — used as a proof-of-concept university market before expanding to additional campuses.

**Decision-makers:**
Individual players (B2C). No institutional gatekeeper. Adoption is peer-driven and grassroots.

**Primary use case:**
"I want to know if there's a run happening near me right now — and I want to build a reputation for my game without needing to be in the NBA."

**Jobs to be done:**
1. *Find a game* — "Is anyone out there right now? Which court has a run?"
2. *Build a rep* — "I want people to know how I play. I want my skills recognized without needing a coach or a league."
3. *Track progress* — "I want to see if I'm actually getting better at defense this year."
4. *Belong to a scene* — "I want to be connected to the hoopers at my school / in my city."

**Specific use cases:**
- Checking what courts are live before driving 20 minutes
- Seeing who the top players are at your local court
- Rating a guy who bodied you and giving him his props
- Watching your archetype change from "Spot Up Shooter" to "Elite Shooter" after a hot streak
- Getting a push notification that the court you care about just hit 10+ players

---

## Personas

| Persona | Cares about | Challenge | Value we promise |
|---------|-------------|-----------|------------------|
| **The Competitive Regular** (19–28, plays 3–5x/week) | Proving his game, finding competition, building rep | No way to quantify or show his skills outside of who's seen him play | A real skill score + archetype that travels — anyone can look him up |
| **The Social Hooper** (18–25, plays casually 1–2x/week) | Finding friends to play with, knowing where the good courts are | Shows up to empty courts, doesn't know where his crew is playing | Real-time court activity + notifications when the court pops off |
| **The New-to-Area Player** (college student, transplant) | Meeting people, finding courts fast in an unfamiliar place | No network, no idea where people play | Court discovery + an instant community through the app's leaderboards |
| **The Stats Guy** (any age) | Data, tracking progress, understanding his game | No objective record of improvement — just vibes | Rating history graph, 4-skill breakdown, archetype evolution |

---

## Problems & Pain Points

**Core problem:**
Pickup basketball has no infrastructure. You show up and hope there's a run. You have no idea if the court is live or dead. There's no way to quantify your skills or carry your reputation beyond people who've personally seen you play.

**Why current solutions fall short:**
- **Google Maps / court finder apps**: Show courts exist, not if anyone is playing *right now*
- **Group chats / Snapchat**: Informal, fragmented, requires already knowing people
- **Ballertv / SLAM**: Professional/organized ball — irrelevant to street/pickup players
- **Strava / fitness apps**: Activity tracking only — no social layer, no skill rating, no basketball-specific context
- **Nothing at all**: Most players just drive to the court and hope — or text one friend who might know

**What it costs them:**
- Wasted trips to empty courts (time, gas, motivation)
- Skills and reputation that exist only in a small local bubble
- No record of improvement — no way to know if training is working
- Isolation — especially for new players or transplants who don't have a local crew yet

**Emotional tension:**
*"I know I'm nice but no one outside my court knows it."*
*"I drove 20 minutes and the court was empty."*
*"I've been putting in work but I have nothing to show for it."*

---

## Competitive Landscape

**Direct:**
- **Hooper App** — court finder and pickup game scheduler; lacks real-time check-in, no rating system, no skill profiles
- **PickupBasketball.com** — web-based, dated UX, no mobile-first experience, minimal social layer

**Secondary (same problem, different approach):**
- **Group chats (WhatsApp/Snap/iMessage)** — coordinate runs informally; fragmented, requires existing relationships, no discovery for outsiders, no skill data
- **Facebook Groups** — local court communities; passive, low signal, no real-time layer, aging demographic
- **Instagram / TikTok** — showcase highlights; broadcast-only, no utility, no skill tracking

**Indirect:**
- **Doing nothing** — the default; players just show up and hope
- **Organized leagues (rec centers, YMCA)** — structured, scheduled, require registration and fees; completely different experience from pickup

**How they fall short:**
None of them offer real-time check-in + active player visibility + peer skill ratings + archetype profiles in a single product. The combination is what's new.

---

## Differentiation

**Key differentiators:**
1. **Real-time GPS check-in** — know exactly who is at any court *right now*, not last week
2. **Peer skill rating system** — EMA-weighted ratings with outlier protection; not self-reported, not coach-assigned — earned through actual play
3. **40+ player archetypes** — nuanced identity ("3 & D Wing," "Slasher," "Stretch 5") that evolves with your game
4. **Court intelligence** — hourly activity heatmaps, leaderboards, average skill level at each court
5. **Anti-gaming architecture** — rater credibility weighting, overlap-based rating eligibility, outlier detection; can't easily fake or inflate ratings
6. **Portable reputation** — your skill profile isn't tied to one league or one coach; it travels

**How we do it differently:**
Every other app either shows courts (static data) or connects players (socially, asynchronously). Ball Up Top does both simultaneously — real-time presence + a credibility-weighted merit system — and ties them together in a single session loop: show up → check in → play → rate → track.

**Why that's better:**
Street ballers don't want to schedule games — they want to know *right now* if there's a run. And they don't want to self-report their skills — they want ratings earned in real competition. Both of those things require a real-time, geolocation-anchored system. That's what we built.

**Why customers choose us:**
The combination of "is the court live" + "what's my skill score" doesn't exist anywhere else. For competitive players especially, the archetype and rating system create a pull that no other app has.

---

## Objections

| Objection | Response |
|-----------|----------|
| "What if people rate me badly on purpose?" | The rating algorithm uses weighted EMA — rater credibility, session overlap, run competitiveness, and outlier detection all dampen unfair or extreme ratings. A troll can't crater your score. |
| "Will anyone actually use this at my court?" | This is the cold-start problem every social app faces. We're solving it with hyper-local campus launches (Purdue first) with ambassador-driven adoption, seeding each court with real users before going wide. |
| "I don't want people to know my rating is low" | Ratings start at 65 overall — not zero. They reflect where you are, not where you should be. Everyone improves over time. And you only get rated by people you actually played against. |
| "I don't want to share my location" | GPS is only active during check-in. We don't track location in background. The <100m requirement protects against fake check-ins without persistent tracking. |

**Anti-persona:**
- Players who only play in organized leagues (rec center leagues, AAU, college ball) — they have existing infrastructure
- Casual players who go once a year — not enough frequency to get value from the system
- Players who are deeply privacy-averse about location

---

## Switching Dynamics (JTBD Four Forces)

**Push (away from current approach):**
- Driving to empty courts repeatedly
- Not knowing where friends are playing
- Having no record of improvement or skill level
- Being "unknown" outside a small local circle

**Pull (toward Ball Up Top):**
- Real-time "who's at the court" visibility
- A skill score and archetype that feels earned
- Leaderboard status at your home court
- Getting a push notification that your court just lit up

**Habit (keeping them with the status quo):**
- Group chat inertia — "we already coordinate on Snap"
- "I just show up — that's how it's always worked"
- App fatigue — another app to download and maintain

**Anxiety (about switching / adopting):**
- "What if no one else at my court uses it?"
- "What if I get rated unfairly?"
- "Is this going to track my location creepily?"
- "Will this be dead in six months?"

---

## Customer Language

**How they describe the problem (verbatim or close):**
- "I drove all the way out there and no one was playing"
- "There's no way to know if there's a run until you show up"
- "I'm nice but people outside my area have never seen me play"
- "I've been working on my jumper but I don't know if it's actually better"
- "I'm new here — I don't know where people ball"

**How they might describe Ball Up Top:**
- "It's like Strava but for hoopers"
- "You check in, play, then rate everyone you played against"
- "It shows you who's at the court right now"
- "It gives you an archetype — like mine is 'Playmaking Shot Creator'"
- "You get a rating from the people you actually played against"

**Words/phrases to use:**
- Run, game, hoop, ball, court, hooper, baller
- Check in, show up, session, rep, skills
- Archetype, rating, leaderboard, top player
- Real game, real competition, earned, credibility

**Words/phrases to avoid:**
- "Athlete profile" (too formal / organized sports)
- "Gamification" (internal framing — don't say it to users)
- "Users" (say "players" or "hoopers")
- "Platform" (say "app")
- Anything that sounds like fitness tracking or league management

**Glossary:**

| Term | Meaning |
|------|---------|
| Run | An informal pickup game session |
| Check-in | GPS-verified arrival at a court to start a session |
| Archetype | Your player type label (e.g., "3 & D Wing") derived from your 4 skill ratings |
| Overall | Your composite skill score (45–99) |
| Encountered player | Someone who played at the same court during your overlapping session — eligible to rate |
| Session | One check-in → checkout cycle at a court |
| Court activity | Real-time or recent player count at a given court |
| Leaderboard | Top-rated players at a specific court over the last 30 days |

---

## Brand Voice

**Tone:** Authentic, competitive, street-savvy. Speaks like a hooper, not a fitness app. Confident without being hype-bro.

**Style:** Direct, concise, real. No corporate speak. No over-explaining. Short sentences. Language that respects the culture.

**Personality:**
- Credible (we understand the game)
- Competitive (we believe in earning it)
- Community-first (this is for the culture)
- Real (no manufactured hype — the ratings are earned, not given)
- Hungry (we're building something new for a community that's been ignored)

---

## Proof Points

*(Pre-launch — projections and design intent)*

**Metrics to pursue:**
- Check-ins per active user per week (engagement signal)
- Ratings submitted per session (core loop completion)
- DAU at targeted courts during launch week
- Retention at D7 and D30

**Target customers / launch segment:**
- Purdue University student body (~50,000 students)
- Approximate pickup basketball-active population on campus: est. 2,000–5,000

**Value themes:**

| Theme | Proof |
|-------|-------|
| Real-time court activity | GPS-anchored check-in, active player count live on court cards |
| Earned skill ratings | EMA algorithm with rater weighting, outlier detection, overlap requirements |
| Nuanced player identity | 40+ archetypes generated from 4-dimensional skill data |
| Anti-gaming | Proximity check-in (<100m), combined weight formula, outlier penalties |
| Portable reputation | Profile visible to any app user — not siloed to one court or league |

---

## Goals

**Business goal:**
Achieve product-market fit at Purdue University — hit a critical mass of active users at 2–3 courts on campus such that the "is anyone there?" question is reliably answerable through the app.

**Key conversion action:**
First check-in. (Downloading is meaningless if they never check in — that's the activation event.)

**Secondary conversion:**
First rating submission — completing the full session loop.

**Current metrics:**
Pre-launch. No production users yet.

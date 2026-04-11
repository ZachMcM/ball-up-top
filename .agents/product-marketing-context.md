# Product Marketing Context

*Last updated: 2026-04-11*
*Reflects Yik Yak pivot strategy: college-first, one court per campus, grassroots expansion*

## Product Overview
**One-liner:**
Ball Up Top is the social layer for pickup basketball at your college — check in, play, get your rating, climb the leaderboard, find out who runs your court.

**What it does:**
Ball Up Top gives every college campus a structured home for its pickup basketball community. Players check in at their campus rec center court via GPS, play, and rate every opponent after the session. Ratings power a skill profile (45–99 overall across Shooting, Finishing, Playmaking, Defense), unlock one of 40+ player archetypes ("3 & D Wing," "Paint Beast," "Playmaking Shot Creator"), and populate a live court leaderboard showing who the best players on campus actually are.

**Product category:**
College campus social app / pickup basketball community platform. Comparable positioning to Yik Yak (campus-bound social) meets Chess.com (skill rating + identity) meets Strava (sport-specific social layer).

**Product type:**
Mobile-first consumer app (iOS + Android via React Native/Expo). Free to use.

**Business model:**
Free at launch (growth phase). Future paths: freemium (premium stats, extended history, verified badges, season awards), campus rec licensing (university pays for Ball Up Top as a value-add service for rec centers), brand partnerships (sneaker/apparel brands reaching college hoopers).

---

## Target Audience
**Primary market:**
College students aged 18–24 who play pickup basketball at campus rec centers. Heavy focus on large universities (30,000+ students) where the pickup basketball community is dense enough to reach critical mass quickly.

**Launch segment:**
Purdue University — West Lafayette, IN. Then sequential Big Ten expansion (IU, Notre Dame, Michigan State, Illinois). Then large state schools nationally.

**Decision-makers:**
Individual students (pure B2C). No institutional gatekeeper for player adoption. Ambassador-driven peer recruitment is the only acquisition channel that matters.

**Primary use case:**
"I want to know who's at the court right now, see how I rank against everyone on campus, and get a real rating that shows how I play."

**Jobs to be done:**
1. *Know the scene* — "Who are the best players on campus? Where do I rank?"
2. *Build a rep* — "I want people to know how I play without me having to tell them."
3. *Find the run* — "Is the court live right now? Who's there?"
4. *Belong to something* — "I want to be part of the pickup basketball community at my school."

**Use cases:**
- Opening the app and seeing 8 players checked in at the CoRec before walking over
- Getting your archetype for the first time and immediately wanting to share it
- Seeing yourself climb from #12 to #7 on the campus leaderboard after a hot week
- Checking the leaderboard to see who the top players are before showing up to compete
- Rating the guy who bodied you and seeing your own ratings come in post-session

---

## Personas

| Persona | Cares about | Challenge | Value we promise |
|---------|-------------|-----------|------------------|
| **The Competitive Regular** (plays 3–5x/week, knows the scene) | Proving his game campus-wide, not just to the 6 people who've seen him | Skills are known only to people at his specific court — no broader campus recognition | A rating and archetype that's visible to the whole campus; leaderboard rank that says "I run this court" |
| **The Freshman / New Player** (new to campus, building crew) | Breaking into the campus pickup scene, finding where people actually play | Doesn't know anyone, doesn't know which court is the real one, no network | The court check-in shows them where the run is; the leaderboard shows them who the people worth playing are |
| **The Social Hooper** (plays 1–3x/week, motivated by the experience) | Playing with good competition, knowing when the court pops off | Shows up to a dead court, doesn't know when the good runs happen | Real-time "who's at the court" visibility + geofence notification when the court goes live |
| **The Stats Guy** (any skill level, data-motivated) | Tracking his game objectively, understanding his skills beyond vibes | No external record of improvement — just his own perception | Rating history graph, 4-skill breakdown, archetype evolution over time |

---

## Problems & Pain Points
**Core problem:**
Pickup basketball at college has no infrastructure. You show up and hope there's a run. The best players are known informally — there's no way to see who actually runs the court, track your own skill level, or be recognized outside your immediate circle. It's the best social/competitive environment for pickup ball, but it's completely unorganized.

**Why alternatives fall short:**
- **GroupMe/Snap/iMessage**: Coordination for existing crews only — excludes new players, no discovery, no skill tracking
- **Hooper App**: Advance scheduling, no real-time data, no skill layer, dead in most markets
- **Google Maps**: Shows courts exist, not if anyone is there or who the competition is
- **Instagram**: Highlight broadcasting only — no utility, no community structure
- **Just showing up**: The universal default — unreliable, zero information

**What it costs them:**
- Wasted trips to empty courts after class or between classes
- Skills and reputation that exist only inside a 10-person circle
- No way to measure improvement — just feel and self-perception
- Missed connection with the broader campus pickup community

**Emotional tension:**
*"I've been playing my whole life and the only people who know I can hoop are the guys who've seen me."*
*"I showed up three times this week and the court was dead every time."*
*"I don't know anyone here yet and I can't find where people actually play."*

---

## Competitive Landscape
**Direct:** Hooper App — scheduling-only, no real-time check-in, no skill ratings, feels empty at most schools
**Secondary:** GroupMe/group chats — serves existing crews but walled off from new players; no court intelligence
**Indirect:** Doing nothing (showing up and hoping) — the universal default; zero information, zero infrastructure

**Analogues (not competitors, but positioning context):**
- **Yik Yak** — campus-bound social community; each campus is its own node; grew through school-by-school ambassador seeding
- **Chess.com** — skill rating creates identity and retention; "what's your ELO?" as natural vocabulary
- **Strava** — sports-specific social layer; activity leaderboards drive return visits

---

## Differentiation
**Key differentiators:**
1. **Real-time GPS check-in** — know who is at the campus court *right now*, not scheduled for later
2. **Peer skill rating system** — EMA-weighted ratings earned in actual games, not self-reported
3. **40+ player archetypes** — specific identity label ("3 & D Wing") that evolves with your game
4. **Campus-bound leaderboard** — see who the actual best players at your school are
5. **Anti-gaming architecture** — proximity check-in, rater credibility weighting, outlier detection
6. **One court per campus** — focused density vs. scattered fragmentation

**How we do it differently:**
Every campus gets one court node — the main rec center where everyone plays. Ball Up Top doesn't try to cover every court in the city. It creates one high-density community hub per school. That density is what makes the leaderboard meaningful, the check-in data reliable, and the archetype system trustworthy.

**Why that's better:**
A single high-density campus node beats 50 sparse city courts every time. The Yik Yak model applied to basketball: the product is only as good as the community using it, and the community needs to be concentrated for the social features to feel real.

**Why customers choose us:**
The combination of "who's at the court right now" + "where do I rank on campus" + "what's my archetype" doesn't exist anywhere else. For college players especially, the campus leaderboard is a social hierarchy they actually care about — it reflects their real community.

---

## Objections
| Objection | Response |
|-----------|----------|
| "What if people rate me badly on purpose?" | The algorithm uses weighted EMA — rater credibility, overlap requirements, and outlier detection dampen unfair ratings. A troll can't crater your score. |
| "Will anyone at my school actually use this?" | We launch one campus at a time with 10–15 ambassador players seeding the court for 2 weeks before public launch. By the time you see it, there's already a leaderboard with real players. |
| "My rating is low and I don't want people to see it" | Everyone starts at 65 — not zero. You're rated by people you actually played against. It's a starting point, not a judgment. |
| "I don't want location tracking" | GPS is only active during check-in. No background tracking. The proximity check protects against fake check-ins. |

**Anti-persona:**
- Players who only play in organized leagues or AAU — they have existing infrastructure
- Very casual players (once a month or less) — not enough frequency to get value
- Players who don't want any social visibility for their game
- Non-college users: the social features require campus community infrastructure to work; casual gym players are not the target

---

## Switching Dynamics
**Push (away from status quo):**
- Showing up to dead courts repeatedly
- Being "unknown" as a player outside your small circle
- No record of improvement or skill level
- Freshmen/new students having no way to find where people play

**Pull (toward Ball Up Top):**
- Seeing who's at the court before you walk over
- Having a real skill score that people at your school can see
- Climbing the campus leaderboard — status that means something in your actual social world
- Getting your archetype and knowing it's accurate ("that's exactly how I play")

**Habit (keeping them with the status quo):**
- Group chat inertia — "we already coordinate on Snap with our crew"
- "I just show up — I've always done it that way"
- App fatigue — "another app I have to maintain"

**Anxiety (about switching):**
- "What if no one at my school uses it?"
- "What if I get rated unfairly by someone I had a conflict with?"
- "Will this app be dead in six months?"
- "My crew won't download it so it's useless to me"

---

## Customer Language
**How they describe the problem:**
- "I drove over and no one was there"
- "There's no way to know if there's a run until you show up"
- "Everyone on the team knows I can play but nobody else does"
- "I'm new here and I still don't know where people actually ball"
- "There's no way to prove how good you are unless someone saw you"

**How they describe Ball Up Top:**
- "It shows who's at the court right now"
- "You check in, play, then rate everyone you guarded"
- "It's like a leaderboard for who runs the court at [School]"
- "It gives you an archetype based on how people rated you"
- "It's like an ELO for hoopers"

**Words to use:**
- Run, game, hoop, ball, court, hooper, baller
- Check in, show up, session, rep, skills
- Archetype, rating, leaderboard, top player, runs the court
- Real game, real competition, earned, campus

**Words to avoid:**
- "Platform" (say "app")
- "Users" (say "players" or "hoopers")
- "Gamification" (internal framing — never say to players)
- "Athlete profile" (too organized-sports formal)
- "Gym" or "fitness" (implies generic fitness context; say "court" or "rec center")

**Glossary:**
| Term | Meaning |
|------|---------|
| Run | An informal pickup game session |
| Check-in | GPS-verified arrival at the campus court to start a session |
| Archetype | Your player type label (e.g., "3 & D Wing") derived from 4-skill ratings |
| Overall | Your composite skill score (45–99) |
| Encountered player | Someone at the same court during your overlapping session — eligible to rate |
| Court node | The single campus rec center court that represents a school on Ball Up Top |
| Session | One check-in → checkout cycle at a court |
| Leaderboard | Top-rated players at your campus court over the last 30 days |

---

## Brand Voice
**Tone:** Authentic, competitive, street-savvy. Speaks like a hooper, not a fitness app or a startup.

**Style:** Direct, concise, real. Short sentences. No corporate speak. Respects basketball culture.

**Personality:**
- Credible (we understand the game and the culture)
- Competitive (earn your rating — it's not given)
- Campus-rooted (this is your school's scene, not a generic app)
- Community-first (for the culture, not for downloads)
- Hungry (we're building something new for a community that's been ignored by tech)

---

## Proof Points
**Metrics to pursue:**
- Active players per campus court (target: 50+ within 60 days of launch)
- Check-ins per active user per week (engagement: target 3+)
- Rating completion per session (loop quality: target 45%+)
- D7 retention (target: 35%+)
- Archetype cards shared per week (virality signal)

**Target customers / launch segment:**
- Purdue University (~50,000 students; est. 2,000–5,000 active pickup players)

**Value themes:**
| Theme | Proof |
|-------|-------|
| Real-time court activity | GPS check-in, active player count live on court card |
| Earned skill ratings | EMA algorithm with rater weighting, overlap requirements, outlier detection |
| Nuanced player identity | 40+ archetypes from 4-dimensional skill data |
| Campus-rooted community | One court per campus — density beats breadth |
| Anti-gaming | Proximity check (<100m), rater credibility formula, session overlap gate |

---

## Goals
**Business goal:**
Achieve product-market fit at Purdue University — build a campus pickup basketball community of 50+ active players at the rec center within 60 days. Prove the single-campus-node model before expanding to the next school.

**Key conversion action:**
First check-in (activation event — downloading alone is meaningless).

**Secondary conversion:**
First rating submission (loop completion — signals the social layer is working).

**Current metrics:**
Pre-launch. No production users yet.

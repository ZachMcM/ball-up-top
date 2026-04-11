# Product Overview — Ball Up Top

*Last updated: 2026-04-11*
*Post-pivot. Reflects Yik Yak model, location-based onboarding, and campus-first architecture.*

---

## What Ball Up Top Is

Ball Up Top is the social layer for college pickup basketball. Players check in at their campus rec center, play their run, rate every opponent they guarded, and receive a skill rating and player archetype built from real peer evaluations. The court leaderboard shows who the top players on campus are — updated in real time, earned in real games.

**The one-liner:** "Check in. Get rated. See who runs your court."

**The campus model:** Ball Up Top operates one court node per campus — always the main campus rec center. Players discover courts based on their physical location. Their community membership is determined by where they actually play, not by a school affiliation declaration. Ratings are universal; leaderboards are court-specific.

---

## The Problem

Pickup basketball at college has no infrastructure.

The social and competitive reality is rich: there are clear hierarchies, known players, unspoken pecking orders, and genuine competition. But none of it is tracked, visible, or portable. A freshman doesn't know where the run is happening. A player who moves to a new campus leaves their rep behind. The question "who's the best pickup player on campus?" gets answered verbally, contested, and forgotten.

**The specific gaps:**
1. **No real-time court activity signal** — you show up and hope
2. **No portable skill reputation** — your rep exists only for people who've seen you play
3. **No visible campus basketball hierarchy** — the rankings are informal and untracked
4. **No on-ramp for new players** — freshmen and transfers have no way to find the scene or break in

---

## The Solution

**Core Loop:**
```
Check in (GPS, <100m) → Play → Check out → Rate encountered players → Rating + archetype update → See leaderboard position
```

**What each step delivers:**

| Step | Player Value |
|------|-------------|
| Check in | Real-time activity data for all other players — "people are there right now" |
| Play | Nothing required from the app — passive session tracking |
| Check out | Triggers the rating screen — auto-navigate, highest motivation moment |
| Rate | Peer rating data enters the algorithm; rater's own credibility score updates |
| Rating update | EMA-weighted overall (45–99) and 4-skill breakdown update |
| Archetype | One of 40+ archetypes reflecting play style; changes as ratings evolve |
| Leaderboard | Public, court-specific ranking of all players who've checked in recently |

---

## The Rating System

**Algorithm:** Exponential Moving Average (EMA) weighted by four factors:

1. **Overlap weight** — how long rater and ratee played together (2-min minimum to rate)
2. **Rater credibility** — rater's own overall rating (higher-rated players' opinions count more)
3. **Run competitiveness** — average skill level of all players in the session
4. **Outlier penalty** — ratings 30+ points from current skill are down-weighted by 50%

**Scale:** 45–99. No one starts at zero. All new players begin at 65 overall, which updates after each rated session.

**Why players trust it:** The algorithm is meaningfully resistant to gaming. Friend inflation is dampened by rater credibility weighting. Short "fake sessions" are prevented by overlap requirements. Collusion is detectable via the outlier penalty. Communicating these mechanisms is a marketing asset: "You can't fake this."

---

## Player Archetypes

40+ archetypes derived from:
- **Height input** (onboarding): determines Guard / Wing / Big classification
- **4 skill dimensions**: Shooting, Finishing, Playmaking, Defense
- **Threshold combinations**: each archetype has a specific skill profile it maps to

**Sample archetypes by position:**

| Category | Archetype | Profile |
|----------|-----------|---------|
| Guard | Playmaking Shot Creator | High Playmaking + High Shooting |
| Guard | 3 & D Guard | High Defense + High Shooting |
| Guard | Slasher | High Finishing + High Playmaking |
| Wing | 3 & D Wing | High Defense + High Shooting + High Finishing |
| Wing | Two-Way Wing | Balanced across all 4 dimensions |
| Big | Paint Beast | High Finishing + High Defense (low Shooting) |
| Big | Stretch 5 | High Shooting + High Finishing |
| Big | Defensive Anchor | Very High Defense |

The archetype is the product's highest-retention feature and primary virality mechanism. "What's your archetype?" should become natural vocabulary in campus basketball communities.

---

## Court Architecture

**One court per campus.** Always the main campus rec center or gymnasium.

**Why one court:**
- Concentrates all check-ins into a single high-density node
- Makes the leaderboard meaningful (everyone who plays on campus is on the same board)
- Prevents the fragmentation problem (5 campus courts with 3 players each = no meaningful data anywhere)
- Mirrors the Yik Yak model — one community per campus, density over breadth

**Court data model:**
- Real-time active player count (based on current open check-ins)
- Hourly activity heatmap (last 7 days)
- Court leaderboard (top players by overall rating, last 30 days of activity)
- Average rating at court (skill level signal for new visitors)
- Session history (timestamp, player count, duration)

**Court discovery:** Location-based. Players see courts near them sorted by distance and activity. No school affiliation required. Community membership is determined by check-in behavior.

**Visitor model:** Players who check in at courts outside their behavioral home court appear on that court's leaderboard with a visitor indicator. Ratings are universal; only the home court designation is behavioral.

---

## Target Market

**Primary:** College students aged 18–24 playing pickup basketball at campus rec centers at large universities (30,000+ enrollment preferred).

**Secondary:** Graduate students, local community members, and alumni who play at campus rec centers.

**Non-target (current phase):** Casual gym players at commercial gyms (24 Fitness, LA Fitness, YMCA). The rating, archetype, and leaderboard features require campus social infrastructure to activate. See `rating-feasibility-non-college.md` for full analysis.

**Launch sequence (large schools first):**
1. Purdue University (beachhead — ~50,000 students)
2. Ohio State (~60,000)
3. University of Michigan (~48,000)
4. Indiana University (~45,000)
5. Michigan State (~50,000)

Large schools are prioritized because their pickup player pool is large enough to reach tipping point (20+ weekly active players) within the ambassador pre-seeding window.

---

## Personas

### The Competitive Regular
- 19–26, plays 3–5x/week at the campus rec center
- Already knows the informal campus hierarchy — knows who the best players are
- **Primary JTBD:** Have his skill recognized publicly by the campus basketball community
- **Retention hook:** Leaderboard position and archetype identity
- **Acquisition:** Ambassador invite or FOMO from seeing another player's archetype

### The Freshman / New Player
- 18–19, first or second semester on campus
- Doesn't know the scene, doesn't know where people actually play
- **Primary JTBD:** Find the court and break into the community
- **Retention hook:** Real-time court activity; seeing a live leaderboard for the first time
- **Acquisition:** Back-to-school marketing, r/[school] posts, dorm GroupMes

### The Social Hooper
- 19–24, plays 1–2x/week with a loose group
- Motivated by the social experience as much as competition
- **Primary JTBD:** Know when and where to show up without texting everyone
- **Retention hook:** Geofence notification ("8 players at the rec right now")
- **Acquisition:** From a Competitive Regular in their social circle

### The Stats Guy
- Any age, data-motivated, tracks his own development
- **Primary JTBD:** Track skill progression objectively over time
- **Retention hook:** Rating history graph, archetype evolution
- **Acquisition:** Product description — 4-skill breakdown + rating history is immediately appealing

---

## Competitive Landscape

**No direct competitor** combines real-time GPS check-in + peer skill ratings + player archetypes + court leaderboards in a single mobile app.

| Competitor | Gap |
|-----------|-----|
| Hooper App | Scheduling-only; no real-time check-in; no skill ratings |
| Google Maps | Court locations only; no activity data; no community |
| GroupMe / Discord | Coordination for existing crews only; no discovery; no ratings |
| PickupBasketball.com | Web-only directory; no real-time anything; no skill layer |

**Relevant analogues (not competitors):**
- **Yik Yak**: Campus-bound social community architecture — the structural model for Ball Up Top
- **Chess.com**: Skill rating creates identity and retention; "what's your ELO?" = "what's your archetype?"
- **Strava**: Sports-specific social layer with leaderboards; validates that sports tracking + community = strong retention

**Ball Up Top's moat (once critical mass is achieved):**
- Rating history data per player (high switching cost after 50+ sessions)
- Court activity history (competitors would need years of check-in data to replicate)
- Community network effect (each new player makes the leaderboard more meaningful)
- Trust in the algorithm (earned through consistency; hard to replicate quickly)

---

## Technical Foundation

- **Frontend:** React Native / Expo (iOS + Android)
- **Backend:** Node.js / Express
- **Database:** PostgreSQL
- **Auth:** OTP-based (no password)
- **GPS:** <100m proximity check for check-in verification
- **Notifications:** Push notifications for geofence triggers, rating windows, milestones

---

## Business Model

**Current:** Free. Growth phase — no monetization until critical mass is proven at 3+ campuses.

**Future paths (post critical-mass):**
1. **Freemium:** Premium features (extended rating history, advanced skill breakdown, verified court presence badges, season championship trophies). Core features remain free — monetization cannot touch network effects.
2. **Campus rec licensing:** Universities pay for Ball Up Top as a value-add for rec center members. B2B2C path that eliminates the cold-start problem at new schools.
3. **Brand partnerships:** Sneaker, apparel, and basketball training brands pay for access to a verified, skill-identified college basketball audience.
4. **Aggregate court intelligence:** Anonymized court activity data for facility managers and parks departments (long-term).

**What to never monetize:** Real-time court data or the rating system behind a paywall. These are the network effects. Paywalling them kills the product.

---

## Launch KPIs

| Metric | Target (Day 30) |
|--------|----------------|
| Total installs | 200+ |
| Activation rate (install → first check-in) | >40% |
| Rating completion (check-in → rating submitted) | >40% |
| D7 retention | >30% |
| D30 retention | >20% |
| Weekly active players at court | 15+ |
| Archetype cards shared/week | 20+ |
| Ambassador activity rate | >80% of cohort checking in 3x/week |

**North Star Metric:** Weekly active players per campus court.

**Expansion go/no-go threshold:** 20+ weekly active players sustained for 30 consecutive days before any new campus launch.

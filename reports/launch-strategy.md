# Launch Strategy — Ball Up Top

*Last updated: 2026-04-11*
*Post-pivot. One court per campus, location-based discovery, large schools first.*

---

## The Governing Principle

**Density before breadth. One campus fully before the next campus starts.**

Ball Up Top is a network-effects product. Its value is proportional to the number of players checked in at the same court at the same time. A campus with 50 active players is infinitely more valuable than 10 campuses with 5 active players each — because 50 active players produce a meaningful leaderboard, real check-in data, and actual social proof. 5 players produce none of these.

Every expansion decision, timeline, and KPI in this document serves one goal: achieving and sustaining the **tipping point** (20+ weekly active players at a campus court) before moving to the next campus.

---

## Phase 0: Pre-Launch Infrastructure

### Court Selection

Each campus gets exactly one court: the main campus rec center or primary indoor gymnasium. This is the architectural decision the entire model depends on.

**Selection criteria:**
- Highest consistent pickup basketball activity on campus (Google Maps reviews, campus rec website, Reddit/student forums)
- Accessible to all students (not a club-only or athletics-only facility)
- Indoor preferred (weather-independent = more consistent check-in patterns)
- GPS-friendly building (some facilities have GPS dead zones — test before launch)

**Court addition process:** Courts are added by the Ball Up Top team only, one per campus launch, after the ambassador program is in place. No user-submitted courts until the campus model is proven at 5+ schools.

### Google Places API Integration

Ensure the target court exists in Google Places with accurate:
- GPS coordinates (verify with on-site test)
- Address and name
- Hours of operation (for activity prediction)

If the court has poor Google Places data, submit a correction via Google Maps at least 2 weeks before launch.

---

## Phase 1: Ambassador Recruitment (T-minus 3 weeks)

### Who to Recruit

The ambassador cohort must be the most **respected pickup basketball players** at the target courts — not the most popular students in general, not friends of the founder, not influencers.

The right ambassador is the player other players try to impress when they show up. Ask: "Whose name comes up when people argue about who's the best at this court?" That person is the target.

**Minimum cohort size:** 8–12 ambassadors at the target court.

**Why 8–12:** This number produces enough pre-seeding activity to populate a real-looking leaderboard (10+ entries) and sufficient check-in frequency (3 check-ins per ambassador per week = 24–36 check-ins in the pre-launch window) without requiring the social coordination overhead of a large group.

### How to Find Ambassadors

**In-person scouting (most effective):** Show up to the target court on peak days (Saturday afternoon, weekday evenings) over 2–3 weeks. Observe. Identify the 5–10 players who (a) show up consistently, (b) others defer to, and (c) have clear skill command on the court.

**Instagram scouting:** Search for campus basketball accounts, campus sports hashtags, and player accounts that tag the target court. Players with basketball highlight content and campus followers are good candidates.

**Intramural records:** Many campus rec programs publish IM basketball standings publicly. Top teams from prior semesters = ready-made list of committed, organized campus basketball players.

**Reddit/student forums:** Post asking "who are the known players at [Court]?" in campus subreddits. The answers are organic ambassador leads.

### The Ambassador Pitch

The pitch is about status and legacy, not features:

> "You're one of the best players at [Court]. I'm building Ball Up Top — the first real leaderboard for campus pickup basketball. When we launch at [School], your name is going to be at the top of the rankings. I want you to be one of the first players rated here. After launch, that status is gone — you'd be just another player. Right now you can be a founding player."

**What the pitch is NOT:** a feature demo. Don't lead with GPS check-in or algorithm details. Lead with the leaderboard position and founding status.

**Ambassador commitment asked:**
- Check in at the target court at least 3 times per week for 2 weeks pre-launch and 4 weeks post-launch
- Rate every player they played against after each session
- Tell their basketball social circle about Ball Up Top in conversation (not forced promotion — just "come get your rating")
- Share their archetype card when they receive it (natural, not mandatory)

**What ambassadors receive:**
- "Founding Hooper — [School] — Season 1" permanent profile badge (never available after launch)
- Top leaderboard positions from pre-seeding head start
- Being part of the origin story of Ball Up Top at their school

**What ambassadors do NOT receive:** Cash. This is critical. Cash converts intrinsic motivation (pride, status, community) into a transaction, which reliably reduces genuine advocacy and creates Cobra Effect risks for the rating system.

---

## Phase 2: Pre-Launch Seeding (T-minus 14 days to Day 0)

### Seeding Goals

By the end of the 14-day pre-seeding window, the target court must have:
- 10+ unique players on the leaderboard
- 30+ ratings submitted between the ambassador cohort
- 5+ archetypes generated
- Activity data showing consistent check-ins across 3+ days per week
- A realistic hourly activity heatmap

These numbers make the app feel "alive" to the first non-ambassador user who opens it on Day 1. An empty leaderboard on launch day is fatal — it confirms the "ghost app" fear that causes immediate churn.

### What Ambassadors Do During Pre-Seeding

1. Check in on arrival at the court (within the GPS radius)
2. Play normally — no need to do anything different during the run
3. Check out when leaving — don't let sessions dangle (auto-checkout is a safety net, not the goal)
4. Rate every player they played with for 2+ minutes — all 4 dimensions
5. Look at their archetype when it populates and share it to their Instagram Story

**Ambassador coordinator role:** Assign one ambassador as the cohort coordinator. They text the others reminders on check-in days, monitor who's fallen off, and flag issues to the founder. This is a community management role, not a marketing role.

### Pre-Launch Social Seeding

**Instagram (2 weeks before launch):**
- Create @balluptop_[school] account (e.g., @balluptop_purdue)
- Post 2–3 teaser posts during pre-seeding week: "Something is coming to [School] courts." No product details yet. Court photography only.
- Ambassador archetype cards begin posting naturally once archetypes generate. Repost these with permission.

**Do NOT:**
- Announce the app publicly yet
- Post leaderboard screenshots (the leaderboard is still thin — wait for launch day)
- Run ads or broad promotion

---

## Phase 3: Launch Day

### Launch Checklist

| Channel | Action | Notes |
|---------|--------|-------|
| Instagram | Launch announcement post | Court photo + leaderboard screenshot + "Ball Up Top is live at [School]" |
| Instagram Story | "Founding Player status — first 50 to check in" countdown | Urgency framing |
| r/[school] | Story-first launch post by founder | Personal, honest, not promotional |
| Campus paper | Send pitch to sports editor 3 days prior | "Student-built pickup basketball app launches at [School]" |
| IM coordinator | Email or in-person meeting | Offer Ball Up Top as value-add for IM basketball participants |
| Ambassador GroupMes | Ambassadors personally drop a message in their basketball chats | Human, not promotional — "come get your rating" |
| Court takeover | 3–5 ambassadors at target court during peak hours | Recruit in-person, walk players through the app on the spot |

### Launch Day Framing

**DO say:** "The [School] leaderboard is live. Come see where you rank."

**DON'T say:** "Download our app" / "We just launched" / "Check out our features"

The framing is about the community and the competition, not the product.

### First 50 Players — Founding Hooper Status

The first 50 players to complete their first check-in receive "Founding Hooper — [School] — Season 1" permanent badge. This is:
- **Genuine scarcity** (only available before the 50th check-in)
- **Permanent** (never revokable)
- **Identity-bearing** (it says something about who you were when this started)

Post the Founding Hooper counter to Instagram Stories throughout launch day: "42 of 50 Founding Hooper spots remain."

---

## Phase 4: Post-Launch (Weeks 2–8)

### Monitoring Protocol

**Check weekly:**
- Weekly active players (North Star — must trend toward 20+)
- Check-in frequency per day (minimum viable: 7 unique check-ins/week)
- Rating completion rate (target: >40%)
- Ambassador activity (target: >80% of cohort checking in 3x/week)
- D7 retention of new users acquired this week

**Reactivation threshold:** If weekly check-ins fall below 7 for any 7-day window, activate the ambassador reactivation protocol within 48 hours. Do not wait.

### Ambassador Reactivation Protocol

If any ambassador goes silent:
1. Personal message (text or DM) from founder: "Hey — the [Court] leaderboard needs some life. Can you get there this week?"
2. If no response in 48 hours: in-person or phone call
3. If consistent absence: recruit a replacement ambassador via the original scouting process

Ambassador churn is the primary operational risk in weeks 2–8. The leaderboard is only as alive as the people checking into it.

### Content Flywheel (Weeks 2–8)

| Week | Content |
|------|---------|
| 2 | Weekly leaderboard update post — tag top 5 players (with permission) |
| 2 | Player spotlight: Ambassador #1 — archetype card, quote |
| 3 | "Ball Up Top at [School] — Month 1 in numbers" milestone post |
| 3 | TikTok: first archetype reveal video from a non-ambassador player |
| 4 | Season 1 mid-point leaderboard standings |
| 4–8 | Weekly leaderboard updates; player spotlights; archetype content |
| End of semester | Season 1 Championship: crown the top player, post announcement |

---

## Expansion Playbook

### Go/No-Go Criteria

A campus is "proven" when ALL of the following are true for **30 consecutive days**:

| Metric | Threshold |
|--------|-----------|
| Weekly active players | ≥ 20 |
| Rating completion rate | ≥ 40% |
| D30 retention | ≥ 20% |
| Ambassador activity rate | ≥ 80% checking in 3x/week |
| Leaderboard entries | ≥ 25 unique players |

Do not expand until all five are met. No exceptions. The next campus's success depends on the playbook being validated, not just enthusiasm being high.

### Expansion Sequence

**Rationale for sequencing:** Large schools first (faster critical mass). Geographic clustering second (ambassador pipeline, cultural proximity).

| Campus | Enrollment | Priority | Rationale |
|--------|-----------|----------|-----------|
| Purdue | ~50,000 | 1 (current) | Beachhead — founder familiarity |
| Ohio State | ~60,000 | 2 | Largest Big Ten; dense pickup culture |
| University of Michigan | ~48,000 | 3 | Strong basketball culture; college town |
| Indiana University | ~45,000 | 4 | Purdue ambassador pipeline; regional |
| Michigan State | ~50,000 | 5 | Complete Big Ten Midwest core |
| Texas (UT Austin) | ~51,000 | 6 | Large enrollment; new geography; strong campus culture |
| UCLA | ~46,000 | 7 | LA market; media potential |
| North Carolina | ~30,000 | 8 | College basketball culture capital of the US |

### The Campus-to-Campus Ambassador Pipeline

The expansion multiplier: every campus has students who know players at neighboring schools via AAU, high school circuits, and campus visit networks.

After Month 1 at Purdue: ask the top 5 most active ambassadors — "Do you know any players at Ohio State? Michigan? IU?" The warm intro to the next campus's anchor ambassador is worth more than any cold outreach.

**Target:** By campus #4, 60%+ of ambassador leads come from existing network referrals rather than cold scouting.

### Per-Campus Launch Timeline (Compressed from Purdue Learning)

| Week | Action |
|------|--------|
| -3 | Remote scouting (court, campus social infrastructure, IM records) |
| -3 | Identify 3–5 ambassador leads via warm intro or Instagram scouting |
| -2 | Ambassador recruitment meetings (in-person or video call) |
| -2 | Ambassador cohort confirmed (8–12 players) |
| -1 | Pre-seeding begins (3x/week check-ins) |
| -1 | Campus Instagram account created; teaser posts begin |
| 0 | Launch: all channels simultaneously |
| 1–4 | Monitoring + ambassador maintenance + weekly leaderboard content |
| 8 | Go/No-Go evaluation for next campus |

---

## Season Structure

Ball Up Top operates on academic semester seasons:

| Season | Duration | End Event |
|--------|----------|-----------|
| Fall Season | September 1 – December 1 | Season 1 Championship: top player crowned, featured on Instagram |
| Spring Season | January 15 – April 30 | Season 2 Championship |
| Summer Season (optional) | May 15 – August 15 | Lighter engagement; optional based on campus activity |

**Why seasons matter:**
- Ongoing narrative arc (there's always a season in progress)
- Re-engagement hook at each new season start ("leaderboard resets — new race begins")
- End-of-season content (player spotlights, championship announcement)
- Academic calendar alignment means the audience naturally resets each semester (freshmen arrive, seniors graduate)

**Season reset mechanics:** Leaderboard positions reset each season. Individual player ratings carry forward (reputation is permanent). This preserves the competition urgency while allowing new entrants to compete for season titles.

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Ambassador cohort goes dormant post-launch | High | Critical | Weekly check-ins with coordinator; reactivation protocol ready |
| Courts feel empty on Day 1 (seeding insufficient) | Medium | Critical | 14-day minimum pre-seeding with 8+ ambassadors; leaderboard quality check before launch |
| Rating completion rate below 40% | Medium | High | Auto-navigate to rating screen on checkout; push notification 20 min post-checkout |
| Multi-campus city confusion (which court to choose) | Low-Medium | Medium | Location-based discovery shows nearest active courts; player behavior determines home court |
| Competitor launches at same campus simultaneously | Low | High | Speed is the mitigation; first to reach tipping point owns the campus |
| Leaderboard gaming during launch prize campaign | Medium | High | Eligibility gates (minimum sessions + unique opponents); see viral-campaign-strategy.md |
| Ambassador cohort is wrong players (not respected) | Medium | High | In-person scouting at courts before ambassador outreach; don't shortcut to convenience |

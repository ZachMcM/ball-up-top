# Marketing Psychology — Ball Up Top

*Last updated: 2026-04-10*

---

## Overview

This report applies behavioral science and psychological principles to four critical areas for Ball Up Top:
1. **The habit loop** — can check-in / play / rate become automatic?
2. **Identity mechanics** — why archetypes and ratings drive retention
3. **Cold-start psychology** — how to bootstrap a network-effects product at Purdue
4. **Grassroots / ambassador marketing** — the psychology of peer adoption

---

## Part 1: The Habit Loop — Check In / Play / Rate

### The BJ Fogg Behavior Model Applied

> Behavior = Motivation × Ability × Prompt

Every step of the loop must satisfy all three conditions simultaneously.

| Step | Motivation | Ability | Prompt | Risk |
|------|-----------|---------|--------|------|
| Check-in | High (want to see who's playing) | Medium (must open app within 100m) | LOW — no automatic trigger | Habit never forms if prompt is absent |
| Play | N/A (passive) | High | N/A | None |
| Check out | Low-Medium (don't want to forget) | High (one tap) | LOW — nothing reminds them to close | Sessions stay open indefinitely |
| Rate | Variable (mood-dependent) | Medium (preset buttons help) | Medium — auto-nav on checkout | If checkout is skipped, rating never happens |

**Key finding:** The app's core loop has two prompt gaps — check-in and checkout. Both require the user to *remember* to do something at a specific moment. Without built-in prompts, the loop will fail consistently in early adoption.

**Recommendations:**
- **Geofence notification:** "You're near [Court Name] — 6 players checked in. Pull up?" fires when proximity is detected, solving the check-in prompt gap
- **Session timeout prompt:** After 4+ hours of active session with no movement, push "Still at the court? Tap to wrap up." solves the checkout prompt gap
- **Rating window push:** 20 minutes post-checkout: "Rate your run — 4 players are waiting for their rating." preserves the emotional moment before it fades

### Activation Energy

The greatest threat to habit formation is high activation energy at the *very first step*. For Ball Up Top, the first check-in is the activation event — it delivers all first-time value (who's here, what's the leaderboard, what's my rating). Everything before that first check-in is a conversion funnel.

**Onboarding friction analysis:**
The current onboarding path is: OTP verification → name → height → profile image → location permission → app.

That's **5 gates before the first value delivery.** For a 19-year-old with app fatigue, this is high activation energy.

**Recommendation:**
- Defer profile image to post-activation ("Add a photo so players know who you are — tap to upload") — triggered after first check-in, not before
- Height can remain early (it's needed for archetypes and takes 2 seconds)
- Frame location permission *after* showing a court map: "Allow location to see courts near you" is more compelling than requesting it blindly in onboarding

### Goal-Gradient Effect

People accelerate effort as they approach a goal. Ball Up Top can leverage this in the rating system and profile building.

**Applications:**
- Show a "Progress to [next milestone]" indicator on the profile screen: "12 more ratings to reach 75 overall"
- Display archetype near-misses: "You're close to 'Elite Shooter' — 3 more high shooting ratings could push you there"
- Session count progress: "3 sessions this week — most active week ever"

These "almost there" signals trigger increased engagement right when users might otherwise go dormant.

### Zeigarnik Effect

Unfinished tasks occupy the mind. Completed loops feel resolved; open loops feel like nagging obligations.

**Application:**
- If a user checks out but doesn't rate, the activity feed should show an *open* "Session at [Court]" with "Tap to rate your run" — a visual incomplete state that creates cognitive tension until resolved
- Push notification copy: "Your run at Slayter Hill is unfinished — your teammates are waiting for their ratings" (not "You have ratings to submit")
- The rating screen should use a completion indicator (e.g., "4 of 6 players rated") rather than a count-up — the count-down to zero triggers completion drive

---

## Part 2: Identity Mechanics — Why Archetypes and Ratings Drive Retention

### Identity-Based Behavior (Commitment & Consistency)

The most durable behavior change is identity-based, not outcome-based. Once someone internalizes "I am a 3 & D Wing" or "I'm an 82 overall," their behavior aligns to protect and reinforce that identity.

This is Ball Up Top's most powerful retention mechanism — and it's baked into the product. The archetype system is fundamentally an **identity assignment mechanism.**

**Why this matters:**
- Identity-based users churn at dramatically lower rates than outcome-based users
- Players who identify with their archetype will *actively defend* their rating — meaning they'll play more, rate more, and stay engaged to protect their standing
- The moment a player's archetype changes (upward), it's a peak experience — a signal that their identity has evolved. This is a milestone that demands to be shared.

**Implications for marketing:**
- "What's your archetype?" is a better acquisition hook than "Find courts near you." It's personal, shareable, and creates FOMO for players who don't have one yet
- Archetype reveals should be treated like a moment of ceremony — animation, bold display, brief explanation of why ("Your shooting and playmaking put you here") — not just a text label

### Social Identity Theory

People define themselves partly through group membership. Being a "hooper" is already an identity. Ball Up Top creates a *sub-identity* within that (your archetype, your rating, your court's leaderboard rank).

**The key insight:** Players will tolerate a lower absolute rating if it accurately *represents* them, but will resist a rating they feel is *wrong about who they are.* A "Paint Beast" who actually has good range won't feel seen.

**Recommendation:** Add a lightweight feedback mechanism post-archetype-generation: "Does this feel right?" with a one-tap yes/no. This isn't just a data signal — it's an invitation to emotionally invest in the archetype, and investment creates ownership.

### Endowment Effect

People value things more once they own them. A player who has an archetype, a rating history graph, and a leaderboard position has *something to lose.* This makes them more resistant to churning than a new user with nothing accumulated.

**This is why the first session → first rating → first archetype sequence is so critical.** Once that loop completes, the user owns something. Before it does, they own nothing and churn costs them nothing.

**Application:**
- The rating history graph is meaningless with 1 data point but increasingly valuable with 5, 10, 25. Communicating "your graph updates after every run" creates anticipation for the data that will accumulate
- Leaderboard rank — even at a less-populated court — creates a position to defend. "You're #4 at Slayter Hill" is stickier than "You have a rating"

### Mimetic Desire

People want things because others want them. The archetype system is inherently mimetic — seeing someone else's archetype creates the desire to have one.

**This is the most underutilized virality vector in the product.**

A player sees a friend's archetype ("Paint Beast — 84 overall") and immediately wants their own. Not because they're comparing, but because they now know this thing *exists* and they don't have it yet.

**Application:**
- Social sharing of archetypes should be frictionless and native — one tap to generate a shareable card (archetype name, overall rating, 4-skill breakdown, court affiliation)
- Design the shareable to be visually distinct and cool enough that sharing it feels like showing off something earned, not just advertising the app
- The phrase "what's your archetype?" should become organic vocabulary among Purdue ballers — ambassadors should use it constantly in conversation

---

## Part 3: Cold-Start Psychology — Bootstrapping Network Effects at Purdue

### The Critical Mass / Tipping Point Problem

Ball Up Top is a network-effects product. Its value scales with the number of players checked in. At zero users, it provides zero real-time value. This is the cold-start trap.

**The psychological dynamic:** If early users open the app and see empty courts, their prior is confirmed ("nobody uses this") and they churn. That churn makes the app *more* empty, which causes more churn. This is a death loop.

**The solution is manufactured critical mass** — engineering the perception of activity before organic activity sustains itself.

**Specific tactics:**
1. **Ambassador seeding:** Launch with 15–20 committed ambassadors who check in at the same 2–3 courts consistently for 2 weeks before any broader promotion. When the app is "publicly" launched, those courts already have leaderboards, activity history, and visible player counts.
2. **Court selection:** Don't try to populate all of Purdue at once. Pick 2 courts max (e.g., CoRec main gym + one outdoor court). Concentrated early activity at 2 courts beats thin activity at 10 courts.
3. **Activity graph seeding:** The hourly activity graph and court leaderboard are visible to all users before they check in. These create credibility signals even for users who haven't participated yet. Ambassador sessions populate these.

### Availability Heuristic

People judge likelihood by how easily examples come to mind. If the first players someone hears about having great archetypes are respected players they know, the idea that "this is real and worth doing" becomes readily available.

**Application:**
- Make the first ambassador cohort the most visible, respected players in the Purdue pickup scene. Not the most popular students generally — the most respected *hoopers.*
- When those players share archetypes and ratings, credibility transfers. "If [respected player] has an 87 overall and takes this seriously, it must mean something."

### Social Proof (Bandwagon Effect)

People follow what others do. Numbers create confidence. The question isn't "is this good?" but "is this what people like me do?"

**Application:**
- As soon as any meaningful usage numbers exist, display them. "120 players on campus have their archetype" is more motivating than any feature description.
- At the court level, even 3–4 regular check-ins from ambassadors creates a leaderboard that makes the court feel "live" to new visitors
- Use "X players at Purdue are already ranked" language in recruitment materials — makes early adopters feel they're joining a movement, not a ghost app

### Unity Principle ("One of Us")

The most effective recruitment isn't "this app is useful" — it's "real hoopers use this." Positioning Ball Up Top as part of pickup basketball culture (not a tech product for basketball) is critical.

**Application:**
- All campus marketing should feel like it comes from within the basketball community, not a startup
- Ambassador language should be "come get your rating" not "download the app"
- Avoid tech-product aesthetics in campus materials — use court photography, real players, real archetypes

### Foot-in-the-Door Technique

Get a small commitment first, then escalate. Download → check-in → first rating → regular user.

**Application:**
- The download is not the goal. The first check-in is.
- Every piece of campus marketing should end with a specific call to action tied to the first value moment: "Get your rating at [specific court] this Friday"
- Ambassador QR codes at courts can deep-link directly to court check-in, skipping the discovery step

---

## Part 4: Grassroots / Ambassador Marketing Psychology

### Why Ambassador Marketing Works: The Liking / Similarity Bias

People say yes to people they like and people who are similar to themselves. Peer recommendation from a trusted baller beats any ad creative.

**The math on pickup communities:**
Every court has 3–5 "cornerstone" players — the ones who show up consistently, whose opinions shape the social dynamic, who are respected enough that when they say "this is good," others pay attention. These are the only people whose endorsement matters in the first cohort.

**Identifying the right ambassadors:**
Not the most popular students. Not influencers. The most respected pickup basketball players at the target courts. Ask: "Who do people try to impress when they play?" That's your ambassador.

### Reciprocity Principle

Ambassadors who receive something meaningful (exclusive access, early archetypes, recognition) feel reciprocally obligated to advocate. But the reciprocity must feel genuine, not transactional.

**Application:**
- First cohort ambassadors should get "Founding Player" status — a visible badge or tag on their profile ("Founding Hooper — Purdue 2026") that can never be earned after launch. This is permanent, valuable, and costs nothing to produce.
- The "Founding Player" framing creates identity investment: they're not just users, they're part of the origin story
- Do NOT pay ambassadors cash — it converts intrinsic motivation (pride, identity, community) into extrinsic motivation (money), and research shows this reliably reduces genuine advocacy

### Commitment & Consistency (The Escalation Path)

Once someone makes a small public commitment, they align future behavior to stay consistent.

**Application:**
- Ask ambassadors for progressively larger commitments: agree to try the app → agree to check in 3 times this week → agree to recruit one friend → agree to represent Ball Up Top at intramural games
- Each "yes" makes the next easier. The first yes is the only hard one.
- Public commitment is stronger than private: asking an ambassador to tell their court crew "I'm using Ball Up Top this week" creates a social contract they're motivated to honor

### The Pratfall Effect (Authenticity)

Competent people who admit small flaws are more likable and trustworthy. Perfect marketing is less relatable than honest marketing.

**Application:**
- Ambassador talking points should acknowledge the app is new: "It's new but we're building the Purdue scene on it — come get your rating" is more honest and disarming than "it's the best app for basketball"
- Lean into the early-adopter frame: "You'll be one of the first players with a rating at this court" is a privilege, not a limitation
- The cold-start problem can be flipped: "We're building this from the ground up here" creates participation energy, not skepticism

### Scarcity (Used Ethically)

The "Founding Player" status described above is a genuine scarcity mechanism — it is only available before launch. This is not manufactured — it's real.

**Application:**
- First 50 players at Purdue to complete their first session get "Founding Hooper" status. After that it's gone.
- Not artificially scarce — genuinely time-limited by the nature of being a founding community member
- Creates urgency without deception

### Network Effects + Virality Loop

The organic virality mechanism for Ball Up Top is simple:

1. Player A gets an archetype
2. Player A shares the archetype or mentions it in conversation ("I'm a 3 & D Wing, what are you?")
3. Player B wants to know their archetype
4. Player B downloads → checks in → gets archetype → repeats

**This loop only fires if Step 2 happens reliably.** That requires:
- The archetype to feel accurate and cool enough to be worth mentioning
- A frictionless share mechanism (one tap to generate an archetype card)
- Social context where mentioning it is natural ("what's your archetype?" needs to be a conversation that players have)

Ambassadors seed this conversation norm. Once it's normal vocabulary at 2–3 Purdue courts, the loop is self-sustaining.

---

## Summary: Highest-Leverage Psychology Applications

| Priority | Principle | Application |
|----------|-----------|-------------|
| 1 | BJ Fogg + Prompts | Build geofence check-in prompt + post-checkout rating push |
| 2 | Mimetic Desire + Identity | Lead acquisition with archetype social sharing, not court discovery |
| 3 | Critical Mass engineering | Seed 2 courts with 15-20 ambassadors before any broad promotion |
| 4 | Activation Energy | Reduce onboarding gates — defer photo upload to post-first-check-in |
| 5 | Commitment & Consistency | Ambassador escalation path: small asks → bigger asks over time |
| 6 | Endowment Effect | Make the first session loop completion (rating + archetype) a priority, not optional |
| 7 | Scarcity (ethical) | Founding Player status for first 50 check-ins at Purdue |
| 8 | Zeigarnik Effect | Unrated sessions should appear visually "open" in the activity feed |
| 9 | Goal-Gradient | Show "X more ratings to next milestone" on profile screen |
| 10 | Social Proof | Display "X players at Purdue have their archetype" as soon as viable numbers exist |

# Viral & Engagement Campaign Strategy — Ball Up Top

*Last updated: 2026-04-10*
*Skills invoked: marketing-ideas, marketing-psychology*

---

## Overview

This report covers goal-based, prize-driven, and viral engagement mechanics for Ball Up Top — with deep analysis of the launch week leaderboard prize campaign as the anchor strategy, and a full suite of complementary campaigns across the product lifecycle.

The central tension in this entire report is **extrinsic vs. intrinsic motivation.** Cash prizes drive behavior fast, but they carry meaningful risks for a community-trust product like Ball Up Top. Every campaign below is analyzed through that lens.

---

## Part 1: The Launch Week Leaderboard Prize Campaign

### The Concept

**Campaign:** "Top the Leaderboard. Win Cash."
During launch week at Purdue, the 3 players with the highest overall rating on the [Target Court] leaderboard at the end of 7 days win $50 / $25 / $15.

---

### Why This Works

**Goal-Gradient Effect**
People accelerate effort as they approach a goal. A visible, real-time leaderboard with a countdown creates compounding urgency — players who are #4 or #5 play more aggressively to close the gap as the deadline approaches. The last 48 hours of the campaign will generate disproportionate activity.

**Loss Aversion > Gain Seeking**
Frame the campaign as "don't lose your spot" once players are on the leaderboard, not just "try to win." A player sitting at #2 with 2 days left is psychologically more motivated to *protect* that position than a new player is to chase it from outside. Leaderboard push notifications should reflect this: "You're #2 at the CoRec — [Player Name] is 2 ratings behind you."

**Scarcity + Time Pressure (Genuine)**
7 days is real scarcity. It's not manufactured. The prize window is genuinely finite, and the leaderboard rank is zero-sum — every session someone else has is a threat to your position.

**Social Proof Flywheel**
As players compete publicly, their activity becomes visible to non-participants. A player who sees a friend checking in 4 days in a row to protect a leaderboard spot experiences mimetic desire — "I want to be in that competition." The social visibility of the competition is itself a recruitment mechanism.

**Activation Forcing Function**
The prize creates a hard reason to download and check in *this week specifically*. Without it, "I'll try the app later" is a common response. With it, "I need to start today or I'm already behind" is the psychological reality. This is exactly the activation forcing function a cold-start launch needs.

---

### The Cobra Effect Risk — This Is the Most Important Thing to Get Right

The **Cobra Effect** is when an incentive produces the exact opposite of the intended outcome. British colonial administrators in India offered bounties for dead cobras to reduce the snake population. People bred cobras to collect the bounty. The cobra population increased.

For Ball Up Top: **cash prizes tied to leaderboard position will attract attempts to game the rating system.**

The specific attack vectors:
1. **Friend collusion:** A player recruits 3–4 friends to check in together, rate each other with maximum scores, and split the prize.
2. **Session stuffing:** A player checks in for many short sessions just to accumulate more rating events, even with low-quality opponents.
3. **Coordinated rating rings:** Multiple players agree to rate each other with Elite (95) scores across sessions.

**The good news:** Ball Up Top's rating algorithm has significant built-in defenses —
- Rater credibility weighting (low-rated players' ratings count less)
- Overlap requirements (2+ min together to rate)
- Outlier detection (ratings 30 points from current skill penalized)
- Run competitiveness weighting (low-skill runs contribute less)

**The risk that remains:** The overlap and outlier detection defenses are strong against *rating inflation*, but not against *session farming* — a group of friends checking in repeatedly at the same court, playing together legitimately, and genuinely accumulating more rating events than solo players. The leaderboard winner may simply be whoever had the most organized friend group, not the best player.

**Mitigations:**

| Risk | Mitigation |
|------|-----------|
| Friend rating rings | Cap: max 1 rating per unique rater per day counts toward leaderboard score (the algorithm already applies this via EMA, but make it explicit in campaign rules) |
| Session farming | Minimum session length of 30 minutes for a session to count toward campaign eligibility |
| Collusion detection | Flag: if >70% of a player's campaign ratings come from the same 1–2 raters, flag for review before awarding prize |
| Prize-only accounts (fake users) | Require: at least 3 sessions completed before campaign eligibility starts |

**The deeper risk: trust damage**
If players perceive the winner as someone who "worked the system" rather than the actual best player at the court, it permanently undermines confidence in the rating system — which is Ball Up Top's core product. A $50 prize is not worth poisoning the well.

**Recommendation: separate the prize metric from raw rating**

Instead of "highest overall rating wins," consider: **"most sessions completed during launch week"** OR **"highest overall rating among players who completed 5+ sessions with 4+ unique opponents."** This rewards genuine engagement — showing up and playing real games — rather than pure rating maximization.

---

### Campaign Structure — Recommended Version

**Name:** "Purdue's First Hoopers"

**Duration:** 7 days from app launch

**Prize structure:** $50 / $25 / $15 (Venmo/Cash App, paid within 48 hours of campaign end)

**Eligibility rules (displayed clearly in-app and on Instagram):**
- Must complete minimum 3 sessions of 30+ minutes during the campaign week
- Must have ratings from at least 4 unique opponents
- Must have checked in at [Target Court] (e.g., CoRec) at least once

**Winning metric:** Highest overall rating at campaign end among eligible players

**Leaderboard display:** Updated every 6 hours. Show: rank, player name, overall rating, session count. Real-time visibility is the engagement engine.

**Announcement:** Post daily leaderboard updates to Instagram Stories ("Current standings — Day 3 of 7"). Tag players (with permission). Create narrative around the race.

**Prize delivery:** Venmo/Cash App publicly announced ("Congrats to [Name] — $50 winner of Purdue's First Hoopers week 🏀"). Makes the reward real and visible for future campaigns.

---

### Push Notification Strategy During Campaign

| Trigger | Message |
|---------|---------|
| Player enters top 3 for first time | "You just broke into the top 3 at the CoRec — you're #[N] with [X] days left." |
| Player drops a position | "You dropped to #[N+1]. [Player] just passed you." |
| 48 hours remaining, player in top 5 | "48 hours left. You're [N] sessions away from the top 3." |
| 24 hours remaining | "Final day. Don't leave [Court] money on the table." |
| Campaign ends, player wins | "[Name], you're Purdue's #1 hooper this week. $50 on the way." |
| Campaign ends, player didn't win | "You finished #[N]. Next campaign starts [date] — you know what to do." |

---

### Budget Breakdown

| Item | Cost |
|------|------|
| Prize pool (3 winners) | $90 |
| Social content production | $0 (ambassador-generated) |
| Push notification system | $0 (already built) |
| Total | $90 |

**CAC implication:** If this campaign drives 80 new installs and 50 activations, the effective cost per activated user is $1.80. That's exceptional. The prize pool is marketing spend, not charity.

---

## Part 2: Complementary Campaign Catalog

---

### Campaign 2: The Check-In Streak Challenge

**Concept:** Any player who checks in at least once per day for 7 consecutive days receives a permanent "Dedicated Hooper" badge on their profile.

**Why it works:**
- **Variable reward with guaranteed floor:** Unlike a prize lottery, streaks guarantee a reward for everyone who hits the target. This avoids the "why bother, I can't win" dropout problem that pure leaderboard competitions create.
- **Zeigarnik + Loss Aversion:** Once a player is on Day 5 of a streak, the fear of *losing* 5 days of progress is a stronger motivator than the badge reward itself. Streak protection is one of Duolingo's most powerful retention mechanics.
- **No gaming incentive:** Checking in daily at a real court (within 100m) can't be gamed. You either show up or you don't.

**Implementation:**
- Streak counter visible on profile and in activity feed
- Push notification: "Day [N] streak — check in today to keep it alive"
- At Day 6: "One more day. Don't break your streak."
- Badge is permanent and visible to anyone who views the profile

**Prize:** No cash — the badge is the reward. This preserves intrinsic motivation while providing extrinsic recognition.

---

### Campaign 3: "Get Your First Rating" Activation Sprint

**Concept:** Any player who completes their first full session loop (check-in → check-out → submit at least 1 rating) within the first 7 days of downloading gets a "First Run" digital badge.

**Why it works:**
- **Solves the activation problem:** The biggest drop-off in the funnel is between download and first rating submission. This campaign directly incentivizes completing the loop.
- **Foot-in-the-door:** A player who completes the full loop once has built the schema for doing it again. Activation is the hardest step; everything after is easier.
- **No gaming risk:** Completing a full session loop requires being at a real court and playing with real opponents. It can't be faked.

**Implementation:**
- Shown as a "challenge" on the home screen during the first 7 days post-install
- Progress indicator: "Step 1: Check in ✓ | Step 2: Check out | Step 3: Rate"
- On completion: confetti animation + badge reveal + share card prompt

---

### Campaign 4: Referral Race — "Bring Your Crew"

**Concept:** Players earn rewards based on how many friends they successfully recruit (friend completes their first session, not just downloads).

**Reward tiers:**
- 1 friend activated → "Crew Builder" badge
- 3 friends activated → $10 Venmo + "Connector" badge
- 5 friends activated → $25 Venmo + "Legend" profile border

**Why it works:**
- **Referrals from basketball players recruit basketball players.** A Ball Up Top user's social graph is almost certainly basketball-adjacent. Referral virality is high-quality acquisition, not broad/noisy.
- **Activation-gated (not download-gated):** Rewarding when a friend *activates* (completes first session) rather than just downloads prevents spam referrals and ensures real court activity is the outcome.
- **Addresses the network effect problem:** The primary reason new users churn is "no one I know uses this." Referral campaigns directly fight this by converting social graphs into co-users.

**Cobra Effect Risk:** Cash rewards for referrals can incentivize spam — recruiting anyone with a phone, not just actual basketball players. The activation gate (must complete a real session) largely mitigates this because it requires a real GPS check-in at a real court.

**Implementation:**
- Unique referral link/code generated in profile
- Real-time "Your crew" section showing referred friends and their activation status
- Reward delivery within 24 hours of friend's first session

---

### Campaign 5: Court Championship Season

**Concept:** Every 3 months (aligned to academic semesters), a "Season Championship" crowns the highest-rated player at each court over the full season. The champion receives a permanent season trophy on their profile, a featured post on Ball Up Top's Instagram, and (optionally) a small prize.

**Why it works:**
- **Creates a narrative arc.** Seasons give the product a sense of ongoing story — there's always a season in progress, always a championship to chase. This is the FIFA/NBA 2K model applied to pickup ball.
- **Solves the post-launch engagement cliff.** Launch week campaigns drive spike engagement, but what keeps players coming back in Week 6? The answer is a persistent, long-horizon competition.
- **Leaderboard defense behavior.** Players who hold a top leaderboard position are motivated to keep playing to protect it. The longer the season, the more sessions this motivates.
- **Annual ritual.** "Last semester's CoRec champion was [Name]" becomes social currency. A year-over-year champion narrative builds legend — exactly the kind of court culture Ball Up Top is trying to create.

**Season structure:**
- Fall: September 1 – December 1
- Spring: January 15 – April 30
- Summer (optional): May 15 – August 15

**End-of-season activation:**
- Announcement post on Instagram featuring the champion with their archetype card
- In-app notification to all players at that court: "[Name] won the Spring Season at [Court] with an [X] overall. New season starts [date]."
- Season reset: leaderboard positions reset, but individual player ratings carry forward (the reputation is permanent even if the championship resets)

---

### Campaign 6: Social Share Rewards — Archetype Virality Amplifier

**Concept:** Players who share their archetype card to Instagram Stories or TikTok and tag @balluptop receive a small in-app reward (profile highlight, extra rating history data points, or a "Featured" badge).

**Why it works:**
- **Each share is a direct acquisition event.** An archetype card on a basketball player's Instagram story reaches ~100–500 followers, a meaningful percentage of whom play pickup ball.
- **Low friction.** Sharing a cool archetype card is something players *want* to do anyway — the reward just creates a prompt and a reason to do it *now.*
- **User-generated content compounds.** A wall of archetype cards from real Purdue players on Ball Up Top's Instagram is more credible than any ad creative.

**Implementation:**
- "Share your archetype card" CTA immediately after first archetype generation
- Simple reward: "Share and unlock your full rating history breakdown" (feature gate that becomes standard after share)
- Manual verification (DM or tag-based) is fine at Purdue scale; automate later

**Recommendation:** Do NOT make this cash-based. The social share is already a favor to the product — reciprocating with recognition (a badge, a feature unlock) is appropriate. Cash turns it transactional and undermines the authenticity of the share.

---

### Campaign 7: Court Rival System — "The Rematch"

**Concept:** After a player rates an opponent, they receive a notification: "You and [Name] have gone head-to-head 3 times. Who's won the rivalry?" with a comparison card showing their ratings across the sessions they've played together.

**Why it works:**
- **Turns passive data into an active social hook.** Most players have 2–3 regulars they see at every run. Making those recurring matchups explicit creates a narrative players care about.
- **Drives return visits to specific courts.** The rivalry is court-specific — you can only extend it by showing up at the same court again.
- **Generates shareable content.** "Rivalry" comparison cards (you vs. your most-rated opponent, session-by-session) are highly shareable in the same way that Spotify Wrapped is — it's personal, specific data that says something true and interesting about you.

**Implementation:**
- Trigger: after 3 sessions with the same opponent
- Notification: "You and [Name] are becoming regulars at [Court]. Your rating is [X], theirs is [Y]."
- Profile section: "Rivals" showing top 3 recurring opponents with mutual rating history
- Share card: head-to-head archetype matchup card ("3 & D Wing vs. Slasher — who wins?")

---

## Part 3: Intrinsic vs. Extrinsic Motivation — The Strategic Framework

This is the most important strategic decision in designing engagement campaigns for Ball Up Top.

### The Core Tension

**Extrinsic rewards** (cash, prizes) drive fast, measurable behavior change. They're excellent for:
- Launch activation (getting the first 50 users over the cold-start hump)
- One-time behaviors (complete your first session, share your archetype)
- Short campaign windows where you want a spike

**Intrinsic rewards** (status, identity, community recognition) drive durable behavior change. They're essential for:
- Long-term retention
- Behaviors you want to become habitual
- Protecting the trust architecture of the rating system

**The Overjustification Effect (a.k.a. the Cobra Effect applied to motivation):** When you reward an intrinsically motivated behavior with extrinsic rewards, you can *undermine* the intrinsic motivation. Research: children who were rewarded with stickers for drawing (which they already loved) drew less after the reward was removed than they did before it was introduced. The sticker replaced their love of drawing with a transaction.

**Applied to Ball Up Top:** Players who play pickup basketball because they love it and want to build their rep need to stay intrinsically motivated to use Ball Up Top. If cash prizes become the primary reason they check in, the product becomes a cash-prize-seeking mechanism — and the moment the prizes stop, engagement collapses. Worse: the rating system becomes a prize-optimization tool, which destroys its credibility.

### The Right Structure

```
Cash prizes → Use sparingly, at launch only, to solve the cold-start problem
                  ↓
Badge/recognition rewards → Use broadly, ongoing, for habit-building behaviors
                  ↓
Pure intrinsic rewards → Build toward this as the dominant motivation
    (archetype pride, leaderboard status, rivalry, rep)
```

**The ideal campaign portfolio at any given time:**
- **1 cash-prize campaign maximum** — active during launch week or new campus launch only
- **2–3 badge/recognition campaigns** — ongoing, always-on, creating permanent status signals
- **Product-embedded virality** — archetype cards, rivalry notifications, season championships — no external reward, just making interesting data shareable

---

## Part 4: Campaign Anti-Patterns to Avoid

### Anti-Pattern 1: Ongoing Cash Prizes

**What it looks like:** "Every week, top 3 players win $20."
**Why it fails:** Trains players to expect cash for using the product. When the prize program ends (and it must, financially), engagement collapses. Creates permanent gaming incentive rather than one-time launch spike.

### Anti-Pattern 2: Rating-Count Based Prizes

**What it looks like:** "Most ratings submitted wins."
**Why it fails:** Directly incentivizes session farming and collusion. Players recruit friends to play 2-minute sessions just to generate rating events. Corrupts the data quality of the rating system permanently.

### Anti-Pattern 3: Follower/Download Referral Rewards

**What it looks like:** "Earn $5 for every person who downloads with your code."
**Why it fails:** Drives spam referrals to non-basketball players, inflating download numbers without activations. Actual basketball players don't want to be spam-recruited. Damages the ambassador relationship.

### Anti-Pattern 4: Too Many Simultaneous Campaigns

**What it looks like:** Running the prize campaign, streak challenge, referral race, and season championship all at once during launch week.
**Why it fails:** Paradox of choice. Players don't know which behavior to optimize for. The urgency of the launch prize gets diluted. Pick one primary campaign per time window and let the others run quietly in the background.

### Anti-Pattern 5: Prizes Without Eligibility Gates

**What it looks like:** "Top 3 on the leaderboard win — anyone can enter."
**Why it fails:** Ambassador pre-seeding creates a 2-week head start for founding players. A new user on Day 1 of the public launch is already 14 sessions behind. They disengage immediately upon seeing the leaderboard. Eligibility gates (minimum sessions, minimum unique opponents) level the playing field and keep more players competitive.

---

## Part 5: Recommended Campaign Stack by Launch Phase

### Phase 1: Launch Week (Days 1–7)

**Primary:** Leaderboard Prize Campaign — "Purdue's First Hoopers" ($90 prize pool)
**Secondary (quiet background):** First Session Badge — no announcement needed, just fires on completion
**Social:** Daily leaderboard update posts on Instagram Stories

### Phase 2: Weeks 2–4 (Post-Prize Retention)

**Primary:** Check-In Streak Challenge (7-day streak → permanent badge)
**Secondary:** Referral Race — "Bring Your Crew" ($10/$25 activation-gated)
**Social:** Archetype card share rewards (feature unlock, not cash)

### Phase 3: Month 2+ (Community Building)

**Primary:** Court Rival System (automatic, product-embedded)
**Secondary:** Season Championship announcement (building anticipation)
**Social:** Season standings posts, player spotlights on Ball Up Top Instagram

### Phase 4: End of Semester (Season Championship)

**Primary:** Season Championship crowning — featured Instagram post, profile trophy
**Secondary:** New season launch with fresh leaderboard
**Social:** "Who's chasing the title?" narrative content for the new season

---

## Summary: The $90 That Does the Most Work

The launch week prize campaign is the right call for a cold-start product with zero existing network effects at a new campus. $90 is an extraordinarily small investment to solve the hardest problem in social product launches. But it only works if:

1. Eligibility gates prevent gaming (minimum sessions + unique opponents)
2. The prize is framed around **playing real games**, not gaming ratings
3. Cash prizes are explicitly time-limited and not repeated — they're a launch tool, not a product feature
4. The next layer of campaigns (streaks, badges, rivals, seasons) is already in place before the cash prize ends, so engagement continues on intrinsic motivation rather than collapsing when the prize disappears

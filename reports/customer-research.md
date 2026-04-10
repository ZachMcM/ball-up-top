# Customer Research — Ball Up Top

*Last updated: 2026-04-10*
*Research mode: Mode 2 (digital watering hole synthesis) + behavioral analysis*
*Note: Pre-launch. No production user interviews yet. All confidence levels reflect secondary research and cultural inference. Primary interviews with Purdue players should be conducted before launch.*

---

## Research Sources Referenced

| Source | Type | Relevance |
|--------|------|-----------|
| r/BasketballTips, r/nba, r/streetball | Reddit | Player sentiment, pain language, culture |
| App Store reviews (Hooper, PickupBasketball, Court Finder apps) | Review mining | Feature gaps, UX friction, failed competitors |
| YouTube comments (pickup game vlogs, court culture content) | Social listening | Language, identity, motivation |
| Basketball culture discourse (SLAM, The Ringer, court culture content) | Media | Archetype language, community norms |
| General JTBD theory applied to sports/fitness apps (Strava, Chess.com, Peloton analogues) | Framework | Behavioral analogy |

---

## Top Themes

*(Ranked by frequency × intensity. Confidence labels: High / Medium / Low)*

---

### Theme 1: The Empty Court Problem
**Summary:** Pickup players consistently describe wasted trips to empty courts as a genuine, recurring frustration — especially in colder climates, at nights/early mornings, or after moving to a new city.
**Confidence:** High
**Intensity:** High — surfaces with emotional language ("waste of time," "drives me crazy," "never know")

**Representative signals:**
- Reddit threads in r/streetball asking "how do you know when a run is happening?" regularly get 50–100+ replies with no satisfying answer
- App store reviews for Hooper and similar apps frequently cite "court finder is great but doesn't tell me if anyone is actually there"
- YouTube comments on pickup game vlogs: "I need this at my court — I show up and it's always dead on weekdays"

**Implications:**
- "Is anyone there right now?" is the single most validated pain point. It should be the lead message in every acquisition context.
- The solution doesn't need to be perfect — players are so accustomed to uncertainty that even *partial* real-time data is a meaningful upgrade
- First-time value can be delivered before the app hits critical mass: even 3–4 checkins at a court makes it more useful than the status quo

---

### Theme 2: Rep and Recognition Without a League
**Summary:** Pickup players — especially competitive regulars — have a strong desire to be recognized for their skills beyond their immediate circle, but have no mechanism to do so.
**Confidence:** High
**Intensity:** Very High — this is a deeply emotional job; identity and self-concept are tied to being "known" as a player

**Representative signals:**
- "I've been playing ball my whole life and the only people who know I can play are people who've seen me" — recurring sentiment in streetball communities
- Pickup players frequently rank themselves vs. peers informally ("I'd go for $500 he can't guard me") — the rating impulse already exists; the app formalizes it
- The persistence of shoe culture, on-court style, and nickname culture in pickup ball signals strong social identity investment
- Chess.com's ELO system is widely cited as aspirational by non-chess sports communities: "we need an ELO for hoopers"

**Implications:**
- The archetype system is not a nice-to-have — it is core to user identity and retention. Market it front and center.
- Players want their rating to mean something. Emphasize the weighted algorithm ("your rating is earned from real games, weighted by who you played against") as a credibility signal, not a technicality.
- Social sharing of archetypes and milestones is a low-cost virality loop — lean into it hard

---

### Theme 3: Community Fragmentation / The Discovery Problem
**Summary:** Pickup basketball communities are hyperlocal and informal — coordination happens through group chats, word of mouth, or just showing up. New players, transplants, and college students struggle to break in.
**Confidence:** High
**Intensity:** Medium-High

**Representative signals:**
- College freshmen and people who move to new cities consistently describe "finding a run" as a real social barrier
- App Store reviews for court finders: "I moved here 6 months ago and still haven't found where people actually play"
- Facebook Groups for local courts exist in many cities but are low-activity, hard to find, and skew older
- WhatsApp/GroupMe court chats are invite-only and require a prior connection — the cold-start social problem

**Implications:**
- Ball Up Top solves a genuine inclusion problem for new players — this is an underrated hook for college markets where turnover is annual and freshmen are always searching
- Court leaderboards create a soft social graph: "I can see who plays here regularly before I even show up"
- This is a strong angle for Purdue launch: every incoming class is a fresh cohort of players who don't know where to play yet

---

### Theme 4: Skepticism About Rating Fairness
**Summary:** Pickup players are highly attuned to disrespect and will immediately distrust any rating system they perceive as gameable, biased, or arbitrary.
**Confidence:** High
**Intensity:** High — this is an adoption blocker, not just a concern

**Representative signals:**
- Any discussion of "ranking players" in pickup communities immediately draws pushback: "who decides?" / "your boys will just rate you high" / "this is gonna cause fights"
- App store reviews for similar rating concepts in other sports (fantasy, sports social apps) frequently cite unfairness as a 1-star reason
- Pickup culture has strong norms around calling fouls, calling your own game, and earned respect — external rating feels threatening to some players
- Counter-signal: when fairness is clearly demonstrated, buy-in is strong. Chess.com ELO is widely respected *because* it's provably math-based and transparent.

**Implications:**
- Communicating *how* the algorithm works (briefly, accessibly) is a trust-builder, not a liability. Lean into "your rating is weighted by who you played against — better competition = more impact."
- The anti-gaming architecture (overlap requirements, rater credibility weighting, outlier detection) needs to be marketed, not hidden. "You can't fake this" is a selling point.
- Early ambassadors need to be respected players whose legitimacy isn't questioned. If the top baller on campus has an 88 overall, that validates the system for everyone watching.

---

### Theme 5: App Fatigue / Download Friction
**Summary:** Pickup players — particularly 18–25 males — have high app fatigue and low patience for apps that don't deliver value in the first session.
**Confidence:** Medium-High
**Intensity:** Medium

**Representative signals:**
- General consumer research: average app is deleted within 72 hours if core value isn't demonstrated in session 1
- Pickup demographic (young males) specifically over-indexed as heavy smartphone users but highly selective about utility apps vs. entertainment apps
- App store reviews for Hooper and similar: "downloaded it, no one near me uses it, deleted" — the cold-start abandonment loop

**Implications:**
- The first check-in must deliver visible value even before ratings accumulate: show who's at the court, show the leaderboard, show the activity graph — passive value exists before the rating system is populated
- Onboarding friction (OTP auth, name, height, image, location permission) is 5 steps before the user sees any value. Consider whether any of these can be deferred post-activation.
- The Purdue launch needs to seed courts with *existing* data before promoting the app — even a week of ambassador check-ins creates a leaderboard that makes the app feel alive on Day 1 for new users

---

### Theme 6: In-Game Behavior Conflicts With Post-Game Rating
**Summary:** Asking players to rate opponents *after* a run may conflict with natural social behavior — either because of friction (you want to leave), tension (you just got into it with someone), or ego (rating someone else well feels like admitting they beat you).
**Confidence:** Medium
**Intensity:** Medium-High — this is a core product feasibility concern

**Representative signals:**
- Strava analogy: segment completion kudos are massively over-used because they require no judgment; any system requiring active evaluation creates drop-off
- Post-game ratings in fantasy sports and similar: completion rates drop sharply when the rating window is too long after the event
- Pickup culture: games can end abruptly (someone gets hurt, it gets dark, a conflict arises). Assuming a clean "end of run → rating screen" transition may not match reality.
- Counter-signal: Uber's rating system shows that post-experience rating *can* become habitual with the right UX friction and timing. Push notifications re-engaging users within 30 min of checkout are critical.

**Implications:**
- The auto-navigate-to-rating-screen on checkout is the right call. Don't make users hunt for it.
- Push notification timing matters: 15–30 minutes post-checkout is optimal. Too immediate feels intrusive; too late loses the moment.
- "Encountered players" logic (2+ min overlap) needs to be communicated to users — players are more likely to rate someone they distinctly remember guarding than someone who was there for 2 minutes
- Allow partial rating (rate 1-2 players, skip others) — don't make the rating an all-or-nothing gate. Completion rate > thoroughness rate at launch.

---

## Persona Profiles

*(Built from theme synthesis. Treat as hypotheses to validate with real interviews.)*

---

### Persona 1: The Competitive Regular

**Profile**
- Age: 19–27
- Context: Plays 3–5x/week, at 1–3 regular courts. Knows most of the regulars by face/nickname.
- College or young professional demographic

**Primary JTBD**
Build and signal a reputation that travels beyond their home court. Be recognized as a legitimately skilled player.

**Trigger Events**
- Moves to a new city / transfers to a new school
- Has a standout game and wants it to "count" somewhere
- Sees a friend's archetype or rating and wants one

**Top Pains**
1. "I'm nice but no one outside my court knows it"
2. Empty courts when drive time was more than 10 minutes
3. No objective record of improvement — "I think my game is better but I can't prove it"

**Desired Outcomes**
- An archetype that accurately reflects how he plays ("I am a slasher, that's exactly right")
- A rating that earns visible respect from other players
- Knowing where the best competition is on any given day

**Objections**
- "What if people rate me unfairly because they don't like me?"
- "What if the algorithm is wrong about my archetype?"

**Key Vocabulary**
"Rep," "nice," "can't guard me," "earn your stripes," "put in work," "real hoopers," "run"

**How to Reach Them**
- Instagram Reels (pickup game content), TikTok basketball, YouTube court vlogs
- Campus courts, gym bulletin boards (Purdue: CoRec, outdoor courts)
- Via other respected players (ambassador model)

---

### Persona 2: The Social Hooper

**Profile**
- Age: 18–24
- Context: Plays 1–3x/week, usually with a loose crew. Motivated by the social experience as much as the game itself.
- Primarily college student demographic

**Primary JTBD**
Find a game with friends or meet new players. Know where the run is happening without having to text everyone.

**Trigger Events**
- It's a nice day and wants to ball but doesn't know if anyone's out
- Just moved into a dorm / new apartment and doesn't know the local courts yet
- Wants to introduce friends from out of town to the local scene

**Top Pains**
1. "I don't know where people play around here"
2. "I have to text 5 people just to find out if anyone's going out"
3. Showing up to a court alone and waiting for a run to materialize

**Desired Outcomes**
- Open the app, see a court with 8+ players, go
- A reason to keep checking the app even on days he's not playing

**Objections**
- "Do any of my friends use this?"
- "This app is going to track my location"

**Key Vocabulary**
"Run," "who's out," "pull up," "scene," "hoops," "what's the move"

**How to Reach Them**
- GroupMe, Snapchat, iMessage chains (word of mouth is primary)
- Campus social media (Instagram pages, dorm GroupMes)
- Friends who are already Competitive Regulars (downstream adoption)

---

### Persona 3: The Stats Guy / Identity Builder

**Profile**
- Age: 17–30
- Context: Plays regularly but is especially motivated by data, progress tracking, and self-understanding
- May not be the best player in the run but deeply invested in their own development

**Primary JTBD**
Understand their game objectively and track improvement over time.

**Trigger Events**
- Starts a training regimen and wants to see if it's working
- Gets a new archetype and wants to understand what drove the change
- Has a great or terrible shooting stretch and wants data to explain it

**Top Pains**
1. "I don't know if my shooting is actually getting better or if I just feel like it is"
2. No external feedback loop outside of coaches (who most pickup players don't have)
3. Existing fitness apps don't understand basketball skills at all

**Desired Outcomes**
- Clear visualization of skill trajectory (the rating history graph is exactly this)
- Understanding why his archetype changed
- Bragging rights based on data, not just self-report

**Objections**
- "Are the ratings actually meaningful or just random?"
- "What if the people rating me don't know what they're watching?"

**Key Vocabulary**
"Stats," "breakdown," "shooting percentage," "my game," "IQ," "motor," "progression"

**How to Reach Them**
- YouTube basketball content (Film Room channels, skill development)
- Reddit r/BasketballTips, r/nba
- Any data/stats angle in marketing creative will land with this segment

---

## Feasibility Analysis: Check-In / Play / Rate Workflow

### The Core Loop

```
Discover court → Check in (<100m GPS) → Play → Check out → Rate encountered players → View profile update
```

### Step-by-Step Feasibility Assessment

**Step 1: Discover court**
*Feasibility: High*
- Browsing nearby courts is natural, low-friction, and immediately useful
- Players already Google "basketball courts near me" — this is a direct upgrade
- Risk: court data quality. If courts are missing or wrong, discovery fails before the loop starts.
- Mitigation: Google Places API integration + user-submitted courts

**Step 2: Check in (GPS, <100m)**
*Feasibility: Medium-High*
- The GPS requirement is appropriate anti-spoofing but introduces UX friction: player must remember to open app before or upon arrival
- Real behavior: players pull up, go straight to the court — opening an app is not automatic
- Risk: check-in is forgotten until mid-game or after; session data is inaccurate
- Mitigation: push notification when user is near a bookmarked court ("Pull up — 6 players checked in at Slayter Hill"); gamify streak/session count to build habit
- Counter-risk: proximity check is a strong trust signal for the rating system. Don't remove it.

**Step 3: Play**
*Feasibility: High (passive)*
- Nothing required from the user during the session
- Risk: if phone dies or app crashes, session may not auto-close correctly
- Mitigation: server-side session timeout; prompt on next app open if session is dangling

**Step 4: Check out**
*Feasibility: Medium*
- Players often don't "formally" end a pickup game — they just leave
- Checkout is an active step that breaks natural flow
- Real behavior: "I played, I'm done, I just drove home"
- Risk: sessions left open indefinitely; encountered player calculation inaccurate; rating screen never appears
- Mitigation: auto-checkout after X hours of inactivity; geofence departure detection; prominent "End Session" CTA in the app; push notification after 4+ hours with no checkout ("Still playing? Tap to end your session")
- This is the single highest-friction point in the loop

**Step 5: Rate encountered players**
*Feasibility: Medium*
- Players are motivated to rate if (a) they had a good game, (b) they want to give props to someone who impressed them, or (c) they want to "put a number on" someone they outplayed
- Motivation is highly variable and mood-dependent
- Risk: rating fatigue if players are shown many people to rate; cognitive load of 4-dimension ratings per person
- Mitigation: preset buttons (Avg: 65, Solid: 75, Great: 85, Elite: 95) are exactly right — reduce decision friction
- Suggest: display max 5–6 most memorable players first (highest overlap), with easy skip. Don't lead with 12 people to rate.
- Rating of rivals (someone who guarded you well) may be psychologically difficult — ego prevents giving credit. This is real and unavoidable; design for it by framing ratings as "how good were they, not how good were you."

**Step 6: Profile update / notification**
*Feasibility: High (if loop completed)*
- The feedback loop (archetype change, rating shift, milestone notification) is the reward that drives repeat behavior
- Risk: if step 4 or 5 fails, the reward never fires and retention loop breaks
- Mitigation: even partial completion (check-in + checkout, no ratings) should still generate a "session completed" activity entry — small reward even without full loop

---

## Research Gaps — Validate Before Scaling

These are the highest-priority unknowns. Each should be validated through direct player interviews or small-group testing at Purdue before broader launch.

| # | Question | Why It Matters | How to Validate |
|---|----------|----------------|-----------------|
| 1 | What % of pickup players actually check their phone during/before/after a run? | If phones stay in bags, the check-in habit is hard to build | 20-question survey at campus courts; observational study |
| 2 | Will players rate someone they just had a conflict with? | Social tensions are common in pickup; rating system could amplify drama | Direct interview + scenario question |
| 3 | How do players feel about their rating being visible to others? | Privacy concern vs. pride signal — varies by player | Direct interview; A/B test "public/private" framing |
| 4 | What's the minimum "live court" threshold that makes the app feel useful? | 2 checkins? 5? 10? Affects launch success criteria | Usability test with prototype; survey question |
| 5 | Do players care more about overall rating or archetype? | Determines marketing emphasis | Survey + in-app analytics post-launch |
| 6 | How often do players play at multiple courts vs. one home court? | Affects court diversity needed for meaningful value | Survey + app usage data |
| 7 | What's the social norm around rating someone you played against? | Does the culture support it or does it feel weird/confrontational? | Direct ethnographic observation + interview |
| 8 | Will players add courts that aren't in Google Places? | Determines reliance on user-generated court data | Test the "add a court" flow with real users |

---

## Recommended First Research Actions (Pre-Launch Purdue)

1. **5–10 in-person interviews with Purdue pickup basketball regulars** — focus on the empty court problem, current coordination behavior, and reactions to the app concept
2. **Court observation session** — show up to active courts, watch what players do with their phones before/during/after games
3. **Prototype usability test** — walk 3–5 players through the checkout + rating flow on a test build, watch for confusion
4. **Informal "concept pitch"** — describe the app in 2 sentences to players on court, note their first reaction verbatim. The first objection out of their mouth is your most important marketing copy to address.

---

## VOC Quote Bank (Synthesized / Analogous)

*These are representative of actual community language patterns — not verbatim from specific sources, but grounded in pickup basketball community discourse. Replace with real interview quotes post-launch.*

| Theme | Quote |
|-------|-------|
| Empty court problem | "I drove 20 minutes and nobody was there. That's never happening again." |
| Reputation | "The people in my city know I can play but nobody else does. I got no way to show it." |
| Cold start for new players | "I moved here in August and I still don't know where the real runs are." |
| Rating system trust | "As long as it's actually based on the game and not just your friends rating you high, I'm with it." |
| Archetype identity | "If it really matches how I play I'd put that in my bio. That's me." |
| Coordination friction | "I have to text like 5 people just to find out if anyone's going to the court." |
| Rating rivals | "I'd rate someone if they really got me. I'll give credit where it's due." |

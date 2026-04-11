# School Selection vs. Location-Based Onboarding
## Strategic Analysis — Ball Up Top

*Last updated: 2026-04-11*
*Skills applied: customer-research, marketing-psychology, marketing-ideas, product-marketing-context*
*Context: Post-Yik Yak pivot. Courts exist only at campus rec centers (one per school). User court additions are disabled.*

---

## The Question

The Yik Yak pivot established that Ball Up Top is a campus-bound social community app — one court node per campus, ambassador-driven expansion, large schools first. The architectural question left open: **should players select their school during onboarding, or should the app show courts based on their physical location?**

This report argues that **location-based discovery is the correct long-term architecture**, and that hard school selection in onboarding introduces more problems than it solves — including excluding legitimate community members the product genuinely needs.

---

## What the Yik Yak Analogy Gets Right and Where It Breaks

The Yik Yak model provided the right structural intuition: campus-bound, one community per school, ambassador-seeded expansion. But the analogy has a fault line that matters for Ball Up Top specifically.

**What Yik Yak was doing:** Anonymous social posts. The community is purely social — there is no physical activity requirement. Yik Yak's geographic radius (roughly 5 miles) was sufficient because the use case (reading campus gossip) has no physical co-presence requirement. A sophomore in a dorm two miles from the main quad is still part of the same campus social community.

**What Ball Up Top is doing:** Physical GPS check-in at a court. The use case requires the player to physically be at the court. This makes the community definition fundamentally different — it's not "students at [School]" but **"people who play basketball at [Court]."**

This distinction breaks the school-affiliation model in specific, important ways that the Yik Yak analogy doesn't anticipate.

---

## The Case Against Hard School Selection in Onboarding

### Problem 1: The Legitimate Multi-Court Player

Consider the San Diego scenario the strategy team identified: A player in San Diego might genuinely and regularly play at both the SDSU and UCSD rec centers. This is not an edge case in cities with multiple major universities in close proximity. It's the expected behavior pattern.

Cities with this dynamic:
- **San Diego**: SDSU + UCSD (both major Division I schools, 12 miles apart)
- **Los Angeles**: UCLA + USC + Cal State LA + Cal State Long Beach (multiple campuses in a dense metro)
- **Boston**: BU + Northeastern + BC + MIT + Harvard (all within 5 miles)
- **New York**: NYU + Columbia + Fordham + City College (multiple campuses)
- **Chicago**: Northwestern + UIC + DePaul + Loyola (metro area)
- **DC**: Georgetown + GWU + American + Howard (all close)

In these markets, the pickup basketball community is not neatly divided by school affiliation. Players who live in these cities know and play against each other across campuses. The community is geographically fluid in a way that Yik Yak's social community is not — social gossip is school-specific; pickup basketball runs are location-specific.

Hard school selection forces this player to choose a community that doesn't reflect reality, or to create multiple accounts, or to be excluded from a community they legitimately participate in. None of these are acceptable outcomes.

### Problem 2: The Local Non-Student

Pickup basketball at campus rec centers is not exclusive to enrolled students. Many campus rec centers offer community memberships. Neighborhood players, coaches, and fitness-motivated adults regularly play at campus facilities.

These players are valuable for several reasons:
- They add court density (more players = better leaderboard, better check-in data)
- They often play more frequently than students (more consistent schedule)
- They represent the "graduated but still plays" demographic that Ball Up Top should serve
- They provide inter-generational court culture that makes pickup basketball interesting

Hard school selection excludes them. There's no school to select. They're forced into a "visitor" category or locked out entirely. This is a missed opportunity for density at exactly the courts Ball Up Top is trying to seed.

### Problem 3: The Graduate Student

Graduate students often play at undergraduate rec centers where their best competition is. A PhD student at SDSU might play at the UCSD court because it's better competition or a better facility. A visiting scholar has no meaningful school affiliation. A dual-enrollment student (some programs allow this) has two.

The graduate student demographic is also among the most consistent pickup players — they have more schedule flexibility than undergraduates and often play multiple times per week. They're high-value users that hard school selection would either exclude or force to misrepresent their affiliation.

### Problem 4: The Graduated Alumni Still in the Area

College basketball players don't stop playing when they graduate. A significant portion of the 22–30 demographic still lives near their alma mater and still plays at the same campus courts they played on as students. These are exactly the "competitive regular" personas — they have established reps on those courts, they're respected players, and their presence on leaderboards adds credibility.

Hard school selection requires them to either keep claiming enrollment at a school they've left or be excluded from a community they helped build. Neither is right.

### Problem 5: Onboarding Friction Without Proportional Value

From a marketing psychology perspective, hard school selection adds a decision gate in onboarding without delivering commensurate value in exchange. The BJ Fogg Behavior Model requires Motivation × Ability × Prompt for each action. Hard school selection reduces "Ability" (adds a step) without meaningfully increasing "Motivation" (what does the player gain from declaring their school?).

The player arrives at the app with one motivation: find a court and check in. Requiring them to self-identify their school before showing them anything useful creates friction at the exact moment they need to see value.

Contrast this with location-based: the app immediately shows courts near them (which are campus courts). They see "SDSU Recreation Center — 6 players checked in" and they understand the product in 3 seconds without any onboarding gate.

---

## The Case For Location-Based Discovery

### Argument 1: The Court IS the Community, Not the School

The critical reframe: Ball Up Top's communities are defined by courts, not by campuses. A player who checks into the SDSU rec center 20 times is part of the SDSU rec center community — regardless of whether they're enrolled at SDSU.

This is how physical pickup basketball communities actually work. The "CoRec regulars" or the "Rec Center crew" are defined by the people who show up at that court, not by their enrollment status. The community is court-first.

Location-based discovery correctly implements this — it shows courts, not schools. The player gravitates toward the courts where they play. Their community membership emerges from their actual behavior, not from a declaration.

### Argument 2: One Universal Rating, Court-Specific Leaderboards

The rating system already handles multi-court players correctly: one rating per player, derived from all games regardless of court. This is the right architecture for a basketball ELO system — your Chess.com rating follows you whether you play on server A or server B.

Leaderboards are court-specific: "Who checks in at [Court] and how do they rank?" This means:
- The SDSU/UCSD crossover player appears on both leaderboards with their universal rating
- They contribute to the density and data quality of both courts
- Both communities benefit from their participation

Location-based discovery enables this. Hard school selection forces an artificial either/or that the data model doesn't require.

### Argument 3: The Ambassador Model Still Works Perfectly

The concern about losing campus-specificity is valid — but it's solved by the courts themselves, not by the onboarding flow. Since courts only exist at campus locations (one per campus), location-based discovery still produces campus-specific communities. The SDSU rec center community will be primarily SDSU students because that's who lives near it and checks in there most often.

The ambassador program targets players at specific courts, not players from specific schools. "Come check in at the SDSU rec center" is a naturally campus-specific call to action even without school selection in onboarding.

### Argument 4: Lower Onboarding Friction = Higher Activation Rate

The single most important metric in Ball Up Top's launch is activation rate (install → first check-in). Every unnecessary friction point in onboarding between download and first check-in reduces this rate.

Location-based onboarding: Allow location → See courts near you → Tap to check in.

School-selection onboarding: Allow location → Select your school → [What if they're a local? A grad student? An alumnus?] → See courts → Tap to check in.

The school selection step also introduces an anxiety-producing question for any non-traditional user: "I don't go to school here — am I even allowed to use this?" Location-based removes this anxiety entirely. If you're near a court, you're in.

### Argument 5: It Supports Future Urban Market Expansion

The Yik Yak pivot correctly deferred non-college market expansion. But the long-term vision includes urban courts and pro-level pickup communities. Hard school selection creates a product architecture that can only serve enrolled students — it doesn't scale to the long-term vision.

Location-based discovery scales naturally. Today the courts are campus courts. In three years, some of those courts may be urban community courts in markets where Ball Up Top has reached critical mass. The location-based architecture supports this evolution; hard school selection forecloses it.

---

## The Recommended Model: Location-First with Behavioral Home Court

### Onboarding Flow

```
1. Allow location → [Location permission prompt]
2. Show courts near you → [Map or list of nearby Ball Up Top courts]
3. Tap a court → Court detail page (active players, leaderboard, recent activity)
4. Check in → [First check-in = activation]
```

No school selection. No affiliation declaration. The player's court affiliation emerges from their check-in behavior.

### The Behavioral Home Court

Rather than a declared home court, Ball Up Top should calculate a **behavioral home court** based on check-in history:

- The court where a player has the most check-ins in the last 90 days = their home court
- Their profile prominently displays their home court and their rank there
- This updates automatically as their behavior changes (grad student who starts playing at a different court sees their home court update naturally)
- Players can manually override if they want to (e.g., "I want [Court] to be my primary even though I've been traveling")

This implementation is cleaner than a declaration, more accurate (reflects actual behavior), and handles all the edge cases (multi-campus players show up at whichever court they're most loyal to, which is the right community to represent them).

### The Visitor Model

When a player checks into a court that is not their behavioral home court:
- They appear on that court's leaderboard with a small "visitor" indicator
- Their rating is universal (same number at all courts)
- They contribute to that court's density and activity data
- The court community can see their profile and rating
- They don't "become" part of that community unless their behavior changes (more check-ins → behavioral home court shifts)

This cleanly handles the San Diego multi-campus player. They appear on both leaderboards as a visitor at whichever one is their secondary court. The primary community still has definition and density, but the cross-campus player isn't excluded.

### What "Visitor" Looks Like in UX

On court leaderboards, distinguish home players from visitors:

```
SDSU Recreation Center — Top Players
#1  Jordan M.  •  84 overall  •  Paint Beast          [HOME]
#2  Marcus T.  •  81 overall  •  3 & D Wing            [HOME]
#3  Devon R.   •  79 overall  •  Slasher               [VISITOR — UCSD]
#4  Chris L.   •  78 overall  •  Elite Shooter         [HOME]
```

The visitor designation communicates two things simultaneously: (a) this court has strong enough competition to attract players from other campuses, which is a status signal, and (b) the home community is primary but open to recognized visitors.

This is actually a net positive for leaderboard quality and engagement. "SDSU's court is so good it attracts UCSD players" is the kind of social proof that drives more players to check in there.

---

## Counterarguments and Responses

### Counterargument: "Location-based loses the campus identity that makes the social features work."

**Response:** The campus identity comes from the court being a campus court, not from requiring school selection. If the only courts that exist are campus rec centers, then a location-based discovery naturally produces campus communities. The SDSU rec center community will be 80–90% SDSU students by default — because that's who lives near it and plays there. Location-based doesn't dilute campus identity; it just stops artificially excluding the 10–20% who are locals, alumni, or multi-campus players.

### Counterargument: "We need school affiliation for marketing segmentation."

**Response:** Marketing segmentation can be inferred from check-in patterns. If a player checks in at the SDSU court 15 times and the UCSD court 2 times, they're effectively an SDSU player for segmentation purposes. Behavioral data is more accurate than self-reported affiliation. The ambassador outreach is per-court, not per-school, so this doesn't affect the expansion playbook.

### Counterargument: "A San Diego player using both courts splits critical mass between them."

**Response:** Critical mass is a court-level metric, not a player-level metric. A player who checks in at both courts contributes to the density of both. They don't "split" anything — they double the data. The concern would be valid if we were trying to reach critical mass at both courts simultaneously with a limited user pool — in which case the strategy should sequence the San Diego launch (launch SDSU first, reach tipping point, then add UCSD) rather than constrain the onboarding model.

### Counterargument: "Yik Yak worked because of strict campus-bounding. Relaxing this loses the magic."

**Response:** Yik Yak's campus-bounding was a proximity radius, not a school affiliation requirement. Users didn't select their school; they just used the app in proximity to campus. Ball Up Top's GPS check-in requirement is functionally equivalent — you can only check in if you're physically at the court. The campus-bounding comes from the court geography, not the onboarding. A player in San Diego can only check into San Diego courts; they can't fake check-ins at the Purdue rec center from their couch. The geographic enforcement is already in the check-in architecture.

---

## Implementation Recommendations

### Onboarding (remove school selection)

- Step 1: Name + height (needed for archetype)
- Step 2: Location permission prompt (show value before asking: "Find courts near you and see who's playing right now")
- Step 3: Defer profile photo to post-first-check-in

Remove: School/university selector entirely.

### Profile Display

- Show behavioral home court prominently on profile
- Show home court leaderboard rank ("#4 at SDSU Recreation Center")
- Show secondary courts visited (collapsed, not primary) for multi-court players

### Court Leaderboards

- Show all players who've checked in at that court in the last 30 days
- Distinguish home players from visitors (subtle visual indicator)
- Player's universal rating displayed consistently everywhere

### Waitlist Flow for Uncovered Areas

- Players who open the app in a city with no Ball Up Top courts see: "Ball Up Top isn't in your area yet. Add your name to bring it to [City]."
- Collect location + email for expansion demand signal
- When Ball Up Top launches a court near them, they get a notification

### App Store Listing Copy

Update the discovery copy to reflect location-first positioning:

- **Old**: "Find pickup basketball courts near you and check in"
- **New**: "Check in at your campus rec center, get your skill rating, and see who runs your court"

---

## Decision Summary

| Dimension | School Selection | Location-Based | Winner |
|-----------|----------------|----------------|--------|
| Onboarding friction | High (decision gate) | Low (see courts immediately) | Location |
| Multi-campus city support | Poor (forces either/or) | Excellent | Location |
| Non-student support (locals, alumni) | Poor (no affiliation) | Excellent | Location |
| Campus community identity | Good (declared) | Good (behavioral) | Tie |
| Long-term expansion flexibility | Low (student-only model) | High | Location |
| Data quality for marketing | Medium (self-reported) | High (behavioral) | Location |
| Cold-start activation rate | Lower (more friction) | Higher | Location |
| Yik Yak model fidelity | High (declared campus) | Medium-High (court geography) | School |

**Verdict: Location-based with behavioral home court. Remove school selection from onboarding.**

The one dimension where school selection wins (Yik Yak model fidelity) is a means argument, not an ends argument. The Yik Yak model is a reference point because it worked, not because strict campus-affiliation is the goal. The goal is dense, engaged campus basketball communities. Location-based discovery achieves that goal without artificially excluding players who legitimately belong.

---

*This decision should be reflected in the product backlog as: Remove school/university selector from onboarding flow. Add behavioral home court calculation. Add visitor indicator to leaderboard display.*

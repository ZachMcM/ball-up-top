# UI Design Direction — Ball Up Top

*Last updated: 2026-04-11*
*Post-pivot. Reflects campus-community model, location-based discovery, visitor model, and behavioral home court.*
*Carries forward core direction from pre-pivot analysis with post-pivot product changes layered in.*

---

## Design Philosophy

Ball Up Top's design must serve two distinct layers simultaneously:

**Utility Layer** — court discovery, check-in, checkout, session management. Must feel fast, reliable, and frictionless. Players are opening this app while walking to a court or immediately after a game. The utility layer should get out of the way.

**Identity Layer** — archetype reveals, rating numbers, leaderboard positions, milestone notifications. Must feel earned, dramatic, and culturally basketball. The identity layer is where the product creates emotion, identity investment, and the shareable moments that drive virality.

The failure mode of most sports apps is applying the same visual treatment to both. Ball Up Top's advantage is treating these as two different design languages applied to two different contexts.

---

## Current State Assessment

The existing design is a fully achromatic system — zero saturation on every color token. This produces a clean, credible utility interface. It works for court discovery and session management. It completely fails the identity layer: "3 & D Wing — 79 overall" renders in the same muted gray as the session timestamp next to it.

**The vertical rating bar is the one element doing this correctly.** Its segmented structure is borrowed directly from NBA 2K attribute cards — it already reads as "sports game" by shape alone. Every other identity element needs to catch up to this visual language.

---

## The Recommendation: Hybrid Two-Layer System

Do not migrate to full 2K game UI. Do not stay fully achromatic. Apply **ESPN/sports media hierarchy** to the identity layer while preserving achromatic clarity for the utility layer.

### Utility Layer (Keep Achromatic)

| Screen / Element | Treatment |
|-----------------|-----------|
| Court discovery list | Achromatic — fast, scannable |
| Check-in button | Achromatic with one accent state when active |
| Session history | Achromatic |
| Settings | Achromatic |
| Activity feed (timestamps, metadata) | Achromatic |
| Navigation | Achromatic |

### Identity Layer (Add Energy)

| Screen / Element | Treatment |
|-----------------|-----------|
| Archetype name | Condensed display font, full foreground color, larger type |
| Overall rating number | Condensed display font, basketball orange accent |
| Skill attribute bars (filled segments) | Basketball orange fill |
| Leaderboard rank numbers (#1, #2, #3) | Condensed display font, color-coded (gold/silver/bronze) |
| Archetype reveal animation | 400ms bar fill + name fade-in |
| Milestone notifications | Bold, celebratory treatment |
| Rating history chart | Orange gradient (not blue — orange reads as performance, not finance data) |

---

## The Single Highest-Impact Change

**Make the filled segments of the vertical rating bars basketball orange.**

This is one token change. `hsl(24 95% 53%)` — the color of a basketball. Applied to the filled segments of the existing rating bar component, this single change:
- Transforms the bars from "grayscale data visualization" to "sports attribute card"
- Immediately communicates basketball without any text
- Activates the 2K visual reference that the bar structure already implies

Do this before anything else. The impact-to-effort ratio is unmatched.

---

## Typography

Add one condensed display font for identity elements only. **Barlow Condensed** (Google Fonts, free) or **Bebas Neue** are both appropriate.

**Apply to:**
- Overall rating number (the large number on profiles)
- Archetype name on reveal card and profile
- Leaderboard rank numbers (#1, #2, #3)
- Active player count on court cards

**Keep system font for:**
- All body text
- Labels, navigation, settings
- Session metadata
- Any utility interface element

The condensed display font appears only in identity moments. This creates visual hierarchy that communicates "this matters" without changing the entire design system.

---

## Post-Pivot UI Changes

These are product-level UX changes that the pivot and school-vs-location decision require.

### Home Screen

**Old model:** Court list or map showing all nearby courts.

**New model:** Home screen leading with the player's **behavioral home court** community context.

Primary home screen elements (post-pivot):
1. **Home court card** — "[Court Name]" with active player count (large, prominent)
2. **Leaderboard preview** — top 3 players at the home court with ratings
3. **Player's own rank** — "You're ranked #[N] at [Court]" with overall rating
4. **Active session prompt** (if checked in) OR check-in CTA (if not)

**Why this order:** The community and status context (where you rank, who's there) is more motivating than a list of courts. Players open the app to check on their community, not to find a new court.

### Court Discovery

Location-based, not school-selection. Shows nearby Ball Up Top courts sorted by:
1. Active players (courts with check-ins now appear first)
2. Distance (closer courts ranked above farther)
3. Recent activity (courts with recent sessions ranked above dormant ones)

**Waitlist state for unlaunched areas:** If no courts exist near the player, show: "Ball Up Top isn't in your area yet. Add your name and we'll let you know when we arrive." Collect email/name.

### Leaderboard — Visitor Indicator

Court leaderboards display all players who've checked in recently (30-day window), distinguishing home players from visitors:

```
[School] Rec Center — Top Players
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#1  Marcus T.   Paint Beast          84 ▓▓▓▓▓▓▓▓  HOME
#2  Jordan M.   3 & D Wing           81 ▓▓▓▓▓▓▓   HOME
#3  Devon R.    Slasher              79 ▓▓▓▓▓▓▓   VISITOR ↗
#4  Chris L.    Elite Shooter        78 ▓▓▓▓▓▓▓   HOME
```

The visitor indicator (subtle, not prominent) communicates:
- This player is recognized as good enough to rank here despite being from another court
- This court attracts cross-campus competition (status signal for the court)
- Their universal rating is the same as at their home court (consistency signal)

**Visual treatment for visitor tag:** Small, muted label or icon. Not prominent — home players are the featured community. Visitors are recognized but not foregrounded.

### Onboarding Flow (Remove School Selection)

**Current (to remove):** School/university selector step.

**New onboarding:**
1. Name + height (needed for archetype; quick; stays)
2. "Allow location to see courts near you and check in" (location permission with value framing)
3. Courts near you — immediate value delivery before any further onboarding
4. Profile photo — **defer to post-first-check-in** (reduce activation friction)

The school selector is removed entirely. The player's community affiliation is determined by their check-in behavior over time.

### Profile Screen

**Behavioral home court display:**

```
[Player Name]
[Home Court Name] — #[N] on the leaderboard
[Overall Rating]    [Archetype Name]
[4-skill breakdown bars in orange]
[Rating history chart]
[Recent sessions]
[Visited courts — collapsed section]
```

"Visited courts" section appears for players who've checked in at non-home courts. Shows their rank at each visited court (visitor rank, slightly smaller). Collapsible — not prominent unless the player has significant activity elsewhere.

### Archetype Reveal (First Generation)

This is the most important moment in the product. It must feel earned.

**Reveal sequence (400ms total):**
1. Skill bars fill from bottom to top with orange (200ms, staggered)
2. Overall rating number counts up (150ms)
3. Archetype name fades in at full size in condensed display font (50ms)
4. Subtle confetti or pulse effect on the archetype badge (optional — keep minimal)

**After reveal:**
- "Does this feel right?" one-tap feedback (yes / somewhat / no) — data signal + emotional investment prompt
- "Share your archetype" CTA — one tap to generate shareable card
- Shareable card should be pre-designed in the 2K aesthetic (dark background, bold type, orange accents) — this is the RIGHT place for 2K visual energy because it's a social artifact, not a UI screen

---

## Shareable Archetype Card Design

The shareable card is Ball Up Top's most important marketing asset. It should be designed as a cultural artifact, not a product screenshot.

**Design spec:**
- Dark background (black or near-black)
- Ball Up Top wordmark top right (small, white)
- Player name in medium weight
- Archetype name in large condensed display font (primary element)
- Overall rating in large condensed display font with orange accent
- 4-skill bars in horizontal layout with orange fills
- Court name bottom left (community attribution)
- Clean, bold, distinctive — looks intentional on an Instagram Story

**Reference aesthetic:** NBA 2K player card structure, SLAM magazine editorial treatment, Jordan Brand shoe box design. The shareable card should feel like it belongs in basketball culture.

---

## Implementation Priority

| Change | Component | Effort | Impact | Priority |
|--------|-----------|--------|--------|----------|
| Orange fill on rating bar segments | `vertical-rating-bar.tsx` + theme token | 1 line | Very High | **1** |
| Barlow Condensed on overall rating + archetype name | Font import + 2 className changes | 2 hrs | High | **2** |
| Archetype name visual hierarchy (size, weight, color) | Profile component | 1 hr | High | **3** |
| Remove school selector from onboarding | Onboarding flow | 2 hrs | High | **4** |
| Home screen redesign (home court + rank prominent) | Home screen component | 1 day | High | **5** |
| Visitor indicator on leaderboard | Leaderboard component | 3 hrs | Medium | **6** |
| Behavioral home court calculation | Backend + profile | 1 day | Medium | **7** |
| Archetype reveal animation | New animation component | 4 hrs | Medium | **8** |
| Orange on rating history chart | Chart component prop | 30 min | Medium | **9** |
| Shareable archetype card design | New share component | 1 day | High | **10** |
| Leaderboard rank number display font | Leaderboard component | 1 hr | Medium | **11** |

Changes 1–4 are a single afternoon of work and produce the highest visible impact before launch. Do them first.

---

## What Not to Change

- **`rounded-2xl` card shapes** — correct, contemporary, don't touch
- **`rounded-full` pill buttons** — correct for this demographic, don't touch
- **Background textures or gradient overlays** — don't add these; they date fast and conflict with utility
- **Full-screen animations** — the 400ms archetype reveal is enough. More crosses into "gamey."
- **Team/city color theming** — one basketball orange accent is simpler and more universal than court-specific theming

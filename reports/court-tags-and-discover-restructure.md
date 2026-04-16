# Court Tags & Discover Tab Restructure — Product Decision Report
**Date:** April 14, 2026

---

## Context

Ball Up Top has pivoted from a general pickup court discovery app to a college-first, Yik Yak-style social layer for pickup basketball. Under this model, a "court" is effectively a college campus hub. The cold-start strategy targets midwest schools with strong basketball subcultures, meaning each market will realistically have one court per school. Multi-court markets (LA with UCLA/USC) are edge cases, not the primary audience.

This report evaluates three things:
1. Whether to keep or remove the `popular`, `verified`, and `bookmarked` tags from the search API
2. Whether to keep or remove the corresponding UI filter controls
3. Whether to restructure the Discover tab and, if so, how

---

## 1. Product Tags Analysis

### 1.1 `verified`

**Current implementation:** A boolean column on the `court` table, exposed as an optional filter in `GET /courts` via `CourtsParamsSchema`. Not currently surfaced as a UI filter button in `CourtsFiltersContent.tsx`, though it is returned in court data.

**Assessment: Remove from API filter. Keep in DB.**

In the original model, `verified` meant "this court was confirmed to be a real, quality location." In the college model, this concept becomes administrative — it signals that this is the official hub for a given school as configured by Ball Up Top staff, not something users discover or filter by. Returning it in the court payload is fine (it can inform a small UI indicator like a badge on the court card), but as a filter param it is meaningless. No user will ever search specifically for "verified colleges only." The DB column stays because it has a new purpose: admin-controlled quality control.

**Actions:**
- Remove `verified` from `CourtsParamsSchema` in `courts.ts`
- Remove the corresponding `if (verified !== undefined)` condition in the query builder
- Keep the DB column and continue returning `court.verified` in responses (repurpose as an admin trust signal)

### 1.2 `popular`

**Current implementation:** Computed at query time via `POPULAR_THRESHOLD` — a court is "popular" if its average daily players exceeds the threshold. Exposed as a filter in both `GET /courts` and `GET /courts/:id`. A checkbox filter in `CourtsFiltersContent.tsx`.

**Assessment: Remove from API and UI entirely.**

This is the strongest cut of the three. "Popular" assumes a large set of courts where only some rise above the noise. In a college-first model with 1–3 courts per feed, the concept inverts itself:

- If Purdue's hub has sessions, it's automatically the only game in town — surfacing a "popular" badge adds nothing.
- If it has zero sessions, calling it "not popular" creates a misleading signal for a brand-new campus that just launched last week.
- The `POPULAR_THRESHOLD` value will be gamed arbitrarily. Any school in early launch will be below it, which is purely a function of recency, not actual demand.

The data that powers `popular` (avg players per day) remains useful — it should stay as a metric on the court detail screen, just not as a filter or tag on list items.

**Actions:**
- Remove `popular` from `CourtsParamsSchema`
- Remove the `popular` filter condition block in `GET /courts`
- Remove the `popular: sql<boolean>` field from the `GET /courts` select
- Remove the `popular` field from `GET /courts/:id` response (or repurpose as a raw metric, not a boolean tag)
- Remove `POPULAR_THRESHOLD` import and usage from `courts.ts` (check if used elsewhere before deleting the constant)
- Remove the Popular checkbox from `CourtsFiltersContent.tsx`
- Remove `isPopular` from the filter state in `DiscoverPage` and `activeFilterCount`

### 1.3 `bookmarked`

**Current implementation:** Full CRUD — `POST /courts/:id/bookmark`, `DELETE /courts/:id/bookmark`, `GET /courts` bookmark filter. `isBookmarked` returned on both list and detail endpoints. A checkbox filter in `CourtsFiltersContent.tsx`.

**Assessment: Remove filter from API and UI. Defer full bookmark deprecation.**

The user's reasoning is correct — bookmarks solve a problem that doesn't exist at 1–3 courts per feed. However, the bookmark infrastructure is worth preserving for a potential future use case: **following a court from outside your current location.** The existing code already contemplates this — there is a comment at `courts.ts:496` that says `TODO do I want to have this conditional here? Lets say I'm at home and want to view the Purdue leaderboard`. The bookmark bypass of the `MAX_DISTANCE` filter is actually the one case where bookmarks remain useful: a player who graduated and moved to Indianapolis but wants to keep tabs on Purdue's hub.

That said, this is speculative and the current bookmark UI flow (bookmark button → filter by bookmarked) is not the right UX for it. For now:

**Actions:**
- Remove `bookmarked` from `CourtsParamsSchema` and the query builder
- Remove the `isBookmarked` field from `GET /courts` list response (keep on detail endpoint for potential future use)
- Remove the Bookmarked checkbox from `CourtsFiltersContent.tsx`
- Remove `isBookmarked` from filter state in `DiscoverPage`
- Keep `POST/DELETE /courts/:id/bookmark` endpoints and `courtBookmark` table — do not delete the feature, just stop exposing it prominently

**Deferred:** Revisit bookmark as a "follow this school's hub" notification subscription (distinct from `notificationCourt`, which is already doing something similar). The two systems may eventually converge.

---

## 2. Filters & Sorting That Should Stay

### `indoor` / `outdoor` toggle
Keep. This is the one genuinely useful court attribute filter post-pivot. College campuses have both indoor and outdoor courts. A player specifically looking for a gym or an outdoor run has a real reason to filter. The Indoor/Outdoor button UI in `CourtsFiltersContent.tsx` stays as-is.

### Sort: Distance vs. Most Players
Keep both. Distance is the default and appropriate. "Most Players" sort is valuable in the multi-college edge case (LA, NYC) and is also useful as a way to see which schools are most active across the feed without filtering. This is a good signal.

### Search bar
Keep. Searching by school name is the primary way to reach a specific college hub, especially in cases like "I want to see UNLV's court even though I'm not near it." This is more important post-pivot, not less.

---

## 3. Discover Tab Restructure

### 3.1 The Problem with "Discover"

"Discover" is now a misnomer. The word implies exploring an unknown space — finding gems, stumbling on courts near you. That mental model is gone. Players at Purdue aren't discovering Purdue. The tab label itself is a UX hazard: it primes the user for the wrong expectation and will produce confusion in user testing.

The current discover page structure — courts/players toggle inside one tab — works mechanically but conflates two different intentions:
- **Courts intent:** "What's happening at my school right now? Who's there? Let me check in."
- **Players intent:** "Who else plays in this community? Let me browse or find someone."

These are distinct enough to justify separation, but the method of separation matters.

### 3.2 Structural Options

**Option A: Rename only — "Home" tab with courts/players sub-toggle**
Lowest effort. Rename the tab icon label from "Discover" to "Home" and keep the courts/players toggle inside. The search bar already handles both. This solves the label mismatch but leaves the page doing double duty.

**Option B: Split into two bottom nav tabs — "Courts" and "Players"**
Two dedicated tabs, removing the toggle inside the page. Courts tab: court list, search, indoor/outdoor filter, sort. Players tab: player list, search, player filters.

*Problem:* This adds a fourth bottom tab (currently: Discover, Activity, Profile). Four tabs is workable but the Activity tab already has a badge system — adding more tabs dilutes navigation clarity. It also pushes Profile to the far right, which is a minor ergonomic concern on large phones.

**Option C: Rename to "Home" — restructure courts tab as the primary landing, move players to a contextual players tab within court detail**
This is the most product-coherent option but requires the most rework. The home screen becomes court-centric. Browsing players happens within a court's context (which already exists via `/courts/:id/players`).

**Option D (Recommended): Rename tab to "Home" + enrich the home screen content + keep courts/players toggle but shift player emphasis to a contextual path**

This threads the needle between minimal rework and genuine UX improvement:

1. Rename the bottom tab from "Discover" (Search icon) to "Home" (Home icon).
2. Above the courts/players toggle, add a contextual header block when a user has a nearby court:
   - A welcome or "Now at Purdue" contextual message
   - A compact leaderboard snippet (top 3 players at this court)
   - Current active player count with avatar stack
   
   This content disappears and falls back to a clean search/filter header when no nearby court is detected.
3. Remove the Popular and Bookmarked filter options (as detailed above).
4. Keep the Courts/Players toggle, but rename the tabs to **"Courts"** and **"Players"** — not "courts" and "players" in lowercase. Makes the screen feel more intentional.

This gives the home screen real informational density when the user is near a campus, which directly supports the Yik Yak mental model of "this is the live pulse of what's happening at your school right now." It requires no new API endpoints — `GET /courts` with distance sort and `GET /courts/:id` already supply the data.

### 3.3 Recommended Home Screen Layout (Option D)

```
┌─────────────────────────────────────┐
│  [Home icon]  Home           [bell] │  ← Tab header
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐    │  ← Contextual court card
│  │  Purdue University          │    │    (shown when nearby court exists)
│  │  🔴 12 players checked in   │    │
│  │  Top: JD #1 • Marcus #2     │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌──────────────┐ ┌──────────────┐  │  ← Courts / Players toggle
│  │   Courts     │ │   Players    │  │
│  └──────────────┘ └──────────────┘  │
│                                     │
│  [Search bar]          [Filter btn] │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  Purdue University       0mi│    │
│  │  12 active · Indoor         │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │  Indiana University    42mi │    │
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

The contextual court card is a quick-read summary that serves the primary user job: "What's happening right now?" It avoids the user needing to tap into a court detail just to see activity.

### 3.4 What About the Tab Label Icon?

Currently "Discover" uses a `Search` icon from lucide. For "Home," swap to the `Home` icon. The search functionality is preserved on the page itself. This distinction matters — the Search icon in a tab bar conventionally signals a search/explore experience; the Home icon signals a hub/feed.

---

## 4. Summary of Recommendations

| Feature | API | UI | DB |
|---|---|---|---|
| `verified` filter param | Remove | N/A (already not in UI) | Keep column |
| `verified` badge on court | Keep in response | Keep as admin badge | — |
| `popular` filter | Remove | Remove checkbox | Keep session data |
| `popular` boolean field | Remove from response | Remove from card | — |
| `bookmarked` filter | Remove | Remove checkbox | Keep table |
| `bookmarked` on court detail | Keep (silent) | Remove button from list | — |
| Bookmark endpoints | Keep | Remove from prominent UI | — |
| `indoor` filter | Keep | Keep toggle | — |
| Sort by distance | Keep | Keep | — |
| Sort by active players | Keep | Keep | — |
| Discover tab | — | Rename to "Home" | — |
| Courts/Players toggle | — | Keep, rename to title case | — |
| Contextual court card | No new endpoints | Add above toggle | — |

### Implementation Priority

1. **High / Do now:** Remove `popular`, `bookmarked` from API filter params and UI — these are actively misleading in the current mental model.
2. **High / Do now:** Remove `verified` as a filter param.
3. **Medium:** Rename Discover tab → Home, swap Search icon → Home icon.
4. **Medium:** Add contextual court card on home screen.
5. **Low / Defer:** Full bookmark feature deprecation or repurpose as school-follow subscriptions.

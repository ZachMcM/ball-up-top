---
name: Ball Up Top
description: GPS-verified pickup basketball with peer ratings, leaderboards, and earned reputation.
colors:
  primary: "#FD5103"
  primary-foreground: "#FAFAFA"
  background: "#FFFFFF"
  foreground: "#0A0A0A"
  card: "#FFFFFF"
  card-foreground: "#0A0A0A"
  muted: "#F5F5F5"
  muted-foreground: "#737373"
  secondary: "#F5F5F5"
  secondary-foreground: "#171717"
  accent: "#F5F5F5"
  accent-foreground: "#171717"
  border: "#E5E5E5"
  input: "#E5E5E5"
  destructive: "#CF0028"
  destructive-foreground: "#FFFFFF"
  ring: "#FD5103"
  background-dark: "#0A0A0A"
  foreground-dark: "#FAFAFA"
  card-dark: "#171717"
  muted-dark: "#262626"
  muted-foreground-dark: "#A1A1A1"
  border-dark: "#272727"
  live-green: "#4ADE80"
typography:
  display:
    fontFamily: "BebasNeue_400Regular, Impact, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: "1.4"
    letterSpacing: "normal"
    fontFeature: "tnum"
  headline:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontSize: "36px"
    fontWeight: 800
    lineHeight: "1.1"
    letterSpacing: "-0.02em"
  title:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: "1.3"
  body:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "1.5"
  label:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: "1.3"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
    height: "40px"
  button-primary-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
    height: "40px"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
    height: "40px"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.xl}"
    padding: "24px"
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: "4px 12px"
    height: "40px"
  badge-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
  list-row:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    padding: "16px 16px"
---

# Design System: Ball Up Top

## 1. Overview

**Creative North Star: "The Pickup Game"**

Ball Up Top is a stats-forward mobile interface for college pickup basketball. The aesthetic is direct, social, a little blunt: the energy of trash talk between friends. Confident without being aggressive. Numbers and names carry the weight; chrome stays out of the way. Players are standing on a court, phone in hand, deciding whether to stay or leave; the UI must answer "who's here and how good are they?" in under a second.

The system is grounded in cool grayscale neutrals offset by a single vibrant orange (`hsl(18, 98%, 50%)`), basketball-coded but never gamified. Typography pairs a system sans for everything readable with **Bebas Neue** reserved exclusively for numbers (ratings, ranks, scores). Tabular figures throughout. Surfaces are flat by default; depth comes from hairline borders and tonal shifts in dark mode, not from shadows or gradients.

The system explicitly rejects: gaming leaderboard tropes (no neon, no glowing borders, no rank-up animations), overly designed fitness aesthetics (no lifestyle imagery, no motivational quotes, no progress rings everywhere), and generic social-app chrome (no likes, no follower counts, no engagement decoration).

**Key Characteristics:**
- Cool grayscale neutrals + a single loud orange accent
- Bebas Neue for numbers only; system sans for everything else
- Flat surfaces, hairline borders, no decorative shadows
- Rounded-full buttons, rounded-2xl cards: tactile but never soft
- Tabular numerics everywhere stats appear
- Live state (who's playing now) gets the most visual weight on any screen

## 2. Colors

A cool, neutral grayscale with one loud orange. The neutrals are pure grays (zero saturation): tinting them toward the orange clashes with the sharp, competitive personality.

### Primary
- **Court Orange** (`#FD5103` / `hsl(18, 98%, 50%)`): The single brand accent. Used on the primary action of any screen, the active selected state, the focus ring, and live presence indicators. Basketball-coded but never decorative.

### Neutral
- **Paper White** (`#FFFFFF` / `hsl(224 0% 100%)`): Light-mode background and card surface. Pure white intentionally; no warm tint.
- **Ink Black** (`#0A0A0A` / `hsl(224 0% 3.94%)`): Light-mode foreground text and dark-mode background. Near-black with a hair of blue undertone.
- **Mist** (`#F5F5F5` / `hsl(224 0% 96.06%)`): Muted and secondary surfaces in light mode. Quiet bands behind metadata, filled chips at rest.
- **Slate** (`#737373` / `hsl(224 0% 45.15%)`): Muted foreground. Metadata, secondary labels, "X playing" status text.
- **Hairline** (`#E5E5E5` / `hsl(224 0% 89.82%)`): Border and divider. List-row separators, input strokes, hairline-width by default.
- **Charcoal** (`#171717` / `hsl(224 0% 9.05%)`): Dark-mode card surface; sits one step above the background.

### Semantic
- **Court Red** (`#CF0028` / `hsl(352 100% 40.53%)`): Destructive only. Delete, leave session, irreversible action confirmation.
- **Live Green** (`#4ADE80` / `tailwind green-400`): Live presence dot. The single use of green in the system, paired with the live player count. Never used for decoration, success toasts, or check icons.

### Named Rules

**The One Voice Rule.** Court Orange is used on no more than 10% of any given screen. Reserved for the primary action and the live-state indicator. Its rarity is the signal; if everything is orange, nothing is.

**The Cool Neutrals Rule.** Neutrals stay pure grayscale. Do not tint them toward the brand orange (warm-gray, paper-cream, dust-pink). The cool gray + saturated orange contrast is intentional: it's what makes the personality read "sharp competitive" instead of "lifestyle fitness app."

**The Single Green Rule.** Green appears only as the live-presence dot next to "X playing." No green checkmarks, no green success states, no green progress bars. Success is implied by the action completing, not by a color change.

## 3. Typography

**Display Font:** Bebas Neue (`BebasNeue_400Regular`), fallback Impact / sans-serif
**Body Font:** System sans (`-apple-system, BlinkMacSystemFont, system-ui, sans-serif`)

**Character:** Bebas Neue is the back-of-the-card sportscaster: tall, condensed, all-caps, reserved exclusively for numbers (ratings, ranks, scores). System sans is the conversation around it: legible, native, neutral. The pairing reads like a stat line.

### Hierarchy
- **Display** (Bebas Neue, 400, 20–48px, line-height 1.1–1.4, `tabular-nums`): Numbers only. Ratings (45–99), rank ordinals (#12), score deltas. Never used for words.
- **Headline** (system sans, 800, 36px, tracking -0.02em): Hero stats and page titles where weight is needed (rare).
- **Title** (system sans, 600, 18px): Section headings, court names, player names in row context.
- **Body** (system sans, 400, 16px): Default prose, primary text.
- **Title Small** (system sans, 600, 14px): Dense metadata, badge inner labels, "At Duke" style attribution lines.
- **Label** (system sans, 500, 12px): "Welcome Back," / "X playing" / chip labels. Often paired with `text-muted-foreground`.

### Named Rules

**The Numbers-Only Rule.** Bebas Neue is forbidden on words. It is the rating font, the rank font, the score font. If you're tempted to use it on a header, use a heavier weight of the system sans instead.

**The Tabular Rule.** Any element displaying a number with possible neighbors (leaderboard rank, rating list, score column) uses `tabular-nums`. Proportional digits in stat-heavy lists are an anti-pattern.

## 4. Elevation

The system is flat by default. Surfaces sit on the page; structure comes from hairline borders (`#E5E5E5` light, `#272727` dark) and a one-step tonal shift in dark mode (card lifted above background). Shadows are deliberately near-invisible: `shadow-sm shadow-black/5` is used sparingly on cards and primary buttons as a whisper of detachment, not as elevation drama. There is no shadow vocabulary for hover, focus, or active states; those are conveyed by color.

### Named Rules

**The Flat-By-Default Rule.** New surfaces do not get shadows. If you reach for a `box-shadow` to make a card "pop," the answer is a different background, a border, or a typographic shift, not depth.

**The No Glow Rule.** Colored glows, drop-shadows on dots, neon halos, and "shadow + opacity" lighting effects are forbidden. The basketball is not plugged into the wall.

## 5. Components

### Buttons
- **Shape:** Fully pill-rounded (`rounded-full`). The shape never changes across variants.
- **Primary:** `bg-primary` (Court Orange) with `primary-foreground` text, 40px height, 16px horizontal padding, semibold 14px label. Active state dims to `bg-primary/90`. One per screen, on the most important action.
- **Outline:** `border-border` over `bg-background`, foreground text. The default secondary action.
- **Secondary:** `bg-secondary` (Mist) over foreground text. Quiet third option.
- **Ghost:** No background at rest; `bg-accent` on active. For destructive-adjacent in-row actions.
- **Destructive:** Reserved for irreversible. `bg-destructive/20` background, destructive-red text. Confirm-then-act.
- **States:** Active uses opacity reduction or accent fill, never a shadow or transform. Disabled drops to `opacity-50`.

### Cards
- **Corner Style:** `rounded-2xl` (16px), tactile and grounded without feeling soft.
- **Background:** `bg-card` (`#FFFFFF` / `#171717` dark).
- **Border:** 1px `border-border`; cards always have a border, never bare on background.
- **Shadow:** `shadow-sm shadow-black/5` only when the card sits alone in a scroll surface; suppressed inside dense layouts.
- **Internal Padding:** 24px (`p-6`).

### Inputs
- **Style:** `rounded-2xl`, 1px `border-input`, 40px height, 12px horizontal padding, body 16px text.
- **Focus (web):** 3px ring at `ring/50` (Court Orange at half opacity). On native, the border tint shifts to ring.
- **Error:** Border shifts to `destructive`, optional 3px `destructive/20` ring.
- **Disabled:** `opacity-50`.

### Badges & Chips
- **Shape:** `rounded-full`, 2px vertical padding, 8px horizontal, 12px semibold text.
- **Primary:** Court Orange fill with white text. Used for archetype labels, OVR pills.
- **Secondary:** Mist fill, foreground text. Used for inactive filters, neutral attributes.
- **Outline:** Hairline border only; the quietest chip.

### List Rows (canonical pattern)
The home screen's court list is the system's signature row. Cards are NOT the right answer here; rows are.

- **Layout:** Full-width row, 16px horizontal padding, 16px vertical, hairline bottom border. First row gets a top border too. No background fill at rest.
- **Hierarchy:** Title (`font-semibold`) on top, status line below at `text-xs`. Right side carries the avatar stack and chevron.
- **Live state:** A 8px solid `bg-green-400` dot followed by `text-xs font-semibold text-green-400` count. The dot is solid, not glowing.
- **Empty state:** "No one playing" at `text-muted-foreground`. Do not show the avatar stack if empty.
- **Sort:** Active rows precede dead rows. The dead group may dim further (`text-muted-foreground` on the title) to reward presence.

### Avatars & Stacks
- **Shape:** Circular (`rounded-full`), 28–32px in row context, larger only in profile headers.
- **Stack:** Up to 3 avatars overlap left-to-right with `-ml-2` offset and `border-2 border-background` to punch out the seam. More than 3 is silently truncated; no "+N" badge unless the count adds information the row doesn't already display.

### Signature: OVR Display
- **Treatment:** Bebas Neue, large size, paired with the archetype label inline. The rating is the loudest visual element on the screen it appears on; the archetype label sits muted next to it. This is the system's hero pattern, used on profile headers and home.

## 6. Do's and Don'ts

### Do:
- **Do** reserve Court Orange (`#FD5103`) for the single most important action per screen plus live-state indicators. The One Voice Rule.
- **Do** use Bebas Neue exclusively for numbers (ratings, ranks, scores), always with `tabular-nums`.
- **Do** keep neutrals pure grayscale (`hsl(224 0% X%)`). Cool, not warm; never tinted toward the orange.
- **Do** prefer dividers and tonal shifts over shadows for depth. Flat-by-default.
- **Do** use full-bleed list rows (hairline divider, no fill) for repeating content like courts and players. Active state earns weight via typography, not chrome.
- **Do** make live presence (who's playing now) the most visually weighted element on any screen that shows it.
- **Do** use system sans for everything that isn't a number. No display font on labels, buttons, or data.

### Don't:
- **Don't** use neon, gradients, glows, or "rank up" animations: explicit anti-reference from PRODUCT.md (gaming leaderboard UIs).
- **Don't** add lifestyle imagery, motivational quotes, or decorative progress rings: anti-reference from PRODUCT.md (overly designed fitness apps).
- **Don't** add likes, follower counts, comment threads, or infinite feeds: anti-reference from PRODUCT.md (generic social apps).
- **Don't** tint the neutrals toward orange (warm-gray, cream, dust). It softens the personality into "fitness app." Cool grays + one loud orange is the contrast that makes the system read sharp.
- **Don't** use Bebas Neue on words. Ever. Headers, buttons, labels, body: all system sans.
- **Don't** wrap repeating list content in uniform cards (`Identical card grids` ban). Court rows are rows, not cards.
- **Don't** zebra-stripe lists with alternating background tints. The pattern encodes nothing.
- **Don't** apply box-shadow glows to dots, dividers, or accents. The basketball is not a LED.
- **Don't** use green outside the live-presence dot + count. No green check icons, no green success toasts.
- **Don't** use side-stripe borders (`border-left` > 1px as a colored accent) on rows, cards, or alerts. Banned outright.
- **Don't** reach for a modal when an inline or sheet pattern works. Native sheets are preferred over centered modals on mobile.
- **Don't** animate layout (height, width, position) for state changes. Color and opacity carry state.
- **Don't** use em dashes in UI copy or microcopy. Use commas, colons, periods, or parentheses.

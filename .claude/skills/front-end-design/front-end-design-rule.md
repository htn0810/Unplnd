# UNPLND --- Front-end Design Specification

> **UNPLND --- No plans. Just vibes.**

## 1. Design Direction

UNPLND uses a **hand-painted, Ghibli-inspired** visual language: the app
feels like a storybook of places — warm washi paper, watercolor skies,
rolling hills and drifting clouds — with Gen-Z energy in the copy and
micro-interactions.

> Inspired by the *feeling* of Studio Ghibli backgrounds (Kazuo Oga's
> gouache landscapes, Miyazaki's skies). Never copy Ghibli characters,
> logos or scenes — every illustration and mascot is original.

The visual direction is:

**Watercolor storybook × satoyama landscape × cozy Gen-Z social app**

Core principles (from the Ghibli philosophy):

-   **Nature as protagonist** — skies, hills, wind and light frame every
    major screen; places are painted, not boxed.
-   **Hand-crafted texture** — paper grain, soft watercolor edges,
    imperfect shapes. Nothing feels CGI-smooth.
-   **The ordinary as extraordinary** — a bowl of phở or a coffee stop is
    shown with the same care as a "magic" moment.
-   **Quiet, then a pop of magic** — a muted natural palette with one vivid
    accent per screen (the primary action, a selected vibe).
-   **Ma (間) — breathing room** — generous whitespace, unhurried motion.
-   **Day-first** — the default theme is *Day* (painted morning). *Twilight*
    (lantern-lit dusk) is the dark theme.
-   One obvious primary action per screen. Mobile-first.

The interface should feel like a place users **want to wander into**,
not a dashboard they have to operate.


------------------------------------------------------------------------

## 2. Front-end Stack

-   React + TypeScript (Vite) in `webapp/`
-   Tailwind CSS v4 (configured in CSS, no `tailwind.config.js`)
-   shadcn/ui on Radix UI
-   Lucide Icons
-   TanStack Query (server state) + Zustand (client state)
-   react-i18next — every user-facing string in **EN + VI**

Design tokens are centralized in `webapp/src/index.css` and reused.
Avoid page-specific hard-coded values. Project structure and coding
rules follow `CLAUDE.md`; this document only covers design.

------------------------------------------------------------------------

## 3. Color System

Pigments follow Miyazaki's Holbein watercolor set and Kazuo Oga's Nicker
gouache colors. Colors are **natural and slightly muted** — never neon.

### Brand pigments

  ----------------------------------------------------------------------------------
  Token            Day (light)   Twilight (dark)   Pigment / use
  ---------------- ------------- ----------------- ---------------------------------
  Meadow           `#3F7D5C`     `#7CC59A`         Viridian — **primary**, nature

  Sky              `#3E86B4`     `#8CC3E6`         Cerulean — links, calm, distance

  Sun              `#E0A43A`     `#F4C866`         Permanent yellow — warmth, magic

  Sunset           `#D9673E`     `#F29B76`         Burnt sienna / crimson — accent

  Lantern          —             `#F4C866`         Twilight primary glow
  ----------------------------------------------------------------------------------

**Painted gradient** (special moments only — hero words, LET'S GO, loaders):
`Sky → Meadow → Sun` (`#3E86B4 → #3F7D5C → #E0A43A` by day,
`#8CC3E6 → #7CC59A → #F4C866` at twilight).

### Day theme (default)

  Token                Hex         Notes
  -------------------- ----------- ------------------------------------
  Background           `#F5EFE1`   Washi paper
  Surface / card       `#FFFBF2`   Cream paper
  Surface elevated     `#EFE6D2`   Toned paper (tiles inside cards)
  Surface hover        `#E9DEC5`
  Border               `#E2D6BC`   Pencil line
  Border strong        `#CDBE9C`
  Foreground           `#2D3A2E`   Forest ink (never pure black)
  Muted                `#6E6A58`   Faded ink

### Twilight theme (dark)

  Token                Hex         Notes
  -------------------- ----------- ------------------------------------
  Background           `#171D2E`   Ultramarine night
  Surface / card       `#1F2740`
  Surface elevated     `#28324F`
  Surface hover        `#2F3A5B`
  Border               `#344064`
  Border strong        `#46537A`
  Foreground           `#F3EBD9`   Paper under lantern light
  Muted                `#A9B1C8`

### Semantic

  Token     Day         Twilight
  --------- ----------- -----------
  Success   `#3F7D5C`   `#7CC59A`
  Warning   `#C98A1B`   `#F4C866`
  Error     `#C2413A`   `#F08A80`
  Info      `#3E86B4`   `#8CC3E6`

### Color rules

-   **Warm–cool contrast:** warm paper/earth in the foreground, cool sky in
    the distance (hero illustrations, page backgrounds).
-   **Atmospheric perspective:** distant layers are bluer, lighter and
    softer.
-   **Magic color pop:** keep surfaces muted; spend saturation on the one
    primary action or the selected vibe.
-   Never pure black `#000` or pure white text on paper — use forest ink and
    cream.


------------------------------------------------------------------------

## 4. shadcn Semantic Tokens

Tokens live in `webapp/src/index.css` (Tailwind v4: raw values on `:root`
= Day and `.dark` = Twilight, mapped in `@theme inline`). Day is the
default; the inline script in `index.html` applies the saved theme before
first paint.

  -----------------------------------------------------------------------
  shadcn token            UNPLND meaning
  ----------------------- -----------------------------------------------
  `primary`               Meadow (Day) / Lantern gold (Twilight) — CTA

  `secondary`             Toned paper — secondary buttons

  `accent`                Paper hover surface (not a brand color)

  `destructive`           Crimson lake

  `ring`                  Sky — focus ring
  -----------------------------------------------------------------------

Extra utilities: `bg-surface(-elevated|-hover)`, `border-border-strong`,
`text-success|warning|info`, `brand-meadow|sky|sun|sunset` (aliases
`brand-purple → meadow`, `brand-pink → sunset`, `brand-mint → sky` kept for
compatibility), `text-vibe-*`, `bg-brand-gradient`, `text-brand-gradient`,
`paper-grain`, `watercolor-card`, `font-sans|heading|hand|mono`.

Never hard-code hex colors in components — tokens only (map pins excepted).


------------------------------------------------------------------------

## 5. Typography

  -------------------------------------------------------------------------
  Role          Font                      Use
  ------------- ------------------------- ---------------------------------
  Display       **Fraunces** (soft serif) Hero words, H1/H2, plan titles,
                                          vibe names — storybook warmth

  Body / UI     **Nunito** (rounded sans) Everything else: buttons, forms,
                                          labels, metadata

  Hand          **Patrick Hand**          Stickers, notes, playful asides,
                                          empty-state whispers (≤ 1 per
                                          view)

  Mono          JetBrains Mono            Times, invite codes, distances
  -------------------------------------------------------------------------

All four support Vietnamese. Display headings use weight 600–800 with
slightly tight tracking; never ALL-CAPS paragraphs — uppercase only for
short kickers/labels.


------------------------------------------------------------------------

## 6. Typography Scale

### Mobile

  Style          Size   Line Height   Weight
  ------------ ------ ------------- --------
  Display        40px          44px      700
  H1             32px          38px      700
  H2             26px          32px      700
  H3             22px          28px      600
  H4             18px          24px      600
  Body Large     18px          28px      400
  Body           16px          24px      400
  Body Small     14px          20px      400
  Caption        12px          16px      500

### Desktop

  Style          Size   Line Height
  ------------ ------ -------------
  Display        56px          60px
  H1             44px          52px
  H2             32px          40px
  H3             24px          32px
  H4             20px          28px
  Body Large     18px          28px
  Body           16px          24px
  Small          14px          20px
  Caption        12px          16px

------------------------------------------------------------------------

## 7. Spacing System

Use a **4px base unit**.

``` text
4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 / 80 / 96 / 128
```

Semantic usage:

    Size Usage
  ------ -------------------------------
     4px Icon ↔ text
     8px Closely related elements
    12px Form controls
    16px Standard component padding
    24px Card padding / component gaps
    32px Section internal spacing
    48px Major section spacing
    64px Mobile section spacing
    96px Desktop section spacing

Avoid arbitrary values such as 17px or 23px unless technically
necessary.

------------------------------------------------------------------------

## 8. Layout Containers

### Page Padding

``` text
Mobile   16px
Tablet   24px
Desktop  32px
```

Recommended Tailwind pattern:

``` tsx
<div className="mx-auto w-full max-w-screen-xl px-4 md:px-6 lg:px-8">
```

### Maximum Width

  Context                 Max Width
  --------------------- -----------
  General application        1280px
  Large screens              1440px
  Create Plan                 720px
  Voting                      960px
  Dashboard                  1280px

------------------------------------------------------------------------

## 9. Border Radius

Soft and rounded — pebbles and paper, never sharp:

``` text
Input / Button   16px (rounded-xl)   — buttons may be fully pill-shaped
Card             24px (rounded-3xl)
Hero / Modal     32px
Badge / Avatar   full
```

------------------------------------------------------------------------

## 10. Buttons

-   Minimum touch target 44 × 44px; primary CTA 52px tall on mobile.
-   **Primary:** Meadow (Day) / Lantern (Twilight), cream text, a soft
    "pressed paper" shadow underneath (`shadow-[0_4px_0]` in a darker
    shade) that collapses on press — playful, squishy, tactile.
-   **Secondary:** toned paper with pencil border.
-   **Special (LET'S GO, generate):** painted gradient with a gentle glow.

------------------------------------------------------------------------

## 11. Cards

-   Cream paper (`bg-card`) with a pencil-line ring, `rounded-3xl`, and a
    soft warm shadow (`shadow-[0_8px_30px_-12px] shadow-ink/20`).
-   Optional `watercolor-card` utility: a faint watercolor wash in one
    corner (vibe-tinted) — for hero cards only.
-   Hover: lift 2–4px and warm the shadow. No heavy drop shadows.

------------------------------------------------------------------------

## 12. Vibe Colors

Natural pigments, readable as text on both themes:

  Vibe       Day         Twilight    Pigment
  ---------- ----------- ----------- -------------------
  CHILL      `#3E86B4`   `#8CC3E6`   Cerulean
  FOOD       `#D9673E`   `#F29B76`   Burnt sienna
  PARTY      `#C2415A`   `#F2909F`   Crimson lake
  NERDY      `#4C5FB8`   `#A3B0F0`   Ultramarine
  OUTDOOR    `#4E8B3A`   `#9CCB7E`   Bamboo green
  DATE       `#B5577E`   `#EFA6C4`   Cobalt violet / mauve
  CHAOS      `#7A54B0`   `#C3A6EC`   Lavender deep
  SURPRISE   `#C99212`   `#F4C866`   Golden yellow

Vibe colors are accents (icons, dots, selected rings, watercolor washes),
never full card fills.


------------------------------------------------------------------------

## 13. Responsive Breakpoints

  Breakpoint   Usage
  ------------ -----------------------------
  `< 640px`    Mobile
  `640px+`     Large mobile / small tablet
  `768px+`     Tablet
  `1024px+`    Laptop / desktop
  `1280px+`    Large desktop

Use standard Tailwind breakpoints:

``` text
sm / md / lg / xl
```

Avoid unnecessary custom breakpoints.

------------------------------------------------------------------------

## 14. Mobile-first Layout

### Mobile

``` text
One column
One primary action
Bottom navigation
Drawers
Bottom sheets
Full-width CTAs
```

### Tablet

``` text
More whitespace
Two columns where useful
Larger cards
```

### Desktop

``` text
Multi-column layouts
Sidebars
Map + list
Timelines
Dashboard layouts
Top navigation
```

The desktop UI should not simply be a scaled-up mobile UI. It should use
the same design language with different information density.

------------------------------------------------------------------------

## 15. Navigation

### Mobile

Use fixed bottom navigation:

``` text
HOME   EXPLORE   +   PLANS   PROFILE
```

The center `+` action is emphasized but should not become an oversized
floating button.

### Desktop

At `1024px+`, use a top navigation:

``` text
UNPLND     Home   Explore   Plans        Bell   Avatar
```

Recommended height:

``` text
64px
```

------------------------------------------------------------------------

## 16. Home Screen

The Home screen should answer:

> **What can I do right now?**

Structure:

``` text
UNPLND                         Bell

What's the plan?

YOU DON'T HAVE ONE.
THAT'S THE POINT.

[ ✦ MAKE A PLAN ]

JOIN A PLAN

Recent plans

┌─────────────────────────┐
│ FRIDAY NIGHT            │
│ CHAOS · 4 PEOPLE        │
│ ✓ Confirmed             │
└─────────────────────────┘
```

Keep Home focused. Avoid unnecessary dashboards and statistics.

------------------------------------------------------------------------

## 17. Create Plan

Mobile should use a wizard rather than a long form.

### Step 1 --- People

``` text
WHO'S COMING?

👤 👤 👤 +
```

### Step 2 --- Duration

``` text
HOW LONG?

30 MIN
1 HOUR
2 HOURS
3 HOURS
4+ HOURS
```

### Step 3 --- Budget

``` text
WHAT'S THE BUDGET?

100K
300K
500K
1M+
```

### Step 4 --- Vibe

``` text
WHAT'S THE VIBE?

CHILL
FOOD
PARTY
NERDY
OUTDOOR
DATE
CHAOS
SURPRISE
```

### Step 5 --- Location

``` text
WHERE?

Current location

5 km
────────●──────

[ MAKE THE PLAN ]
```

Desktop should use the same components in a denser multi-column layout.

------------------------------------------------------------------------

## 18. Generated Plan

This should be one of the most distinctive screens.

Hero example:

``` text
CHAOS · 4 PEOPLE · 4 HOURS

YOUR NIGHT
IS LOOKING
VERY UNPLND.
```

Itinerary example:

``` text
19:00
│
├── 🍜 FOOD
│   Bún thịt nướng
│   1 hour
│
├── 🎮 ACTIVITY
│   Arcade
│   1 hour
│
└── 🌃 WALK
    Riverside
    45 min
```

Actions:

-   Accept
-   Regenerate
-   Replace
-   Lock
-   Share

------------------------------------------------------------------------

## 19. Voting

Voting is a core realtime experience.

Example:

``` text
WHAT SHOULD WE EAT?

┌─────────────────────────┐
│ 🍜 Bún thịt nướng       │
│ ████████████  3 votes   │
│ ✓ You voted             │
└─────────────────────────┘

┌─────────────────────────┐
│ 🍕 Pizza                │
│ █████  1 vote           │
│       VOTE              │
└─────────────────────────┘
```

When another member votes:

``` text
Vote
 ↓
Card pulse
 ↓
Counter update
 ↓
WebSocket event
```

No page reload.

------------------------------------------------------------------------

## 20. Presence

Represent plan members using avatar stacks.

``` text
👤 👤 👤 +1

3 people here
```

Avatar:

``` text
32px
```

Online indicator:

``` text
8px
```

Do not rely on text such as "Online" everywhere.

------------------------------------------------------------------------

## 21. Explore

Mobile:

``` text
EXPLORE

[ Search places... ]

[Food] [Coffee] [Fun] [Outdoor]

┌───────────────────────┐
│       PLACE IMAGE     │
│                       │
│ 🍜 Bún ...            │
│ ★ 4.7                 │
│ 0.8 km                │
└───────────────────────┘
```

Desktop:

``` text
┌──────────────┬──────────────────────────┐
│ Filters      │            MAP           │
│ Food         │                          │
│ Coffee       │                          │
│ Activities   │                          │
├──────────────┤──────────────────────────┤
│ Places       │                          │
│ Cards        │                          │
└──────────────┴──────────────────────────┘
```

------------------------------------------------------------------------

## 22. Mobile Map

Avoid a full-screen map overloaded with controls.

Use:

-   Search
-   Map
-   Minimal markers
-   Bottom sheet for place details

Example:

``` text
┌─────────────────────────┐
│ Search                  │
│                         │
│          MAP            │
│     ●       ●           │
│        ●                │
│                         │
│ ┌─────────────────────┐ │
│ │ 🍜 Place             │ │
│ │ ★ 4.7 · 0.8 km       │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

------------------------------------------------------------------------

## 23. Profile

Keep the profile lightweight and social.

``` text
        Avatar

      User name
   24 plans made

Plans        12
Places       48
Chaos score  87%

Recent memories
```

`Chaos Score` can become a future gamification metric.

------------------------------------------------------------------------

## 24. Icons

Use Lucide Icons consistently.

     Size Usage
  ------- ----------------
     16px Inline
     18px Standard UI
     20px Buttons
     24px Navigation
    32px+ Feature / hero

Do not mix multiple icon libraries without a specific reason.

------------------------------------------------------------------------

## 25. Motion

Ghibli motion is **naturalistic and unhurried** — physics with weight,
ambient life in still scenes.

``` text
Fast       150ms   taps, toggles
Normal     300ms   cards, sheets
Breathing  4–60s   ambient loops (clouds, wind, particles)
```

-   **Kaze (wind):** grass and leaves sway, stickers bob gently.
-   **Drifting clouds:** slow horizontal parallax in hero skies.
-   **Ambient life:** floating petals by day, fireflies at twilight —
    sparse (≤ 12 particles), never distracting.
-   **Weight:** springs with soft damping; nothing snaps or bounces
    cartoonishly.
-   Respect `prefers-reduced-motion`: all ambient loops stop.


------------------------------------------------------------------------

## 26. Plan Generation UX

Plan generation should communicate personality.

Example:

``` text
Planning...

Checking the vibe...

Finding something nearby...

Making questionable decisions...

Done.
```

Then:

``` text
YOUR PLAN IS READY.
```

This copy is part of the product personality.

------------------------------------------------------------------------

## 27. Component Architecture

Follows the frontend module layout in `CLAUDE.md` (section 4). Generic
primitives, app-wide components, and product features are separated:

``` text
webapp/src/
├── components/
│   ├── ui/                     # shadcn/ui primitives (generated)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── avatar.tsx
│   │   └── ...
│   ├── AppHeader.tsx           # app-wide layout & shared pieces
│   ├── MobileNav.tsx
│   ├── LanguageSwitcher.tsx
│   ├── MemberStack.tsx
│   └── VibeBadge.tsx
│
├── features/                   # UNPLND product components live with their feature
│   ├── plan/
│   │   ├── MakePlanHero.tsx
│   │   ├── UpcomingPlanCard.tsx
│   │   ├── RecentPlanCard.tsx
│   │   ├── ItineraryCard.tsx
│   │   ├── PlanProgress.tsx
│   │   └── index.ts
│   ├── voting/
│   │   └── VoteCard.tsx
│   ├── place/
│   │   └── PlaceCard.tsx
│   └── ...
│
└── pages/                      # route-level screens composing features
    └── HomePage.tsx
```

Rules:

-   `components/ui/` contains generic shadcn/ui primitives only.
    Edit them only for design tokens and sizes (e.g. 44px touch
    targets), never for product logic.
-   `components/` (top level) contains app-wide layout and components
    used by 2+ features (`AppHeader`, `MobileNav`, `MemberStack`,
    `VibeBadge`, `PageContainer`, `Section`). They receive data via
    props and never import from `features/`.
-   Product-specific components (`VibeCard`, `PlanCard`,
    `ItineraryCard`, `PlaceCard`, `VoteCard`, `ChaosSlider`,
    `PlanProgress`) live inside their feature folder and are exported
    through the feature's `index.ts`.
-   `pages/` stay thin and only compose features.
-   File names: components `PascalCase.tsx`; hooks, services, utils
    `camelCase.ts`.
-   All visible text comes from `i18n/locales/en.json` and `vi.json` —
    write copy for both languages when designing a component.
-   Avoid heavily modifying shadcn components until they lose generic
    reusability.

------------------------------------------------------------------------

## 28. Tailwind Conventions

### Spacing

``` text
4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 / 80 / 96
```

### Radius

``` text
8 / 12 / 16 / 20 / 24 / full
```

### Container

``` tsx
<div className="mx-auto w-full max-w-screen-xl px-4 md:px-6 lg:px-8">
```

These patterns should be reused consistently.

------------------------------------------------------------------------

## 29. Accessibility

The design system must support accessible interaction.

Requirements:

-   Keyboard navigation
-   Visible focus states
-   Semantic HTML
-   Accessible labels
-   Sufficient color contrast
-   Minimum touch target around 44px
-   Screen-reader-friendly controls
-   Reduced-motion support
-   Never use color as the only state indicator

For example, a selected vote should communicate:

``` text
✓ You voted
```

in addition to visual styling.

------------------------------------------------------------------------

## 30. UI State Rules

Every important component should define:

``` text
Default
Hover
Focus
Active
Selected
Disabled
Loading
Success
Error
Empty
```

Example place card states:

``` text
Default
Selected
Locked
Unavailable
Loading
Error
```

States should be designed as part of the component specification, not
added later.

------------------------------------------------------------------------

## 31. Empty States

Empty states should be contextual and playful.

Avoid:

> No data found.

Prefer:

> **No plans yet. That's suspicious.**

CTA:

``` text
MAKE A PLAN
```

Another example:

> **Nothing nearby. We might need to expand the radius.**

CTA:

``` text
SEARCH FURTHER
```

------------------------------------------------------------------------

## 32. Error States

Errors should remain clear without feeling overly corporate.

Example:

``` text
Something went sideways.

We couldn't generate your plan right now.

[ TRY AGAIN ]
```

Technical details should be available when useful but should not
dominate the user-facing message.

------------------------------------------------------------------------

## 33. Loading States

Use skeletons for content-heavy screens.

Use progress copy for meaningful long-running actions.

Content loading:

``` text
████████████
██████
████████████████
```

Plan generation:

``` text
Checking the vibe...
```

Avoid using a generic spinner for every asynchronous operation.

------------------------------------------------------------------------

## 34. Design DNA

``` text
01. Day-first, painted; Twilight is the lantern-lit dark mode
02. Washi paper surfaces with visible grain
03. Meadow green leads; sky, sun and sunset support
04. Painted gradient only for special moments
05. Fraunces headings, Nunito UI, Patrick Hand whispers
06. Soft round shapes — pebbles, paper, clouds
07. Nature frames every major screen (sky, hills, wind)
08. Quiet palette, one pop of magic per screen
09. Unhurried ambient motion; respect reduced motion
10. Original illustrations only — inspired by Ghibli, never copied
```

------------------------------------------------------------------------

## 34b. Painted Surfaces & Illustration

-   **Paper grain:** a fixed, very low-opacity noise layer over the whole
    app (`paper-grain`), stronger on hero art.
-   **Hero landscapes:** multi-plane SVG (sky → far hills → near hills →
    foreground grass) with watercolor edges (SVG turbulence displacement)
    and a route of stops across the hills. Day and Twilight versions.
-   **Mascot:** "Bông", an original round dandelion-puff sprite — used for
    empty, loading and success states. Never a copy of existing
    characters.
-   **Maps:** OSM tiles toned toward watercolor (sepia/soft saturation) by
    day, ultramarine at twilight.


# 35. Final Design Tokens

``` text
Theme          Day (default) · Twilight (dark) · System
Primary        Meadow #3F7D5C (Day) / Lantern #F4C866 (Twilight)
Sky            #3E86B4 / #8CC3E6
Sun            #E0A43A / #F4C866
Sunset         #D9673E / #F29B76
Background     #F5EFE1 washi / #171D2E night
Card           #FFFBF2 / #1F2740
Foreground     #2D3A2E forest ink / #F3EBD9
Fonts          Fraunces · Nunito · Patrick Hand · JetBrains Mono
Radius         16 / 24 / 32 / full
Spacing        4px base
Motion         150 / 300ms; ambient loops 4–60s
```

------------------------------------------------------------------------


# 36. Design Goal

The final experience should communicate:

``` text
             PEOPLE
                +
              TIME
                +
             BUDGET
                +
               VIBE
                │
                ▼
          ┌─────────────┐
          │   UNPLND    │
          └──────┬──────┘
                 │
        ┌────────┼────────┐
        ▼        ▼        ▼
      PLACES  ITINERARY  PEOPLE
        │        │        │
        └────────┼────────┘
                 ▼
              LET'S GO
                 │
                 ▼
              MEMORY
                 │
                 ▼
           BETTER NEXT TIME
```

> **UNPLND turns "I don't know, you decide" into a plan worth leaving
> the house for.**

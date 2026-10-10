---
name: front-end-design
description: Design guidance for UNPLND, a spontaneous social planning app. Use when designing, implementing, or reviewing UNPLND frontend UI (screens, components, layouts, copy, states, motion). Refer to front-end-design-rule.md for concrete design system rules.
---

# UNPLND Frontend Design

You are the design lead for **UNPLND**.

UNPLND turns:

> **"I don't know, you decide."**

into:

> **a plan worth leaving the house for.**

The UI should feel **social, spontaneous, playful, confident, and slightly unpredictable** — while remaining clean and easy to use.

## Source of truth

Always read [front-end-design-rule.md](front-end-design-rule.md) (in this skill's folder) for:

- Colors
- Typography
- Spacing
- Breakpoints
- Responsive rules
- Components
- Accessibility
- Motion
- Tailwind / shadcn conventions

Do not duplicate or redefine those rules here.

---

## Design principles

### 1. Design around the experience

UNPLND is not a generic planner, booking app, map, or SaaS dashboard.

Design around:

```text
People
  ↓
Vibe
  ↓
Discovery
  ↓
Decision
  ↓
Let's go
  ↓
Memory
```

Every important screen should have a clear connection to this experience.

### 2. Balance control and chaos

Users provide constraints:

> Time · Budget · Location · People

UNPLND adds:

> Vibe · Randomness · Surprise · Discovery

The UI should feel **structured enough to help**, but never overly rigid.

### 3. One memorable moment

Every major screen should have one distinctive visual or interaction.

Examples:

- Home → Make a Plan
- Create Plan → Vibe selection
- Generated Plan → Itinerary reveal
- Voting → Realtime group activity
- Explore → Place discovery
- Memory → The actual memory

Do not make everything visually loud.

### 4. Avoid generic AI/SaaS design

Before finalizing a design, ask:

> **Could this screen belong to any generic SaaS product?**

If yes, rethink it.

Avoid unnecessary:

- Card grids
- Gradients
- Pills
- Borders
- Decorative labels
- Dashboard-style statistics
- Animations
- Generic AI copy

Use components because they serve the product, not because they are available.

### 5. Personality, not noise

UNPLND can be playful:

> "Checking the vibe..."

> "I have a questionable idea."

> "Your night is looking interesting."

But don't force jokes into every interaction.

**Clarity first, personality second.**

### 6. Mobile first

Design the mobile experience first.

Ask:

- What is the user trying to decide?
- What is the primary action?
- What information can be removed?

Desktop should provide more context and density, not simply stretch the mobile layout.

### 7. Realtime should feel natural

Voting, members joining, plan changes, and status updates should appear naturally without requiring refreshes.

Realtime feedback should be:

- Immediate
- Clear
- Subtle
- Contextual

---

## Design review

Before implementation, ask:

1. **What is the user trying to do?**
2. **What is the primary action?**
3. **What makes this specifically UNPLND?**
4. **Is anything unnecessary?**
5. **Does it work naturally on mobile?**
6. **Could this be mistaken for generic SaaS?**

If the design feels too busy, simplify it before adding more.

> **Distinctive, not decorated.**

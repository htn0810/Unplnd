# Feature: Plan Creation

**Status: Implemented on mock data** (web). Backend planned in plan-service.

## Business purpose

Turn "I don't know, you decide" into constraints UNPLND can plan around: people, when, how long, how much, what vibe, where.

## User workflow

Home "MAKE A PLAN" (or a vibe from the vibe rail) → `/plans/new` wizard, one question per step:

`people → when → duration → budget → vibe → location` → generating overlay → plan detail with itinerary reveal.

- **When:** single day or multi-day trip (max 7 days) with date selection.
- **Location:** nearby (radius) or any of Vietnam's 34 provinces.
- Wizard state lives in Zustand (`createPlanStore`); the result is a server-state plan.

## Data flow

```text
Today:   wizard ─► useGeneratePlan ─► planService.generatePlan ─► planGenerator (browser, mock activity pool)
                   └─► setQueryData(planKeys.detail) + invalidate planKeys.upcoming
Planned: wizard ─► POST /api/v1/plans ─► plan-service (DRAFT → GENERATING → OPEN)
                   ─► place-service candidates ─► RecommendationEngine ─► PLAN_CREATED
```

## Business rules (current mock)

- Status after creation: `VOTING` when friends are invited, otherwise `CONFIRMED` (mock shortcut; backend will start at DRAFT/OPEN).
- Budget is **per person, per day**; duration is hours available **per day**.
- A random challenge is attached to every plan.

See [itinerary-generation](itinerary-generation.md) for how stops are chosen.

## Modules

[web](../modules/web.md) · [plan-service](../modules/plan-service.md) *(planned)* · [place-service](../modules/place-service.md) *(planned)*

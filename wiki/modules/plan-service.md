# Module: plan-service

> **Status: Planned** (roadmap Phase 2) — plan behavior currently lives in the web mock (`features/plan`).

- *Planned:* the main business service — plans, members, constraints, itinerary, voting, invite links, confirmation, memories.
- *Planned:* MongoDB: plan document with embedded members/constraints/itinerary; votes, memories, outbox collections.
- *Planned:* `PlanStateMachine` enforces the [lifecycle](../features/plan-lifecycle.md); only the creator confirms/cancels, only members vote.
- *Planned:* calls place-service (REST) for candidates; `RecommendationEngine` (rule-based first) builds itineraries.
- *Planned:* produces all `PLAN_*` events (key = `planId`); consumes USER_UPDATED, PLACE_UPDATED.

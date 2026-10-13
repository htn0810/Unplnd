# Feature: Itinerary Generation

**Status: Implemented in the browser on mock data** (`features/plan/planGenerator.ts`). Target: plan-service `RecommendationEngine` with place-service candidates.

## Business purpose

Build a believable, editable itinerary from constraints — the core "you decide" moment.

## Generation rules (current rule-based mock)

- Candidates: curated pool for the chosen province (within radius when "nearby"), vibe matches first; `SURPRISE` uses everything.
- Per day: 2–5 stops, filling the day's hours with a 15-minute gap between stops, within the per-person daily budget.
- Budget too tight → cheapest ideas; pool runs dry → generic local stops for the province (breakfast, explore, coffee, night food street).
- Stop order: food → activity → walk → drink → dessert.
- A stop is never reused across days of the same trip.

## Editing (host only)

- Lock a stop (kept on regenerate), replace one stop, regenerate the rest.
- Edit any stop (title, place, duration, cost, province) or add new ones; reorder within a day or move between days.
- **Timing:** auto stops start at previous end + 15 min; a stop with a manual time keeps it; overlaps are flagged.
- Multi-day: per-day start time and province; add/remove days up to 7.

## Planned

*Planned:* plan-service generates server-side (rule-based first, AI later behind `RecommendationEngine`); locked activities survive regeneration; activity replacement uses place-service search.

## Modules

[web](../modules/web.md) · [plan-service](../modules/plan-service.md) *(planned)* · [place-service](../modules/place-service.md) *(planned)*

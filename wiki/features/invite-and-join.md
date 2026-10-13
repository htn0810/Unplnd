# Feature: Invite & Join

**Status: Implemented on mock data** (web). Backend planned.

## Business purpose

Friends join a plan from a link without setup: `https://unplnd.app/join/7H2K9X`.

## User workflow

Host shares the invite link → friend opens `/join/:inviteCode` (or types the code on Home's "JOIN A PLAN") → sees plan preview and members → **Join** → lands on the plan detail with itinerary reveal.

## Data flow

```text
Today:   /join/:code ─► usePlanByInviteCode ─► planService (session plans, then mock plan-details)
         join = local state only (fake delay), invalid code → "invalid invite" screen
Planned: POST /api/v1/plans/join/{code} ─► plan-service ─► PLAN_MEMBER_JOINED ─► notification-service ─► other members live
```

## Business rules

- Invite code: 6 characters from an unambiguous alphabet (no 0/O/1/I), matched case-insensitively.
- *Planned:* invite tokens random, unguessable, expirable; joining adds the user as `MEMBER`.

## Modules

[web](../modules/web.md) · [plan-service](../modules/plan-service.md) *(planned)* · [notification-service](../modules/notification-service.md) *(planned)*

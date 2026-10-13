# Feature: Voting

**Status: Implemented on mock data**, other members' votes simulated. Backend planned.

## Business purpose

Let the group decide together — activities, places, alternatives, challenges — instead of one person deciding.

## Today

- Plans can carry polls (question + options with counts). A generated plan with friends gets a "first stop" poll.
- My vote is applied locally; `useSimulatedVotes` fakes friends voting with toasts and highlights.

## Planned flow

```text
Member votes ─► POST /api/v1/plans/{id}/votes ─► plan-service (persist, check membership + VOTING state)
              ─► PLAN_VOTE_CAST (key = planId) ─► notification-service ─► /topic/plan.{id} ─► others refetch
```

- *Planned:* only members vote, only while the plan is in VOTING; optimistic update on the voter's client.
- Result rule (ties, closing a vote) is **not defined** in the spec yet.

## Modules

[web](../modules/web.md) · [plan-service](../modules/plan-service.md) · [notification-service](../modules/notification-service.md) *(planned)*

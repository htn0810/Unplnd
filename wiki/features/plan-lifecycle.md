# Feature: Plan Lifecycle

**Status: Planned on the backend.** The web mock shows the statuses and lets the host move them locally.

## States (spec §9)

```text
DRAFT → GENERATING → OPEN → VOTING → CONFIRMED → READY_TO_GO → IN_PROGRESS → COMPLETED
VOTING | CONFIRMED | READY_TO_GO → CANCELLED
```

## Rules

- *Planned:* enforced only by plan-service's `PlanStateMachine`; illegal transitions → HTTP 409. Status is never set from a request body.
- *Planned:* only the creator confirms or cancels.
- Events: PLAN_CONFIRMED, PLAN_CANCELLED, PLAN_STARTED, PLAN_COMPLETED (key = planId).

## Today (web mock)

- The host's action bar offers **Confirm** while `OPEN`/`VOTING` and **Start** while `CONFIRMED`/`READY_TO_GO`; both just set status in the browser (`setStatus`).
- "Host" = current user id equals `plan.creatorId`; others see the plan read-only.
- ⚠️ This is the opposite of the target rule (frontend must not decide transitions) — see [knowledge](../knowledge.md#common-pitfalls).

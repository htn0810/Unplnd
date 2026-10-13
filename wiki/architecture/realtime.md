# Realtime

> **Status: Planned** — no WebSocket server exists (roadmap Phase 5). The web app **simulates** other members (`useSimulatedVotes` in plan detail).

## Design (planned)

```text
Member A votes ─► REST ─► plan-service ─► MongoDB
                                 │ PLAN_VOTE_CAST (key = planId)
                                 ▼
                           Kafka plan-events
                                 ▼
                       notification-service ─► /topic/plan.{planId}
                                 ▼
                     other members' browsers ─► invalidate planKeys.detail(planId)
```

- Endpoint `/ws` (STOMP over WebSocket), held only by notification-service.
- Destinations: `/topic/plan.{planId}` (plan room), `/user/queue/...` (personal notifications).
- Pushed types (spec): PLAN_MEMBER_JOINED, PLAN_MEMBER_LEFT, PLAN_VOTE_UPDATED, PLAN_STATUS_CHANGED, NOTIFICATION_CREATED.
- Messages are refresh signals; the REST API stays the source of truth. Actions never go over WebSocket.
- Presence: Redis with TTL (`user → ONLINE`), refreshed by heartbeats.
- Reconnect strategy: on reconnect, refetch active plan queries (missed events are not replayed). *Assumption — not yet decided in the spec.*

# Kafka Events

> **Status: Planned** — no Kafka, topics or producers exist yet (roadmap Phase 4). Everything below is the intended design from the spec and [`CLAUDE.md`](../../CLAUDE.md); update as it gets built.

## Topics

| Topic | Purpose |
|---|---|
| `user-events` | Account and profile facts |
| `plan-events` | Plan lifecycle, membership, votes |
| `place-events` | Place data changes |
| `notification-events` | Notification requests (email/push later) |

Each topic gets a `<topic>.DLT`.

## Event catalog (planned)

| Event | Topic | Key | Producer | Consumers |
|---|---|---|---|---|
| USER_REGISTERED | user-events | userId | identity-service | profile-service (create profile) |
| USER_UPDATED | user-events | userId | profile-service | plan-service |
| FRIEND_REQUEST_SENT / _ACCEPTED | user-events | userId | profile-service | notification-service |
| PLAN_CREATED | plan-events | planId | plan-service | notification-service |
| PLAN_MEMBER_JOINED / _LEFT | plan-events | planId | plan-service | notification-service |
| PLAN_VOTE_CAST / PLAN_VOTE_UPDATED | plan-events | planId | plan-service | notification-service |
| PLAN_CONFIRMED / _CANCELLED / _STARTED | plan-events | planId | plan-service | notification-service |
| PLAN_COMPLETED | plan-events | planId | plan-service | notification-service, profile-service |
| PLACE_UPDATED | place-events | placeId | place-service | plan-service |

All version 1 when introduced.

## Envelope

```json
{ "eventId": "evt_123", "eventType": "PLAN_CONFIRMED", "occurredAt": "2026-10-07T14:00:00Z",
  "producer": "plan-service", "version": 1, "payload": { "planId": "plan_123", "confirmedBy": "user_1" } }
```

## Reliability patterns (planned, deliberate learning goals)

| Pattern | Why |
|---|---|
| Key = `planId` / `userId` | Per-aggregate ordering |
| Idempotent consumers (processed `eventId` store) | At-least-once delivery means duplicates |
| Retry with backoff + DLT | Poison messages must not block a partition |
| Transactional outbox (plan-service first) | MongoDB write and Kafka publish are not atomic |
| One consumer group per consuming service | Each service gets every event |

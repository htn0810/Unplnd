# Data Storage

Database-per-service: a service never reads another service's database.

| Service | Store | Owns | Status |
|---|---|---|---|
| identity-service | MySQL `unplnd-identity` | `accounts` (id UUID, email unique, password_hash) | Implemented |
| identity-service | MySQL | oauth_accounts, refresh_tokens | Planned |
| profile-service | MySQL | profiles, friendships, friend_requests, user_preferences | Planned |
| plan-service | MongoDB | plans (members, constraints, itinerary embedded), votes, memories, outbox | Planned |
| place-service | MongoDB + Redis | places, categories; provider response cache | Planned |
| notification-service | MongoDB + Redis | notifications; presence | Planned |

## Identity data

- `accounts.id` is the **userId** every other service will reference (JWT `sub`).
- Passwords stored as `{algorithm}hash` (Argon2 default) — see [knowledge](../knowledge.md).

## Migrations

- Rule: Flyway scripts in `db/migration/`, Hibernate `ddl-auto=validate`.
- Today: identity-service has **no Flyway**; Hibernate `ddl-auto=update` creates/changes the schema. Fix before the schema matters.

## Redis (planned)

| Key space | Use | TTL |
|---|---|---|
| place cache | Overpass / place detail responses | minutes–hours |
| presence | `user → ONLINE` | short, refreshed by heartbeat |
| rate limit | per IP / user / endpoint counters | window length |

Redis is never a source of truth.

## Browser-side data (today)

The web app reads mock JSON from `webapp/public/resources/mock-data/`; generated/edited plans live in memory per tab.

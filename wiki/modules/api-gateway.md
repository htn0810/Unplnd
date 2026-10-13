# Module: api-gateway

> **Status: Planned** (roadmap Phase 0) — not in the repo.

- *Planned:* Spring Cloud Gateway, single public entry (HTTPS/WSS).
- *Planned routes:* `/api/v1/auth/**` → identity-service (`/identity/auth/**`), `/api/v1/users/**` → profile-service, `/api/v1/plans/**`, `/api/v1/places/**`, `/api/v1/notifications/**`, `/ws` → notification-service.
- *Planned filters:* JWT validation, correlation id, rate limiting (Redis), CORS.
- **Does NOT belong here:** business logic or authorization rules beyond "is this token valid".

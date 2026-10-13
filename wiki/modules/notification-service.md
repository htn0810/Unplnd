# Module: notification-service

> **Status: Planned** (roadmap Phase 5). Today notifications are mock JSON in the web app.

- *Planned:* consumes plan and friend events, stores notifications (MongoDB), pushes via WebSocket.
- *Planned:* the only holder of WebSocket connections (`/ws`, `/topic/plan.{planId}`, `/user/queue/...`).
- *Planned:* presence in Redis with TTL.
- *Planned:* later EMAIL/PUSH notification requests.
- **Does NOT belong here:** deciding business outcomes — it only reacts to facts other services published.

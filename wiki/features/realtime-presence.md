# Feature: Realtime Presence

> **Status: Planned** (roadmap Phase 5). Web shows mock "online" dots and simulated activity.

- *Planned:* members see who is online in a plan and live updates (joins, votes, status) without refresh.
- *Planned:* presence in Redis with TTL, maintained by notification-service from WebSocket heartbeats.
- *Planned:* updates arrive as WebSocket signals that invalidate TanStack Query caches — see [realtime](../architecture/realtime.md).

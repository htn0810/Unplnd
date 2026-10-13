# UNPLND Wiki

> **UNPLND turns "I don't know, you decide" into a plan worth leaving the house for.**

UNPLND is a real-time social planning app: a group sets **people + time + budget + vibe**, UNPLND finds places, builds an itinerary, friends join via invite link, vote live, confirm, go, and save a memory. It is also a learning project for microservices, Kafka and distributed-system patterns.

Sources of truth: [`CLAUDE.md`](../CLAUDE.md) (stack, layout, coding rules) · [`docs/UNPLND_PROJECT_SPEC.md`](../docs/UNPLND_PROJECT_SPEC.md) (product intent, roadmap) · [front-end design rules](../.claude/skills/front-end-design/front-end-design-rule.md) (visuals). This wiki describes what the **code** does today.

## Where the project is

Roadmap phases are in spec §34. Current state (Oct 2026):

| Area | Status |
|---|---|
| Phase 0 — Foundation | **Partial** — Gradle multi-project (`commons`, `identity-service`), root `.gitignore`. No Docker Compose, gateway, CI or contract packages yet |
| Phase 1 — Authentication | **Partial** — `identity-service` has email/password sign-up only; web sign-in/sign-up screens are mocked |
| Web app (all MVP screens) | **Implemented on mock data** — every screen works against JSON in `webapp/public/resources/mock-data/` |
| Phases 2–10 (plans, places, Kafka, realtime, recommendation, reliability, infra, k8s, mobile) | **Planned** — behavior exists only as frontend mocks |

## Pages

**Start here:** [knowledge.md](knowledge.md) — conventions, pitfalls, spec gaps.

### Architecture
- [overview](architecture/overview.md) — system diagram, services, ports
- [frontend](architecture/frontend.md) — web app structure, state, routing
- [backend](architecture/backend.md) — Gradle build, service template, `commons`
- [kafka-events](architecture/kafka-events.md) — topics and event catalog *(planned)*
- [realtime](architecture/realtime.md) — WebSocket / STOMP, presence *(planned)*
- [data-storage](architecture/data-storage.md) — MySQL / MongoDB / Redis ownership
- [infrastructure](architecture/infrastructure.md) — Docker, CI/CD, k8s *(planned)*

### Modules
- [web](modules/web.md) — React PWA
- [mobile](modules/mobile.md) *(planned)*
- [api-gateway](modules/api-gateway.md) *(planned)*
- [identity-service](modules/identity-service.md) — authentication
- [profile-service](modules/profile-service.md) *(planned)*
- [plan-service](modules/plan-service.md) *(planned)*
- [place-service](modules/place-service.md) *(planned)*
- [notification-service](modules/notification-service.md) *(planned)*
- [api-contracts](modules/api-contracts.md) *(planned)*
- [event-contracts](modules/event-contracts.md) *(planned)*

### Features
- [auth](features/auth.md) — sign-up / sign-in
- [plan-creation](features/plan-creation.md) — create-plan wizard
- [plan-lifecycle](features/plan-lifecycle.md) — status state machine
- [invite-and-join](features/invite-and-join.md) — invite links
- [place-discovery](features/place-discovery.md) — Explore and maps
- [itinerary-generation](features/itinerary-generation.md) — generating and editing stops
- [voting](features/voting.md) — group polls
- [realtime-presence](features/realtime-presence.md) — live member state
- [notifications](features/notifications.md)
- [memory](features/memory.md) — post-plan memories
- [profile-and-friends](features/profile-and-friends.md)

## Technology stack

| Layer | Version in repo | Notes |
|---|---|---|
| Java | 21 (Gradle toolchain) | |
| Spring Boot | 4.1.1 | Spring Framework 7 |
| Gradle | 9.7.1 (root wrapper) | Groovy DSL multi-project |
| Node | 22 (dev machine) | |
| React | 19.2 | Vite 8, TypeScript 6, Tailwind 4, shadcn/ui |
| TanStack Query / Zustand | 5.104 / 5.0 | |
| MySQL | 8 | identity-service |
| MongoDB, Redis, Kafka | — | planned, not in the repo yet |

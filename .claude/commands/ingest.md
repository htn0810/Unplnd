---
description: Generate the initial LLM Wiki (wiki/) for the UNPLND project.
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - Bash
---

# /ingest

@.claude/prompts/wiki-system.md

---

You are creating the **initial project knowledge base** for **UNPLND**.

Your goal is **NOT** to document every class or function. Your goal is to understand the project and build a concise, high-level wiki that helps future developers quickly understand the system.

---

## Scope

Analyze the entire repository. **Prioritize understanding over completeness.**

Before writing, read:

- `.llmwiki/config.yml` — source-to-wiki-page mappings and feature keywords
- `CLAUDE.md` — tech stack, module layout, rules (link to it, do not copy it)
- `docs/UNPLND_PROJECT_SPEC.md` — product intent and roadmap

Focus on:

- Overall architecture
- Service boundaries and data ownership
- Event flows (Kafka) and realtime flows (WebSocket)
- Feature flows end-to-end
- Important business concepts and rules
- Relationships between modules

*Avoid documenting low-level implementation details.*

### Early-stage repository

UNPLND is built incrementally (see roadmap phases in the spec). For anything not implemented yet:

- still create the page if it is listed below, with a short **Status: Planned** banner
- summarize the intent from the spec in 2–5 bullets, marked as *planned*
- never describe planned behavior as if it exists
- record notable differences between spec and code in `knowledge.md` → **Spec Gaps**

---

## Exploration Workflow

Work through the repository in this order. Read broadly before writing anything.

### 1. Understand the repository structure

- Root: `webapp/`, standalone backend services (`api-gateway/`, `*-service/`), `packages/`, `infrastructure/`, `plans/`
- `webapp/package.json` — frontend dependencies and scripts
- each service's `build.gradle.kts` — Spring Boot / Java versions, dependencies
- `plans/` — existing feature plans and locked terminology

### 2. Understand the backend services

For each backend service at the repo root (`api-gateway/`, `*-service/`):

- `*Application.java` and `application*.properties` — profiles, datastores, Kafka config
- feature packages — `*Controller`, `*Service` (+ `impl/`), `*Repository`, entities/documents, `dto/`
- `shared/` — `ApiConstants`, `ApiResponse`, `GlobalExceptionHandler`, security, event envelope, outbox
- `event/` packages — producers, consumers, topics, keys, DLT, idempotency
- `plan-service` — `PlanStateMachine`, `PlanStatus`, voting, invites, itinerary
- `place-service` — `PlaceProvider`, `RoutingProvider`, Redis caching
- `notification-service` — WebSocket / STOMP config, destinations, presence
- `api-gateway` — routes, filters (JWT, correlation id, rate limit, CORS)
- `identity-service` — username/password auth, Google & Facebook OAuth2 login, JWT + refresh tokens, Flyway migrations in `db/migration/`
- `profile-service` (planned) — profiles, friendships, preferences

### 3. Understand the contracts

- `packages/event-contracts/` — event types, schemas, versions
- `packages/api-contracts/` — OpenAPI specs / generated types
- `packages/shared-types/`

These define how services and the frontend talk. They are as important as source code.

### 4. Understand the frontend

- `webapp/src/App.tsx`, `routes/`, `pages/` — navigation and screens
- `features/*` — feature services, query hooks, stores, schemas, public `index.ts`
- `services/` — `apiClient`, `queryClient`, `websocketClient`
- `store/` — global Zustand stores
- `i18n/`, `constants/`

### 5. Understand the infrastructure

- `infrastructure/docker/docker-compose.yml` — containers and ports
- `.github/workflows/` — CI/CD
- `infrastructure/k8s/`, `infrastructure/monitoring/`

---

## Output Structure

Create the following pages under `wiki/` if they do not already exist:

```text
wiki/
├── index.md
├── knowledge.md
├── architecture/
│   ├── overview.md
│   ├── frontend.md
│   ├── backend.md
│   ├── kafka-events.md
│   ├── realtime.md
│   ├── data-storage.md
│   └── infrastructure.md
├── modules/
│   ├── web.md
│   ├── mobile.md
│   ├── api-gateway.md
│   ├── identity-service.md
│   ├── profile-service.md
│   ├── plan-service.md
│   ├── place-service.md
│   ├── notification-service.md
│   ├── api-contracts.md
│   └── event-contracts.md
└── features/
    ├── auth.md
    ├── plan-creation.md
    ├── plan-lifecycle.md
    ├── invite-and-join.md
    ├── place-discovery.md
    ├── itinerary-generation.md
    ├── voting.md
    ├── realtime-presence.md
    ├── notifications.md
    ├── memory.md
    └── profile-and-friends.md
```

Never overwrite an existing page — extend it.

---

## Page Content Guidance

### `index.md`

One-page project map. Include:

- What UNPLND does (one paragraph + one-line pitch)
- Current roadmap phase and what is implemented vs planned
- Link to every architecture, module, and feature page
- Technology stack table (Java, Spring Boot, Node, React, Kafka, MySQL, MongoDB, Redis versions)
- Links to `CLAUDE.md`, the spec, and the front-end design rules

---

### `knowledge.md`

Tribal knowledge only — things not obvious from reading the code.

Include:

- Non-obvious architectural decisions and why they were made
- Learning goals behind patterns (why outbox, why Kafka key = planId)
- Common pitfalls (trusting client IDs, bypassing state machine, non-idempotent consumers, duplicating server state in Zustand)
- Important conventions not already in `CLAUDE.md`
- **Spec Gaps** — spec vs implementation differences

Do NOT copy content already in other wiki pages or `CLAUDE.md`.

---

### `architecture/overview.md`

System-level picture. Include:

- Full system diagram (web → API Gateway → services → datastores / Kafka → Notification Service → WebSocket)
- List of all services and packages with one-line responsibilities
- External integrations (OSM, Overpass, OSRM)
- Port map from Docker Compose

---

### `architecture/frontend.md`

React PWA architecture. Include:

- Folder roles (`pages`, `features`, `services`, `store`, …) — link to `CLAUDE.md` for rules
- Server state (TanStack Query) vs client state (Zustand) split
- How WebSocket events update the query cache
- API communication via `apiClient` and `ApiResponse` unwrapping
- Routing and auth guarding
- Link to the front-end design skill for visuals

---

### `architecture/backend.md`

Spring Boot service template. Include:

- Layer diagram: Controller → Service (interface + impl) → Repository → DB
- Feature packages vs `shared/`
- `ApiResponse` and error handling flow
- Security: gateway JWT validation → service authorization
- Correlation ID propagation

---

### `architecture/kafka-events.md`

Event backbone. Include:

- Topics and their purpose
- Event catalog table: event type · topic · key · producer · consumers · version
- Event envelope
- Ordering, retry, DLT, idempotency, outbox — what is implemented and where

---

### `architecture/realtime.md`

WebSocket delivery. Include:

- Endpoint, STOMP destinations, pushed event types
- Flow: service → Kafka → Notification Service → WebSocket → client cache update
- Presence model (Redis, TTL)
- Reconnect / missed-event strategy

---

### `architecture/data-storage.md`

Database-per-service. Include:

- Which service owns which MySQL tables / Mongo collections
- Redis key spaces (cache, presence, rate limit) and TTLs
- Migration approach (Flyway for MySQL)

---

### `architecture/infrastructure.md`

- Docker Compose services and how to run locally
- CI/CD pipeline stages
- Deployment targets (VPS, k8s) — current vs planned

---

### Module pages (`modules/*.md`)

Each module page answers:

- Why this module exists (business reason)
- What it owns (responsibilities + data)
- What it exposes (REST endpoints, produced events, WebSocket destinations, exported types)
- What it consumes (events, other services' APIs, external providers)
- Who depends on it
- What does NOT belong here

For services: include key entities/documents and their relationships.
For contract packages: include the contract shape summary and versioning rule.
For `web`: include key features, query hooks, stores, and realtime subscriptions.

---

### Feature pages (`features/*.md`)

Each feature page answers:

- Business purpose (why this feature exists)
- User workflow (what the user does, which screens)
- Data flow: page → feature hook → REST → gateway → service → DB → event → WebSocket
- Business rules (validated facts from the code, not assumptions)
- Realtime effects
- Modules involved
- External integrations (if any)
- Status: Implemented / Partial / Planned

---

## Finish

Report the pages created, which are **Planned** stubs, and any spec gaps found.

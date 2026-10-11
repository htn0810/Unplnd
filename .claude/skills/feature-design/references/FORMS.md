# Planning Document Templates

Use these templates when generating planning documents in `plans/{service}/{feature-slug}/`.
For the full workflow, see [SKILL.md](../SKILL.md).

---

## README.md Template

````markdown
# {Feature Name}

## Idea

> The original thought, in the author's words (1–3 sentences).

## Problem & Value

- Problem: what is annoying / missing today
- Value: what the user or group gets
- Spec link: section in `docs/UNPLND_PROJECT_SPEC.md` (or "not in spec — new idea")

## Scope

| In scope | Out of scope (later) |
|----------|----------------------|

## Open Questions

- (answered questions move into Design Decisions)

## Glossary

| Term | Meaning | Code |
|------|---------|------|

## Components

| Layer    | Component | Purpose |
|----------|-----------|---------|

## Data Flow

> Compact inline tree or arrow notation — web → gateway → service → Kafka → WebSocket

## Design Decisions

| Decision | Alternatives Considered | Rationale |
|----------|-------------------------|-----------|

## Related Plans

- (optional) `plans/{service}/{feature-slug}/` — what is reused

## Documents

- [Scenario Overview](scenario/scenario-00-overview.md)
- [Backend Design](design/design-01-backend.md)
- [Implementation Plan](implementation-plan.md)
````

---

## Scenario Template

````markdown
# Scenario {N}: {Title}

## Goal

> One sentence describing what the user (or group) is trying to achieve.

## Starting State

| #   | Title | Summary |
|-----|-------|---------|

> Include plan status, members, and who is online when relevant.

## Visual State (Before)

> ASCII view of the plan / itinerary / vote board before execution

## Execution Flows

### Flow {N}.1: {Flow Name}

```text
User Action (web)
    ↓
Frontend Validation (zod)
    ↓
REST Request via API Gateway
    ↓
Controller → Service (authorization + lifecycle check)
    ↓
Persistence
    ↓
Kafka Event (topic, key)
    ↓
Notification Service → WebSocket
    ↓
Other members' cache updated
```

## Edge Cases

- Plan in wrong status → 409
- Caller is not a member → 403
- Event delivered twice → no duplicate side effect

## Visual State (After)

> ASCII view after execution, including what other members see
````

---

## Backend Design Document

````markdown
# Backend Design: {Component Name}

## Overview

> Brief description of the backend design: new entities/documents, schema changes, API contract.

## Data Model

### Entity / Document: {Name}

| Field | Type | Purpose |
|-------|------|---------|

### Database Schema (MySQL only)

```sql
CREATE TABLE ...
```

> For MongoDB, describe collections and indexes in a table.

## API Contract

> All responses wrapped in `ApiResponse<T>`. Paths defined in `ApiConstants`.

| Method | Endpoint | Request | Response | Auth / Allowed Status |
|--------|----------|---------|----------|-----------------------|

## Service Layer

| Service (interface) | Method | Purpose |
|---------------------|--------|---------|

## Errors

| Exception | HTTP | When |
|-----------|------|------|

## Design Decisions

| Decision | Rationale |
|----------|-----------|
````

---

## Events Design Document

````markdown
# Events Design: {Component Name}

## Overview

> Which facts are published, who reacts, and what the user sees in realtime.

## Event Catalog

| Event Type | Topic | Key | Version | Producer | Consumers |
|------------|-------|-----|---------|----------|-----------|

## Payload

### {EVENT_TYPE}

| Field | Type | Purpose |
|-------|------|---------|

## Reliability

| Concern     | Decision                                |
|-------------|-----------------------------------------|
| Ordering    | key = planId                            |
| Idempotency | processed eventId store / natural       |
| Retry / DLT | backoff, `{topic}.DLT`                  |
| Outbox      | yes / no — why                          |

## Realtime Delivery

| WebSocket Destination | Pushed Event | Frontend Reaction (query invalidated / patched) |
|-----------------------|--------------|-------------------------------------------------|

## Design Decisions

| Decision | Rationale |
|----------|-----------|
````

---

## Frontend Design Document

````markdown
# Frontend Design: {Component Name}

## Overview

> New pages, feature components, hooks, and state. UI decisions follow the `front-end-design` skill.

## Screens

| Page / Route | Primary Action | Memorable Moment |
|--------------|----------------|------------------|

## Data Model

### Type: {TypeName}

| Field | Type | Purpose |
|-------|------|---------|

## Query Layer

| Hook | Query Key | Endpoint | Invalidated By |
|------|-----------|----------|----------------|

## State Management

| Store | Scope (global / feature) | Responsibility |
|-------|--------------------------|----------------|

## Realtime

| Subscription | Event | Cache Effect |
|--------------|-------|--------------|

## Components

```text
features/{feature}/
├── {Component}.tsx
├── {feature}Service.ts
├── {feature}Queries.ts
├── {feature}Store.ts
├── {feature}Schema.ts
└── index.ts
```

## UI States

| Component | Loading | Empty | Error | Disabled |
|-----------|---------|-------|-------|----------|

## Localization

| Key | EN | VI |
|-----|----|----|

## Design Decisions

| Decision | Rationale |
|----------|-----------|
````

---

## DevOps Design Document

````markdown
# DevOps Design: {Component Name}

## Overview

> Infrastructure changes needed for this feature.

## Changes

| Area           | Change | Reason |
|----------------|--------|--------|
| Gateway route  |        |        |
| Docker Compose |        |        |
| CI             |        |        |
| Config / env   |        |        |

## Design Decisions

| Decision | Rationale |
|----------|-----------|
````

---

## Implementation Plan Template

````markdown
# Implementation Plan: {Feature Name}

## Overview

Brief description of what will be implemented.

## Terminology Lock

All code, fields, API params, event fields, and TS types must use:

- `{term}` (not `{old-term}`)

## Phases Summary

> Keep only rows for the selected tracks. Update Status as phases complete.

| Phase | Name                           | Status |
|-------|--------------------------------|--------|
| E1    | Event Contract                 |        |
| B1    | Entity + Repository            |        |
| B2    | DTOs + Mapper                  |        |
| B3    | Service (interface + impl)     |        |
| B4    | Controller + API Constants     |        |
| E2    | Producer / Consumer            |        |
| E3    | WebSocket Delivery             |        |
| F1    | Types + Service + Schema       |        |
| F2    | Query Hooks + Store            |        |
| F3    | Components                     |        |
| F4    | Page + Route + i18n            |        |
| F5    | Realtime Wiring                |        |
| D1    | Gateway / Compose / CI         |        |

## Event Phases (part 1)

### Phase E1: Event Contract

**Deliverables:**

- [ ] Event schema in `packages/event-contracts/`
- [ ] Event type constant in `shared/constants/EventTypes`

**Verification:** `npm --prefix packages/event-contracts run build` (or schema validation)

**Suggested commit message (for the user — do not run):** `feat(event-contracts): add {EVENT} contract`

---

## Backend Phases

### Phase B1: Entity + Repository

**Deliverables:**

- [ ] `{Entity}.java` — entity / Mongo document with audit fields
- [ ] `{Entity}Repository.java` — `JpaRepository` / `MongoRepository`
- [ ] Flyway migration `V{n}__{desc}.sql` (MySQL only)

**Verification:** `cd {service} && ./gradlew compileJava`

**Suggested commit message (for the user — do not run):** `feat({service}): add {Entity} entity and repository`

---

### Phase B2: DTOs + Mapper

**Deliverables:**

- [ ] `dto/request/{Action}{Entity}Request.java` with Bean Validation
- [ ] `dto/response/{Entity}Response.java`
- [ ] `{Entity}Mapper.java` (MapStruct)

**Verification:** `cd {service} && ./gradlew compileJava`

**Suggested commit message (for the user — do not run):** `feat({service}): add {feature} DTOs and mapper`

---

### Phase B3: Service

**Deliverables:**

- [ ] `{Feature}Service.java` interface
- [ ] `impl/{Feature}ServiceImpl.java` — business rules, authorization, lifecycle checks
- [ ] Custom exceptions + `GlobalExceptionHandler` mapping
- [ ] Unit tests `{Feature}ServiceImplTest`

**Verification:** `cd {service} && ./gradlew test`

**Suggested commit message (for the user — do not run):** `feat({service}): add {feature} service`

---

### Phase B4: Controller + API Constants

**Deliverables:**

- [ ] Paths in `ApiConstants`
- [ ] `{Feature}Controller.java` returning `ApiResponse<T>`
- [ ] `@WebMvcTest` controller test

**Verification:** `cd {service} && ./gradlew build`

**Suggested commit message (for the user — do not run):** `feat({service}): add {feature} REST endpoints`

---

## Event Phases (part 2)

### Phase E2: Producer / Consumer

**Deliverables:**

- [ ] `{Entity}EventProducer` (key = `{planId|userId}`), outbox if critical
- [ ] `{Event}Consumer` — idempotent, retry + DLT
- [ ] Consumer test incl. duplicate delivery (Testcontainers Kafka)

**Verification:** `cd {service} && ./gradlew integrationTest`

**Suggested commit message (for the user — do not run):** `feat({service}): publish and consume {EVENT}`

---

### Phase E3: WebSocket Delivery

**Deliverables:**

- [ ] Notification Service pushes `{EVENT}` to `/topic/plan.{planId}` or `/user/queue/...`

**Verification:** `cd notification-service && ./gradlew build`

**Suggested commit message (for the user — do not run):** `feat(notification-service): push {EVENT} over WebSocket`

---

## Frontend Phases

> UI decisions follow the `front-end-design` skill. Structure and rules follow `CLAUDE.md`.

### Phase F1: Types + Service + Schema

**Deliverables:**

- [ ] `features/{feature}/{feature}Types.ts`
- [ ] `features/{feature}/{feature}Service.ts` (via `services/apiClient.ts`)
- [ ] `features/{feature}/{feature}Schema.ts` (zod)

**Verification:** `npm --prefix webapp run typecheck`

**Suggested commit message (for the user — do not run):** `feat(web): add {feature} service layer`

---

### Phase F2: Query Hooks + Store

**Deliverables:**

- [ ] `features/{feature}/{feature}Queries.ts` — key factory, query + mutation hooks, invalidation
- [ ] `features/{feature}/{feature}Store.ts` (only if client state is needed)

**Verification:** `npm --prefix webapp run typecheck && npm --prefix webapp run test`

**Suggested commit message (for the user — do not run):** `feat(web): add {feature} query hooks`

---

### Phase F3: Components

**Deliverables:**

- [ ] Feature components built on shadcn/ui + Tailwind
- [ ] Loading / empty / error / disabled states
- [ ] Component tests (RTL)

**Verification:** `npm --prefix webapp run lint && npm --prefix webapp run test`

**Suggested commit message (for the user — do not run):** `feat(web): add {feature} components`

---

### Phase F4: Page + Route + i18n

**Deliverables:**

- [ ] `pages/{Feature}Page.tsx`
- [ ] Route in `routes/`
- [ ] EN + VI keys in `i18n/`

**Verification:** `npm --prefix webapp run build`

**Suggested commit message (for the user — do not run):** `feat(web): add {feature} page`

---

### Phase F5: Realtime Wiring

**Deliverables:**

- [ ] WebSocket subscription → query invalidation / patch

**Verification:** `npm --prefix webapp run typecheck && npm --prefix webapp run test`

**Suggested commit message (for the user — do not run):** `feat(web): wire {feature} realtime updates`

---

## DevOps Phases

### Phase D1: Gateway / Compose / CI

**Deliverables:**

- [ ] Gateway route
- [ ] Docker Compose service / env
- [ ] CI job

**Verification:** `docker compose -f infrastructure/docker/docker-compose.yml config --quiet`

**Suggested commit message (for the user — do not run):** `chore(infrastructure): add {feature} infrastructure`

---

## Post-Implementation Checklist

- [ ] Update `plans/{service}/{feature-slug}/` docs to reflect any naming changes
- [ ] Verify no terminology drift: `grep -rn "{old-term}" services webapp packages --include="*.java" --include="*.ts" --include="*.tsx"`
- [ ] Run `update-wiki` skill if architecture, contracts, or business rules changed
- [ ] PR description references planning docs
````

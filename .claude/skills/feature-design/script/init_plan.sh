#!/usr/bin/env bash
# init_plan.sh — Scaffold the plans/{service}/{feature-slug}/ directory structure for UNPLND
#
# Features start from an idea (no ticket). The feature slug identifies the plan.
#
# Usage:
#   init_plan.sh <feature-slug> <service> [tracks]
#
#   feature-slug: kebab-case, e.g. realtime-voting
#   service:      web | api-gateway | identity-service | profile-service | plan-service | place-service |
#                 notification-service | event-contracts | api-contracts | infrastructure
#   tracks:       comma-separated list of: backend,frontend,events,devops  (default: backend,frontend)
#
# Examples:
#   init_plan.sh realtime-voting plan-service                         # backend + frontend (default)
#   init_plan.sh realtime-voting plan-service backend,frontend,events
#   init_plan.sh vibe-picker     web          frontend
#   init_plan.sh kafka-ui        infrastructure devops
#
# Creates:
#   plans/{service}/{feature-slug}/
#   ├── README.md
#   ├── scenario/
#   │   └── scenario-00-overview.md
#   ├── design/
#   │   ├── design-0N-backend.md        (if backend track)
#   │   ├── design-0N-events.md         (if events track)
#   │   ├── design-0N-frontend.md       (if frontend track)
#   │   └── design-0N-devops.md         (if devops track)
#   └── implementation-plan.md

set -euo pipefail

SLUG="${1:-}"
SERVICE="${2:-}"
TRACKS="${3:-backend,frontend}"

VALID_SERVICES="web api-gateway identity-service profile-service plan-service place-service notification-service event-contracts api-contracts infrastructure"

usage() {
  echo "Usage: $0 <feature-slug> <service> [tracks]"
  echo "  service: ${VALID_SERVICES// / | }"
  echo "  tracks:  comma-separated list of: backend,frontend,events,devops  (default: backend,frontend)"
  echo ""
  echo "  e.g.: $0 realtime-voting plan-service backend,frontend,events"
  exit 1
}

[[ -z "$SLUG" || -z "$SERVICE" ]] && usage

if [[ ! "$SLUG" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
  echo "Invalid feature slug: '${SLUG}'. Use kebab-case, e.g. realtime-voting."
  exit 1
fi

# Human-readable title from slug: realtime-voting -> Realtime Voting
TITLE="$(echo "$SLUG" | awk -F- '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) substr($i,2)} 1' OFS=' ')"

SERVICE_VALID=false
for s in $VALID_SERVICES; do
  [[ "$SERVICE" == "$s" ]] && SERVICE_VALID=true && break
done
if [[ "$SERVICE_VALID" == "false" ]]; then
  echo "Unknown service: '${SERVICE}'. Valid services: ${VALID_SERVICES}"
  exit 1
fi

HAS_BACKEND=false
HAS_FRONTEND=false
HAS_EVENTS=false
HAS_DEVOPS=false

IFS=',' read -ra TRACK_LIST <<< "$TRACKS"
for track in "${TRACK_LIST[@]}"; do
  case "$track" in
    backend)  HAS_BACKEND=true ;;
    frontend) HAS_FRONTEND=true ;;
    events)   HAS_EVENTS=true ;;
    devops)   HAS_DEVOPS=true ;;
    *)
      echo "Unknown track: ${track}. Valid tracks: backend, frontend, events, devops"
      exit 1
      ;;
  esac
done

PLAN_DIR="plans/${SERVICE}/${SLUG}"

if [[ -d "$PLAN_DIR" ]]; then
  echo "Directory ${PLAN_DIR}/ already exists. Aborting."
  exit 1
fi

mkdir -p "${PLAN_DIR}/scenario" "${PLAN_DIR}/design"

# ── Design file names (order: backend, events, frontend, devops) ─────────────
DESIGN_LINKS=""
IMPL_TRACK_LABELS=""
COMP_ROWS=""
PHASE_ROWS=""
FILE_NUM=1

if [[ "$HAS_BACKEND" == "true" ]]; then
  BACKEND_FILE="design-0${FILE_NUM}-backend.md"; FILE_NUM=$((FILE_NUM + 1))
  DESIGN_LINKS+="- [Backend Design](design/${BACKEND_FILE})\n"
  IMPL_TRACK_LABELS+=" Backend"
  COMP_ROWS+="| Entity     |           |         |\n| Service    |           |         |\n| Controller |           |         |\n"
fi
if [[ "$HAS_EVENTS" == "true" ]]; then
  EVENTS_FILE="design-0${FILE_NUM}-events.md"; FILE_NUM=$((FILE_NUM + 1))
  DESIGN_LINKS+="- [Events Design](design/${EVENTS_FILE})\n"
  IMPL_TRACK_LABELS+=" Events"
  COMP_ROWS+="| Event      |           |         |\n| Consumer   |           |         |\n"
fi
if [[ "$HAS_FRONTEND" == "true" ]]; then
  FRONTEND_FILE="design-0${FILE_NUM}-frontend.md"; FILE_NUM=$((FILE_NUM + 1))
  DESIGN_LINKS+="- [Frontend Design](design/${FRONTEND_FILE})\n"
  IMPL_TRACK_LABELS+=" Frontend"
  COMP_ROWS+="| Feature    |           |         |\n| Page       |           |         |\n"
fi
if [[ "$HAS_DEVOPS" == "true" ]]; then
  DEVOPS_FILE="design-0${FILE_NUM}-devops.md"; FILE_NUM=$((FILE_NUM + 1))
  DESIGN_LINKS+="- [DevOps Design](design/${DEVOPS_FILE})\n"
  IMPL_TRACK_LABELS+=" DevOps"
  COMP_ROWS+="| Infra      |           |         |\n"
fi

# Phase summary rows in execution order: contracts → backend → events → frontend → devops
[[ "$HAS_EVENTS" == "true" ]]   && PHASE_ROWS+="| E1    | Event Contract             |        |\n"
[[ "$HAS_BACKEND" == "true" ]]  && PHASE_ROWS+="| B1    | Entity + Repository        |        |\n| B2    | DTOs + Mapper              |        |\n| B3    | Service (interface + impl) |        |\n| B4    | Controller + API Constants |        |\n"
[[ "$HAS_EVENTS" == "true" ]]   && PHASE_ROWS+="| E2    | Producer / Consumer        |        |\n| E3    | WebSocket Delivery         |        |\n"
[[ "$HAS_FRONTEND" == "true" ]] && PHASE_ROWS+="| F1    | Types + Service + Schema   |        |\n| F2    | Query Hooks + Store        |        |\n| F3    | Components                 |        |\n| F4    | Page + Route + i18n        |        |\n| F5    | Realtime Wiring            |        |\n"
[[ "$HAS_DEVOPS" == "true" ]]   && PHASE_ROWS+="| D1    | Gateway / Compose / CI     |        |\n"

# ── README.md ────────────────────────────────────────────────────────────────
cat > "${PLAN_DIR}/README.md" << EOF
# ${TITLE}

## Idea

> TODO: The original thought, in the author's words (1–3 sentences).

## Problem & Value

- Problem: TODO
- Value: TODO
- Spec link: TODO — section in \`docs/UNPLND_PROJECT_SPEC.md\` (or "not in spec — new idea")

## Scope

| In scope | Out of scope (later) |
|----------|----------------------|
| TODO     |                      |

## Open Questions

- TODO: question — proposed default

## Glossary

| Term  | Meaning    | Maps To (code) |
|-------|------------|----------------|
| term1 | definition | field/class    |

## Components

| Layer      | Component | Purpose |
|------------|-----------|---------|
$(printf '%b' "$COMP_ROWS")

## Data Flow

\`\`\`text
TODO: web → gateway → ${SERVICE} → persistence → Kafka → WebSocket
\`\`\`

## Design Decisions

| Decision | Alternatives Considered | Rationale |
|----------|-------------------------|-----------|
|          |                         |           |

## Documents

- [Scenario Overview](scenario/scenario-00-overview.md)
$(printf '%b' "$DESIGN_LINKS")
- [Implementation Plan](implementation-plan.md)
EOF

# ── scenario-00-overview.md ───────────────────────────────────────────────────
cat > "${PLAN_DIR}/scenario/scenario-00-overview.md" << EOF
# Scenarios: ${TITLE} Overview

## Scenario List

| # | Title          | Description                  |
|---|----------------|------------------------------|
| 0 | Default state  | State before the feature     |
| 1 | {Happy path}   | Main user / group flow       |
| 2 | {Edge case}    | Wrong status / non-member    |

---

# Scenario 0: Default State

## Starting State

- TODO: Plan status, members, who is online
- TODO: What the user sees

## Visual State (Before)

\`\`\`text
TODO: ASCII diagram
\`\`\`

## Available Actions

| Action | Who (creator / member) | Allowed Status | Flow |
|--------|------------------------|----------------|------|
|        |                        |                |      |

## Edge Cases

- TODO: Plan in wrong status → 409
- TODO: Caller is not a member → 403
- TODO: Duplicate event delivery → no duplicate side effect
- TODO: Member offline while event is pushed
EOF

# ── design-0N-backend.md ────────────────────────────────────────────────────
if [[ "$HAS_BACKEND" == "true" ]]; then
cat > "${PLAN_DIR}/design/${BACKEND_FILE}" << EOF
# Backend Design: ${TITLE}

## Data Model

### Entity / Document: {Name}

| Field | Type | Purpose |
|-------|------|---------|
|       |      |         |

## API Contract

> Responses wrapped in \`ApiResponse<T>\`. Paths defined in \`ApiConstants\`.

| Method | Endpoint | Request | Response | Auth / Allowed Status |
|--------|----------|---------|----------|-----------------------|
|        |          |         |          |                       |

## Service Layer

| Service (interface) | Method | Purpose |
|---------------------|--------|---------|
|                     |        |         |

## Errors

| Exception | HTTP | When |
|-----------|------|------|
|           |      |      |

## Design Decisions

| Decision | Rationale |
|----------|-----------|
|          |           |
EOF
fi

# ── design-0N-events.md ─────────────────────────────────────────────────────
if [[ "$HAS_EVENTS" == "true" ]]; then
cat > "${PLAN_DIR}/design/${EVENTS_FILE}" << EOF
# Events Design: ${TITLE}

## Event Catalog

| Event Type | Topic | Key | Version | Producer | Consumers |
|------------|-------|-----|---------|----------|-----------|
|            |       |     |         |          |           |

## Payload

### {EVENT_TYPE}

| Field | Type | Purpose |
|-------|------|---------|
|       |      |         |

## Reliability

| Concern     | Decision |
|-------------|----------|
| Ordering    |          |
| Idempotency |          |
| Retry / DLT |          |
| Outbox      |          |

## Realtime Delivery

| WebSocket Destination | Pushed Event | Frontend Reaction |
|-----------------------|--------------|-------------------|
|                       |              |                   |

## Design Decisions

| Decision | Rationale |
|----------|-----------|
|          |           |
EOF
fi

# ── design-0N-frontend.md ───────────────────────────────────────────────────
if [[ "$HAS_FRONTEND" == "true" ]]; then
cat > "${PLAN_DIR}/design/${FRONTEND_FILE}" << EOF
# Frontend Design: ${TITLE}

> UI decisions follow the \`front-end-design\` skill. Structure and rules follow \`CLAUDE.md\`.

## Screens

| Page / Route | Primary Action | Memorable Moment |
|--------------|----------------|------------------|
|              |                |                  |

## Query Layer

| Hook | Query Key | Endpoint | Invalidated By |
|------|-----------|----------|----------------|
|      |           |          |                |

## State Management

| Store | Scope (global / feature) | Responsibility |
|-------|--------------------------|----------------|
|       |                          |                |

## Realtime

| Subscription | Event | Cache Effect |
|--------------|-------|--------------|
|              |       |              |

## Components

\`\`\`text
features/{feature}/
├── {Component}.tsx
├── {feature}Service.ts
├── {feature}Queries.ts
├── {feature}Store.ts
├── {feature}Schema.ts
└── index.ts
\`\`\`

## UI States

| Component | Loading | Empty | Error | Disabled |
|-----------|---------|-------|-------|----------|
|           |         |       |       |          |

## Localization

| Key | EN | VI |
|-----|----|----|
|     |    |    |
EOF
fi

# ── design-0N-devops.md ─────────────────────────────────────────────────────
if [[ "$HAS_DEVOPS" == "true" ]]; then
cat > "${PLAN_DIR}/design/${DEVOPS_FILE}" << EOF
# DevOps Design: ${TITLE}

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
|          |           |
EOF
fi

# ── implementation-plan.md ──────────────────────────────────────────────────
SVC_DIR="${SERVICE}"
{
cat << EOF
# Implementation Plan: ${TITLE}

## Overview

TODO: Brief description of what will be implemented.

## Terminology Lock

All code, fields, API params, event fields, and TS types must use:

- \`TODO\` (not TODO_old_name)

> Lock this in before writing any code.

## Phases Summary

| Phase | Name                       | Status |
|-------|----------------------------|--------|
$(printf '%b' "$PHASE_ROWS")
EOF

if [[ "$HAS_EVENTS" == "true" ]]; then
cat << EOF

## Event Phases (part 1)

### Phase E1: Event Contract

**Deliverables:**

- [ ] Event schema in \`packages/event-contracts/\`
- [ ] Event type constant in \`shared/constants/EventTypes\`

**Verification:** \`npm --prefix packages/event-contracts run build\`

**Suggested commit message (for the user — do not run):** \`feat(event-contracts): add {EVENT} contract\`

---
EOF
fi

if [[ "$HAS_BACKEND" == "true" ]]; then
cat << EOF

## Backend Phases

### Phase B1: Entity + Repository

**Deliverables:**

- [ ] \`{Entity}.java\` — entity / Mongo document with audit fields
- [ ] \`{Entity}Repository.java\`
- [ ] Flyway migration (MySQL only)

**Verification:** \`cd ${SVC_DIR} && ./gradlew compileJava\`

**Suggested commit message (for the user — do not run):** \`feat(${SERVICE}): add {Entity} entity and repository\`

---

### Phase B2: DTOs + Mapper

**Deliverables:**

- [ ] \`dto/request/{Action}{Entity}Request.java\` with Bean Validation
- [ ] \`dto/response/{Entity}Response.java\`
- [ ] \`{Entity}Mapper.java\`

**Verification:** \`cd ${SVC_DIR} && ./gradlew compileJava\`

**Suggested commit message (for the user — do not run):** \`feat(${SERVICE}): add ${SLUG} DTOs and mapper\`

---

### Phase B3: Service

**Deliverables:**

- [ ] \`{Feature}Service.java\` interface
- [ ] \`impl/{Feature}ServiceImpl.java\` — business rules, authorization, lifecycle checks
- [ ] Custom exceptions + \`GlobalExceptionHandler\` mapping
- [ ] Unit tests

**Verification:** \`cd ${SVC_DIR} && ./gradlew test\`

**Suggested commit message (for the user — do not run):** \`feat(${SERVICE}): add ${SLUG} service\`

---

### Phase B4: Controller + API Constants

**Deliverables:**

- [ ] Paths in \`ApiConstants\`
- [ ] \`{Feature}Controller.java\` returning \`ApiResponse<T>\`
- [ ] \`@WebMvcTest\` controller test

**Verification:** \`cd ${SVC_DIR} && ./gradlew build\`

**Suggested commit message (for the user — do not run):** \`feat(${SERVICE}): add ${SLUG} REST endpoints\`

---
EOF
fi

if [[ "$HAS_EVENTS" == "true" ]]; then
cat << EOF

## Event Phases (part 2)

### Phase E2: Producer / Consumer

**Deliverables:**

- [ ] \`{Entity}EventProducer\` (key = planId / userId), outbox if critical
- [ ] \`{Event}Consumer\` — idempotent, retry + DLT
- [ ] Consumer test incl. duplicate delivery

**Verification:** \`cd ${SVC_DIR} && ./gradlew integrationTest\`

**Suggested commit message (for the user — do not run):** \`feat(${SERVICE}): publish and consume {EVENT}\`

---

### Phase E3: WebSocket Delivery

**Deliverables:**

- [ ] Notification Service pushes {EVENT} to \`/topic/plan.{planId}\` or \`/user/queue/...\`

**Verification:** \`cd notification-service && ./gradlew build\`

**Suggested commit message (for the user — do not run):** \`feat(notification-service): push {EVENT} over WebSocket\`

---
EOF
fi

if [[ "$HAS_FRONTEND" == "true" ]]; then
cat << EOF

## Frontend Phases

> UI decisions follow the \`front-end-design\` skill. Structure and rules follow \`CLAUDE.md\`.

### Phase F1: Types + Service + Schema

**Deliverables:**

- [ ] \`features/{feature}/{feature}Types.ts\`
- [ ] \`features/{feature}/{feature}Service.ts\`
- [ ] \`features/{feature}/{feature}Schema.ts\`

**Verification:** \`npm --prefix webapp run typecheck\`

**Suggested commit message (for the user — do not run):** \`feat(web): add ${SLUG} service layer\`

---

### Phase F2: Query Hooks + Store

**Deliverables:**

- [ ] \`features/{feature}/{feature}Queries.ts\` — key factory, hooks, invalidation
- [ ] \`features/{feature}/{feature}Store.ts\` (only if client state is needed)

**Verification:** \`npm --prefix webapp run typecheck && npm --prefix webapp run test\`

**Suggested commit message (for the user — do not run):** \`feat(web): add ${SLUG} query hooks\`

---

### Phase F3: Components

**Deliverables:**

- [ ] Feature components on shadcn/ui + Tailwind
- [ ] Loading / empty / error / disabled states
- [ ] Component tests

**Verification:** \`npm --prefix webapp run lint && npm --prefix webapp run test\`

**Suggested commit message (for the user — do not run):** \`feat(web): add ${SLUG} components\`

---

### Phase F4: Page + Route + i18n

**Deliverables:**

- [ ] \`pages/{Feature}Page.tsx\`
- [ ] Route in \`routes/\`
- [ ] EN + VI keys in \`i18n/\`

**Verification:** \`npm --prefix webapp run build\`

**Suggested commit message (for the user — do not run):** \`feat(web): add ${SLUG} page\`

---

### Phase F5: Realtime Wiring

**Deliverables:**

- [ ] WebSocket subscription → query invalidation / patch

**Verification:** \`npm --prefix webapp run typecheck && npm --prefix webapp run test\`

**Suggested commit message (for the user — do not run):** \`feat(web): wire ${SLUG} realtime updates\`

---
EOF
fi

if [[ "$HAS_DEVOPS" == "true" ]]; then
cat << EOF

## DevOps Phases

### Phase D1: Gateway / Compose / CI

**Deliverables:**

- [ ] Gateway route
- [ ] Docker Compose service / env
- [ ] CI job

**Verification:** \`docker compose -f infrastructure/docker/docker-compose.yml config --quiet\`

**Suggested commit message (for the user — do not run):** \`chore(infrastructure): add ${SLUG} infrastructure\`

---
EOF
fi

cat << EOF

## Post-Implementation Checklist

- [ ] Update \`${PLAN_DIR}/\` docs to reflect any naming changes
- [ ] Verify no terminology drift: \`grep -rn "{old-term}" services webapp packages --include="*.java" --include="*.ts" --include="*.tsx"\`
- [ ] Run \`update-wiki\` skill if architecture, contracts, or business rules changed
- [ ] PR description references planning docs
EOF
} > "${PLAN_DIR}/implementation-plan.md"

echo ""
echo "Scaffolded: ${PLAN_DIR}/ (service: ${SERVICE}, tracks: ${TRACKS})"
echo "   ├── README.md"
echo "   ├── scenario/scenario-00-overview.md"
[[ "$HAS_BACKEND" == "true" ]]  && echo "   ├── design/${BACKEND_FILE}"
[[ "$HAS_EVENTS" == "true" ]]   && echo "   ├── design/${EVENTS_FILE}"
[[ "$HAS_FRONTEND" == "true" ]] && echo "   ├── design/${FRONTEND_FILE}"
[[ "$HAS_DEVOPS" == "true" ]]   && echo "   ├── design/${DEVOPS_FILE}"
echo "   └── implementation-plan.md  (tracks:${IMPL_TRACK_LABELS})"

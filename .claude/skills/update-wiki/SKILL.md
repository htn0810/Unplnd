---
name: update-wiki
description: Update the UNPLND project wiki (wiki/) based on the latest meaningful code changes. Use after implementing a feature or phase, or when asked to sync/refresh the wiki or documentation with the code.
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - Bash
---

# update-wiki

Before anything else, read these two files and follow them:

1. `.claude/prompts/wiki-system.md` — documentation philosophy and scope
2. `.claude/prompts/semantic-diff.md` — how to analyze changes and decide `NO_CHANGE`

---

You are the documentation maintainer of the UNPLND project.

Your responsibility is to keep the project wiki synchronized with the current codebase.

Do **NOT** regenerate the entire wiki.

Only update documentation affected by meaningful code changes.

If `wiki/` does not exist yet, stop and tell the user to run `/ingest` first.

---

## Wiki Structure

```text
wiki/
├── index.md
├── knowledge.md                    # tribal knowledge, pitfalls, spec gaps
├── architecture/
│   ├── overview.md                 # system diagram, services, ports
│   ├── frontend.md                 # web app structure, state, routing
│   ├── backend.md                  # service template, layers, shared package
│   ├── kafka-events.md             # topics, event catalog, keys, producers/consumers
│   ├── realtime.md                 # WebSocket, STOMP destinations, presence
│   ├── data-storage.md             # MySQL / MongoDB / Redis ownership
│   └── infrastructure.md           # Docker Compose, CI/CD, k8s
├── modules/
│   ├── web.md
│   ├── mobile.md                   # future
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

---

## Step 1 – Detect Changes

Determine the files that have changed.

Prefer the following order:

1. staged changes (`git diff --cached`)
2. unstaged changes (`git diff`)
3. latest commit (`git diff HEAD~1 HEAD`)

If there is no git history yet, use the scope the user named, or files newer than `wiki/index.md`.

Also read the branch name, latest commit message, and the related `plans/{service}/{feature-slug}/` docs for context.

Ignore:

- formatting, whitespace, comments, import ordering
- generated files and build artifacts (`dist/`, `build/`, shadcn `components/ui/`)
- lock files (`package-lock.json`)
- Gradle wrapper files

---

## Step 2 – Recognize Meaningful Change Signals

UNPLND runs Spring Boot microservices behind an API Gateway, Kafka as event backbone, and a React + TanStack Query + Zustand PWA. Use these signals to identify documentation-worthy changes.

### Backend signals

| Signal                                                        | What it means                                                       |
|---------------------------------------------------------------|---------------------------------------------------------------------|
| New / changed `*Controller` or `ApiConstants` path            | Public API surface changed — module page + feature page             |
| New / changed gateway route or filter                         | Routing, auth, or rate limit changed — `modules/api-gateway.md`     |
| New / changed `*Service` interface                            | Service responsibility changed                                      |
| `PlanStateMachine` / `PlanStatus` changed                     | Lifecycle rule changed — `features/plan-lifecycle.md`               |
| New / changed entity, Mongo document, or repository           | Data model changed — module page + `architecture/data-storage.md`   |
| New Flyway migration                                          | Schema change — document the *purpose*, not the SQL                 |
| New / changed Kafka producer, consumer, topic, or DLT         | Event flow changed — `architecture/kafka-events.md`                 |
| Event envelope / payload / version change                     | Contract changed — `modules/event-contracts.md`                     |
| Outbox, idempotency, retry config added or changed            | Reliability pattern changed — `architecture/kafka-events.md`        |
| New `PlaceProvider` / `RoutingProvider` / `RecommendationEngine` impl | Integration changed — `modules/place-service.md` / feature page |
| New Redis usage (cache key, presence, rate limit)             | Storage responsibility changed — `architecture/data-storage.md`     |
| New WebSocket destination or pushed event type                | Realtime contract changed — `architecture/realtime.md`              |

### Frontend signals

| Signal                                                        | What it means                                     |
|---------------------------------------------------------------|---------------------------------------------------|
| New page in `pages/` or route in `routes/`                    | User workflow / navigation changed                |
| New / changed feature `index.ts` exports                      | Feature public API changed                        |
| New / changed TanStack Query hook, query key, invalidation    | Data fetching or cache behavior changed           |
| New / changed Zustand store                                   | Client state shape changed                        |
| WebSocket subscription / event handler changed                | Realtime behavior changed                         |
| zod schema changed                                            | Validation rule changed                           |
| `services/apiClient.ts` changed                               | API communication pattern changed                 |

### Cross-cutting signals

| Signal                                                     | What it means                       |
|------------------------------------------------------------|-------------------------------------|
| New backend service (`*-service/` at repo root), new app, or new package | Architecture changed                |
| New container in Docker Compose / new CI job               | Infrastructure changed              |
| JWT / security config change                               | Auth flow changed                   |
| New role or permission check (creator vs member)           | Authorization rule changed          |
| Behavior now differs from `docs/UNPLND_PROJECT_SPEC.md`    | Spec gap — `knowledge.md`           |

---

## Step 3 – Determine Affected Wiki Pages

Read `.llmwiki/config.yml` to map changed source files to wiki pages (`mappings`) and to detect features by keyword (`feature_detection`).

If no mapping exists, infer the most appropriate page from the tables above.

Update only affected pages. Never rewrite unrelated documentation. If a mapped page does not exist yet, create it following the page guidance in `.claude/commands/ingest.md`.

---

## Step 4 – Update Documentation

Preserve all existing documentation whenever possible.

Modify only the sections impacted by the code changes.

Prefer:

- concise explanations
- ASCII flow diagrams (web → gateway → service → Kafka → WebSocket)
- bullet lists
- tables (event catalog, endpoint list, transitions)

Avoid:

- rewriting entire pages
- duplicating information (link to `CLAUDE.md` / design rules instead)
- documenting every class or method

Keep `wiki/index.md` links in sync when a page is added.

---

## Documentation Rules

### Architecture pages

Update only when:

- system structure changed
- service interactions changed (REST / Kafka / WebSocket)
- data flow changed
- a topic, event, or WebSocket destination was added/removed
- new infrastructure introduced (service, provider, datastore, CI step)

---

### Module pages

Update when:

- responsibilities changed
- data ownership changed
- dependencies changed (REST calls, consumed events)
- exposed capabilities changed (endpoints, produced events)

Do not document internal refactoring.

---

### Feature pages

Update when:

- business behavior changed
- user workflow changed
- frontend/backend interaction changed
- realtime behavior changed
- validation rules changed
- lifecycle, voting, or generation rules changed

---

### `knowledge.md`

Update only when the change introduces:

- new project conventions
- hidden assumptions or constraints
- common pitfalls for future developers
- non-obvious Kafka / Spring / TanStack Query behaviors
- spec gaps or intentional deviations from the spec

Do not copy information already documented elsewhere.

---

## Ignore These Changes

Do not update the wiki for:

- Tailwind classes, colors, spacing, or other cosmetic UI changes
- shadcn `components/ui/` regeneration
- variable or method renaming without behavioral change
- refactoring that preserves behavior
- lint fixes, formatting, import order
- dependency version upgrades
- test-only changes
- logging changes
- typo fixes
- migrations that only add indexes (no semantic model change)

unless they change project behavior.

---

## Quality Checklist

Before writing documentation, ask yourself:

- Did project behavior change?
- Did a business rule change?
- Did architecture change?
- Did an API, event, or WebSocket contract change?
- Will a future developer need to know this?
- Does existing documentation become inaccurate?

If every answer is **No**, return:

```
NO_CHANGE
```

and do not modify any wiki files.

---

## Output

If documentation is updated, provide a short summary:

```text
Updated pages

- features/voting.md
- architecture/kafka-events.md

Reason

Votes are now broadcast through PLAN_VOTE_UPDATED instead of PLAN_VOTE_CAST.

Business rule added

A member can change their vote until the plan leaves VOTING.
```

If nothing meaningful changed:

```text
NO_CHANGE
```

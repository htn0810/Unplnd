---
name: feature-design
description: Turn an UNPLND feature idea (a free-form thought, no ticket) into a plan and implement it. Use when the user describes an idea or feature they want to build, or asks to plan, scaffold, or implement a feature in plans/{service}/{feature-slug}/ with track-based phases (backend, frontend, events, devops) and verification.
---

# Feature Design

Use these resources:

- [Templates](references/FORMS.md)
- [Guidelines](references/REFERENCE.md)
- [Scaffold script](script/init_plan.sh)

Project rules live in `CLAUDE.md` (module layout, BE/FE rules) and `docs/UNPLND_PROJECT_SPEC.md` (product behavior). Plans must follow them — never contradict them silently.

Features start from the user's **idea**, not a ticket. The idea is shaped into a scoped plan, identified by a **feature slug**.

## Rules

- Read existing code, `CLAUDE.md`, and the relevant spec section first.
- Use short, clear English.
- Reuse existing names and patterns. Use the glossary terms from `CLAUDE.md` (Plan, Plan Member, Vibe, Itinerary, Activity, Constraint, …).
- Keep the user's original idea visible in the plan; do not inflate scope.
- Ask only questions that change the design. Propose a default for each.
- Implement one phase at a time.
- Verify at the end of every phase.
- **Never run `git commit`, `git add`, `git stash`, or `git reset`.** The user reviews and commits their own
  code. Leave every change unstaged in the working tree and report what changed instead.

## Plan a Feature

### 1. Capture the Idea

Take the user's thought as-is. Then derive:

| Item         | How                                                                          |
|--------------|------------------------------------------------------------------------------|
| Feature name | Short title, e.g. "Realtime Voting"                                          |
| Feature slug | kebab-case, 2–4 words, e.g. `realtime-voting`                                |
| Service      | The service owning the business rule (see REFERENCE → Choosing the Owning Service) |
| Tracks       | `backend`, `frontend`, `events`, `devops` — only what the idea needs         |

| Track      | Covers                                                                  |
|------------|-------------------------------------------------------------------------|
| `backend`  | Spring Boot service code: entity, repository, DTO, service, controller  |
| `frontend` | `webapp`: types, service, query hooks, store, components, pages         |
| `events`   | Kafka contracts, producers, consumers, DLT, idempotency, WebSocket push |
| `devops`   | Docker Compose, gateway routes, CI, k8s, monitoring                     |

Supported services: `web`, `api-gateway`, `identity-service`, `profile-service`, `plan-service`, `place-service`, `notification-service`, `event-contracts`, `api-contracts`, `infrastructure`.

### 2. Shape the Idea

Follow REFERENCE → **Turning an Idea into a Plan**:

- Restate the idea in one sentence using glossary terms.
- State problem and value.
- Find the matching spec section, or mark it as a new idea. Flag conflicts with the spec.
- Split scope: smallest useful version (in) vs later (out).
- List open questions that block the design, each with a proposed default.

Present this short summary (idea, slug, service, tracks, scope, open questions) to the user and get a go-ahead before scaffolding. Skip the confirmation only if the user already said to proceed.

### 3. Explore

Read relevant code. Identify existing patterns, owned data, APIs (`ApiConstants`), events, frontend features, query keys, stores, tests, and verification commands. Read `wiki/` pages for the affected modules/features when they exist. Do not plan from assumptions.

### 4. Check Related Plans

Search `plans/` for related features (by slug, service, and keywords).

When one exists:

- Read its `README.md` and relevant designs.
- Reuse its terminology and decisions.
- Add a concise `Related Plans` section to the new README.

### 5. Scaffold

```bash
# Default: backend + frontend
bash .claude/skills/feature-design/script/init_plan.sh {feature-slug} {service}

# Selected tracks
bash .claude/skills/feature-design/script/init_plan.sh {feature-slug} {service} frontend
bash .claude/skills/feature-design/script/init_plan.sh {feature-slug} {service} backend,frontend,events
```

The script creates:

```text
plans/{service}/{feature-slug}/
├── README.md
├── scenario/scenario-00-overview.md
├── design/design-0N-{track}.md
└── implementation-plan.md
```

### 6. Fill Documents

Use `references/FORMS.md`.

- Write the **Idea**, **Problem & Value**, **Scope**, and **Open Questions** in `README.md` first.
- Lock terminology in `README.md`.
- Clarify domain, API, events, realtime, frontend, and cross-cutting requirements (auth, lifecycle state, idempotency).
- Add scenarios for happy paths and edge cases (wrong plan state, non-member, duplicate event, offline member).
- Write only designs for selected tracks.
- For `frontend`, follow the `front-end-design` skill for UI decisions.
- Split implementation into ordered phases.
- Add deliverables and a verification command to every phase.
- Add a suggested Conventional Commit message to every phase, for the user to use when they commit. Never act on it.

#### Code Block Policy

Only these are allowed in plan documents as fenced code blocks:

| Allowed                      | Example                                             |
|------------------------------|-----------------------------------------------------|
| SQL scripts / migrations     | `CREATE TABLE`, `ALTER TABLE`, `CREATE INDEX`       |
| Class / interface names only | `interface VoteService` — no fields or methods      |
| Algorithms and pseudocode    | step-by-step logic, decision trees, state machines  |
| Formulas                     | `estimatedCost = Σ activity.cost × groupSize`       |
| ASCII flows / trees          | web → gateway → service → Kafka → WebSocket         |

**Not allowed:** Java/TypeScript class bodies with fields or methods, JSON event payloads, Mongo documents, YAML/properties configuration, framework annotations, or any code that duplicates what belongs in the source files. Use tables or prose instead to describe fields, request/response shapes, event payloads, and configuration.

## Implement a Feature

Before starting, read the plan's `README.md` and `implementation-plan.md`, `git status`, and recent commits. Resume from the first incomplete phase.

Changes accumulate in the working tree across phases. Do not commit between phases, and do not clean, stash or
reset the tree to separate them — the user decides how the work enters history.

For each phase:

1. Announce the phase and deliverables.
2. Read existing patterns in the affected module.
3. Implement only that phase, following `CLAUDE.md` rules.
4. Run focused tests and the phase verification command.
5. Stop if verification fails.
6. Update the phase status and affected planning documents.
7. Report what changed and what passed, then continue to the next phase.

If the idea evolves during implementation, update **Scope** and **Design Decisions** in the README before changing direction.

Use these baseline checks when applicable:

```bash
# Backend (from the repo root — single Gradle wrapper)
./gradlew :{service}:build --console=plain

# Frontend (from repo root)
npm --prefix webapp run typecheck && npm --prefix webapp run lint && npm --prefix webapp run test

# Infrastructure
docker compose -f infrastructure/docker/docker-compose.yml config --quiet
```

## Finish

- Confirm implementation matches the plan's scope.
- Move leftover ideas to **Scope → Out of scope (later)**.
- Update final terminology and file references in planning docs.
- Run relevant full tests.
- Suggest running the `update-wiki` skill if architecture, contracts, or business rules changed.
- Report the result and hand the working tree to the user for review. Do not commit.

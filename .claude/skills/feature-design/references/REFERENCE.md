# Planning Skill — Reference

Detailed guidelines, conventions, and examples for the planning skill.
For the workflow, see [SKILL.md](../SKILL.md). For document templates, see [FORMS.md](FORMS.md).

---

## Markdown Formatting

Planning docs must render correctly in both GitHub and IntelliJ. Two common issues and their fixes:

### Markdown Tables

**Rule:** Separator dashes must span the full cell width (content + 2 padding spaces). IntelliJ warns
*"Table is not correctly formatted"* when they don't match.

```markdown
✅ Correct — dashes fill the full column width
| Term  | Meaning    | Maps To (code) |
|-------|------------|----------------|
| term1 | definition | field/class    |

❌ Wrong — spaced separators trigger IntelliJ warning
| Term  | Meaning    | Maps To (code) |
| ----- | ---------- | -------------- |
| term1 | definition | field/class    |
```

**Formula:** separator width = `max(content_length_in_column) + 2`

### ASCII Box Diagrams

**Rule:** Every `│ content │` line must be padded so the right `│` aligns with the top `┌───┐` border.

```
✅ Correct — all lines same width
┌────────────────────────────────────┐
│ Short line                         │
│ A much longer line that fills more │
└────────────────────────────────────┘

❌ Wrong — short lines leave gap before │
┌────────────────────────────────────┐
│ Short line │
│ A much longer line that fills more │
└────────────────────────────────────┘
```

**Formula:** content padding = `inner_border_width - 2` (the two flanking spaces)

---

## Feature Slug, Branch & Commit Convention

> The user runs every git command. This section only defines the message format to *suggest* in a phase's
> **Suggested commit message** line — never run `git commit`, `git add`, `git stash` or `git reset` yourself.

Features start from an idea, not a ticket. The **feature slug** is the identifier.

| Item   | Format                                 | Example                                         |
|--------|----------------------------------------|-------------------------------------------------|
| Slug   | kebab-case, 2–4 words, noun-first      | `realtime-voting`, `invite-link`, `vibe-picker` |
| Plan   | `plans/{service}/{feature-slug}/`      | `plans/plan-service/realtime-voting/`           |
| Branch | `feature/{feature-slug}`               | `feature/realtime-voting`                       |
| Commit | `{type}({scope}): {phase description}` | `feat(plan-service): add vote entity`           |

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/):

| Type       | Use for                                 |
|------------|-----------------------------------------|
| `feat`     | new behavior                            |
| `fix`      | bug fix                                 |
| `refactor` | behavior-preserving change              |
| `test`     | tests only                              |
| `docs`     | plans, wiki, README                     |
| `chore`    | build, CI, Docker, dependencies         |

Scope = the service or app the phase touches (`web`, `plan-service`, `event-contracts`, `infrastructure`, …).

```
{type}({scope}): {phase description}

Feature: {feature-slug}

Change summary:
- {brief description of changes in this phase}
```

---

## Turning an Idea into a Plan

An idea is usually one or two sentences. Before scaffolding, shape it:

| Step            | Output                                                                   |
|-----------------|--------------------------------------------------------------------------|
| Restate         | The idea in one sentence, in UNPLND glossary terms                       |
| Problem & value | Who benefits, what changes for the user or group                         |
| Spec fit        | Matching spec section, or "new idea" — note conflicts with the spec      |
| Scope           | Smallest useful version (in scope) vs later ideas (out of scope)         |
| Ownership       | Owning service + tracks                                                  |
| Open questions  | Only questions that change the design; propose a default for each      |

Ask the user only the open questions that block the design. For everything else, pick a sensible default and record it in **Design Decisions**.

---

## Choosing the Owning Service

| Change is mainly about…                               | Owning service         |
|-------------------------------------------------------|------------------------|
| Register, login, profile, friends, preferences        | `user-service`         |
| Plans, members, constraints, itinerary, votes, memory | `plan-service`         |
| Places, categories, geo search, providers, caching    | `place-service`        |
| Notifications, WebSocket delivery, presence           | `notification-service` |
| Routing, JWT validation, rate limit, CORS             | `api-gateway`          |
| UI-only change with existing APIs                     | `web`                  |
| Event schema change shared by several services        | `event-contracts`      |
| Docker, CI, k8s, monitoring                           | `infrastructure`       |

A feature touching several services is filed under the service that owns the **business rule**; other services appear as tracks/phases.

---

## Phase Ordering

Contracts first, consumers last:

```text
E1 Event contract  ─┐
B1..B5 Backend      ├─► E2 Producer/Consumer ─► F1..F5 Frontend ─► D1 DevOps
                   ─┘
```

- Backend before frontend so the frontend codes against a real API.
- Event contracts before producers and consumers.
- Gateway routes / Compose changes (`devops`) when a new endpoint or service must be reachable.

---

## Design Checklist (UNPLND-specific)

Every design should answer:

| Concern          | Question                                                                       |
|------------------|--------------------------------------------------------------------------------|
| Authorization    | Who may call this? Creator only, any member, any user? Checked in backend?     |
| Plan lifecycle   | In which `PlanStatus` is this allowed? Which transition does it trigger?       |
| Data ownership   | Which service owns the data? No cross-service DB access?                       |
| Communication    | REST (needs immediate result), Kafka (async side effect), or WebSocket (push)? |
| Events           | Which event is produced? Topic, key, version, consumers?                        |
| Idempotency      | What happens if the event is delivered twice?                                  |
| Atomicity        | Does DB write + publish need the outbox?                                       |
| Realtime         | Which members see the change, through which destination, how is cache updated? |
| Frontend state   | Query keys invalidated? Optimistic update? Any Zustand state (client-only)?    |
| UI states        | Default, loading, empty, error, disabled — per `front-end-design` skill        |
| Mobile           | Primary action on mobile? Works at 375 px?                                     |

---

## ASCII Diagram Style

```
# Box style — for states and containers
┌────────────────────────────────────────┐
│ Content here                           │
└────────────────────────────────────────┘

# Flow/steps style — for multi-step processes
┌─────────────────────────────────────────────────────────────────────────┐
│  Step 1: Title                                                          │
│  ─────────────────────────────────────────────────────────────────────  │
│  Details and explanation                                                │
│                                                                         │
│  Step 2: Title                                                          │
│  ─────────────────────────────────────────────────────────────────────  │
│  More details                                                           │
└─────────────────────────────────────────────────────────────────────────┘

# Tree style — for hierarchy and directory structures
plans/{service}/{feature-slug}/
├── README.md
├── scenario/
│   ├── scenario-00-overview.md
│   └── scenario-01-{description}.md
├── design/
│   └── design-01-{track}.md
└── implementation-plan.md

# Event flow style — for cross-service flows
Web ──REST──► Gateway ──► Plan Service ──► MongoDB
                               │
                               └─ PLAN_VOTE_CAST (plan-events, key=planId)
                                        │
                                        ▼
                              Notification Service ──WS──► /topic/plan.{planId}
```

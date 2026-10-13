# Knowledge

Tribal knowledge: decisions, pitfalls and gaps that are not obvious from the code. Coding rules live in [`CLAUDE.md`](../CLAUDE.md); this page explains the *why* and the traps.

## Architectural decisions

- **identity vs profile split.** The spec's single "User Service" was split: `identity-service` owns *who you are* (credentials, linked Google/Facebook accounts, tokens) and is the only JWT issuer; `profile-service` (planned) owns *the person* (name, avatar, friends, preferences). Keeps auth small and security-sensitive data isolated. Profile creation is meant to be event-driven (`USER_REGISTERED`), so sign-up never blocks on profile-service.
- **One Gradle build, many services.** Services live at the repo root (no `services/` folder) and are included by the root `settings.gradle`, with a single wrapper. Each service is still its own Spring Boot app and deployable — the shared build is a convenience, not coupling. Shared code goes through the `commons` library only.
- **Layer packages inside a service** (`controller/`, `service/`, `repository/`, …) with concrete `@Service` classes. Chosen over the earlier feature-package + interface/impl template to keep small services simple.
- **Frontend first, on mocks.** The whole MVP UI was built against JSON in `webapp/public/resources/mock-data/`, consumed through the same feature services + TanStack Query hooks the real API will use. Swapping a service implementation should not touch components.
- **Learning goals behind planned patterns** (spec §30–31): Kafka key = `planId` to practise per-aggregate ordering; outbox to practise "DB write + publish is not atomic"; idempotent consumers to practise at-least-once delivery. These are deliberate exercises — keep them even when a simpler shortcut exists.

## Conventions not obvious from the code

- **Password hashes carry their algorithm.** `DelegatingPasswordEncoder` stores `{argon2@SpringSecurity_v5_8}…`; BCrypt hashes (`{bcrypt}…`) still verify, so the default can change later without a migration.
- **Service paths vs public paths.** identity-service serves `/identity/auth/...` (context path + controller path); the public `/api/v1/auth/**` mapping is the gateway's job (gateway not built yet).
- **`ApiResponse` has no `success` flag.** `{message, result}` from `commons`; success/failure is the HTTP status.
- **Frontend mock persistence is per tab.** Generated/edited plans live in an in-memory `Map` inside `planService` (session only). A reload resets them — expected, not a bug.
- **Dev flag `?noanim`** disables animations for screenshots in background tabs (paused `requestAnimationFrame`).

## Common pitfalls

- **Returning entities from controllers.** Today `POST /identity/auth/sign-up` returns the `Account` entity — including `passwordHash`. Always map to a response DTO.
- **Duplicate sign-up → 500.** Email uniqueness is only a DB constraint (`uk_accounts_email`); without a service-level check the client gets an internal error instead of 409.
- **`ddl-auto=update` is not a migration strategy.** identity-service still lets Hibernate change the schema; the rule is Flyway + `validate`.
- **Credentials in `application.properties`.** Local `root`/`root` is committed in identity-service; secrets belong in env vars.
- **Client-side state transitions.** The web mock lets the UI set plan status and votes locally (`usePlanDetailActions().setStatus`). When plan-service exists the frontend must only *request* transitions; the backend state machine decides.
- **Simulated realtime.** `useSimulatedVotes` fakes other members voting. Don't build on it — replace with WebSocket-driven cache invalidation.
- **Copying server state into Zustand.** Only wizard/UI state lives in Zustand (`createPlanStore`, `themeStore`); plans, places, profile come from TanStack Query.
- **Planned-architecture pitfalls** (apply once built): trusting client-sent IDs/roles, setting plan status outside `PlanStateMachine`, non-idempotent consumers, assuming DB + Kafka atomicity, reading another service's DB, WebSocket request/response.

## Spec Gaps

| Spec says | Code does | Note |
|---|---|---|
| One **User Service** (auth + profile + friends) | `identity-service` (auth) + planned `profile-service` | Intentional split |
| Repo layout `apps/web`, `services/*` | `webapp/`, services at repo root, `commons/` | Intentional |
| Frontend with **styled-components** | Tailwind CSS v4 + shadcn/ui | Intentional (CLAUDE.md) |
| Gateway routes `/api/users/**` … | Planned `/api/v1/...`; services expose own context paths | Gateway not built |
| Sign up with credentials (unspecified) | Web form: **username** (3–20 chars) + password ≥ 8 with letter and digit. Backend: **email** + password ≥ 6 | **Mismatch** — align before wiring web → identity |
| Event envelope `eventId, eventType, occurredAt, producer, version, payload` | Not implemented | Kafka phase |
| Docker Compose, CI/CD, contract packages | Not present | Phase 0 incomplete |
| Itinerary generation in plan-service via place-service | Rule-based generator runs **in the browser** (`planGenerator.ts`) on a mock activity pool | Temporary |
| Places from place-service (OSM/Overpass behind `PlaceProvider`) | Web maps call **Overpass directly** from the browser (`services/overpassClient.ts`) | Temporary; move behind place-service |
| WebSocket realtime | Simulated in the browser | Realtime phase |

# CLAUDE.md

Guidance for Claude Code when working in this repository.

## 1. Introduction

**UNPLND** — *No plans. Just vibes.*

A real-time social planning platform that turns **people + time + budget + vibe** into a spontaneous plan. A group sets a few constraints (who, duration, budget, radius, vibe); UNPLND discovers nearby places, generates an itinerary, lets members join via invite link, vote in real time, confirm, go, and save a memory afterwards.

> UNPLND turns "I don't know, you decide" into a plan worth leaving the house for.

Product principles: low friction, social first, real-time, spontaneous, constraint-aware, extensible for web and mobile.

This is a learning/pet project. Its purpose is to practice microservices, Kafka, real-time delivery and distributed-system patterns (idempotency, retry/DLT, outbox) on top of a fun product. Prefer free / open-source / low-cost tools everywhere.

Full spec: `docs/UNPLND_PROJECT_SPEC.md` (source of truth for product behaviour — read the relevant section before implementing a feature).

### Core flow

```text
Create/Join Plan → Set Constraints → Generate Plan → Discover Places → Build Itinerary
→ Share → Friends Join → Real-Time Voting → Confirm → Let's Go → Complete → Memory/Rating
```

### Plan lifecycle (enforced by backend only)

```text
DRAFT → GENERATING → OPEN → VOTING → CONFIRMED → READY_TO_GO → IN_PROGRESS → COMPLETED
VOTING | CONFIRMED | READY_TO_GO → CANCELLED
```

---

## 2. Tech Stack

### Frontend (`webapp/`)

| Concern | Choice |
|---|---|
| Language | TypeScript (strict) |
| Framework | React 19 |
| Build tool | Vite |
| UI components | **shadcn/ui** (Radix primitives, copied into repo) |
| Styling | **Tailwind CSS v4** (CSS variables theme, `cn()` helper) |
| Icons | lucide-react |
| Server state | TanStack Query |
| Client state | Zustand |
| Routing | React Router |
| i18n | react-i18next (en, vi) |
| Forms & validation | react-hook-form + zod (shadcn `Form`) |
| Toasts | sonner (shadcn) |
| Real-time | STOMP over WebSocket (`@stomp/stompjs`) |
| PWA | vite-plugin-pwa |
| Testing | Vitest, React Testing Library, MSW, Playwright |
| Lint/format | ESLint, Prettier (+ prettier-plugin-tailwindcss) |
| Package manager | npm |

> Note: the spec mentions styled-components — **it is replaced by shadcn/ui + Tailwind CSS**. Do not add styled-components, CSS-in-JS, or other UI kits (MUI, Chakra, AntD).

### Backend (`*-service/`, `api-gateway/`)

| Concern | Choice |
|---|---|
| Language | Java 21 |
| Framework | Spring Boot 3.x |
| Build | Gradle (Kotlin DSL), one build per service |
| Gateway | Spring Cloud Gateway |
| Security | Spring Security, JWT; Spring Security OAuth2 Client (Google, Facebook login) in identity-service |
| Identity / Profile DB | MySQL 8 + Spring Data JPA + Flyway |
| Plan / Place / Notification DB | MongoDB + Spring Data MongoDB |
| Cache / presence / rate limit | Redis |
| Messaging | Apache Kafka (KRaft) + Spring Kafka |
| Real-time | Spring WebSocket + STOMP (Notification Service) |
| Mapping | MapStruct |
| Boilerplate | Lombok (`@RequiredArgsConstructor`, `@Builder`, `@Slf4j`) |
| Validation | Jakarta Bean Validation |
| Resilience | Resilience4j |
| API docs | springdoc-openapi |
| Observability | Actuator, Micrometer, structured JSON logs, correlation IDs; later Prometheus, Grafana, OpenTelemetry |
| Testing | JUnit 5, Mockito, AssertJ, Spring Boot Test, Testcontainers (MySQL, MongoDB, Kafka, Redis) |
| External data | OpenStreetMap, Overpass API, OSRM (behind provider interfaces) |

### Infrastructure

Docker Compose for local dev (`infrastructure/docker/docker-compose.yml`): web, api-gateway, identity/profile/plan/place/notification services, mysql, mongodb, redis, kafka, kafka-ui. CI/CD on GitHub Actions, images pushed to GHCR. Kubernetes later (`infrastructure/k8s`).

---

## 3. Repository Layout

```text
unplnd/
├── webapp/                     # React PWA (Vite)
├── mobile/                     # Future: React Native + Expo
├── api-gateway/                # Each backend service is a standalone project at the repo root
├── identity-service/           # MySQL — authentication (username/password, Google, Facebook)
├── profile-service/            # MySQL — user information (planned)
├── plan-service/               # MongoDB
├── place-service/              # MongoDB + Redis
├── notification-service/       # MongoDB + WebSocket
├── packages/
│   ├── api-contracts/          # OpenAPI specs / generated TS types
│   ├── event-contracts/        # Kafka event schemas (JSON Schema), shared by FE types + BE
│   └── shared-types/
├── infrastructure/
│   ├── docker/
│   ├── k8s/
│   └── monitoring/
├── docs/
└── README.md
```

One `.gitignore` at the repo root covers the webapp and every service — don't add per-project `.gitignore` files (delete the one Spring Initializr / Vite generates).

---

## 4. Frontend Module Layout (`webapp/`)

Follows the structure from [The Ultimate React Folder Structure](https://dev.to/sercangundogan/the-ultimate-react-folder-structure-i-use-as-a-frontend-developer-4pfm): flat, purpose-named top-level folders plus self-contained `features/`.

### Root

```text
webapp/
├── .env
├── .env.example
├── eslint.config.js
├── .prettierrc
├── components.json             # shadcn config (aliases: ui → @/components/ui, utils → @/utils/cn)
├── index.html                  # applies saved theme (Day default / Twilight) before first paint
├── tsconfig.json               # references + @/* path (read by shadcn CLI)
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── Dockerfile
├── docker-compose.dev.yml
└── package-lock.json
```

> Tailwind v4 is configured in CSS (`@import "tailwindcss"` + `@theme` in `index.css`); add `tailwind.config.js` only if a plugin requires it.

### `src/`

```text
src/
├── @types/          # Global TS declarations (*.d.ts, env.d.ts, module augmentation)
├── components/      # Reusable, feature-agnostic UI components
│   ├── ui/          #   shadcn/ui generated primitives (Button, Card, Dialog, ...)
│   └── ...          #   App-wide compositions: AppHeader.tsx, VibeBadge.tsx, EmptyState.tsx
├── constants/       # Static config & key-value constants (vibes.ts, planStatus.ts, queryKeys.ts, apiPaths.ts)
├── data/            # Static or mock data (mock plans/places, MSW fixtures, random challenge seeds)
├── features/        # Feature-based, self-contained modules
│   ├── auth/
│   ├── plan/
│   ├── place/
│   ├── itinerary/
│   ├── voting/
│   ├── notification/
│   └── profile/
├── fonts/           # Custom font files
├── hooks/           # Reusable custom hooks (useDebounce.ts, useMediaQuery.ts, useWebSocket.ts)
├── i18n/            # Internationalization setup + locale files (en, vi)
├── pages/           # Route-level components; compose features, no business logic (HomePage.tsx, PlanDetailPage.tsx, JoinPlanPage.tsx)
├── routes/          # Route definitions, guards (ProtectedRoute), path config
├── services/        # Shared API/infra services: apiClient.ts (fetch wrapper, JWT, correlation id), queryClient.ts, websocketClient.ts (STOMP)
├── store/           # Global Zustand stores (uiStore.ts, websocketStore.ts)
├── types/           # Shared app types (api.ts, plan.ts, event.ts)
├── utils/           # Helpers (cn.ts, formatDate.ts, formatCurrency.ts)
├── App.tsx          # Providers (QueryClient, Router, Theme, i18n) + router outlet
├── main.tsx
└── index.css        # Tailwind import, @theme, theme CSS variables (light/dark)
```

### Feature folder

Each feature owns its components, service, store, and hooks — kept flat while small:

```text
features/plan/
├── CreatePlanWizard.tsx      # components — PascalCase
├── ConstraintForm.tsx
├── VibePicker.tsx
├── PlanCard.tsx
├── planService.ts            # API calls for this feature — camelCase
├── planQueries.ts            # TanStack Query hooks + query keys (usePlan, useCreatePlan, planKeys)
├── planStore.ts              # Feature Zustand store (wizard state)
├── planSchema.ts             # zod schemas
├── planTypes.ts
├── usePlanRealtime.ts        # feature hook — camelCase
└── index.ts                  # public API of the feature
```

When a feature grows past ~10 files, group into `components/`, `hooks/` sub-folders inside the feature — same naming rules.

---

## 5. Frontend Rules

### Structure & naming
- **Folders**: plural for groupings (`components`, `hooks`, `services`, `features`), lowercase.
- **Components**: `PascalCase.tsx` (`LoginForm.tsx`). One component per file.
- **Hooks**: `camelCase` starting with `use` (`useAuth.ts`).
- **Services / utils / stores / constants**: `camelCase.ts` (`authService.ts`, `formatDate.ts`, `planStore.ts`).
- **Where things go**:
  - Used by one feature → inside that feature.
  - Used by 2+ features → top-level `components/`, `hooks/`, `utils/`, `types/`, `constants/`.
  - A route-level screen → `pages/` (thin, composes features). Route config → `routes/`.
- Features import other features only via their `index.ts`; never deep-import another feature's files. Top-level shared folders must not import from `features/`.
- Path alias `@/` → `src/`.

### General
- TypeScript `strict`; no `any` (use `unknown` + narrowing). No `@ts-ignore` without an explanatory comment.
- Function components + hooks only. Named exports (default export only where a tool requires it).
- Mobile-first: design for small screens, enhance with `sm:` / `md:` / `lg:`. Must work on mobile, tablet, laptop, desktop.
- No hard-coded user-facing strings in components — use `i18n/` (`react-i18next`). Every key must exist in both `i18n/locales/en.json` and `i18n/locales/vi.json`; keys are type-checked via `@types/i18next.d.ts` (plural suffixes follow each language — `vi` only uses `_other`). Translate UI text only — user/content data (plan titles, memories, place names) comes from the API untranslated.
- Magic values (vibes, statuses, limits, route paths) live in `constants/`.

### UI — shadcn/ui + Tailwind
- Always reach for a shadcn component first. Add with `npx shadcn@latest add <component>`; never hand-write a primitive shadcn provides.
- `components/ui/` = shadcn-generated code. Keep edits minimal (variants, tokens). App-specific compositions go in `components/` (shared) or the feature folder.
- Style only with Tailwind utility classes. No inline `style={{}}` except truly dynamic values. No CSS modules, no styled-components.
- Merge classes with `cn()` from `@/utils/cn`. Define variants with `cva` (class-variance-authority).
- Use theme tokens (`bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`, `border`, …), not hard-coded colors, so light/dark works. New brand colors (e.g. per-vibe) go in `index.css` as CSS variables exposed via `@theme`. Custom fonts in `fonts/`, registered in `index.css`.
- Icons from `lucide-react` only.
- Accessibility: keep Radix semantics, everything keyboard-reachable, icon-only buttons need `aria-label`.

### State
- **Server state → TanStack Query only.** Never copy API data into Zustand or `useState`.
- Query keys from key factories (`planKeys.detail(id)`), no ad-hoc arrays.
- **Zustand** only for client state: wizard, UI prefs, temporary filters, WebSocket connection state. Global stores in `store/`, feature stores in the feature folder. Use selectors.
- Mutations invalidate/update relevant queries; optimistic updates for votes.

### API & real-time
- Until the backend exists, data comes from mock JSON in `webapp/public/resources/mock-data/`, loaded via `getMock()` in `services/apiClient.ts` and consumed through the same feature service + TanStack Query hooks the real API will use. Links/actions without a backing page stay `href="#"`.
- All HTTP goes through `services/apiClient.ts` → API Gateway (`/api/v1/...`). Components never call `fetch` directly; they use feature query hooks, which call the feature service.
- API responses arrive wrapped in `ApiResponse<T>` (`success`, `message`, `data`, `timestamp`); `apiClient` unwraps `data` and throws a typed error when `success === false`.
- Validate forms with zod (`react-hook-form` + shadcn `Form`); derive types with `z.infer`. Reuse types from `packages/api-contracts` / `event-contracts` where available.
- WebSocket messages are **signals to refresh**, not a second source of truth: on an event, invalidate/patch the matching query cache. No request/response over WebSocket.
- The frontend never decides authorization or plan state transitions; it reflects server-provided state.

### Testing
- Vitest + React Testing Library for units/components; MSW (fixtures in `data/`) for API mocks; Playwright for E2E of the MVP flow.
- Test files next to source: `PlanCard.test.tsx`. Test behaviour via roles/labels, not implementation details.
- Dev-only `?noanim` URL flag (see `main.tsx`) skips Motion and CSS animations — use it for screenshots in background/headless browser tabs, where `requestAnimationFrame` is paused and animations freeze mid-way.
- Offline: `components/offline/OfflineGate` (mounted in `App.tsx`) shows a full-screen offline state when `navigator.onLine` is false, then a banner if the user picks "Browse offline", and a toast on reconnect. In production `public/sw.js` serves the standalone `public/offline.html` when a navigation fails; its EN/VI copy mirrors `offline.*` in the locales, so keep them in sync.
- Maps: `components/map/VietnamMap` draws Stadia "Alidade Smooth" tiles (OpenStreetMap; keyless on localhost, production needs a Stadia account or own tile server) and, from zoom 15, real named places from the Overpass API (`services/overpassClient.ts`, endpoint fallback; `hooks/useOsmPois.ts`; categories in `constants/mapPois.ts`). Temporary until place-service exposes them via its PlaceProvider.

---

## 6. Backend Module Layout (`<name>-service/`)

Follows [Spring Boot Project Structure: Best Practices Used in Production](https://dev.to/kamlesh_patil/spring-boot-project-structure-best-practices-used-in-production-4h85) — **feature-based packages** with a `shared` package, controller → service (interface + impl) → repository layering.

Each service is a standalone Spring Boot project at the repo root (no shared parent build, no `services/` folder) with its own Gradle wrapper, Dockerfile, and database. Base package: `app.unplnd.<service>` (e.g. `app.unplnd.plan`).

```text
plan-service/
├── build.gradle.kts
├── Dockerfile
└── src/
    ├── main/
    │   ├── java/app/unplnd/plan/
    │   │   ├── PlanServiceApplication.java
    │   │   ├── plan/                              # feature package
    │   │   │   ├── PlanController.java
    │   │   │   ├── PlanService.java               # interface
    │   │   │   ├── impl/
    │   │   │   │   └── PlanServiceImpl.java
    │   │   │   ├── PlanRepository.java
    │   │   │   ├── Plan.java                      # entity / Mongo document
    │   │   │   ├── PlanStatus.java                # enum
    │   │   │   ├── PlanStateMachine.java          # allowed lifecycle transitions
    │   │   │   ├── PlanMapper.java                # MapStruct entity ↔ DTO
    │   │   │   ├── dto/
    │   │   │   │   ├── request/                   # CreatePlanRequest, UpdateConstraintsRequest
    │   │   │   │   └── response/                  # PlanResponse, PlanSummaryResponse
    │   │   │   └── event/                         # Kafka: PlanEventProducer, *Consumer, payload records
    │   │   ├── voting/                            # same shape: VoteController, VoteService, impl/, ...
    │   │   ├── invite/
    │   │   ├── itinerary/
    │   │   ├── memory/
    │   │   └── shared/
    │   │       ├── config/                        # SecurityConfig, KafkaConfig, MongoConfig, OpenApiConfig
    │   │       ├── constants/                     # ApiConstants (paths), KafkaTopics, EventTypes
    │   │       ├── exception/                     # GlobalExceptionHandler, ResourceNotFoundException, InvalidStateTransitionException, ...
    │   │       ├── response/                      # ApiResponse<T>, PageResponse<T>
    │   │       ├── aspect/                        # LoggingAspect, PerformanceAspect
    │   │       ├── event/                         # EventEnvelope, outbox, processed-event (idempotency) store
    │   │       ├── security/                      # JwtService, CurrentUser resolver
    │   │       └── util/
    │   └── resources/
    │       ├── application.properties
    │       ├── application-local.properties
    │       ├── application-dev.properties
    │       ├── application-prod.properties
    │       ├── application-test.properties
    │       ├── db/migration/                      # Flyway scripts (MySQL services: identity, profile)
    │       └── logback-spring.xml
    └── test/java/app/unplnd/plan/                 # mirrors main; *Test (unit), *IT (Testcontainers)
```

> The `event/` sub-package per feature and `shared/event`, `shared/security` extend the article's structure for Kafka and JWT needs.

Service responsibilities:

| Service | Feature packages | Owns | Produces | Consumes |
|---|---|---|---|---|
| api-gateway | `route`, `filter` (JWT, correlation id, rate limit) | routing, CORS | – | – |
| identity-service | `auth` (sign-up, sign-in with username/password, refresh, sign-out), `oauth` (Google and Facebook OAuth2 login, account linking), `token` (JWT issuing, refresh tokens) | MySQL: user accounts (credentials), oauth_accounts, refresh_tokens | USER_REGISTERED | – |
| profile-service *(planned)* | `profile`, `friendship`, `preference` | MySQL: profiles, friendships, friend_requests, user_preferences | USER_UPDATED, FRIEND_REQUEST_SENT, FRIEND_REQUEST_ACCEPTED | USER_REGISTERED, PLAN_COMPLETED |
| plan-service | `plan`, `itinerary`, `voting`, `invite`, `memory` | MongoDB: plans, votes, memories, outbox | PLAN_CREATED, PLAN_MEMBER_JOINED, PLAN_MEMBER_LEFT, PLAN_VOTE_CAST, PLAN_VOTE_UPDATED, PLAN_CONFIRMED, PLAN_CANCELLED, PLAN_STARTED, PLAN_COMPLETED | USER_UPDATED, PLACE_UPDATED |
| place-service | `place`, `category`, `provider` (PlaceProvider, RoutingProvider impls) | MongoDB: places, categories; Redis cache | PLACE_UPDATED | – |
| notification-service | `notification`, `preference`, `presence`, `websocket` | MongoDB: notifications; Redis presence | – | plan + friend events |

> **identity vs profile**: identity-service knows only *who you are* — credentials, linked Google/Facebook accounts, tokens — and is the only service that issues JWTs. Everything about *the person* (display name, avatar, friends, preferences) belongs to profile-service, keyed by the same `userId` (the JWT `sub`); it creates the profile when it consumes `USER_REGISTERED`.

Gateway routes: `/api/v1/auth/**` → identity, `/api/v1/users/**` → profile, `/api/v1/plans/**`, `/api/v1/places/**`, `/api/v1/notifications/**`. WebSocket: `/ws` with destinations `/topic/plan.{planId}` and `/user/queue/...`.

---

## 7. Backend Rules

### Package & naming conventions

| Type | Pattern | Example |
|---|---|---|
| Controller | `[Entity]Controller` | `PlanController` |
| Service interface | `[Entity]Service` | `PlanService` |
| Service impl | `[Entity]ServiceImpl` in `impl/` | `PlanServiceImpl` |
| Repository | `[Entity]Repository` | `PlanRepository` |
| Entity / document | `[Entity]` | `Plan`, `User` |
| Request DTO | `[Action][Entity]Request` | `CreatePlanRequest`, `CastVoteRequest` |
| Response DTO | `[Entity]Response` | `PlanResponse` |
| Mapper | `[Entity]Mapper` | `PlanMapper` |
| Exception | `[Scenario]Exception` | `ResourceNotFoundException`, `InvalidStateTransitionException` |
| Constants | `[Topic]Constants` / `ApiConstants` | `ApiConstants`, `KafkaTopics` |
| Aspect | `[Concern]Aspect` | `LoggingAspect` |
| Kafka producer / consumer | `[Entity]EventProducer` / `[Event]Consumer` | `PlanEventProducer`, `PlanCompletedConsumer` |

No `DTO` suffix on DTOs.

### Layers
- **Controller** — thin: `@Valid` request DTO, call one service method, return `ResponseEntity<ApiResponse<T>>`. No business logic, never touches repositories. Paths come from `ApiConstants`, not hard-coded strings. Injects service **interfaces** only.
- **Service** — every service has an interface + `impl/ServiceImpl`, even with one implementation. All business logic and `@Transactional` boundaries live here. No HTTP concerns (`HttpServletRequest`, `ResponseEntity`). Throws custom exceptions.
- **Repository** — `JpaRepository<E, ID>` (MySQL) / `MongoRepository<E, ID>` (MongoDB). Derived queries or `@Query`; `Optional<T>` for single results; `Pageable` for lists. No raw JDBC; custom query logic stays in repositories, not services.
- **Entity** — persistent fields only, JPA/Mongo annotations, audit fields (`createdAt`, `updatedAt`). No business logic. Never returned from controllers or used as DTOs.
- **DTO** — separate `request/` and `response/`. Request DTOs carry Bean Validation (`@NotBlank`, `@Positive`, …); response DTOs expose only what the client needs. One DTO per purpose. Use Java `record` (or Lombok `@Builder` for responses with many optional fields).
- **Mapper** — MapStruct, entity ↔ DTO only; no business logic.
- **Aspect** — cross-cutting only (logging, performance > 500 ms warning, auditing), pointcuts on service packages. No business logic.

### Cross-feature
- **Feature packages never import each other directly.** If `voting` needs plan data, depend on `PlanService` interface (never `PlanRepository` or `PlanServiceImpl`). Shared code goes only in `shared/`.
- No circular dependencies. Constructor injection only (`@RequiredArgsConstructor`), no field `@Autowired`.

### Architecture
- **Database-per-service.** A service never touches another service's database. Cross-service data via REST (immediate answer needed) or Kafka (async side effects).
- **Redis is not a source of truth. Kafka is not a database.**
- External providers (OSM, Overpass, OSRM, future AI) always behind interfaces: `PlaceProvider`, `RoutingProvider`, `MapProvider`, `RecommendationEngine`. Business logic never depends on a concrete provider.
- Services stay independently deployable — share only contracts (`packages/event-contracts`, `api-contracts`), never business code.

### Domain rules
- Plan lifecycle is enforced by `PlanStateMachine`, called from `PlanServiceImpl`. Illegal transitions throw `InvalidStateTransitionException` → HTTP 409. Never set `status` directly from a request body.
- Cancellation only from VOTING, CONFIRMED, READY_TO_GO.
- Money as `long` (VND) or `BigDecimal`, never `double`. Durations in minutes, distances in meters.
- Store times as UTC `Instant`; convert at the edges.

### API responses & errors
- Every endpoint returns `ApiResponse<T>` (`success`, `message`, `data`, `timestamp`) via `ApiResponse.success(data)` / `ApiResponse.error(message)`. Lists use `PageResponse<T>` inside `data`.
- `GlobalExceptionHandler` (`@RestControllerAdvice`) maps exceptions → `ApiResponse.error(...)` with correct status: `ResourceNotFoundException` 404, `MethodArgumentNotValidException` 400 (with field errors), auth 401/403, `InvalidStateTransitionException` 409.
- Custom exceptions extend `RuntimeException` with meaningful messages.
- REST: versioned `/api/v1/...`, plural nouns (`/plans/{planId}/members`), 201 on create, paginated lists. Document with springdoc-openapi; keep `packages/api-contracts` in sync.

### Configuration
- `application.properties` base + `application-{local,dev,prod,test}.properties` profiles.
- Secrets via env vars only (`${DB_PASSWORD}`, `${JWT_SECRET}`); never commit secrets or certs.

### Security
- **Never trust user IDs, plan IDs, roles or permissions sent by the client.** Current user comes from the validated JWT only.
- Every endpoint checks authorization in the backend (only members vote; only creator confirms/cancels).
- Passwords hashed with BCrypt/Argon2. Invite tokens random, unguessable, expirable.
- Authentication lives only in identity-service: username/password plus Google and Facebook OAuth2 login. A social login maps to one user account via (`provider`, `providerUserId`); it issues the same UNPLND JWT + refresh token as a password login. Provider tokens are never forwarded to other services. OAuth client ids/secrets via env vars only.

### Kafka
- Topics: `user-events`, `plan-events`, `place-events`, `notification-events` (+ `<topic>.DLT`). Names in `shared/constants/KafkaTopics`.
- Standard envelope (`shared/event/EventEnvelope`): `eventId`, `eventType`, `occurredAt`, `producer`, `version`, `payload`. Schemas in `packages/event-contracts`.
- Key: `planId` for plan events, `userId` for user events — preserves per-aggregate ordering.
- Events are past-tense facts (`PLAN_CONFIRMED`), immutable; breaking change → bump `version`.
- At-least-once delivery: every consumer idempotent (processed `eventId` store).
- Retry with backoff + Dead Letter Topic; never swallow exceptions.
- DB write + Kafka publish are not atomic — use the **Transactional Outbox** for critical events.
- One consumer group per consuming service.

### Real-time
- WebSocket is server → client push only; actions stay REST.
- Only Notification Service holds WebSocket connections; it reacts to Kafka events. Presence in Redis with TTL.

### Observability
- Propagate `X-Correlation-Id` from gateway through REST and Kafka headers; put in MDC for every log line.
- Structured JSON logs via `logback-spring.xml`; never log passwords, tokens, full JWTs.
- Actuator health/metrics; Micrometer metrics for plan generation time, consumer lag, WebSocket connections.

### Testing
- Unit tests for every `*ServiceImpl` and `PlanStateMachine` (JUnit 5, Mockito, AssertJ) — state machine fully covered.
- `@WebMvcTest` for controllers, `@DataJpaTest` / `@DataMongoTest` for repositories.
- Integration tests (`*IT`) with Testcontainers for MySQL, MongoDB, Kafka, Redis. No H2 / embedded fakes.
- Consumer tests for each Kafka listener, including duplicate delivery.
- Test names describe behaviour: `shouldRejectVoteWhenPlanNotInVotingState`.

---

## 8. Common Commands

> Update this section once the scaffolding exists.

```bash
# Infrastructure
docker compose -f infrastructure/docker/docker-compose.yml up -d

# Frontend
cd webapp
npm install
npm run dev
npm run typecheck
npm run test
npm run lint
npm run build
npx shadcn@latest add <component>

# or from repo root
npm --prefix webapp run <script>

# Backend (per service)
cd identity-service          # each service builds on its own
./gradlew bootRun --args='--spring.profiles.active=local'
./gradlew test               # unit
./gradlew integrationTest    # Testcontainers (Docker required)
./gradlew build
```

---

## 9. Glossary

| Term | Meaning |
|---|---|
| **Plan** | A group activity session created in UNPLND |
| **Identity** | Who a user is to the system: credentials, linked Google/Facebook accounts, tokens (identity-service) |
| **Profile** | What a user shows to others: display name, avatar, friends, preferences (profile-service) |
| **Plan Creator** | User who creates a plan (role `CREATOR`) |
| **Plan Member** | User participating in a plan (role `MEMBER`) |
| **Plan Status** | Lifecycle state: DRAFT, GENERATING, OPEN, VOTING, CONFIRMED, READY_TO_GO, IN_PROGRESS, COMPLETED, CANCELLED |
| **Vibe** | Desired atmosphere of a plan: CHILL, FOOD, PARTY, NERDY, OUTDOOR, DATE, CHAOS, SURPRISE |
| **Constraint** | Parameter limiting plan generation (people, duration, budget, location, radius, vibe, …) |
| **Itinerary** | Ordered sequence of activities in a plan |
| **Activity** | One item inside an itinerary (type, place, start time, duration) |
| **Locked Activity** | Activity kept fixed when the itinerary is regenerated |
| **Random Challenge** | Optional fun task attached to a plan ("Everyone chooses a snack for someone else") |
| **Candidate Place** | Place that may be selected for an itinerary |
| **POI** | Point of interest from a place provider |
| **Invite Link** | Shareable URL for joining a plan (`/join/{code}`) |
| **Vote** | A member's choice among options (activity, place, itinerary, challenge) |
| **Memory** | Post-plan record: rating, photos, short note, saved itinerary |
| **Presence** | Whether a user is online/active (Redis) |
| **Event** | An immutable fact that something happened, published to Kafka |
| **Event Envelope** | Standard event wrapper: eventId, eventType, occurredAt, producer, version, payload |
| **Producer** | Service publishing Kafka events |
| **Consumer** | Service receiving Kafka events |
| **Consumer Group** | Kafka consumers cooperating on a workload |
| **Topic** | Kafka stream/category of events |
| **Partition** | Kafka unit of parallelism and ordering |
| **Offset** | Position of a message in a partition |
| **Consumer Lag** | Difference between produced and processed messages |
| **Idempotency** | Processing the same event repeatedly without incorrect side effects |
| **DLT** | Dead Letter Topic for messages that cannot be processed |
| **Transactional Outbox** | Persisting business changes and outgoing events together before async publication |
| **Inbox Pattern** | Recording received events to de-duplicate processing |
| **Eventual Consistency** | Services may temporarily differ but eventually converge |
| **Database-per-Service** | Each service owns its database exclusively |
| **API Gateway** | Public entry point routing requests to services |
| **Service Discovery** | Mechanism for services to find each other |
| **Provider** | Abstraction over an external data source (PlaceProvider, RoutingProvider, MapProvider) |
| **Recommendation Engine** | Component generating itineraries from constraints (rule-based first, AI later) |
| **WebSocket / STOMP** | Persistent two-way connection / messaging protocol on top of it |
| **Cache** | Temporary data stored for faster access (Redis) |
| **CQRS** | Separating command and query responsibilities |
| **PWA** | Progressive Web App |
| **shadcn/ui** | Copy-in React component collection built on Radix UI + Tailwind |
| **Server State** | Data owned by the backend, managed by TanStack Query on the client |
| **ApiResponse** | Standard backend response wrapper: success, message, data, timestamp |
| **Client State** | UI-only data (wizard steps, filters, prefs), managed by Zustand |

# UNPLND

> **No plans. Just vibes.**
>
> A real-time social planning platform that turns **people + time + budget + vibe** into spontaneous plans.

## 1. Project Overview

### What is UNPLND?

UNPLND is a Gen-Z-oriented social planning application for groups of friends who want to hang out but do not know what to do.

Instead of spending 30 minutes in a group chat asking _"Where should we go?"_, users provide a few constraints:

- Who is going?
- How much time do we have?
- What is the budget?
- How far are we willing to travel?
- What is the vibe?

UNPLND creates a dynamic plan containing places, activities, timing, estimated cost, and optional random challenges.

### Product Statement

> **UNPLND helps groups turn "I don't know, you decide" into an actual plan.**

### Product Principles

1. Low friction
2. Social first
3. Real-time
4. Spontaneous
5. Constraint-aware
6. Extensible for web and mobile

---

# 2. Core User Flow

```text
Open UNPLND
    |
    v
Create / Join a Plan
    |
    v
Set Constraints
    |
    +--> Group
    +--> Duration
    +--> Budget
    +--> Radius
    +--> Vibe
    |
    v
Generate Plan
    |
    v
Discover Places
    |
    v
Build Itinerary
    |
    v
Share Plan
    |
    v
Friends Join
    |
    v
Real-Time Voting
    |
    v
Confirm Plan
    |
    v
Let's Go
    |
    v
Complete Plan
    |
    v
Memory / Rating
```

---

# 3. Detailed Product Flow

## 3.1 Home

Users can:

- Create a new plan
- Join an existing plan
- View recent plans
- View upcoming plans
- Open their profile

Primary CTA:

> **MAKE A PLAN**

Secondary CTA:

> **JOIN A PLAN**

## 3.2 Create a Plan

Required:

```text
People
Duration
Budget
Location
Vibe
```

Optional:

```text
Maximum travel distance
Start time
Food preferences
Activity preferences
Indoor / outdoor
Transportation preference
```

Example:

```text
People:       4
Duration:     4 hours
Budget:       500,000 VND / person
Radius:       5 km
Vibe:         CHAOS
Start time:   19:00
```

---

# 4. Vibe System

Initial vibes:

| Vibe | Description |
|---|---|
| CHILL | Coffee, sunset, conversation |
| FOOD | Restaurants, street food, food hunting |
| PARTY | Music, nightlife, social activities |
| NERDY | Games, books, museums, tech |
| OUTDOOR | Parks, walking, sports |
| DATE | Romantic, cozy, aesthetic |
| CHAOS | Unexpected and unusual activities |
| SURPRISE | Let UNPLND decide everything |

---

# 5. Plan Generation Flow

```text
Frontend
   |
   | POST /plans
   v
API Gateway
   |
   v
Plan Service
   |
   | request places
   v
Place Service
   |
   +--> Redis cache
   |
   +--> OpenStreetMap / Overpass / Routing Provider
   |
   v
Candidate Places
   |
   v
Recommendation / Planning Logic
   |
   v
Generated Itinerary
```

Example:

```text
19:00 - 20:00
🍜 Food
Bún thịt nướng

20:15 - 21:15
🎮 Activity
Arcade

21:30 - 22:15
🌃 Night Walk
Riverside walk

22:15
🎲 Random Challenge
"Everyone chooses a snack for someone else."
```

Users can:

- Accept the plan
- Regenerate
- Replace one activity
- Lock an activity
- Share the plan
- Invite friends

---

# 6. Sharing & Joining

Each plan has a shareable invite link.

```text
https://unplnd.app/join/7H2K9X
```

```text
Creator
   |
   | Create plan
   v
Share invite link
   |
   +------> Friend A
   +------> Friend B
   +------> Friend C
             |
             v
        Join Plan
```

---

# 7. Real-Time Group Flow

UNPLND uses WebSocket for real-time collaboration.

```text
User A joins
      |
      v
Plan Service
      |
      v
Kafka: PLAN_MEMBER_JOINED
      |
      v
Notification Service
      |
      v
WebSocket
      |
      +----> User B
      +----> User C
```

Example:

> **Nhan joined the plan**

No page refresh is required.

---

# 8. Voting Flow

Groups can vote on:

- Activities
- Restaurants
- Places
- Alternative itineraries
- Random challenges

Example:

```text
Option A
🍜 Vietnamese Food
4 votes

Option B
🍕 Pizza
2 votes
```

Flow:

```text
Frontend
   |
   v
Plan Service
   |
   +--> Persist vote
   |
   +--> PLAN_VOTE_CAST
              |
              v
            Kafka
              |
              v
      Notification Service
              |
              v
          WebSocket
              |
              v
        Other members
```

---

# 9. Plan Lifecycle

```text
DRAFT
  |
  v
GENERATING
  |
  v
OPEN
  |
  v
VOTING
  |
  v
CONFIRMED
  |
  v
READY_TO_GO
  |
  v
IN_PROGRESS
  |
  v
COMPLETED
```

Cancellation can occur from appropriate states:

```text
VOTING --------> CANCELLED
CONFIRMED ------> CANCELLED
READY_TO_GO ----> CANCELLED
```

The state machine must be enforced by the backend.

---

# 10. Post-Plan Flow

After completion, users can:

- Rate the plan
- Rate places
- Favorite activities
- Upload photos
- Add a short memory
- Save the itinerary
- Share the memory

Example:

```text
UNPLND #184

🍜 Food
🎮 Arcade
🌃 Night Walk

⭐ 4.8 / 5

"Actually one of the best random nights."
```

---

# 11. System Architecture

UNPLND uses a **microservices architecture**.

```text
                         ┌──────────────────┐
                         │   React / PWA    │
                         └────────┬─────────┘
                                  |
                             HTTPS / WSS
                                  |
                         ┌────────▼─────────┐
                         │   API Gateway    │
                         └────────┬─────────┘
                                  |
              ┌───────────────────┼───────────────────┐
              |                   |                   |
              v                   v                   v
       ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
       │ User Service│    │ Plan Service│    │Place Service│
       └──────┬──────┘    └──────┬──────┘    └──────┬──────┘
              |                   |                   |
              v                   v                   v
          MySQL DB          MongoDB DB          MongoDB DB
                                  |
                             ┌────▼─────┐
                             │  Kafka   │
                             └────┬─────┘
                                  |
                         ┌────────▼─────────┐
                         │ Notification     │
                         │ Service          │
                         └────────┬─────────┘
                                  |
                                  v
                             WebSocket
                                  |
                                  v
                               Users

                    ┌─────────────────────┐
                    │       Redis         │
                    │ Cache / Presence /  │
                    │ Rate Limiting       │
                    └─────────────────────┘
```

---

# 12. Backend Services

## 12.1 API Gateway

Responsibilities:

- Single public entry point
- Request routing
- Authentication forwarding
- Rate limiting
- CORS
- Correlation IDs
- API versioning
- Security policies

Example routes:

```text
/api/users/**          -> User Service
/api/plans/**          -> Plan Service
/api/places/**         -> Place Service
/api/notifications/**  -> Notification Service
```

Potential technology:

- Spring Cloud Gateway

---

## 12.2 User Service

Responsibilities:

- Registration
- Authentication
- User profile
- Preferences
- Friend relationships
- Friend requests
- User settings

Database:

**MySQL**

Main entities:

```text
users
friendships
friend_requests
user_preferences
```

Produces:

```text
USER_REGISTERED
USER_UPDATED
FRIEND_REQUEST_SENT
FRIEND_REQUEST_ACCEPTED
```

Consumes:

```text
PLAN_COMPLETED
```

---

## 12.3 Plan Service

The main business service.

Responsibilities:

- Create plans
- Manage members
- Plan lifecycle
- Plan constraints
- Itinerary management
- Voting
- Plan confirmation
- Invite links
- Memory metadata

Database:

**MongoDB**

Example document:

```json
{
  "id": "plan_123",
  "creatorId": "user_1",
  "status": "VOTING",
  "constraints": {
    "budget": 500000,
    "duration": 240,
    "radius": 5000,
    "vibe": "CHAOS"
  },
  "members": [
    {
      "userId": "user_1",
      "role": "CREATOR"
    },
    {
      "userId": "user_2",
      "role": "MEMBER"
    }
  ],
  "itinerary": [
    {
      "type": "FOOD",
      "placeId": "place_123",
      "startTime": "19:00",
      "duration": 60
    }
  ]
}
```

Produces:

```text
PLAN_CREATED
PLAN_MEMBER_JOINED
PLAN_MEMBER_LEFT
PLAN_VOTE_CAST
PLAN_VOTE_UPDATED
PLAN_CONFIRMED
PLAN_CANCELLED
PLAN_STARTED
PLAN_COMPLETED
```

Consumes:

```text
USER_UPDATED
PLACE_UPDATED
```

---

## 12.4 Place Service

Responsibilities:

- Search nearby places
- Retrieve POIs
- Geospatial search
- Place details
- Distance calculation
- Place categorization
- External provider integration
- Place caching

Database:

**MongoDB**

Cache:

**Redis**

Potential free/open providers:

- OpenStreetMap
- Overpass API
- OSRM

Use provider abstractions:

```java
interface PlaceProvider {
    List<Place> search(PlaceSearchRequest request);
}

interface RoutingProvider {
    Route calculate(RouteRequest request);
}
```

---

## 12.5 Notification Service

Responsibilities:

- In-app notifications
- WebSocket delivery
- Notification persistence
- Notification preferences
- Event-driven notification handling

Database:

**MongoDB**

Flow:

```text
Kafka
  |
  v
Notification Service
  |
  +--> MongoDB
  |
  +--> WebSocket
  |
  v
Connected clients
```

Consumes:

```text
PLAN_CREATED
PLAN_MEMBER_JOINED
PLAN_MEMBER_LEFT
PLAN_VOTE_CAST
PLAN_CONFIRMED
PLAN_STARTED
PLAN_COMPLETED

FRIEND_REQUEST_SENT
FRIEND_REQUEST_ACCEPTED
```

Future:

```text
EMAIL_NOTIFICATION_REQUESTED
PUSH_NOTIFICATION_REQUESTED
```

---

# 13. Kafka Architecture

Kafka is the event backbone of UNPLND.

Kafka is used for:

- Asynchronous communication
- Event-driven workflows
- Service decoupling
- Event fan-out
- Reliable event processing
- Future analytics
- Future recommendation pipelines

Example:

```text
Plan Service
     |
     | PLAN_CONFIRMED
     v
   Kafka
   /     v     v
Notification   Analytics
Service        Service
```

## Topics

Initial topics:

```text
user-events
plan-events
place-events
notification-events
```

Example event:

```json
{
  "eventId": "evt_123",
  "eventType": "PLAN_CONFIRMED",
  "occurredAt": "2026-10-07T14:00:00Z",
  "producer": "plan-service",
  "version": 1,
  "payload": {
    "planId": "plan_123",
    "confirmedBy": "user_1"
  }
}
```

Recommended Kafka concepts to practice:

- Producer
- Consumer
- Consumer Group
- Topic
- Partition
- Offset
- Key-based partitioning
- Ordering
- Retry
- Dead Letter Topic
- Idempotency
- Event versioning
- At-least-once delivery
- Consumer lag

For plan events:

```text
Kafka key = planId
```

This helps preserve ordering for events belonging to the same plan.

---

# 14. Database Architecture

UNPLND follows **Database-per-Service**.

```text
User Service
    |
    v
MySQL
    |
    +-- users
    +-- friendships
    +-- friend_requests

Plan Service
    |
    v
MongoDB
    |
    +-- plans
    +-- votes
    +-- memories

Place Service
    |
    v
MongoDB
    |
    +-- places
    +-- categories

Notification Service
    |
    v
MongoDB
    |
    +-- notifications
```

Services must not directly access another service's database.

Communication happens through:

- REST
- Kafka
- WebSocket
- API Gateway

---

# 15. Redis

Redis handles short-lived and high-speed data.

## Cache

```text
OSM / Overpass responses
Place details
Frequently requested searches
```

## Presence

```text
user_123 -> ONLINE
user_456 -> OFFLINE
```

## Rate limiting

```text
IP / user / endpoint -> request counter
```

## Temporary data

Potential future use:

```text
Invite tokens
Short-lived plan sessions
OTP / verification state
```

Redis is not the primary source of truth.

---

# 16. Frontend Architecture

Technology:

```text
React
TypeScript
TanStack Query
Zustand
styled-components
WebSocket client
Vite
PWA
```

The frontend is mobile-first and responsive.

Supported:

```text
Mobile
Tablet
Laptop
Desktop
```

Recommended structure:

```text
apps/
└── web/
    ├── src/
    │   ├── app/
    │   ├── features/
    │   │   ├── auth/
    │   │   ├── plan/
    │   │   ├── place/
    │   │   ├── voting/
    │   │   ├── notification/
    │   │   └── profile/
    │   ├── components/
    │   ├── hooks/
    │   ├── services/
    │   ├── stores/
    │   ├── websocket/
    │   ├── routes/
    │   └── utils/
    └── ...
```

### State Management

TanStack Query:

- Server state
- API requests
- Caching
- Refetching
- Mutations

Zustand:

- Wizard state
- UI preferences
- Temporary filters
- WebSocket connection state

Avoid duplicating server state in Zustand.

---

# 17. WebSocket Architecture

Endpoint:

```text
wss://api.unplnd.app/ws
```

Potential destinations:

```text
/plan/{planId}
/user/{userId}
```

Events:

```text
PLAN_MEMBER_JOINED
PLAN_MEMBER_LEFT
PLAN_VOTE_UPDATED
PLAN_STATUS_CHANGED
NOTIFICATION_CREATED
```

Flow:

```text
User A votes
    |
    v
Plan Service
    |
    v
Kafka
    |
    v
Notification Service
    |
    v
WebSocket
    |
    +------> User B
    +------> User C
```

---

# 18. Mobile Strategy

The first release is a responsive PWA.

Future:

```text
apps/
├── web/
└── mobile/
```

Potential technology:

**React Native + Expo**

Shared packages:

```text
packages/
├── api-client/
├── api-types/
├── validation/
└── shared-utils/
```

The backend remains unchanged.

```text
                 ┌───────────┐
                 │ Backend   │
                 └─────┬─────┘
                       |
              ┌────────┴────────┐
              v                 v
          React Web       React Native
```

---

# 19. Repository Structure

```text
unplnd/
│
├── apps/
│   ├── web/
│   └── mobile/                 # Future
│
├── services/
│   ├── api-gateway/
│   ├── user-service/
│   ├── plan-service/
│   ├── place-service/
│   └── notification-service/
│
├── packages/
│   ├── api-contracts/
│   ├── event-contracts/
│   └── shared-types/
│
├── infrastructure/
│   ├── docker/
│   │   └── docker-compose.yml
│   ├── k8s/
│   └── monitoring/
│
├── docs/
│
└── README.md
```

---

# 20. Local Development Infrastructure

Docker Compose should run:

```text
web
api-gateway
user-service
plan-service
place-service
notification-service

mysql
mongodb
redis
kafka
kafka-ui
```

Optional Kafka coordination components depend on the selected Kafka distribution/configuration.

---

# 21. Cloud Architecture

## Development

```text
Local Machine
    |
    +-- Docker Compose
```

## Low-Cost Production-Like Deployment

```text
Cloud VM / VPS
    |
    +-- Docker
    +-- Reverse Proxy
    +-- Application containers
    +-- MySQL
    +-- MongoDB
    +-- Redis
    +-- Kafka
```

## Kubernetes Stage

```text
Cloud Kubernetes Cluster
        |
        +-- Ingress
        |
        +-- API Gateway
        |
        +-- User Service
        |
        +-- Plan Service
        |
        +-- Place Service
        |
        +-- Notification Service
        |
        +-- Kafka
        |
        +-- Redis
        |
        +-- Databases
```

The project should prioritize free tiers, open-source software, and low-cost infrastructure.

---

# 22. CI/CD

Use GitHub Actions.

```text
Pull Request
    |
    +--> Frontend lint
    +--> Frontend tests
    +--> Backend unit tests
    +--> Integration tests
    +--> Build
    |
    v
Merge to main
    |
    +--> Build Docker images
    +--> Push images to container registry
    |
    v
Deploy
```

Potential registry:

```text
GitHub Container Registry (GHCR)
```

---

# 23. Testing Strategy

## Frontend

- Unit tests
- Component tests
- Integration tests
- E2E tests

Potential tools:

```text
Vitest
React Testing Library
Playwright
```

## Backend

- Unit tests
- Integration tests
- Repository tests
- Controller tests
- Kafka consumer tests
- Contract tests

Technology:

```text
JUnit 5
Mockito
Spring Boot Test
Testcontainers
```

Use Testcontainers for:

```text
MySQL
MongoDB
Kafka
Redis
```

---

# 24. Observability

Initial:

```text
Spring Boot Actuator
Micrometer
Structured logging
Correlation IDs
```

Later:

```text
Prometheus
Grafana
OpenTelemetry
Jaeger / Tempo
```

Important metrics:

```text
HTTP latency
HTTP error rate
Kafka consumer lag
Kafka processing latency
MongoDB query latency
MySQL query latency
Redis hit ratio
WebSocket connections
Active plans
Plan generation time
```

---

# 25. Security

Initial security:

- HTTPS
- JWT authentication
- Password hashing
- CORS configuration
- Rate limiting
- Input validation
- Authorization checks
- Secure invite tokens
- Secret management

Important rule:

> Never trust user IDs, plan IDs, roles, or permissions supplied by the frontend.

Authorization must be enforced by the backend.

---

# 26. External Data & APIs

UNPLND prioritizes free/open services.

## Maps & Places

Primary:

**OpenStreetMap**

Potential supporting services:

- Overpass API
- OSRM

Provider abstractions:

```text
PlaceProvider
RoutingProvider
MapProvider
```

Business logic must not be tightly coupled to a single external provider.

---

# 27. Core Features

## MVP

### Authentication

- Register
- Login
- Logout
- JWT
- Profile

### Plans

- Create plan
- Edit plan
- Delete/cancel plan
- Join plan
- Leave plan
- Share invite link
- Plan lifecycle

### Constraints

- Budget
- Duration
- Radius
- Location
- Vibe
- Group size

### Discovery

- Nearby places
- Categories
- Distance
- Estimated cost
- Basic filtering

### Itinerary

- Generate itinerary
- Regenerate
- Replace activity
- Lock activity
- Estimated duration
- Estimated cost

### Social

- Friends
- Invite friends
- Group members
- Voting

### Real-time

- WebSocket
- Member presence
- Vote updates
- Plan status updates
- Notifications

---

# 28. Post-MVP Features

## Social

- User profiles
- Friend system
- Activity history
- Favorite places
- Shared memories

## Gamification

- Random challenges
- Streaks
- Badges
- Chaos score
- Plan completion statistics

## Recommendation

- Personalized recommendations
- Favorite-vibe learning
- Group preference learning
- Frequently visited place detection

## Media

- Photo uploads
- Plan albums
- Memory timeline

Potential storage:

```text
MinIO locally
S3-compatible storage in production
```

---

# 29. Future AI Features

AI is not required for MVP.

Potential experience:

> **"Make it weird."**

The recommendation engine can consider:

- Vibe
- Budget
- Time
- Weather
- Preferences
- Group history

For low-cost experimentation:

```text
Ollama
```

Use a provider abstraction:

```java
interface RecommendationEngine {
    Itinerary generate(PlanConstraints constraints);
}
```

Implementations could include:

```text
RuleBasedRecommendationEngine
LocalAIRecommendationEngine
ExternalAIRecommendationEngine
```

---

# 30. Distributed-System Problems to Practice

## Eventual Consistency

```text
User joins Plan
    |
    v
Plan Service updated
    |
    v
Kafka event
    |
    v
Notification Service updated
```

Different services may temporarily have different states.

## Idempotency

Kafka can deliver a message more than once.

Consumers must safely handle:

```text
PLAN_MEMBER_JOINED
PLAN_MEMBER_JOINED
```

without duplicate side effects.

## Retry & Dead Letter Topic

```text
Kafka
  |
  v
Consumer
  |
  X
Processing failed
  |
  v
Retry
  |
  X
Retry
  |
  v
DLT
```

## Distributed Transactions

Avoid assuming that database operations and Kafka publication form one atomic transaction across independent systems.

Future patterns:

- Transactional Outbox
- Inbox Pattern
- Idempotent Consumers

---

# 31. Transactional Outbox

For critical events:

```text
Plan Service
    |
    +--> MongoDB
    |      |
    |      +--> plan
    |      +--> outbox_event
    |
    v
Outbox Publisher
    |
    v
Kafka
```

This prevents:

```text
Database updated
       |
       X
Kafka publish failed
```

---

# 32. Glossary

| Term | Meaning |
|---|---|
| **Plan** | A group activity session created in UNPLND |
| **Plan Creator** | User who creates a plan |
| **Plan Member** | User participating in a plan |
| **Vibe** | Desired atmosphere/style of a plan |
| **Itinerary** | Ordered sequence of activities |
| **Activity** | One item inside an itinerary |
| **Constraint** | Parameter limiting plan generation |
| **Candidate Place** | Place that may be selected |
| **Invite Link** | Shareable URL for joining a plan |
| **Presence** | Whether a user is online/active |
| **Event** | A fact that something happened |
| **Producer** | Service publishing Kafka events |
| **Consumer** | Service receiving Kafka events |
| **Consumer Group** | Kafka consumers cooperating on a workload |
| **Topic** | Kafka stream/category of events |
| **Partition** | Kafka unit of parallelism and ordering |
| **Offset** | Position of a message in a partition |
| **Consumer Lag** | Difference between produced and processed messages |
| **Idempotency** | Processing the same event repeatedly without incorrect side effects |
| **DLT** | Dead Letter Topic for messages that cannot be processed |
| **Eventual Consistency** | Services may temporarily differ but eventually converge |
| **Database-per-Service** | Each service owns its database |
| **API Gateway** | Public entry point routing requests |
| **Service Discovery** | Mechanism for services to find each other |
| **WebSocket** | Persistent two-way real-time connection |
| **Cache** | Temporary data stored for faster access |
| **PWA** | Progressive Web App |
| **CQRS** | Separating command and query responsibilities |
| **Transactional Outbox** | Persisting business changes and outgoing events together before async publication |

---

# 33. Architecture Principles

1. **Database ownership** — a service owns its data.
2. **Explicit contracts** — services communicate through defined APIs/events.
3. **Events for asynchronous workflows** — use Kafka for decoupled side effects.
4. **REST for request/response** — use REST when an immediate result is required.
5. **WebSocket for real-time delivery** — do not replace normal REST with WebSocket.
6. **Redis is not the source of truth.**
7. **Kafka is not a database.**
8. **External providers are abstracted.**
9. **Services should be independently deployable.**
10. **Microservices should have clear responsibilities.**

---

# 34. Development Roadmap

## Phase 0 — Foundation

- Repository
- Monorepo structure
- Docker Compose
- API Gateway
- Service templates
- CI pipeline

## Phase 1 — Authentication

- User Service
- MySQL
- JWT
- React authentication

## Phase 2 — Plans

- Plan Service
- MongoDB
- Create/join/leave
- Plan lifecycle
- Invite links

## Phase 3 — Places

- Place Service
- OpenStreetMap
- Overpass
- Redis cache
- Geospatial queries

## Phase 4 — Kafka

- Event contracts
- Producers
- Consumers
- Topics
- Consumer groups
- Retry
- DLT
- Idempotency

## Phase 5 — Real-Time

- Notification Service
- WebSocket
- Presence
- Real-time voting
- Real-time plan status

## Phase 6 — Recommendation

- Itinerary generation
- Vibe matching
- Budget constraints
- Distance constraints
- Activity replacement

## Phase 7 — Reliability

- Transactional Outbox
- Observability
- Distributed tracing
- Resilience4j
- Load testing

## Phase 8 — Production Infrastructure

- Docker optimization
- Container registry
- Cloud deployment
- HTTPS
- Monitoring

## Phase 9 — Kubernetes

- Deployments
- Services
- ConfigMaps
- Secrets
- Ingress
- HPA
- Kafka deployment
- Rolling updates

## Phase 10 — Mobile

- React Native / Expo
- Shared API contracts
- Shared validation
- Push notifications
- Native location capabilities

---

# 35. MVP Definition of Done

A user can:

```text
1. Register
2. Login
3. Create a plan
4. Set budget / duration / radius / vibe
5. Discover nearby places
6. Generate an itinerary
7. Share the plan
8. Friends join through a link
9. Members vote
10. Updates appear in real time
11. Confirm the final plan
12. Complete the plan
13. Save a memory
```

Technical requirements:

```text
✓ React + TypeScript
✓ Spring Boot
✓ API Gateway
✓ 4+ microservices
✓ MySQL
✓ MongoDB
✓ Redis
✓ Kafka
✓ WebSocket
✓ Docker
✓ Automated tests
✓ CI/CD
```

---

# 36. Long-Term Vision

UNPLND should become more than a random activity generator.

> **A social engine for deciding what to do next.**

Instead of asking:

> "What should we do tonight?"

Users simply tell UNPLND:

```text
Who?
When?
How much?
What vibe?
```

UNPLND handles the rest.

```text
                 PEOPLE
                    +
                  TIME
                    +
                 BUDGET
                    +
                  VIBE
                    |
                    v
              ┌───────────┐
              │  UNPLND   │
              └─────┬─────┘
                    |
        ┌───────────┼───────────┐
        v           v           v
      PLACES    ITINERARY    PEOPLE
        |           |           |
        └───────────┼───────────┘
                    v
                 LET'S GO
                    |
                    v
                 MEMORY
                    |
                    v
              BETTER NEXT TIME
```

---

# 37. One-Line Pitch

> **UNPLND turns "I don't know, you decide" into a plan worth leaving the house for.**

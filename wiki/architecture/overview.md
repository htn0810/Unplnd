# Architecture Overview

## System diagram

Target architecture (spec §11). Only the parts marked ✅ exist today.

```text
                React PWA (webapp) ✅  ── mock JSON today
                        │  HTTPS / WSS
                        ▼
                  API Gateway  (planned)
                        │  /api/v1/...
   ┌──────────────┬─────┴────────┬───────────────┬──────────────────┐
   ▼              ▼              ▼               ▼                  ▼
identity-     profile-       plan-service    place-service    notification-
service ✅    service        (planned)       (planned)        service (planned)
   │          (planned)          │               │                  ▲   │
   ▼              ▼              ▼               ▼                  │   ▼
 MySQL ✅       MySQL          MongoDB        MongoDB + Redis       │  WebSocket → clients
   │                             │               │                  │
   └──────── user-events ────────┴── plan-events / place-events ───► Kafka (planned)

Redis (planned): cache · presence · rate limiting — never a source of truth
```

## Services and packages

| Module | Responsibility | Status |
|---|---|---|
| [web](../modules/web.md) | React PWA, all user screens | Implemented on mock data |
| [identity-service](../modules/identity-service.md) | Authentication: email/password, Google & Facebook OAuth2, JWT issuing | Sign-up only |
| `commons` | Shared Java library (`ApiResponse`) | Implemented |
| [api-gateway](../modules/api-gateway.md) | Public entry, routing, JWT validation, rate limit, CORS | Planned |
| [profile-service](../modules/profile-service.md) | Profiles, friends, preferences | Planned |
| [plan-service](../modules/plan-service.md) | Plans, members, lifecycle, itinerary, voting, invites, memories | Planned |
| [place-service](../modules/place-service.md) | POI search, providers, caching | Planned |
| [notification-service](../modules/notification-service.md) | Notifications, WebSocket delivery, presence | Planned |
| [api-contracts](../modules/api-contracts.md) / [event-contracts](../modules/event-contracts.md) | OpenAPI / Kafka schemas | Planned |
| [mobile](../modules/mobile.md) | React Native + Expo | Planned |

## Communication choices

| Mechanism | Used for |
|---|---|
| REST (via gateway) | Anything needing an immediate answer (sign-up, create plan, vote) |
| Kafka | Async side effects and fan-out (profile creation on `USER_REGISTERED`, notifications) |
| WebSocket | Server → client push of changes; never request/response |

## External integrations

| Integration | Used by | Status |
|---|---|---|
| OpenStreetMap tiles via Stadia "Alidade Smooth" | web maps | Implemented (keyless on localhost only) |
| Overpass API (`overpass-api.de`, fallback `overpass.kumi.systems`) | web maps, directly from browser | Implemented (temporary) |
| Overpass / OSRM behind `PlaceProvider` / `RoutingProvider` | place-service | Planned |
| Google, Facebook OAuth2 | identity-service | Planned |

## Ports

No Docker Compose yet. Known local ports:

| Port | What |
|---|---|
| 5173 | Vite dev server (webapp default) |
| 8081 | identity-service (context path `/identity`) |
| 3306 | MySQL (local install) |

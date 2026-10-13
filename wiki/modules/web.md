# Module: web

React PWA in `webapp/`. Architecture: [frontend](../architecture/frontend.md).

## Why it exists

The only client today (mobile later). Mobile-first UI for the whole UNPLND flow: create → share → vote → go → remember.

## Status

**Implemented on mock data.** Every MVP screen works; no real backend calls yet.

## Features

| Feature | Screens | Query hooks / stores |
|---|---|---|
| `auth` | Sign in, sign up (username/password + Google/Facebook buttons) | `useSignIn`, `useSignUp` (mock) |
| `plan` | Home hero, create wizard, plan list, plan detail, join | `usePlanDetail`, `useUpcomingPlans`, `useRecentPlans`, `usePlanByInviteCode`, `useGeneratePlan`; `createPlanStore` |
| `place` | Explore (list + map) | `useNearbyPlaces`; `useOsmPois` (real Overpass data) |
| `notification` | Notifications | `useNotifications`, `useNotificationActions` |
| `profile` | Profile, friends around | `useMe`, `useProfile`, `useFriendsAround` |

## Exposes / consumes

- Consumes: mock JSON (`public/resources/mock-data/`), Overpass API, Stadia/OSM tiles. Planned: gateway REST `/api/v1/...`, WebSocket `/ws`.
- Exposes: nothing to other modules (future `packages/` may share types/validation with mobile).

## Does NOT belong here

Authorization decisions, plan state transitions, itinerary generation and place search — all temporarily in the browser for the mock, all owned by backend services later.

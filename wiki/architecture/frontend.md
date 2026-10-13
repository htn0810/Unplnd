# Frontend Architecture

React 19 PWA in `webapp/` (Vite, TypeScript, Tailwind v4, shadcn/ui). Folder rules: [`CLAUDE.md` §4–5](../../CLAUDE.md). Visual language (Ghibli-inspired Day/Twilight themes, mascot "Bông"): [front-end design rules](../../.claude/skills/front-end-design/front-end-design-rule.md).

## Folder roles

| Folder | Role |
|---|---|
| `pages/` | Thin route screens; compose features |
| `features/{auth,plan,place,notification,profile}` | Self-contained feature modules; import each other only via `index.ts` |
| `services/` | `apiClient` (mock loader today), `queryClient`, `overpassClient`, `connectivity` |
| `store/` | Global Zustand (`themeStore`) |
| `components/` | Shared UI (`map/VietnamMap`, `offline/OfflineGate`, header/footer, `ui/` = shadcn) |
| `hooks/`, `constants/`, `i18n/` | Shared hooks, magic values, EN/VI translations |

## Data flow

```text
Page ─► feature component ─► useXxx() query hook ─► xxxService ─► apiClient.getMock()
                                     ▲                                  │
                                     └── TanStack Query cache ◄─────────┘   JSON in public/resources/mock-data/
```

When the backend exists, only the feature services change: `getMock(file)` becomes `apiClient` calls to the gateway (`/api/v1/...`), unwrapping `ApiResponse.result` and throwing on non-2xx.

## Server vs client state

| Kind | Where | Examples |
|---|---|---|
| Server state | TanStack Query, key factories per feature | `planKeys`, `placeKeys`, `profileKeys`, `notificationKeys`, `osmKeys` |
| Client state | Zustand | `createPlanStore` (wizard), `themeStore` (Day/Twilight) |
| Session mock persistence | `planService` in-memory `Map` | generated / edited plans until reload |

Mutations patch the cache (`setQueryData`) and invalidate list queries — e.g. generating a plan seeds `planKeys.detail(id)` and invalidates `planKeys.upcoming()`.

## Realtime (planned)

WebSocket messages will be *signals to refresh*: on an event the client invalidates or patches the matching query (e.g. `PLAN_VOTE_UPDATED` → `planKeys.detail(planId)`). Today other members' votes are simulated in the browser (`useSimulatedVotes`). See [realtime](realtime.md).

## Routing

```text
AppLayout (header, page transition, footer, mobile nav)
├── /                      Home
├── /explore               Explore places + map
├── /plans                 My plans
├── /plans/:planId         Plan detail (itinerary, votes, map, edit)
├── /profile               Profile
├── /notifications         Notifications
├── /join/:inviteCode      Join via invite
└── *                      Not found
Focus mode (no shell): /plans/new (wizard) · /sign-in · /sign-up
```

All routes except Home are lazy-loaded. **No auth guard yet** — every page is reachable without signing in.

## Cross-cutting

- **i18n:** every UI string in `en.json` and `vi.json`; keys type-checked.
- **Offline:** `OfflineGate` shows a full-screen state when `navigator.onLine` is false; in production `public/sw.js` serves `offline.html` for failed navigations.
- **Maps:** `components/map/VietnamMap` (Leaflet) — see [place-discovery](../features/place-discovery.md).

# Feature: Place Discovery

**Status: Partial** — Explore works with mock places plus **real OpenStreetMap places** loaded live; place-service planned.

## Business purpose

Show places worth leaving the house for, near the user or anywhere in Vietnam, and give plans real surroundings on the map.

## User workflow

`/explore`: search, filter by vibe and scope (near me / whole country / a province), pick a place in the list or on the map. Plan detail shows a trip map per day.

## Data flow

```text
Curated places:  ExploreView ─► useNearbyPlaces ─► mock nearby-places.json
Real places:     VietnamMap (zoom ≥ 15) ─► useOsmPois(bbox) ─► overpassClient ─► Overpass API
                 (overpass-api.de, fallback overpass.kumi.systems; per-attempt timeout 10 s)
Tiles:           Stadia "Alidade Smooth" (OSM data), Day / Twilight variants
Planned:         web ─► /api/v1/places ─► place-service ─► PlaceProvider (Overpass) + Redis cache
```

## Rules

- Real places load only from zoom 15 (viewport small enough); bbox snapped to a 0.01° grid so small pans reuse the cache.
- Categories: food, cafés, nightlife, shops, offices, sights; max 50 per category per query; only named places.
- Stadia tiles are keyless on localhost only — production needs an account or own tile server.

## Modules

[web](../modules/web.md) · [place-service](../modules/place-service.md) *(planned)*

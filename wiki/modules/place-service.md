# Module: place-service

> **Status: Planned** (roadmap Phase 3). Today the web app calls Overpass directly and uses mock places.

- *Planned:* nearby/geospatial search, place details, categories, distance, estimated cost.
- *Planned:* providers behind `PlaceProvider` (OSM/Overpass) and `RoutingProvider` (OSRM); business logic never depends on a concrete provider.
- *Planned:* MongoDB `places`, `categories`; Redis cache for provider responses.
- *Planned:* produces PLACE_UPDATED; serves plan-service over REST.
- Note: the web's Overpass client (endpoint fallback, category mapping) is a working prototype of the provider logic to move here.

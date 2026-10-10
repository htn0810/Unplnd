/** Real places shown on maps, loaded from OpenStreetMap (Overpass API) */
export const POI_CATEGORIES = ['food', 'cafe', 'nightlife', 'shop', 'office', 'sight'] as const

export type PoiCategory = (typeof POI_CATEGORIES)[number]

export const POI_META: Record<PoiCategory, { emoji: string; color: string; overpass: string[] }> = {
  food: { emoji: '🍜', color: '#d9673e', overpass: ['nwr["amenity"~"^(restaurant|fast_food|food_court|ice_cream)$"]'] },
  cafe: { emoji: '☕', color: '#9a6a3f', overpass: ['nwr["amenity"="cafe"]'] },
  nightlife: { emoji: '🍸', color: '#7a54b0', overpass: ['nwr["amenity"~"^(bar|pub|nightclub|biergarten)$"]'] },
  shop: { emoji: '🛍️', color: '#c2415a', overpass: ['nwr["shop"]', 'nwr["amenity"="marketplace"]'] },
  office: { emoji: '🏢', color: '#3e86b4', overpass: ['nwr["office"]'] },
  sight: { emoji: '📸', color: '#3f7d5c', overpass: ['nwr["tourism"~"^(attraction|museum|viewpoint|gallery)$"]', 'nwr["leisure"~"^(park|garden)$"]', 'nwr["historic"]'] },
}

/** Below this zoom the viewport is too big to list places */
export const POI_MIN_ZOOM = 15

/** Per category, so busy streets of shops don't crowd out cafés */
export const POI_LIMIT_PER_CATEGORY = 50

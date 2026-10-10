import { POI_CATEGORIES, POI_LIMIT_PER_CATEGORY, POI_META, type PoiCategory } from '@/constants/mapPois'
import type { Bbox, OsmPoi } from '@/types/osm'

/**
 * OpenStreetMap places via the public Overpass API (free, no key; mind its fair-use limits).
 * Later this moves behind place-service's PlaceProvider, and the frontend calls /api/v1/places instead.
 */
const OVERPASS_ENDPOINTS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter']

/** Public instances are often busy (504/429): give each a few seconds, then try the next */
const ATTEMPT_TIMEOUT_MS = 10_000

/** Start with whichever endpoint answered last */
let preferred = 0

type OverpassElement = {
  type: 'node' | 'way' | 'relation'
  id: number
  lat?: number
  lon?: number
  center?: { lat: number; lon: number }
  tags?: Record<string, string>
}

const categoryOf = (tags: Record<string, string>): PoiCategory | null => {
  const { amenity, shop, office, tourism, leisure, historic } = tags
  if (amenity === 'cafe') return 'cafe'
  if (amenity && /^(restaurant|fast_food|food_court|ice_cream)$/.test(amenity)) return 'food'
  if (amenity && /^(bar|pub|nightclub|biergarten)$/.test(amenity)) return 'nightlife'
  if (shop || amenity === 'marketplace') return 'shop'
  if (office) return 'office'
  if (tourism || leisure || historic) return 'sight'
  return null
}

const buildQuery = ([south, west, north, east]: Bbox) => {
  const bbox = `(${south},${west},${north},${east})`
  const blocks = POI_CATEGORIES.map((category) => `(${POI_META[category].overpass.map((selector) => `${selector}["name"]${bbox};`).join('')});out center ${POI_LIMIT_PER_CATEGORY};`)
  return `[out:json][timeout:10];${blocks.join('')}`
}

const toPoi = (element: OverpassElement): OsmPoi | null => {
  const tags = element.tags ?? {}
  const lat = element.lat ?? element.center?.lat
  const lng = element.lon ?? element.center?.lon
  const category = categoryOf(tags)
  if (lat === undefined || lng === undefined || !tags.name || !category) return null
  const names = Object.fromEntries(Object.entries(tags).filter(([key]) => key.startsWith('name:')).map(([key, value]) => [key.slice(5), value]))
  const street = [tags['addr:housenumber'], tags['addr:street']].filter(Boolean).join(' ')
  return {
    id: `${element.type}/${element.id}`,
    category,
    lat,
    lng,
    name: tags.name,
    names,
    cuisine: tags.cuisine?.replaceAll(';', ', ').replaceAll('_', ' '),
    openingHours: tags.opening_hours,
    address: street || undefined,
    kind: (tags.amenity ?? tags.shop ?? tags.office ?? tags.tourism ?? tags.leisure ?? tags.historic ?? '').replaceAll('_', ' '),
  }
}

async function queryOverpass(query: string, signal?: AbortSignal): Promise<OverpassElement[]> {
  let lastError: unknown
  for (let attempt = 0; attempt < OVERPASS_ENDPOINTS.length; attempt++) {
    const index = (preferred + attempt) % OVERPASS_ENDPOINTS.length
    const timeout = AbortSignal.timeout(ATTEMPT_TIMEOUT_MS)
    try {
      const response = await fetch(OVERPASS_ENDPOINTS[index], {
        method: 'POST',
        body: new URLSearchParams({ data: query }),
        signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
      })
      if (!response.ok) throw new Error(`Overpass request failed (${response.status})`)
      const { elements } = (await response.json()) as { elements: OverpassElement[] }
      preferred = index
      return elements
    } catch (error) {
      // The caller gave up (view moved on): stop instead of trying other endpoints
      if (signal?.aborted) throw error
      lastError = error
    }
  }
  throw lastError
}

export async function fetchOsmPois(bbox: Bbox, signal?: AbortSignal): Promise<OsmPoi[]> {
  const elements = await queryOverpass(buildQuery(bbox), signal)
  const seen = new Set<string>()
  return elements.flatMap((element) => {
    const poi = toPoi(element)
    if (!poi || seen.has(poi.id)) return []
    seen.add(poi.id)
    return [poi]
  })
}

import type { PoiCategory } from '@/constants/mapPois'

/** A named place from OpenStreetMap */
export type OsmPoi = {
  /** "node/123", also the openstreetmap.org path */
  id: string
  category: PoiCategory
  lat: number
  lng: number
  name: string
  names: Record<string, string>
  cuisine?: string
  openingHours?: string
  address?: string
  kind: string
}

/** South, west, north, east */
export type Bbox = [number, number, number, number]

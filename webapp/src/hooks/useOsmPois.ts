import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { POI_MIN_ZOOM } from '@/constants/mapPois'
import { fetchOsmPois } from '@/services/overpassClient'
import type { Bbox } from '@/types/osm'

export const osmKeys = {
  all: ['osm'] as const,
  pois: (bbox: Bbox) => [...osmKeys.all, 'pois', ...bbox] as const,
}

/** Grid the bbox is snapped to, so small pans reuse the cached area */
const GRID = 0.01

const snap = ([south, west, north, east]: Bbox): Bbox => [
  Math.floor(south / GRID) * GRID,
  Math.floor(west / GRID) * GRID,
  Math.ceil(north / GRID) * GRID,
  Math.ceil(east / GRID) * GRID,
].map((value) => Number(value.toFixed(2))) as Bbox

/** Named OpenStreetMap places inside the map view; idle until zoomed in enough */
export function useOsmPois(bbox: Bbox | null, zoom: number) {
  const enabled = bbox !== null && zoom >= POI_MIN_ZOOM
  const snapped = bbox ? snap(bbox) : ([0, 0, 0, 0] as Bbox)
  return useQuery({
    queryKey: osmKeys.pois(snapped),
    queryFn: ({ signal }) => fetchOsmPois(snapped, signal),
    enabled,
    staleTime: Infinity,
    gcTime: 30 * 60 * 1000,
    // overpassClient already falls back across endpoints
    retry: false,
    placeholderData: keepPreviousData,
  })
}

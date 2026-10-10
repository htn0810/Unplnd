import { useEffect, useMemo, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap, useMapEvents } from 'react-leaflet'
import { POI_CATEGORIES, POI_MIN_ZOOM, type PoiCategory } from '@/constants/mapPois'
import { useOsmPois } from '@/hooks/useOsmPois'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useThemeStore } from '@/store/themeStore'
import type { Bbox } from '@/types/osm'
import { cn } from '@/utils/cn'
import { MapControls, type PoiStatus } from './MapControls'
import { OsmPoiLayer } from './OsmPoiLayer'

export type MapMarker = {
  id: string
  lat: number
  lng: number
  label: string
  /** Emoji or short text (e.g. stop number) shown in the pin */
  content: string
  color: string
  active?: boolean
}

export type MapRoute = {
  id: string
  color: string
  points: [number, number][]
}

type VietnamMapProps = {
  markers: MapMarker[]
  routes?: MapRoute[]
  onMarkerClick?: (id: string) => void
  className?: string
  ariaLabel: string
  /** Real OpenStreetMap places (food, shops, offices, …) when zoomed in */
  showPlaces?: boolean
}

/** Whole country, with a little sea around it */
const VIETNAM_BOUNDS = L.latLngBounds([7.5, 101.0], [23.8, 110.5])

/**
 * Stadia "Alidade Smooth" tiles: OpenStreetMap streets and names, quiet enough for real places to sit on top.
 * Keyless on localhost; production needs a free Stadia account (domain auth) or a self-hosted tile service via the MapProvider.
 */
const TILES = { light: 'alidade_smooth', dark: 'alidade_smooth_dark' } as const
const tileUrl = (style: string) => `https://tiles.stadiamaps.com/tiles/${style}/{z}/{x}/{y}{r}.png`
const TILE_ATTRIBUTION =
  '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
const MAX_ZOOM = 19

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`)

const pinIcon = (marker: MapMarker) =>
  L.divIcon({
    className: '',
    html: `<div class="unplnd-pin${marker.active ? ' is-active' : ''}" style="--pin:${marker.color}"><span>${escapeHtml(marker.content)}</span></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    tooltipAnchor: [0, -38],
  })

const boundsOf = (markers: MapMarker[]) => (markers.length === 0 ? VIETNAM_BOUNDS : L.latLngBounds(markers.map((marker) => [marker.lat, marker.lng])))

const FIT_OPTIONS = { padding: [56, 56] as [number, number], maxZoom: 16 }

function frame(map: L.Map, markers: MapMarker[], animate: boolean) {
  if (animate) map.flyToBounds(boundsOf(markers), { ...FIT_OPTIONS, duration: 0.8 })
  else map.fitBounds(boundsOf(markers), { ...FIT_OPTIONS, animate: false })
}

/** Keeps the view framed on the markers (or the whole country when there are none) */
function FitToMarkers({ markers, animate }: { markers: MapMarker[]; animate: boolean }) {
  const map = useMap()
  const key = markers.map((marker) => `${marker.id}:${marker.lat}:${marker.lng}`).join('|')

  useEffect(() => {
    frame(map, markers, animate)
    // Only re-frame when the set of markers changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, key, animate])

  return null
}

/** Moves to the active marker, close enough to see the real places around it */
function FocusActive({ marker, animate }: { marker?: MapMarker; animate: boolean }) {
  const map = useMap()
  const lat = marker?.lat
  const lng = marker?.lng

  useEffect(() => {
    if (lat === undefined || lng === undefined) return
    const zoom = Math.max(map.getZoom(), POI_MIN_ZOOM + 1)
    if (animate) map.flyTo([lat, lng], zoom, { duration: 0.8 })
    else map.setView([lat, lng], zoom, { animate: false })
  }, [map, lat, lng, animate])

  return null
}

const nearestTo = (center: L.LatLng, markers: MapMarker[]) =>
  markers.reduce<MapMarker | undefined>((best, marker) => (!best || center.distanceTo([marker.lat, marker.lng]) < center.distanceTo([best.lat, best.lng]) ? marker : best), undefined)

/** Zooms in far enough for real places, onto a pin when there is one (the view's center may be empty countryside) */
function showPlacesNear(map: L.Map, marker: MapMarker | undefined, animate: boolean) {
  const target = marker ? L.latLng(marker.lat, marker.lng) : map.getCenter()
  const zoom = POI_MIN_ZOOM + 1
  if (animate) map.flyTo(target, zoom, { duration: 0.8 })
  else map.setView(target, zoom, { animate: false })
}

type View = { bbox: Bbox; zoom: number }

const viewOf = (map: L.Map): View => {
  const bounds = map.getBounds()
  return {
    bbox: [bounds.getSouth(), bounds.getWest(), bounds.getNorth(), bounds.getEast()],
    zoom: map.getZoom(),
  }
}

/** Reports the visible area after every pan/zoom */
function ViewTracker({ onChange }: { onChange: (view: View) => void }) {
  const map = useMapEvents({ moveend: () => onChange(viewOf(map)) })
  return null
}

/** Leaflet map of Vietnam: OpenStreetMap streets, real OpenStreetMap places, the app's own pins on top */
export function VietnamMap({ markers, routes = [], onMarkerClick, className, ariaLabel, showPlaces = true }: VietnamMapProps) {
  // Reduced motion (or the dev `?noanim` screenshot mode) disables fades, zoom animation and fly-to
  const prefersReducedMotion = usePrefersReducedMotion()
  const animate = !prefersReducedMotion && !document.documentElement.classList.contains('no-anim')
  const theme = useThemeStore((state) => state.resolved)
  const icons = useMemo(() => new Map(markers.map((marker) => [marker.id, pinIcon(marker)])), [markers])
  const activeMarker = markers.find((marker) => marker.active)

  const [map, setMap] = useState<L.Map | null>(null)
  const [view, setView] = useState<View | null>(null)
  const [categories, setCategories] = useState(() => new Set<PoiCategory>(POI_CATEGORIES))
  const pois = useOsmPois(showPlaces ? (view?.bbox ?? null) : null, view?.zoom ?? 0)

  const zoomedIn = (view?.zoom ?? 0) >= POI_MIN_ZOOM
  const visiblePois = zoomedIn && pois.data ? pois.data.filter((poi) => categories.has(poi.category)) : []
  const status: PoiStatus = !zoomedIn ? 'zoom' : pois.isError ? 'error' : pois.isFetching || !pois.data ? 'loading' : 'ready'

  const toggleCategory = (category: PoiCategory) =>
    setCategories((current) => {
      const next = new Set(current)
      if (next.has(category)) next.delete(category)
      else next.add(category)
      return next
    })

  return (
    <div role="region" aria-label={ariaLabel} className={cn('relative isolate overflow-hidden rounded-3xl ring-1 ring-border', className)}>
      <MapContainer
        ref={setMap}
        bounds={VIETNAM_BOUNDS}
        maxBounds={VIETNAM_BOUNDS.pad(0.3)}
        minZoom={5}
        maxZoom={MAX_ZOOM}
        zoomControl={false}
        scrollWheelZoom={false}
        fadeAnimation={animate}
        zoomAnimation={animate}
        markerZoomAnimation={animate}
        className="unplnd-map size-full"
      >
        <TileLayer key={theme} url={tileUrl(TILES[theme])} attribution={TILE_ATTRIBUTION} maxZoom={MAX_ZOOM} className="unplnd-base-tiles" />
        {routes.map((route) => (
          <Polyline
            key={route.id}
            positions={route.points}
            pathOptions={{
              color: route.color,
              weight: 3,
              opacity: 0.85,
              dashArray: '6 8',
            }}
          />
        ))}
        {showPlaces && <OsmPoiLayer pois={visiblePois} zoom={view?.zoom ?? 0} />}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={icons.get(marker.id)}
            zIndexOffset={marker.active ? 2000 : 1000}
            eventHandlers={{ click: () => onMarkerClick?.(marker.id) }}
            title={marker.label}
            alt={marker.label}
          >
            <Tooltip direction="top" className="unplnd-tooltip">
              {marker.label}
            </Tooltip>
          </Marker>
        ))}
        <FitToMarkers markers={markers} animate={animate} />
        <FocusActive marker={activeMarker} animate={animate} />
        <ViewTracker onChange={setView} />
      </MapContainer>
      {map && (
        <MapControls
          showPlaces={showPlaces}
          categories={categories}
          onToggleCategory={toggleCategory}
          status={status}
          count={visiblePois.length}
          onZoomIn={() => map.zoomIn()}
          onZoomOut={() => map.zoomOut()}
          onRecenter={() => frame(map, markers, animate)}
          onShowPlaces={() => showPlacesNear(map, activeMarker ?? nearestTo(map.getCenter(), markers), animate)}
          onRetry={() => void pois.refetch()}
        />
      )}
    </div>
  )
}

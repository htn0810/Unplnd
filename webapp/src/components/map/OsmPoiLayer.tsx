import L from 'leaflet'
import { ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Marker, Popup, Tooltip } from 'react-leaflet'
import { POI_CATEGORIES, POI_META, type PoiCategory } from '@/constants/mapPois'
import type { OsmPoi } from '@/types/osm'

/** Zoom from which places show their emoji; below it they are small dots so the plan's own pins stay readable */
const DETAIL_ZOOM = 17

const makeIcon = (category: PoiCategory, detailed: boolean) => {
  const size = detailed ? 26 : 12
  return L.divIcon({
    className: '',
    html: `<div class="unplnd-poi${detailed ? '' : ' is-dot'}" style="--poi:${POI_META[category].color}">${detailed ? `<span>${POI_META[category].emoji}</span>` : ''}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    tooltipAnchor: [0, -size / 2 - 2],
  })
}

/** Two icons per category (dot, detailed), shared by every marker */
const ICONS = Object.fromEntries(POI_CATEGORIES.map((category) => [category, { dot: makeIcon(category, false), detailed: makeIcon(category, true) }])) as Record<
  PoiCategory,
  { dot: L.DivIcon; detailed: L.DivIcon }
>

const localName = (poi: OsmPoi, language: string) => poi.names[language] ?? poi.name

/** Real OpenStreetMap places as small painted dots; one popup at a time */
export function OsmPoiLayer({ pois, zoom }: { pois: OsmPoi[]; zoom: number }) {
  const { t, i18n } = useTranslation()
  const [openId, setOpenId] = useState<string | null>(null)
  const open = pois.find((poi) => poi.id === openId)
  const language = i18n.resolvedLanguage ?? 'en'

  return (
    <>
      {pois.map((poi) => (
        <Marker
          key={poi.id}
          position={[poi.lat, poi.lng]}
          icon={zoom >= DETAIL_ZOOM ? ICONS[poi.category].detailed : ICONS[poi.category].dot}
          title={localName(poi, language)}
          alt={localName(poi, language)}
          eventHandlers={{ click: () => setOpenId(poi.id) }}
        >
          <Tooltip direction="top" className="unplnd-tooltip">
            {localName(poi, language)}
          </Tooltip>
        </Marker>
      ))}
      {open && (
        <Popup position={[open.lat, open.lng]} offset={[0, -10]} className="unplnd-popup" eventHandlers={{ remove: () => setOpenId(null) }}>
          <div className="flex min-w-48 flex-col gap-1.5">
            <span className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
              {POI_META[open.category].emoji} {t(`map.categories.${open.category}`)}
              {open.kind && <span className="font-medium normal-case"> · {open.kind}</span>}
            </span>
            <strong className="font-heading text-base leading-tight">{localName(open, language)}</strong>
            {open.cuisine && <span className="text-sm capitalize">{open.cuisine}</span>}
            {open.address && <span className="text-sm text-muted-foreground">{open.address}</span>}
            {open.openingHours && (
              <span className="text-xs text-muted-foreground">
                {t('map.hours')}: <span className="font-mono">{open.openingHours}</span>
              </span>
            )}
            <a
              href={`https://www.openstreetmap.org/${open.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-primary underline-offset-4 hover:underline"
            >
              {t('map.openInOsm')}
              <ExternalLink aria-hidden className="size-3.5" />
            </a>
          </div>
        </Popup>
      )}
    </>
  )
}

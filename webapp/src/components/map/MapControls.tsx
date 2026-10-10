import { Crosshair, Loader2, Minus, Plus, Search, TriangleAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { POI_CATEGORIES, POI_META, POI_MIN_ZOOM, type PoiCategory } from '@/constants/mapPois'
import { cn } from '@/utils/cn'

export type PoiStatus = 'zoom' | 'loading' | 'error' | 'ready'

type MapControlsProps = {
  showPlaces: boolean
  categories: Set<PoiCategory>
  onToggleCategory: (category: PoiCategory) => void
  status: PoiStatus
  count: number
  onZoomIn: () => void
  onZoomOut: () => void
  onRecenter: () => void
  onShowPlaces: () => void
  onRetry: () => void
}

const SURFACE = 'border border-border bg-card/90 text-card-foreground shadow-sm backdrop-blur-sm'
const ROUND_BUTTON = cn(SURFACE, 'flex size-10 items-center justify-center rounded-full transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none')

/** Overlay UI on top of the Leaflet map: place filters, zoom, recenter and data status */
export function MapControls({ showPlaces, categories, onToggleCategory, status, count, onZoomIn, onZoomOut, onRecenter, onShowPlaces, onRetry }: MapControlsProps) {
  const { t } = useTranslation()

  return (
    <>
      {showPlaces && (
        <div role="group" aria-label={t('map.filterLabel')} className="scrollbar-none absolute inset-x-0 top-0 z-1000 flex gap-1.5 overflow-x-auto p-3">
          {POI_CATEGORIES.map((category) => {
            const on = categories.has(category)
            return (
              <button
                key={category}
                type="button"
                aria-pressed={on}
                onClick={() => onToggleCategory(category)}
                style={on ? { borderColor: POI_META[category].color } : undefined}
                className={cn(
                  SURFACE,
                  'flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-bold transition-all focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
                  on ? 'border-2' : 'text-muted-foreground opacity-75 hover:opacity-100',
                )}
              >
                <span aria-hidden>{POI_META[category].emoji}</span>
                {t(`map.categories.${category}`)}
              </button>
            )
          })}
        </div>
      )}

      <div className="absolute right-3 bottom-6 z-1000 flex flex-col gap-1.5">
        <button type="button" className={ROUND_BUTTON} aria-label={t('map.zoomIn')} onClick={onZoomIn}>
          <Plus className="size-4" />
        </button>
        <button type="button" className={ROUND_BUTTON} aria-label={t('map.zoomOut')} onClick={onZoomOut}>
          <Minus className="size-4" />
        </button>
        <button type="button" className={ROUND_BUTTON} aria-label={t('map.recenter')} onClick={onRecenter}>
          <Crosshair className="size-4" />
        </button>
      </div>

      {showPlaces && (
        <div aria-live="polite" className="pointer-events-none absolute bottom-6 left-3 z-1000 flex max-w-[calc(100%-5rem)]">
          {status === 'zoom' && (
            <button type="button" onClick={onShowPlaces} className={cn(SURFACE, 'pointer-events-auto flex min-h-9 items-center gap-2 rounded-full px-3 text-xs font-bold hover:bg-muted')}>
              <Search aria-hidden className="size-3.5 shrink-0" />
              {t('map.zoomHint', { zoom: POI_MIN_ZOOM })}
            </button>
          )}
          {status === 'loading' && (
            <span className={cn(SURFACE, 'flex min-h-9 items-center gap-2 rounded-full px-3 text-xs font-bold')}>
              <Loader2 aria-hidden className="size-3.5 animate-spin" />
              {t('map.loading')}
            </span>
          )}
          {status === 'error' && (
            <button type="button" onClick={onRetry} className={cn(SURFACE, 'pointer-events-auto flex min-h-9 items-center gap-2 rounded-full px-3 text-xs font-bold text-destructive hover:bg-muted')}>
              <TriangleAlert aria-hidden className="size-3.5 shrink-0" />
              {t('map.error')}
            </button>
          )}
          {status === 'ready' && <span className={cn(SURFACE, 'flex min-h-9 items-center rounded-full px-3 text-xs font-bold')}>{count > 0 ? t('map.count', { count }) : t('map.empty')}</span>}
        </div>
      )}
    </>
  )
}

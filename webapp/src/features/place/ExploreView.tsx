import { useMemo, useRef, useState } from 'react'
import { BongSprite } from '@/components/BongSprite'
import { MapPin, Search, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { VietnamMap, type MapMarker } from '@/components/map/VietnamMap'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { HOME_PROVINCE, PROVINCES, type ProvinceId } from '@/constants/provinces'
import { VIBE_META, VIBES, type Vibe } from '@/constants/vibes'
import { cn } from '@/utils/cn'
import { useNearbyPlaces } from './placeQueries'
import { PlaceRow } from './PlaceRow'

export function ExploreView() {
  const { t, i18n } = useTranslation()
  const { data: places = [], isPending } = useNearbyPlaces()
  /** 'near' = the user's city with distances; 'all' = whole country; otherwise one province */
  const [scope, setScope] = useState<'near' | 'all' | ProvinceId>('near')
  // One Leaflet instance only: the map moves between the list column (mobile) and the side panel (desktop)
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [query, setQuery] = useState('')
  const [vibe, setVibe] = useState<Vibe | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const rowRefs = useRef(new Map<string, HTMLButtonElement>())

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return places
      .filter((place) => (scope === 'all' ? true : place.province === (scope === 'near' ? HOME_PROVINCE : scope)))
      .filter((place) => (vibe ? place.vibe === vibe : true))
      .filter((place) => (needle ? place.name.toLowerCase().includes(needle) : true))
      .sort((a, b) => a.distanceMeters - b.distanceMeters)
  }, [places, query, vibe, scope])

  const selectFromMap = (id: string | null) => {
    setSelectedId(id)
    if (id) rowRefs.current.get(id)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  const resetFilters = () => {
    setQuery('')
    setVibe(null)
    setScope('all')
  }

  const markers: MapMarker[] = filtered.map((place) => ({
    id: place.id,
    lat: place.lat,
    lng: place.lng,
    content: place.emoji,
    color: VIBE_META[place.vibe].color,
    label: place.name,
    active: place.id === selectedId,
  }))

  return (
    <main className="mx-auto w-full max-w-screen-xl px-4 pt-6 pb-16 md:px-6 lg:px-8 lg:pt-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-[40px] leading-[44px] font-bold tracking-tight md:text-[56px] md:leading-[60px]">{t('explore.title')}</h1>
        <p className="text-muted-foreground">{t('explore.subtitle')}</p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:mt-10 lg:grid-cols-[420px_minmax(0,1fr)] lg:gap-8">
        <div className="flex min-w-0 flex-col gap-4">
          <div className="relative">
            <Search aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              aria-label={t('explore.searchLabel')}
              placeholder={t('explore.searchPlaceholder')}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-12 rounded-xl pr-12 pl-11 text-base [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <Button variant="ghost" size="icon-sm" className="absolute top-1/2 right-1.5 -translate-y-1/2" aria-label={t('explore.close')} onClick={() => setQuery('')}>
                <X />
              </Button>
            )}
          </div>

          <label className="flex h-11 items-center gap-2 rounded-xl bg-card px-3 text-sm font-semibold ring-1 ring-border paper-shadow">
            <MapPin aria-hidden className="size-4 shrink-0 text-brand-pink" />
            <span className="sr-only">{t('explore.scope')}</span>
            <select
              value={scope}
              onChange={(event) => {
                setScope(event.target.value as typeof scope)
                setSelectedId(null)
              }}
              className="min-w-0 flex-1 cursor-pointer appearance-none bg-transparent outline-none"
            >
              <option value="near" className="bg-popover">📍 {t('explore.scopeNear')}</option>
              <option value="all" className="bg-popover">🇻🇳 {t('explore.scopeAll')}</option>
              {PROVINCES.map((province) => (
                <option key={province.id} value={province.id} className="bg-popover">
                  {province.emoji} {i18n.resolvedLanguage === 'vi' ? province.name : province.nameEn}
                </option>
              ))}
            </select>
          </label>

          <div role="radiogroup" aria-label={t('explore.searchLabel')} className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 [mask-image:linear-gradient(to_right,black_85%,transparent)] md:-mx-6 md:px-6 lg:mx-0 lg:px-0">
            <FilterChip active={vibe === null} onClick={() => setVibe(null)}>
              {t('explore.all')}
            </FilterChip>
            {VIBES.map((item) => (
              <FilterChip key={item} active={vibe === item} onClick={() => setVibe(vibe === item ? null : item)} activeClassName={cn('ring-2 bg-surface-elevated', VIBE_META[item].selectedRingClass, VIBE_META[item].textClass)}>
                <span aria-hidden>{VIBE_META[item].emoji}</span>
                {VIBE_META[item].label}
              </FilterChip>
            ))}
          </div>

          {!isDesktop && <VietnamMap markers={markers} onMarkerClick={selectFromMap} ariaLabel={t('explore.mapLabel')} className="aspect-[4/3] md:aspect-[16/9]" />}

          <p aria-live="polite" className="text-sm text-muted-foreground">
            {t('explore.results', { count: filtered.length })}
          </p>

          <div className="flex flex-col gap-3">
            {isPending && [0, 1, 2].map((key) => <Skeleton key={key} className="h-[88px] rounded-2xl" />)}
            <AnimatePresence mode="popLayout" initial={false}>
              {filtered.map((place) => (
                <PlaceRow
                  key={place.id}
                  ref={(node) => {
                    if (node) rowRefs.current.set(place.id, node)
                    else rowRefs.current.delete(place.id)
                  }}
                  place={place}
                  selected={place.id === selectedId}
                  onSelect={() => setSelectedId(place.id === selectedId ? null : place.id)}
                />
              ))}
            </AnimatePresence>
            {!isPending && filtered.length === 0 && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4 rounded-2xl bg-card px-6 py-10 text-center ring-1 ring-border paper-shadow">
                <BongSprite />
                <p className="font-heading text-lg font-bold">{t('explore.emptyTitle')}</p>
                <Button variant="secondary" className="font-semibold" onClick={resetFilters}>
                  {t('explore.emptyCta')}
                </Button>
              </motion.div>
            )}
          </div>
        </div>

        {isDesktop && (
        <div>
          <VietnamMap markers={markers} onMarkerClick={selectFromMap} ariaLabel={t('explore.mapLabel')} className="sticky top-24 h-[calc(100svh-8rem)] min-h-[480px]" />
        </div>
        )}
      </div>
    </main>
  )
}

type FilterChipProps = {
  active: boolean
  onClick: () => void
  activeClassName?: string
  children: React.ReactNode
}

function FilterChip({ active, onClick, activeClassName, children }: FilterChipProps) {
  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      className={cn(
        'flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-card px-3.5 text-sm font-semibold ring-1 ring-border paper-shadow transition-[background-color,box-shadow,color] hover:bg-surface-elevated',
        active && (activeClassName ?? 'bg-primary text-primary-foreground ring-primary hover:bg-primary'),
      )}
    >
      {children}
    </motion.button>
  )
}

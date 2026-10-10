import { forwardRef } from 'react'
import { Star } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { VibeBadge } from '@/components/VibeBadge'
import { provinceName } from '@/constants/provinces'
import { VIBE_META } from '@/constants/vibes'
import { cn } from '@/utils/cn'
import { formatDistance } from '@/utils/formatDistance'
import type { NearbyPlace } from './placeTypes'

type PlaceRowProps = {
  place: NearbyPlace
  selected: boolean
  onSelect: () => void
}

/** Compact list item for Explore; selecting it highlights the pin on the map */
export const PlaceRow = forwardRef<HTMLButtonElement, PlaceRowProps>(function PlaceRow({ place, selected, onSelect }, ref) {
  const { t, i18n } = useTranslation()
  const meta = VIBE_META[place.vibe]

  return (
    <motion.button
      ref={ref}
      type="button"
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
      aria-pressed={selected}
      aria-label={t('explore.showPlace', { name: place.name })}
      onClick={onSelect}
      className={cn(
        'group flex w-full items-center gap-4 rounded-2xl bg-card p-3 text-left ring-1 ring-border paper-shadow transition-[background-color,box-shadow] hover:bg-surface-elevated',
        selected && cn('bg-surface-elevated ring-2', meta.selectedRingClass),
      )}
    >
      <span className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface-elevated">
        <span aria-hidden className={cn('absolute size-12 rounded-full opacity-30 blur-xl', meta.dotClass)} />
        <span aria-hidden className="relative text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
          {place.emoji}
        </span>
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate font-bold">{place.name}</span>
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Star aria-hidden className="size-3.5 fill-warning text-warning" />
          <span className="font-semibold text-foreground">{place.rating.toFixed(1)}</span>
          <span aria-hidden>·</span>
          {place.distanceMeters > 0 ? (
            <span className="font-mono text-xs">{formatDistance(place.distanceMeters)}</span>
          ) : (
            <span className="truncate text-xs">{provinceName(place.province, i18n.resolvedLanguage)}</span>
          )}
          <span aria-hidden>·</span>
          <span>{place.priceLevel === 0 ? t('place.free') : '₫'.repeat(place.priceLevel)}</span>
        </span>
        <span className="flex items-center justify-between gap-2">
          <VibeBadge vibe={place.vibe} />
          <span className="truncate text-xs font-medium text-success">
            {place.openUntil === '24/7' ? t('place.openAllDay') : t('place.openUntil', { time: place.openUntil })}
          </span>
        </span>
      </span>
    </motion.button>
  )
})

import { Plus, Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { VibeBadge } from '@/components/VibeBadge'
import { VIBE_META } from '@/constants/vibes'
import { cn } from '@/utils/cn'
import { formatDistance } from '@/utils/formatDistance'
import type { NearbyPlace } from './placeTypes'

type PlaceCardProps = {
  place: NearbyPlace
}

export function PlaceCard({ place }: PlaceCardProps) {
  const { t } = useTranslation()
  const meta = VIBE_META[place.vibe]

  return (
    <article className="group flex w-60 shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-border paper-shadow transition-all duration-200 hover:-translate-y-1 hover:ring-border-strong lg:w-auto">
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-surface-elevated">
        <span aria-hidden className={cn('absolute size-32 rounded-full opacity-25 blur-2xl transition-opacity duration-300 group-hover:opacity-50', meta.dotClass)} />
        <span aria-hidden className="relative text-6xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
          {place.emoji}
        </span>
        <span className="absolute top-3 left-3 rounded-lg bg-background/70 px-2 py-1 font-mono text-xs backdrop-blur-md">
          {formatDistance(place.distanceMeters)}
        </span>
        <Button size="icon-sm" variant="secondary" className="absolute top-2 right-2 rounded-lg" aria-label={t('place.addToPlan', { name: place.name })}>
          <Plus />
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-1 text-base leading-snug font-bold">{place.name}</h3>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Star aria-hidden className="size-4 fill-warning text-warning" />
          <span className="font-semibold text-foreground">{place.rating.toFixed(1)}</span>
          <span aria-hidden>·</span>
          <PriceLevel level={place.priceLevel} />
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <VibeBadge vibe={place.vibe} />
          <span className="text-xs font-medium text-success">
            {place.openUntil === '24/7' ? t('place.openAllDay') : t('place.openUntil', { time: place.openUntil })}
          </span>
        </div>
      </div>
    </article>
  )
}

function PriceLevel({ level }: { level: NearbyPlace['priceLevel'] }) {
  const { t } = useTranslation()
  if (level === 0) return <span>{t('place.free')}</span>

  return (
    <span aria-label={t('place.price', { level })}>
      <span className="text-foreground">{'₫'.repeat(level)}</span>
      <span aria-hidden className="opacity-40">
        {'₫'.repeat(3 - level)}
      </span>
    </span>
  )
}

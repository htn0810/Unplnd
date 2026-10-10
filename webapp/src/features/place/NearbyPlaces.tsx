import { useTranslation } from 'react-i18next'
import { SectionHeading } from '@/components/SectionHeading'
import { Skeleton } from '@/components/ui/skeleton'
import { PlaceCard } from './PlaceCard'
import { useNearbyPlaces } from './placeQueries'

const LIST_CLASS =
  'scrollbar-none -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:-mx-6 md:px-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-4 lg:overflow-visible lg:px-0 xl:grid-cols-6'

export function NearbyPlaces() {
  const { t } = useTranslation()
  const { data: places, isPending, isError } = useNearbyPlaces()

  // Discovery is optional on Home: hide on failure or when nothing is nearby
  if (isError || places?.length === 0) return null

  return (
    <section aria-labelledby="nearby-title" className="flex flex-col gap-5">
      <SectionHeading
        id="nearby-title"
        title={t('home.nearbyTitle')}
        subtitle={t('home.nearbySubtitle')}
        action={
          <a href="#" className="shrink-0 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {t('common.seeAll')}
          </a>
        }
      />
      <div className={LIST_CLASS} aria-busy={isPending}>
        {isPending
          ? [0, 1, 2].map((key) => <Skeleton key={key} className="h-72 w-60 shrink-0 rounded-2xl lg:w-auto" />)
          : places.map((place) => <PlaceCard key={place.id} place={place} />)}
      </div>
    </section>
  )
}

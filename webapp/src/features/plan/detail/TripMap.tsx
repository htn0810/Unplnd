import { useTranslation } from 'react-i18next'
import { VietnamMap, type MapMarker, type MapRoute } from '@/components/map/VietnamMap'
import { stopsOfDay } from '../planTiming'
import type { PlanDetail } from '../planTypes'

/** One watercolor pigment per day: meadow, sunset, sky, sun, lavender, crimson, bamboo */
const DAY_COLORS = ['#3f7d5c', '#d9673e', '#3e86b4', '#e0a43a', '#7a54b0', '#c2415a', '#4e8b3a']

export function TripMap({ plan, className }: { plan: PlanDetail; className?: string }) {
  const { t } = useTranslation()

  const markers: MapMarker[] = []
  const routes: MapRoute[] = []
  plan.days.forEach((_, dayIndex) => {
    const color = DAY_COLORS[dayIndex % DAY_COLORS.length]
    const located = stopsOfDay(plan.activities, dayIndex).filter((stop) => stop.lat !== undefined && stop.lng !== undefined)
    located.forEach((stop, index) =>
      markers.push({
        id: stop.id,
        lat: stop.lat!,
        lng: stop.lng!,
        content: String(index + 1),
        color,
        label: `${plan.days.length > 1 ? `${t('planDetail.legendDay', { n: dayIndex + 1 })} · ` : ''}${stop.startTime} ${stop.emoji} ${stop.title}`,
      }),
    )
    if (located.length > 1) routes.push({ id: `day-${dayIndex}`, color, points: located.map((stop) => [stop.lat!, stop.lng!]) })
  })

  return (
    <section aria-labelledby="trip-map-title" className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h2 id="trip-map-title" className="kicker">
          {t('planEdit.tripMap')}
        </h2>
        {plan.days.length > 1 && (
          <ul className="flex flex-wrap justify-end gap-x-3 gap-y-1">
            {plan.days.map((day, index) => (
              <li key={day.date} className="flex items-center gap-1.5 text-xs font-semibold">
                <span aria-hidden className="size-2.5 rounded-full" style={{ background: DAY_COLORS[index % DAY_COLORS.length] }} />
                {t('planDetail.legendDay', { n: index + 1 })}
              </li>
            ))}
          </ul>
        )}
      </div>
      <VietnamMap markers={markers} routes={routes} ariaLabel={t('planDetail.tripMapLabel')} className={className} />
    </section>
  )
}

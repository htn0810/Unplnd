import { Fragment } from 'react'
import { Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { VibeBadge } from '@/components/VibeBadge'
import { formatShortDate } from '@/utils/formatDate'
import type { RecentPlan } from './planTypes'

type RecentPlanCardProps = {
  plan: RecentPlan
}

export function RecentPlanCard({ plan }: RecentPlanCardProps) {
  const { t, i18n } = useTranslation()

  return (
    <article className="flex w-[78%] shrink-0 snap-start flex-col gap-3 rounded-xl bg-card p-4 ring-1 ring-border paper-shadow transition-colors hover:bg-surface-elevated hover:ring-border-strong sm:w-[55%] lg:w-auto">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-mono">UNPLND #{plan.number}</span>
        <time dateTime={plan.date}>{formatShortDate(plan.date, i18n.resolvedLanguage)}</time>
      </div>

      <div className="flex items-center gap-1.5 text-2xl">
        {plan.stops.map((stop, index) => (
          <Fragment key={`${stop}-${index}`}>
            {index > 0 && (
              <span aria-hidden className="text-sm text-muted-foreground">
                →
              </span>
            )}
            <span aria-hidden>{stop}</span>
          </Fragment>
        ))}
      </div>

      <h3 className="text-lg leading-snug font-bold">{plan.title}</h3>

      <blockquote className="line-clamp-2 text-sm text-muted-foreground italic">“{plan.memory}”</blockquote>

      <div className="mt-auto flex items-center justify-between pt-1">
        <VibeBadge vibe={plan.vibe} />
        <span className="flex items-center gap-1 text-sm font-semibold" aria-label={t('plan.rated', { rating: plan.rating })}>
          <Star aria-hidden className="size-4 fill-warning text-warning" />
          {plan.rating.toFixed(1)}
        </span>
      </div>
    </article>
  )
}

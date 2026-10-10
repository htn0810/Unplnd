import { Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useRotatingIndex } from '@/hooks/useRotatingIndex'
import { usePlanActivity } from './planQueries'

type PlanActivityTickerProps = {
  planId: string
}

/**
 * Replays mock plan activity to simulate realtime group updates.
 * Will be driven by WebSocket events (PLAN_VOTE_CAST, PLAN_MEMBER_JOINED, ...) later.
 */
export function PlanActivityTicker({ planId }: PlanActivityTickerProps) {
  const { t } = useTranslation()
  const { data: activity = [] } = usePlanActivity(planId)
  const [index] = useRotatingIndex(activity.length, 4000)
  const item = activity[index]

  if (!item) return null

  return (
    <div className="flex min-h-10 items-center gap-2 overflow-hidden rounded-lg bg-surface-elevated px-3 text-sm">
      <Zap aria-hidden className="size-4 shrink-0 text-brand-mint" />
      <p
        key={item.id}
        className="min-w-0 truncate motion-safe:animate-in motion-safe:duration-300 motion-safe:fade-in motion-safe:slide-in-from-bottom-1"
      >
        <span className="font-semibold">{item.actor}</span> <span className="text-muted-foreground">{t(`activity.${item.type}`, { target: item.target })}</span>
      </p>
      <span className="ml-auto shrink-0 text-xs text-muted-foreground">{t('common.justNow')}</span>
    </div>
  )
}

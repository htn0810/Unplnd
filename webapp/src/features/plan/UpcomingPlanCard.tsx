import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { MemberStack } from '@/components/MemberStack'
import { buttonVariants } from '@/components/ui/button'
import { VibeBadge } from '@/components/VibeBadge'
import { planPath } from '@/constants/routes'
import { VIBE_META } from '@/constants/vibes'
import { cn } from '@/utils/cn'
import { formatVndCompact } from '@/utils/formatCurrency'
import { formatDistance } from '@/utils/formatDistance'
import { formatDuration } from '@/utils/formatDuration'
import { PlanActivityTicker } from './PlanActivityTicker'
import { planWhenLabel } from './planDates'
import type { UpcomingPlan } from './planTypes'

type UpcomingPlanCardProps = {
  plan: UpcomingPlan
}

export function UpcomingPlanCard({ plan }: UpcomingPlanCardProps) {
  const { t, i18n } = useTranslation()
  const onlineCount = plan.members.filter((member) => member.online).length

  return (
    <article className="relative flex flex-col gap-5 overflow-hidden rounded-2xl bg-card p-4 ring-1 ring-border paper-shadow md:p-6">
      <div aria-hidden className={cn('pointer-events-none absolute -top-20 -right-20 size-48 rounded-full opacity-20 blur-3xl', VIBE_META[plan.vibe].dotClass)} />

      <div className="relative flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          <LiveDot />
          {planWhenLabel(t, i18n.resolvedLanguage, plan)} · <span className="font-mono">{plan.startTime}</span>
        </span>
        <VibeBadge vibe={plan.vibe} />
      </div>

      <div className="relative">
        <h3 className="text-2xl leading-tight font-bold">{plan.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatDuration(plan.durationMinutes)} · {formatVndCompact(plan.budgetPerPerson)}
          {t('plan.perPerson')} · {formatDistance(plan.radiusMeters)}
        </p>
      </div>

      <ol aria-label={t('plan.itinerary')} className="relative flex justify-between">
        <span aria-hidden className="absolute top-6 right-8 left-8 h-px bg-gradient-to-r from-border via-border-strong to-border" />
        {plan.itinerary.map((stop) => (
          <li key={stop.startTime} className="relative flex w-16 flex-col items-center gap-1.5 text-center">
            <span className="flex size-12 items-center justify-center rounded-xl bg-surface-elevated text-2xl ring-1 ring-border">
              <span aria-hidden>{stop.emoji}</span>
            </span>
            <span className="font-mono text-xs text-muted-foreground">{stop.startTime}</span>
            <span className="line-clamp-1 text-xs">{stop.label}</span>
          </li>
        ))}
      </ol>

      <div className="relative flex items-center gap-3">
        <MemberStack members={plan.members} />
        <span className="text-sm text-muted-foreground">{t('plan.hereNow', { count: onlineCount })}</span>
      </div>

      <PlanActivityTicker planId={plan.id} />

      <div className="relative flex items-center justify-between gap-3 border-t border-border pt-4">
        <p className="text-sm">
          {plan.pendingVotesForMe > 0 ? (
            <>
              <span className="font-semibold">{t('plan.votesPending', { count: plan.pendingVotesForMe })}</span>{' '}
              <span className="text-muted-foreground">{t('plan.waitingOnYou')}</span>
            </>
          ) : (
            <span className="text-muted-foreground">{t('plan.youVoted')}</span>
          )}
        </p>
        <Link to={planPath(plan.id)} className={cn(buttonVariants({ variant: 'secondary' }), 'font-semibold')}>
          {t('plan.vote')}
          <ArrowRight />
        </Link>
      </div>
    </article>
  )
}

function LiveDot() {
  return (
    <span aria-hidden className="relative flex size-2">
      <span className="absolute inline-flex size-full rounded-full bg-success opacity-75 motion-safe:animate-ping" />
      <span className="relative inline-flex size-2 rounded-full bg-success" />
    </span>
  )
}

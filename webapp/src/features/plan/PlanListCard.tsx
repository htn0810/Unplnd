import { ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { MemberStack } from '@/components/MemberStack'
import { VibeBadge } from '@/components/VibeBadge'
import { planPath } from '@/constants/routes'
import { VIBE_META } from '@/constants/vibes'
import { cn } from '@/utils/cn'
import { dayCount, fromIsoDate } from '@/utils/date'
import { dayLabel } from './planDates'
import { PlanStatusBadge } from './PlanStatusBadge'
import type { UpcomingPlan } from './planTypes'

export function PlanListCard({ plan, index }: { plan: UpcomingPlan; index: number }) {
  const { t, i18n } = useTranslation()
  const meta = VIBE_META[plan.vibe]
  const days = dayCount(plan.startDate, plan.endDate)

  return (
    <motion.li initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06, type: 'spring', stiffness: 300, damping: 26 }}>
      <Link
        to={planPath(plan.id)}
        className="group relative flex items-center gap-4 overflow-hidden rounded-2xl bg-card p-4 ring-1 ring-border paper-shadow transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-elevated hover:ring-border-strong md:gap-6 md:p-5"
      >
        <span aria-hidden className={cn('absolute -top-10 -left-10 size-28 rounded-full opacity-15 blur-2xl transition-opacity group-hover:opacity-30', meta.dotClass)} />
        <span className="relative flex w-16 shrink-0 flex-col items-center gap-0.5 rounded-xl bg-surface-elevated py-2 md:w-20">
          <span className="max-w-full truncate px-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            {days > 1 ? t('plan.days', { count: days }) : dayLabel(t, i18n.resolvedLanguage, plan.startDate, plan.startTime)}
          </span>
          <span className="font-mono text-lg font-bold whitespace-nowrap md:text-xl">{days > 1 ? compactRange(plan.startDate, plan.endDate) : plan.startTime}</span>
        </span>
        <span className="relative flex min-w-0 flex-1 flex-col gap-2">
          <span className="flex flex-wrap items-center gap-2">
            <VibeBadge vibe={plan.vibe} />
            <PlanStatusBadge status={plan.status} />
          </span>
          <span className="truncate text-lg leading-tight font-bold">{plan.title}</span>
          <span className="flex items-center gap-3">
            <MemberStack members={plan.members} max={3} />
            <span aria-hidden className="hidden truncate text-lg sm:inline">
              {plan.itinerary.map((stop) => stop.emoji).join(' ')}
            </span>
          </span>
        </span>
        <ChevronRight aria-hidden className="relative size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
      </Link>
    </motion.li>
  )
}

/** "17–19" within a month, "31/10–2/11" across months — fits the small date block */
function compactRange(startIso: string, endIso: string) {
  const start = fromIsoDate(startIso)
  const end = fromIsoDate(endIso)
  return start.getMonth() === end.getMonth()
    ? `${start.getDate()}–${end.getDate()}`
    : `${start.getDate()}/${start.getMonth() + 1}–${end.getDate()}/${end.getMonth() + 1}`
}

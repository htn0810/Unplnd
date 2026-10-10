import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { provinceName } from '@/constants/provinces'
import { VIBE_META } from '@/constants/vibes'
import { cn } from '@/utils/cn'
import { formatVndCompact } from '@/utils/formatCurrency'
import { formatDuration } from '@/utils/formatDuration'
import { CREATE_PLAN_STEPS, useCreatePlanStore } from '../createPlanStore'
import { planWhenLabel } from '../planDates'

type SummaryRow = { step: (typeof CREATE_PLAN_STEPS)[number]; label: string; value: string | null; className?: string }

function useSummaryRows(): SummaryRow[] {
  const { t, i18n } = useTranslation()
  const { friendIds, startDate, endDate, startTime, durationMinutes, budgetPerPerson, vibe, locationMode, radiusKm, province, stepIndex } = useCreatePlanStore()
  const locationVisited = stepIndex >= CREATE_PLAN_STEPS.indexOf('location')

  return [
    { step: 'people', label: t('createPlan.summary.people'), value: stepIndex > 0 ? (friendIds.length === 0 ? t('createPlan.people.solo') : t('createPlan.people.count', { count: friendIds.length })) : null },
    { step: 'when', label: t('createPlan.summary.when'), value: stepIndex > 1 ? `${planWhenLabel(t, i18n.resolvedLanguage, { startDate, endDate, startTime })} · ${startTime}` : null },
    { step: 'duration', label: t('createPlan.summary.duration'), value: durationMinutes ? formatDuration(durationMinutes) : null },
    { step: 'budget', label: t('createPlan.summary.budget'), value: budgetPerPerson ? `${formatVndCompact(budgetPerPerson)} ${t('createPlan.budget.perPerson')}` : null },
    { step: 'vibe', label: t('createPlan.summary.vibe'), value: vibe ? `${VIBE_META[vibe].emoji} ${vibe}` : null, className: vibe ? VIBE_META[vibe].textClass : undefined },
    {
      step: 'location',
      label: t('createPlan.summary.where'),
      value: !locationVisited ? null : locationMode === 'province' && province ? provinceName(province, i18n.resolvedLanguage) : `📍 ${radiusKm} km`,
    },
  ]
}

/** Desktop sidebar: answers fill in as the user goes; each row jumps back to its step */
export function PlanSummary() {
  const { t } = useTranslation()
  const goTo = useCreatePlanStore((state) => state.goTo)
  const rows = useSummaryRows()
  const answered = rows.filter((row) => row.value)

  return (
    <aside className="flex flex-col gap-5 rounded-3xl bg-card p-6 ring-1 ring-border paper-shadow">
      <h2 className="kicker">{t('createPlan.summary.title')}</h2>
      {answered.length === 0 && <p className="text-sm text-muted-foreground">{t('createPlan.summary.empty')}</p>}
      <ul className="flex flex-col gap-1">
        <AnimatePresence initial={false}>
          {answered.map((row) => (
            <motion.li
              key={row.step}
              layout
              initial={{ opacity: 0, x: -16, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            >
              <button
                type="button"
                onClick={() => goTo(CREATE_PLAN_STEPS.indexOf(row.step))}
                className="flex min-h-11 w-full items-center justify-between gap-4 rounded-lg px-2 text-left transition-colors hover:bg-surface-hover"
              >
                <span className="text-sm text-muted-foreground">{row.label}</span>
                <span className={cn('font-heading font-bold', row.className)}>{row.value}</span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </aside>
  )
}

/** Mobile: compact chips of what's answered so far */
export function PlanSummaryChips() {
  const goTo = useCreatePlanStore((state) => state.goTo)
  const rows = useSummaryRows().filter((row) => row.value)

  if (rows.length === 0) return null

  return (
    <ul className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 md:-mx-6 md:px-6">
      <AnimatePresence initial={false}>
        {rows.map((row) => (
          <motion.li key={row.step} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
            <button
              type="button"
              onClick={() => goTo(CREATE_PLAN_STEPS.indexOf(row.step))}
              className={cn('flex h-8 items-center rounded-lg bg-surface-elevated px-3 text-xs font-semibold whitespace-nowrap', row.className)}
            >
              {row.value}
            </button>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  )
}

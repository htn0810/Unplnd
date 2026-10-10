import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/utils/cn'
import { formatVndCompact } from '@/utils/formatCurrency'
import type { PlanDetail } from '../planTypes'

export function BudgetMeter({ plan }: { plan: PlanDetail }) {
  const { t } = useTranslation()
  const spent = plan.activities.reduce((sum, activity) => sum + activity.estimatedCost, 0)
  // Budget is per person per day, so a trip's allowance scales with its length
  const budget = plan.budgetPerPerson * plan.days.length
  const ratio = spent / budget
  const over = ratio > 1

  return (
    <section aria-labelledby="budget-title" className="flex flex-col gap-3 rounded-2xl bg-card p-4 ring-1 ring-border paper-shadow md:p-5">
      <div className="flex flex-col gap-1">
        <h2 id="budget-title" className="kicker">
          {t('planDetail.budget.title')}
        </h2>
        <span className="font-mono text-sm">
          {t('planDetail.budget.of', { spent: formatVndCompact(spent), budget: formatVndCompact(budget) })}
        </span>
      </div>
      <div
        role="meter"
        aria-valuemin={0}
        aria-valuemax={budget}
        aria-valuenow={spent}
        aria-labelledby="budget-title"
        className="h-3 overflow-hidden rounded-full bg-muted"
      >
        <motion.div
          className={cn('h-full rounded-full', over ? 'bg-warning' : 'bg-gradient-to-r from-brand-mint to-success')}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(ratio, 1) * 100}%` }}
          transition={{ type: 'spring', stiffness: 80, damping: 18 }}
        />
      </div>
      <p className={cn('text-sm', over ? 'text-warning' : 'text-success')}>
        {over ? t('planDetail.budget.over', { amount: formatVndCompact(spent - budget) }) : t('planDetail.budget.under')}
      </p>
    </section>
  )
}

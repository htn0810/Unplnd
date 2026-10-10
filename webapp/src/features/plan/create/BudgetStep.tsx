import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { formatVndCompact } from '@/utils/formatCurrency'
import { BUDGET_OPTIONS } from '../createPlanOptions'
import { isTrip, useCreatePlanStore } from '../createPlanStore'
import { OptionTile } from './OptionTile'
import { StepHeading } from './StepHeading'

export function BudgetStep() {
  const { t } = useTranslation()
  const budgetPerPerson = useCreatePlanStore((state) => state.budgetPerPerson)
  const setBudget = useCreatePlanStore((state) => state.setBudget)
  const trip = useCreatePlanStore(isTrip)
  const last = BUDGET_OPTIONS[BUDGET_OPTIONS.length - 1].amount

  return (
    <div className="flex flex-col gap-8">
      <StepHeading id="step-title" title={t('createPlan.budget.title')} subtitle={t('createPlan.budget.subtitle')} />
      <div role="radiogroup" aria-labelledby="step-title" className="grid gap-3 sm:grid-cols-2">
        {BUDGET_OPTIONS.map((option, index) => (
          <motion.div key={option.amount} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
            <OptionTile
              selected={budgetPerPerson === option.amount}
              onSelect={() => setBudget(option.amount)}
              emoji={option.emoji}
              title={
                <>
                  {option.amount === last ? t('createPlan.budget.max') : formatVndCompact(option.amount)}{' '}
                  <span className="font-sans text-sm font-medium text-muted-foreground">{trip ? t('createPlan.budget.perPersonDay') : t('createPlan.budget.perPerson')}</span>
                </>
              }
              subtitle={t(`createPlan.budget.b${option.amount}`)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

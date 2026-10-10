import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { formatDuration } from '@/utils/formatDuration'
import { DURATION_OPTIONS } from '../createPlanOptions'
import { isTrip, useCreatePlanStore } from '../createPlanStore'
import { OptionTile } from './OptionTile'
import { StepHeading } from './StepHeading'

export function DurationStep() {
  const { t } = useTranslation()
  const durationMinutes = useCreatePlanStore((state) => state.durationMinutes)
  const setDuration = useCreatePlanStore((state) => state.setDuration)
  const trip = useCreatePlanStore(isTrip)
  const last = DURATION_OPTIONS[DURATION_OPTIONS.length - 1].minutes

  return (
    <div className="flex flex-col gap-8">
      <StepHeading id="step-title" title={trip ? t('createPlan.duration.titlePerDay') : t('createPlan.duration.title')} subtitle={t('createPlan.duration.subtitle')} />
      <div role="radiogroup" aria-labelledby="step-title" className="grid gap-3 sm:grid-cols-2">
        {DURATION_OPTIONS.map((option, index) => (
          <motion.div key={option.minutes} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
            <OptionTile
              selected={durationMinutes === option.minutes}
              onSelect={() => setDuration(option.minutes)}
              emoji={option.emoji}
              title={option.minutes === last ? t('createPlan.duration.max') : formatDuration(option.minutes)}
              subtitle={t(`createPlan.duration.d${option.minutes}`)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { VIBE_META, VIBES } from '@/constants/vibes'
import { cn } from '@/utils/cn'
import { useCreatePlanStore } from '../createPlanStore'
import { StepHeading } from './StepHeading'

/** The wizard's memorable moment: picking a vibe recolors the whole screen */
export function VibeStep() {
  const { t } = useTranslation()
  const vibe = useCreatePlanStore((state) => state.vibe)
  const setVibe = useCreatePlanStore((state) => state.setVibe)

  return (
    <div className="flex flex-col gap-8">
      <StepHeading id="step-title" title={t('createPlan.vibe.title')} subtitle={t('createPlan.vibe.subtitle')} />
      <div role="radiogroup" aria-labelledby="step-title" className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {VIBES.map((item, index) => {
          const meta = VIBE_META[item]
          const selected = vibe === item
          const dimmed = vibe !== null && !selected
          return (
            <motion.button
              key={item}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setVibe(item)}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: dimmed ? 0.55 : 1, scale: selected ? 1.04 : 1 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25, delay: vibe === null ? index * 0.04 : 0 }}
              className={cn(
                'relative flex aspect-square flex-col items-start justify-between overflow-hidden rounded-2xl bg-card p-4 text-left ring-1 ring-border paper-shadow md:aspect-[4/5]',
                selected && cn('bg-surface-elevated ring-2', meta.selectedRingClass),
              )}
            >
              <span aria-hidden className={cn('absolute -right-8 -bottom-8 size-28 rounded-full blur-2xl transition-opacity duration-500', meta.dotClass, selected ? 'opacity-50' : 'opacity-0')} />
              <motion.span
                aria-hidden
                animate={selected ? { rotate: [0, -15, 12, -6, 0], scale: [1, 1.35, 1.15] } : { rotate: 0, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl"
              >
                {meta.emoji}
              </motion.span>
              <span className="relative flex flex-col gap-1">
                <span className={cn('font-heading text-lg font-bold md:text-xl', meta.textClass)}>{item}</span>
                <span className="text-xs leading-snug text-muted-foreground">{t(`vibes.${item}`)}</span>
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/utils/cn'
import type { PlanStatus } from '../planTypes'

const STAGES = ['VOTING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED'] as const satisfies readonly PlanStatus[]

const STAGE_INDEX: Partial<Record<PlanStatus, number>> = {
  OPEN: 0,
  VOTING: 0,
  CONFIRMED: 1,
  READY_TO_GO: 1,
  IN_PROGRESS: 2,
  COMPLETED: 3,
}

export function PlanProgress({ status }: { status: PlanStatus }) {
  const { t } = useTranslation()
  const current = STAGE_INDEX[status] ?? 0

  return (
    <ol aria-label={t('planDetail.progress')} className="flex items-center gap-2">
      {STAGES.map((stage, index) => {
        const reached = index <= current
        return (
          <li key={stage} className="flex flex-1 items-center gap-2 last:flex-none">
            <span className="flex items-center gap-2" aria-current={index === current ? 'step' : undefined}>
              <motion.span
                className={cn('flex size-3 rounded-full ring-2 ring-background', reached ? 'bg-primary' : 'bg-muted')}
                animate={index === current ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                transition={index === current ? { duration: 1.6, repeat: Infinity } : undefined}
              />
              <span className={cn('text-xs font-semibold whitespace-nowrap', index === current ? 'text-foreground' : 'hidden text-muted-foreground sm:inline')}>
                {t(`planDetail.status.${stage}`)}
              </span>
            </span>
            {index < STAGES.length - 1 && (
              <span className="h-0.5 flex-1 overflow-hidden rounded-full bg-muted">
                <motion.span
                  className="block h-full bg-brand-gradient"
                  initial={{ width: 0 }}
                  animate={{ width: index < current ? '100%' : '0%' }}
                  transition={{ duration: 0.6 }}
                />
              </span>
            )}
          </li>
        )
      })}
    </ol>
  )
}

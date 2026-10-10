import { ArrowLeft, Pencil } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { VibeBadge } from '@/components/VibeBadge'
import { ROUTES } from '@/constants/routes'
import { formatDuration } from '@/utils/formatDuration'
import { provinceName } from '@/constants/provinces'
import { planWhenLabel } from '../planDates'
import type { PlanDetail } from '../planTypes'
import { PlanProgress } from './PlanProgress'

const LINE_DELAY = 0.12

type PlanDetailHeroProps = {
  plan: PlanDetail
  reveal: boolean
  onEditDetails?: () => void
}

export function PlanDetailHero({ plan, reveal, onEditDetails }: PlanDetailHeroProps) {
  const { t, i18n } = useTranslation()
  const lines = [t('planDetail.heroLine1'), t('planDetail.heroLine2'), t('planDetail.heroLine3')]
  const baseDelay = reveal ? 0.2 : 0

  return (
    <section aria-labelledby="plan-title" className="flex flex-col gap-6">
      <Link to={ROUTES.plans} className="-ml-1 inline-flex min-h-11 w-fit items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" />
        {t('planDetail.back')}
      </Link>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: baseDelay }}
        className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase"
      >
        <VibeBadge vibe={plan.vibe} />
        <span aria-hidden>·</span>
        {t('planDetail.people', { count: plan.members.length })}
        <span aria-hidden>·</span>
        {formatDuration(plan.durationMinutes)}
        <span aria-hidden>·</span>
        <span>
          {planWhenLabel(t, i18n.resolvedLanguage, plan)} <span className="font-mono">{plan.days.length === 1 && plan.startTime}</span>
        </span>
        <span aria-hidden>·</span>
        <span>📍 {provinceName(plan.destination, i18n.resolvedLanguage)}</span>
      </motion.p>

      <h1 id="plan-title" className="text-[40px] leading-[44px] font-bold tracking-tight md:text-[56px] md:leading-[60px]">
        <span className="sr-only">{plan.title}. </span>
        {lines.map((line, index) => (
          <span key={line} className="block overflow-hidden">
            <motion.span
              className={index === lines.length - 1 ? 'block text-brand-gradient' : 'block'}
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ delay: baseDelay + index * LINE_DELAY, type: 'spring', stiffness: 160, damping: 20 }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </h1>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: baseDelay + 0.45 }} className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <p className="font-heading text-xl font-bold text-muted-foreground">{plan.title}</p>
          {onEditDetails && (
            <Button variant="ghost" size="icon-sm" aria-label={t('planEdit.editDetails')} onClick={onEditDetails}>
              <Pencil />
            </Button>
          )}
        </div>
        <div className="max-w-md">
          <PlanProgress status={plan.status} />
        </div>
      </motion.div>
    </section>
  )
}

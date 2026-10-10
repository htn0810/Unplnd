import { Dices, Rocket, Share2, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import type { PlanStatus } from '../planTypes'

type PlanActionBarProps = {
  className?: string
  /** Host-only actions: regenerate, confirm, start */
  canEdit: boolean
  status: PlanStatus
  onRegenerate: () => void
  onShare: () => void
  onConfirm: () => void
  onStart: () => void
}

/** Mobile: sticky bar above the bottom nav (scrolls away at the footer). Desktop: card in the sidebar. */
export function PlanActionBar({ className, canEdit, status, onRegenerate, onShare, onConfirm, onStart }: PlanActionBarProps) {
  const { t } = useTranslation()
  const voting = canEdit && (status === 'VOTING' || status === 'OPEN')
  const confirmed = canEdit && (status === 'CONFIRMED' || status === 'READY_TO_GO')

  return (
    <div className={cn('border-t border-border bg-background/90 px-4 py-3 backdrop-blur-md md:px-6 lg:rounded-2xl lg:border-0 lg:bg-card lg:p-4 lg:ring-1 lg:ring-border lg:backdrop-blur-none', className)}>
      <div className="mx-auto flex max-w-screen-sm gap-2 lg:max-w-none lg:flex-col">
        <div className="flex gap-2 lg:order-2">
          {voting && (
            <Button variant="secondary" size="lg" className="group flex-1 font-semibold" onClick={onRegenerate} aria-label={t('planDetail.actions.regenerate')}>
              <Dices className="transition-transform duration-500 group-hover:rotate-[360deg]" />
              <span className="hidden sm:inline lg:inline">{t('planDetail.actions.regenerate')}</span>
            </Button>
          )}
          <Button variant="secondary" size="lg" className="flex-1 font-semibold" onClick={onShare} aria-label={t('planDetail.actions.share')}>
            <Share2 />
            <span className="hidden sm:inline lg:inline">{t('planDetail.actions.share')}</span>
          </Button>
        </div>

        <div className="group relative flex-[2] lg:order-1">
          {confirmed && <div aria-hidden className="absolute -inset-1 rounded-2xl bg-brand-gradient opacity-60 blur-lg motion-safe:animate-pulse" />}
          {voting && (
            <Button size="lg" className="relative h-12 w-full rounded-xl font-bold tracking-wide" onClick={onConfirm}>
              <Sparkles />
              {t('planDetail.actions.confirm')}
            </Button>
          )}
          {confirmed && (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }}>
              <Button size="lg" className="relative h-12 w-full rounded-xl bg-brand-gradient font-bold tracking-wide text-white hover:opacity-90" onClick={onStart}>
                <Rocket />
                {t('planDetail.actions.letsGo')}
              </Button>
            </motion.div>
          )}
          {!voting && !confirmed && (
            <Button size="lg" disabled className={cn('relative h-12 w-full rounded-xl font-bold')}>
              {t(`planDetail.status.${status}`)}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

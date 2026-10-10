import { useTranslation } from 'react-i18next'
import { cn } from '@/utils/cn'
import type { PlanStatus } from './planTypes'

const STATUS_CLASS: Partial<Record<PlanStatus, string>> = {
  VOTING: 'bg-brand-pink/15 text-brand-pink',
  OPEN: 'bg-brand-pink/15 text-brand-pink',
  CONFIRMED: 'bg-success/15 text-success',
  READY_TO_GO: 'bg-success/15 text-success',
  IN_PROGRESS: 'bg-brand-mint/15 text-brand-mint',
  COMPLETED: 'bg-muted text-muted-foreground',
  CANCELLED: 'bg-destructive/15 text-destructive',
}

export function PlanStatusBadge({ status, className }: { status: PlanStatus; className?: string }) {
  const { t } = useTranslation()
  const live = status === 'VOTING' || status === 'OPEN'

  return (
    <span className={cn('inline-flex h-6 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold', STATUS_CLASS[status] ?? 'bg-muted text-muted-foreground', className)}>
      {live && <span aria-hidden className="size-1.5 rounded-full bg-current motion-safe:animate-pulse" />}
      {t(`planDetail.status.${status}`)}
    </span>
  )
}

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/utils/cn'
import { todayIso } from '@/utils/date'
import type { PlanDetailsDraft } from '../planDetailActions'
import { planDetailsSchema, type PlanDetailsFormValues, type PlanEditErrorKey } from './planEditSchema'

type PlanDetailsSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  details: PlanDetailsDraft
  onSave: (draft: PlanDetailsDraft) => void
}

export function PlanDetailsSheet({ open, onOpenChange, details, onSave }: PlanDetailsSheetProps) {
  const { t } = useTranslation()
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={isDesktop ? 'right' : 'bottom'} className={cn('gap-0 p-0', isDesktop ? 'w-full sm:max-w-md' : 'rounded-t-3xl')}>
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle className="font-heading text-xl font-bold">{t('planEdit.editDetails')}</SheetTitle>
          <SheetDescription>{t('planEdit.timesHint')}</SheetDescription>
        </SheetHeader>
        {open && <PlanDetailsForm details={details} onSave={onSave} onCancel={() => onOpenChange(false)} />}
      </SheetContent>
    </Sheet>
  )
}

function PlanDetailsForm({ details, onSave, onCancel }: { details: PlanDetailsDraft; onSave: (draft: PlanDetailsDraft) => void; onCancel: () => void }) {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlanDetailsFormValues>({ resolver: zodResolver(planDetailsSchema), defaultValues: details })

  const errorText = (message?: string) => (message ? t(message as PlanEditErrorKey) : undefined)

  return (
    <form onSubmit={handleSubmit(onSave)} noValidate className="flex flex-col">
      <div className="flex flex-col gap-6 px-5 py-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="plan-details-title">{t('planEdit.fields.planTitle')}</Label>
          <Input id="plan-details-title" className="h-11 rounded-lg" aria-invalid={Boolean(errors.title)} {...register('title')} />
          {errors.title && <p className="text-sm text-destructive">{errorText(errors.title.message)}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="plan-details-start-date">{t('planEdit.fields.startDate')}</Label>
          <Input id="plan-details-start-date" type="date" min={todayIso()} className="h-11 rounded-lg font-mono" {...register('startDate')} />
        </div>
      </div>

      <SheetFooter className="flex-row justify-end gap-2 border-t border-border px-5 py-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <Button type="button" variant="ghost" onClick={onCancel}>
          {t('planEdit.cancel')}
        </Button>
        <Button type="submit" className="min-w-28 font-bold">
          {t('planEdit.save')}
        </Button>
      </SheetFooter>
    </form>
  )
}

import { CalendarDays } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { DateRangeCalendar } from '@/components/DateRangeCalendar'
import { Input } from '@/components/ui/input'
import { MAX_TRIP_DAYS } from '@/constants/provinces'
import { cn } from '@/utils/cn'
import { dayCount } from '@/utils/date'
import { useCreatePlanStore } from '../createPlanStore'
import { planWhenLabel } from '../planDates'
import { StepHeading } from './StepHeading'

const PRESETS = [
  { key: 'morning', time: '08:00', emoji: '🌅' },
  { key: 'lunch', time: '11:30', emoji: '🍱' },
  { key: 'afternoon', time: '14:00', emoji: '☀️' },
  { key: 'evening', time: '19:00', emoji: '🌙' },
  { key: 'late', time: '21:30', emoji: '🌌' },
] as const

export function WhenStep() {
  const { t, i18n } = useTranslation()
  const { startDate, endDate, startTime, pickDate, setStartTime } = useCreatePlanStore()
  const days = dayCount(startDate, endDate)
  const isPreset = PRESETS.some((preset) => preset.time === startTime)

  return (
    <div className="flex flex-col gap-8">
      <StepHeading id="step-title" title={t('createPlan.when.title')} subtitle={t('createPlan.when.subtitle')} />

      <div className="flex h-9 items-center gap-2 overflow-hidden" aria-live="polite">
        <CalendarDays className="size-5 shrink-0 text-brand-mint" />
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.p
            key={`${startDate}-${endDate}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="truncate font-heading text-xl font-bold text-brand-gradient"
          >
            {planWhenLabel(t, i18n.resolvedLanguage, { startDate, endDate, startTime })}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start">
        <div className="flex flex-col gap-2">
          <DateRangeCalendar
            start={startDate}
            end={endDate}
            onPick={pickDate}
            locale={i18n.resolvedLanguage}
            label={t('createPlan.when.calendarLabel')}
            prevLabel={t('createPlan.when.prevMonth')}
            nextLabel={t('createPlan.when.nextMonth')}
          />
          <p className="text-xs text-muted-foreground">{t('createPlan.when.maxDays', { count: MAX_TRIP_DAYS })}</p>
        </div>

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-1 text-sm font-medium">
            {t('createPlan.when.startTime')}
            {days > 1 && <span className="text-muted-foreground"> · {t('plan.days', { count: days })}</span>}
          </legend>
          <div role="radiogroup" aria-label={t('createPlan.when.startTime')} className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-2">
            {PRESETS.map((preset) => {
              const active = startTime === preset.time
              return (
                <motion.button
                  key={preset.key}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setStartTime(preset.time)}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'flex h-14 items-center gap-2 rounded-xl bg-card px-3 text-left ring-1 ring-border paper-shadow transition-colors hover:bg-surface-elevated',
                    active && 'bg-primary/10 ring-2 ring-primary',
                  )}
                >
                  <span aria-hidden className="text-xl">
                    {preset.emoji}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold">{t(`createPlan.when.presets.${preset.key}`)}</span>
                    <span className="font-mono text-xs text-muted-foreground">{preset.time}</span>
                  </span>
                </motion.button>
              )
            })}
            <label className={cn('flex h-14 items-center gap-2 rounded-xl bg-card px-3 ring-1 ring-border paper-shadow', !isPreset && 'bg-primary/10 ring-2 ring-primary')}>
              <span className="text-sm font-semibold">{t('createPlan.when.custom')}</span>
              <Input
                type="time"
                step={900}
                value={startTime}
                onChange={(event) => event.target.value && setStartTime(event.target.value)}
                className="h-9 flex-1 border-0 bg-transparent px-1 font-mono focus-visible:ring-0"
                aria-label={t('createPlan.when.custom')}
              />
            </label>
          </div>
        </fieldset>
      </div>
    </div>
  )
}

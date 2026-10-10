import { useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { MapPin, Plus, Search, Trash2 } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { provinceName } from '@/constants/provinces'
import type { Vibe } from '@/constants/vibes'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/utils/cn'
import { formatVndCompact } from '@/utils/formatCurrency'
import { formatDuration } from '@/utils/formatDuration'
import type { ActivityDraft } from '../planDetailActions'
import type { PoolActivity } from '../planGenerator'
import { useActivityPool } from '../planQueries'
import { dayLabel } from '../planDates'
import type { Activity, PlanDay } from '../planTypes'
import { activitySchema, type ActivityFormValues, type PlanEditErrorKey } from './planEditSchema'

const EMOJIS = ['🍜', '🍕', '🍢', '☕', '🧋', '🍻', '🎮', '🎤', '🎳', '🎨', '📚', '🌃', '🌳', '🛍️', '🎬', '📍']
const DURATIONS = [30, 45, 60, 90, 120, 180]
const COSTS = [0, 50_000, 100_000, 200_000]
const MAX_SUGGESTIONS = 5

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .toLowerCase()

type ActivityEditorSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Existing stop to edit; omit to add a new one */
  activity?: Activity
  vibe: Vibe
  days: PlanDay[]
  /** Day a new stop is added to */
  defaultDayIndex?: number
  onSave: (draft: ActivityDraft) => void
  onDelete?: () => void
}

/** Bottom sheet on mobile, side panel on desktop */
export function ActivityEditorSheet({ open, onOpenChange, activity, vibe, days, defaultDayIndex = 0, onSave, onDelete }: ActivityEditorSheetProps) {
  const { t } = useTranslation()
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isDesktop ? 'right' : 'bottom'}
        className={cn('gap-0 p-0', isDesktop ? 'w-full sm:max-w-md' : 'max-h-[92svh] rounded-t-3xl')}
      >
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle className="font-heading text-xl font-bold">{activity ? t('planEdit.editStop') : t('planEdit.addStop')}</SheetTitle>
          <SheetDescription>{t('planEdit.timesHint')}</SheetDescription>
        </SheetHeader>
        {/* Mounted only while open, so the form always starts from the current stop */}
        {open && (
          <ActivityEditorForm
            activity={activity}
            vibe={vibe}
            days={days}
            defaultDayIndex={defaultDayIndex}
            onSave={onSave}
            onDelete={onDelete}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}

type ActivityEditorFormProps = Omit<ActivityEditorSheetProps, 'open' | 'onOpenChange'> & { onCancel: () => void }

function ActivityEditorForm({ activity, vibe, days, defaultDayIndex = 0, onSave, onDelete, onCancel }: ActivityEditorFormProps) {
  const { t, i18n } = useTranslation()
  const { data: pool = [] } = useActivityPool()
  const [query, setQuery] = useState('')
  const [picked, setPicked] = useState<Pick<PoolActivity, 'type' | 'distanceMeters' | 'province' | 'lat' | 'lng'> | null>(null)

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      emoji: activity?.emoji ?? '📍',
      title: activity?.title ?? '',
      placeName: activity?.placeName ?? '',
      durationMinutes: activity?.durationMinutes ?? 60,
      estimatedCost: activity?.estimatedCost ?? 0,
      dayIndex: activity?.dayIndex ?? defaultDayIndex,
      manualTime: activity?.manualTime ?? false,
      startTime: activity?.startTime ?? days[defaultDayIndex]?.startTime ?? '19:00',
    },
  })

  const dayIndex = useWatch({ control, name: 'dayIndex' })
  const manualTime = useWatch({ control, name: 'manualTime' })
  const dayProvince = days[dayIndex]?.province

  const suggestions = useMemo(() => {
    const needle = normalize(query.trim())
    // Search covers the whole country; idle suggestions stay in this day's province and vibe
    const matches = needle
      ? pool.filter((item) => normalize(`${item.title} ${item.placeName}`).includes(needle))
      : pool.filter((item) => item.province === dayProvince && (vibe === 'SURPRISE' || item.vibes.includes(vibe)))
    return matches.slice(0, MAX_SUGGESTIONS)
  }, [pool, query, vibe, dayProvince])

  // Keep the stop's current icon pickable even when it isn't one of the presets
  const emojis = activity && !EMOJIS.includes(activity.emoji) ? [activity.emoji, ...EMOJIS.slice(0, -1)] : EMOJIS

  const exactMatch = suggestions.some((item) => normalize(item.placeName) === normalize(query.trim()))

  const pickSuggestion = (item: PoolActivity) => {
    reset({ ...getValues(), emoji: item.emoji, title: item.title, placeName: item.placeName, durationMinutes: item.durationMinutes, estimatedCost: item.estimatedCost })
    setPicked({ type: item.type, distanceMeters: item.distanceMeters, province: item.province, lat: item.lat, lng: item.lng })
    setQuery('')
  }

  const useCustomPlace = () => {
    const place = query.trim()
    setValue('placeName', place, { shouldValidate: true })
    if (!getValues('title')) setValue('title', place, { shouldValidate: true })
    setPicked(null)
    setQuery('')
  }

  const submit = handleSubmit((values) => onSave({ ...values, ...(picked ?? {}) }))
  const errorText = (message?: string) => (message ? t(message as PlanEditErrorKey) : undefined)

  return (
    <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-5 py-5">
        <section className="flex flex-col gap-3">
          <div className="relative">
            <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              aria-label={t('planEdit.searchLabel')}
              placeholder={t('planEdit.searchPlaceholder')}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-11 rounded-xl pl-10 [&::-webkit-search-cancel-button]:hidden"
            />
          </div>
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{t('planEdit.suggestions')}</p>
          <ul className="flex flex-col gap-1.5">
            <AnimatePresence initial={false} mode="popLayout">
              {query.trim() && !exactMatch && (
                <motion.li key="custom" layout initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <button
                    type="button"
                    onClick={useCustomPlace}
                    className="flex min-h-12 w-full items-center gap-3 rounded-xl border border-dashed border-primary/50 bg-primary/5 px-3 text-left text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
                  >
                    <MapPin className="size-4 shrink-0" />
                    <span className="truncate">{t('planEdit.customPlace', { query: query.trim() })}</span>
                  </button>
                </motion.li>
              )}
              {suggestions.map((item) => (
                <motion.li key={item.id} layout initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <button
                    type="button"
                    onClick={() => pickSuggestion(item)}
                    className="flex min-h-12 w-full items-center gap-3 rounded-xl bg-surface-elevated px-3 py-2 text-left transition-colors hover:bg-surface-hover"
                  >
                    <span aria-hidden className="text-2xl">
                      {item.emoji}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-semibold">{item.title}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {item.placeName}
                        {item.province !== dayProvince && ` · ${provinceName(item.province, i18n.resolvedLanguage)}`}
                      </span>
                    </span>
                    <span className="shrink-0 text-right font-mono text-xs text-muted-foreground">
                      {item.estimatedCost === 0 ? t('planDetail.free') : formatVndCompact(item.estimatedCost)}
                      <br />
                      {formatDuration(item.durationMinutes)}
                    </span>
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </section>

        <div aria-hidden className="h-px bg-border" />

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-medium">{t('planEdit.fields.emoji')}</legend>
          <Controller
            control={control}
            name="emoji"
            render={({ field }) => (
              <div role="radiogroup" aria-label={t('planEdit.fields.emoji')} className="grid grid-cols-8 gap-1.5">
                {emojis.map((emoji) => (
                  <motion.button
                    key={emoji}
                    type="button"
                    role="radio"
                    aria-checked={field.value === emoji}
                    onClick={() => field.onChange(emoji)}
                    whileTap={{ scale: 0.85 }}
                    animate={field.value === emoji ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                    className={cn(
                      'flex aspect-square items-center justify-center rounded-xl bg-surface-elevated text-xl transition-shadow',
                      field.value === emoji && 'bg-primary/15 ring-2 ring-primary',
                    )}
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            )}
          />
        </fieldset>

        <Field id="activity-title" label={t('planEdit.fields.title')} error={errorText(errors.title?.message)}>
          <Input id="activity-title" placeholder={t('planEdit.fields.titlePlaceholder')} className="h-11 rounded-lg" aria-invalid={Boolean(errors.title)} {...register('title')} />
        </Field>

        <Field id="activity-place" label={t('planEdit.fields.place')} error={errorText(errors.placeName?.message)}>
          <Input id="activity-place" placeholder={t('planEdit.fields.placePlaceholder')} className="h-11 rounded-lg" aria-invalid={Boolean(errors.placeName)} {...register('placeName')} />
        </Field>

        {days.length > 1 && (
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-sm font-medium">{t('planEdit.fields.dayOfTrip')}</legend>
            <Controller
              control={control}
              name="dayIndex"
              render={({ field }) => (
                <div role="radiogroup" aria-label={t('planEdit.fields.dayOfTrip')} className="scrollbar-none flex gap-2 overflow-x-auto">
                  {days.map((day, index) => (
                    <ChipButton key={day.date} active={field.value === index} onClick={() => field.onChange(index)}>
                      <span className="flex flex-col items-center leading-tight">
                        <span>{t('planEdit.dayN', { n: index + 1 })}</span>
                        <span className="text-[10px] font-medium opacity-70">{dayLabel(t, i18n.resolvedLanguage, day.date)}</span>
                      </span>
                    </ChipButton>
                  ))}
                </div>
              )}
            />
          </fieldset>
        )}

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-medium">{t('planEdit.fields.time')}</legend>
          <Controller
            control={control}
            name="manualTime"
            render={({ field }) => (
              <div role="radiogroup" aria-label={t('planEdit.fields.time')} className="grid grid-cols-2 gap-2">
                <ChipButton active={!field.value} onClick={() => field.onChange(false)}>
                  ⚡ {t('planEdit.fields.timeAuto')}
                </ChipButton>
                <ChipButton active={field.value} onClick={() => field.onChange(true)}>
                  🕐 {t('planEdit.fields.timeManual')}
                </ChipButton>
              </div>
            )}
          />
          <AnimatePresence initial={false} mode="wait">
            {manualTime ? (
              <motion.div key="manual" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <Input
                  type="time"
                  step={300}
                  aria-label={t('planEdit.fields.timeManual')}
                  className="mt-1 h-11 rounded-lg font-mono"
                  aria-invalid={Boolean(errors.startTime)}
                  {...register('startTime')}
                />
                {errors.startTime && <p className="mt-1 text-sm text-destructive">{errorText(errors.startTime.message)}</p>}
              </motion.div>
            ) : (
              <motion.p key="auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs text-muted-foreground">
                {t('planEdit.fields.timeAutoHint')}
              </motion.p>
            )}
          </AnimatePresence>
        </fieldset>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-medium">{t('planEdit.fields.duration')}</legend>
          <Controller
            control={control}
            name="durationMinutes"
            render={({ field }) => (
              <div role="radiogroup" aria-label={t('planEdit.fields.duration')} className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {DURATIONS.map((minutes) => (
                  <ChipButton key={minutes} active={field.value === minutes} onClick={() => field.onChange(minutes)}>
                    {formatDuration(minutes)}
                  </ChipButton>
                ))}
              </div>
            )}
          />
        </fieldset>

        <Field id="activity-cost" label={t('planEdit.fields.cost')} error={errorText(errors.estimatedCost?.message)}>
          <Input
            id="activity-cost"
            type="number"
            inputMode="numeric"
            min={0}
            step={1000}
            className="h-11 rounded-lg font-mono"
            aria-invalid={Boolean(errors.estimatedCost)}
            {...register('estimatedCost', { valueAsNumber: true })}
          />
          <Controller
            control={control}
            name="estimatedCost"
            render={({ field }) => (
              <div className="mt-2 flex flex-wrap gap-2">
                {COSTS.map((cost) => (
                  <ChipButton key={cost} active={field.value === cost} onClick={() => setValue('estimatedCost', cost, { shouldValidate: true })}>
                    {cost === 0 ? t('planDetail.free') : formatVndCompact(cost)}
                  </ChipButton>
                ))}
              </div>
            )}
          />
        </Field>
      </div>

      <SheetFooter className="flex-row items-center gap-2 border-t border-border bg-popover px-5 py-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        {onDelete && (
          <Button type="button" variant="ghost" aria-label={t('planEdit.delete')} className="mr-auto text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={onDelete}>
            <Trash2 />
            <span className="hidden sm:inline">{t('planEdit.delete')}</span>
          </Button>
        )}
        <Button type="button" variant="ghost" className={cn(!onDelete && 'mr-auto')} onClick={onCancel}>
          {t('planEdit.cancel')}
        </Button>
        <Button type="submit" className="min-w-28 font-bold">
          {!activity && <Plus />}
          {t('planEdit.save')}
        </Button>
      </SheetFooter>
    </form>
  )
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

function ChipButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      className={cn(
        'flex h-10 items-center justify-center rounded-xl bg-surface-elevated px-3 text-sm font-semibold ring-1 ring-border transition-colors hover:bg-surface-hover',
        active && 'bg-primary text-primary-foreground ring-primary hover:bg-primary',
      )}
    >
      {children}
    </motion.button>
  )
}

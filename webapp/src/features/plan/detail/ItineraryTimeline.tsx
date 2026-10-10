import { CalendarPlus, Clock, GripVertical, Lock, LockOpen, MapPin, Pencil, Pin, Plus, Shuffle, Trash2, TriangleAlert, Wallet } from 'lucide-react'
import { AnimatePresence, motion, Reorder, useDragControls } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { MAX_TRIP_DAYS, PROVINCES, provinceName, type ProvinceId } from '@/constants/provinces'
import type { Language } from '@/i18n'
import { cn } from '@/utils/cn'
import { formatVndCompact } from '@/utils/formatCurrency'
import { formatDistance } from '@/utils/formatDistance'
import { formatDuration } from '@/utils/formatDuration'
import { dayLabel } from '../planDates'
import { stopsOfDay } from '../planTiming'
import type { Activity, PlanDay, PlanDetail } from '../planTypes'

type ItineraryTimelineProps = {
  plan: PlanDetail
  reveal: boolean
  /** Host-only editing: reorder, edit, add, day settings */
  canEdit: boolean
  overlaps: Set<string>
  onToggleLock: (activityId: string) => void
  onReplace: (activityId: string) => void
  onEdit: (activity: Activity) => void
  onAdd: (dayIndex: number) => void
  onReorderDay: (dayIndex: number, orderedIds: string[]) => void
  onMove: (activityId: string, offset: -1 | 1) => void
  onUpdateDay: (dayIndex: number, patch: { startTime?: string; province?: ProvinceId }) => void
  onAddDay: () => void
  onRemoveDay: (dayIndex: number) => void
}

/** The Generated Plan's memorable moment: stops reveal one by one along a drawn line — per day */
export function ItineraryTimeline(props: ItineraryTimelineProps) {
  const { plan, reveal, canEdit, onAddDay } = props
  const { t, i18n } = useTranslation()
  const language = (i18n.resolvedLanguage ?? 'en') as Language
  const multiDay = plan.days.length > 1
  const tailDelay = (reveal ? 0.6 : 0.1) + plan.activities.length * (reveal ? 0.18 : 0.06)

  const jumpTo = (index: number) => document.getElementById(`day-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <section aria-labelledby="itinerary-title" className="flex flex-col gap-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="itinerary-title" className="kicker">
          {t('planDetail.itinerary')}
        </h2>
        {!canEdit && <p className="text-xs text-muted-foreground">{t('planEdit.readOnly')}</p>}
      </div>

      {multiDay && (
        <nav aria-label={t('planDetail.itinerary')} className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 md:-mx-6 md:px-6 lg:mx-0 lg:px-0">
          {plan.days.map((day, index) => (
            <motion.button
              key={day.date}
              type="button"
              onClick={() => jumpTo(index)}
              aria-label={t('planEdit.jumpToDay', { n: index + 1 })}
              whileTap={{ scale: 0.92 }}
              className="flex h-12 shrink-0 flex-col items-start justify-center rounded-xl bg-card px-3 ring-1 ring-border paper-shadow transition-colors hover:bg-surface-elevated"
            >
              <span className="text-xs font-bold">{t('planEdit.dayN', { n: index + 1 })}</span>
              <span className="text-[11px] text-muted-foreground">
                {dayLabel(t, i18n.resolvedLanguage, day.date)} · {provinceName(day.province, i18n.resolvedLanguage)}
              </span>
            </motion.button>
          ))}
        </nav>
      )}

      <div className="flex flex-col gap-10">
        {plan.days.map((day, dayIndex) => (
          <DaySection key={day.date} {...props} day={day} dayIndex={dayIndex} />
        ))}
      </div>

      {canEdit && plan.days.length < MAX_TRIP_DAYS && (
        <motion.button
          type="button"
          onClick={onAddDay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: tailDelay }}
          whileTap={{ scale: 0.98 }}
          className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-card text-sm font-semibold text-muted-foreground ring-1 ring-border paper-shadow transition-colors hover:bg-surface-elevated hover:text-foreground"
        >
          <CalendarPlus className="size-4" />
          {t('planEdit.addDay')}
        </motion.button>
      )}

      <motion.div
        className="rounded-2xl border border-dashed border-vibe-surprise/40 bg-vibe-surprise/5 p-4 md:p-5"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: tailDelay + 0.1, type: 'spring' }}
      >
        <p className="text-xs font-semibold tracking-wider text-vibe-surprise uppercase">🎲 {t('planDetail.challenge')}</p>
        <p className="mt-1 font-heading text-lg font-bold">
          <span aria-hidden className="mr-2">
            {plan.challenge.emoji}
          </span>
          {plan.challenge.text[language] ?? plan.challenge.text.en}
        </p>
      </motion.div>
    </section>
  )
}

type DaySectionProps = ItineraryTimelineProps & { day: PlanDay; dayIndex: number }

function DaySection({ plan, day, dayIndex, reveal, canEdit, overlaps, onToggleLock, onReplace, onEdit, onAdd, onReorderDay, onMove, onUpdateDay, onRemoveDay }: DaySectionProps) {
  const { t, i18n } = useTranslation()
  const stops = stopsOfDay(plan.activities, dayIndex)
  const stagger = reveal ? 0.18 : 0.06
  const firstGlobalIndex = plan.activities.findIndex((activity) => activity.dayIndex === dayIndex)
  const offset = (reveal ? 0.6 : 0.1) + Math.max(firstGlobalIndex, 0) * stagger

  return (
    <section id={`day-${dayIndex}`} aria-label={t('planEdit.dayN', { n: dayIndex + 1 })} className="flex scroll-mt-24 flex-col gap-4">
      <header className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <div className="flex items-baseline gap-3">
          <span className="font-heading text-2xl font-bold">{t('planEdit.dayN', { n: dayIndex + 1 })}</span>
          <span className="text-sm text-muted-foreground">{dayLabel(t, i18n.resolvedLanguage, day.date, day.startTime)}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {canEdit ? (
            <>
              <label className="flex h-9 items-center gap-1.5 rounded-lg bg-card px-2.5 text-xs font-semibold ring-1 ring-border paper-shadow">
                <MapPin aria-hidden className="size-3.5 text-brand-pink" />
                <select
                  aria-label={t('planEdit.dayProvince', { n: dayIndex + 1 })}
                  value={day.province}
                  onChange={(event) => onUpdateDay(dayIndex, { province: event.target.value as ProvinceId })}
                  className="max-w-36 cursor-pointer appearance-none bg-transparent outline-none"
                >
                  {PROVINCES.map((province) => (
                    <option key={province.id} value={province.id} className="bg-popover">
                      {i18n.resolvedLanguage === 'vi' ? province.name : province.nameEn}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex h-9 items-center gap-1.5 rounded-lg bg-card px-2.5 text-xs font-semibold ring-1 ring-border paper-shadow">
                <Clock aria-hidden className="size-3.5 text-brand-mint" />
                <input
                  type="time"
                  step={900}
                  aria-label={t('planEdit.dayStart', { n: dayIndex + 1 })}
                  value={day.startTime}
                  onChange={(event) => event.target.value && onUpdateDay(dayIndex, { startTime: event.target.value })}
                  className="bg-transparent font-mono outline-none"
                />
              </label>
              {plan.days.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t('planEdit.removeDay', { n: dayIndex + 1 })}
                  title={stops.length > 0 ? t('planEdit.dayNotEmpty') : undefined}
                  disabled={stops.length > 0}
                  onClick={() => onRemoveDay(dayIndex)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 />
                </Button>
              )}
            </>
          ) : (
            <span className="text-xs font-semibold text-muted-foreground">
              📍 {provinceName(day.province, i18n.resolvedLanguage)} · <span className="font-mono">{day.startTime}</span>
            </span>
          )}
        </div>
      </header>

      <div className="relative pl-9 sm:pl-24">
        {stops.length > 0 && (
          <motion.span
            aria-hidden
            className="absolute top-6 bottom-6 left-[13px] w-0.5 origin-top rounded-full bg-gradient-to-b from-brand-purple via-brand-pink to-brand-mint sm:left-[71px]"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: offset - 0.1, duration: stops.length * stagger + 0.4, ease: 'easeInOut' }}
          />
        )}

        <Reorder.Group as="ol" axis="y" values={stops.map((stop) => stop.id)} onReorder={(ids) => onReorderDay(dayIndex, ids)} className="flex flex-col gap-4">
          {stops.map((activity, index) => (
            <TimelineStop
              key={activity.id}
              activity={activity}
              index={index}
              total={stops.length}
              delay={offset + index * stagger}
              canEdit={canEdit}
              overlapping={overlaps.has(activity.id)}
              onToggleLock={onToggleLock}
              onReplace={onReplace}
              onEdit={onEdit}
              onMove={onMove}
            />
          ))}
        </Reorder.Group>

        {canEdit && (
          <motion.button
            type="button"
            onClick={() => onAdd(dayIndex)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: offset + stops.length * stagger, type: 'spring' }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'relative flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 border-dashed border-primary/40 px-4 text-left font-semibold text-primary transition-colors hover:border-primary hover:bg-primary/5',
              stops.length > 0 && 'mt-4',
            )}
          >
            <span aria-hidden className="absolute top-1/2 -left-9 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-background sm:-left-[39px]">
              <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Plus className="size-3.5" strokeWidth={3} />
              </span>
            </span>
            <Plus className="size-5" />
            {t('planEdit.addStop')}
          </motion.button>
        )}
      </div>
    </section>
  )
}

type TimelineStopProps = {
  activity: Activity
  index: number
  total: number
  delay: number
  canEdit: boolean
  overlapping: boolean
  onToggleLock: (activityId: string) => void
  onReplace: (activityId: string) => void
  onEdit: (activity: Activity) => void
  onMove: (activityId: string, offset: -1 | 1) => void
}

function TimelineStop({ activity, index, total, delay, canEdit, overlapping, onToggleLock, onReplace, onEdit, onMove }: TimelineStopProps) {
  const { t } = useTranslation()
  const dragControls = useDragControls()

  return (
    <Reorder.Item
      as="li"
      value={activity.id}
      dragListener={false}
      dragControls={dragControls}
      className="relative"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, type: 'spring', stiffness: 260, damping: 24 }}
      whileDrag={{ scale: 1.03, zIndex: 20 }}
    >
      <span className={cn('absolute top-[18px] -left-24 hidden w-14 text-right font-mono text-xs sm:block', overlapping ? 'text-warning' : 'text-muted-foreground')}>
        {activity.startTime}
      </span>
      <span aria-hidden className={cn('absolute top-5 -left-7 size-3 rounded-full bg-background ring-[3px] sm:-left-[30px]', activity.manualTime ? 'ring-brand-mint' : 'ring-primary')} />
      <AnimatePresence mode="popLayout" initial={false}>
        {/* Keyed by content so Replace plays the flip while the stop keeps its place */}
        <ActivityCard
          key={`${activity.id}:${activity.title}`}
          activity={activity}
          canEdit={canEdit}
          overlapping={overlapping}
          dragHandle={
            canEdit && total > 1 ? (
              <button
                type="button"
                aria-label={t('planEdit.reorder', { title: activity.title })}
                onPointerDown={(event) => dragControls.start(event)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowUp' && index > 0) {
                    event.preventDefault()
                    onMove(activity.id, -1)
                  }
                  if (event.key === 'ArrowDown' && index < total - 1) {
                    event.preventDefault()
                    onMove(activity.id, 1)
                  }
                }}
                className="relative z-10 -my-1 -ml-1 flex w-6 shrink-0 cursor-grab touch-none items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground active:cursor-grabbing"
              >
                <GripVertical className="size-4" />
              </button>
            ) : null
          }
          onToggleLock={onToggleLock}
          onReplace={onReplace}
          onEdit={onEdit}
        />
      </AnimatePresence>
    </Reorder.Item>
  )
}

type ActivityCardProps = {
  activity: Activity
  canEdit: boolean
  overlapping: boolean
  dragHandle: React.ReactNode
  onToggleLock: (activityId: string) => void
  onReplace: (activityId: string) => void
  onEdit: (activity: Activity) => void
}

function ActivityCard({ activity, canEdit, overlapping, dragHandle, onToggleLock, onReplace, onEdit }: ActivityCardProps) {
  const { t } = useTranslation()

  return (
    <motion.article
      initial={{ rotateX: -80, opacity: 0, y: -10 }}
      animate={{ rotateX: 0, opacity: 1, y: 0 }}
      exit={{ rotateX: 80, opacity: 0, y: 10 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      style={{ transformPerspective: 800 }}
      className={cn(
        'group/card relative flex gap-3 rounded-2xl bg-card p-3 ring-1 ring-border paper-shadow transition-[box-shadow,background-color] sm:gap-4 sm:p-4 md:p-5',
        canEdit && 'hover:bg-surface-elevated',
        activity.locked && 'ring-2 ring-primary/70 shadow-[0_0_32px_-12px] shadow-primary',
        overlapping && 'ring-2 ring-warning/60',
      )}
    >
      {/* Whole card opens the editor; controls sit above this layer */}
      {canEdit && <button type="button" aria-label={t('planEdit.edit', { title: activity.title })} onClick={() => onEdit(activity)} className="absolute inset-0 rounded-2xl" />}
      {dragHandle}
      <span aria-hidden className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-surface-elevated text-2xl ring-1 ring-border sm:size-14 sm:text-3xl">
        {activity.emoji}
      </span>
      <div className="pointer-events-none flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start gap-2">
          <h3 className="min-w-0 flex-1 text-lg leading-snug font-bold">
            {activity.title}
            {canEdit && <Pencil aria-hidden className="ml-2 inline size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover/card:opacity-100" />}
          </h3>
          {activity.locked && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex h-6 shrink-0 items-center gap-1 rounded-lg bg-primary/15 px-2 text-xs font-semibold text-primary">
              <Lock className="size-3" />
              <span className="hidden sm:inline">{t('planDetail.locked')}</span>
            </motion.span>
          )}
        </div>
        <p className="flex items-center gap-1.5 truncate text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" />
          {activity.placeName}
        </p>
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className={cn('flex items-center gap-1 font-mono font-semibold sm:hidden', overlapping ? 'text-warning' : 'text-foreground')}>{activity.startTime}</span>
          {activity.manualTime && (
            <span className="flex items-center gap-1 text-brand-mint" title={t('planEdit.fields.timeManual')}>
              <Pin className="size-3.5" />
              <span className="sr-only">{t('planEdit.fields.timeManual')}</span>
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {formatDuration(activity.durationMinutes)}
          </span>
          <span className="flex items-center gap-1">
            <Wallet className="size-3.5" />
            {activity.estimatedCost === 0 ? t('planDetail.free') : formatVndCompact(activity.estimatedCost)}
          </span>
          {activity.distanceMeters > 0 && <span className="font-mono">{formatDistance(activity.distanceMeters)}</span>}
        </p>
        {overlapping && (
          <p className="flex items-center gap-1 text-xs font-semibold text-warning">
            <TriangleAlert className="size-3.5" />
            {t('planEdit.overlap')}
          </p>
        )}
      </div>
      {canEdit && (
        <div className="relative z-10 -my-1 -mr-1 flex shrink-0 flex-col gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-pressed={activity.locked}
            aria-label={activity.locked ? t('planDetail.unlock', { title: activity.title }) : t('planDetail.lock', { title: activity.title })}
            onClick={() => onToggleLock(activity.id)}
            className={cn(activity.locked && 'text-primary')}
          >
            {activity.locked ? <Lock className="size-4" /> : <LockOpen className="size-4" />}
          </Button>
          <Button variant="ghost" size="icon" disabled={activity.locked} aria-label={t('planDetail.replace', { title: activity.title })} onClick={() => onReplace(activity.id)} className="group">
            <Shuffle className="size-4 transition-transform duration-300 group-hover:rotate-180" />
          </Button>
        </div>
      )}
    </motion.article>
  )
}

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import { fromIsoDate, toIsoDate, todayIso } from '@/utils/date'

type DateRangeCalendarProps = {
  start: string
  end: string
  onPick: (iso: string) => void
  locale?: string
  label: string
  prevLabel: string
  nextLabel: string
}

/** Month grid with range highlighting. Weeks start on Monday (Vietnam). Past days are disabled. */
export function DateRangeCalendar({ start, end, onPick, locale = 'en', label, prevLabel, nextLabel }: DateRangeCalendarProps) {
  const today = todayIso()
  const [cursor, setCursor] = useState(() => {
    const date = fromIsoDate(start)
    return new Date(date.getFullYear(), date.getMonth(), 1)
  })
  const [direction, setDirection] = useState(1)

  const monthLabel = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(cursor)
  const weekdays = Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(locale, { weekday: 'narrow' }).format(new Date(2024, 0, 1 + index)),
  )
  const offset = (cursor.getDay() + 6) % 7
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate()
  const cells = Array.from({ length: offset + daysInMonth }, (_, index) =>
    index < offset ? null : toIsoDate(new Date(cursor.getFullYear(), cursor.getMonth(), index - offset + 1)),
  )
  const canGoBack = toIsoDate(cursor) > today.slice(0, 8) + '01'

  const shift = (months: number) => {
    setDirection(months)
    setCursor((current) => new Date(current.getFullYear(), current.getMonth() + months, 1))
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-card p-4 ring-1 ring-border paper-shadow" role="group" aria-label={label}>
      <div className="flex items-center justify-between">
        <Button type="button" variant="ghost" size="icon-sm" aria-label={prevLabel} disabled={!canGoBack} onClick={() => shift(-1)}>
          <ChevronLeft />
        </Button>
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.span
            key={monthLabel}
            custom={direction}
            initial={{ opacity: 0, x: direction * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -24 }}
            className="font-heading text-base font-bold capitalize"
            aria-live="polite"
          >
            {monthLabel}
          </motion.span>
        </AnimatePresence>
        <Button type="button" variant="ghost" size="icon-sm" aria-label={nextLabel} onClick={() => shift(1)}>
          <ChevronRight />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center">
        {weekdays.map((weekday, index) => (
          <span key={index} aria-hidden className="pb-1 text-xs font-semibold text-muted-foreground">
            {weekday}
          </span>
        ))}
        {cells.map((iso, index) => {
          if (!iso) return <span key={`blank-${index}`} />
          const disabled = iso < today
          const isStart = iso === start
          const isEnd = iso === end
          const inRange = iso > start && iso < end
          const isEdge = isStart || isEnd
          const day = Number(iso.slice(8))
          return (
            <div key={iso} className={cn('relative flex h-11 items-center justify-center', (inRange || (isStart && start !== end) || (isEnd && start !== end)) && 'bg-primary/15', isStart && start !== end && 'rounded-l-full', isEnd && start !== end && 'rounded-r-full')}>
              <motion.button
                type="button"
                disabled={disabled}
                aria-pressed={isEdge || inRange}
                aria-label={new Intl.DateTimeFormat(locale, { dateStyle: 'full' }).format(fromIsoDate(iso))}
                onClick={() => onPick(iso)}
                whileTap={{ scale: 0.85 }}
                className={cn(
                  'relative flex size-10 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                  disabled ? 'cursor-not-allowed text-muted-foreground/40' : 'hover:bg-surface-hover',
                  isEdge && 'bg-primary text-primary-foreground hover:bg-primary',
                  iso === today && !isEdge && 'ring-1 ring-brand-mint',
                )}
              >
                {day}
              </motion.button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

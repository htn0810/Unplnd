import type { TFunction } from 'i18next'
import { dayCount, formatDateRange, formatDayLabel, relativeDay } from '@/utils/date'
import { toMinutes } from './planTiming'

type Dated = { startDate: string; endDate: string; startTime: string }

const EVENING_MINUTES = 17 * 60

/** "Tonight" / "Today" / "Tomorrow" / "Sat, Oct 18" — or "Oct 17 – 19 · 3 days" for trips */
export function planWhenLabel(t: TFunction, locale: string | undefined, plan: Dated) {
  const days = dayCount(plan.startDate, plan.endDate)
  if (days > 1) return `${formatDateRange(plan.startDate, plan.endDate, locale)} · ${t('plan.days', { count: days })}`
  return dayLabel(t, locale, plan.startDate, plan.startTime)
}

/** Label for a single day of a plan */
export function dayLabel(t: TFunction, locale: string | undefined, date: string, startTime?: string) {
  const relative = relativeDay(date)
  if (relative === 'TODAY') return startTime && toMinutes(startTime) >= EVENING_MINUTES ? t('plan.day.TONIGHT') : t('plan.day.TODAY')
  if (relative === 'TOMORROW') return t('plan.day.TOMORROW')
  return formatDayLabel(date, locale)
}

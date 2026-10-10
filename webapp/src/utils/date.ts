/** Dates are ISO `YYYY-MM-DD` strings in local time (no timezone drift) */

export const toIsoDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

export const fromIsoDate = (iso: string) => {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export const todayIso = () => toIsoDate(new Date())

export const addDays = (iso: string, days: number) => {
  const date = fromIsoDate(iso)
  date.setDate(date.getDate() + days)
  return toIsoDate(date)
}

/** Inclusive number of days between two ISO dates */
export const dayCount = (startIso: string, endIso: string) =>
  Math.round((fromIsoDate(endIso).getTime() - fromIsoDate(startIso).getTime()) / 86_400_000) + 1

export const relativeDay = (iso: string): 'TODAY' | 'TOMORROW' | null => {
  const today = todayIso()
  if (iso === today) return 'TODAY'
  if (iso === addDays(today, 1)) return 'TOMORROW'
  return null
}

/** "Sat, Oct 18" (en) / "T7, 18 thg 10" (vi) */
export const formatDayLabel = (iso: string, locale = 'en') =>
  new Intl.DateTimeFormat(locale, { weekday: 'short', month: 'short', day: 'numeric' }).format(fromIsoDate(iso))

/** "Oct 17 – 19" style range */
export const formatDateRange = (startIso: string, endIso: string, locale = 'en') =>
  new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).formatRange(fromIsoDate(startIso), fromIsoDate(endIso))

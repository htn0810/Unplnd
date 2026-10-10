/** "2026-10-03" → "Oct 3" (en) / "3 thg 10" (vi) */
export function formatShortDate(isoDate: string, locale = 'en') {
  return new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(new Date(`${isoDate}T00:00:00`))
}

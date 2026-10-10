/** 2 → "2 min. ago" / "2 phút trước"; picks minutes, hours or days */
export function formatRelativeTime(minutesAgo: number, locale = 'en') {
  const format = new Intl.RelativeTimeFormat(locale, { numeric: 'auto', style: 'short' })
  if (minutesAgo < 60) return format.format(-Math.max(minutesAgo, 1), 'minute')
  if (minutesAgo < 60 * 24) return format.format(-Math.round(minutesAgo / 60), 'hour')
  return format.format(-Math.round(minutesAgo / (60 * 24)), 'day')
}

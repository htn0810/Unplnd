import type { Activity, PlanDay } from './planTypes'

export const STOP_GAP_MINUTES = 15

export const toMinutes = (clock: string) => {
  const [hours, minutes] = clock.split(':').map(Number)
  return hours * 60 + minutes
}

export const toClock = (minutes: number) =>
  `${String(Math.floor(minutes / 60) % 24).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`

/** Stops of one day, in route order */
export const stopsOfDay = (activities: Activity[], dayIndex: number) => activities.filter((activity) => activity.dayIndex === dayIndex)

/**
 * Recomputes start times per day. Auto stops follow the previous stop (end + gap);
 * manual stops keep their pinned time and the following auto stops continue after them.
 * Output is grouped by day so the flat list stays in route order.
 */
export function retime(activities: Activity[], days: PlanDay[]): Activity[] {
  return days.flatMap((day, dayIndex) => {
    let cursor = toMinutes(day.startTime)
    return stopsOfDay(activities, dayIndex).map((activity) => {
      const start = activity.manualTime ? toMinutes(activity.startTime) : cursor
      cursor = start + activity.durationMinutes + STOP_GAP_MINUTES
      return { ...activity, startTime: toClock(start) }
    })
  })
}

/** Ids of stops that start before the previous stop (same day) has ended */
export function findOverlaps(activities: Activity[]): Set<string> {
  const overlaps = new Set<string>()
  const lastEnd = new Map<number, number>()
  for (const activity of activities) {
    const start = toMinutes(activity.startTime)
    const previousEnd = lastEnd.get(activity.dayIndex)
    if (previousEnd !== undefined && start < previousEnd) overlaps.add(activity.id)
    lastEnd.set(activity.dayIndex, start + activity.durationMinutes)
  }
  return overlaps
}

import { useQueryClient } from '@tanstack/react-query'
import type { ProvinceId } from '@/constants/provinces'
import { addDays } from '@/utils/date'
import { planKeys } from './planQueries'
import { planService } from './planService'
import { retime, stopsOfDay } from './planTiming'
import type { Activity, PlanDetail, PlanStatus } from './planTypes'

export type ActivityDraft = Pick<Activity, 'emoji' | 'title' | 'placeName' | 'durationMinutes' | 'estimatedCost' | 'dayIndex' | 'startTime'> &
  Partial<Pick<Activity, 'type' | 'distanceMeters' | 'manualTime' | 'province' | 'lat' | 'lng'>>

export type PlanDetailsDraft = Pick<PlanDetail, 'title' | 'startDate'>

const pickRandom = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)]

/** Keeps derived plan fields in sync after any edit */
const normalize = (plan: PlanDetail): PlanDetail => {
  const activities = retime(plan.activities, plan.days)
  return {
    ...plan,
    activities,
    startDate: plan.days[0].date,
    endDate: plan.days[plan.days.length - 1].date,
    startTime: plan.days[0].startTime,
  }
}

/**
 * Mock mutations for the plan detail screen. They update the TanStack Query cache directly
 * (as an optimistic update would) until plan-service endpoints exist.
 */
export function usePlanDetailActions(planId: string) {
  const queryClient = useQueryClient()
  const key = planKeys.detail(planId)

  const update = (updater: (plan: PlanDetail) => PlanDetail) => {
    const next = queryClient.setQueryData<PlanDetail | null>(key, (plan) => (plan ? normalize(updater(plan)) : plan))
    if (next) planService.rememberPlan(next)
    void queryClient.invalidateQueries({ queryKey: planKeys.upcoming() })
  }

  const replaceWithAlternative = (plan: PlanDetail, activity: Activity): Activity => {
    const used = new Set(plan.activities.map((item) => item.title))
    const candidates = plan.alternatives.filter((alt) => !used.has(alt.title))
    const alternative = pickRandom(candidates.length > 0 ? candidates : plan.alternatives)
    // Same id keeps the stop's position stable (reorder); the card flips because its content key changes
    return { ...activity, ...alternative, locked: false }
  }

  const reorderWithinDay = (activities: Activity[], dayIndex: number, orderedIds: string[]) => {
    const byId = new Map(activities.map((item) => [item.id, item]))
    const reordered = orderedIds.map((id) => byId.get(id)).filter((item): item is Activity => Boolean(item))
    return [...activities.filter((item) => item.dayIndex !== dayIndex), ...reordered]
  }

  return {
    toggleLock: (activityId: string) =>
      update((plan) => ({ ...plan, activities: plan.activities.map((item) => (item.id === activityId ? { ...item, locked: !item.locked } : item)) })),

    replaceActivity: (activityId: string) =>
      update((plan) => ({ ...plan, activities: plan.activities.map((item) => (item.id === activityId ? replaceWithAlternative(plan, item) : item)) })),

    /** Re-rolls every unlocked activity. Returns how many changed. */
    regenerate: () => {
      let changed = 0
      update((plan) => ({
        ...plan,
        activities: plan.activities.map((item) => {
          if (item.locked) return item
          changed += 1
          return replaceWithAlternative(plan, item)
        }),
      }))
      return changed
    },

    vote: (pollId: string, optionId: string) =>
      update((plan) => ({
        ...plan,
        polls: plan.polls.map((poll) => {
          if (poll.id !== pollId) return poll
          const previous = poll.myVoteOptionId
          const isUnvote = previous === optionId
          return {
            ...poll,
            myVoteOptionId: isUnvote ? null : optionId,
            options: poll.options.map((option) => {
              let votes = option.votes
              if (option.id === previous) votes -= 1
              if (option.id === optionId && !isUnvote) votes += 1
              return { ...option, votes }
            }),
          }
        }),
      })),

    /** Simulated vote from another member (stands in for PLAN_VOTE_CAST over WebSocket) */
    receiveVote: (pollId: string, optionId: string) =>
      update((plan) => ({
        ...plan,
        polls: plan.polls.map((poll) =>
          poll.id === pollId ? { ...poll, options: poll.options.map((option) => (option.id === optionId ? { ...option, votes: option.votes + 1 } : option)) } : poll,
        ),
      })),

    setStatus: (status: PlanStatus) => update((plan) => ({ ...plan, status })),

    /** Edits a stop; moving it to another day appends it to that day */
    updateActivity: (activityId: string, draft: ActivityDraft) =>
      update((plan) => {
        const current = plan.activities.find((item) => item.id === activityId)
        if (!current) return plan
        const next = { ...current, ...draft }
        const others = plan.activities.filter((item) => item.id !== activityId)
        if (current.dayIndex === draft.dayIndex) return { ...plan, activities: plan.activities.map((item) => (item.id === activityId ? next : item)) }
        return { ...plan, activities: [...others, next] }
      }),

    addActivity: (draft: ActivityDraft) =>
      update((plan) => ({
        ...plan,
        activities: [
          ...plan.activities,
          { type: 'CUSTOM', distanceMeters: 0, province: plan.days[draft.dayIndex]?.province, ...draft, id: `act_custom_${Date.now().toString(36)}`, locked: false },
        ],
      })),

    /** Returns the removed stop and its index so the caller can offer undo */
    removeActivity: (activityId: string) => {
      let removed: { activity: Activity; index: number } | null = null
      update((plan) => {
        if (plan.activities.length <= 1) return plan
        const index = plan.activities.findIndex((item) => item.id === activityId)
        if (index === -1) return plan
        removed = { activity: plan.activities[index], index }
        return { ...plan, activities: plan.activities.filter((item) => item.id !== activityId) }
      })
      return removed as { activity: Activity; index: number } | null
    },

    restoreActivity: (activity: Activity, index: number) =>
      update((plan) => {
        const activities = [...plan.activities]
        activities.splice(index, 0, activity)
        return { ...plan, activities }
      }),

    reorderDay: (dayIndex: number, orderedIds: string[]) =>
      update((plan) => ({ ...plan, activities: reorderWithinDay(plan.activities, dayIndex, orderedIds) })),

    moveActivity: (activityId: string, offset: -1 | 1) =>
      update((plan) => {
        const activity = plan.activities.find((item) => item.id === activityId)
        if (!activity) return plan
        const ids = stopsOfDay(plan.activities, activity.dayIndex).map((item) => item.id)
        const index = ids.indexOf(activityId)
        const target = index + offset
        if (target < 0 || target >= ids.length) return plan
        ;[ids[index], ids[target]] = [ids[target], ids[index]]
        return { ...plan, activities: reorderWithinDay(plan.activities, activity.dayIndex, ids) }
      }),

    /** Changing the start date shifts every day of the trip */
    updateDetails: (draft: PlanDetailsDraft) =>
      update((plan) => ({ ...plan, title: draft.title, days: plan.days.map((day, index) => ({ ...day, date: addDays(draft.startDate, index) })) })),

    updateDay: (dayIndex: number, patch: { startTime?: string; province?: ProvinceId }) =>
      update((plan) => ({ ...plan, days: plan.days.map((day, index) => (index === dayIndex ? { ...day, ...patch } : day)) })),

    addDay: () =>
      update((plan) => {
        const last = plan.days[plan.days.length - 1]
        return { ...plan, days: [...plan.days, { date: addDays(last.date, 1), startTime: plan.days[0].startTime, province: last.province }] }
      }),

    /** Only empty days can be removed; later days shift down */
    removeDay: (dayIndex: number) => {
      let removed = false
      update((plan) => {
        if (plan.days.length <= 1 || stopsOfDay(plan.activities, dayIndex).length > 0) return plan
        removed = true
        const days = plan.days.filter((_, index) => index !== dayIndex).map((day, index) => ({ ...day, date: addDays(plan.days[0].date, index) }))
        return { ...plan, days, activities: plan.activities.map((item) => (item.dayIndex > dayIndex ? { ...item, dayIndex: item.dayIndex - 1 } : item)) }
      })
      return removed
    },
  }
}

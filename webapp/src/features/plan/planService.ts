import { MOCK_DATA } from '@/constants/mockData'
import { getMock } from '@/services/apiClient'
import { generatePlan, type GeneratePlanInput, type PoolActivity } from './planGenerator'
import { retime } from './planTiming'
import type { Challenge, HomeFeature, PlanActivity, PlanDetail, RecentPlan, UpcomingPlan } from './planTypes'

/**
 * Session-only store for generated or edited plans (mock persistence until plan-service exists).
 * Reads check it first so refetches never revert local changes.
 */
const sessionPlans = new Map<string, PlanDetail>()

const toUpcoming = (plan: PlanDetail): UpcomingPlan => ({
  id: plan.id,
  inviteCode: plan.inviteCode,
  title: plan.title,
  vibe: plan.vibe,
  status: plan.status,
  startDate: plan.startDate,
  endDate: plan.endDate,
  destination: plan.destination,
  startTime: plan.startTime,
  durationMinutes: plan.durationMinutes,
  budgetPerPerson: plan.budgetPerPerson,
  radiusMeters: plan.radiusMeters,
  pendingVotesForMe: plan.polls.filter((poll) => poll.myVoteOptionId === null).length,
  members: plan.members,
  itinerary: plan.activities.map((activity) => ({ type: activity.type, emoji: activity.emoji, label: activity.title, startTime: activity.startTime })),
})

export const planService = {
  getUpcomingPlans: async () => {
    const mock = await getMock<UpcomingPlan[]>(MOCK_DATA.upcomingPlans)
    const generated = [...sessionPlans.values()].filter((plan) => !mock.some((item) => item.id === plan.id)).map(toUpcoming)
    return [...generated.reverse(), ...mock]
  },
  getRecentPlans: () => getMock<RecentPlan[]>(MOCK_DATA.recentPlans),
  getPlanActivity: async (planId: string) => {
    const activity = await getMock<PlanActivity[]>(MOCK_DATA.planActivity)
    return activity.filter((item) => item.planId === planId)
  },
  getPlanDetail: async (planId: string) => {
    const remembered = sessionPlans.get(planId)
    if (remembered) return remembered
    const plans = await getMock<PlanDetail[]>(MOCK_DATA.planDetails)
    const plan = plans.find((item) => item.id === planId)
    // Stored times always follow the auto/manual rule, so the first edit never "jumps" a stop
    return plan ? { ...plan, activities: retime(plan.activities, plan.days) } : null
  },
  getPlanByInviteCode: async (inviteCode: string) => {
    const code = inviteCode.toUpperCase()
    const remembered = [...sessionPlans.values()].find((plan) => plan.inviteCode === code)
    if (remembered) return remembered
    const plans = await getMock<PlanDetail[]>(MOCK_DATA.planDetails)
    return plans.find((plan) => plan.inviteCode === code) ?? null
  },
  generatePlan: async (input: GeneratePlanInput) => {
    const [pool, challenges] = await Promise.all([
      getMock<PoolActivity[]>(MOCK_DATA.activityPool),
      getMock<Challenge[]>(MOCK_DATA.challenges),
    ])
    const plan = generatePlan(input, pool, challenges)
    sessionPlans.set(plan.id, plan)
    return plan
  },
  /** Keeps local edits (lock, replace, votes, status) for the session */
  rememberPlan: (plan: PlanDetail) => {
    sessionPlans.set(plan.id, plan)
  },
  /** Ideas for the stop editor's suggestions (stands in for Place Service search) */
  getActivityPool: () => getMock<PoolActivity[]>(MOCK_DATA.activityPool),
  getChallenges: () => getMock<Challenge[]>(MOCK_DATA.challenges),
  getHomeFeature: () => getMock<HomeFeature>(MOCK_DATA.homeFeature),
}

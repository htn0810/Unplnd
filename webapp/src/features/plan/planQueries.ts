import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { planService } from './planService'

export const planKeys = {
  all: ['plans'] as const,
  homeFeature: () => [...planKeys.all, 'home-feature'] as const,
  challenges: () => [...planKeys.all, 'challenges'] as const,
  activityPool: () => [...planKeys.all, 'activity-pool'] as const,
  detail: (planId: string) => [...planKeys.all, 'detail', planId] as const,
  byInvite: (inviteCode: string) => [...planKeys.all, 'invite', inviteCode] as const,
  upcoming: () => [...planKeys.all, 'upcoming'] as const,
  recent: () => [...planKeys.all, 'recent'] as const,
  activity: (planId: string) => [...planKeys.all, planId, 'activity'] as const,
}

export function useGeneratePlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: planService.generatePlan,
    onSuccess: (plan) => {
      queryClient.setQueryData(planKeys.detail(plan.id), plan)
      void queryClient.invalidateQueries({ queryKey: planKeys.upcoming() })
    },
  })
}

export function usePlanDetail(planId: string) {
  return useQuery({ queryKey: planKeys.detail(planId), queryFn: () => planService.getPlanDetail(planId) })
}

export function usePlanByInviteCode(inviteCode: string) {
  return useQuery({ queryKey: planKeys.byInvite(inviteCode), queryFn: () => planService.getPlanByInviteCode(inviteCode) })
}

export function useActivityPool() {
  return useQuery({ queryKey: planKeys.activityPool(), queryFn: planService.getActivityPool, staleTime: Infinity })
}

export function useChallenges() {
  return useQuery({ queryKey: planKeys.challenges(), queryFn: planService.getChallenges })
}

export function useHomeFeature() {
  return useQuery({ queryKey: planKeys.homeFeature(), queryFn: planService.getHomeFeature })
}

export function useUpcomingPlans() {
  return useQuery({ queryKey: planKeys.upcoming(), queryFn: planService.getUpcomingPlans })
}

export function useRecentPlans() {
  return useQuery({ queryKey: planKeys.recent(), queryFn: planService.getRecentPlans })
}

export function usePlanActivity(planId: string) {
  return useQuery({ queryKey: planKeys.activity(planId), queryFn: () => planService.getPlanActivity(planId) })
}

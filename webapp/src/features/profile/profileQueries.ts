import { useQuery } from '@tanstack/react-query'
import { profileService } from './profileService'

export const profileKeys = {
  me: ['me'] as const,
  profile: ['profile'] as const,
  friendsAround: ['friends', 'around'] as const,
}

export function useProfile() {
  return useQuery({ queryKey: profileKeys.profile, queryFn: profileService.getProfile })
}

export function useMe() {
  return useQuery({ queryKey: profileKeys.me, queryFn: profileService.getMe })
}

export function useFriendsAround() {
  return useQuery({ queryKey: profileKeys.friendsAround, queryFn: profileService.getFriendsAround })
}

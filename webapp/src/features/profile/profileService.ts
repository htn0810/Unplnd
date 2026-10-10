import { MOCK_DATA } from '@/constants/mockData'
import { getMock } from '@/services/apiClient'
import type { CurrentUser, Friend, Profile } from './profileTypes'

export const profileService = {
  getProfile: () => getMock<Profile>(MOCK_DATA.profile),
  getMe: () => getMock<CurrentUser>(MOCK_DATA.me),
  getFriendsAround: () => getMock<Friend[]>(MOCK_DATA.friendsAround),
}

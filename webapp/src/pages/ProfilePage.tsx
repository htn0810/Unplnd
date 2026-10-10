import { RecentPlans } from '@/features/plan'
import { ProfileView } from '@/features/profile'

export function ProfilePage() {
  return (
    <ProfileView>
      <RecentPlans />
    </ProfileView>
  )
}

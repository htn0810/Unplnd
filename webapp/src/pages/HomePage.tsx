import { NearbyPlaces } from '@/features/place'
import { ChallengeCard, JoinPlanForm, MakePlanHero, PlanEquation, RecentPlans, UpcomingPlans, VibeRail } from '@/features/plan'
import { FriendsAround, useMe } from '@/features/profile'

/** Home answers one question: what can I do right now? Discovery sections follow below. */
export function HomePage() {
  const { data: me } = useMe()

  return (
    <main className="mx-auto flex w-full max-w-screen-xl flex-col gap-16 px-4 pt-4 pb-16 md:px-6 md:pt-6 lg:gap-24 lg:px-8 lg:pt-8 lg:pb-24">
      <MakePlanHero userName={me?.name}>
        <FriendsAround />
      </MakePlanHero>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        <UpcomingPlans />

        <div className="flex flex-col gap-12">
          <JoinPlanForm />
          <RecentPlans />
        </div>
      </div>

      <VibeRail />

      <NearbyPlaces />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-6">
        <ChallengeCard />
        <PlanEquation />
      </div>
    </main>
  )
}

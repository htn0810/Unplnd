import { useTranslation } from 'react-i18next'
import { Skeleton } from '@/components/ui/skeleton'
import { useUpcomingPlans } from './planQueries'
import { UpcomingPlanCard } from './UpcomingPlanCard'

export function UpcomingPlans() {
  const { t } = useTranslation()
  const { data: plans, isPending, isError } = useUpcomingPlans()

  if (isPending) return <Skeleton className="h-[440px] rounded-2xl" />
  // Home stays focused: no active plans (or a failed load) simply hides this section
  if (isError || plans.length === 0) return null

  return (
    <section aria-labelledby="happening-now-title" className="flex flex-col gap-4">
      <h2 id="happening-now-title" className="kicker">
        {t('home.happeningNow')}
      </h2>
      {plans.map((plan) => (
        <UpcomingPlanCard key={plan.id} plan={plan} />
      ))}
    </section>
  )
}

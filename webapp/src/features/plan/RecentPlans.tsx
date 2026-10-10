import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useRecentPlans } from './planQueries'
import { RecentPlanCard } from './RecentPlanCard'

const LIST_CLASS =
  '-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 scrollbar-none md:-mx-6 md:px-6 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0'

export function RecentPlans() {
  const { t } = useTranslation()
  const { data: plans, isPending, isError, refetch } = useRecentPlans()

  return (
    <section aria-labelledby="recent-memories-title" className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 id="recent-memories-title" className="kicker">
          {t('home.recentMemories')}
        </h2>
        <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
          {t('common.seeAll')}
        </a>
      </div>

      {isPending && (
        <div className={LIST_CLASS} aria-busy="true">
          {[0, 1, 2].map((key) => (
            <Skeleton key={key} className="h-48 w-[78%] shrink-0 rounded-xl sm:w-[55%] lg:w-auto" />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-start gap-3 rounded-xl bg-card p-4 ring-1 ring-border paper-shadow">
          <p className="font-semibold">{t('memories.errorTitle')}</p>
          <p className="text-sm text-muted-foreground">{t('memories.errorBody')}</p>
          <Button variant="secondary" onClick={() => refetch()}>
            {t('common.tryAgain')}
          </Button>
        </div>
      )}

      {plans?.length === 0 && (
        <div className="rounded-xl bg-card p-6 text-center ring-1 ring-border paper-shadow">
          <p className="font-heading text-lg font-bold">{t('memories.emptyTitle')}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t('memories.emptyBody')}</p>
        </div>
      )}

      {plans && plans.length > 0 && (
        <div className={LIST_CLASS}>
          {plans.map((plan) => (
            <RecentPlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      )}
    </section>
  )
}

import { Plus } from 'lucide-react'
import { BongSprite } from '@/components/BongSprite'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/utils/cn'
import { PlanListCard } from './PlanListCard'
import { useRecentPlans, useUpcomingPlans } from './planQueries'
import { RecentPlanCard } from './RecentPlanCard'

export function PlansView() {
  const { t } = useTranslation()
  const upcoming = useUpcomingPlans()
  const recent = useRecentPlans()

  return (
    <main className="mx-auto w-full max-w-screen-xl px-4 pt-6 pb-16 md:px-6 lg:px-8 lg:pt-10">
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-[40px] leading-[44px] font-bold tracking-tight md:text-[56px] md:leading-[60px]">{t('plans.title')}</h1>
          <p className="text-muted-foreground">{t('plans.subtitle')}</p>
        </div>
        <Link to={ROUTES.planNew} className={cn(buttonVariants(), 'hidden shrink-0 font-bold md:inline-flex')}>
          <Plus />
          {t('home.makePlan')}
        </Link>
      </div>

      <Tabs defaultValue="upcoming" className="mt-8 gap-6">
        <TabsList className="h-11 w-full rounded-xl p-1 sm:w-fit">
          <TabsTrigger value="upcoming" className="h-9 flex-1 rounded-lg px-5 font-semibold sm:flex-none">
            {t('plans.tabUpcoming')}
            {upcoming.data && <span className="ml-1.5 rounded-md bg-primary/20 px-1.5 text-xs text-primary">{upcoming.data.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="memories" className="h-9 flex-1 rounded-lg px-5 font-semibold sm:flex-none">
            {t('plans.tabMemories')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4">
            {upcoming.isPending && [0, 1].map((key) => <Skeleton key={key} className="h-32 rounded-2xl" />)}
            {upcoming.data?.map((plan, index) => (
              <PlanListCard key={plan.id} plan={plan} index={index} />
            ))}
          </motion.ul>
          {upcoming.data?.length === 0 && <EmptyPlans />}
        </TabsContent>

        <TabsContent value="memories">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            {recent.isPending && [0, 1, 2].map((key) => <Skeleton key={key} className="h-48 rounded-xl" />)}
            {recent.data?.map((plan, index) => (
              <motion.div key={plan.id} className="[&>article]:w-full" initial={{ opacity: 0, y: 16, rotate: index % 2 ? 1.5 : -1.5 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ delay: index * 0.06, type: 'spring', stiffness: 260, damping: 22 }}>
                <RecentPlanCard plan={plan} />
              </motion.div>
            ))}
          </motion.div>
          {recent.data?.length === 0 && <EmptyPlans />}
        </TabsContent>
      </Tabs>
    </main>
  )
}

function EmptyPlans() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-card px-6 py-12 text-center ring-1 ring-border paper-shadow">
      <BongSprite mood="sleepy" />
      <p className="font-heading text-lg font-bold">{t('memories.emptyTitle')}</p>
      <Link to={ROUTES.planNew} className={cn(buttonVariants(), 'font-bold')}>
        {t('home.makePlan')}
      </Link>
    </div>
  )
}

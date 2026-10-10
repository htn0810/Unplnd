import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ArrowLeft, ArrowRight, Sparkles, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { Button, buttonVariants } from '@/components/ui/button'
import { APP_NAME } from '@/constants/app'
import { planPath, ROUTES } from '@/constants/routes'
import { VIBE_META, VIBES, type Vibe } from '@/constants/vibes'
import { cn } from '@/utils/cn'
import { useFriendsAround, useMe } from '@/features/profile'
import { useGeneratePlan } from '../planQueries'
import { CREATE_PLAN_STEPS, useCreatePlanStore } from '../createPlanStore'
import { BudgetStep } from './BudgetStep'
import { DurationStep } from './DurationStep'
import { GeneratingOverlay } from './GeneratingOverlay'
import { LocationStep } from './LocationStep'
import { PeopleStep } from './PeopleStep'
import { PlanSummary, PlanSummaryChips } from './PlanSummary'
import { VibeStep } from './VibeStep'
import { WhenStep } from './WhenStep'

const STEP_COMPONENTS = {
  people: PeopleStep,
  when: WhenStep,
  duration: DurationStep,
  budget: BudgetStep,
  vibe: VibeStep,
  location: LocationStep,
} as const

const slide = {
  enter: (direction: number) => ({ x: direction * 60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction * -60, opacity: 0 }),
}

export function CreatePlanWizard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [generating, setGenerating] = useState(false)
  const [overlayDone, setOverlayDone] = useState(false)
  const { stepIndex, direction, friendIds, startDate, endDate, startTime, durationMinutes, budgetPerPerson, vibe, locationMode, radiusKm, province, next, back, reset } =
    useCreatePlanStore()
  const { data: me } = useMe()
  const { data: friends = [] } = useFriendsAround()
  const generation = useGeneratePlan()

  // Fresh wizard on every visit; ?vibe=CHAOS preselects a vibe (from Home's vibe rail)
  const presetVibe = searchParams.get('vibe')
  useEffect(() => {
    reset({ vibe: VIBES.includes(presetVibe as Vibe) ? (presetVibe as Vibe) : null })
  }, [presetVibe, reset])

  const step = CREATE_PLAN_STEPS[stepIndex]
  const StepComponent = STEP_COMPONENTS[step]
  const isLast = stepIndex === CREATE_PLAN_STEPS.length - 1
  const canContinue =
    (step === 'duration' && durationMinutes !== null) ||
    (step === 'budget' && budgetPerPerson !== null) ||
    (step === 'vibe' && vibe !== null) ||
    step === 'people' ||
    step === 'when' ||
    (step === 'location' && (locationMode === 'nearby' || province !== null))

  const handleOverlayDone = useCallback(() => setOverlayDone(true), [])

  // Open the generated plan once both the reveal sequence and the generation have finished
  const generatedPlanId = generation.data?.id
  useEffect(() => {
    if (overlayDone && generatedPlanId) navigate(planPath(generatedPlanId), { state: { reveal: true } })
  }, [overlayDone, generatedPlanId, navigate])

  const submit = () => {
    if (!vibe || !durationMinutes || !budgetPerPerson) return
    setOverlayDone(false)
    setGenerating(true)
    generation.mutate(
      {
        vibe,
        startDate,
        endDate,
        startTime,
        durationMinutes,
        budgetPerPerson,
        location: locationMode === 'province' && province ? { mode: 'province', province } : { mode: 'nearby', radiusKm },
        me: { id: me?.id ?? 'user_1', name: me?.name ?? 'You', initials: me?.initials ?? 'ME' },
        friends: friends.filter((friend) => friendIds.includes(friend.id)),
      },
      {
        onError: () => {
          setGenerating(false)
          toast.error(t('auth.errors.generic'))
        },
      },
    )
  }

  const handleNext = () => (isLast ? submit() : next())

  return (
    <div className="relative isolate flex min-h-svh flex-col overflow-x-clip">
      {/* Ambient glow follows the chosen vibe */}
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute -top-40 left-1/2 -z-10 size-[560px] -translate-x-1/2 rounded-full opacity-25 blur-3xl transition-colors duration-700',
          vibe ? VIBE_META[vibe].dotClass : 'bg-primary',
        )}
      />

      <header className="mx-auto flex h-16 w-full max-w-screen-xl items-center gap-4 px-4 md:px-6 lg:px-8">
        <Link to={ROUTES.home} className="flex items-center gap-1 font-heading text-xl font-bold tracking-tight">
          {APP_NAME}
          <span aria-hidden className="mt-2 size-1.5 rounded-full bg-brand-gradient" />
        </Link>
        <span className="ml-auto font-mono text-sm text-muted-foreground">
          {t('createPlan.stepOf', { current: stepIndex + 1, total: CREATE_PLAN_STEPS.length })}
        </span>
        <Link to={ROUTES.home} aria-label={t('createPlan.close')} className={buttonVariants({ variant: 'ghost', size: 'icon' })}>
          <X className="size-5" />
        </Link>
      </header>

      <div className="mx-auto w-full max-w-screen-xl px-4 md:px-6 lg:px-8">
        <div
          role="progressbar"
          aria-label={t('planDetail.progress')}
          aria-valuemin={1}
          aria-valuemax={CREATE_PLAN_STEPS.length}
          aria-valuenow={stepIndex + 1}
          className="grid grid-cols-6 gap-1.5"
        >
          {CREATE_PLAN_STEPS.map((item, index) => (
            <span key={item} className="h-1.5 overflow-hidden rounded-full bg-muted">
              <motion.span
                className="block h-full rounded-full bg-brand-gradient"
                initial={false}
                animate={{ width: index <= stepIndex ? '100%' : '0%' }}
                transition={{ type: 'spring', stiffness: 200, damping: 30 }}
              />
            </span>
          ))}
        </div>
        <div className="mt-4 lg:hidden">
          <PlanSummaryChips />
        </div>
      </div>

      <main className="mx-auto grid w-full max-w-screen-xl flex-1 grid-cols-1 gap-10 px-4 pt-8 pb-36 md:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16 lg:px-8 lg:pt-12 lg:pb-16">
        <section aria-labelledby="step-title" className="flex max-w-2xl flex-col gap-10">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={step}
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            >
              <StepComponent />
            </motion.div>
          </AnimatePresence>

          <div className="fixed inset-x-0 bottom-0 z-30 flex gap-3 border-t border-border bg-background/90 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur-md md:px-6 lg:static lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
            {stepIndex > 0 && (
              <Button variant="secondary" size="lg" className="h-13 rounded-xl px-5" onClick={back} aria-label={t('createPlan.back')}>
                <ArrowLeft />
                <span className="hidden sm:inline">{t('createPlan.back')}</span>
              </Button>
            )}
            <div className="group relative flex-1 lg:max-w-xs">
              {isLast && (
                <div aria-hidden className="absolute -inset-1 rounded-2xl bg-brand-gradient opacity-50 blur-lg transition-opacity group-hover:opacity-80" />
              )}
              <Button size="lg" className="relative h-13 w-full rounded-xl text-base font-bold tracking-wide" disabled={!canContinue} onClick={handleNext}>
                {isLast ? (
                  <>
                    <Sparkles className="size-5" />
                    {t('createPlan.submit')}
                  </>
                ) : (
                  <>
                    {t('createPlan.next')}
                    <ArrowRight />
                  </>
                )}
              </Button>
            </div>
          </div>
        </section>

        <div className="hidden lg:block">
          <div className="sticky top-8">
            <PlanSummary />
          </div>
        </div>
      </main>

      <AnimatePresence>{generating && <GeneratingOverlay vibe={vibe} onDone={handleOverlayDone} />}</AnimatePresence>
    </div>
  )
}

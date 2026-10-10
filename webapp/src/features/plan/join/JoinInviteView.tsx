import { useEffect, useState } from 'react'
import { BongSprite } from '@/components/BongSprite'
import { Loader2, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { Trans, useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { MemberStack } from '@/components/MemberStack'
import { Button, buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { VibeBadge } from '@/components/VibeBadge'
import { useHeroImage } from '@/hooks/useHeroImage'
import { planPath, ROUTES } from '@/constants/routes'
import { cn } from '@/utils/cn'
import { formatVndCompact } from '@/utils/formatCurrency'
import { formatDuration } from '@/utils/formatDuration'
import { ConfettiBurst } from '../detail/ConfettiBurst'
import { planWhenLabel } from '../planDates'
import { usePlanByInviteCode } from '../planQueries'

const ME = { id: 'me', name: 'You', initials: 'ME', online: true }

type JoinState = 'idle' | 'joining' | 'joined'

export function JoinInviteView({ inviteCode }: { inviteCode: string }) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { data: plan, isPending } = usePlanByInviteCode(inviteCode)
  const [state, setState] = useState<JoinState>('idle')
  const heroImage = useHeroImage()

  useEffect(() => {
    if (state === 'joining') {
      const id = window.setTimeout(() => setState('joined'), 900)
      return () => window.clearTimeout(id)
    }
    if (state === 'joined' && plan) {
      toast.success(t('join.joined'))
      const id = window.setTimeout(() => navigate(planPath(plan.id), { state: { reveal: true } }), 1400)
      return () => window.clearTimeout(id)
    }
  }, [state, plan, navigate, t])

  if (isPending) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 py-10">
        <Skeleton className="h-[480px] rounded-3xl" />
      </main>
    )
  }

  if (!plan) {
    return (
      <main className="mx-auto flex min-h-[60svh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
        <BongSprite mood="sleepy" />
        <h1 className="text-2xl font-bold">{t('join.invalidTitle')}</h1>
        <p className="text-muted-foreground">{t('join.invalidBody')}</p>
        <Link to={ROUTES.home} className={cn(buttonVariants({ size: 'lg' }), 'mt-2 font-bold')}>
          {t('planDetail.backHome')}
        </Link>
      </main>
    )
  }

  const host = plan.members.find((member) => member.role === 'CREATOR') ?? plan.members[0]
  const members = state === 'joined' ? [ME, ...plan.members] : plan.members

  return (
    <main className="relative isolate mx-auto flex w-full max-w-md flex-col items-center gap-6 overflow-x-clip px-4 pt-8 pb-16 md:pt-16">
      <img src={heroImage} alt="" className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[460px] w-screen max-w-none -translate-x-1/2 object-cover opacity-35 [mask-image:linear-gradient(to_bottom,black_30%,transparent)]" />

      <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-sm text-muted-foreground [&_b]:font-semibold [&_b]:text-foreground">
        <span className="flex size-7 items-center justify-center rounded-full bg-surface-elevated text-xs font-bold text-foreground">{host.initials}</span>
        <Trans i18nKey="join.invitedBy" values={{ name: host.name }} components={{ b: <b /> }} />
      </motion.p>

      <motion.article
        initial={{ opacity: 0, y: 40, rotateX: -25 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 16 }}
        style={{ transformPerspective: 1000 }}
        className="relative w-full"
      >
        <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="relative overflow-hidden rounded-3xl bg-card ring-1 ring-border paper-shadow">
          <div aria-hidden className="absolute -top-20 -right-16 size-56 rounded-full bg-brand-gradient opacity-25 blur-3xl" />

          <div className="relative flex flex-col gap-4 p-6">
            <div className="flex items-center justify-between">
              <VibeBadge vibe={plan.vibe} />
              <span className="font-mono text-xs text-muted-foreground">#{plan.inviteCode}</span>
            </div>
            <h1 className="text-[32px] leading-[38px] font-bold tracking-tight">{plan.title}</h1>
            <p className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {planWhenLabel(t, i18n.resolvedLanguage, plan)} · <span className="font-mono">{plan.startTime}</span>
              </span>
              <span>{formatDuration(plan.durationMinutes)}</span>
              <span>
                {formatVndCompact(plan.budgetPerPerson)}
                {t('plan.perPerson')}
              </span>
            </p>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{t('join.route')}</span>
              <ol className="flex items-center gap-2 text-2xl">
                {plan.activities.map((activity, index) => (
                  <motion.li
                    key={activity.id}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.12, type: 'spring', stiffness: 400, damping: 14 }}
                  >
                    {index > 0 && <span aria-hidden className="text-sm text-muted-foreground">→</span>}
                    <span title={activity.title}>{activity.emoji}</span>
                  </motion.li>
                ))}
              </ol>
            </div>
          </div>

          {/* Perforation: the ticket's tear line */}
          <div aria-hidden className="relative flex items-center">
            <span className="absolute -left-3 size-6 rounded-full bg-background ring-1 ring-border" />
            <span className="mx-5 h-px flex-1 border-t-2 border-dashed border-border" />
            <span className="absolute -right-3 size-6 rounded-full bg-background ring-1 ring-border" />
          </div>

          <div className="relative flex items-center justify-between gap-3 p-6">
            <motion.div layout className="flex items-center gap-3">
              <MemberStack members={members} max={5} />
              <span className="text-sm text-muted-foreground">{t('join.going', { count: members.length })}</span>
            </motion.div>
          </div>
        </motion.div>
      </motion.article>

      <div className="flex w-full flex-col gap-2">
        <div className="group relative">
          <div aria-hidden className="absolute -inset-1 rounded-2xl bg-brand-gradient opacity-50 blur-lg transition-opacity group-hover:opacity-80" />
          <Button size="lg" className="relative h-13 w-full rounded-xl text-base font-bold tracking-wide" disabled={state !== 'idle'} onClick={() => setState('joining')}>
            {state === 'joining' ? <Loader2 className="size-5 animate-spin" /> : <Sparkles className="size-5" />}
            {state === 'joining' ? t('join.joining') : state === 'joined' ? t('join.joined') : t('join.join')}
          </Button>
        </div>
        {state === 'idle' && (
          <Link to={ROUTES.home} className={cn(buttonVariants({ variant: 'ghost', size: 'lg' }), 'w-full')}>
            {t('join.notNow')}
          </Link>
        )}
      </div>

      {state === 'joined' && <ConfettiBurst />}
    </main>
  )
}

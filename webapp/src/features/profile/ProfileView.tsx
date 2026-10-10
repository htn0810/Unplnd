import type { ReactNode } from 'react'
import { Lock, LogOut, Pencil, Share2 } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/constants/routes'
import { VIBE_META } from '@/constants/vibes'
import { useCountUp } from '@/hooks/useCountUp'
import type { Language } from '@/i18n'
import { cn } from '@/utils/cn'
import { useProfile } from './profileQueries'
import type { Profile } from './profileTypes'

/** `children` renders below the profile sections (e.g. recent memories from the plan feature) */
export function ProfileView({ children }: { children?: ReactNode }) {
  const { data: profile, isPending } = useProfile()

  if (isPending || !profile) {
    return (
      <main className="mx-auto grid w-full max-w-screen-xl grid-cols-1 gap-6 px-4 pt-6 md:px-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-8 lg:pt-10">
        <Skeleton className="h-96 rounded-3xl" />
        <Skeleton className="h-96 rounded-3xl" />
      </main>
    )
  }

  return (
    <main className="mx-auto grid w-full max-w-screen-xl grid-cols-1 gap-6 px-4 pt-6 pb-16 md:px-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-8 lg:px-8 lg:pt-10">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <ProfileCard profile={profile} />
      </div>
      <div className="flex min-w-0 flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ChaosScore score={profile.chaosScore} />
          <VibeMix mix={profile.vibeMix} />
        </div>
        <Badges badges={profile.badges} />
        {children}
      </div>
    </main>
  )
}

function ProfileCard({ profile }: { profile: Profile }) {
  const { t, i18n } = useTranslation()
  const language = (i18n.resolvedLanguage ?? 'en') as Language

  const share = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/u/${profile.handle}`)
    } catch {
      // Clipboard may be unavailable; the toast still confirms intent
    }
    toast.success(t('profile.linkCopied'))
  }

  return (
    <section aria-labelledby="profile-name" className="relative isolate flex flex-col items-center gap-5 overflow-hidden rounded-3xl bg-card px-6 py-8 text-center ring-1 ring-border paper-shadow">
      <div aria-hidden className="absolute -top-24 left-1/2 -z-10 size-72 -translate-x-1/2 rounded-full bg-brand-gradient opacity-20 blur-3xl" />

      <div className="relative size-28">
        <motion.span
          aria-hidden
          className="absolute -inset-1 rounded-full"
          style={{ background: 'conic-gradient(from 0deg, var(--brand-mint), var(--brand-purple), var(--brand-sun), var(--brand-pink), var(--brand-mint))' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />
        <span className="absolute inset-0.5 flex items-center justify-center rounded-full bg-surface-elevated font-heading text-4xl font-bold ring-4 ring-card">
          {profile.initials}
        </span>
        <motion.span
          aria-hidden
          className="absolute -right-1 -bottom-1 flex size-9 items-center justify-center rounded-full bg-card text-xl ring-2 ring-card"
          animate={{ rotate: [0, -15, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
        >
          🌀
        </motion.span>
      </div>

      <div className="flex flex-col gap-1">
        <h1 id="profile-name" className="text-3xl font-bold tracking-tight">
          {profile.name}
        </h1>
        <p className="font-mono text-sm text-muted-foreground">@{profile.handle}</p>
        <p className="text-sm text-muted-foreground">📍 {profile.city[language] ?? profile.city.en}</p>
      </div>

      <p className="text-balance">{profile.bio[language] ?? profile.bio.en}</p>

      <dl className="grid w-full grid-cols-3 gap-2">
        <Stat label={t('profile.stats.plansMade')} value={profile.stats.plansMade} />
        <Stat label={t('profile.stats.placesVisited')} value={profile.stats.placesVisited} />
        <Stat label={t('profile.stats.friends')} value={profile.stats.friends} />
      </dl>

      <div className="flex w-full gap-2">
        <Button variant="secondary" className="flex-1 font-semibold">
          <Pencil />
          {t('profile.edit')}
        </Button>
        <Button variant="secondary" size="icon" aria-label={t('profile.share')} onClick={share}>
          <Share2 />
        </Button>
      </div>

      <Link to={ROUTES.signIn} className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-destructive">
        <LogOut className="size-4" />
        {t('profile.signOut')}
      </Link>
    </section>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  const count = useCountUp(value)
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-xl bg-surface-elevated py-3">
      <dd className="font-heading text-2xl font-bold tabular-nums">{count}</dd>
      <dt className="text-xs text-muted-foreground">{label}</dt>
    </div>
  )
}

const GAUGE_RADIUS = 52
const GAUGE_LENGTH = 2 * Math.PI * GAUGE_RADIUS

function ChaosScore({ score }: { score: number }) {
  const { t } = useTranslation()
  const value = useCountUp(score, 1.6)

  return (
    <section aria-labelledby="chaos-title" className="flex items-center gap-5 rounded-3xl bg-card p-6 ring-1 ring-border paper-shadow">
      <div className="relative size-32 shrink-0">
        <svg viewBox="0 0 120 120" className="size-full -rotate-90">
          <defs>
            <linearGradient id="chaos-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--brand-mint)" />
              <stop offset="55%" stopColor="var(--brand-purple)" />
              <stop offset="100%" stopColor="var(--brand-sun)" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r={GAUGE_RADIUS} fill="none" stroke="currentColor" strokeWidth="10" className="text-muted" />
          <motion.circle
            cx="60"
            cy="60"
            r={GAUGE_RADIUS}
            fill="none"
            stroke="url(#chaos-gradient)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={GAUGE_LENGTH}
            initial={{ strokeDashoffset: GAUGE_LENGTH }}
            animate={{ strokeDashoffset: GAUGE_LENGTH * (1 - score / 100) }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-heading text-3xl font-bold tabular-nums">{value}%</span>
      </div>
      <div className="flex flex-col gap-1">
        <h2 id="chaos-title" className="kicker">
          {t('profile.chaosScore')}
        </h2>
        <p className="font-heading text-xl leading-snug font-bold">{t('profile.chaosCaption', { percent: score })}</p>
      </div>
    </section>
  )
}

function VibeMix({ mix }: { mix: Profile['vibeMix'] }) {
  const { t } = useTranslation()

  return (
    <section aria-labelledby="mix-title" className="flex flex-col gap-4 rounded-3xl bg-card p-6 ring-1 ring-border paper-shadow">
      <h2 id="mix-title" className="kicker">
        {t('profile.vibeMix')}
      </h2>
      <div className="flex h-4 gap-1 overflow-hidden rounded-full">
        {mix.map((item, index) => (
          <motion.span
            key={item.vibe}
            className={cn('h-full rounded-full', VIBE_META[item.vibe].dotClass)}
            initial={{ width: 0 }}
            animate={{ width: `${item.percent}%` }}
            transition={{ delay: 0.2 + index * 0.12, type: 'spring', stiffness: 90, damping: 18 }}
          />
        ))}
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
        {mix.map((item) => (
          <li key={item.vibe} className="flex items-center justify-between gap-2 text-sm">
            <span className={cn('flex items-center gap-1.5 font-semibold', VIBE_META[item.vibe].textClass)}>
              <span aria-hidden>{VIBE_META[item.vibe].emoji}</span>
              {VIBE_META[item.vibe].label}
            </span>
            <span className="font-mono text-muted-foreground">{item.percent}%</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Badges({ badges }: { badges: Profile['badges'] }) {
  const { t } = useTranslation()

  return (
    <section aria-labelledby="badges-title" className="flex flex-col gap-4 rounded-3xl bg-card p-6 ring-1 ring-border paper-shadow">
      <h2 id="badges-title" className="kicker">
        {t('profile.badges')}
      </h2>
      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {badges.map((badge, index) => (
          <motion.li
            key={badge.id}
            initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            whileHover={badge.unlocked ? { y: -6, rotate: [0, -8, 8, 0] } : undefined}
            transition={{ delay: 0.1 + index * 0.06, type: 'spring', stiffness: 300, damping: 15 }}
            className={cn('relative flex flex-col items-center gap-2 rounded-2xl bg-surface-elevated px-2 py-4 text-center', !badge.unlocked && 'opacity-50')}
          >
            <span aria-hidden className={cn('text-4xl', !badge.unlocked && 'grayscale')}>
              {badge.emoji}
            </span>
            <span className="text-xs leading-tight font-semibold">{t(`profile.badge.${badge.id}`)}</span>
            {!badge.unlocked && (
              <span className="absolute top-2 right-2" aria-label={t('profile.locked')}>
                <Lock className="size-3.5 text-muted-foreground" />
              </span>
            )}
          </motion.li>
        ))}
      </ul>
    </section>
  )
}

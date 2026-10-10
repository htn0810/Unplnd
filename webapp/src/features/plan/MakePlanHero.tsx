import type { ReactNode } from 'react'
import { Shuffle, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { buttonVariants } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { VIBE_META, VIBES } from '@/constants/vibes'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useRotatingIndex } from '@/hooks/useRotatingIndex'
import { useHeroImage } from '@/hooks/useHeroImage'
import { cn } from '@/utils/cn'
import { useHomeFeature } from './planQueries'
import type { HomeSticker } from './planTypes'

type MakePlanHeroProps = {
  userName?: string
  /** Rendered under the CTA inside the banner (e.g. friends who are free tonight) */
  children?: ReactNode
}

/** Positions per sticker slot: playful, slightly off-grid. Third sticker only on desktop. */
const STICKER_POSITIONS = [
  'top-5 right-4 rotate-3 md:top-8 md:right-8 lg:top-auto lg:right-auto lg:bottom-16 lg:left-[50%]',
  'top-24 left-4 -rotate-2 md:top-10 md:left-auto md:right-[38%] motion-safe:[animation-delay:1.5s]',
  'hidden lg:flex bottom-10 right-10 rotate-2 motion-safe:[animation-delay:3s]',
]

/**
 * Home's memorable moment: a poster-like banner — night route illustration,
 * live stickers, the vibe ticker, and one obvious CTA.
 */
export function MakePlanHero({ userName, children }: MakePlanHeroProps) {
  const { t } = useTranslation()
  const { data: feature } = useHomeFeature()
  const heroImage = useHeroImage()
  const prefersReducedMotion = usePrefersReducedMotion()
  const [vibeIndex, setVibeIndex] = useRotatingIndex(VIBES.length, 2200, prefersReducedMotion)
  const vibe = VIBES[vibeIndex]
  const meta = VIBE_META[vibe]

  const shuffleVibe = () =>
    setVibeIndex((current) => {
      const offset = 1 + Math.floor(Math.random() * (VIBES.length - 1))
      return (current + offset) % VIBES.length
    })

  return (
    <section
      aria-labelledby="home-hero-title"
      className="relative isolate overflow-hidden rounded-3xl bg-surface ring-1 ring-border"
    >
      {feature && (
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 -z-20 size-full object-cover object-[78%_15%] motion-safe:animate-in motion-safe:fade-in motion-safe:duration-700 lg:object-[60%_75%]"
        />
      )}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/85 via-45% to-transparent lg:bg-gradient-to-r lg:from-background lg:via-background/80 lg:via-40% lg:to-transparent"
      />

      {feature?.stickers.slice(0, STICKER_POSITIONS.length).map((sticker, index) => (
        <HeroSticker key={sticker.id} sticker={sticker} className={STICKER_POSITIONS[index]} />
      ))}

      <div className="flex min-h-[640px] flex-col justify-end gap-6 p-5 md:min-h-[600px] md:p-8 lg:min-h-[560px] lg:max-w-xl lg:justify-center lg:p-12">
        <p className="text-sm font-medium text-muted-foreground">
          {userName ? t('home.greeting', { name: userName }) : t('home.greetingAnonymous')}
        </p>

        <h1 id="home-hero-title" className="text-[40px] leading-[44px] font-bold tracking-tight md:text-[56px] md:leading-[60px]">
          <span className="block">{t('home.heroLine1')}</span>
          <span className="block">{t('home.heroLine2')}</span>
          <span className="block text-brand-gradient">{t('home.heroLine3')}</span>
        </h1>

        <button
          type="button"
          onClick={shuffleVibe}
          className="group -mx-2 flex min-h-11 w-fit items-center gap-3 rounded-lg px-2 text-left transition-colors hover:bg-surface-hover/70"
          aria-label={t('home.shuffleVibe', { vibe: meta.label })}
        >
          <span className="text-muted-foreground">{t('home.tonightCouldBe')}</span>
          <span
            key={vibe}
            className={cn(
              'inline-flex items-center gap-2 font-heading text-2xl font-bold motion-safe:animate-in motion-safe:duration-300 motion-safe:fade-in motion-safe:slide-in-from-bottom-2',
              meta.textClass,
            )}
          >
            <span aria-hidden>{meta.emoji}</span>
            {vibe}
          </span>
          <Shuffle aria-hidden className="size-4 text-muted-foreground transition-transform duration-200 group-hover:rotate-180" />
        </button>

        <div className="group relative lg:max-w-md">
          <div
            aria-hidden
            className="absolute -inset-1 rounded-2xl bg-brand-gradient opacity-40 blur-xl transition-opacity duration-300 group-hover:opacity-70"
          />
          <Link
            to={`${ROUTES.planNew}?vibe=${vibe}`}
            className={cn(buttonVariants({ size: 'lg' }), 'relative h-13 w-full rounded-xl text-base font-bold tracking-wide hover:bg-primary')}
          >
            <Sparkles className="size-5" />
            {t('home.makePlan')}
          </Link>
        </div>

        {children}
      </div>
    </section>
  )
}

function HeroSticker({ sticker, className }: { sticker: HomeSticker; className: string }) {
  const { t } = useTranslation()

  const text =
    sticker.kind === 'STOP'
      ? t('home.sticker.STOP', { time: sticker.time, label: sticker.label })
      : sticker.kind === 'JOINED'
        ? t('home.sticker.JOINED', { count: sticker.count })
        : t('home.sticker.CHALLENGE', { label: sticker.label })

  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute z-10 flex', className)}
    >
      <span className="flex items-center gap-2 rounded-xl bg-background/70 px-3 py-2 text-sm font-medium whitespace-nowrap shadow-lg ring-1 ring-border backdrop-blur-md motion-safe:animate-float [animation-delay:inherit]">
        <span className="text-base">{sticker.emoji}</span>
        {text}
      </span>
    </div>
  )
}

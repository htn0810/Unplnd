import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { SectionHeading } from '@/components/SectionHeading'
import { ROUTES } from '@/constants/routes'
import { VIBE_META, VIBES } from '@/constants/vibes'
import { cn } from '@/utils/cn'

/** Entry point into Create Plan with a vibe preselected */
export function VibeRail() {
  const { t } = useTranslation()

  return (
    <section aria-labelledby="vibes-title" className="flex flex-col gap-5">
      <SectionHeading id="vibes-title" title={t('home.vibesTitle')} subtitle={t('home.vibesSubtitle')} />

      <ul className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 py-1 md:-mx-6 md:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:px-0 xl:grid-cols-8">
        {VIBES.map((vibe) => {
          const meta = VIBE_META[vibe]
          return (
            <li key={vibe} className="shrink-0 snap-start">
              <Link
                to={`${ROUTES.planNew}?vibe=${vibe}`}
                aria-label={t('home.pickVibe', { vibe: meta.label })}
                className={cn(
                  'group relative flex h-full w-40 flex-col gap-3 overflow-hidden rounded-2xl bg-card p-4 ring-1 ring-border paper-shadow transition-all duration-200 hover:-translate-y-1 hover:bg-surface-elevated hover:ring-2 focus-visible:ring-2 lg:w-auto',
                  meta.hoverRingClass,
                )}
              >
                <span
                  aria-hidden
                  className={cn('absolute -right-10 -bottom-10 size-28 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-40', meta.dotClass)}
                />
                <span aria-hidden className="text-4xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                  {meta.emoji}
                </span>
                <span className={cn('font-heading text-lg font-bold', meta.textClass)}>{vibe}</span>
                <span className="text-xs leading-snug text-muted-foreground">{t(`vibes.${vibe}`)}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

import { Fragment } from 'react'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { buttonVariants } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/utils/cn'

const TERMS = ['people', 'time', 'budget', 'vibe'] as const

/** Closing band: the product formula from the spec, ending in the one special CTA */
export function PlanEquation() {
  const { t } = useTranslation()

  return (
    <section
      aria-labelledby="equation-title"
      className="relative isolate flex flex-col justify-between gap-6 overflow-hidden rounded-3xl bg-card p-6 ring-1 ring-border paper-shadow md:p-10"
    >
      <div aria-hidden className="absolute -top-32 -right-24 -z-10 size-80 rounded-full bg-brand-gradient opacity-25 blur-3xl" />

      <h2 id="equation-title" className="text-3xl leading-tight font-bold tracking-tight md:text-5xl md:leading-[1.1]">
        {TERMS.map((term, index) => (
          <Fragment key={term}>
            {index > 0 && ' '}
            <span className="whitespace-nowrap">
              {index > 0 && <span className="text-muted-foreground/50">+ </span>}
              {t(`home.equation.${term}`)}
            </span>
          </Fragment>
        ))}
        <span className="mt-1 block text-brand-gradient">= {t('home.equation.letsGo')}</span>
      </h2>

      <p className="max-w-xl text-muted-foreground">{t('home.equation.pitch')}</p>

      <Link
        to={ROUTES.planNew}
        className={cn(buttonVariants({ size: 'lg' }), 'w-full bg-brand-gradient font-bold tracking-wide text-white hover:opacity-90 sm:w-fit')}
      >
        {t('home.equation.letsGo')}
        <ArrowRight />
      </Link>
    </section>
  )
}

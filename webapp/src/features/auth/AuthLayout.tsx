import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { APP_NAME, COPYRIGHT_OWNER } from '@/constants/app'
import { useHeroImage } from '@/hooks/useHeroImage'
import { ROUTES } from '@/constants/routes'

type AuthLayoutProps = {
  panelTitle: string
  panelBody: string
  children: ReactNode
}

/** Split auth screen: animated night-route panel (memorable moment) + focused form */
export function AuthLayout({ panelTitle, panelBody, children }: AuthLayoutProps) {
  const { t } = useTranslation()
  const heroImage = useHeroImage()

  return (
    <div className="grid min-h-svh lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <aside className="relative isolate flex h-44 flex-col justify-end overflow-hidden p-5 md:h-56 lg:sticky lg:top-0 lg:h-svh lg:p-12">
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 -z-20 size-full object-cover object-[75%_60%] lg:object-[85%_center]"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/40 to-transparent lg:bg-gradient-to-tr lg:from-background lg:via-background/50 lg:to-transparent"
        />
        <div className="hidden max-w-md flex-col gap-3 lg:flex">
          <p className="text-[44px] leading-[52px] font-bold tracking-tight">{panelTitle}</p>
          <p className="text-lg text-muted-foreground">{panelBody}</p>
        </div>
      </aside>

      <div className="flex flex-col px-4 pb-8 md:px-6 lg:px-12">
        <header className="flex h-16 items-center justify-between">
          <Link to={ROUTES.home} className="flex items-center gap-1 font-heading text-xl font-bold tracking-tight" aria-label={t('common.appHomeLabel')}>
            {APP_NAME}
            <span aria-hidden className="mt-2 size-1.5 rounded-full bg-brand-gradient" />
          </Link>
          <div className="flex items-center gap-1">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center py-6 lg:py-12">
          <div className="w-full max-w-sm">{children}</div>
        </main>

        <p className="text-center text-xs text-muted-foreground">
          {t('footer.copyright', { year: new Date().getFullYear(), owner: COPYRIGHT_OWNER })}
        </p>
      </div>
    </div>
  )
}

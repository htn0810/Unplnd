import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { BongSprite } from '@/components/BongSprite'
import { PaintedHills } from '@/components/PaintedHills'
import { APP_NAME, COPYRIGHT_OWNER } from '@/constants/app'
import { ROUTES } from '@/constants/routes'

const LINKS = ['home', 'explore', 'plans'] as const

const LINK_CLASS = 'inline-flex min-h-11 items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'

export function AppFooter() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="relative mt-8">
      <div aria-hidden className="relative">
        <PaintedHills />
        <BongSprite mood="sleepy" className="absolute right-[12%] -bottom-1 size-16 md:size-20" />
      </div>
      <div className="bg-(--hills-front)">
        <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-8 px-4 pt-10 pb-28 md:px-6 lg:px-8 lg:pb-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-2">
              <span className="flex items-center gap-1 font-heading text-2xl font-bold tracking-tight">
                {APP_NAME}
                <span aria-hidden className="mt-2 size-2 rounded-full bg-brand-gradient" />
              </span>
              <p className="text-sm text-muted-foreground">{t('footer.tagline')}</p>
            </div>

            <nav aria-label={t('footer.navLabel')}>
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {LINKS.map((link) => (
                  <li key={link}>
                    <a href="#" className={LINK_CLASS}>
                      {t(`nav.${link}`)}
                    </a>
                  </li>
                ))}
                <li>
                  <Link to={ROUTES.signIn} className={LINK_CLASS}>
                    {t('auth.signIn.title')}
                  </Link>
                </li>
                <li>
                  <Link to={ROUTES.signUp} className={LINK_CLASS}>
                    {t('auth.signUp.title')}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
            <p>{t('footer.copyright', { year, owner: COPYRIGHT_OWNER })}</p>
            <p>{t('footer.madeWith')}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

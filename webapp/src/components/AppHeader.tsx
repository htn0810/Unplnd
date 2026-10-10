import { Bell } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink } from 'react-router'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { buttonVariants } from '@/components/ui/button'
import { APP_NAME } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/utils/cn'

const NAV_ITEMS = [
  { key: 'home', to: ROUTES.home },
  { key: 'explore', to: ROUTES.explore },
  { key: 'plans', to: ROUTES.plans },
] as const

type AppHeaderProps = {
  userInitials?: string
  unreadNotifications?: number
}

export function AppHeader({ userInitials, unreadNotifications = 0 }: AppHeaderProps) {
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-40 border-b border-transparent bg-background/80 backdrop-blur-md lg:border-border">
      <div className="mx-auto flex h-16 w-full max-w-screen-xl items-center gap-8 px-4 md:px-6 lg:px-8">
        <Link to={ROUTES.home} className="flex items-center gap-1 font-heading text-xl font-bold tracking-tight" aria-label={t('common.appHomeLabel')}>
          {APP_NAME}
          <span aria-hidden className="mt-2 size-1.5 rounded-full bg-brand-gradient" />
        </Link>

        <nav aria-label={t('common.mainNavigation')} className="hidden lg:flex lg:gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.key}
              to={item.to}
              end={item.to === ROUTES.home}
              className={({ isActive }) =>
                cn(
                  'relative rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
                  isActive && 'text-foreground after:absolute after:inset-x-3 after:-bottom-[13px] after:h-0.5 after:rounded-full after:bg-brand-gradient',
                )
              }
            >
              {t(`nav.${item.key}`)}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Link
            to={ROUTES.planNew}
            className={cn(buttonVariants({ size: 'sm' }), 'mr-2 hidden h-9 rounded-lg font-semibold lg:inline-flex')}
          >
            {t('home.makePlan')}
          </Link>
          <ThemeSwitcher />
          <LanguageSwitcher />
          <Link
            to={ROUTES.notifications}
            className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'relative')}
            aria-label={unreadNotifications > 0 ? t('common.notificationsUnread', { count: unreadNotifications }) : t('common.notifications')}
          >
            <Bell className="size-5" />
            {unreadNotifications > 0 && (
              <span aria-hidden className="absolute top-2.5 right-2.5 size-2 rounded-full bg-brand-pink ring-2 ring-background" />
            )}
          </Link>
          {userInitials && (
            <Link to={ROUTES.profile} className="ml-1 hidden rounded-full lg:flex" aria-label={t('nav.profile')}>
              <Avatar size="lg">
                <AvatarFallback className="bg-surface-elevated font-semibold text-foreground">{userInitials}</AvatarFallback>
              </Avatar>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

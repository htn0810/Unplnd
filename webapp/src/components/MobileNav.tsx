import { Compass, House, ListChecks, Plus, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink } from 'react-router'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/utils/cn'

const ITEMS = [
  { id: 'home', icon: House, to: ROUTES.home },
  { id: 'explore', icon: Compass, to: ROUTES.explore },
  { id: 'plans', icon: ListChecks, to: ROUTES.plans },
  { id: 'profile', icon: User, to: ROUTES.profile },
] as const

/** Fixed bottom navigation for < lg. The center + is emphasized, not an oversized FAB. */
export function MobileNav() {
  const { t } = useTranslation()
  const [home, explore, plans, profile] = ITEMS

  return (
    <nav
      aria-label={t('common.mainNavigation')}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <ul className="mx-auto grid h-16 max-w-screen-sm grid-cols-5 items-center px-2">
        <NavItem {...home} />
        <NavItem {...explore} />
        <li className="flex justify-center">
          <Link
            to={ROUTES.planNew}
            aria-label={t('nav.makePlan')}
            className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_24px_-4px] shadow-primary/60 transition-transform active:scale-90"
          >
            <Plus className="size-6" />
          </Link>
        </li>
        <NavItem {...plans} />
        <NavItem {...profile} />
      </ul>
    </nav>
  )
}

function NavItem({ id, icon: Icon, to }: (typeof ITEMS)[number]) {
  const { t } = useTranslation()

  return (
    <li>
      <NavLink
        to={to}
        end={to === ROUTES.home}
        className={({ isActive }) =>
          cn(
            'flex min-h-11 flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-muted-foreground transition-colors',
            isActive && 'text-foreground',
          )
        }
      >
        {({ isActive }) => (
          <>
            <Icon className={cn('size-6 transition-transform', isActive && 'scale-110')} strokeWidth={isActive ? 2.25 : 1.75} />
            {t(`nav.${id}`)}
          </>
        )}
      </NavLink>
    </li>
  )
}

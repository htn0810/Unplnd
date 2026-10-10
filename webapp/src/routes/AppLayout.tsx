import { motion } from 'motion/react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import { AppFooter } from '@/components/AppFooter'
import { AppHeader } from '@/components/AppHeader'
import { MobileNav } from '@/components/MobileNav'
import { useMe } from '@/features/profile'

/** Shell for signed-in app pages: header, animated page content, footer, mobile nav */
export function AppLayout() {
  const { data: me } = useMe()
  const location = useLocation()

  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader userInitials={me?.initials} unreadNotifications={me?.unreadNotifications} />
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1"
      >
        <Outlet />
      </motion.div>
      <AppFooter />
      <MobileNav />
      {/* Keyed by path so a fresh load never inherits another page's scroll position */}
      <ScrollRestoration getKey={(location) => location.pathname} />
    </div>
  )
}

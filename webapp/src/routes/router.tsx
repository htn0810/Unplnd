import { createBrowserRouter } from 'react-router'
import { ROUTES } from '@/constants/routes'
import { HomePage } from '@/pages/HomePage'
import { AppLayout } from './AppLayout'

/** Every page except Home is code-split: its chunk loads on first navigation */
export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: ROUTES.home, element: <HomePage /> },
      { path: ROUTES.explore, lazy: () => import('@/pages/ExplorePage').then((m) => ({ Component: m.ExplorePage })) },
      { path: ROUTES.plans, lazy: () => import('@/pages/PlansPage').then((m) => ({ Component: m.PlansPage })) },
      { path: ROUTES.planDetail, lazy: () => import('@/pages/PlanDetailPage').then((m) => ({ Component: m.PlanDetailPage })) },
      { path: ROUTES.profile, lazy: () => import('@/pages/ProfilePage').then((m) => ({ Component: m.ProfilePage })) },
      { path: ROUTES.notifications, lazy: () => import('@/pages/NotificationsPage').then((m) => ({ Component: m.NotificationsPage })) },
      { path: ROUTES.join, lazy: () => import('@/pages/JoinPage').then((m) => ({ Component: m.JoinPage })) },
      { path: '*', lazy: () => import('@/pages/NotFoundPage').then((m) => ({ Component: m.NotFoundPage })) },
    ],
  },
  // Focus-mode screens without the app shell
  { path: ROUTES.planNew, lazy: () => import('@/pages/CreatePlanPage').then((m) => ({ Component: m.CreatePlanPage })) },
  { path: ROUTES.signIn, lazy: () => import('@/pages/SignInPage').then((m) => ({ Component: m.SignInPage })) },
  { path: ROUTES.signUp, lazy: () => import('@/pages/SignUpPage').then((m) => ({ Component: m.SignUpPage })) },
])

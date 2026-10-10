import { QueryClientProvider } from '@tanstack/react-query'
import { MotionConfig } from 'motion/react'
import { RouterProvider } from 'react-router'
import { OfflineGate } from '@/components/offline'
import { Toaster } from '@/components/ui/sonner'
import { router } from '@/routes/router'
import { queryClient } from '@/services/queryClient'
import { useThemeStore } from '@/store/themeStore'

export function App() {
  const theme = useThemeStore((state) => state.resolved)

  return (
    <QueryClientProvider client={queryClient}>
      {/* Every motion animation respects the OS "reduce motion" setting */}
      <MotionConfig reducedMotion="user">
        <RouterProvider router={router} />
        <OfflineGate />
        <Toaster position="top-center" theme={theme} />
      </MotionConfig>
    </QueryClientProvider>
  )
}

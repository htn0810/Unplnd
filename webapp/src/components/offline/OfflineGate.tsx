import { AnimatePresence } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { OfflineBanner } from './OfflineBanner'
import { OfflineScreen } from './OfflineScreen'

/** Shows the offline screen (or banner, once dismissed) and a toast when the connection returns */
export function OfflineGate() {
  const { t } = useTranslation()
  const online = useOnlineStatus()
  const [dismissed, setDismissed] = useState(false)
  const wasOffline = useRef(!online)

  useEffect(() => {
    if (!online) {
      wasOffline.current = true
      return
    }
    if (wasOffline.current) {
      wasOffline.current = false
      setDismissed(false)
      toast.success(t('offline.backOnline'))
    }
  }, [online, t])

  return (
    <AnimatePresence>
      {!online && !dismissed && <OfflineScreen key="screen" onContinue={() => setDismissed(true)} />}
      {!online && dismissed && <OfflineBanner key="banner" onRetry={() => setDismissed(false)} />}
    </AnimatePresence>
  )
}

import { motion } from 'motion/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { checkConnectivity } from '@/services/connectivity'
import { OfflineScene, ShelteredBong } from './OfflineScene'

type OfflineScreenProps = {
  onContinue: () => void
}

/** Full-screen state while the network is down: retry, or keep browsing cached data */
export function OfflineScreen({ onContinue }: OfflineScreenProps) {
  const { t } = useTranslation()
  const [checking, setChecking] = useState(false)
  const [stillOffline, setStillOffline] = useState(false)

  const retry = async () => {
    setChecking(true)
    setStillOffline(false)
    const online = await checkConnectivity()
    setChecking(false)
    // When back online the gate unmounts this screen on its own
    if (!online) setStillOffline(true)
  }

  return (
    <motion.main
      role="alertdialog"
      aria-modal
      aria-labelledby="offline-title"
      aria-describedby="offline-body"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="paper-grain fixed inset-0 z-100 flex flex-col items-center justify-center bg-background px-4 pb-32 text-center"
    >
      <OfflineScene />
      <div className="relative flex max-w-md flex-col items-center gap-4">
        <ShelteredBong />
        <h1 id="offline-title" className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
          {t('offline.title')}
        </h1>
        <p id="offline-body" className="text-muted-foreground">
          {t('offline.body')}
        </p>
        <p aria-live="polite" className="min-h-6 font-hand text-lg text-(--brand-pink)">
          {stillOffline ? t('offline.stillOffline') : null}
        </p>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button size="lg" className="min-w-40 font-bold" disabled={checking} onClick={retry}>
            {checking ? t('offline.checking') : t('offline.retry')}
          </Button>
          <Button size="lg" variant="ghost" onClick={onContinue}>
            {t('offline.continue')}
          </Button>
        </div>
      </div>
    </motion.main>
  )
}

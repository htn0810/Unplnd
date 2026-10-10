import { WifiOff } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'

/** Slim reminder after the user chose to browse offline */
export function OfflineBanner({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation()

  return (
    <motion.div
      role="status"
      initial={{ y: -48 }}
      animate={{ y: 0 }}
      exit={{ y: -48 }}
      className="fixed inset-x-0 top-0 z-100 flex items-center justify-center gap-3 bg-foreground px-4 py-2 text-sm text-background"
    >
      <WifiOff aria-hidden className="size-4 shrink-0" />
      <span className="truncate">{t('offline.banner')}</span>
      <button type="button" onClick={onRetry} className="min-h-8 shrink-0 font-bold underline underline-offset-4">
        {t('offline.bannerRetry')}
      </button>
    </motion.div>
  )
}

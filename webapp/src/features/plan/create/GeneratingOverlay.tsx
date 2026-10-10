import { useEffect, useState } from 'react'
import { BongSprite } from '@/components/BongSprite'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { VIBE_META, type Vibe } from '@/constants/vibes'

const LINE_MS = 900

type GeneratingOverlayProps = {
  vibe: Vibe | null
  onDone: () => void
}

/** Plan generation as personality: copy lines, rolling dice, then the reveal hand-off */
export function GeneratingOverlay({ vibe, onDone }: GeneratingOverlayProps) {
  const { t } = useTranslation()
  const lines = t('createPlan.generating.lines', { returnObjects: true }) as string[]
  const [index, setIndex] = useState(0)
  const done = index >= lines.length

  useEffect(() => {
    if (done) {
      const id = window.setTimeout(onDone, 1100)
      return () => window.clearTimeout(id)
    }
    const id = window.setTimeout(() => setIndex((current) => current + 1), LINE_MS)
    return () => window.clearTimeout(id)
    // `index` must be a dependency: each line schedules the next one
  }, [index, done, onDone])

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 bg-background/95 px-6 text-center backdrop-blur-xl"
    >
      <div aria-hidden className="absolute top-1/2 left-1/2 size-96 -translate-1/2 rounded-full bg-brand-gradient opacity-20 blur-3xl motion-safe:animate-pulse" />

      <div aria-hidden className="relative flex items-end gap-4 text-6xl">
        <BongSprite mood={done ? 'happy' : 'idle'} className="size-32" />
        <motion.span animate={{ rotate: [0, 90, 180, 270, 360], y: [0, -30, 0, -18, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}>
          🎲
        </motion.span>
        {vibe && (
          <motion.span animate={{ scale: [1, 1.25, 1], rotate: [0, -10, 10, 0] }} transition={{ duration: 1, repeat: Infinity }}>
            {VIBE_META[vibe].emoji}
          </motion.span>
        )}
      </div>

      <div className="relative h-24">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.p
              key={index}
              initial={{ y: 20, opacity: 0, filter: 'blur(6px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: -20, opacity: 0, filter: 'blur(6px)' }}
              transition={{ duration: 0.3 }}
              className="text-xl text-muted-foreground md:text-2xl"
            >
              {lines[index]}
            </motion.p>
          ) : (
            <motion.p
              key="ready"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className="font-heading text-[40px] leading-[44px] font-bold text-brand-gradient md:text-[56px] md:leading-[60px]"
            >
              {t('createPlan.generating.ready')}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div aria-hidden className="relative flex gap-2">
        {lines.map((line, lineIndex) => (
          <motion.span
            key={line}
            className="h-1.5 rounded-full bg-primary"
            animate={{ width: lineIndex < index ? 32 : 8, opacity: lineIndex < index ? 1 : 0.3 }}
          />
        ))}
      </div>
    </motion.div>
  )
}

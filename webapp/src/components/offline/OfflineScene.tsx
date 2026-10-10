import { motion } from 'motion/react'
import { BongSprite } from '@/components/BongSprite'
import { PaintedHills } from '@/components/PaintedHills'

/** Deterministic raindrops so render stays pure */
const DROPS = Array.from({ length: 26 }, (_, index) => ({
  left: (index * 37) % 100,
  delay: ((index * 13) % 20) / 10,
  duration: 1.1 + ((index * 7) % 6) / 10,
  height: 14 + ((index * 5) % 4) * 6,
}))

/** Soft rain over painted hills, Bông sheltering under a big leaf */
export function OfflineScene() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {DROPS.map((drop, index) => (
        <motion.span
          key={index}
          className="absolute top-0 w-px rounded-full bg-(--brand-mint) opacity-40"
          style={{ left: `${drop.left}%`, height: drop.height }}
          initial={{ y: '-10vh' }}
          animate={{ y: '110vh' }}
          transition={{ duration: drop.duration, delay: drop.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
      <PaintedHills className="absolute inset-x-0 bottom-0 h-32 md:h-44" />
    </div>
  )
}

/** Bông under a leaf umbrella */
export function ShelteredBong() {
  return (
    <div aria-hidden className="relative h-40 w-36">
      <svg viewBox="0 0 120 70" className="absolute inset-x-0 top-0 z-10 w-full drop-shadow-[0_6px_8px_rgb(40_60_40_/_0.2)]">
        <path d="M6 52 C 14 18 44 4 62 6 C 84 8 110 24 114 52 C 100 44 88 46 78 52 C 68 44 54 44 44 52 C 34 44 18 44 6 52 Z" fill="#3f7d5c" />
        <path d="M60 8 C 58 24 58 40 60 52" stroke="#2f5f45" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M60 52 L 60 70" stroke="#6b4f2c" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <BongSprite mood="sleepy" className="absolute bottom-0 left-1/2 size-28 -translate-x-1/2" />
    </div>
  )
}

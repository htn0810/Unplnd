import { motion } from 'motion/react'
import { cn } from '@/utils/cn'

type Mood = 'idle' | 'happy' | 'sleepy'

type BongSpriteProps = {
  mood?: Mood
  className?: string
}

/** Fringe tufts around the puff (deterministic so render stays pure) */
const TUFTS = Array.from({ length: 28 }, (_, index) => {
  const angle = (index / 28) * Math.PI * 2
  const wobble = 1 + Math.sin(index * 2.3) * 0.06
  return { x1: 50 + Math.cos(angle) * 30, y1: 52 + Math.sin(angle) * 30, x2: 50 + Math.cos(angle) * 40 * wobble, y2: 52 + Math.sin(angle) * 40 * wobble }
})

/**
 * "Bông" — UNPLND's original mascot: a round dandelion-puff sprite with a leaf sprout.
 * Used for empty, loading and success states. Floats gently; still under reduced motion.
 * Colors are fixed (a cream puff in both themes); at Twilight it glows like a lantern spirit.
 */
export function BongSprite({ mood = 'idle', className }: BongSpriteProps) {
  return (
    <motion.svg
      viewBox="0 0 100 110"
      aria-hidden
      className={cn('size-28 overflow-visible drop-shadow-[0_10px_14px_rgb(92_72_40_/_0.18)] dark:drop-shadow-[0_0_16px_rgb(244_200_102_/_0.45)]', className)}
      animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* leaf sprout */}
      <path d="M50 18 C 50 10 52 6 56 3" stroke="#3f7d5c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M55 5 C 63 0 72 4 70 10 C 64 12 57 10 55 5 Z" fill="#3f7d5c" />
      {/* fluffy fringe */}
      <g stroke="#fffbf2" strokeWidth="3" strokeLinecap="round" opacity=".95">
        {TUFTS.map((tuft, index) => (
          <line key={index} {...tuft} />
        ))}
      </g>
      <g stroke="#cdbe9c" strokeWidth="1" strokeLinecap="round" opacity=".55">
        {TUFTS.filter((_, index) => index % 2 === 0).map((tuft, index) => (
          <line key={index} {...tuft} />
        ))}
      </g>
      {/* body */}
      <circle cx="50" cy="52" r="32" fill="#fffbf2" stroke="#cdbe9c" strokeWidth="1.5" />
      <ellipse cx="42" cy="40" rx="10" ry="6" fill="#ffffff" opacity=".55" />
      {/* face */}
      {mood === 'sleepy' ? (
        <g stroke="#2d3a2e" strokeWidth="2.4" strokeLinecap="round" fill="none">
          <path d="M37 54 q 4 3 8 0" />
          <path d="M55 54 q 4 3 8 0" />
        </g>
      ) : mood === 'happy' ? (
        <g stroke="#2d3a2e" strokeWidth="2.4" strokeLinecap="round" fill="none">
          <path d="M37 55 q 4 -5 8 0" />
          <path d="M55 55 q 4 -5 8 0" />
        </g>
      ) : (
        <g fill="#2d3a2e">
          <ellipse cx="41" cy="53" rx="3" ry="4" />
          <ellipse cx="59" cy="53" rx="3" ry="4" />
          <circle cx="42" cy="51.5" r="1" fill="#ffffff" />
          <circle cx="60" cy="51.5" r="1" fill="#ffffff" />
        </g>
      )}
      <ellipse cx="34" cy="61" rx="5" ry="3" fill="#d9673e" opacity=".35" />
      <ellipse cx="66" cy="61" rx="5" ry="3" fill="#d9673e" opacity=".35" />
      <path d={mood === 'sleepy' ? 'M47 64 q 3 1 6 0' : 'M46 63 q 4 4 8 0'} stroke="#2d3a2e" strokeWidth="2" strokeLinecap="round" fill="none" />
    </motion.svg>
  )
}

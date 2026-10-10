import { motion, useReducedMotion } from 'motion/react'

/** Petals, leaves and little sparks — a gust of wind rather than party confetti */
const EMOJIS = ['🌸', '🍃', '✨', '🌼', '🍂', '☁️', '🎉', '⭐']

/** Deterministic spread so render stays pure */
const PARTICLES = Array.from({ length: 28 }, (_, index) => {
  const angle = (index / 28) * Math.PI * 2 + Math.sin(index * 12.9) * 0.4
  const distance = 140 + ((Math.sin(index * 78.2) + 1) / 2) * 220
  return {
    emoji: EMOJIS[index % EMOJIS.length],
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance - 80,
    rotate: Math.sin(index * 3.7) * 360,
    delay: (index % 7) * 0.02,
  }
})

/** One-shot celebratory burst from the center of the viewport */
export function ConfettiBurst() {
  const reducedMotion = useReducedMotion()
  if (reducedMotion) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {PARTICLES.map((particle, index) => (
        <motion.span
          key={index}
          className="absolute text-2xl"
          initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
          animate={{ x: particle.x, y: [0, particle.y, particle.y + 260], scale: [0, 1.3, 1], opacity: [1, 1, 0], rotate: particle.rotate }}
          transition={{ duration: 1.6, delay: particle.delay, ease: 'easeOut' }}
        >
          {particle.emoji}
        </motion.span>
      ))}
    </div>
  )
}

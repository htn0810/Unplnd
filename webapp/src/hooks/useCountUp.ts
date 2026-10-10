import { useEffect, useState } from 'react'
import { animate, useReducedMotion } from 'motion/react'

/** Animates a number from 0 to `target` once (instant when reduced motion is on) */
export function useCountUp(target: number, duration = 1.2) {
  const reducedMotion = useReducedMotion()
  const [value, setValue] = useState(reducedMotion ? target : 0)

  useEffect(() => {
    if (reducedMotion) return
    const controls = animate(0, target, { duration, ease: [0.22, 1, 0.36, 1], onUpdate: (latest) => setValue(Math.round(latest)) })
    return () => controls.stop()
  }, [target, duration, reducedMotion])

  return reducedMotion ? target : value
}

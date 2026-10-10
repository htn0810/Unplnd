import { useEffect, useState } from 'react'

/** Cycles 0..length-1 every `intervalMs`. Stops while `paused` is true. */
export function useRotatingIndex(length: number, intervalMs: number, paused = false) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (paused || length < 2) return
    const id = window.setInterval(() => setIndex((current) => (current + 1) % length), intervalMs)
    return () => window.clearInterval(id)
  }, [length, intervalMs, paused])

  return [length > 0 ? index % length : 0, setIndex] as const
}

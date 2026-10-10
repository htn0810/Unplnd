export const DURATION_OPTIONS = [
  { minutes: 30, emoji: '⚡' },
  { minutes: 60, emoji: '🕐' },
  { minutes: 120, emoji: '🎯' },
  { minutes: 180, emoji: '🌙' },
  { minutes: 240, emoji: '🌌' },
] as const

export const BUDGET_OPTIONS = [
  { amount: 100_000, emoji: '🍜' },
  { amount: 300_000, emoji: '🧋' },
  { amount: 500_000, emoji: '🍕' },
  { amount: 1_000_000, emoji: '🥂' },
] as const

export const RADIUS_RANGE = { min: 1, max: 20, step: 1 } as const

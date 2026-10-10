export const VIBES = ['CHILL', 'FOOD', 'PARTY', 'NERDY', 'OUTDOOR', 'DATE', 'CHAOS', 'SURPRISE'] as const

export type Vibe = (typeof VIBES)[number]

type VibeMeta = {
  label: string
  emoji: string
  /** Static Tailwind classes — vibe color only as accent (text, dot, ring), never full fills */
  textClass: string
  dotClass: string
  ringClass: string
  hoverRingClass: string
  selectedRingClass: string
  /** Hex for non-Tailwind surfaces (map pins) */
  color: string
}

export const VIBE_META: Record<Vibe, VibeMeta> = {
  CHILL: { label: 'Chill', emoji: '🌅', textClass: 'text-vibe-chill', dotClass: 'bg-vibe-chill', ringClass: 'ring-vibe-chill/40', hoverRingClass: 'hover:ring-vibe-chill/60', selectedRingClass: 'ring-vibe-chill', color: '#3e86b4' },
  FOOD: { label: 'Food', emoji: '🍜', textClass: 'text-vibe-food', dotClass: 'bg-vibe-food', ringClass: 'ring-vibe-food/40', hoverRingClass: 'hover:ring-vibe-food/60', selectedRingClass: 'ring-vibe-food', color: '#d9673e' },
  PARTY: { label: 'Party', emoji: '🎉', textClass: 'text-vibe-party', dotClass: 'bg-vibe-party', ringClass: 'ring-vibe-party/40', hoverRingClass: 'hover:ring-vibe-party/60', selectedRingClass: 'ring-vibe-party', color: '#c2415a' },
  NERDY: { label: 'Nerdy', emoji: '🎮', textClass: 'text-vibe-nerdy', dotClass: 'bg-vibe-nerdy', ringClass: 'ring-vibe-nerdy/40', hoverRingClass: 'hover:ring-vibe-nerdy/60', selectedRingClass: 'ring-vibe-nerdy', color: '#4c5fb8' },
  OUTDOOR: { label: 'Outdoor', emoji: '🌿', textClass: 'text-vibe-outdoor', dotClass: 'bg-vibe-outdoor', ringClass: 'ring-vibe-outdoor/40', hoverRingClass: 'hover:ring-vibe-outdoor/60', selectedRingClass: 'ring-vibe-outdoor', color: '#4e8b3a' },
  DATE: { label: 'Date', emoji: '💌', textClass: 'text-vibe-date', dotClass: 'bg-vibe-date', ringClass: 'ring-vibe-date/40', hoverRingClass: 'hover:ring-vibe-date/60', selectedRingClass: 'ring-vibe-date', color: '#b5577e' },
  CHAOS: { label: 'Chaos', emoji: '🌀', textClass: 'text-vibe-chaos', dotClass: 'bg-vibe-chaos', ringClass: 'ring-vibe-chaos/40', hoverRingClass: 'hover:ring-vibe-chaos/60', selectedRingClass: 'ring-vibe-chaos', color: '#7a54b0' },
  SURPRISE: { label: 'Surprise', emoji: '🎲', textClass: 'text-vibe-surprise', dotClass: 'bg-vibe-surprise', ringClass: 'ring-vibe-surprise/40', hoverRingClass: 'hover:ring-vibe-surprise/60', selectedRingClass: 'ring-vibe-surprise', color: '#c99212' },
}

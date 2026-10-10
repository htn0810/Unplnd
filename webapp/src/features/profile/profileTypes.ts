import type { Vibe } from '@/constants/vibes'
import type { Language } from '@/i18n'

export type CurrentUser = {
  id: string
  name: string
  initials: string
  unreadNotifications: number
}

export type ProfileBadge = {
  id: 'night_owl' | 'chaos_agent' | 'food_hunter' | 'streak_5' | 'explorer' | 'early_bird'
  emoji: string
  unlocked: boolean
}

export type Profile = {
  id: string
  name: string
  handle: string
  initials: string
  city: Record<Language, string>
  bio: Record<Language, string>
  stats: { plansMade: number; placesVisited: number; friends: number }
  /** 0–100 */
  chaosScore: number
  vibeMix: { vibe: Vibe; percent: number }[]
  badges: ProfileBadge[]
}

export type Friend = {
  id: string
  name: string
  initials: string
  online: boolean
}

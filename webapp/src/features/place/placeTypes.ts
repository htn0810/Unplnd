import type { ProvinceId } from '@/constants/provinces'
import type { Vibe } from '@/constants/vibes'

export type NearbyPlace = {
  id: string
  name: string
  emoji: string
  vibe: Vibe
  distanceMeters: number
  /** 0 = free, 1–3 = ₫ to ₫₫₫ */
  priceLevel: 0 | 1 | 2 | 3
  rating: number
  /** "HH:mm" or "24/7" */
  openUntil: string
  province: ProvinceId
  lat: number
  lng: number
}

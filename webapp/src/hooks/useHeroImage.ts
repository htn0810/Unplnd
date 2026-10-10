import { IMAGES } from '@/constants/images'
import { publicAssetUrl } from '@/services/apiClient'
import { useThemeStore } from '@/store/themeStore'

/** The painted landscape that matches the current theme (Day / Twilight) */
export function useHeroImage() {
  const theme = useThemeStore((state) => state.resolved)
  return publicAssetUrl(theme === 'dark' ? IMAGES.heroTwilight : IMAGES.heroDay)
}

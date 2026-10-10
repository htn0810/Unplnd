import { MOCK_DATA } from '@/constants/mockData'
import { getMock } from '@/services/apiClient'
import type { NearbyPlace } from './placeTypes'

export const placeService = {
  getNearbyPlaces: () => getMock<NearbyPlace[]>(MOCK_DATA.nearbyPlaces),
}

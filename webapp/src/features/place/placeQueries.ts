import { useQuery } from '@tanstack/react-query'
import { placeService } from './placeService'

export const placeKeys = {
  all: ['places'] as const,
  nearby: () => [...placeKeys.all, 'nearby'] as const,
}

export function useNearbyPlaces() {
  return useQuery({ queryKey: placeKeys.nearby(), queryFn: placeService.getNearbyPlaces })
}

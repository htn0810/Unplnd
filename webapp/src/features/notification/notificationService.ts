import { MOCK_DATA } from '@/constants/mockData'
import { getMock } from '@/services/apiClient'
import type { AppNotification } from './notificationTypes'

export const notificationService = {
  getNotifications: () => getMock<AppNotification[]>(MOCK_DATA.notifications),
}

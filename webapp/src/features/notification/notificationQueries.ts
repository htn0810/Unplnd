import { useQuery, useQueryClient } from '@tanstack/react-query'
import { profileKeys, type CurrentUser } from '@/features/profile'
import { notificationService } from './notificationService'
import type { AppNotification } from './notificationTypes'

export const notificationKeys = {
  all: ['notifications'] as const,
}

export function useNotifications() {
  return useQuery({ queryKey: notificationKeys.all, queryFn: notificationService.getNotifications })
}

/** Mock mutations: update the cache (and the header's unread count) until notification-service exists */
export function useNotificationActions() {
  const queryClient = useQueryClient()

  const update = (updater: (items: AppNotification[]) => AppNotification[]) => {
    const next = queryClient.setQueryData<AppNotification[]>(notificationKeys.all, (items) => (items ? updater(items) : items))
    const unread = next?.filter((item) => !item.read).length ?? 0
    queryClient.setQueryData<CurrentUser>(profileKeys.me, (me) => (me ? { ...me, unreadNotifications: unread } : me))
  }

  return {
    markAllRead: () => update((items) => items.map((item) => ({ ...item, read: true }))),
    markRead: (id: string) => update((items) => items.map((item) => (item.id === id ? { ...item, read: true } : item))),
    acceptFriend: (id: string) =>
      update((items) => items.map((item) => (item.id === id ? { ...item, type: 'FRIEND_REQUEST_ACCEPTED', read: true, minutesAgo: 0 } : item))),
    declineFriend: (id: string) => update((items) => items.filter((item) => item.id !== id)),
  }
}

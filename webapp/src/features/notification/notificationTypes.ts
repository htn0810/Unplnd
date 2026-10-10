export type NotificationType =
  | 'PLAN_VOTE_CAST'
  | 'PLAN_MEMBER_JOINED'
  | 'FRIEND_REQUEST_SENT'
  | 'PLAN_CONFIRMED'
  | 'PLAN_COMPLETED'
  | 'FRIEND_REQUEST_ACCEPTED'

export type AppNotification = {
  id: string
  type: NotificationType
  group: 'TODAY' | 'EARLIER'
  minutesAgo: number
  read: boolean
  actor: { name: string; initials: string }
  planId?: string
  planTitle?: string
  target?: string
}

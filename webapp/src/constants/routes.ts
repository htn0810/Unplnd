export const ROUTES = {
  home: '/',
  explore: '/explore',
  plans: '/plans',
  planNew: '/plans/new',
  planDetail: '/plans/:planId',
  profile: '/profile',
  notifications: '/notifications',
  join: '/join/:inviteCode',
  signIn: '/sign-in',
  signUp: '/sign-up',
} as const

export const planPath = (planId: string) => `/plans/${planId}`

export const joinPath = (inviteCode: string) => `/join/${inviteCode}`

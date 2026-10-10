import type { ProvinceId } from '@/constants/provinces'
import type { Vibe } from '@/constants/vibes'
import type { Language } from '@/i18n'

export type PlanStatus =
  | 'DRAFT'
  | 'GENERATING'
  | 'OPEN'
  | 'VOTING'
  | 'CONFIRMED'
  | 'READY_TO_GO'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'

export type PlanMember = {
  id: string
  name: string
  initials: string
  role: 'CREATOR' | 'MEMBER'
  online: boolean
}

export type ItineraryStop = {
  type: string
  emoji: string
  label: string
  startTime: string
}

export type UpcomingPlan = {
  id: string
  inviteCode: string
  title: string
  vibe: Vibe
  status: PlanStatus
  /** ISO dates; equal for a one-day plan */
  startDate: string
  endDate: string
  destination: ProvinceId
  startTime: string
  durationMinutes: number
  budgetPerPerson: number
  radiusMeters: number
  pendingVotesForMe: number
  members: PlanMember[]
  itinerary: ItineraryStop[]
}

export type RecentPlan = {
  id: string
  number: number
  title: string
  vibe: Vibe
  date: string
  memberCount: number
  rating: number
  memory: string
  stops: string[]
}

export type HomeSticker =
  | { id: string; kind: 'STOP'; emoji: string; time: string; label: string }
  | { id: string; kind: 'JOINED'; emoji: string; count: number }
  | { id: string; kind: 'CHALLENGE'; emoji: string; label: string }

export type HomeFeature = {
  stickers: HomeSticker[]
}

/** Random challenge; system content localized by the backend (mock carries every language) */
export type Challenge = {
  id: string
  emoji: string
  text: Record<Language, string>
}

/** Per-day settings of a (possibly multi-day) trip */
export type PlanDay = {
  date: string
  startTime: string
  province: ProvinceId
}

export type Activity = {
  id: string
  /** Index into PlanDetail.days */
  dayIndex: number
  /** true: user pinned `startTime`; false/undefined: time flows from the previous stop */
  manualTime?: boolean
  province?: ProvinceId
  lat?: number
  lng?: number
  type: string
  emoji: string
  title: string
  placeName: string
  startTime: string
  durationMinutes: number
  /** VND per person */
  estimatedCost: number
  distanceMeters: number
  locked: boolean
}

export type ActivityAlternative = Pick<Activity, 'type' | 'emoji' | 'title' | 'placeName' | 'estimatedCost' | 'distanceMeters'>

export type PollOption = {
  id: string
  emoji: string
  label: string
  votes: number
}

export type Poll = {
  id: string
  question: Record<Language, string>
  myVoteOptionId: string | null
  options: PollOption[]
}

export type PlanDetail = Omit<UpcomingPlan, 'itinerary' | 'pendingVotesForMe'> & {
  creatorId: string
  days: PlanDay[]
  activities: Activity[]
  alternatives: ActivityAlternative[]
  challenge: Pick<Challenge, 'emoji' | 'text'>
  polls: Poll[]
}

export type PlanActivity = {
  id: string
  planId: string
  type: 'PLAN_VOTE_CAST' | 'PLAN_VOTE_UPDATED' | 'PLAN_MEMBER_JOINED' | 'PLAN_MEMBER_LEFT'
  actor: string
  /** Option or place the action refers to (votes only) */
  target?: string
}

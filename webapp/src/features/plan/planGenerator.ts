import { getProvince, HOME_PROVINCE, type ProvinceId } from '@/constants/provinces'
import type { Vibe } from '@/constants/vibes'
import { addDays, dayCount } from '@/utils/date'
import { retime, STOP_GAP_MINUTES } from './planTiming'
import type { Activity, ActivityAlternative, Challenge, PlanDay, PlanDetail, PlanMember, Poll } from './planTypes'

/** One candidate from the mock activity pool (stands in for Place Service results) */
export type PoolActivity = ActivityAlternative & {
  id: string
  vibes: Vibe[]
  durationMinutes: number
  province: ProvinceId
  lat: number
  lng: number
}

export type PlanLocation = { mode: 'nearby'; radiusKm: number } | { mode: 'province'; province: ProvinceId }

export type GeneratePlanInput = {
  vibe: Vibe
  startDate: string
  endDate: string
  startTime: string
  /** Hours available per day, in minutes */
  durationMinutes: number
  /** Per person, per day */
  budgetPerPerson: number
  location: PlanLocation
  me: Pick<PlanMember, 'id' | 'name' | 'initials'>
  friends: Pick<PlanMember, 'id' | 'name' | 'initials' | 'online'>[]
}

const TITLES: Record<Vibe, string> = {
  CHILL: 'Slow & Easy',
  FOOD: 'Accidental Food Tour',
  PARTY: 'Main Character Night',
  NERDY: 'Nerd Out Night',
  OUTDOOR: 'Touch Grass Tour',
  DATE: 'Cute Little Date',
  CHAOS: 'Unhinged Itinerary',
  SURPRISE: 'Mystery Night',
}

const MAX_STOPS_PER_DAY = 5
const MIN_STOPS_PER_DAY = 2

/** Eat first, wander in the middle, end with something sweet or a drink */
const STOP_ORDER: Record<string, number> = { FOOD: 0, ACTIVITY: 1, WALK: 2, DRINK: 3, DESSERT: 4 }

const shuffle = <T,>(items: T[]) => {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

const randomCode = () => Array.from({ length: 6 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]).join('')

/** Generic local ideas for provinces without curated pool data */
function genericStops(provinceId: ProvinceId): PoolActivity[] {
  const province = getProvince(provinceId)
  const base = { province: province.id, lat: province.lat, lng: province.lng, distanceMeters: 0 }
  return [
    { ...base, id: `gen_${province.id}_1`, vibes: ['FOOD', 'CHILL'], type: 'FOOD', emoji: '🍜', title: 'Local breakfast', placeName: `${province.name} — chợ trung tâm`, estimatedCost: 50000, durationMinutes: 45 },
    { ...base, id: `gen_${province.id}_2`, vibes: ['OUTDOOR', 'CHILL'], type: 'WALK', emoji: province.emoji, title: `Explore ${province.nameEn}`, placeName: province.name, estimatedCost: 0, durationMinutes: 120 },
    { ...base, id: `gen_${province.id}_3`, vibes: ['CHILL', 'DATE'], type: 'DRINK', emoji: '☕', title: 'Local coffee break', placeName: `Cà phê ${province.name}`, estimatedCost: 40000, durationMinutes: 45 },
    { ...base, id: `gen_${province.id}_4`, vibes: ['FOOD', 'PARTY'], type: 'FOOD', emoji: '🍢', title: 'Night food street', placeName: `Phố ẩm thực ${province.name}`, estimatedCost: 120000, durationMinutes: 90 },
  ]
}

/** Picks one day of stops within time and budget, never reusing `used` ids */
function pickDay(candidates: PoolActivity[], minutes: number, budget: number, used: Set<string>) {
  const fresh = candidates.filter((item) => !used.has(item.id))
  const chosen: PoolActivity[] = []
  let spentMinutes = 0
  let spentMoney = 0
  for (const item of fresh) {
    if (chosen.length >= MAX_STOPS_PER_DAY) break
    const nextMinutes = spentMinutes + item.durationMinutes + (chosen.length > 0 ? STOP_GAP_MINUTES : 0)
    const fitsTime = nextMinutes <= minutes || chosen.length < MIN_STOPS_PER_DAY
    if (fitsTime && spentMoney + item.estimatedCost <= budget) {
      chosen.push(item)
      spentMinutes = nextMinutes
      spentMoney += item.estimatedCost
    }
    if (spentMinutes >= minutes - 20 && chosen.length >= MIN_STOPS_PER_DAY) break
  }
  // Budget too tight: fall back to the cheapest fresh ideas
  for (const item of [...fresh].sort((a, b) => a.estimatedCost - b.estimatedCost)) {
    if (chosen.length >= MIN_STOPS_PER_DAY) break
    if (!chosen.includes(item)) chosen.push(item)
  }
  chosen.forEach((item) => used.add(item.id))
  return chosen.sort((a, b) => (STOP_ORDER[a.type] ?? 1) - (STOP_ORDER[b.type] ?? 1))
}

/**
 * Rule-based mock of the backend RecommendationEngine: respects vibe, place (radius or province),
 * per-day hours and per-person daily budget, across one or many days.
 * Replace with POST /api/v1/plans once plan-service exists.
 */
export function generatePlan(input: GeneratePlanInput, pool: PoolActivity[], challenges: Challenge[]): PlanDetail {
  const provinceId = input.location.mode === 'province' ? input.location.province : HOME_PROVINCE
  const radiusMeters = input.location.mode === 'nearby' ? input.location.radiusKm * 1000 : Infinity

  const curated = pool.filter((item) => item.province === provinceId && item.distanceMeters <= radiusMeters)
  // Generic local ideas always come last: they keep long trips and tight budgets from running dry
  const generic = genericStops(provinceId)
  const area = [...curated, ...generic]
  const matching = input.vibe === 'SURPRISE' ? curated : curated.filter((item) => item.vibes.includes(input.vibe))

  const totalDays = Math.max(1, dayCount(input.startDate, input.endDate))
  const days: PlanDay[] = Array.from({ length: totalDays }, (_, index) => ({ date: addDays(input.startDate, index), startTime: input.startTime, province: provinceId }))

  const used = new Set<string>()
  const activities: Activity[] = days.flatMap((_, dayIndex) => {
    // Vibe matches first, then other curated ideas, then generic backfill
    const candidates = [...shuffle(matching), ...shuffle(curated.filter((item) => !matching.includes(item))), ...shuffle(generic)]
    return pickDay(candidates, input.durationMinutes, input.budgetPerPerson, used).map(
      (item, index): Activity => ({
        id: `act_${dayIndex}_${index}_${item.id}`,
        dayIndex,
        type: item.type,
        emoji: item.emoji,
        title: item.title,
        placeName: item.placeName,
        startTime: input.startTime,
        durationMinutes: item.durationMinutes,
        estimatedCost: item.estimatedCost,
        distanceMeters: item.distanceMeters,
        locked: false,
        province: item.province,
        lat: item.lat,
        lng: item.lng,
      }),
    )
  })

  const alternatives: ActivityAlternative[] = area
    .filter((item) => !used.has(item.id))
    .slice(0, 8)
    .map(({ type, emoji, title, placeName, estimatedCost, distanceMeters }) => ({ type, emoji, title, placeName, estimatedCost, distanceMeters }))

  const members: PlanMember[] = [{ ...input.me, role: 'CREATOR', online: true }, ...input.friends.map((friend) => ({ ...friend, role: 'MEMBER' as const }))]

  const polls: Poll[] = []
  const firstStop = activities[0]
  if (input.friends.length > 0 && firstStop) {
    const rivals = alternatives.filter((alt) => alt.type === firstStop.type).slice(0, 2)
    const options = [firstStop, ...(rivals.length > 0 ? rivals : alternatives.slice(0, 2))]
    polls.push({
      id: 'poll_first_stop',
      question: { en: 'First stop: are we sure about this?', vi: 'Điểm đầu: chốt cái này không?' },
      myVoteOptionId: null,
      options: options.map((option, index) => ({ id: `opt_${index}`, emoji: option.emoji, label: option.title, votes: 0 })),
    })
  }

  const challenge = challenges[Math.floor(Math.random() * challenges.length)] ?? {
    emoji: '🍫',
    text: { en: 'Everyone picks a snack for someone else.', vi: 'Mỗi người chọn đồ ăn vặt cho người khác.' },
  }

  const province = getProvince(provinceId)
  const title = totalDays > 1 ? `${province.nameEn} ${TITLES[input.vibe]}` : TITLES[input.vibe]

  return {
    id: `plan_${Date.now().toString(36)}`,
    inviteCode: randomCode(),
    title,
    vibe: input.vibe,
    status: input.friends.length > 0 ? 'VOTING' : 'CONFIRMED',
    startDate: days[0].date,
    endDate: days[days.length - 1].date,
    destination: provinceId,
    startTime: input.startTime,
    durationMinutes: input.durationMinutes,
    budgetPerPerson: input.budgetPerPerson,
    radiusMeters: Number.isFinite(radiusMeters) ? radiusMeters : 0,
    creatorId: input.me.id,
    members,
    days,
    activities: retime(activities, days),
    alternatives,
    challenge: { emoji: challenge.emoji, text: challenge.text },
    polls,
  }
}

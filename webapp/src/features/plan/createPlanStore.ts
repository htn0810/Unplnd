import { create } from 'zustand'
import { MAX_TRIP_DAYS, type ProvinceId } from '@/constants/provinces'
import type { Vibe } from '@/constants/vibes'
import { dayCount, todayIso } from '@/utils/date'

export const CREATE_PLAN_STEPS = ['people', 'when', 'duration', 'budget', 'vibe', 'location'] as const

export type CreatePlanStep = (typeof CREATE_PLAN_STEPS)[number]

export type LocationMode = 'nearby' | 'province'

type CreatePlanState = {
  stepIndex: number
  /** +1 forward, -1 back — drives the slide direction */
  direction: 1 | -1
  friendIds: string[]
  startDate: string
  endDate: string
  startTime: string
  durationMinutes: number | null
  budgetPerPerson: number | null
  vibe: Vibe | null
  locationMode: LocationMode
  radiusKm: number
  province: ProvinceId | null
  next: () => void
  back: () => void
  goTo: (index: number) => void
  toggleFriend: (id: string) => void
  /** Calendar tap: starts a new range, or extends the current one (max MAX_TRIP_DAYS) */
  pickDate: (iso: string) => void
  setStartTime: (time: string) => void
  setDuration: (minutes: number) => void
  setBudget: (amount: number) => void
  setVibe: (vibe: Vibe) => void
  setLocationMode: (mode: LocationMode) => void
  setRadius: (km: number) => void
  setProvince: (province: ProvinceId) => void
  reset: (preset?: { vibe?: Vibe | null }) => void
}

const initialState = () => ({
  stepIndex: 0,
  direction: 1 as const,
  friendIds: [] as string[],
  startDate: todayIso(),
  endDate: todayIso(),
  startTime: '19:00',
  durationMinutes: null,
  budgetPerPerson: null,
  vibe: null,
  locationMode: 'nearby' as LocationMode,
  radiusKm: 5,
  province: null,
})

/** Client-only wizard state (Zustand). Submitted to plan-service as one request at the end. */
export const useCreatePlanStore = create<CreatePlanState>((set) => ({
  ...initialState(),
  next: () => set((state) => ({ stepIndex: Math.min(state.stepIndex + 1, CREATE_PLAN_STEPS.length - 1), direction: 1 })),
  back: () => set((state) => ({ stepIndex: Math.max(state.stepIndex - 1, 0), direction: -1 })),
  goTo: (index) => set((state) => ({ stepIndex: index, direction: index >= state.stepIndex ? 1 : -1 })),
  toggleFriend: (id) =>
    set((state) => ({ friendIds: state.friendIds.includes(id) ? state.friendIds.filter((friendId) => friendId !== id) : [...state.friendIds, id] })),
  pickDate: (iso) =>
    set((state) => {
      const isSingle = state.startDate === state.endDate
      const extends_ = isSingle && iso > state.startDate && dayCount(state.startDate, iso) <= MAX_TRIP_DAYS
      return extends_ ? { endDate: iso } : { startDate: iso, endDate: iso }
    }),
  setStartTime: (startTime) => set({ startTime }),
  setDuration: (durationMinutes) => set({ durationMinutes }),
  setBudget: (budgetPerPerson) => set({ budgetPerPerson }),
  setVibe: (vibe) => set({ vibe }),
  setLocationMode: (locationMode) => set({ locationMode }),
  setRadius: (radiusKm) => set({ radiusKm }),
  setProvince: (province) => set({ province, locationMode: 'province' }),
  reset: (preset) => set({ ...initialState(), vibe: preset?.vibe ?? null }),
}))

export const isTrip = (state: Pick<CreatePlanState, 'startDate' | 'endDate'>) => state.startDate !== state.endDate


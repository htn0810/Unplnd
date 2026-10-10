import { z } from 'zod'

/** Messages are i18n keys, translated when rendered */
export type PlanEditErrorKey =
  | 'planEdit.errors.titleRequired'
  | 'planEdit.errors.placeRequired'
  | 'planEdit.errors.costInvalid'
  | 'planEdit.errors.planTitleRequired'
  | 'planEdit.errors.startTimeInvalid'

const clock = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'planEdit.errors.startTimeInvalid' satisfies PlanEditErrorKey)

export const activitySchema = z.object({
  emoji: z.string().min(1),
  title: z.string().trim().min(1, 'planEdit.errors.titleRequired' satisfies PlanEditErrorKey).max(60),
  placeName: z.string().trim().min(1, 'planEdit.errors.placeRequired' satisfies PlanEditErrorKey).max(80),
  durationMinutes: z.number().int().positive(),
  estimatedCost: z
    .number({ error: 'planEdit.errors.costInvalid' satisfies PlanEditErrorKey })
    .int('planEdit.errors.costInvalid' satisfies PlanEditErrorKey)
    .min(0, 'planEdit.errors.costInvalid' satisfies PlanEditErrorKey)
    .max(100_000_000, 'planEdit.errors.costInvalid' satisfies PlanEditErrorKey),
  dayIndex: z.number().int().min(0),
  manualTime: z.boolean(),
  startTime: clock,
})

export const planDetailsSchema = z.object({
  title: z.string().trim().min(1, 'planEdit.errors.planTitleRequired' satisfies PlanEditErrorKey).max(60),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export type ActivityFormValues = z.infer<typeof activitySchema>
export type PlanDetailsFormValues = z.infer<typeof planDetailsSchema>

import { useMemo, useState } from 'react'
import { MapPin, Search } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { PROVINCES } from '@/constants/provinces'
import { VIBE_META } from '@/constants/vibes'
import { cn } from '@/utils/cn'
import { RADIUS_RANGE } from '../createPlanOptions'
import { useCreatePlanStore } from '../createPlanStore'
import { StepHeading } from './StepHeading'

/** Deterministic pseudo-random spots spread around the center */
const SPOTS = Array.from({ length: 40 }, (_, index) => {
  const angle = index * 2.399963 // golden angle
  const distance = Math.sqrt((index + 0.5) / 40)
  return { x: 50 + Math.cos(angle) * distance * 48, y: 50 + Math.sin(angle) * distance * 48, distance }
})

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()

export function LocationStep() {
  const { t } = useTranslation()
  const mode = useCreatePlanStore((state) => state.locationMode)
  const setMode = useCreatePlanStore((state) => state.setLocationMode)

  return (
    <div className="flex flex-col gap-8">
      <StepHeading id="step-title" title={t('createPlan.location.title')} subtitle={t('createPlan.location.subtitle')} />

      <div role="radiogroup" aria-label={t('createPlan.location.title')} className="relative grid grid-cols-2 rounded-xl bg-muted p-1">
        {(['nearby', 'province'] as const).map((item) => (
          <button
            key={item}
            type="button"
            role="radio"
            aria-checked={mode === item}
            onClick={() => setMode(item)}
            className={cn('relative z-10 h-10 rounded-lg text-sm font-semibold transition-colors', mode === item ? 'text-foreground' : 'text-muted-foreground')}
          >
            {mode === item && <motion.span layoutId="location-mode" className="absolute inset-0 -z-10 rounded-lg bg-card ring-1 ring-border paper-shadow" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />}
            {item === 'nearby' ? '📍 ' : '🗺️ '}
            {t(`createPlan.location.mode.${item}`)}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={mode} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }}>
          {mode === 'nearby' ? <NearbyPanel /> : <ProvincePanel />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function ProvincePanel() {
  const { t, i18n } = useTranslation()
  const province = useCreatePlanStore((state) => state.province)
  const setProvince = useCreatePlanStore((state) => state.setProvince)
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    const needle = normalize(query.trim())
    return PROVINCES.filter((item) => !needle || normalize(`${item.name} ${item.nameEn}`).includes(needle))
  }, [query])

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          aria-label={t('createPlan.location.searchProvinceLabel')}
          placeholder={t('createPlan.location.searchProvince')}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="h-12 rounded-xl pl-10 text-base [&::-webkit-search-cancel-button]:hidden"
        />
      </div>
      <div role="radiogroup" aria-label={t('createPlan.location.mode.province')} className="grid max-h-[46svh] grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">
        {filtered.map((item, index) => {
          const active = province === item.id
          return (
            <motion.button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setProvince(item.id)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(index, 12) * 0.02 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'flex min-h-14 items-center gap-2 rounded-xl bg-card px-3 py-2 text-left ring-1 ring-border paper-shadow transition-colors hover:bg-surface-elevated',
                active && 'bg-primary/10 ring-2 ring-primary',
              )}
            >
              <motion.span aria-hidden className="text-2xl" animate={active ? { rotate: [0, -15, 12, 0], scale: [1, 1.3, 1] } : {}}>
                {item.emoji}
              </motion.span>
              <span className="min-w-0 truncate text-sm font-semibold">{i18n.resolvedLanguage === 'vi' ? item.name : item.nameEn}</span>
            </motion.button>
          )
        })}
        {filtered.length === 0 && <p className="col-span-full py-6 text-center text-sm text-muted-foreground">{t('createPlan.location.noProvince', { query })}</p>}
      </div>
    </div>
  )
}

function NearbyPanel() {
  const { t } = useTranslation()
  const radiusKm = useCreatePlanStore((state) => state.radiusKm)
  const setRadius = useCreatePlanStore((state) => state.setRadius)
  const vibe = useCreatePlanStore((state) => state.vibe)
  // sqrt scale: small radii still feel meaningful on the radar
  const scale = Math.sqrt(radiusKm / RADIUS_RANGE.max)
  const dotClass = vibe ? VIBE_META[vibe].dotClass : 'bg-primary'
  const inRange = SPOTS.filter((spot) => spot.distance <= scale).length

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3 rounded-2xl bg-card p-4 ring-1 ring-border paper-shadow">
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <MapPin className="size-5" />
        </span>
        <span className="flex flex-col">
          <span className="text-xs font-medium text-muted-foreground">{t('createPlan.location.current')}</span>
          <span className="font-semibold">{t('createPlan.location.currentValue')}</span>
        </span>
      </div>

      <div aria-hidden className="relative mx-auto aspect-square w-full max-w-72 overflow-hidden rounded-full bg-card ring-1 ring-border paper-shadow">
        {[0.25, 0.5, 0.75].map((ring) => (
          <span key={ring} className="absolute inset-0 m-auto rounded-full border border-dashed border-border" style={{ width: `${ring * 100}%`, height: `${ring * 100}%` }} />
        ))}
        <motion.span
          className={cn('absolute inset-0 m-auto rounded-full opacity-20', dotClass)}
          animate={{ width: `${Math.max(scale, 0.08) * 100}%`, height: `${Math.max(scale, 0.08) * 100}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        />
        {SPOTS.map((spot, index) => {
          const active = spot.distance <= scale
          return (
            <motion.span
              key={index}
              className={cn('absolute size-1.5 -translate-1/2 rounded-full', active ? dotClass : 'bg-muted-foreground/30')}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              animate={{ scale: active ? 1.4 : 1 }}
            />
          )
        })}
        <span className="absolute top-1/2 left-1/2 flex size-4 -translate-1/2 items-center justify-center">
          <span className="absolute size-full rounded-full bg-primary opacity-60 motion-safe:animate-ping" />
          <span className="relative size-3 rounded-full bg-primary ring-2 ring-background" />
        </span>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <label id="radius-label" className="text-sm font-medium text-muted-foreground">
            {t('createPlan.location.radius')}
          </label>
          <span className="font-heading text-2xl font-bold">{t('createPlan.location.radiusValue', { km: radiusKm })}</span>
        </div>
        <Slider
          aria-labelledby="radius-label"
          min={RADIUS_RANGE.min}
          max={RADIUS_RANGE.max}
          step={RADIUS_RANGE.step}
          value={[radiusKm]}
          onValueChange={([value]) => setRadius(value)}
          className="py-3 [&_[data-slot=slider-range]]:bg-brand-gradient [&_[data-slot=slider-thumb]]:size-6! [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-track]]:h-2!"
        />
        <p className="text-sm text-muted-foreground">{t('createPlan.location.nearbyCount', { count: inRange * 2 })}</p>
      </div>
    </div>
  )
}

import { VIBE_META, type Vibe } from '@/constants/vibes'
import { cn } from '@/utils/cn'

type VibeBadgeProps = {
  vibe: Vibe
  className?: string
}

/** Vibe as a small accent: colored dot + label. Never a full color fill. */
export function VibeBadge({ vibe, className }: VibeBadgeProps) {
  const meta = VIBE_META[vibe]
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase', meta.textClass, className)}>
      <span aria-hidden className={cn('size-2 rounded-full', meta.dotClass)} />
      {meta.label}
    </span>
  )
}

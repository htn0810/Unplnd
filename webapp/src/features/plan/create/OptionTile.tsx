import type { ReactNode } from 'react'
import { Check } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/utils/cn'

type OptionTileProps = {
  selected: boolean
  onSelect: () => void
  emoji?: ReactNode
  title: ReactNode
  subtitle?: ReactNode
  /** Selected ring/tint classes; defaults to brand purple */
  selectedClassName?: string
  className?: string
}

/** Selectable answer tile used by every wizard step (radio semantics) */
export function OptionTile({ selected, onSelect, emoji, title, subtitle, selectedClassName, className }: OptionTileProps) {
  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      whileTap={{ scale: 0.97 }}
      className={cn(
        'group relative flex min-h-[72px] w-full items-center gap-4 rounded-2xl bg-card px-4 py-3 text-left ring-1 ring-border paper-shadow transition-[background-color,box-shadow] duration-200 hover:bg-surface-elevated',
        selected && (selectedClassName ?? 'bg-primary/10 ring-2 ring-primary hover:bg-primary/15'),
        className,
      )}
    >
      {emoji && (
        <motion.span
          aria-hidden
          animate={selected ? { rotate: [0, -12, 10, 0], scale: [1, 1.2, 1] } : { rotate: 0, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="text-3xl"
        >
          {emoji}
        </motion.span>
      )}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-heading text-lg leading-tight font-bold">{title}</span>
        {subtitle && <span className="text-sm text-muted-foreground">{subtitle}</span>}
      </span>
      <AnimatePresence>
        {selected && (
          <motion.span
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
          >
            <Check className="size-4" strokeWidth={3} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

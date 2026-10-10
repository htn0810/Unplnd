import { Check } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Avatar, AvatarBadge, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { useFriendsAround } from '@/features/profile'
import { cn } from '@/utils/cn'
import { useCreatePlanStore } from '../createPlanStore'
import { StepHeading } from './StepHeading'

export function PeopleStep() {
  const { t } = useTranslation()
  const { data: friends, isPending } = useFriendsAround()
  const friendIds = useCreatePlanStore((state) => state.friendIds)
  const toggleFriend = useCreatePlanStore((state) => state.toggleFriend)
  const count = friendIds.length

  return (
    <div className="flex flex-col gap-8">
      <StepHeading id="step-title" title={t('createPlan.people.title')} subtitle={t('createPlan.people.subtitle')} />

      <div aria-live="polite" className="flex h-9 items-center overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.p
            key={count}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="font-heading text-2xl font-bold text-brand-gradient"
          >
            {count === 0 ? t('createPlan.people.solo') : t('createPlan.people.count', { count })}
          </motion.p>
        </AnimatePresence>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {isPending &&
          [0, 1, 2, 3].map((key) => (
            <li key={key}>
              <Skeleton className="h-28 rounded-2xl" />
            </li>
          ))}
        {friends?.map((friend, index) => {
          const selected = friendIds.includes(friend.id)
          return (
            <motion.li
              key={friend.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <motion.button
                type="button"
                aria-pressed={selected}
                onClick={() => toggleFriend(friend.id)}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'relative flex w-full flex-col items-center gap-2 rounded-2xl bg-card px-3 py-4 ring-1 ring-border paper-shadow transition-[background-color,box-shadow] hover:bg-surface-elevated',
                  selected && 'bg-primary/10 ring-2 ring-primary',
                )}
              >
                <motion.span animate={selected ? { scale: [1, 1.15, 1] } : { scale: 1 }} transition={{ duration: 0.3 }}>
                  <Avatar size="lg" className="data-[size=lg]:size-14">
                    <AvatarFallback className={cn('bg-surface-hover text-base font-bold text-foreground', selected && 'bg-primary text-primary-foreground')}>
                      {friend.initials}
                    </AvatarFallback>
                    {friend.online && <AvatarBadge className="size-3.5 bg-success" />}
                  </Avatar>
                </motion.span>
                <span className="text-sm font-semibold">{friend.name}</span>
                <AnimatePresence>
                  {selected && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-2 right-2 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground"
                    >
                      <Check className="size-3" strokeWidth={3} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}

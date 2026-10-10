import { Check, Crown } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import type { Language } from '@/i18n'
import { cn } from '@/utils/cn'
import type { Poll } from '../planTypes'

type VoteCardProps = {
  poll: Poll
  /** Option that just received a vote from someone else — pulses */
  highlightOptionId?: string | null
  onVote: (pollId: string, optionId: string) => void
}

export function VoteCard({ poll, highlightOptionId, onVote }: VoteCardProps) {
  const { t, i18n } = useTranslation()
  const language = (i18n.resolvedLanguage ?? 'en') as Language
  const total = poll.options.reduce((sum, option) => sum + option.votes, 0)
  const leadingVotes = Math.max(...poll.options.map((option) => option.votes))

  return (
    <article className="flex flex-col gap-4 rounded-2xl bg-card p-4 ring-1 ring-border paper-shadow md:p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-lg leading-snug font-bold">{poll.question[language] ?? poll.question.en}</h3>
        <span className="shrink-0 text-xs text-muted-foreground">{t('planDetail.voting.votes', { count: total })}</span>
      </div>

      <div role="radiogroup" aria-label={poll.question[language]} className="flex flex-col gap-2">
        {poll.options.map((option) => {
          const mine = poll.myVoteOptionId === option.id
          const share = total === 0 ? 0 : option.votes / total
          const leading = option.votes > 0 && option.votes === leadingVotes
          const pulsing = highlightOptionId === option.id

          return (
            <motion.button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={mine}
              aria-label={t('planDetail.voting.voteFor', { option: option.label })}
              onClick={() => onVote(poll.id, option.id)}
              whileTap={{ scale: 0.98 }}
              animate={pulsing ? { scale: [1, 1.03, 1] } : { scale: 1 }}
              transition={{ duration: 0.4 }}
              className={cn(
                'relative flex min-h-13 items-center gap-3 overflow-hidden rounded-xl bg-surface-elevated px-4 text-left ring-1 ring-border transition-shadow',
                mine && 'ring-2 ring-primary',
                pulsing && 'ring-2 ring-brand-mint',
              )}
            >
              <motion.span
                aria-hidden
                className={cn('absolute inset-y-0 left-0', mine ? 'bg-primary/25' : 'bg-foreground/[0.06]')}
                initial={false}
                animate={{ width: `${share * 100}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              />
              <span aria-hidden className="relative text-xl">
                {option.emoji}
              </span>
              <span className="relative flex min-w-0 flex-1 items-center gap-2">
                <span className="truncate font-semibold">{option.label}</span>
                {leading && <Crown aria-label={t('planDetail.voting.leading')} className="size-3.5 shrink-0 text-warning" />}
              </span>
              <span className="relative flex items-center gap-2">
                {mine && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                )}
                <span className="relative h-5 w-6 overflow-hidden text-right font-mono text-sm font-semibold">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={option.votes}
                      className="absolute right-0"
                      initial={{ y: 16, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -16, opacity: 0 }}
                    >
                      {option.votes}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </span>
            </motion.button>
          )
        })}
      </div>
    </article>
  )
}

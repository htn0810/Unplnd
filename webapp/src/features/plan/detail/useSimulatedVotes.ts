import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import type { PlanDetail } from '../planTypes'

const INTERVAL_MS = 6500
const MAX_SIMULATED_VOTES = 6

/**
 * Stand-in for PLAN_VOTE_CAST events over WebSocket: other members vote every few seconds.
 * Returns the option that just received a vote so the UI can pulse it.
 */
export function useSimulatedVotes(plan: PlanDetail | null | undefined, receiveVote: (pollId: string, optionId: string) => void) {
  const { t } = useTranslation()
  const [highlight, setHighlight] = useState<string | null>(null)
  const count = useRef(0)
  const planRef = useRef(plan)
  const receiveRef = useRef(receiveVote)

  useEffect(() => {
    planRef.current = plan
    receiveRef.current = receiveVote
  })

  const planId = plan?.id
  const votingOpen = plan?.status === 'VOTING' || plan?.status === 'OPEN'

  useEffect(() => {
    if (!planId || !votingOpen) return
    const id = window.setInterval(() => {
      const current = planRef.current
      if (!current || count.current >= MAX_SIMULATED_VOTES) return
      const others = current.members.filter((member) => member.id !== current.creatorId)
      const member = others[Math.floor(Math.random() * others.length)]
      const poll = current.polls[Math.floor(Math.random() * current.polls.length)]
      const option = poll.options[Math.floor(Math.random() * poll.options.length)]
      count.current += 1
      receiveRef.current(poll.id, option.id)
      setHighlight(option.id)
      window.setTimeout(() => setHighlight(null), 1200)
      toast(t('planDetail.toast.memberVoted', { name: member.name, option: `${option.emoji} ${option.label}` }))
    }, INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [planId, votingOpen, t])

  return highlight
}

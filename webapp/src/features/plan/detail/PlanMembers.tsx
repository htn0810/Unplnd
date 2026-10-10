import { UserPlus } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Avatar, AvatarBadge, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import type { PlanDetail } from '../planTypes'

export function PlanMembers({ plan, onInvite }: { plan: PlanDetail; onInvite: () => void }) {
  const { t } = useTranslation()
  const online = plan.members.filter((member) => member.online).length

  return (
    <section aria-labelledby="members-title" className="flex flex-col gap-4 rounded-2xl bg-card p-4 ring-1 ring-border paper-shadow md:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 id="members-title" className="kicker">
            {t('planDetail.members.title')}
          </h2>
          <p className="mt-0.5 text-sm text-success">{t('planDetail.members.online', { count: online })}</p>
        </div>
        <Button variant="secondary" size="sm" className="font-semibold" onClick={onInvite}>
          <UserPlus />
          {t('planDetail.members.invite')}
        </Button>
      </div>
      <ul className="grid grid-cols-5 gap-2">
        {plan.members.map((member, index) => (
          <motion.li
            key={member.id}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.06, type: 'spring', stiffness: 400, damping: 20 }}
            className="flex min-w-0 flex-col items-center gap-1.5"
          >
            <Avatar size="lg" className="data-[size=lg]:size-12">
              <AvatarFallback className="bg-surface-hover font-semibold text-foreground">{member.initials}</AvatarFallback>
              {member.online && <AvatarBadge className="size-3 bg-success" aria-label={t('common.isOnline', { name: member.name })} />}
            </Avatar>
            <span className="max-w-full truncate text-xs font-medium">{member.name}</span>
            {member.role === 'CREATOR' && <span className="-mt-1 text-[10px] font-semibold text-brand-pink uppercase">{t('planDetail.members.creator')}</span>}
          </motion.li>
        ))}
      </ul>
    </section>
  )
}

import { useTranslation } from 'react-i18next'
import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount } from '@/components/ui/avatar'
import { cn } from '@/utils/cn'

type StackMember = {
  id: string
  name: string
  initials: string
  online?: boolean
}

type MemberStackProps = {
  members: StackMember[]
  max?: number
  /** Ring color must match the surface the stack sits on */
  ringClassName?: string
  className?: string
}

export function MemberStack({ members, max = 4, ringClassName = '*:data-[slot=avatar]:ring-card', className }: MemberStackProps) {
  const { t } = useTranslation()
  const visible = members.slice(0, max)
  const hidden = members.length - visible.length

  return (
    <AvatarGroup className={cn('-space-x-1', ringClassName, className)} aria-label={members.map((member) => member.name).join(', ')}>
      {visible.map((member) => (
        <Avatar key={member.id} title={member.name}>
          <AvatarFallback className="bg-surface-hover text-[11px] font-semibold text-foreground">{member.initials}</AvatarFallback>
          {member.online && <AvatarBadge className="bg-success" aria-label={t('common.isOnline', { name: member.name })} />}
        </Avatar>
      ))}
      {hidden > 0 && <AvatarGroupCount className="text-xs font-semibold">+{hidden}</AvatarGroupCount>}
    </AvatarGroup>
  )
}

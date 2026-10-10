import { useTranslation } from 'react-i18next'
import { MemberStack } from '@/components/MemberStack'
import { Skeleton } from '@/components/ui/skeleton'
import { useFriendsAround } from './profileQueries'

export function FriendsAround() {
  const { t } = useTranslation()
  const { data: friends, isPending, isError } = useFriendsAround()

  if (isPending) return <Skeleton className="h-8 w-56" />
  if (isError) return null

  const free = friends.filter((friend) => friend.online)
  if (free.length === 0) {
    return <p className="text-sm text-muted-foreground">{t('friends.quiet')}</p>
  }

  const [first, second] = free
  const others = free.length - 2
  const names = second ? `${first.name}, ${second.name}` : first.name

  return (
    <div className="flex items-center gap-3">
      <MemberStack members={free} max={3} ringClassName="*:data-[slot=avatar]:ring-background" />
      <p className="text-sm">
        <span className="font-semibold">{names}</span>
        <span className="text-muted-foreground">
          {' '}
          {others > 0 ? t('friends.freeMore', { count: others }) : second ? t('friends.freeTwo') : t('friends.freeOne')}
        </span>
      </p>
    </div>
  )
}

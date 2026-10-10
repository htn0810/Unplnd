import { CheckCheck } from 'lucide-react'
import { BongSprite } from '@/components/BongSprite'
import { AnimatePresence, motion } from 'motion/react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button, buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { planPath } from '@/constants/routes'
import { cn } from '@/utils/cn'
import { formatRelativeTime } from '@/utils/formatRelativeTime'
import { useNotificationActions, useNotifications } from './notificationQueries'
import type { AppNotification, NotificationType } from './notificationTypes'

const TYPE_ICON: Record<NotificationType, string> = {
  PLAN_VOTE_CAST: '🗳️',
  PLAN_MEMBER_JOINED: '👋',
  FRIEND_REQUEST_SENT: '🫶',
  PLAN_CONFIRMED: '✅',
  PLAN_COMPLETED: '⭐',
  FRIEND_REQUEST_ACCEPTED: '🤝',
}

export function NotificationsView() {
  const { t } = useTranslation()
  const { data: items, isPending } = useNotifications()
  const actions = useNotificationActions()
  const unread = items?.filter((item) => !item.read).length ?? 0

  const groups = (['TODAY', 'EARLIER'] as const)
    .map((group) => ({ group, items: items?.filter((item) => item.group === group) ?? [] }))
    .filter((entry) => entry.items.length > 0)

  return (
    <main className="mx-auto w-full max-w-2xl px-4 pt-6 pb-16 md:px-6 lg:pt-10">
      <div className="flex items-end justify-between gap-4">
        <h1 className="text-[40px] leading-[44px] font-bold tracking-tight md:text-[56px] md:leading-[60px]">{t('notifications.title')}</h1>
        <AnimatePresence>
          {unread > 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
              <Button variant="ghost" size="sm" className="font-semibold" onClick={actions.markAllRead}>
                <CheckCheck />
                {t('notifications.markAllRead')}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 flex flex-col gap-8">
        {isPending && [0, 1, 2, 3].map((key) => <Skeleton key={key} className="h-20 rounded-2xl" />)}

        {groups.map(({ group, items: groupItems }) => (
          <section key={group} aria-labelledby={`group-${group}`} className="flex flex-col gap-3">
            <h2 id={`group-${group}`} className="kicker">
              {t(group === 'TODAY' ? 'notifications.today' : 'notifications.earlier')}
            </h2>
            <ul className="flex flex-col gap-2">
              <AnimatePresence initial={false} mode="popLayout">
                {groupItems.map((item, index) => (
                  <NotificationItem key={item.id} item={item} index={index} actions={actions} />
                ))}
              </AnimatePresence>
            </ul>
          </section>
        ))}

        {items?.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-2xl bg-card px-6 py-12 text-center ring-1 ring-border paper-shadow">
            <BongSprite mood="sleepy" />
            <p className="font-heading text-lg font-bold">{t('notifications.emptyTitle')}</p>
            <p className="text-muted-foreground">{t('notifications.emptyBody')}</p>
          </div>
        )}
      </div>
    </main>
  )
}

type NotificationItemProps = {
  item: AppNotification
  index: number
  actions: ReturnType<typeof useNotificationActions>
}

function NotificationItem({ item, index, actions }: NotificationItemProps) {
  const { t, i18n } = useTranslation()

  const accept = () => {
    actions.acceptFriend(item.id)
    toast.success(t('notifications.accepted', { name: item.actor.name }))
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 80, transition: { duration: 0.2 } }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 28 }}
      className={cn('relative flex gap-3 rounded-2xl p-3 ring-1 transition-colors md:p-4', item.read ? 'bg-card ring-border' : 'bg-primary/[0.07] ring-primary/30')}
      onClick={() => !item.read && actions.markRead(item.id)}
    >
      <div className="relative shrink-0 self-start">
        <Avatar size="lg">
          <AvatarFallback className="bg-surface-hover font-semibold text-foreground">{item.actor.initials}</AvatarFallback>
        </Avatar>
        <motion.span
          key={item.type}
          aria-hidden
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          className="absolute -right-1.5 -bottom-1.5 flex size-6 items-center justify-center rounded-full bg-card text-sm ring-2 ring-card"
        >
          {TYPE_ICON[item.type]}
        </motion.span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="text-sm leading-snug [&_b]:font-semibold [&_b]:text-foreground">
          <Trans
            i18nKey={`notifications.type.${item.type}`}
            values={{ name: item.actor.name, plan: item.planTitle, target: item.target }}
            components={{ b: <b /> }}
          />
        </p>
        <p className="text-xs text-muted-foreground">{formatRelativeTime(item.minutesAgo, i18n.resolvedLanguage)}</p>

        {item.type === 'FRIEND_REQUEST_SENT' && (
          <div className="flex gap-2">
            <Button size="sm" className="font-semibold" onClick={accept}>
              {t('notifications.accept')}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => actions.declineFriend(item.id)}>
              {t('notifications.decline')}
            </Button>
          </div>
        )}
        {item.type === 'PLAN_COMPLETED' && item.planId && (
          <Link to={planPath(item.planId)} className={cn(buttonVariants({ size: 'sm', variant: 'secondary' }), 'w-fit font-semibold')}>
            ⭐ {t('notifications.rate')}
          </Link>
        )}
      </div>

      {!item.read && (
        <span className="mt-1.5 size-2.5 shrink-0 rounded-full bg-brand-pink" aria-label={t('notifications.unread')} />
      )}
    </motion.li>
  )
}

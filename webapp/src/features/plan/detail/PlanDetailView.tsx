import { useState } from 'react'
import { BongSprite } from '@/components/BongSprite'
import { useMe } from '@/features/profile'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router'
import { toast } from 'sonner'
import { buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { joinPath, ROUTES } from '@/constants/routes'
import { cn } from '@/utils/cn'
import { usePlanDetailActions, type ActivityDraft } from '../planDetailActions'
import { findOverlaps } from '../planTiming'
import type { Activity } from '../planTypes'
import { ActivityEditorSheet } from './ActivityEditorSheet'
import { PlanDetailsSheet } from './PlanDetailsSheet'
import { usePlanDetail } from '../planQueries'
import { BudgetMeter } from './BudgetMeter'
import { ConfettiBurst } from './ConfettiBurst'
import { ItineraryTimeline } from './ItineraryTimeline'
import { PlanActionBar } from './PlanActionBar'
import { PlanDetailHero } from './PlanDetailHero'
import { PlanMembers } from './PlanMembers'
import { TripMap } from './TripMap'
import { useSimulatedVotes } from './useSimulatedVotes'
import { VoteCard } from './VoteCard'

export function PlanDetailView({ planId }: { planId: string }) {
  const { t } = useTranslation()
  const location = useLocation()
  const reveal = Boolean((location.state as { reveal?: boolean } | null)?.reveal)
  const { data: plan, isPending } = usePlanDetail(planId)
  const actions = usePlanDetailActions(planId)
  const highlight = useSimulatedVotes(plan, actions.receiveVote)
  const [confettiKey, setConfettiKey] = useState(0)
  const { data: me } = useMe()
  // Editor state: `null` closed, `{ activity: undefined }` adding, `{ activity }` editing
  const [editor, setEditor] = useState<{ activity?: Activity; dayIndex?: number } | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  if (isPending) {
    return (
      <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-6 px-4 py-8 md:px-6 lg:px-8">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-40 w-full max-w-xl" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="mx-auto flex min-h-[60svh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
        <BongSprite />
        <h1 className="text-2xl font-bold">{t('planDetail.notFoundTitle')}</h1>
        <p className="text-muted-foreground">{t('planDetail.notFoundBody')}</p>
        <Link to={ROUTES.home} className={cn(buttonVariants({ size: 'lg' }), 'mt-2 font-bold')}>
          {t('planDetail.backHome')}
        </Link>
      </div>
    )
  }

  // Only the host edits; the backend enforces the same rule
  const canEdit = me?.id === plan.creatorId

  const saveActivity = (draft: ActivityDraft) => {
    if (editor?.activity) {
      actions.updateActivity(editor.activity.id, draft)
      toast.success(t('planEdit.saved'))
    } else {
      actions.addActivity(draft)
      toast.success(t('planEdit.added'))
    }
    setEditor(null)
  }

  const deleteActivity = () => {
    if (!editor?.activity) return
    const removed = actions.removeActivity(editor.activity.id)
    setEditor(null)
    if (!removed) {
      toast(t('planEdit.lastStop'))
      return
    }
    toast(t('planEdit.removed'), { action: { label: t('planEdit.undo'), onClick: () => actions.restoreActivity(removed.activity, removed.index) } })
  }

  const share = async () => {
    const url = `${window.location.origin}${joinPath(plan.inviteCode)}`
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // Clipboard can be blocked (permissions, insecure context); the toast still shows the link
    }
    toast.success(t('planDetail.actions.linkCopied'), { description: url })
  }

  const regenerate = () => {
    const changed = actions.regenerate()
    if (changed === 0) toast(t('planDetail.actions.allLocked'))
    else toast(t('planDetail.actions.regenerated', { count: changed }))
  }

  const confirm = () => {
    actions.setStatus('CONFIRMED')
    setConfettiKey((key) => key + 1)
    toast.success(t('planDetail.actions.confirmed'))
  }

  const start = () => {
    actions.setStatus('IN_PROGRESS')
    setConfettiKey((key) => key + 1)
    toast(t('planDetail.actions.started'))
  }

  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 pt-4 md:px-6 lg:px-8 lg:pt-8 lg:pb-24">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16">
        <div className="flex flex-col gap-12">
          <PlanDetailHero plan={plan} reveal={reveal} onEditDetails={canEdit ? () => setDetailsOpen(true) : undefined} />
          <ItineraryTimeline
            plan={plan}
            reveal={reveal}
            canEdit={canEdit}
            overlaps={findOverlaps(plan.activities)}
            onToggleLock={actions.toggleLock}
            onReplace={actions.replaceActivity}
            onEdit={(activity) => setEditor({ activity })}
            onAdd={(dayIndex) => setEditor({ dayIndex })}
            onReorderDay={actions.reorderDay}
            onMove={actions.moveActivity}
            onUpdateDay={actions.updateDay}
            onAddDay={actions.addDay}
            onRemoveDay={(dayIndex) => {
              if (!actions.removeDay(dayIndex)) toast(t('planEdit.dayNotEmpty'))
            }}
          />
        </div>

        <aside className="flex flex-col gap-4 md:grid md:grid-cols-2 md:items-start lg:sticky lg:top-24 lg:flex lg:items-stretch lg:self-start">
          <div className="hidden md:col-span-2 lg:block">
            <PlanActionBar canEdit={canEdit} status={plan.status} onRegenerate={regenerate} onShare={share} onConfirm={confirm} onStart={start} />
          </div>
          <div className="md:col-span-2 lg:col-span-1">
            <TripMap plan={plan} className="h-72 lg:h-80" />
          </div>
          <section aria-labelledby="voting-title" className="flex flex-col gap-3 md:col-span-2 md:grid md:grid-cols-2 md:gap-4 lg:flex lg:gap-3">
            <h2 id="voting-title" className="kicker md:col-span-2">
              {t('planDetail.voting.title')}
            </h2>
            {plan.polls.map((poll) => (
              <VoteCard key={poll.id} poll={poll} highlightOptionId={highlight} onVote={actions.vote} />
            ))}
          </section>
          <BudgetMeter plan={plan} />
          <PlanMembers plan={plan} onInvite={share} />
        </aside>
      </div>

      <PlanActionBar
        className="sticky bottom-16 z-30 -mx-4 mt-10 md:-mx-6 lg:hidden"
        canEdit={canEdit}
        status={plan.status}
        onRegenerate={regenerate}
        onShare={share}
        onConfirm={confirm}
        onStart={start}
      />

      {confettiKey > 0 && <ConfettiBurst key={confettiKey} />}

      <ActivityEditorSheet
        open={editor !== null}
        onOpenChange={(open) => !open && setEditor(null)}
        activity={editor?.activity}
        vibe={plan.vibe}
        days={plan.days}
        defaultDayIndex={editor?.dayIndex ?? 0}
        onSave={saveActivity}
        onDelete={editor?.activity ? deleteActivity : undefined}
      />
      <PlanDetailsSheet
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        details={{ title: plan.title, startDate: plan.startDate }}
        onSave={(draft) => {
          actions.updateDetails(draft)
          setDetailsOpen(false)
          toast.success(t('planEdit.detailsSaved'))
        }}
      />
    </div>
  )
}

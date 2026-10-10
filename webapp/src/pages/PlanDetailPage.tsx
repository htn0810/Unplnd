import { useParams } from 'react-router'
import { PlanDetailView } from '@/features/plan'

export function PlanDetailPage() {
  const { planId = '' } = useParams()
  return <PlanDetailView key={planId} planId={planId} />
}

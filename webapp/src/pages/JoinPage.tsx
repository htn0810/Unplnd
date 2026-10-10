import { useParams } from 'react-router'
import { JoinInviteView } from '@/features/plan'

export function JoinPage() {
  const { inviteCode = '' } = useParams()
  return <JoinInviteView key={inviteCode} inviteCode={inviteCode} />
}

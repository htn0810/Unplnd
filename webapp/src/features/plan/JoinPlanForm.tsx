import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { joinPath } from '@/constants/routes'

const INVITE_CODE_LENGTH = 6

export function JoinPlanForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const isComplete = code.length === INVITE_CODE_LENGTH

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isComplete) navigate(joinPath(code))
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="invite-code" className="text-sm font-medium text-muted-foreground">
        {t('join.label')}
      </label>
      <div className="flex gap-2">
        <Input
          id="invite-code"
          value={code}
          onChange={(event) => setCode(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, INVITE_CODE_LENGTH))}
          placeholder="7H2K9X"
          autoComplete="off"
          spellCheck={false}
          className="h-11 rounded-lg font-mono tracking-[0.3em] uppercase placeholder:tracking-[0.3em]"
        />
        <Button type="submit" variant="secondary" disabled={!isComplete} className="font-semibold">
          {t('join.submit')}
        </Button>
      </div>
    </form>
  )
}

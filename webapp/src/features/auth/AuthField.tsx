import { useState, type ComponentProps } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/utils/cn'
import type { AuthErrorKey } from './authSchema'

type AuthFieldProps = Omit<ComponentProps<typeof Input>, 'id'> & {
  id: string
  label: string
  error?: string
  /** Adds a show/hide toggle */
  revealable?: boolean
}

export function AuthField({ id, label, error, revealable, type, className, ...inputProps }: AuthFieldProps) {
  const { t } = useTranslation()
  const [revealed, setRevealed] = useState(false)
  const errorId = `${id}-error`

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={revealable && revealed ? 'text' : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn('h-11 rounded-lg', revealable && 'pr-12', className)}
          {...inputProps}
        />
        {revealable && (
          <button
            type="button"
            onClick={() => setRevealed((value) => !value)}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-muted-foreground transition-colors hover:text-foreground"
            aria-label={revealed ? t('auth.fields.hidePassword') : t('auth.fields.showPassword')}
            aria-pressed={revealed}
          >
            {revealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
      {error && (
        <p id={errorId} className="text-sm text-destructive">
          {t(error as AuthErrorKey)}
        </p>
      )}
    </div>
  )
}

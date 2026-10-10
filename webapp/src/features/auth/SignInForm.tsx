import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { AuthField } from './AuthField'
import { useSignIn } from './authQueries'
import { signInSchema, type SignInValues } from './authSchema'
import { AuthDivider, SocialSignIn } from './SocialSignIn'

export function SignInForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const signIn = useSignIn()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({ resolver: zodResolver(signInSchema), defaultValues: { username: '', password: '' } })

  const onSubmit = handleSubmit((values) => signIn.mutate(values, { onSuccess: () => navigate(ROUTES.home) }))

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-[32px] leading-[38px] font-bold tracking-tight">{t('auth.signIn.title')}</h1>
        <p className="text-muted-foreground">{t('auth.signIn.subtitle')}</p>
      </div>

      <SocialSignIn disabled={signIn.isPending} />
      <AuthDivider />

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <AuthField
          id="sign-in-username"
          label={t('auth.fields.username')}
          placeholder={t('auth.fields.usernamePlaceholder')}
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          error={errors.username?.message}
          {...register('username')}
        />
        <div className="flex flex-col gap-2">
          <AuthField
            id="sign-in-password"
            type="password"
            revealable
            label={t('auth.fields.password')}
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <a href="#" className="self-end text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {t('auth.signIn.forgot')}
          </a>
        </div>

        {signIn.isError && (
          <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {t('auth.errors.generic')}
          </p>
        )}

        <Button type="submit" size="lg" className="h-13 w-full rounded-xl text-base font-bold tracking-wide" disabled={signIn.isPending}>
          {signIn.isPending ? t('auth.signIn.submitting') : t('auth.signIn.submit')}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {t('auth.signIn.noAccount')}{' '}
        <Link to={ROUTES.signUp} className="font-semibold text-foreground underline-offset-4 hover:underline">
          {t('auth.signIn.toSignUp')}
        </Link>
      </p>
    </div>
  )
}

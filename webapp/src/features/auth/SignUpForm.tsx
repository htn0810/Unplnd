import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { AuthField } from './AuthField'
import { useSignUp } from './authQueries'
import { signUpSchema, type SignUpValues } from './authSchema'
import { AuthDivider, SocialSignIn } from './SocialSignIn'

const LEGAL_LINK_CLASS = 'font-medium text-foreground underline underline-offset-4'

export function SignUpForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const signUp = useSignUp()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { username: '', password: '', confirmPassword: '' },
  })

  const onSubmit = handleSubmit((values) => signUp.mutate(values, { onSuccess: () => navigate(ROUTES.home) }))

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-[32px] leading-[38px] font-bold tracking-tight">{t('auth.signUp.title')}</h1>
        <p className="text-muted-foreground">{t('auth.signUp.subtitle')}</p>
      </div>

      <SocialSignIn disabled={signUp.isPending} />
      <AuthDivider />

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <AuthField
          id="sign-up-username"
          label={t('auth.fields.username')}
          placeholder={t('auth.fields.usernamePlaceholder')}
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          error={errors.username?.message}
          {...register('username')}
        />
        <AuthField
          id="sign-up-password"
          type="password"
          revealable
          label={t('auth.fields.password')}
          placeholder={t('auth.fields.passwordPlaceholder')}
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <AuthField
          id="sign-up-confirm-password"
          type="password"
          revealable
          label={t('auth.fields.confirmPassword')}
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        {signUp.isError && (
          <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {t('auth.errors.generic')}
          </p>
        )}

        <Button type="submit" size="lg" className="h-13 w-full rounded-xl text-base font-bold tracking-wide" disabled={signUp.isPending}>
          {signUp.isPending ? t('auth.signUp.submitting') : t('auth.signUp.submit')}
        </Button>

        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          <Trans
            i18nKey="auth.signUp.terms"
            components={{
              terms: <a href="#" className={LEGAL_LINK_CLASS} />,
              privacy: <a href="#" className={LEGAL_LINK_CLASS} />,
            }}
          />
        </p>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {t('auth.signUp.hasAccount')}{' '}
        <Link to={ROUTES.signIn} className="font-semibold text-foreground underline-offset-4 hover:underline">
          {t('auth.signUp.toSignIn')}
        </Link>
      </p>
    </div>
  )
}

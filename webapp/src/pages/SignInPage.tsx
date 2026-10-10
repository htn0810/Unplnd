import { useTranslation } from 'react-i18next'
import { AuthLayout, SignInForm } from '@/features/auth'

export function SignInPage() {
  const { t } = useTranslation()

  return (
    <AuthLayout panelTitle={t('auth.panel.signInTitle')} panelBody={t('auth.panel.signInBody')}>
      <SignInForm />
    </AuthLayout>
  )
}

import { useTranslation } from 'react-i18next'
import { AuthLayout, SignUpForm } from '@/features/auth'

export function SignUpPage() {
  const { t } = useTranslation()

  return (
    <AuthLayout panelTitle={t('auth.panel.signUpTitle')} panelBody={t('auth.panel.signUpBody')}>
      <SignUpForm />
    </AuthLayout>
  )
}

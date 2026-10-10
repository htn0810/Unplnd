import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { SUPPORTED_LANGUAGES, type Language } from '@/i18n'

const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  vi: 'Tiếng Việt',
}

/** Toggles between supported languages (EN ↔ VI). Choice is remembered in localStorage. */
export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  const current = (i18n.resolvedLanguage ?? 'en') as Language
  const next = SUPPORTED_LANGUAGES[(SUPPORTED_LANGUAGES.indexOf(current) + 1) % SUPPORTED_LANGUAGES.length]

  return (
    <Button
      variant="ghost"
      size="icon"
      className="font-mono text-xs font-semibold"
      onClick={() => void i18n.changeLanguage(next)}
      aria-label={t('common.changeLanguage', { language: LANGUAGE_NAMES[current] })}
    >
      {current.toUpperCase()}
    </Button>
  )
}

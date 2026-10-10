import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import vi from './locales/vi.json'

export const SUPPORTED_LANGUAGES = ['en', 'vi'] as const

export type Language = (typeof SUPPORTED_LANGUAGES)[number]

export const resources = {
  en: { translation: en },
  vi: { translation: vi },
} as const

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES,
    nonExplicitSupportedLngs: true, // "vi-VN" → "vi"
    interpolation: { escapeValue: false }, // React already escapes
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'unplnd.language',
      caches: ['localStorage'],
    },
  })

const syncHtmlLang = (language: string) => document.documentElement.setAttribute('lang', language)
syncHtmlLang(i18n.resolvedLanguage ?? 'en')
i18n.on('languageChanged', syncHtmlLang)

export default i18n

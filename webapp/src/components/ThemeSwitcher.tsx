import { Monitor, Moon, Sun } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useThemeStore, type ThemePreference } from '@/store/themeStore'

const ORDER: ThemePreference[] = ['light', 'dark', 'system']
const ICONS = { dark: Moon, light: Sun, system: Monitor } as const

/** Cycles Day → Twilight → System. The icon spins in on change. */
export function ThemeSwitcher() {
  const { t } = useTranslation()
  const preference = useThemeStore((state) => state.preference)
  const setPreference = useThemeStore((state) => state.setPreference)
  const next = ORDER[(ORDER.indexOf(preference) + 1) % ORDER.length]
  const Icon = ICONS[preference]

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setPreference(next)}
      aria-label={t('common.theme', { current: t(`common.themes.${preference}`), next: t(`common.themes.${next}`) })}
      title={t(`common.themes.${preference}`)}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={preference}
          initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          className="flex"
        >
          <Icon className="size-5" />
        </motion.span>
      </AnimatePresence>
    </Button>
  )
}

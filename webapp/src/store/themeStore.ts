import { create } from 'zustand'

export type ThemePreference = 'dark' | 'light' | 'system'
export type ResolvedTheme = 'dark' | 'light'

/** Shared with the inline no-flash script in index.html — keep the key in sync */
export const THEME_STORAGE_KEY = 'unplnd.theme'

const DARK_QUERY = '(prefers-color-scheme: dark)'

const readPreference = (): ThemePreference => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  } catch {
    // Storage can be blocked (private mode); fall back to the Day default
  }
  return 'light'
}

const resolve = (preference: ThemePreference): ResolvedTheme =>
  preference === 'system' ? (window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light') : preference

const apply = (theme: ResolvedTheme) => {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#171d2e' : '#f5efe1')
}

type ThemeState = {
  preference: ThemePreference
  resolved: ResolvedTheme
  setPreference: (preference: ThemePreference) => void
}

/** UI preference (Zustand): Day (light) by default, Twilight (dark) or follow-the-system on demand */
export const useThemeStore = create<ThemeState>((set) => {
  const preference = readPreference()

  // Follow OS changes while the preference is "system"
  window.matchMedia(DARK_QUERY).addEventListener('change', () => {
    const { preference: current } = useThemeStore.getState()
    if (current !== 'system') return
    const resolved = resolve('system')
    apply(resolved)
    set({ resolved })
  })

  return {
    preference,
    resolved: resolve(preference),
    setPreference: (next) => {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next)
      } catch {
        // Not persisted; still applied for this session
      }
      const resolved = resolve(next)
      apply(resolved)
      set({ preference: next, resolved })
    },
  }
})

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import { App } from './App.tsx'

// Dev-only: `?noanim` skips all animations (used for screenshots in background/headless tabs)
if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('noanim')) {
  const { MotionGlobalConfig } = await import('motion/react')
  MotionGlobalConfig.skipAnimations = true
  document.documentElement.classList.add('no-anim')
}

// Production only: the service worker serves public/offline.html when a page loads without network
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js')
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

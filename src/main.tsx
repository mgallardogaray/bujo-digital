import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/cormorant-garamond/500-italic.css'
import '@fontsource/cormorant-garamond/600-italic.css'
import '@fontsource/gaegu/400.css'
import '@fontsource/gaegu/700.css'
import '@fontsource/quicksand/400.css'
import '@fontsource/quicksand/500.css'
import '@fontsource/quicksand/700.css'
import './styles.css'
import { registerSW } from 'virtual:pwa-register'
import App from './App'

// Actualizaciones: revisar al volver a la app y recargar sola si hay versión nueva.
if ('serviceWorker' in navigator) {
  const hadController = !!navigator.serviceWorker.controller
  let reloading = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController || reloading) return // primera instalación: no recargar
    reloading = true
    window.location.reload()
  })
  registerSW({
    immediate: true,
    onRegisteredSW(_url, reg) {
      if (!reg) return
      const check = () => void reg.update().catch(() => {})
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) check()
      })
      setInterval(check, 30 * 60 * 1000)
    },
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

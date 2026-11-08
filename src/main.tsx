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
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

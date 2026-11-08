import { useEffect } from 'react'
import { useRoute } from './lib/router'
import { isISO, todayISO } from './lib/dates'
import { Home } from './screens/Home'
import { Calendar } from './screens/Calendar'
import { Day } from './screens/Day'
import { Routines } from './screens/Routines'
import { Colors } from './screens/Colors'
import { Account } from './screens/Account'
import { derive } from './lib/color'
import { useStore } from './lib/store'

export default function App() {
  const [page, param] = useRoute()
  const color = useStore().settings.color

  // Color elegido por mí (si no, manda el color del mes)
  useEffect(() => {
    const root = document.documentElement
    if (color) {
      const { accent, soft, onAccent } = derive(color)
      root.style.setProperty('--accent', accent)
      root.style.setProperty('--accent-soft', soft)
      root.style.setProperty('--on-accent', onAccent)
    } else {
      root.style.removeProperty('--accent')
      root.style.removeProperty('--accent-soft')
      root.style.removeProperty('--on-accent')
    }
  }, [color])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [page, param])

  // Cada mes tiene su propio color. El calendario lo maneja él mismo.
  useEffect(() => {
    if (page === 'calendario') return
    const iso = page === 'dia' && isISO(param) ? param : todayISO()
    document.documentElement.dataset.month = String(Number(iso.slice(5, 7)))
  }, [page, param])

  if (page === 'calendario') return <Calendar />
  if (page === 'dia') return <Day date={param ?? todayISO()} />
  if (page === 'rutinas' || page === 'atajos') return <Routines />
  if (page === 'colores') return <Colors />
  if (page === 'cuenta') return <Account />
  return <Home />
}

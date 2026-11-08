import { useEffect } from 'react'
import { useRoute } from './lib/router'
import { isISO, todayISO } from './lib/dates'
import { Home } from './screens/Home'
import { Calendar } from './screens/Calendar'
import { Day } from './screens/Day'
import { Routines } from './screens/Routines'

export default function App() {
  const [page, param] = useRoute()

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
  if (page === 'rutinas') return <Routines />
  return <Home />
}

import { useEffect } from 'react'
import { useRoute } from './lib/router'
import { todayISO } from './lib/dates'
import { Home } from './screens/Home'
import { Calendar } from './screens/Calendar'
import { Day } from './screens/Day'
import { Routines } from './screens/Routines'

export default function App() {
  const [page, param] = useRoute()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [page, param])

  if (page === 'calendario') return <Calendar />
  if (page === 'dia') return <Day date={param ?? todayISO()} />
  if (page === 'rutinas') return <Routines />
  return <Home />
}

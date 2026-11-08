import { useState } from 'react'
import { Header } from '../components/Header'
import { monthGrid, monthName, todayISO } from '../lib/dates'
import { go } from '../lib/router'
import { useStore } from '../lib/store'
import { urgency } from '../lib/urgency'

const WEEK = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

export function Calendar() {
  const s = useStore()
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const today = todayISO()

  function shift(delta: number) {
    const d = new Date(year, month + delta, 1)
    setYear(d.getFullYear())
    setMonth(d.getMonth())
  }

  return (
    <>
      <Header title="Calendario" tape="lav" />

      <div className="monthbar">
        <button className="ghost big" onClick={() => shift(-1)} aria-label="Mes anterior">
          ‹
        </button>
        <span className="monthname">
          {monthName(month)} {year}
        </span>
        <button className="ghost big" onClick={() => shift(1)} aria-label="Mes siguiente">
          ›
        </button>
      </div>

      <div className="cal">
        {WEEK.map((w, i) => (
          <div key={i} className="wd">
            {w}
          </div>
        ))}
        {monthGrid(year, month).map((iso, i) => {
          if (!iso) return <div key={i} />
          const items = s.pendings.filter((p) => p.day === iso)
          return (
            <button
              key={iso}
              className={'cell' + (iso === today ? ' today' : '')}
              onClick={() => go(`dia/${iso}`)}
            >
              <span className="num">{Number(iso.slice(8))}</span>
              <span className="dots">
                {items.slice(0, 5).map((p) => (
                  <i key={p.id} className={`dot d-${p.done ? 'done' : urgency(p, Date.now())}`} />
                ))}
              </span>
            </button>
          )
        })}
      </div>

      <p className="hint">Toca un día para ver y anotar sus pendientes.</p>
    </>
  )
}

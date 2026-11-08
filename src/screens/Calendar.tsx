import { useEffect, useRef, useState } from 'react'
import { Header } from '../components/Header'
import { monthGrid, monthName, todayISO } from '../lib/dates'
import { go } from '../lib/router'
import { useStore } from '../lib/store'
import { urgency } from '../lib/urgency'

const WEEK = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom']

export function Calendar() {
  const s = useStore()
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const today = todayISO()
  const activeTab = useRef<HTMLButtonElement>(null)

  // Avanzar o retroceder de a un mes (pasa de diciembre a enero del año siguiente)
  function shift(delta: number) {
    const d = new Date(year, month + delta, 1)
    setYear(d.getFullYear())
    setMonth(d.getMonth())
  }

  // El color de toda la app sigue al mes que estoy mirando
  useEffect(() => {
    document.documentElement.dataset.month = String(month + 1)
    activeTab.current?.scrollIntoView({ inline: 'center', block: 'nearest' })
  }, [month])

  return (
    <>
      <div className="mtabs" role="tablist" aria-label="Meses">
        {Array.from({ length: 12 }, (_, i) => (
          <button
            key={i}
            ref={i === month ? activeTab : undefined}
            role="tab"
            aria-selected={i === month}
            className={'mtab' + (i === month ? ' on' : '')}
            onClick={() => setMonth(i)}
          >
            {monthName(i).slice(0, 3)}
          </button>
        ))}
      </div>

      <Header title="Calendario" />

      <div className="yearbar">
        <button className="ghost" onClick={() => shift(-1)} aria-label="Mes anterior">
          ‹
        </button>
        <span>
          {monthName(month)} {year}
        </span>
        <button className="ghost" onClick={() => shift(1)} aria-label="Mes siguiente">
          ›
        </button>
      </div>

      <div className="calwrap">
        <div className="wdrow">
          {WEEK.map((w) => (
            <div key={w} className="wd">
              {w}
            </div>
          ))}
        </div>
        <div className="cal">
          {monthGrid(year, month).map((iso, i) => {
            if (!iso) return <div key={i} className="cell empty" />
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
      </div>

      <p className="hint">Toca un día para ver y anotar sus pendientes.</p>
    </>
  )
}

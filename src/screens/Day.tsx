import { useState } from 'react'
import { Header } from '../components/Header'
import { PendingItem } from '../components/PendingItem'
import { addDays, formatLong, formatShort, isISO, todayISO } from '../lib/dates'
import { go } from '../lib/router'
import { actions, MAX_DAILY, useStore } from '../lib/store'
import { primeAudio } from '../lib/sound'

export function Day({ date }: { date: string }) {
  const day = isISO(date) ? date : todayISO()
  const s = useStore()
  const [title, setTitle] = useState('')
  const [due, setDue] = useState('')
  const [time, setTime] = useState('')
  const [overflow, setOverflow] = useState<string | null>(null)

  const list = s.pendings
    .filter((p) => p.day === day)
    .sort((a, b) => Number(a.done) - Number(b.done) || a.due.localeCompare(b.due))
  const isToday = day === todayISO()

  function nextFreeDay(): string {
    let d = day
    for (let i = 0; i < 60; i++) {
      d = addDays(d, 1)
      if (s.pendings.filter((p) => p.day === d).length < MAX_DAILY) return d
    }
    return d
  }

  function reset() {
    setTitle('')
    setDue('')
    setTime('')
    setOverflow(null)
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const t = title.trim()
    if (!t) return
    const res = actions.addPending({ title: t, day, due: due || day, dueTime: time })
    if (res === 'full') setOverflow(nextFreeDay())
    else reset()
  }

  function moveOverflow() {
    if (!overflow) return
    actions.addPending({ title: title.trim(), day: overflow, due: due || overflow, dueTime: time }, true)
    reset()
  }

  return (
    <div className="dayview">
      <div className="daymain">
      <Header title={isToday ? 'Hoy' : formatLong(day)} back="calendario" />
      {isToday && <p className="greet">{formatLong(day)}</p>}

      <section>
        <h2 className="sec">
          Pendientes{' '}
          <span className="count">
            {list.length}/{MAX_DAILY}
          </span>
        </h2>

        {list.length === 0 && <p className="hint">Nada anotado todavía. ¡Un día tranquilo! 🌤️</p>}
        <ul className="plist">
          {list.map((p) => (
            <PendingItem
              key={p.id}
              p={p}
              onToggle={() => actions.togglePending(p.id)}
              onDelete={() => actions.removePending(p.id)}
              onTomorrow={() => actions.movePending(p.id, addDays(day, 1))}
            />
          ))}
        </ul>

        <form className="addform" onSubmit={submit}>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              setOverflow(null)
            }}
            placeholder="Nuevo pendiente…"
            maxLength={120}
            aria-label="Nuevo pendiente"
          />
          <div className="row">
            <label>
              📅 límite
              <input type="date" value={due || day} onChange={(e) => setDue(e.target.value)} />
            </label>
            <label>
              ⏰ hora
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </label>
          </div>
          <button className="btn" type="submit">
            Agregar
          </button>
        </form>

        {overflow && (
          <div className="notice">
            <p>
              Ya tienes {MAX_DAILY} pendientes para este día 💛. Para poder hacerlos de verdad, mejor
              dejarlo para otro día.
            </p>
            <button className="btn" onClick={moveOverflow}>
              Agendarlo el {formatShort(overflow)}
            </button>
          </div>
        )}
      </section>

      {s.routines.length > 0 && (
        <section>
          <h2 className="sec">Rutinas</h2>
          <div className="chips">
            {s.routines.map((r) => (
              <button
                key={r.id}
                className="chip"
                onClick={() => {
                  primeAudio()
                  if (!s.timer) actions.startTimer(r.id)
                  go('rutinas')
                }}
              >
                {r.emoji} {r.name} · {r.minutes}′
              </button>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="sec">Nota del día</h2>
        <textarea
          className="note"
          value={s.notes[day] ?? ''}
          onChange={(e) => actions.setNote(day, e.target.value)}
          placeholder="Lo que quieras recordar de este día…"
          rows={4}
        />
      </section>
      </div>

      <nav className="sidenav" aria-label="Navegación del día">
        <a className="sidebtn" href={'#/dia/' + addDays(day, -1)} title="Día anterior">
          <span>‹</span>
          <small>Antes</small>
        </a>
        <a className="sidebtn" href={'#/dia/' + addDays(day, 1)} title="Día siguiente">
          <span>›</span>
          <small>Después</small>
        </a>
        <a className="sidebtn" href="#/calendario" title="Calendario">
          <span>🗓️</span>
          <small>Mes</small>
        </a>
        <a className="sidebtn" href="#/" title="Menú principal">
          <span>🏠</span>
          <small>Menú</small>
        </a>
      </nav>
    </div>
  )
}

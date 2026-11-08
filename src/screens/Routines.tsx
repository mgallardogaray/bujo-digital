import { useEffect, useRef, useState } from 'react'
import { Header } from '../components/Header'
import { fmtClock } from '../lib/dates'
import { actions, useStore } from '../lib/store'
import type { ActiveTimer, Routine, RoutineLog } from '../lib/store'
import { beep, primeAudio } from '../lib/sound'

function useNow(ms: number) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), ms)
    return () => clearInterval(id)
  }, [ms])
  return now
}

function avgReal(logs: RoutineLog[], routineId: string): number | null {
  const last = logs.filter((l) => l.routineId === routineId).slice(-5)
  if (!last.length) return null
  return Math.round(last.reduce((a, l) => a + l.seconds, 0) / last.length / 60)
}

export function Routines() {
  const s = useStore()
  const running = s.timer ? s.routines.find((r) => r.id === s.timer!.routineId) : undefined

  if (s.timer && running) return <TimerView timer={s.timer} routine={running} />
  return <RoutineList routines={s.routines} logs={s.logs} />
}

function RoutineList({ routines, logs }: { routines: Routine[]; logs: RoutineLog[] }) {
  const [name, setName] = useState('')
  const [minutes, setMinutes] = useState('10')
  const [editing, setEditing] = useState(false)

  function add(e: React.FormEvent) {
    e.preventDefault()
    const n = name.trim()
    const m = Math.max(1, Math.min(240, Number(minutes) || 0))
    if (!n || !m) return
    actions.addRoutine(n, m)
    setName('')
  }

  return (
    <>
      <Header title="Rutinas" />
      <p className="monthlabel">atajos de hábitos diarios</p>
      <p className="hint center">Toca una y el temporizador parte al tiro.</p>

      <div className="shortcuts">
        {routines.map((r) => {
          const real = avgReal(logs, r.id)
          return (
            <div key={r.id} className="shortcutwrap">
              <button
                className="shortcut"
                onClick={() => {
                  primeAudio()
                  actions.startTimer(r.id)
                }}
              >
                <span className="emoji">{r.emoji}</span>
                <strong>{r.name}</strong>
                <small>
                  {r.minutes} min{real !== null ? ` · real ~${real}` : ''}
                </small>
              </button>
              {editing && (
                <button
                  className="del"
                  aria-label={`Borrar ${r.name}`}
                  onClick={() => {
                    if (confirm(`¿Borrar la rutina "${r.name}"?`)) actions.removeRoutine(r.id)
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          )
        })}
      </div>

      {routines.length > 0 && (
        <button className="more" onClick={() => setEditing(!editing)}>
          {editing ? 'Listo ✓' : 'Quitar rutinas'}
        </button>
      )}

      <h2 className="sec">Nueva rutina</h2>
      <form className="addform" onSubmit={add}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Ordenar mi pieza"
          maxLength={60}
          aria-label="Nombre de la rutina"
        />
        <div className="row">
          <label>
            ⏳ minutos
            <input
              type="number"
              min={1}
              max={240}
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
            />
          </label>
        </div>
        <button className="btn" type="submit">
          Agregar rutina
        </button>
      </form>
    </>
  )
}

const R = 96
const C = 2 * Math.PI * R

function TimerView({ timer, routine }: { timer: ActiveTimer; routine: Routine }) {
  const now = useNow(250)
  const elapsed = Math.floor((now - timer.startedAt) / 1000)
  const remaining = timer.durationSec - elapsed
  const over = remaining < 0
  const fraction = Math.max(0, Math.min(1, remaining / timer.durationSec))

  const fired = useRef({ half: elapsed >= timer.durationSec / 2, end: remaining <= 0 })
  useEffect(() => {
    const f = fired.current
    if (remaining > 0) f.end = false // si extendí el tiempo, vuelve a avisar al final
    if (!f.half && elapsed >= timer.durationSec / 2) {
      f.half = true
      beep(1)
    }
    if (!f.end && remaining <= 0) {
      f.end = true
      beep(3)
    }
  })

  // Mantener la pantalla encendida mientras corre el temporizador
  useEffect(() => {
    let lock: WakeLockSentinel | null = null
    navigator.wakeLock
      ?.request('screen')
      .then((l) => {
        lock = l
      })
      .catch(() => {})
    return () => {
      void lock?.release()
    }
  }, [])

  const halfway = !over && elapsed >= timer.durationSec / 2
  const msg = over
    ? 'Se acabó el tiempo 💛 ¿Ya terminaste?'
    : halfway
      ? 'Vas por la mitad, sigue así 🌿'
      : 'Tú puedes, paso a paso 🌱'

  return (
    <>
      <Header title={routine.name} tape="mint" back="" />
      <div className="timer">
        <svg viewBox="0 0 220 220" width="260" height="260" role="img" aria-label="Tiempo restante">
          <circle cx="110" cy="110" r={R} className="ring-bg" />
          <circle
            cx="110"
            cy="110"
            r={R}
            className={'ring' + (over ? ' over' : '')}
            strokeDasharray={C}
            strokeDashoffset={C * (1 - (over ? 1 : fraction))}
            transform="rotate(-90 110 110)"
          />
          <text x="110" y="104" textAnchor="middle" className="t-emoji">
            {routine.emoji}
          </text>
          <text x="110" y="144" textAnchor="middle" className="t-clock">
            {over ? '+' : ''}
            {fmtClock(remaining)}
          </text>
        </svg>

        <p className="tmsg">{msg}</p>

        <div className="tbtns">
          <button className="btn" onClick={() => actions.stopTimer(true)}>
            Terminé ✓
          </button>
          <button className="btn alt" onClick={() => actions.extendTimer(300)}>
            +5 min
          </button>
          <button
            className="btn alt"
            onClick={() => {
              if (confirm('¿Cancelar sin guardar?')) actions.stopTimer(false)
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </>
  )
}

import { useSyncExternalStore } from 'react'
import { todayISO } from './dates'

export type Pending = {
  id: string
  title: string
  day: string // día en que lo tengo agendado
  due: string // fecha límite
  dueTime: string // hora límite ('' = sin hora)
  done: boolean
  createdAt: number
}
export type Routine = { id: string; name: string; emoji: string; minutes: number }
export type RoutineLog = {
  id: string
  routineId: string
  date: string
  seconds: number
  plannedSeconds: number
}
export type ActiveTimer = { routineId: string; startedAt: number; durationSec: number }

type State = {
  pendings: Pending[]
  routines: Routine[]
  logs: RoutineLog[]
  notes: Record<string, string>
  timer: ActiveTimer | null
  /** color = null → cambia solo según el mes */
  settings: { color: string | null }
}

export const MAX_DAILY = 5

const KEY = 'bujo-digital:v1'
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7)

const seed = (): State => ({
  pendings: [],
  routines: [
    { id: uid() + 'a', name: 'Lavarme los dientes', emoji: '🪥', minutes: 3 },
    { id: uid() + 'b', name: 'Ducha', emoji: '🚿', minutes: 10 },
    { id: uid() + 'c', name: 'Skincare', emoji: '🧴', minutes: 5 },
    { id: uid() + 'd', name: 'Cocinar', emoji: '🍳', minutes: 30 },
  ],
  logs: [],
  notes: {},
  timer: null,
  settings: { color: null },
})

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...seed(), ...JSON.parse(raw) }
  } catch {
    /* sin almacenamiento: partimos de cero */
  }
  return seed()
}

/** Lo que no marqué como hecho en días anteriores pasa a hoy. */
function rolled(s: State): State {
  const today = todayISO()
  let changed = false
  const pendings = s.pendings.map((p) => {
    if (!p.done && p.day < today) {
      changed = true
      return { ...p, day: today }
    }
    return p
  })
  return changed ? { ...s, pendings } : s
}

let state: State = rolled(load())
const listeners = new Set<() => void>()

function set(next: State) {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* ignorar */
  }
  listeners.forEach((l) => l())
}

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

export const useStore = () => useSyncExternalStore(subscribe, () => state)

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) actions.rollOver()
  })
}

export type NewPending = { title: string; day: string; due: string; dueTime: string }

export const actions = {
  rollOver() {
    const next = rolled(state)
    if (next !== state) set(next)
  },

  /** Devuelve 'full' si ese día ya tiene el máximo de pendientes. */
  addPending(input: NewPending, force = false): 'ok' | 'full' {
    const count = state.pendings.filter((p) => p.day === input.day).length
    if (count >= MAX_DAILY && !force) return 'full'
    const p: Pending = { id: uid(), done: false, createdAt: Date.now(), ...input }
    set({ ...state, pendings: [...state.pendings, p] })
    return 'ok'
  },
  togglePending(id: string) {
    set({ ...state, pendings: state.pendings.map((p) => (p.id === id ? { ...p, done: !p.done } : p)) })
  },
  removePending(id: string) {
    set({ ...state, pendings: state.pendings.filter((p) => p.id !== id) })
  },
  movePending(id: string, day: string) {
    set({ ...state, pendings: state.pendings.map((p) => (p.id === id ? { ...p, day } : p)) })
  },

  setColor(color: string | null) {
    set({ ...state, settings: { ...state.settings, color } })
  },

  setNote(day: string, text: string) {
    set({ ...state, notes: { ...state.notes, [day]: text } })
  },

  addRoutine(name: string, minutes: number) {
    const r: Routine = { id: uid(), name, minutes, emoji: '✨' }
    set({ ...state, routines: [...state.routines, r] })
  },
  removeRoutine(id: string) {
    set({ ...state, routines: state.routines.filter((r) => r.id !== id) })
  },

  startTimer(routineId: string) {
    const r = state.routines.find((x) => x.id === routineId)
    if (!r) return
    set({ ...state, timer: { routineId, startedAt: Date.now(), durationSec: r.minutes * 60 } })
  },
  extendTimer(seconds: number) {
    if (!state.timer) return
    set({ ...state, timer: { ...state.timer, durationSec: state.timer.durationSec + seconds } })
  },
  /** Termina el temporizador. Si `save`, guarda cuánto tardé de verdad. */
  stopTimer(save: boolean) {
    const t = state.timer
    if (!t) return
    const logs = save
      ? [
          ...state.logs,
          {
            id: uid(),
            routineId: t.routineId,
            date: todayISO(),
            seconds: Math.round((Date.now() - t.startedAt) / 1000),
            plannedSeconds: t.durationSec,
          },
        ]
      : state.logs
    set({ ...state, timer: null, logs })
  },
}

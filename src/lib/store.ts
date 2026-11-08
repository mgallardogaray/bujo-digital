import { useSyncExternalStore } from 'react'
import { todayISO } from './dates'
import { emptySynced, normalizeSynced } from './merge'
import type { Synced } from './merge'

export type Pending = {
  id: string
  title: string
  day: string // día en que lo tengo agendado
  due: string // fecha límite
  dueTime: string // hora límite ('' = sin hora)
  done: boolean
  createdAt: number
  updatedAt: number
}
export type Routine = {
  id: string
  name: string
  emoji: string
  minutes: number
  /** orden en la lista */
  pos: number
  updatedAt: number
}
export type RoutineLog = {
  id: string
  routineId: string
  date: string
  seconds: number
  plannedSeconds: number
}
export type ActiveTimer = { routineId: string; startedAt: number; durationSec: number }

/** Todo lo sincronizable + el temporizador (que es solo de este dispositivo). */
export type State = Synced & { timer: ActiveTimer | null }

export const MAX_DAILY = 5

const KEY = 'bujo-digital:v1'
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7)

const seedRoutines = (): Routine[] =>
  [
    { id: 'seed-dientes', name: 'Lavarme los dientes', emoji: '🪥', minutes: 3 },
    { id: 'seed-ducha', name: 'Ducha', emoji: '🚿', minutes: 10 },
    { id: 'seed-skincare', name: 'Skincare', emoji: '🧴', minutes: 5 },
    { id: 'seed-cocinar', name: 'Cocinar', emoji: '🍳', minutes: 30 },
  ].map((r, i) => ({ ...r, pos: i + 1, updatedAt: 1 }))

const seed = (): State => ({ ...emptySynced(), routines: seedRoutines(), timer: null })

/** Acepta datos guardados por versiones anteriores de la app. */
function migrate(raw: Partial<State>): State {
  const base = normalizeSynced(raw)
  return {
    ...base,
    pendings: base.pendings.map((p) => ({ ...p, updatedAt: p.updatedAt ?? p.createdAt ?? 1 })),
    routines: raw.routines
      ? base.routines.map((r, i) => ({ ...r, pos: r.pos ?? i + 1, updatedAt: r.updatedAt ?? 1 }))
      : seedRoutines(),
    timer: raw.timer ?? null,
  }
}

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return migrate(JSON.parse(raw))
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
      // No se cambia updatedAt: todos los dispositivos harían el mismo movimiento.
      return { ...p, day: today }
    }
    return p
  })
  return changed ? { ...s, pendings } : s
}

let state: State = rolled(load())
const listeners = new Set<() => void>()
const localHooks = new Set<() => void>()

/** fromRemote = true cuando el cambio viene de la nube (no hay que volver a subirlo). */
function set(next: State, fromRemote = false) {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* ignorar */
  }
  listeners.forEach((l) => l())
  if (!fromRemote) localHooks.forEach((h) => h())
}

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

export const useStore = () => useSyncExternalStore(subscribe, () => state)

/** Para la sincronización: avisa cuando yo cambié algo en este dispositivo. */
export function onLocalChange(fn: () => void) {
  localHooks.add(fn)
  return () => localHooks.delete(fn)
}
export function getSynced(): Synced {
  const { timer, ...rest } = state
  void timer
  return rest
}
export function applySynced(s: Synced) {
  set(rolled({ ...state, ...s }), true)
}

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
    const now = Date.now()
    const p: Pending = { id: uid(), done: false, createdAt: now, updatedAt: now, ...input }
    set({ ...state, pendings: [...state.pendings, p] })
    return 'ok'
  },
  togglePending(id: string) {
    const now = Date.now()
    set({
      ...state,
      pendings: state.pendings.map((p) => (p.id === id ? { ...p, done: !p.done, updatedAt: now } : p)),
    })
  },
  removePending(id: string) {
    set({
      ...state,
      pendings: state.pendings.filter((p) => p.id !== id),
      deleted: { ...state.deleted, [id]: Date.now() },
    })
  },
  movePending(id: string, day: string) {
    const now = Date.now()
    set({
      ...state,
      pendings: state.pendings.map((p) => (p.id === id ? { ...p, day, updatedAt: now } : p)),
    })
  },

  setColor(color: string | null) {
    set({ ...state, settings: { ...state.settings, color }, settingsAt: Date.now() })
  },

  setNote(day: string, text: string) {
    set({
      ...state,
      notes: { ...state.notes, [day]: text },
      noteTimes: { ...state.noteTimes, [day]: Date.now() },
    })
  },

  addRoutine(name: string, minutes: number) {
    const now = Date.now()
    const r: Routine = { id: uid(), name, minutes, emoji: '✨', pos: now, updatedAt: now }
    set({ ...state, routines: [...state.routines, r] })
  },
  removeRoutine(id: string) {
    set({
      ...state,
      routines: state.routines.filter((r) => r.id !== id),
      deleted: { ...state.deleted, [id]: Date.now() },
    })
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

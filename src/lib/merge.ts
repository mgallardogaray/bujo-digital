// Lógica pura para unir los datos de dos dispositivos sin perder nada.
// Regla: gana el cambio más reciente de cada cosa; lo borrado queda anotado ("lápida") para que
// el borrado también viaje al otro dispositivo.
import type { Pending, Routine, RoutineLog } from './store'

export type Synced = {
  pendings: Pending[]
  routines: Routine[]
  logs: RoutineLog[]
  notes: Record<string, string>
  noteTimes: Record<string, number>
  /** id -> momento en que se borró */
  deleted: Record<string, number>
  settings: { color: string | null }
  settingsAt: number
}

export const emptySynced = (): Synced => ({
  pendings: [],
  routines: [],
  logs: [],
  notes: {},
  noteTimes: {},
  deleted: {},
  settings: { color: null },
  settingsAt: 0,
})

export function normalizeSynced(x: Partial<Synced> | null | undefined): Synced {
  const e = emptySynced()
  if (!x) return e
  return {
    pendings: Array.isArray(x.pendings) ? x.pendings : e.pendings,
    routines: Array.isArray(x.routines) ? x.routines : e.routines,
    logs: Array.isArray(x.logs) ? x.logs : e.logs,
    notes: x.notes ?? e.notes,
    noteTimes: x.noteTimes ?? e.noteTimes,
    deleted: x.deleted ?? e.deleted,
    settings: { color: x.settings?.color ?? null },
    settingsAt: x.settingsAt ?? 0,
  }
}

/** JSON con las llaves ordenadas: sirve para comparar dos estados. */
export function stable(v: unknown): string {
  return JSON.stringify(v, (_k, val) =>
    val && typeof val === 'object' && !Array.isArray(val)
      ? Object.fromEntries(Object.entries(val).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)))
      : val,
  )
}

type Stamped = { id: string; updatedAt: number }

function newer<T extends Stamped>(cur: T, cand: T): boolean {
  return cand.updatedAt > cur.updatedAt || (cand.updatedAt === cur.updatedAt && stable(cand) > stable(cur))
}

function mergeItems<T extends Stamped>(a: T[], b: T[], deleted: Record<string, number>): T[] {
  const m = new Map<string, T>()
  for (const it of [...a, ...b]) {
    const cur = m.get(it.id)
    if (!cur || newer(cur, it)) m.set(it.id, it)
  }
  return [...m.values()].filter((it) => !((deleted[it.id] ?? -1) >= it.updatedAt))
}

const byId = (a: { id: string }, b: { id: string }) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)

/** Si dos dispositivos crearon la misma rutina por separado (ej. las de ejemplo), se queda una. */
function dedupeRoutines(rs: Routine[], deleted: Record<string, number>): Routine[] {
  const sorted = [...rs].sort((a, b) => a.pos - b.pos || byId(a, b))
  const keep = new Map<string, Routine>()
  for (const r of sorted) {
    const key = `${r.name.trim().toLowerCase()}|${r.minutes}|${r.emoji}`
    if (keep.has(key)) deleted[r.id] = Math.max(deleted[r.id] ?? 0, r.updatedAt + 1)
    else keep.set(key, r)
  }
  return [...keep.values()]
}

export function mergeSynced(x: Synced, y: Synced): Synced {
  const deleted: Record<string, number> = { ...x.deleted }
  for (const [id, t] of Object.entries(y.deleted)) deleted[id] = Math.max(deleted[id] ?? 0, t)

  const pendings = mergeItems(x.pendings, y.pendings, deleted).sort(
    (a, b) => a.createdAt - b.createdAt || byId(a, b),
  )
  const routines = dedupeRoutines(mergeItems(x.routines, y.routines, deleted), deleted)

  const logMap = new Map<string, RoutineLog>()
  for (const l of [...x.logs, ...y.logs]) if (!logMap.has(l.id)) logMap.set(l.id, l)
  const logs = [...logMap.values()].sort(byId)

  const notes: Record<string, string> = {}
  const noteTimes: Record<string, number> = {}
  for (const day of new Set([...Object.keys(x.notes), ...Object.keys(y.notes)])) {
    const tx = x.noteTimes[day] ?? 0
    const ty = y.noteTimes[day] ?? 0
    const nx = x.notes[day] ?? ''
    const ny = y.notes[day] ?? ''
    const useY = ty > tx || (ty === tx && ny > nx)
    notes[day] = useY ? ny : nx
    noteTimes[day] = Math.max(tx, ty)
  }

  const useYSettings =
    y.settingsAt > x.settingsAt ||
    (y.settingsAt === x.settingsAt && (y.settings.color ?? '') > (x.settings.color ?? ''))

  return {
    pendings,
    routines,
    logs,
    notes,
    noteTimes,
    deleted,
    settings: useYSettings ? y.settings : x.settings,
    settingsAt: Math.max(x.settingsAt, y.settingsAt),
  }
}

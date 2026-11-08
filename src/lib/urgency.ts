import type { Pending } from './store'

// 'ok' = verde, 'soon' = amarillo, 'near' = rojo (ya venció)
export type Urgency = 'ok' | 'soon' | 'near'

// Umbral (ajustable): a partir de cuántos días faltantes pasa de verde a amarillo.
const YELLOW_DAYS = 5

function dueTime(p: Pick<Pending, 'due' | 'dueTime'>): number {
  const [y, m, d] = p.due.split('-').map(Number)
  const [hh, mm] = (p.dueTime || '23:59').split(':').map(Number) // sin hora = vence al terminar el día
  return new Date(y, m - 1, d, hh, mm).getTime()
}

/**
 * Verde: faltan más de 5 días.
 * Amarillo: faltan 5 días o menos.
 * Rojo: ya venció.
 */
export function urgency(p: Pick<Pending, 'due' | 'dueTime'>, now: number): Urgency {
  if (dueTime(p) < now) return 'near'
  // Se cuentan días de calendario: "dentro de 5 días" = 5, sin importar la hora.
  const [y, m, d] = p.due.split('-').map(Number)
  const today = new Date(now)
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  const daysLeft = Math.round((new Date(y, m - 1, d).getTime() - todayStart) / 864e5)
  return daysLeft > YELLOW_DAYS ? 'ok' : 'soon'
}

export function isOverdue(p: Pick<Pending, 'due' | 'dueTime'>, now: number): boolean {
  return dueTime(p) < now
}

import type { Pending } from './store'

export type Urgency = 'ok' | 'soon' | 'near'

// Umbrales (ajustables): cuántas horas faltan para el límite.
const NEAR_HOURS = 24 // rojo claro: queda 1 día o menos (o ya pasó)
const SOON_HOURS = 72 // amarillo claro: quedan 3 días o menos

export function urgency(p: Pick<Pending, 'due' | 'dueTime'>, now: number): Urgency {
  const [y, m, d] = p.due.split('-').map(Number)
  const [hh, mm] = (p.dueTime || '23:59').split(':').map(Number)
  const hoursLeft = (new Date(y, m - 1, d, hh, mm).getTime() - now) / 36e5
  if (hoursLeft <= NEAR_HOURS) return 'near'
  if (hoursLeft <= SOON_HOURS) return 'soon'
  return 'ok'
}

export function isOverdue(p: Pick<Pending, 'due' | 'dueTime'>, now: number): boolean {
  const [y, m, d] = p.due.split('-').map(Number)
  const [hh, mm] = (p.dueTime || '23:59').split(':').map(Number)
  return new Date(y, m - 1, d, hh, mm).getTime() < now
}

const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]
const DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']

export const pad = (n: number) => String(n).padStart(2, '0')
export const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const todayISO = () => toISO(new Date())
export const isISO = (s: string | undefined): s is string => !!s && /^\d{4}-\d{2}-\d{2}$/.test(s)

export function fromISO(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(s: string, n: number): string {
  const d = fromISO(s)
  d.setDate(d.getDate() + n)
  return toISO(d)
}

export const monthName = (m: number) => MONTHS[m]

export function formatLong(s: string): string {
  const d = fromISO(s)
  return `${DAYS[d.getDay()]} ${d.getDate()} de ${MONTHS[d.getMonth()]}`
}

export function formatShort(s: string): string {
  const d = fromISO(s)
  return `${DAYS[d.getDay()].slice(0, 3)} ${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)}`
}

/** Celdas del mes, empezando en lunes. null = casilla vacía. */
export function monthGrid(year: number, month: number): (string | null)[] {
  const offset = (new Date(year, month, 1).getDay() + 6) % 7
  const total = new Date(year, month + 1, 0).getDate()
  const cells: (string | null)[] = Array(offset).fill(null)
  for (let d = 1; d <= total; d++) cells.push(toISO(new Date(year, month, d)))
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export function fmtClock(totalSeconds: number): string {
  const s = Math.abs(Math.round(totalSeconds))
  return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`
}

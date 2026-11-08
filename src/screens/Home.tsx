import { Header } from '../components/Header'
import { monthName, todayISO } from '../lib/dates'
import { useStore } from '../lib/store'

type Card = { to?: string; title: string; emoji: string; tone: string; sub: string }

export function Home() {
  const s = useStore()
  const today = todayISO()
  const now = new Date()
  const hour = now.getHours()
  const greet =
    hour < 6
      ? 'Buenas noches 🌙'
      : hour < 12
        ? 'Buenos días ☀️'
        : hour < 20
          ? 'Buenas tardes 🌞'
          : 'Buenas noches 🌙'

  const todays = s.pendings.filter((p) => p.day === today)
  const done = todays.filter((p) => p.done).length
  const running = s.timer ? s.routines.find((r) => r.id === s.timer!.routineId) : undefined

  const cards: Card[] = [
    {
      to: `dia/${today}`,
      title: 'Hoy',
      emoji: '🌼',
      tone: 'accent',
      sub: todays.length ? `${done} de ${todays.length} listos` : 'nada por ahora',
    },
    { to: 'calendario', title: 'Calendario', emoji: '🗓️', tone: 'soft', sub: 'ver el mes' },
    { to: 'rutinas', title: 'Rutinas', emoji: '⏱️', tone: 'paper', sub: 'con temporizador' },
    { to: 'atajos', title: 'Atajos', emoji: '⚡', tone: 'soft', sub: 'de hábitos diarios' },
    { title: 'Hábitos', emoji: '🌱', tone: 'later', sub: 'pronto' },
    { title: 'Metas', emoji: '🎯', tone: 'later', sub: 'pronto' },
    { title: 'Estante', emoji: '📚', tone: 'later', sub: 'pronto' },
  ]

  return (
    <>
      <Header title="Bujo" back={null} />
      <p className="monthlabel">
        {monthName(now.getMonth())} {now.getFullYear()}
      </p>
      <p className="greet">{greet}</p>

      {running && (
        <a className="banner" href="#/rutinas">
          ⏱️ {running.emoji} {running.name} en curso · ver
        </a>
      )}

      <div className="cards">
        {cards.map((c) =>
          c.to ? (
            <a key={c.title} className={`card t-${c.tone}`} href={'#/' + c.to}>
              <span className="emoji">{c.emoji}</span>
              <strong>{c.title}</strong>
              <small>{c.sub}</small>
            </a>
          ) : (
            <div key={c.title} className="card t-later">
              <span className="emoji">{c.emoji}</span>
              <strong>{c.title}</strong>
              <small>{c.sub}</small>
            </div>
          ),
        )}
      </div>
    </>
  )
}

import { Header } from '../components/Header'
import { todayISO } from '../lib/dates'
import { useStore } from '../lib/store'

type Card = { to?: string; title: string; emoji: string; color: string; sub: string }

export function Home() {
  const s = useStore()
  const today = todayISO()
  const hour = new Date().getHours()
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
      color: 'butter',
      sub: todays.length ? `${done} de ${todays.length} listos` : 'nada por ahora',
    },
    { to: 'calendario', title: 'Calendario', emoji: '🗓️', color: 'lav', sub: 'ver el mes' },
    { to: 'rutinas', title: 'Rutinas', emoji: '⏱️', color: 'mint', sub: 'con temporizador' },
    { title: 'Hábitos', emoji: '🌱', color: 'sage', sub: 'pronto' },
    { title: 'Metas', emoji: '🎯', color: 'peach', sub: 'pronto' },
    { title: 'Estante', emoji: '📚', color: 'sky', sub: 'pronto' },
  ]

  return (
    <>
      <Header title="Bujo" back={null} />
      <p className="greet">{greet}</p>

      {running && (
        <a className="banner" href="#/rutinas">
          ⏱️ {running.emoji} {running.name} en curso · ver
        </a>
      )}

      <div className="cards">
        {cards.map((c) =>
          c.to ? (
            <a key={c.title} className={`card c-${c.color}`} href={'#/' + c.to}>
              <span className="emoji">{c.emoji}</span>
              <strong>{c.title}</strong>
              <small>{c.sub}</small>
            </a>
          ) : (
            <div key={c.title} className={`card soon c-${c.color}`}>
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

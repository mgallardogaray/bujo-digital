import { Header } from '../components/Header'
import { go } from '../lib/router'
import { actions, useStore } from '../lib/store'
import { primeAudio } from '../lib/sound'

export function Shortcuts() {
  const s = useStore()
  const running = s.timer ? s.routines.find((r) => r.id === s.timer!.routineId) : undefined

  return (
    <>
      <Header title="Atajos" />
      <p className="monthlabel">de hábitos diarios</p>
      <p className="hint center">Toca uno y el temporizador parte al tiro.</p>

      {running && (
        <a className="banner" href="#/rutinas">
          ⏱️ {running.emoji} {running.name} en curso · ver
        </a>
      )}

      <div className="shortcuts">
        {s.routines.map((r) => (
          <button
            key={r.id}
            className="shortcut"
            onClick={() => {
              primeAudio()
              if (!s.timer) actions.startTimer(r.id)
              go('rutinas')
            }}
          >
            <span className="emoji">{r.emoji}</span>
            <strong>{r.name}</strong>
            <small>{r.minutes} min</small>
          </button>
        ))}
      </div>

      <a className="more" href="#/rutinas">
        Agregar o quitar atajos →
      </a>
    </>
  )
}

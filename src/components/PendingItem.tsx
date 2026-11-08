import { formatShort } from '../lib/dates'
import { isOverdue, urgency } from '../lib/urgency'
import type { Pending } from '../lib/store'

type Props = {
  p: Pending
  onToggle: () => void
  onDelete: () => void
  onTomorrow: () => void
}

export function PendingItem({ p, onToggle, onDelete, onTomorrow }: Props) {
  const now = Date.now()
  const tone = p.done ? 'done' : urgency(p, now)
  const late = !p.done && isOverdue(p, now)
  const due = formatShort(p.due) + (p.dueTime ? ` · ${p.dueTime}` : '')

  return (
    <li className={`pending u-${tone}`}>
      <button
        className="check"
        onClick={onToggle}
        aria-label={p.done ? 'Desmarcar' : 'Marcar como hecho'}
      >
        {p.done ? '✓' : ''}
      </button>
      <div className="pbody">
        <span className="ptitle">{p.title}</span>
        <span className="pdue">{late ? `pasó el límite (${due}) · sin drama 💛` : `límite: ${due}`}</span>
      </div>
      {!p.done && (
        <button className="ghost" onClick={onTomorrow} title="Pasar a mañana" aria-label="Pasar a mañana">
          →
        </button>
      )}
      <button className="ghost" onClick={onDelete} aria-label="Borrar">
        ✕
      </button>
    </li>
  )
}

import { Header } from '../components/Header'
import { derive, PALETTE } from '../lib/color'
import { actions, useStore } from '../lib/store'

export function Colors() {
  const s = useStore()
  const color = s.settings.color
  const isPreset = color !== null && PALETTE.some((p) => p.hex === color)

  return (
    <>
      <Header title="Colores" />
      <p className="hint center">Elige el color de tu app. Los demás tonos se ajustan solos para que todo combine.</p>

      <button className={'btn' + (color === null ? '' : ' alt')} onClick={() => actions.setColor(null)}>
        {color === null ? '✓ ' : ''}Automático · cambia cada mes
      </button>

      <h2 className="sec">Mis colores</h2>
      <div className="swatches">
        {PALETTE.map((p) => (
          <button
            key={p.hex}
            className={'sw' + (color === p.hex ? ' on' : '')}
            style={{ background: derive(p.hex).accent }}
            onClick={() => actions.setColor(p.hex)}
            aria-label={p.name}
            aria-pressed={color === p.hex}
            title={p.name}
          />
        ))}
        <label
          className={'sw custom' + (color !== null && !isPreset ? ' on' : '')}
          title="Elige el tuyo"
          aria-label="Elegir otro color"
        >
          <input
            type="color"
            value={color ?? '#b08a2e'}
            onChange={(e) => actions.setColor(e.target.value)}
          />
        </label>
      </div>

      <h2 className="sec">Así se ve</h2>
      <div className="preview">
        <div className="pending u-ok">
          <span className="check" />
          <div className="pbody">
            <span className="ptitle">Un pendiente de ejemplo</span>
            <span className="pdue">límite: mañana</span>
          </div>
        </div>
        <div className="chips">
          <span className="chip">🚿 Ducha · 10′</span>
          <button className="btn">Agregar</button>
          <button className="btn alt">Cancelar</button>
        </div>
      </div>
    </>
  )
}

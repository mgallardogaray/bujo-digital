import { useState } from 'react'
import { Header } from '../components/Header'
import { signIn, signOut, signUp, syncNow, useSync } from '../lib/sync'

export function Account() {
  const info = useSync()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  if (!info.configured) {
    return (
      <>
        <Header title="Sincronizar" />
        <p className="hint center">La sincronización todavía no está configurada en esta versión de la app.</p>
      </>
    )
  }

  if (info.user) {
    const time = info.lastSync
      ? new Date(info.lastSync).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
      : null
    return (
      <>
        <Header title="Sincronizar" />
        <div className="preview">
          <p className="acctline">
            Conectada como <strong>{info.user}</strong>
          </p>
          <p className="acctline soft">
            {info.status === 'syncing' && 'Sincronizando…'}
            {info.status === 'idle' && (time ? `Todo al día ✓ · última vez a las ${time}` : 'Todo al día ✓')}
            {info.status === 'error' && `No se pudo sincronizar: ${info.error}`}
          </p>
        </div>
        <p className="hint center">
          Lo que anotes aquí aparece en tus otros dispositivos. Solo tienes que abrir la app con esta misma cuenta.
        </p>
        <div className="addform">
          <button className="btn" onClick={() => void syncNow()}>
            Sincronizar ahora
          </button>
          <button className="btn alt" onClick={() => void signOut()}>
            Cerrar sesión
          </button>
        </div>
      </>
    )
  }

  async function run(kind: 'in' | 'up') {
    if (!email.trim() || !password) {
      setMsg('Escribe tu correo y tu contraseña.')
      return
    }
    setBusy(true)
    setMsg(null)
    const err = kind === 'in' ? await signIn(email, password) : await signUp(email, password)
    setBusy(false)
    if (err) setMsg(err)
  }

  return (
    <>
      <Header title="Sincronizar" />
      <p className="hint center">
        Entra con tu cuenta para que tus pendientes estén igual en el celular y en la tablet.
      </p>
      <form
        className="addform"
        onSubmit={(e) => {
          e.preventDefault()
          void run('in')
        }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo"
          autoComplete="email"
          aria-label="Correo"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña (mínimo 6)"
          autoComplete="current-password"
          aria-label="Contraseña"
        />
        <button className="btn" type="submit" disabled={busy}>
          Entrar
        </button>
        <button className="btn alt" type="button" disabled={busy} onClick={() => void run('up')}>
          Crear cuenta
        </button>
        {msg && <p className="notice">{msg}</p>}
      </form>
      <p className="hint center">Primera vez: toca "Crear cuenta". En tu otro dispositivo, "Entrar".</p>
    </>
  )
}

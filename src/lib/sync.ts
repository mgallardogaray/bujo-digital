import { useSyncExternalStore } from 'react'
import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient, Session } from '@supabase/supabase-js'
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './supabaseConfig'
import { mergeSynced, normalizeSynced, stable } from './merge'
import { applySynced, getSynced, onLocalChange } from './store'

export const syncConfigured = !!SUPABASE_URL && !!SUPABASE_ANON_KEY

const sb: SupabaseClient | null = syncConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { storageKey: 'bujo-digital:auth' } })
  : null

export type SyncInfo = {
  configured: boolean
  user: string | null
  status: 'signedout' | 'idle' | 'syncing' | 'error'
  lastSync: number | null
  error: string | null
}

let info: SyncInfo = { configured: syncConfigured, user: null, status: 'signedout', lastSync: null, error: null }
const subs = new Set<() => void>()
function setInfo(p: Partial<SyncInfo>) {
  info = { ...info, ...p }
  subs.forEach((f) => f())
}
export const useSync = () =>
  useSyncExternalStore(
    (l) => {
      subs.add(l)
      return () => subs.delete(l)
    },
    () => info,
  )

let userId: string | null = null
let running = false
let again = false
let started = false
let debounce: ReturnType<typeof setTimeout> | undefined

/** Una vuelta: baja lo de la nube, lo une con lo de este dispositivo y sube lo que falte. */
async function syncOnce(retries = 3): Promise<void> {
  if (!sb || !userId) return
  const { data: row, error } = await sb
    .from('user_state')
    .select('data, rev')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error

  if (!row) {
    const { error: e } = await sb.from('user_state').insert({ user_id: userId, data: getSynced(), rev: 1 })
    if (e) {
      if (retries > 0) return syncOnce(retries - 1)
      throw e
    }
    return
  }

  const remote = normalizeSynced(row.data)
  const local = getSynced()
  const merged = mergeSynced(local, remote)
  const mergedKey = stable(merged)

  if (mergedKey !== stable(local)) applySynced(merged)

  if (mergedKey !== stable(remote)) {
    // Solo sube si nadie más cambió la nube mientras tanto (si cambió, repite la vuelta)
    const { data: upd, error: e } = await sb
      .from('user_state')
      .update({ data: merged, rev: row.rev + 1, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('rev', row.rev)
      .select('rev')
    if (e) throw e
    if (!upd || upd.length === 0) {
      if (retries > 0) return syncOnce(retries - 1)
      throw new Error('Se cambió en otro dispositivo; intenta de nuevo')
    }
  }
}

function friendly(e: unknown): string {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return 'Sin conexión'
  const msg = e instanceof Error ? e.message : (e as { message?: string })?.message
  return msg || 'No se pudo sincronizar'
}

export async function syncNow(): Promise<void> {
  if (!sb || !userId) return
  if (running) {
    again = true
    return
  }
  running = true
  setInfo({ status: 'syncing', error: null })
  try {
    await syncOnce()
    setInfo({ status: 'idle', lastSync: Date.now() })
  } catch (e) {
    setInfo({ status: 'error', error: friendly(e) })
  } finally {
    running = false
    if (again) {
      again = false
      void syncNow()
    }
  }
}

function startEngine() {
  if (started) return
  started = true
  // Cuando yo cambio algo, se sube a los pocos segundos
  onLocalChange(() => {
    clearTimeout(debounce)
    debounce = setTimeout(() => void syncNow(), 1500)
  })
  // Y se revisa si hay novedades al volver a la app, al reconectarse y cada 20 s
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) void syncNow()
  })
  window.addEventListener('online', () => void syncNow())
  setInterval(() => {
    if (!document.hidden) void syncNow()
  }, 20000)
}

function handleSession(session: Session | null) {
  userId = session?.user.id ?? null
  setInfo({ user: session?.user.email ?? null, status: session ? 'idle' : 'signedout', error: null })
  if (session) {
    startEngine()
    setTimeout(() => void syncNow(), 0)
  }
}

export async function initSync() {
  if (!sb) return
  sb.auth.onAuthStateChange((_event, session) => handleSession(session))
  const { data } = await sb.auth.getSession()
  handleSession(data.session)
}

function friendlyAuth(msg: string): string {
  if (/invalid login/i.test(msg)) return 'Correo o contraseña incorrectos.'
  if (/already registered/i.test(msg)) return 'Ese correo ya tiene cuenta: toca "Entrar".'
  if (/at least 6/i.test(msg)) return 'La contraseña debe tener al menos 6 caracteres.'
  if (/signups? not allowed|disabled/i.test(msg)) return 'El registro de cuentas nuevas está cerrado.'
  if (/rate limit/i.test(msg)) return 'Demasiados intentos. Espera un rato y vuelve a probar.'
  return msg
}

/** Devuelven un mensaje de error, o null si salió bien. */
export async function signIn(email: string, password: string): Promise<string | null> {
  if (!sb) return 'La sincronización no está configurada.'
  const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password })
  return error ? friendlyAuth(error.message) : null
}
export async function signUp(email: string, password: string): Promise<string | null> {
  if (!sb) return 'La sincronización no está configurada.'
  const { data, error } = await sb.auth.signUp({ email: email.trim(), password })
  if (error) return friendlyAuth(error.message)
  if (!data.session) return 'Te enviamos un correo para confirmar la cuenta. Confírmalo y luego toca "Entrar".'
  return null
}
export async function signOut(): Promise<void> {
  await sb?.auth.signOut()
}

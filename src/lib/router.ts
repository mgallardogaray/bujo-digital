import { useEffect, useState } from 'react'

/** Router mínimo basado en #hash: así el botón "atrás" del celular funciona. */
export function useRoute(): string[] {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return hash.replace(/^#\/?/, '').split('/')
}

export const go = (path: string) => {
  window.location.hash = '/' + path
}

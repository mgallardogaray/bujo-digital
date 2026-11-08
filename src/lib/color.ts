/** Convierte cualquier color elegido en un par armonioso: uno firme (botones, franja) y uno suave (fondos). */

function hexToHsl(hex: string): [number, number, number] {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return [40, 0.5, 0.4]
  const n = parseInt(m[1], 16)
  const r = ((n >> 16) & 255) / 255
  const g = ((n >> 8) & 255) / 255
  const b = (n & 255) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  const d = max - min
  let h = 0
  let s = 0
  if (d) {
    s = d / (1 - Math.abs(2 * l - 1))
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  return [h, s, l]
}

function hslToHex(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let rgb: [number, number, number]
  if (h < 60) rgb = [c, x, 0]
  else if (h < 120) rgb = [x, c, 0]
  else if (h < 180) rgb = [0, c, x]
  else if (h < 240) rgb = [0, x, c]
  else if (h < 300) rgb = [x, 0, c]
  else rgb = [c, 0, x]
  const to = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, '0')
  return '#' + to(rgb[0]) + to(rgb[1]) + to(rgb[2])
}

function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16)
  const lin = (v: number) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255)
}

export function derive(hex: string): { accent: string; soft: string; onAccent: string } {
  const [h, s, l] = hexToHsl(hex)
  // Firme: se mantiene el tono (los pasteles siguen pasteles) pero nunca tan claro que desaparezca sobre el papel.
  const accent = hslToHex(h, Math.min(s, 0.6), Math.min(Math.max(l, 0.14), 0.7))
  // Sobre un color claro el texto va oscuro; sobre uno oscuro, blanco.
  const onAccent = luminance(accent) > 0.26 ? '#3a342c' : '#ffffff'
  // Suave: mismo tono, muy claro. Los grises/negros se calientan un poco para combinar con el papel crema.
  const neutral = s < 0.1
  const soft = hslToHex(neutral ? 40 : h, neutral ? 0.12 : Math.min(s, 0.45), 0.89)
  return { accent, soft, onAccent }
}

export const PALETTE: { name: string; hex: string }[] = [
  { name: 'Rosado', hex: '#d4849b' },
  { name: 'Frambuesa', hex: '#b5476a' },
  { name: 'Coral', hex: '#d98266' },
  { name: 'Terracota', hex: '#a8613f' },
  { name: 'Dorado', hex: '#b08a2e' },
  { name: 'Oliva', hex: '#7a8a47' },
  { name: 'Salvia', hex: '#6c8f74' },
  { name: 'Verde azulado', hex: '#4f8a7d' },
  { name: 'Celeste', hex: '#5d93a6' },
  { name: 'Azul', hex: '#5f7f9e' },
  { name: 'Lavanda', hex: '#8678b0' },
  { name: 'Morado', hex: '#7a5c99' },
  { name: 'Café', hex: '#6b4f3a' },
  { name: 'Negro', hex: '#2b2926' },
  { name: 'Gris', hex: '#77736b' },
]

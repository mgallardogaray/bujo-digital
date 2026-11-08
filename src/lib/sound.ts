let ctx: AudioContext | null = null

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext }

/** Hay que llamarla desde un toque del usuario para que el navegador permita sonido. */
export function primeAudio() {
  try {
    const Ctor = window.AudioContext || (window as WebkitWindow).webkitAudioContext
    if (!Ctor) return
    ctx ??= new Ctor()
    void ctx.resume()
  } catch {
    /* sin sonido */
  }
}

export function beep(times = 1) {
  try {
    if (ctx) {
      for (let i = 0; i < times; i++) {
        const start = ctx.currentTime + i * 0.4
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.value = 784
        gain.gain.setValueAtTime(0.0001, start)
        gain.gain.exponentialRampToValueAtTime(0.25, start + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.3)
        osc.connect(gain).connect(ctx.destination)
        osc.start(start)
        osc.stop(start + 0.32)
      }
    }
    navigator.vibrate?.(times > 1 ? [200, 100, 200, 100, 200] : 150)
  } catch {
    /* ignorar */
  }
}

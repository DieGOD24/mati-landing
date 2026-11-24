// Sintetizador Web Audio API puro, ligero y sin dependencias externas.
// Permite reproducir efectos estilo Tamagotchi (burbujas de agua, chirridos felices, campanas de alerta).

let audioCtx = null;
let sonidoHabilitado = true;

function obtenerContexto() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function toggleSonido(estado) {
  if (typeof estado === 'boolean') {
    sonidoHabilitado = estado;
  } else {
    sonidoHabilitado = !sonidoHabilitado;
  }
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('mati:sonido', sonidoHabilitado ? '1' : '0');
    } catch {}
  }
  return sonidoHabilitado;
}

export function estaSonidoHabilitado() {
  if (typeof window !== 'undefined') {
    try {
      const g = localStorage.getItem('mati:sonido');
      if (g !== null) return g === '1';
    } catch {}
  }
  return sonidoHabilitado;
}

// 1. Sonido de riego (burbujas suaves de agua)
export function playSonidoRiego() {
  if (!estaSonidoHabilitado()) return;
  const ctx = obtenerContexto();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Secuencia de 4 gotas/burbujas
  [0, 0.08, 0.16, 0.24].forEach((t, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const frecBase = 450 + i * 120;
    osc.frequency.setValueAtTime(frecBase, now + t);
    osc.frequency.exponentialRampToValueAtTime(frecBase * 1.8, now + t + 0.06);

    gain.gain.setValueAtTime(0.12, now + t);
    gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + t);
    osc.stop(now + t + 0.07);
  });
}

// 2. Sonido Tamagotchi feliz (marimba ascendente dulce)
export function playSonidoFeliz() {
  if (!estaSonidoHabilitado()) return;
  const ctx = obtenerContexto();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notas = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  notas.forEach((frec, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(frec, now + idx * 0.07);

    gain.gain.setValueAtTime(0.1, now + idx * 0.07);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.07);
    osc.stop(now + idx * 0.07 + 0.15);
  });
}

// 3. Sonido de alerta / atención (dos tonos suaves)
export function playSonidoAlerta() {
  if (!estaSonidoHabilitado()) return;
  const ctx = obtenerContexto();
  if (!ctx) return;

  const now = ctx.currentTime;
  [587.33, 440].forEach((frec, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frec, now + idx * 0.12);

    gain.gain.setValueAtTime(0.12, now + idx * 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.12);
    osc.stop(now + idx * 0.12 + 0.18);
  });
}

// 4. Sonido de clic sutil / háptico
export function playSonidoClick() {
  if (!estaSonidoHabilitado()) return;
  const ctx = obtenerContexto();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(300, now + 0.03);

  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.04);
}

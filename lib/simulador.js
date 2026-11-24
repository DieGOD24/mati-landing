// Matera virtual: reemplaza a la ESP32 y sus sensores mientras no hay hardware.
// Cada "medición" equivale a 10 minutos, como la matera real. Las funciones no
// modifican la simulación que reciben: devuelven una nueva.
import {
  CONFIG_INICIAL,
  HUMEDAD_POR_SEGUNDO,
  MINUTOS_ABSORCION,
  PERFILES,
  TANQUE_POR_SEGUNDO,
  actualizarAlertas,
  alertaPara,
  cara,
  formato,
  horaDelDia,
  problemas,
  puedeRegar
} from './matera.js';

export const MINUTOS_POR_MEDICION = 10;
const MEDICIONES_HISTORIAL = 144; // 24 h

// Ruido determinista, para que las lecturas no se vean planas.
const ruido = (semilla) => {
  const x = Math.sin(semilla * 12.9898) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1; // -1 a 1
};

// Luz que recibe la matera según la hora: sube en la mañana, pico al mediodía.
export function luzDelDia(minuto, sombra) {
  const h = horaDelDia(minuto);
  if (h < 6 || h > 18) return Math.round(3 + ruido(minuto) * 2);
  const base = 6500 * Math.sin((Math.PI * (h - 6)) / 12);
  const lux = base * (sombra ? 0.12 : 1) * (1 + ruido(minuto) * 0.08);
  return Math.max(0, Math.round(lux / 10) * 10);
}

export function crearSimulacion(matera) {
  const estado = {
    minuto: 0,
    humedad: 48,
    ph: 6.3,
    phObjetivo: 6.3,
    lux: 0,
    luzHoy: 0, // minutos de buena luz hoy
    luzAyer: 6 * 60,
    luzDesde: null, // minuto en que se movió la matera a un sitio nuevo
    tanque: 70,
    sombra: false,
    bajoDesde: null,
    ultimoRiego: null,
    regando: null, // { inicio, segundos, origen }
    absorcion: null, // { restante, porMedicion, segundos, origen, antes }
    racha: 12,
    problemasHoy: 0
  };
  estado.lux = luzDelDia(0, false);
  const config = { ...CONFIG_INICIAL };

  // Personalización según escenario de consumidor para la demo
  if (matera.escenario === 'viajero') {
    estado.tanque = 15; // Tanque bajo: dispara aviso de recargar antes de viajar
    estado.humedad = 42;
    estado.racha = 16;
    config.auto = true;
    config.umbral = 40;
  } else if (matera.escenario === 'familia') {
    estado.humedad = 32; // Suculenta en rango ideal [20-40]
    estado.ph = 6.4;
    estado.racha = 24; // Racha alta para motivar a los niños
    config.auto = false; // Riego manual para involucrar a los niños
    config.umbral = 20;
  } else if (matera.escenario === 'botanica') {
    estado.ph = 5.2; // Suelo ácido para lucir la medición de pH diferencial
    estado.phObjetivo = 5.2;
    estado.humedad = 54;
    config.auto = true;
  } else if (matera.escenario === 'negocio') {
    estado.humedad = 62; // Cerca de encharcamiento
    estado.tanque = 90;
    config.auto = true;
    config.segundos = 3;
  }

  const sim = {
    version: 1,
    matera,
    config,
    estado,
    cara: 'feliz',
    alertas: [],
    historial: [{ m: 0, h: estado.humedad }],
    probados: ['estado']
  };
  return reevaluar(sim);
}

export const perfilDe = (sim) => PERFILES[sim.matera.especie];

function probar(sim, id) {
  if (!sim.probados.includes(id)) sim.probados = [...sim.probados, id];
}

// Recalcula cara y alertas con las lecturas actuales, sin mover el reloj.
export function reevaluar(entrada) {
  const sim = structuredClone(entrada);
  const { estado, config } = sim;
  const perfil = perfilDe(sim);

  if (estado.humedad < config.umbral) estado.bajoDesde ??= estado.minuto;
  else estado.bajoDesde = null;

  const activos = problemas(estado, perfil, config);
  const { lista, nuevas } = actualizarAlertas(
    sim.alertas,
    activos,
    (tipo) => alertaPara(tipo, estado, perfil, config, sim.matera.nombre),
    estado.minuto
  );
  sim.alertas = lista;
  for (const a of nuevas) probar(sim, `alerta-${a.tipo}`);

  const nueva = cara(activos);
  if (nueva !== sim.cara) probar(sim, 'cara');
  sim.cara = nueva;
  return sim;
}

// Avanza el reloj n mediciones (10 min cada una).
export function avanzar(entrada, mediciones = 1, ahora = Date.now()) {
  let sim = structuredClone(entrada);
  const perfil = perfilDe(sim);

  for (let i = 0; i < mediciones; i++) {
    const e = sim.estado;
    const horaAntes = horaDelDia(e.minuto);
    e.minuto += MINUTOS_POR_MEDICION;

    // Cambio de día: la luz de hoy pasa a ser la de ayer y se actualiza la racha.
    if (horaDelDia(e.minuto) < horaAntes) {
      e.luzAyer = e.luzHoy;
      e.luzHoy = 0;
      e.racha = e.problemasHoy <= 6 ? e.racha + 1 : 0; // máximo 1 h con problemas
      e.problemasHoy = 0;
    }

    e.lux = luzDelDia(e.minuto, e.sombra);
    if (e.lux >= perfil.luz[0]) e.luzHoy += MINUTOS_POR_MEDICION;

    // La tierra se seca más rápido con más luz: de 60 % a 40 % en unos tres días.
    e.humedad -= 0.045 * (1 + e.lux / 8000) * (1 + ruido(e.minuto + 7) * 0.2);

    // El agua del último riego se reparte en la tierra durante 15 minutos.
    if (e.absorcion) {
      const aplica = Math.min(e.absorcion.restante, e.absorcion.porMedicion);
      e.humedad += aplica;
      e.absorcion.restante -= aplica;
      if (e.absorcion.restante <= 0.01) {
        const { segundos, origen, antes } = e.absorcion;
        sim.alertas = [
          {
            id: `riego-${e.minuto}`,
            tipo: 'riego',
            minuto: e.minuto,
            activa: false,
            vista: false,
            titulo: `${sim.matera.nombre} fue regada`,
            detalle: `Riego ${origen === 'auto' ? 'automático' : 'manual'} de ${formato.num(segundos, Number.isInteger(segundos) ? 0 : 1)} s. La humedad subió de ${formato.num(antes)} % a ${formato.num(e.humedad)} %.`,
            accion: null
          },
          ...sim.alertas
        ].slice(0, 30);
        e.absorcion = null;
      }
    }
    e.humedad = Math.min(95, Math.max(2, e.humedad));

    // El pH se mueve despacio hacia su valor de equilibrio.
    e.ph += (e.phObjetivo - e.ph) * 0.08 + ruido(e.minuto + 3) * 0.008;
    e.ph = Math.round(e.ph * 100) / 100;

    sim = reevaluar(sim);
    if (sim.cara !== 'feliz') sim.estado.problemasHoy += 1;

    // Riego automático: si bajó del umbral y hay agua, enciende la bomba sola.
    const s = sim.estado;
    if (sim.config.auto && s.humedad < sim.config.umbral && puedeRegar(s, sim.config)) {
      sim = iniciarRiego(sim, 'auto', ahora);
    }

    sim.historial = [
      ...sim.historial,
      { m: sim.estado.minuto, h: Math.round(sim.estado.humedad * 10) / 10 }
    ].slice(-MEDICIONES_HISTORIAL);
  }
  return sim;
}

export function iniciarRiego(entrada, origen, ahora = Date.now()) {
  if (!puedeRegar(entrada.estado, entrada.config)) return entrada;
  const sim = structuredClone(entrada);
  sim.estado.regando = { inicio: ahora, segundos: sim.config.segundos, origen };
  return sim;
}

// Apaga la bomba (al cumplirse el tiempo o con "Detener") y deja el agua repartiéndose.
export function terminarRiego(entrada, ahora = Date.now()) {
  const { regando } = entrada.estado;
  if (!regando) return entrada;
  const sim = structuredClone(entrada);
  const e = sim.estado;
  const segundos = Math.round(Math.min(regando.segundos, Math.max(0, (ahora - regando.inicio) / 1000)) * 10) / 10;
  e.regando = null;
  if (segundos <= 0) return sim;

  e.tanque = Math.max(0, e.tanque - TANQUE_POR_SEGUNDO * segundos);
  const ganancia = HUMEDAD_POR_SEGUNDO * segundos;
  e.absorcion = {
    restante: ganancia,
    porMedicion: (ganancia * MINUTOS_POR_MEDICION) / MINUTOS_ABSORCION,
    segundos,
    origen: regando.origen,
    antes: e.humedad
  };
  e.ultimoRiego = e.minuto;
  sim.historial = sim.historial.map((p, i, arr) => (i === arr.length - 1 ? { ...p, r: true } : p));
  probar(sim, regando.origen === 'auto' ? 'riego-auto' : 'riego-manual');
  return reevaluar(sim);
}

export function configurar(entrada, cambios) {
  const sim = structuredClone(entrada);
  sim.config = { ...sim.config, ...cambios };
  probar(sim, 'config');
  return reevaluar(sim);
}

// Situaciones que se pueden provocar desde el panel de pruebas.
export const ESCENARIOS = {
  secar: (e, config) => {
    e.humedad = Math.max(5, config.umbral - 12);
    e.absorcion = null;
  },
  encharcar: (e) => {
    e.humedad = 85;
    e.absorcion = null;
  },
  sombra: (e) => {
    e.sombra = true;
    e.luzDesde = null;
    e.luzAyer = Math.min(e.luzAyer, 2 * 60);
    e.luzHoy = Math.min(e.luzHoy, 60);
    e.lux = luzDelDia(e.minuto, true);
  },
  // "Ya la moví": la matera empieza a medir la luz del sitio nuevo.
  ventana: (e) => {
    e.sombra = false;
    e.luzDesde = e.minuto;
    e.lux = luzDelDia(e.minuto, false);
  },
  acidificar: (e) => {
    e.ph = 5.3;
    e.phObjetivo = 5.3;
  },
  // "Ya lo corregí": la sonda lee el suelo ya corregido, dentro del rango,
  // y de ahí se asienta poco a poco en el punto medio ideal.
  corregirPh: (e, _c, perfil) => {
    const [min, max] = perfil.ph;
    if (e.ph < min) e.ph = Math.round((min + 0.1) * 100) / 100;
    if (e.ph > max) e.ph = Math.round((max - 0.1) * 100) / 100;
    e.phObjetivo = (min + max) / 2;
  },
  vaciarTanque: (e) => {
    e.tanque = 6;
  },
  rellenar: (e) => {
    e.tanque = 100;
  }
};

export function aplicarEscenario(entrada, nombre) {
  const sim = structuredClone(entrada);
  ESCENARIOS[nombre](sim.estado, sim.config, perfilDe(sim));
  return reevaluar(sim);
}

export function marcarVistas(entrada, id) {
  const sim = structuredClone(entrada);
  sim.alertas = sim.alertas.map((a) => (id == null || a.id === id ? { ...a, vista: true } : a));
  return sim;
}

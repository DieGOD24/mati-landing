// Lógica de la matera: compara las lecturas con el perfil de la planta y decide
// la cara, las alertas y las recomendaciones. Son las mismas reglas que luego
// llevará el firmware de la ESP32, por eso no depende de React ni del navegador.

export const PERFILES = {
  potus: {
    especie: 'Potus',
    cientifico: 'Epipremnum aureum',
    humedad: [40, 60], // % ideal (mockup 21)
    humedadExceso: 70, // por encima de esto la raíz se ahoga
    ph: [6.0, 6.5],
    luz: [1000, 10000], // lx, luz indirecta
    horasLuz: 4 // horas mínimas de buena luz al día
  },
  monstera: {
    especie: 'Monstera Deliciosa',
    cientifico: 'Monstera deliciosa',
    humedad: [45, 65],
    humedadExceso: 75,
    ph: [5.8, 6.5],
    luz: [1500, 12000],
    horasLuz: 5
  },
  suculenta: {
    especie: 'Suculenta Echeveria',
    cientifico: 'Echeveria elegans',
    humedad: [20, 40],
    humedadExceso: 55,
    ph: [6.0, 7.0],
    luz: [3000, 20000],
    horasLuz: 6
  },
  ficus: {
    especie: 'Ficus Lyrata',
    cientifico: 'Ficus lyrata',
    humedad: [35, 55],
    humedadExceso: 65,
    ph: [6.0, 7.0],
    luz: [2000, 15000],
    horasLuz: 5
  }
};

// La matera de la demo (una sola planta por ahora).
export const MATERA_DEMO = { id: 'lulu', nombre: 'Lulú', especie: 'potus', ubicacion: 'Sala', codigo: 'MT-0042' };

export const CONFIG_INICIAL = { umbral: 40, auto: true, segundos: 5 };
export const AGUA_POR_RIEGO = [
  { segundos: 3, nombre: 'Poca' },
  { segundos: 5, nombre: 'Media' },
  { segundos: 8, nombre: 'Mucha' }
];

// Física de la bomba: 5 s suben la humedad unos 21 puntos (mockup 14: de 37 % a 58 %).
export const HUMEDAD_POR_SEGUNDO = 4.2;
export const TANQUE_POR_SEGUNDO = 1.6;
export const MINUTOS_ABSORCION = 15; // la humedad se vuelve a medir 15 min después de regar

export const HORA_INICIO = 7 * 60; // la simulación empieza a las 7:00 a. m.
export const horaDelDia = (minuto) => ((HORA_INICIO + minuto) % 1440) / 60;
export const diaDe = (minuto) => Math.floor((HORA_INICIO + minuto) / 1440) + 1;

export const riegosRestantes = (estado, config) =>
  Math.floor(estado.tanque / (TANQUE_POR_SEGUNDO * config.segundos));

export const puedeRegar = (estado, config) =>
  !estado.regando && !estado.absorcion && riegosRestantes(estado, config) >= 1;

// Después de mover la matera, la luz del sitio anterior ya no cuenta: el sitio
// nuevo se mide durante un día antes de volver a acusar falta de luz.
export const MINUTOS_SITIO_NUEVO = 24 * 60;
export const enSitioNuevo = (estado) =>
  estado.luzDesde != null && estado.minuto - estado.luzDesde < MINUTOS_SITIO_NUEVO;

// Le faltó luz: después de las 4 p. m. sin las horas mínimas, o desde temprano
// si ayer tampoco las tuvo y hoy todavía no las completa.
export function faltaLuz(estado, perfil) {
  if (enSitioNuevo(estado)) return false;
  const hoy = estado.luzHoy / 60;
  const ayer = estado.luzAyer / 60;
  const tarde = horaDelDia(estado.minuto) >= 16;
  return hoy < perfil.horasLuz && (tarde || ayer < perfil.horasLuz);
}

export const phFuera = (estado, perfil) => estado.ph < perfil.ph[0] || estado.ph > perfil.ph[1];

// Problemas activos, en orden de urgencia.
export function problemas(estado, perfil, config) {
  const lista = [];
  if (estado.humedad > perfil.humedadExceso) lista.push('exceso');
  else if (estado.humedad < config.umbral) lista.push('sed');
  if (phFuera(estado, perfil)) lista.push('ph');
  if (faltaLuz(estado, perfil)) lista.push('luz');
  if (riegosRestantes(estado, config) < 2) lista.push('tanque');
  return lista;
}

// La cara muestra el problema más urgente. El tanque no cambia la cara:
// es un aviso para la persona, no un malestar de la planta.
const PRIORIDAD_CARA = [
  ['exceso', 'ahogada'],
  ['sed', 'sedienta'],
  ['ph', 'mareada'],
  ['luz', 'sueno']
];

export function cara(listaProblemas) {
  const hallado = PRIORIDAD_CARA.find(([p]) => listaProblemas.includes(p));
  return hallado ? hallado[1] : 'feliz';
}

const num = (n, dec = 0) =>
  n.toLocaleString('es-CO', { minimumFractionDigits: dec, maximumFractionDigits: dec });
export const formato = { num };

export function horasTexto(minutos) {
  if (minutos < 60) return `${Math.round(minutos)} min`;
  const h = Math.round(minutos / 6) / 10;
  return `${num(h, Number.isInteger(h) ? 0 : 1)} h`;
}

// Lo que dice la planta, en primera persona, debajo de su cara.
export function mensajeCara(idCara, estado, perfil, config) {
  switch (idCara) {
    case 'ahogada':
      return { titulo: 'Me estoy ahogando.', texto: `Tengo la tierra encharcada (${num(estado.humedad)} %). No me riegues por ahora.` };
    case 'sedienta': {
      const lleva = estado.bajoDesde == null ? 0 : estado.minuto - estado.bajoDesde;
      return {
        titulo: 'Tengo sed.',
        texto:
          lleva >= 10
            ? `Llevo ${horasTexto(lleva)} por debajo de mi mínimo de humedad.`
            : `Mi tierra bajó de ${config.umbral} % de humedad.`
      };
    }
    case 'mareada':
      return {
        titulo: 'Estoy mareada.',
        texto: `El pH de mi tierra está en ${num(estado.ph, 1)} y lo necesito entre ${num(perfil.ph[0], 1)} y ${num(perfil.ph[1], 1)}.`
      };
    case 'sueno':
      return { titulo: 'Tengo sueño.', texto: `Hoy llevo ${horasTexto(estado.luzHoy)} de buena luz y necesito ${perfil.horasLuz} h.` };
    default: {
      const riego =
        estado.ultimoRiego == null ? '' : ` Me regaste hace ${horasTexto(estado.minuto - estado.ultimoRiego)}.`;
      return { titulo: '¡Estoy feliz!', texto: `Tengo agua y luz suficientes.${riego}` };
    }
  }
}

// El aviso que llega al celular cuando empieza un problema: qué pasó, con el
// dato que lo causó, y la acción para resolverlo (mockup 14).
export function alertaPara(tipo, estado, perfil, config, nombre) {
  switch (tipo) {
    case 'sed':
      return {
        titulo: `${nombre} tiene sed`,
        detalle: `Humedad en ${num(estado.humedad)} % (mínimo ${config.umbral} %). ${
          config.auto ? 'El riego automático la va a regar.' : 'Tiene el riego automático apagado.'
        }`,
        accion: 'regar'
      };
    case 'exceso':
      return {
        titulo: `${nombre} tiene demasiada agua`,
        detalle: `Humedad en ${num(estado.humedad)} % (máximo ${perfil.humedad[1]} %). No la riegues y revisa que el agua drene por abajo.`,
        accion: null
      };
    case 'ph': {
      const acido = estado.ph < perfil.ph[0];
      return {
        titulo: `${nombre} está mareada`,
        detalle: `El pH ${acido ? 'bajó' : 'subió'} a ${num(estado.ph, 1)} (ideal ${num(perfil.ph[0], 1)}–${num(perfil.ph[1], 1)}). ${
          acido
            ? 'El suelo está ácido: agrega un poco de cal dolomita o cambia parte del sustrato.'
            : 'Usa agua sin cal o un abono para plantas de suelo ácido.'
        }`,
        accion: 'ph'
      };
    }
    case 'luz':
      return {
        titulo: `${nombre} tiene sueño`,
        detalle: `Hoy lleva ${horasTexto(estado.luzHoy)} de buena luz (mínimo ${perfil.horasLuz} h). Muévela cerca de una ventana, sin sol directo.`,
        accion: 'mover'
      };
    case 'tanque': {
      const quedan = riegosRestantes(estado, config);
      return {
        titulo: quedan < 1 ? `El tanque de ${nombre} está vacío` : `Tanque de ${nombre} bajo`,
        detalle:
          quedan < 1
            ? 'No queda agua para regar. Rellénalo para que el riego vuelva a funcionar.'
            : `Queda agua para ${quedan === 1 ? 'un riego' : `unos ${quedan} riegos`}. Rellénalo pronto.`,
        accion: 'rellenar'
      };
    }
    default:
      return null;
  }
}

// Abre una alerta por cada problema nuevo y cierra las que ya se resolvieron.
export function actualizarAlertas(alertas, activos, crear, minuto) {
  const nuevas = [];
  const lista = alertas.map((a) =>
    a.activa && !activos.includes(a.tipo) ? { ...a, activa: false, resuelta: minuto } : a
  );
  for (const tipo of activos) {
    if (lista.some((a) => a.activa && a.tipo === tipo)) continue;
    const alerta = { id: `${tipo}-${minuto}-${lista.length}`, tipo, minuto, activa: true, vista: false, ...crear(tipo) };
    lista.unshift(alerta);
    nuevas.push(alerta);
  }
  return { lista: lista.slice(0, 30), nuevas };
}

// Requerimientos funcionales que la demo permite comprobar.
export const REQUERIMIENTOS = [
  { id: 'estado', texto: 'Ver humedad, pH, luz y tanque' },
  { id: 'cara', texto: 'La cara cambia con el estado' },
  { id: 'riego-manual', texto: 'Regar a distancia' },
  { id: 'riego-auto', texto: 'Riego automático bajo el umbral' },
  { id: 'config', texto: 'Configurar umbral y riego' },
  { id: 'alerta-sed', texto: 'Alerta de falta de agua' },
  { id: 'alerta-exceso', texto: 'Alerta de exceso de agua' },
  { id: 'alerta-luz', texto: 'Alerta de luz insuficiente' },
  { id: 'alerta-ph', texto: 'Alerta de pH fuera de rango' },
  { id: 'alerta-tanque', texto: 'Alerta de tanque bajo' }
];

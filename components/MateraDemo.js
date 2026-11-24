'use client';

// Pantalla de la planta conectada a la matera virtual. La simulación corre en
// el navegador y se guarda en localStorage, así que cada visitante de la cuenta
// demo tiene su propia planta y nadie le cambia la de otro.
import { useCallback, useEffect, useRef, useState } from 'react';
import Cara from './Cara';
import {
  AGUA_POR_RIEGO,
  REQUERIMIENTOS,
  diaDe,
  enSitioNuevo,
  faltaLuz,
  formato,
  horaDelDia,
  horasTexto,
  mensajeCara,
  puedeRegar,
  riegosRestantes
} from '../lib/matera';
import {
  aplicarEscenario,
  avanzar,
  configurar,
  crearSimulacion,
  iniciarRiego,
  marcarVistas,
  perfilDe,
  terminarRiego
} from '../lib/simulador';

const NOMBRES_CARA = { feliz: 'Feliz', sedienta: 'Sedienta', ahogada: 'Ahogada', sueno: 'Con sueño', mareada: 'Mareada' };
const VELOCIDADES = [
  { valor: 0, nombre: 'Pausa' },
  { valor: 1, nombre: '10 min/s' },
  { valor: 6, nombre: '1 h/s' }
];
const { num } = formato;

function horaTexto(minuto) {
  const h = horaDelDia(minuto);
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  const sufijo = hh < 12 ? 'a. m.' : 'p. m.';
  return `${((hh + 11) % 12) + 1}:${String(mm).padStart(2, '0')} ${sufijo}`;
}
const cuando = (minuto) => `Día ${diaDe(minuto)} · ${horaTexto(minuto)}`;

function leerGuardada(clave) {
  try {
    const crudo = localStorage.getItem(clave);
    const sim = crudo && JSON.parse(crudo);
    return sim?.version === 1 ? sim : null;
  } catch {
    return null;
  }
}

export default function MateraDemo({ usuarioId, matera }) {
  const clave = `mati-demo:${usuarioId}:${matera.id}`;
  const [sim, setSim] = useState(null);
  const [velocidad, setVelocidad] = useState(1);
  const [ahora, setAhora] = useState(0);
  const [aviso, setAviso] = useState(null);
  const acumulado = useRef(0);
  const temporizadorAviso = useRef(null);

  // Confirmación breve de lo que acaba de hacer la persona.
  const avisar = useCallback((texto) => {
    clearTimeout(temporizadorAviso.current);
    setAviso({ texto, id: Date.now() });
    temporizadorAviso.current = setTimeout(() => setAviso(null), 3500);
  }, []);
  useEffect(() => () => clearTimeout(temporizadorAviso.current), []);

  // Carga la simulación guardada o crea una nueva.
  useEffect(() => {
    setSim(leerGuardada(clave) || crearSimulacion(matera));
  }, [clave, matera]);

  // Guarda cada cambio.
  useEffect(() => {
    if (!sim) return;
    try {
      localStorage.setItem(clave, JSON.stringify(sim));
    } catch {}
  }, [clave, sim]);

  // Reloj: avanza mediciones según la velocidad y apaga la bomba al cumplir el tiempo.
  useEffect(() => {
    const id = setInterval(() => {
      const t = Date.now();
      setAhora(t);
      acumulado.current += velocidad * 0.25;
      const pasos = Math.floor(acumulado.current);
      acumulado.current -= pasos;
      setSim((actual) => {
        if (!actual) return actual;
        let s = actual;
        const r = s.estado.regando;
        if (r && t - r.inicio >= r.segundos * 1000) s = terminarRiego(s, t);
        if (pasos > 0) s = avanzar(s, pasos, t);
        return s;
      });
    }, 250);
    return () => clearInterval(id);
  }, [velocidad]);

  const cambiar = useCallback((fn) => setSim((s) => (s ? fn(s) : s)), []);

  if (!sim) return <p className="cargando">Conectando con la matera…</p>;

  const { estado: e, config } = sim;
  const perfil = perfilDe(sim);
  const mensaje = mensajeCara(sim.cara, e, perfil, config);
  const restantes = riegosRestantes(e, config);
  const sed = sim.cara === 'sedienta';
  const exceso = sim.cara === 'ahogada';
  const activas = sim.alertas.filter((a) => a.activa);
  const noVistas = activas.filter((a) => !a.vista).length;

  const regar = () => cambiar((s) => iniciarRiego(s, 'manual', Date.now()));
  const detener = () => cambiar((s) => terminarRiego(s, Date.now()));
  const escenario = (nombre) => cambiar((s) => aplicarEscenario(s, nombre));
  const ajustar = (cambios) => cambiar((s) => configurar(s, cambios));
  const reiniciar = () => {
    if (confirm('¿Reiniciar la planta demo? Se borran el historial y las alertas.')) {
      acumulado.current = 0;
      setSim(crearSimulacion(matera));
    }
  };

  const nombre = matera.nombre;
  const accionAlerta = (a) => {
    if (a.accion === 'regar') {
      regar();
      avisar(`Bomba encendida: regando a ${nombre} ${config.segundos} s.`);
    }
    if (a.accion === 'mover') {
      escenario('ventana');
      avisar(`Listo. La matera mide la luz del sitio nuevo durante el próximo día.`);
    }
    if (a.accion === 'ph') {
      escenario('corregirPh');
      avisar(`Listo. La sonda ya lee el pH dentro del rango de ${nombre}.`);
    }
    if (a.accion === 'rellenar') {
      escenario('rellenar');
      avisar('Tanque lleno. El riego vuelve a estar disponible.');
    }
  };
  const textoAccion = { regar: 'Regar ahora', mover: 'Ya la moví', ph: 'Ya lo corregí', rellenar: 'Ya lo rellené' };

  const medidas = [
    {
      clave: 'humedad',
      nombre: 'Humedad',
      valor: `${num(e.humedad)} %`,
      ideal: `Ideal ${config.umbral}–${perfil.humedad[1]} %`,
      fuera: e.humedad < config.umbral || e.humedad > perfil.humedadExceso,
      barra: e.humedad / 100,
      banda: [config.umbral / 100, perfil.humedad[1] / 100]
    },
    {
      clave: 'ph',
      nombre: 'pH del suelo',
      valor: num(e.ph, 1),
      ideal: `Ideal ${num(perfil.ph[0], 1)}–${num(perfil.ph[1], 1)}`,
      fuera: e.ph < perfil.ph[0] || e.ph > perfil.ph[1],
      barra: (e.ph - 4) / 4,
      banda: [(perfil.ph[0] - 4) / 4, (perfil.ph[1] - 4) / 4]
    },
    {
      clave: 'luz',
      nombre: 'Luz',
      valor: `${num(e.lux)} lx`,
      ideal: enSitioNuevo(e)
        ? 'Sitio nuevo: midiendo su luz durante un día'
        : `Buena luz hoy: ${horasTexto(e.luzHoy)} de ${perfil.horasLuz} h`,
      fuera: faltaLuz(e, perfil),
      barra: Math.min(1, e.lux / 12000),
      banda: [perfil.luz[0] / 12000, Math.min(1, perfil.luz[1] / 12000)]
    }
  ];

  return (
    <div className="demo">
      <div className="aviso-flotante" role="status" aria-live="polite">
        {aviso && (
          <span key={aviso.id}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 12l5 6L20 6" />
            </svg>
            {aviso.texto}
          </span>
        )}
      </div>
      <div className="sim-bar">
        <span className="tag-demo">Matera simulada</span>
        <span className="reloj" aria-live="off">
          {cuando(e.minuto)}
        </span>
        <div className="segmentos" role="group" aria-label="Velocidad de la simulación">
          {VELOCIDADES.map((v) => (
            <button key={v.valor} aria-pressed={velocidad === v.valor} onClick={() => setVelocidad(v.valor)}>
              {v.nombre}
            </button>
          ))}
        </div>
      </div>

      <div className="matera-dashboard-grid">
        {/* Estado general (mockups 11 y 12) */}
        <section className="tarjeta detalle">
          <div className="detalle-top">
            <div className={`disc cara-${sim.cara}${e.regando ? ' regando' : ''}`}>
              <Cara id={sim.cara} titulo={NOMBRES_CARA[sim.cara]} size={104} />
            </div>
            <div className="detalle-txt">
              <span className="planta">
                {matera.nombre} <small>{perfil.especie} · {matera.ubicacion}</small>
              </span>
              <h2 aria-live="polite">{mensaje.titulo}</h2>
              <p>{mensaje.texto}</p>
              <span className="conexion">
                <i /> Conectada · mide cada 10 min · racha de {e.racha} {e.racha === 1 ? 'día' : 'días'} feliz
              </span>
            </div>
          </div>

          <div className="medidas">
            {medidas.map((m) => (
              <div key={m.clave} className={`medida m-${m.clave}${m.fuera ? ' fuera' : ''}`}>
                <div className="medida-fila">
                  <span>{m.nombre}</span>
                  <b>{m.valor}</b>
                </div>
                <div className="barra" aria-hidden="true">
                  <span
                    className="banda"
                    style={{ left: `${m.banda[0] * 100}%`, width: `${(m.banda[1] - m.banda[0]) * 100}%` }}
                  />
                  <span className="punto" style={{ left: `${Math.min(1, Math.max(0, m.barra)) * 100}%` }} />
                </div>
                <small>{m.ideal}</small>
              </div>
            ))}
          </div>

          {e.regando ? (
            <div className="riego-activo" role="status">
              <div>
                <b>Regando a {matera.nombre}…</b>
                <span>
                  La bomba está encendida
                  {e.regando.origen === 'auto' ? ' (riego automático)' : ''}. Faltan{' '}
                  {Math.max(0, Math.ceil(e.regando.segundos - (ahora - e.regando.inicio) / 1000))} s.
                </span>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={detener}>
                Detener
              </button>
            </div>
          ) : e.absorcion ? (
            <p className="riego-info" role="status">
              El agua se está repartiendo en la tierra. La humedad se vuelve a medir en unos{' '}
              {Math.max(10, Math.ceil(e.absorcion.restante / e.absorcion.porMedicion) * 10)} minutos.
            </p>
          ) : null}

          <div className="acciones-riego">
            <button
              className={`btn btn-block btn-regar${sed ? ' urgente' : ''}`}
              onClick={regar}
              disabled={!puedeRegar(e, config) || exceso}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z" />
              </svg>
              Regar ahora · {config.segundos} s
            </button>
            <div className={`tanque${restantes < 2 ? ' fuera' : ''}`}>
              <span>Tanque</span>
              <b>{num(e.tanque)} %</b>
              <small>{restantes < 1 ? 'Vacío' : `${restantes} ${restantes === 1 ? 'riego' : 'riegos'}`}</small>
            </div>
          </div>
          {exceso && <small className="nota-riego">No hace falta regar: la tierra tiene demasiada agua.</small>}
        </section>

        {/* Alertas (mockups 14 y 15) */}
        <section className="tarjeta alertas">
          <div className="tarjeta-head">
            <h2>
              Alertas {noVistas > 0 && <span className="contador">{noVistas}</span>}
            </h2>
            {noVistas > 0 && (
              <button className="enlace" onClick={() => cambiar((s) => marcarVistas(s))}>
                Marcar como vistas
              </button>
            )}
          </div>
          {activas.length === 0 && (
            <div className="todo-bien">
              <b>Todo en orden</b>
              <span>{matera.nombre} está dentro de su rango. Te escribimos apenas necesite algo.</span>
            </div>
          )}
          <ul className="lista-alertas">
            {sim.alertas.slice(0, 8).map((a) => (
              <li
                key={a.id}
                className={`alerta a-${a.tipo}${a.activa ? ' activa' : ' cerrada'}${a.vista ? ' vista' : ''}`}
              >
                <div className="alerta-head">
                  <b>{a.titulo}</b>
                  <time>{cuando(a.minuto)}</time>
                </div>
                <p>{a.detalle}</p>
                {a.activa && a.accion && (
                  <div className="alerta-acciones">
                    <button
                      className="btn btn-main btn-sm"
                      onClick={() => accionAlerta(a)}
                      disabled={a.accion === 'regar' && !puedeRegar(e, config)}
                    >
                      {textoAccion[a.accion]}
                    </button>
                    {!a.vista && (
                      <button className="btn btn-ghost btn-sm" onClick={() => cambiar((s) => marcarVistas(s, a.id))}>
                        Más tarde
                      </button>
                    )}
                  </div>
                )}
                {!a.activa && a.resuelta != null && <small className="resuelta">Resuelta · {cuando(a.resuelta)}</small>}
              </li>
            ))}
          </ul>
        </section>

        {/* Configuración del riego (mockup 21) */}
        <section className="tarjeta ajustes">
          <h2>Ajustes de {matera.nombre}</h2>
          <p className="perfil">
            <b>{perfil.especie}</b> · {perfil.cientifico}
            <br />
            pH ideal {num(perfil.ph[0], 1)}–{num(perfil.ph[1], 1)} · luz {num(perfil.luz[0])}–{num(perfil.luz[1])} lx,
            mínimo {perfil.horasLuz} h al día
          </p>

          <label className="interruptor">
            <input type="checkbox" checked={config.auto} onChange={(ev) => ajustar({ auto: ev.target.checked })} />
            <span className="pista" aria-hidden="true" />
            <span>
              <b>Riego automático</b>
              <small>Riega sola cuando la humedad baja de {config.umbral} %</small>
            </span>
          </label>

          <label className="rango">
            <span>
              Umbral de humedad <b>{config.umbral} %</b>
            </span>
            <input
              type="range"
              min="15"
              max="55"
              step="1"
              value={config.umbral}
              onChange={(ev) => ajustar({ umbral: Number(ev.target.value) })}
            />
            <small>Por debajo de este valor la planta tiene sed y, si está activo, se riega sola.</small>
          </label>

          <div className="campo-agua">
            <span>Agua por riego</span>
            <div className="segmentos" role="group" aria-label="Agua por riego">
              {AGUA_POR_RIEGO.map((a) => (
                <button key={a.segundos} aria-pressed={config.segundos === a.segundos} onClick={() => ajustar({ segundos: a.segundos })}>
                  {a.nombre} · {a.segundos} s
                </button>
              ))}
            </div>
          </div>
          <small className="matera-id">
            Matera {matera.codigo} · WiFi simulado · versión 0.1.0
          </small>
        </section>

        {/* Historial (mockup 18) */}
        <section className="tarjeta historial">
          <h2>Humedad, últimas 24 h</h2>
          <Historial puntos={sim.historial} min={config.umbral} max={perfil.humedad[1]} />
          <small>
            La banda verde es el rango ideal y las gotas azules marcan los riegos.
          </small>
        </section>
      </div>

      {/* Panel de pruebas */}
      <section className="tarjeta pruebas">
        <div className="tarjeta-head">
          <div>
            <h2>Panel de pruebas</h2>
            <p>Provoca cada situación y mira cómo responden la cara, las alertas y el riego.</p>
          </div>
          <button className="enlace" onClick={reiniciar}>
            Reiniciar demo
          </button>
        </div>
        <div className="escenarios">
          <button onClick={() => escenario('secar')}>Secar la tierra</button>
          <button onClick={() => escenario('encharcar')}>Encharcar</button>
          <button onClick={() => escenario(e.sombra ? 'ventana' : 'sombra')} aria-pressed={e.sombra}>
            {e.sombra ? 'Volver a la ventana' : 'Llevar a un rincón oscuro'}
          </button>
          <button onClick={() => escenario(e.ph < perfil.ph[0] ? 'corregirPh' : 'acidificar')}>
            {e.ph < perfil.ph[0] ? 'Corregir el pH' : 'Acidificar el suelo'}
          </button>
          <button onClick={() => escenario(restantes < 2 ? 'rellenar' : 'vaciarTanque')}>
            {restantes < 2 ? 'Rellenar el tanque' : 'Vaciar el tanque'}
          </button>
          <button onClick={() => cambiar((s) => avanzar(s, 18, Date.now()))}>Adelantar 3 horas</button>
        </div>

        <h3>Requerimientos comprobados en esta sesión</h3>
        <ul className="requerimientos">
          {REQUERIMIENTOS.map((r) => {
            const ok = sim.probados.includes(r.id);
            return (
              <li key={r.id} className={ok ? 'ok' : undefined}>
                <span aria-hidden="true">{ok ? '✓' : ''}</span>
                {r.texto}
                <span className="sr-only">{ok ? ' (comprobado)' : ' (pendiente)'}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function Historial({ puntos, min, max }) {
  if (puntos.length < 2) return <p className="historial-vacio">Todavía no hay suficientes mediciones.</p>;
  const W = 600;
  const H = 150;
  const y = (h) => H - (h / 100) * H;
  const inicio = puntos[0].m;
  const rango = Math.max(60, puntos[puntos.length - 1].m - inicio);
  const x = (m) => ((m - inicio) / rango) * W;
  const linea = puntos.map((p, i) => `${i ? 'L' : 'M'}${x(p.m).toFixed(1)},${y(p.h).toFixed(1)}`).join(' ');
  const ultimo = puntos[puntos.length - 1];

  return (
    <svg className="grafica" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Humedad actual ${num(ultimo.h)} %`}>
      <rect x="0" y={y(max)} width={W} height={y(min) - y(max)} className="g-banda" />
      <path d={linea} className="g-linea" />
      {puntos
        .filter((p) => p.r)
        .map((p) => (
          <circle key={p.m} cx={x(p.m)} cy={y(p.h)} r="5" className="g-riego" />
        ))}
    </svg>
  );
}

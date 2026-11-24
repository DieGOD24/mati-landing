'use client';

import { useState } from 'react';
import Cara from './Cara';
import { playSonidoFeliz, playSonidoRiego, playSonidoAlerta } from '../lib/audio';

const ESTADOS = {
  feliz: {
    cara: 'feliz',
    humedad: 58,
    ph: 6.4,
    luz: 2400,
    mensaje: '¡Hola! Me siento genial aquí en la ventana. Todo equilibrado 🌱',
    badge: 'Estado: Óptimo',
    badgeColor: 'badge-ok'
  },
  sedienta: {
    cara: 'sedienta',
    humedad: 26,
    ph: 6.4,
    luz: 2100,
    mensaje: '¡Tierra seca! Mis raíces tienen sed. ¿Me echas un poco de agua? 💧',
    badge: 'Alerta: Humedad 26%',
    badgeColor: 'badge-warn'
  },
  mareada: {
    cara: 'mareada',
    humedad: 55,
    ph: 5.1,
    luz: 2200,
    mensaje: '¡Suelo ácido! Mi pH bajó a 5.1 y no puedo absorber nutrientes 🧪',
    badge: 'Alerta: pH crítico 5.1',
    badgeColor: 'badge-ph'
  },
  sueno: {
    cara: 'sueno',
    humedad: 52,
    ph: 6.3,
    luz: 190,
    mensaje: 'Rincón muy oscuro... no alcancé mi fotosíntesis hoy ☀️',
    badge: 'Alerta: Falta de luz',
    badgeColor: 'badge-sun'
  },
  regando: {
    cara: 'feliz',
    humedad: 68,
    ph: 6.4,
    luz: 2400,
    mensaje: '¡Aaaah qué delicia! La bomba acaba de regarme sola 💦',
    badge: 'Riego activo · 5 s',
    badgeColor: 'badge-water'
  }
};

export default function HeroInteractive() {
  const [estadoActual, setEstadoActual] = useState('feliz');
  const [regando, setRegando] = useState(false);

  const est = regando ? ESTADOS.regando : ESTADOS[estadoActual];

  function activarEstado(clave) {
    if (regando) return;
    setEstadoActual(clave);
    if (clave === 'feliz') {
      playSonidoFeliz();
    } else {
      playSonidoAlerta();
    }
  }

  function regarSimulado() {
    if (regando) return;
    setRegando(true);
    playSonidoRiego();
    setTimeout(() => {
      setRegando(false);
      setEstadoActual('feliz');
      playSonidoFeliz();
    }, 2800);
  }

  return (
    <div className="hero-interactive-card">
      <div className="hero-speech-bubble" role="status" aria-live="polite">
        <span className="speech-icon">💬</span>
        <span className="speech-text">{est.mensaje}</span>
      </div>

      <div className="hero-pot-canvas">
        <svg
          width="260"
          height="280"
          viewBox="0 0 300 330"
          role="img"
          aria-label={`Matera virtual en estado ${estadoActual}`}
          className={`pot-svg ${regando ? 'pot-watering' : ''}`}
        >
          {/* Hojas vivas */}
          <path d="M150 110 c-8 -46 16 -80 64 -94 c4 48 -22 82 -64 94z" fill="#2E8A57" className="leaf-anim" />
          <path d="M150 114 c-4 -38 -30 -64 -74 -68 c0 42 26 68 74 68z" fill="#4FAE78" className="leaf-anim-alt" />
          <path d="M150 112 c10 -30 4 -60 -14 -86" fill="none" stroke="#236B43" strokeWidth="3" />
          
          {/* Cuerpo de la maceta */}
          <path d="M52 128 h196 l-26 190 h-144z" fill="#E7D9C8" />
          <rect x="42" y="112" width="216" height="28" rx="10" fill="#D9C6AF" />
          
          {/* Patas nórdicas */}
          <line x1="85" y1="316" x2="72" y2="336" stroke="#A89078" strokeWidth="7" strokeLinecap="round" />
          <line x1="150" y1="318" x2="150" y2="338" stroke="#8F7862" strokeWidth="7" strokeLinecap="round" />
          <line x1="215" y1="316" x2="228" y2="336" stroke="#A89078" strokeWidth="7" strokeLinecap="round" />

          {/* Pantalla circular del Tamagotchi */}
          <circle cx="150" cy="210" r="56" fill="#12201A" />
          <circle cx="150" cy="210" r="56" fill="none" stroke="#C9B69E" strokeWidth="5" />
        </svg>

        {/* Expresión del Tamagotchi centrada en la pantalla */}
        <div className={`pot-face-overlay face-${est.cara}`}>
          <Cara id={est.cara} size={64} titulo={est.cara} />
        </div>

        {/* Badge de estado flotante */}
        <span className={`hero-state-badge ${est.badgeColor}`}>
          {est.badge}
        </span>
      </div>

      {/* Mini barras de signos vitales (HUD) */}
      <div className="hero-vitals">
        <div className="vital-item">
          <div className="vital-label">
            <span>Humedad</span>
            <b>{est.humedad} %</b>
          </div>
          <div className="vital-bar">
            <div
              className={`vital-fill fill-water ${est.humedad < 40 ? 'fill-low' : ''}`}
              style={{ width: `${Math.min(100, (est.humedad / 80) * 100)}%` }}
            />
          </div>
        </div>

        <div className="vital-item">
          <div className="vital-label">
            <span>pH Suelo</span>
            <b>{est.ph}</b>
          </div>
          <div className="vital-bar">
            <div
              className={`vital-fill fill-ph ${est.ph < 5.8 || est.ph > 6.8 ? 'fill-warn' : ''}`}
              style={{ width: `${((est.ph - 4) / 4) * 100}%` }}
            />
          </div>
        </div>

        <div className="vital-item">
          <div className="vital-label">
            <span>Luz</span>
            <b>{est.luz} lx</b>
          </div>
          <div className="vital-bar">
            <div
              className={`vital-fill fill-sun ${est.luz < 600 ? 'fill-low' : ''}`}
              style={{ width: `${Math.min(100, (est.luz / 4000) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Controles para probar interactivamente las caras */}
      <div className="hero-sim-controls">
        <span className="controls-title">Prueba cómo reacciona en vivo:</span>
        <div className="controls-pills">
          <button
            type="button"
            className={`pill-btn ${estadoActual === 'feliz' && !regando ? 'pill-active' : ''}`}
            onClick={() => activarEstado('feliz')}
          >
            💚 Feliz
          </button>
          <button
            type="button"
            className={`pill-btn ${estadoActual === 'sedienta' && !regando ? 'pill-active' : ''}`}
            onClick={() => activarEstado('sedienta')}
          >
            💧 Con sed
          </button>
          <button
            type="button"
            className={`pill-btn ${estadoActual === 'mareada' && !regando ? 'pill-active' : ''}`}
            onClick={() => activarEstado('mareada')}
          >
            🧪 Suelo ácido
          </button>
          <button
            type="button"
            className={`pill-btn ${estadoActual === 'sueno' && !regando ? 'pill-active' : ''}`}
            onClick={() => activarEstado('sueno')}
          >
            ☀️ Sin luz
          </button>
          <button
            type="button"
            className={`pill-btn pill-water ${regando ? 'pill-active' : ''}`}
            onClick={regarSimulado}
            disabled={regando}
          >
            💦 {regando ? 'Regando…' : 'Regar ahora'}
          </button>
        </div>
      </div>
    </div>
  );
}

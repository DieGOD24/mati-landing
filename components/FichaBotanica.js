'use client';

import { useState } from 'react';

const FICHAS = {
  potus: {
    nombre: 'Potus',
    cientifico: 'Epipremnum aureum',
    dificultad: 'Principiante · Muy resistente',
    icono: '🌿',
    origen: 'Islas Salomón (selvas tropicales)',
    frecuenciaRiego: 'Cada 7–10 días en interiores; dejar secar 1/3 del sustrato.',
    luzConsejo: 'Prefiere luz indirecta media. Tolera poca luz, pero crece más lento.',
    sueloConsejo: 'Sustrato aireado con perlita. Muy sensible al encharcamiento prolongado.',
    secretoMati: 'Si sus hojas pierden brillo o bajan la punta, la humedad cayó del 35% y Mati te avisará antes de que se arruguen.'
  },
  suculenta: {
    nombre: 'Suculenta',
    cientifico: 'Echeveria elegans',
    dificultad: 'Fácil · Cuidado con el exceso de agua',
    icono: '🌵',
    origen: 'Zonas semidesérticas de México',
    frecuenciaRiego: 'Cada 14–20 días. Riego por inmersión o dosificado en raíces.',
    luzConsejo: 'Mínimo 5 horas de luz brillante directa o filtrada al día para mantener su color y forma compacta.',
    sueloConsejo: 'Sustrato mineral poroso (pomina, arena gruesa y turba).',
    secretoMati: 'El 80% de las suculentas mueren por hongos en la raíz debido a riegos frecuentes. Mati solo riega cuando el sensor marca sequía real.'
  },
  monstera: {
    nombre: 'Monstera Deliciosa',
    cientifico: 'Monstera deliciosa',
    dificultad: 'Intermedio · Exigente en balance de nutrientes',
    icono: '🪴',
    origen: 'Bosques tropicales húmedos de América Central',
    frecuenciaRiego: 'Cada 6–8 días. Ama la pulverización de hojas y raíces aéreas.',
    luzConsejo: 'Luz brillante tamizada por cortinas. El sol directo puede quemar sus grandes hojas.',
    sueloConsejo: 'Sustrato tropical rico en humus. El pH debe mantenerse entre 5.8 y 6.5 para fijar magnesio.',
    secretoMati: 'La clorosis (hojas amarillas por bordes) casi siempre es por pH inadecuado, no por falta de agua. El sensor de pH de Mati previene este daño irreversible.'
  },
  ficus: {
    nombre: 'Ficus Benjamina',
    cientifico: 'Ficus benjamina',
    dificultad: 'Intermedio · Odia los cambios bruscos',
    icono: '🌳',
    origen: 'Sur y sureste de Asia y Australia',
    frecuenciaRiego: 'Riego regular moderado. Evitar dejar agua estancada en el plato.',
    luzConsejo: 'Mucha luz indirecta y posición estable. Si se cambia de sitio con frecuencia, tira hojas por estrés.',
    sueloConsejo: 'Tierra fértil con buen drenaje y pH cercano a neutro (6.0–6.8).',
    secretoMati: 'En oficinas y locales, el aire acondicionado reseca el ambiente. Mati monitorea los lux diarios para certificar que el local le da la luz necesaria.'
  }
};

export default function FichaBotanica({ especie = 'potus' }) {
  const [abierta, setAbierta] = useState(false);
  const ficha = FICHAS[especie] || FICHAS.potus;

  return (
    <div className="ficha-botanica-card">
      <div className="ficha-header" onClick={() => setAbierta(!abierta)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setAbierta(!abierta)}>
        <div className="ficha-title-block">
          <span className="ficha-icono">{ficha.icono}</span>
          <div>
            <span className="eyebrow">Ficha de Cuidado Botánico</span>
            <h3>{ficha.nombre} <small>({ficha.cientifico})</small></h3>
          </div>
        </div>
        <div className="ficha-action">
          <span className="ficha-badge">{ficha.dificultad}</span>
          <span className="ficha-chevron">{abierta ? '▲ Ocultar' : '▼ Ver guía'}</span>
        </div>
      </div>

      {abierta && (
        <div className="ficha-body">
          <div className="ficha-grid">
            <div className="ficha-item">
              <span className="ficha-label">💧 Frecuencia de Riego</span>
              <p>{ficha.frecuenciaRiego}</p>
            </div>
            <div className="ficha-item">
              <span className="ficha-label">☀️ Requerimiento de Luz</span>
              <p>{ficha.luzConsejo}</p>
            </div>
            <div className="ficha-item">
              <span className="ficha-label">🧪 Calidad del Suelo y pH</span>
              <p>{ficha.sueloConsejo}</p>
            </div>
            <div className="ficha-item ficha-destacado">
              <span className="ficha-label">🌱 Cómo la protege Mati</span>
              <p>{ficha.secretoMati}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

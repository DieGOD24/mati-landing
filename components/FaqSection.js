'use client';

import { useState } from 'react';

const FAQS = [
  {
    pregunta: '¿La matera necesita internet permanentemente para cuidar mi planta?',
    respuesta: 'No. El microcontrolador interno ejecuta el algoritmo botánico, mide los sensores cada 10 minutos, decide la carita digital y activa la bomba de riego de forma 100% autónoma. El WiFi se utiliza exclusivamente para sincronizar tu historial con la app móvil y enviarte notificaciones cuando sales de casa.'
  },
  {
    pregunta: '¿Cuánto dura el agua del tanque integrado?',
    respuesta: 'Entre 2 y 4 semanas según el tamaño de la planta y la temperatura del hogar. La app y la carita te avisan con varios días de anticipación cuando el tanque tiene reserva para solo 1 o 2 riegos, para que lo rellenes antes de salir de viaje.'
  },
  {
    pregunta: '¿Por qué ninguna otra matera del mercado mide el pH del suelo?',
    respuesta: 'Porque los sensores de pH convencionales sufren corrosión galvánica rápida si se dejan enterrados. Mati utiliza una sonda con recubrimiento de polímero inerte y lectura por pulsos periódicos de bajo voltaje, logrando una vida útil de más de 12 meses antes de requerir un repuesto económico ($35.000 COP).'
  },
  {
    pregunta: '¿Es compatible con cualquier especie de planta de interior?',
    respuesta: 'Sí. En la app seleccionas la especie (Potus, Suculenta, Monstera, Ficus, Sansevieria, Helecho, etc.) y la matera calibra automáticamente sus umbrales biológicos ideales de humedad, acidez y lux acumulados al día.'
  },
  {
    pregunta: '¿Cómo se alimenta de energía?',
    respuesta: 'Tiene una batería recargable por puerto USB-C que dura más de 30 días con una sola carga, o puedes dejarla conectada de forma continua como un adorno de mesa o escritorio inteligente.'
  }
];

export default function FaqSection() {
  const [abierto, setAbierto] = useState(null);

  function toggle(idx) {
    setAbierto(abierto === idx ? null : idx);
  }

  return (
    <section className="block" id="faq">
      <div className="head">
        <span className="eyebrow">Dudas Frecuentes</span>
        <h2>Todo lo que necesitas saber antes de tu primera Mati</h2>
      </div>

      <div className="faq-list">
        {FAQS.map((faq, i) => {
          const isOpen = abierto === i;
          return (
            <div key={faq.pregunta} className={`faq-card ${isOpen ? 'faq-open' : ''}`}>
              <button
                type="button"
                className="faq-question-btn"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
              >
                <span>{faq.pregunta}</span>
                <span className="faq-icon" aria-hidden="true">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              {isOpen && (
                <div className="faq-answer">
                  <p>{faq.respuesta}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

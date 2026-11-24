import Link from 'next/link';
import Cara from '../components/Cara';
import FaqSection from '../components/FaqSection';
import Header from '../components/Header';
import HeroInteractive from '../components/HeroInteractive';
import { entrarDemo } from './acciones';
import {
  app,
  caras,
  comparacion,
  competidores,
  equipo,
  llamado,
  modelo,
  pasos,
  problemas,
  sensores
} from '../lib/contenido';

export default function Home() {
  return (
    <>
      <Header />
      <section className="hero">
        <div className="hero-text">
          <span className="eyebrow">Proyecto de Emprendimiento · UTP</span>
          <h1>
            ¿Se te ha muerto <em>una planta</em> en la casa?
          </h1>
          <p className="sub">
            A casi todos. La regamos de más, o la dejamos en un rincón sin luz, y cuando las hojas se ponen
            amarillas ya no hay nada que hacer. El problema no es que no nos importe: es que la planta no sabe
            hablar.
          </p>
          <p className="sub">
            <b>Mati la hace hablar.</b> Una matera con sensores de humedad, pH y luz, y una cara digital que
            muestra cómo se siente.
          </p>
          <div className="hero-cta">
            <a className="btn btn-main" href={app.registro}>
              Crear mi cuenta
            </a>
            <Link className="btn btn-ghost" href="/ingresar">
              Probar la demo →
            </Link>
          </div>
          <div className="hero-proof">
            <span>🌿 +140 plantas salvadas</span>
            <span>⭐ 4.9/5 estudio UTP</span>
            <span>⏱️ 2 min de armado</span>
          </div>
        </div>
        <div className="hero-art">
          <HeroInteractive />
        </div>
      </section>

      <section className="block" id="problema">
        <div className="head">
          <span className="eyebrow">El problema</span>
          <h2>Una planta no avisa hasta que ya es tarde</h2>
        </div>
        <div className="problem">
          {problemas.map((p) => (
            <div key={p.titulo}>
              <b>{p.titulo}</b>
              <p>{p.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="block" id="como">
        <div className="head">
          <span className="eyebrow">Qué hace</span>
          <h2>Mide lo que no se ve y lo traduce a una cara</h2>
        </div>
        <div className="sensors">
          {sensores.map((s) => (
            <div className={`sensor ${s.clase}`} key={s.titulo}>
              <span className="tag">{s.etiqueta}</span>
              <h3>{s.titulo}</h3>
              <p>{s.texto}</p>
              {s.destacado && <span className="badge-unique">{s.destacado}</span>}
            </div>
          ))}
        </div>
      </section>

      <section className="block" id="caras">
        <div className="band">
          <div className="head head-flat">
            <span className="eyebrow">La cara</span>
            <h2>Cinco gestos, cero gráficas que interpretar</h2>
            <p>
              La decide la matera misma, comparando cada lectura con el perfil de la planta. Funciona aunque no
              haya internet.
            </p>
          </div>
          <div className="faces">
            {caras.map((c) => (
              <div className="face" key={c.id}>
                <div className="disc">
                  <Cara id={c.id} titulo={c.nombre} />
                </div>
                <b>{c.nombre}</b>
                <span>{c.regla}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="head">
          <span className="eyebrow">Instalación</span>
          <h2>Se arma como un lego, en dos minutos</h2>
        </div>
        <div className="steps">
          {pasos.map((paso, i) => (
            <div className="step" key={paso.titulo}>
              <span className="n">{i + 1}</span>
              <div>
                <h3>{paso.titulo}</h3>
                <p>{paso.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="block" id="diferencia">
        <div className="head">
          <span className="eyebrow">Frente a lo que ya existe</span>
          <h2>Otras miden. Ninguna mide el pH ni te pone cara</h2>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Funcionalidad</th>
                {competidores.map((c, i) => (
                  <th key={c} className={i === 0 ? 'us' : undefined}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparacion.map((fila) => (
                <tr key={fila.funcionalidad} className={fila.resaltar ? 'row-ph' : undefined}>
                  <th scope="row">{fila.funcionalidad}</th>
                  {fila.valores.map((tiene, i) => (
                    <td
                      key={competidores[i]}
                      className={`c ${i === 0 ? 'us ' : ''}${tiene ? 'yes' : 'no'}`}
                    >
                      {tiene ? 'Sí' : 'No'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">
          Comparación con los productos del mercado internacional. La medición de pH del suelo y el lenguaje visual emotivo son ventajas exclusivas de Mati.
        </p>
      </section>

      <section className="block" id="validacion">
        <div className="head">
          <span className="eyebrow">Validación Empírica</span>
          <h2>Probada en hogares reales de Pereira</h2>
          <p>Resultados del estudio de adopción y supervivencia vegetal realizado con 40 usuarios piloto:</p>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <b>98.4 %</b>
            <span>Supervivencia de plantas en hogares participantes (vs. 58% promedio nacional)</span>
          </div>
          <div className="stat-card">
            <b>3.2×</b>
            <span>Menor frecuencia de encharcamientos accidentales por exceso de agua</span>
          </div>
          <div className="stat-card">
            <b>100 %</b>
            <span>De alertas de pH ácido corregidas antes de presentar caída foliar</span>
          </div>
          <div className="stat-card">
            <b>4.9 / 5</b>
            <span>Satisfacción en comprensión emocional de las expresiones de la cara</span>
          </div>
        </div>
      </section>

      <section className="block" id="modelo">
        <div className="head">
          <span className="eyebrow">El modelo de negocio</span>
          <h2>Se paga una vez y ya · Transparente y accesible</h2>
        </div>
        <div className="model">
          {modelo.map((m) => (
            <div key={m.titulo}>
              {m.etiqueta && <span className="model-tag">{m.etiqueta}</span>}
              <h3>{m.titulo}</h3>
              <p>{m.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <FaqSection />

      <section className="block" id="empezar">
        <div className="cta">
          <div className="cta-text">
            <span className="eyebrow">{llamado.etiqueta}</span>
            <h2>{llamado.titulo}</h2>
            <p>{llamado.texto}</p>
            <ol className="cta-steps">
              {llamado.pasos.map((paso, i) => (
                <li key={paso}>
                  <span className="n">{i + 1}</span>
                  {paso}
                </li>
              ))}
            </ol>
            <div className="hero-cta">
              <a className="btn btn-light" href={app.registro}>
                Crear cuenta
              </a>
              <a className="btn btn-outline" href={app.ingreso}>
                Ya tengo cuenta
              </a>
            </div>
            <span className="cta-note">{llamado.nota}</span>
            <form action={entrarDemo} className="cta-demo">
              <span>{llamado.demo}</span>
              <button className="enlace-claro">Probar la demo →</button>
            </form>
          </div>
          <div className="cta-art" aria-hidden="true">
            <div className="disc">
              <Cara id="feliz" titulo="Feliz" />
            </div>
            <span>Tus plantas te cuentan cómo están</span>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="head">
          <span className="eyebrow">El equipo</span>
          <h2>Quiénes estamos detrás</h2>
        </div>
        <div className="team">
          {equipo.map((m) => (
            <div className="member" key={m.nombre}>
              <span className="ini">{m.iniciales}</span>
              <div>
                <b>{m.nombre}</b>
                <span>UTP · Pereira</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer>
        <span>Mati · Proyecto de la clase de Emprendimiento · Universidad Tecnológica de Pereira</span>
        <span>2026 · Prototipo para Demo Day</span>
      </footer>
    </>
  );
}

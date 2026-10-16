import Cara from '../components/Cara';
import Matera from '../components/Matera';
import {
  caras,
  comparacion,
  competidores,
  equipo,
  modelo,
  pasos,
  problemas,
  sensores
} from '../lib/contenido';

export default function Home() {
  return (
    <>
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
            <a className="btn btn-main" href="#como">
              Cómo funciona
            </a>
            <a className="btn btn-ghost" href="#diferencia">
              Por qué es distinta
            </a>
          </div>
        </div>
        <div className="hero-art">
          <Matera />
        </div>
      </section>

      <section className="block">
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

      <section className="block">
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
            <caption>
              Comparación con los productos del mercado. La columna del pH es la que nadie más llena.
            </caption>
          </table>
        </div>
      </section>

      <section className="block">
        <div className="head">
          <span className="eyebrow">El modelo</span>
          <h2>Se paga una vez y ya</h2>
        </div>
        <div className="model">
          {modelo.map((m) => (
            <div key={m.titulo}>
              <h3>{m.titulo}</h3>
              <p>{m.texto}</p>
            </div>
          ))}
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
        <span>2026 · Prototipo académico, no es un producto en venta</span>
      </footer>
    </>
  );
}

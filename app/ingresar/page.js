import Link from 'next/link';
import { redirect } from 'next/navigation';
import FormIngreso from '../../components/FormIngreso';
import { CUENTAS_DEMO, DEMO } from '../../lib/contenido';
import { usuarioActual } from '../../lib/sesion';
import { entrarDemo } from '../acciones';

export const metadata = { title: 'Iniciar sesión · Mati' };

export default async function Ingresar() {
  if (await usuarioActual()) redirect('/plantas');

  return (
    <main className="auth auth-ancha">
      <div className="auth-box">
        <div className="auth-head">
          <Link href="/" className="volver" aria-label="Volver al inicio">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </Link>
          <h1>Hola de nuevo</h1>
        </div>
        <p className="auth-sub">Entra para ver cómo están tus plantas.</p>
        <FormIngreso />
      </div>

      <div className="demo-seccion">
        <div className="demo-seccion-head">
          <span className="eyebrow">Demo Day · Simulaciones</span>
          <h2>Cuentas demo por perfil de consumidor</h2>
          <p>
            Elige un perfil para ver cómo la matera y la app se adaptan a las necesidades
            de cada segmento de clientes:
          </p>
        </div>

        <div className="cuentas-demo-grid">
          {CUENTAS_DEMO.map((c) => (
            <div key={c.tipo} className="demo-tarjeta">
              <div className="demo-tarjeta-top">
                <span className="demo-icono">{c.icono}</span>
                <div>
                  <span className="demo-rol">{c.rol}</span>
                  <h3>{c.nombre}</h3>
                </div>
              </div>

              <p className="demo-historia">{c.historia}</p>

              <div className="demo-meta">
                <div className="demo-meta-row">
                  <span className="demo-meta-label">Planta</span>
                  <b className="demo-meta-value">{c.planta}</b>
                </div>
                <div className="demo-meta-row">
                  <span className="demo-meta-label">Enfoque</span>
                  <span className="demo-tag">{c.destacado}</span>
                </div>
              </div>

              <div className="demo-credenciales">
                <span>{c.correo}</span>
                <code>{c.contrasena}</code>
              </div>

              <form action={entrarDemo}>
                <input type="hidden" name="tipo" value={c.tipo} />
                <button type="submit" className="btn btn-main btn-block btn-sm">
                  Probar como {c.nombre.split(' ')[0]} →
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

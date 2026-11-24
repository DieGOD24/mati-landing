import { redirect } from 'next/navigation';
import MateraDemo from '../../components/MateraDemo';
import { CUENTAS_DEMO } from '../../lib/contenido';
import { usuarioActual } from '../../lib/sesion';
import { agregarMatera, entrarDemo, salir } from '../acciones';

export const metadata = { title: 'Tus plantas · Mati' };

export default async function Plantas() {
  const usuario = await usuarioActual();
  if (!usuario) redirect('/ingresar');

  const primerNombre = usuario.nombre.split(' ')[0];
  const matera = usuario.materas?.[0];
  const cuentaDemo = usuario.demo && CUENTAS_DEMO.find((c) => c.correo === usuario.correo || c.tipo === usuario.tipo);

  return (
    <main className={`app${matera ? ' app-ancha' : ''}`}>
      {usuario.demo && (
        <aside className="demo-barra-superior">
          <div className="demo-barra-info">
            <span className="demo-barra-icono">{cuentaDemo?.icono || '🌱'}</span>
            <div>
              <b>Modo Demo: {usuario.nombre}</b>
              <span>{cuentaDemo?.rol || 'Simulación interactiva'}</span>
            </div>
          </div>

          <div className="demo-barra-cambio">
            <span className="demo-barra-label">Cambiar consumidor:</span>
            <div className="demo-barra-botones">
              {CUENTAS_DEMO.map((c) => (
                <form key={c.tipo} action={entrarDemo}>
                  <input type="hidden" name="tipo" value={c.tipo} />
                  <button
                    type="submit"
                    className={`btn-switcher ${cuentaDemo?.tipo === c.tipo ? 'activo' : ''}`}
                    title={`${c.rol}: ${c.planta}`}
                  >
                    <span>{c.icono}</span> {c.nombre.split(' ')[0]}
                  </button>
                </form>
              ))}
            </div>
          </div>
        </aside>
      )}

      <header className="app-head">
        <div>
          <span className="eyebrow">Hola, {primerNombre}</span>
          <h1>Tus plantas</h1>
        </div>
        <form action={salir}>
          <button className="btn btn-ghost btn-sm">Cerrar sesión</button>
        </form>
      </header>

      {matera ? (
        <MateraDemo usuarioId={usuario.id} matera={matera} />
      ) : (
        // Pantalla 4 de los mockups: la app recién abierta, sin materas todavía.
        <section className="vacio">
          <div className="vacio-art" aria-hidden="true">
            <svg width="120" height="108" viewBox="0 0 190 170">
              <path d="M95 50 c-4 -22 8 -38 30 -44 c2 22 -10 38 -30 44z" fill="#2E8A57" />
              <path d="M95 52 c-2 -18 -14 -30 -34 -32 c0 20 12 32 34 32z" fill="#4FAE78" />
              <path d="M40 58 h110 l-14 104 h-82z" fill="#E7D9C8" />
              <rect x="34" y="50" width="122" height="16" rx="6" fill="#D9C6AF" />
              <circle cx="95" cy="108" r="30" fill="#12201A" />
              <circle cx="86" cy="106" r="2.6" fill="#BFF2D3" opacity="0.5" />
              <circle cx="95" cy="106" r="2.6" fill="#BFF2D3" opacity="0.75" />
              <circle cx="104" cy="106" r="2.6" fill="#BFF2D3" />
            </svg>
          </div>
          <h2>Todavía no tienes materas</h2>
          <p>Conecta la primera y tu planta empezará a contarte cómo se siente.</p>
          <form action={agregarMatera} className="vacio-form">
            <button className="btn btn-main btn-block">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Agregar matera de demostración
            </button>
          </form>
          <small>Mientras llega el prototipo físico, la matera es simulada.</small>
        </section>
      )}
    </main>
  );
}

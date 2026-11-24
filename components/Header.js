import Link from 'next/link';
import { entrarDemo } from '../app/acciones';

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-logo" aria-label="Mati - Inicio">
          <span className="logo-emoji">🌱</span>
          <span className="logo-text">Mati</span>
          <span className="logo-badge">UTP</span>
        </Link>

        <nav className="site-nav" aria-label="Navegación principal">
          <a href="#problema">El problema</a>
          <a href="#como">Cómo funciona</a>
          <a href="#caras">La cara</a>
          <a href="#diferencia">Comparativa</a>
          <a href="#modelo">Modelo</a>
        </nav>

        <div className="site-actions">
          <Link href="/ingresar" className="btn btn-ghost btn-sm btn-header-ingreso">
            Ingresar
          </Link>
          <form action={entrarDemo} className="header-demo-form">
            <button type="submit" className="btn btn-main btn-sm">
              Probar Demo →
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}

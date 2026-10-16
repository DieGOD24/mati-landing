import { Bricolage_Grotesque, Nunito_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap'
});

const body = Nunito_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap'
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-mono',
  display: 'swap'
});

export const metadata = {
  title: 'Mati · La matera que te dice qué necesita tu planta',
  description:
    'Una matera con sensores de humedad, pH y luz, y una cara digital que muestra cómo está tu planta. Proyecto de Emprendimiento, Universidad Tecnológica de Pereira.',
  openGraph: {
    title: 'Mati · La matera que te dice qué necesita tu planta',
    description:
      'Sensores de humedad, pH y luz, y una cara digital que muestra cómo está tu planta. Proyecto de Emprendimiento, UTP.',
    locale: 'es_CO',
    type: 'website'
  }
};

export const viewport = {
  themeColor: '#2E8A57'
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}

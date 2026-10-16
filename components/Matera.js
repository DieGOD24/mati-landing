// La matera con su pantalla redonda, para el hero.
export default function Matera({ size = 330 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 300 330"
      role="img"
      aria-label="Matera con una pantalla redonda que muestra una cara feliz"
    >
      <path d="M150 110 c-8 -46 16 -80 64 -94 c4 48 -22 82 -64 94z" fill="#2E8A57" />
      <path d="M150 114 c-4 -38 -30 -64 -74 -68 c0 42 26 68 74 68z" fill="#4FAE78" />
      <path d="M150 112 c10 -30 4 -60 -14 -86" fill="none" stroke="#236B43" strokeWidth="3" />
      <path d="M52 128 h196 l-26 190 h-144z" fill="#E7D9C8" />
      <rect x="42" y="112" width="216" height="28" rx="10" fill="#D9C6AF" />
      <circle cx="150" cy="210" r="56" fill="#12201A" />
      <circle cx="150" cy="210" r="56" fill="none" stroke="#C9B69E" strokeWidth="5" />
      <circle cx="133" cy="202" r="5.5" fill="#BFF2D3" />
      <circle cx="167" cy="202" r="5.5" fill="#BFF2D3" />
      <path d="M129 220 q21 19 42 0" fill="none" stroke="#BFF2D3" strokeWidth="4.2" strokeLinecap="round" />
      <circle cx="118" cy="222" r="5" fill="#F29BB0" opacity="0.5" />
      <circle cx="182" cy="222" r="5" fill="#F29BB0" opacity="0.5" />
      <line x1="90" y1="300" x2="90" y2="326" stroke="#8A7A66" strokeWidth="3" />
      <line x1="110" y1="300" x2="110" y2="326" stroke="#8A7A66" strokeWidth="3" />
    </svg>
  );
}

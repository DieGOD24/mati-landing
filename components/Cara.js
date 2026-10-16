// Las cinco expresiones de la pantalla de la matera, dibujadas en SVG.
const trazos = {
  sedienta: (
    <>
      <path d="M15 21 l7 4 M41 21 l-7 4" stroke="#FFB38A" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M19 40 q9 -8 18 0" fill="none" stroke="#FFB38A" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M44 27 q4 6 0 9 q-4 -3 0 -9z" fill="#7CC4F2" />
    </>
  ),
  ahogada: (
    <>
      <circle cx="20" cy="24" r="4.5" fill="none" stroke="#FFB38A" strokeWidth="2.6" />
      <circle cx="36" cy="24" r="4.5" fill="none" stroke="#FFB38A" strokeWidth="2.6" />
      <ellipse cx="28" cy="39" rx="4" ry="5" fill="none" stroke="#FFB38A" strokeWidth="2.6" />
      <path d="M9 12 q3 5 0 7 q-3 -2 0 -7z M47 10 q3 5 0 7 q-3 -2 0 -7z" fill="#7CC4F2" />
    </>
  ),
  sueno: (
    <>
      <path d="M15 25 q5 3 10 0 M31 25 q5 3 10 0" fill="none" stroke="#F2D27A" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M22 39 h12" stroke="#F2D27A" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M40 6 h7 l-7 8 h7" fill="none" stroke="#F2D27A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  mareada: (
    <>
      <path d="M15 20 l7 7 M22 20 l-7 7 M34 20 l7 7 M41 20 l-7 7" stroke="#D9B3F2" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M17 40 q5.5 -5 11 0 q5.5 5 11 0" fill="none" stroke="#D9B3F2" strokeWidth="2.6" strokeLinecap="round" />
    </>
  ),
  feliz: (
    <>
      <circle cx="20" cy="24" r="3.4" fill="#BFF2D3" />
      <circle cx="36" cy="24" r="3.4" fill="#BFF2D3" />
      <path d="M17 33 q11 12 22 0" fill="none" stroke="#BFF2D3" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="11" cy="32" r="3" fill="#F29BB0" opacity="0.6" />
      <circle cx="45" cy="32" r="3" fill="#F29BB0" opacity="0.6" />
    </>
  )
};

export default function Cara({ id, size = 78, titulo }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" role="img" aria-label={titulo ? `Cara ${titulo}` : undefined}>
      {trazos[id]}
    </svg>
  );
}

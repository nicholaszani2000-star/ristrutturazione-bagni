/**
 * Marchio: casa piena con goccia e onda in negativo.
 * Due concetti soli — casa (ristrutturazione) e acqua (bagno) — così resta
 * leggibile anche a 32px. L'onda è quella del biglietto da visita stampato.
 */
export function LogoMark({ className = "size-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="ebg" x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#143A5C" />
          <stop offset="0.55" stopColor="#1B84DD" />
          <stop offset="1" stopColor="#56B4EE" />
        </linearGradient>
        <mask id="ebm">
          <rect width="64" height="64" fill="#fff" />
          <path d="M32 21c5 6.3 7.7 10.2 7.7 13a7.7 7.7 0 0 1-15.4 0c0-2.8 2.7-6.7 7.7-13Z" fill="#000" />
          <path d="M17 47.5q5-4.6 10 0t10 0t10 0" stroke="#000" strokeWidth="4" fill="none" strokeLinecap="round" />
        </mask>
      </defs>
      <path
        d="M5.5 27 32 4.6 58.5 27V50a6.5 6.5 0 0 1-6.5 6.5H12A6.5 6.5 0 0 1 5.5 50Z"
        fill="url(#ebg)"
        mask="url(#ebm)"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <LogoMark className="size-10 shrink-0" />
      <span className="flex flex-col leading-tight">
        <span className="font-display text-[1.12rem] font-bold tracking-tight text-navy">
          Easy-Bagno<span className="text-blue">.it</span>
        </span>
        {!compact && (
          <span className="text-[0.68rem] text-muted">
            Ristrutturazione bagni · chiavi in mano
          </span>
        )}
      </span>
    </span>
  );
}

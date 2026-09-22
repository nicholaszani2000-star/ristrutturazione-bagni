/**
 * Marchio EasyBagno: goccia a nastro.
 *
 * Ricostruito in SVG invece di usare il PNG fornito. Un logo e' l'elemento che
 * compare piu' volte e in piu' misure: in vettoriale resta nitido dall'icona
 * del browser all'intestazione grande, pesa poche centinaia di byte al posto di
 * centinaia di kB, e non si porta dietro il fondo scuro su cui era esportato.
 *
 * La goccia e' un anello (contorno pieno con il vuoto al centro) piu' una banda
 * diagonale: e' quella sovrapposizione a dare l'effetto nastro dell'originale.
 */
export function LogoMark({ className = "size-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="ebGoccia" x1="14" y1="8" x2="50" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#56B4EE" />
          <stop offset="0.5" stopColor="#1B84DD" />
          <stop offset="1" stopColor="#1663B0" />
        </linearGradient>
        <linearGradient id="ebNastro" x1="20" y1="14" x2="44" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#8ACFF7" />
          <stop offset="1" stopColor="#2B95E8" />
        </linearGradient>
        {/* Il nastro si vede solo dentro la goccia */}
        <clipPath id="ebDentro">
          <path d="M32 5C32 5 51 28 51 39.5A19 19 0 1 1 13 39.5C13 28 32 5 32 5Z" />
        </clipPath>
      </defs>

      {/* Anello: goccia esterna meno goccia interna, con evenodd */}
      <path
        fillRule="evenodd"
        fill="url(#ebGoccia)"
        d="M32 5C32 5 51 28 51 39.5A19 19 0 1 1 13 39.5C13 28 32 5 32 5Z
           M32 18.5C32 18.5 42 31 42 39.7A10 10 0 1 1 22 39.7C22 31 32 18.5 32 18.5Z"
      />

      {/* Banda diagonale: e' la torsione del nastro */}
      <g clipPath="url(#ebDentro)">
        <path d="M6 44 L40 2 L52 10 L18 54 Z" fill="url(#ebNastro)" opacity="0.55" />
      </g>
    </svg>
  );
}

/**
 * Logo completo.
 *
 * `tono` esiste perche' il marchio vive su due fondi: l'intestazione chiara e
 * l'hero scuro. Senza, il testo sparirebbe su uno dei due.
 */
export function Logo({
  compact = false,
  tono = "scuro",
}: {
  compact?: boolean;
  tono?: "scuro" | "chiaro";
}) {
  const chiaro = tono === "chiaro";
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark className="size-9 shrink-0" />
      <span className="flex flex-col leading-tight">
        <span
          className={`font-display text-[1.15rem] font-bold tracking-tight ${
            chiaro ? "text-white" : "text-navy"
          }`}
        >
          Easy<span className={chiaro ? "text-sky" : "text-blue"}>Bagno.it</span>
        </span>
        {!compact && (
          <span
            className={`text-[0.6rem] uppercase tracking-[0.14em] ${
              chiaro ? "text-white/60" : "text-muted"
            }`}
          >
            Ristrutturazione bagno
          </span>
        )}
      </span>
    </span>
  );
}

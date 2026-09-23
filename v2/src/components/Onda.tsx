/**
 * Transizione a onda fra due sezioni.
 *
 * SVG puro, nessuno script: e' un elemento decorativo e non deve costare
 * niente ne' in peso ne' in tempo di esecuzione.
 *
 * Due tracciati sovrapposti, non uno. Con una curva sola il passaggio si legge
 * come un bordo tagliato; con due, sfalsate e di opacita' diversa, si legge
 * come profondita' — che e' quello che fa l'acqua vera quando due superfici si
 * incontrano. E' anche il modo piu' economico di dare strati alla pagina senza
 * tirare in ballo il 3D.
 *
 * Il colore e' quello della sezione DI DESTINAZIONE: l'onda appartiene a cio'
 * che arriva, non a cio' che finisce.
 */
type Props = {
  /** Classe di riempimento, es. "fill-white" o "fill-surface". */
  colore: string;
  /** Due profili per non ripetere sempre la stessa curva scendendo. */
  variante?: "calma" | "mossa";
  className?: string;
};

const PROFILI = {
  calma: {
    dietro: "M0,52 C260,104 520,12 760,44 C1000,76 1220,108 1440,64 L1440,120 L0,120 Z",
    avanti: "M0,74 C240,116 500,34 748,66 C996,98 1216,124 1440,86 L1440,120 L0,120 Z",
  },
  mossa: {
    dietro: "M0,36 C200,100 392,4 636,46 C880,88 1128,10 1440,52 L1440,120 L0,120 Z",
    avanti: "M0,62 C186,118 396,30 644,72 C892,114 1140,40 1440,78 L1440,120 L0,120 Z",
  },
} as const;

export function Onda({ colore, variante = "calma", className = "" }: Props) {
  const { dietro, avanti } = PROFILI[variante];

  return (
    <svg
      aria-hidden
      // preserveAspectRatio="none" e' la ragione per cui l'onda funziona a
      // ogni larghezza: il tracciato si stira, invece di lasciare vuoti ai
      // lati su schermo largo o di scappare fuori su telefono.
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      className={`pointer-events-none block h-[clamp(2.5rem,5vw,5rem)] w-full ${className}`}
    >
      <path d={dietro} className={colore} opacity="0.45" />
      <path d={avanti} className={colore} />
    </svg>
  );
}

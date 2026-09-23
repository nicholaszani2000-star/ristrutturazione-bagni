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
    dietro: "M0,78 C300,104 600,58 900,76 C1140,90 1290,102 1440,84 L1440,120 L0,120 Z",
    avanti: "M0,94 C280,116 580,76 880,92 C1120,105 1300,118 1440,100 L1440,120 L0,120 Z",
  },
  mossa: {
    dietro: "M0,70 C240,102 470,56 720,74 C970,92 1210,60 1440,82 L1440,120 L0,120 Z",
    avanti: "M0,88 C230,114 480,74 736,92 C992,110 1220,82 1440,98 L1440,120 L0,120 Z",
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
      className={`pointer-events-none block h-[clamp(1.5rem,2.6vw,2.75rem)] w-full ${className}`}
    >
      <path d={dietro} className={colore} opacity="0.45" />
      <path d={avanti} className={colore} />
    </svg>
  );
}

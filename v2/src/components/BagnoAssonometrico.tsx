/**
 * Il bagno in assonometria, disegnato in SVG.
 *
 * Non e' un render e non e' 3D: e' una proiezione isometrica calcolata a mano
 * su una manciata di scatole. Ogni volume e' descritto in metri reali — il
 * bagno e' davvero 3×2 — e una funzione lo proietta sul piano. Scrivere i
 * poligoni a mano sarebbe stato piu' corto da leggere e impossibile da
 * correggere: cosi' invece si sposta un mobile cambiando tre numeri.
 *
 * Le tre facce di ogni scatola hanno tre chiari diversi, ed e' tutta la
 * profondita' che serve: la luce arriva da sopra a sinistra, come in un
 * disegno tecnico.
 */

/** Proiezione isometrica. z e' l'altezza, e sale verso l'alto nello schermo. */
const P = (x: number, y: number, z: number): [number, number] => [
  (x - y) * 0.866,
  (x + y) * 0.5 - z,
];

const punti = (...p: [number, number][]) => p.map(([x, y]) => `${x},${y}`).join(" ");

/** Le tre facce visibili di una scatola: sopra, davanti a sinistra, davanti a destra. */
function Scatola({
  x, y, z, l, p, h, sopra, sinistra, destra,
}: {
  x: number; y: number; z: number;
  l: number; p: number; h: number;
  sopra: string; sinistra: string; destra: string;
}) {
  const t = z + h;
  return (
    <g>
      <polygon
        points={punti(P(x, y, t), P(x + l, y, t), P(x + l, y + p, t), P(x, y + p, t))}
        fill={sopra}
      />
      <polygon
        points={punti(P(x, y + p, t), P(x + l, y + p, t), P(x + l, y + p, z), P(x, y + p, z))}
        fill={destra}
      />
      <polygon
        points={punti(P(x, y, t), P(x, y + p, t), P(x, y + p, z), P(x, y, z))}
        fill={sinistra}
      />
    </g>
  );
}

/* Tre chiari per le tre facce, piu' i toni dell'involucro. Tutta la tavolozza
   sta nella famiglia azzurra del marchio: l'illustrazione deve sembrare un
   disegno del progetto, non una fotografia mancata. */
const C = {
  paviment: "#dcebf8",
  muro: "#eef6fd",
  muroScuro: "#e0edf9",
  sopra: "#f4fafe",
  sinistra: "#cfe4f6",
  destra: "#b4d3ee",
  accentoSopra: "#cfe8fb",
  accentoSin: "#a9cee9",
  accentoDes: "#8cbde0",
  linea: "#9cc5e6",
} as const;

export function BagnoAssonometrico({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="-2.4 -2.5 5.2 4.6"
      className={className}
      role="img"
      aria-label="Schema in assonometria di un bagno di 3×2 metri: mobile lavabo con specchio, sanitari sospesi e doccia a filo pavimento"
    >
      {/* Le due pareti disegnate sono quelle LONTANE dall'osservatore, cioe'
          quelle che si incontrano nell'angolo in alto: x=0 e y=0. Le due
          vicine restano fuori, altrimenti coprirebbero la stanza. E' il taglio
          classico dello spaccato, e la prima volta l'avevo sbagliato
          disegnando la parete davanti. */}
      <polygon points={punti(P(0, 0, 0), P(0, 2, 0), P(0, 2, 2.3), P(0, 0, 2.3))} fill={C.muroScuro} />
      <polygon points={punti(P(0, 0, 0), P(3, 0, 0), P(3, 0, 2.3), P(0, 0, 2.3))} fill={C.muro} />

      {/* pavimento */}
      <polygon points={punti(P(0, 0, 0), P(3, 0, 0), P(3, 2, 0), P(0, 2, 0))} fill={C.paviment} />
      {[0.6, 1.2, 1.8, 2.4].map((x) => (
        <line key={`fx${x}`} {...linea(P(x, 0, 0), P(x, 2, 0))} stroke={C.linea} strokeWidth="0.015" opacity="0.45" />
      ))}
      {[0.5, 1, 1.5].map((y) => (
        <line key={`fy${y}`} {...linea(P(0, y, 0), P(3, y, 0))} stroke={C.linea} strokeWidth="0.015" opacity="0.45" />
      ))}

      {/* Doccia a filo pavimento, nell'angolo in fondo a sinistra: piatto
          appena rialzato e un vetro semitrasparente. */}
      <Scatola x={0.04} y={0.08} z={0} l={0.9} p={1.25} h={0.04} sopra={C.accentoSopra} sinistra={C.accentoSin} destra={C.accentoDes} />
      <polygon
        points={punti(P(0.94, 0.08, 0.04), P(0.94, 1.33, 0.04), P(0.94, 1.33, 1.95), P(0.94, 0.08, 1.95))}
        fill="#bcd9f2"
        opacity="0.38"
      />
      <line {...linea(P(0.94, 0.08, 1.95), P(0.94, 1.33, 1.95))} stroke={C.accentoDes} strokeWidth="0.035" />
      <line {...linea(P(0.94, 1.33, 1.95), P(0.94, 1.33, 0.04))} stroke={C.accentoDes} strokeWidth="0.035" />
      {/* soffione a parete */}
      <Scatola x={0.06} y={0.55} z={1.98} l={0.3} p={0.26} h={0.04} sopra="#ffffff" sinistra={C.accentoSin} destra={C.accentoDes} />

      {/* Mobile lavabo contro la parete di fondo, con lavabo e specchio. */}
      <Scatola x={1.25} y={0.04} z={0.4} l={0.95} p={0.48} h={0.45} sopra={C.sopra} sinistra={C.sinistra} destra={C.destra} />
      <Scatola x={1.45} y={0.14} z={0.85} l={0.5} p={0.34} h={0.13} sopra="#ffffff" sinistra="#e8f3fc" destra="#d5e9f8" />
      <polygon
        points={punti(P(1.42, 0.02, 1.25), P(2.04, 0.02, 1.25), P(2.04, 0.02, 1.95), P(1.42, 0.02, 1.95))}
        fill="#ffffff"
        opacity="0.95"
      />
      <polygon
        points={punti(P(1.42, 0.02, 1.25), P(2.04, 0.02, 1.25), P(2.04, 0.02, 1.95), P(1.42, 0.02, 1.95))}
        fill="none"
        stroke={C.accentoSin}
        strokeWidth="0.022"
      />

      {/* Sanitari sospesi, sempre contro la parete di fondo. */}
      <Scatola x={2.32} y={0.05} z={0.4} l={0.36} p={0.42} h={0.33} sopra={C.sopra} sinistra={C.sinistra} destra={C.destra} />
      <Scatola x={2.76} y={0.05} z={0.4} l={0.36} p={0.42} h={0.33} sopra={C.sopra} sinistra={C.sinistra} destra={C.destra} />

      {/* Termoarredo sulla parete corta. */}
      {[1.0, 1.15, 1.3, 1.45, 1.6].map((z) => (
        <line key={`t${z}`} {...linea(P(0.02, 1.6, z), P(0.02, 1.95, z))} stroke={C.accentoSin} strokeWidth="0.04" />
      ))}
    </svg>
  );
}

/** Le linee vogliono x1/y1/x2/y2, non una lista di punti. */
function linea([x1, y1]: [number, number], [x2, y2]: [number, number]) {
  return { x1, y1, x2, y2 };
}

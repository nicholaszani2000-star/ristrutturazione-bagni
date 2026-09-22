"use client";

import { Warp } from "@paper-design/shaders-react";

/**
 * I colori sono quelli del marchio, gli stessi token di globals.css:
 * navy, blue e sky. Lo schema alterna scuro e acceso come il preset
 * originale dello shader — sono le venature chiare a dare il movimento e
 * il fondo scuro a tenere leggibile il testo sopra. Cambiare l'ordine
 * (due chiari vicini) illumina la fascia dove sta il titolo.
 */
const COLORI = ["#0a1a28", "#1b84dd", "#0d2740", "#56b4ee"];

/**
 * Geometria del preset di partenza, lasciata com'e': la forma piace,
 * quello che cambia e' la tavolozza. L'unica differenza e' la velocita',
 * dimezzata, perche' dietro a un titolo un fondale che corre distrae da
 * cio' che deve essere letto.
 */
export default function TelaWarp({ fermo }: { fermo: boolean }) {
  return (
    <Warp
      className="size-full"
      colors={COLORI}
      proportion={0.45}
      softness={1}
      distortion={0.25}
      swirl={0.8}
      swirlIterations={10}
      shapeScale={0.1}
      shape="checks"
      rotation={0}
      // Fermo, non assente: a chi chiede meno animazioni resta lo stesso
      // fondale, solo immobile su un fotogramma scelto.
      speed={fermo ? 0 : 0.5}
      frame={fermo ? 14000 : 0}
      // Il disegno e' fatto solo di sfumature larghe: disegnarlo a meno
      // pixel e lasciarlo ingrandire non si vede a occhio, e su telefono e'
      // la differenza fra un fondale e la ventola che parte.
      minPixelRatio={1}
      maxPixelCount={1280 * 720}
    />
  );
}

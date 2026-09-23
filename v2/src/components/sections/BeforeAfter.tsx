"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { IntestazioneSezione } from "@/components/IntestazioneSezione";

/**
 * Confronto prima/dopo su una foto vera, stessa inquadratura.
 *
 * Il livello "dopo" sta sopra e viene ritagliato da sinistra: la metà sinistra
 * mostra il prima e la destra il dopo, come dicono le etichette.
 *
 * touch-action: pan-y lascia scorrere la pagina verticalmente sopra il
 * componente — altrimenti su mobile lo slider sequestra lo scroll.
 */
export function BeforeAfter() {
  const [pos, setPos] = useState(50);
  const boxRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const moveTo = useCallback((clientX: number) => {
    const r = boxRef.current?.getBoundingClientRect();
    if (!r?.width) return;
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    const map: Record<string, number> = {
      ArrowLeft: -step, ArrowRight: step,
      ArrowDown: -step, ArrowUp: step,
    };
    if (e.key === "Home") { e.preventDefault(); return setPos(0); }
    if (e.key === "End") { e.preventDefault(); return setPos(100); }
    if (e.key in map) {
      e.preventDefault();
      setPos((p) => Math.max(0, Math.min(100, p + map[e.key])));
    }
  };

  return (
    <section id="prima-dopo" className="bg-surface py-[length:var(--spacing-section)]">
      <div className="wrap grid items-center gap-y-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-x-16">
        <IntestazioneSezione
          occhiello="I nostri lavori"
          titolo="Lo stesso bagno,"
          accento="due mondi."
          testo="Un lavoro vero, fotografato dallo stesso punto. Trascina la maniglia per vedere la differenza — con le frecce della tastiera funziona uguale."
        >
          <p className="mt-6 rounded-2xl border border-line bg-white p-5 text-sm leading-relaxed text-muted shadow-[var(--shadow-card)]">
            È l&apos;unico intervento che abbiamo fotografato prima e dopo dallo stesso punto.
            Gli altri cantieri li mostriamo dal vivo durante il sopralluogo.
          </p>
        </IntestazioneSezione>

        {/* Maschera invece di scivolata: il riquadro e' grande, e farlo
            entrare per intero risulterebbe pesante. Qui si scopre dal basso,
            come una tenda che si alza sulla fotografia. */}
        <Reveal effetto="maschera">
        <div
          ref={boxRef}
          className="relative aspect-[7/9] sm:aspect-[4/3] lg:aspect-[7/6] touch-pan-y select-none overflow-hidden rounded-[var(--radius-card)] border border-line shadow-[var(--shadow-lift)]"
          onPointerDown={(e) => {
            dragging.current = true;
            moveTo(e.clientX);
            e.currentTarget.setPointerCapture?.(e.pointerId);
          }}
          onPointerMove={(e) => dragging.current && moveTo(e.clientX)}
          onPointerUp={() => (dragging.current = false)}
          onPointerCancel={() => (dragging.current = false)}
        >
          <Image
            src="/images/bagno-prima.webp"
            alt="Il bagno prima dell'intervento: piastrelle beige, box doccia datato, sanitari e mobile originali"
            width={728}
            height={924}
            sizes="(min-width: 768px) 42rem, 100vw"
            className="absolute inset-0 size-full object-cover"
          />

          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
          >
            <Image
              src="/images/bagno-dopo.webp"
              alt="Lo stesso bagno dopo l'intervento: microcemento, specchio retroilluminato, doccia walk-in e mobile sospeso"
              width={728}
              height={924}
              sizes="(min-width: 768px) 42rem, 100vw"
              className="absolute inset-0 size-full object-cover"
            />
          </div>

          <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-navy/85 px-3 py-1 font-display text-[0.72rem] font-semibold uppercase tracking-wider text-white">
            Prima
          </span>
          <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-blue-700/92 px-3 py-1 font-display text-[0.72rem] font-semibold uppercase tracking-wider text-white">
            Dopo
          </span>

          <button
            type="button"
            role="slider"
            aria-label="Confronta prima e dopo"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pos)}
            aria-valuetext={`${Math.round(pos)}% prima`}
            onKeyDown={onKey}
            onClick={(e) => e.preventDefault()}
            className="absolute inset-y-0 -ml-[1.375rem] grid w-11 cursor-ew-resize place-items-center before:absolute before:inset-y-0 before:left-1/2 before:w-1 before:-translate-x-1/2 before:bg-white before:shadow-[0_0_0_1px_rgb(20_58_92/0.18)] before:content-['']"
            style={{ left: `${pos}%` }}
          >
            <span className="grid size-12 place-items-center rounded-full bg-white text-blue shadow-[var(--shadow-card)]">
              <Icon name="arrows" className="size-6" />
            </span>
          </button>
        </div>
        </Reveal>
      </div>
    </section>
  );
}

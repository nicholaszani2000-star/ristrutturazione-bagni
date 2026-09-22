"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Parallasse legata allo scorrimento.
 *
 * Sposta il contenuto di pochi pixel mentre la pagina scorre. Serve a dare
 * profondita' a una fotografia di fondo: il piano dietro si muove meno di
 * quello davanti, ed e' cio' che l'occhio legge come distanza.
 *
 * L'ampiezza e' volutamente piccola. Una parallasse vistosa su una fotografia
 * a tutta pagina fa "nuotare" il testo che ci sta sopra e rende faticoso
 * leggere: qui sopra ci stanno il titolo e il prezzo, cioe' le due cose che
 * devono restare ferme e leggibili.
 *
 * "scrub" aggancia l'avanzamento dell'animazione alla posizione di scorrimento
 * invece che al tempo: il movimento segue il dito, non parte per conto suo.
 */
export function Parallasse({
  children,
  ampiezza = 60,
  className,
}: {
  children: ReactNode;
  /** Spostamento totale in pixel lungo l'intero attraversamento. */
  ampiezza?: number;
  className?: string;
}) {
  const box = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          el,
          { yPercent: 0 },
          {
            y: ampiezza,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    }, box);

    return () => ctx.revert();
  }, [ampiezza]);

  return (
    <div ref={box} className={className}>
      {children}
    </div>
  );
}

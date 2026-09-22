"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { migliaia } from "@/lib/links";

gsap.registerPlugin(ScrollTrigger);

/**
 * Il prezzo che sale fino al suo valore quando entra a schermo.
 *
 * Il numero e' l'argomento della pagina, quindi deve fermare l'occhio. Ma parte
 * gia' scritto per intero nell'HTML: se JavaScript non gira, o se il sistema
 * chiede meno movimento, resta li' leggibile. Un prezzo che compare solo grazie
 * a un'animazione e' un prezzo che qualcuno non vedra' mai.
 */
export function Contatore({ valore, className }: { valore: number; className?: string }) {
  const el = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const nodo = el.current;
    if (!nodo) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const stato = { n: 0 };
        gsap.to(stato, {
          n: valore,
          duration: 1.1,
          ease: "power2.out",
          onUpdate: () => {
            nodo.textContent = `${migliaia(stato.n)} €`;
          },
          // Stessa ragione del Reveal: soglia raggiungibile anche a fondo pagina.
          scrollTrigger: { trigger: nodo, start: "top bottom-=40", once: true },
        });
      });
    }, el);

    return () => ctx.revert();
  }, [valore]);

  return (
    <span ref={el} className={className}>
      {migliaia(valore)} €
    </span>
  );
}

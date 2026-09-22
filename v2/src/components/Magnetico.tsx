"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

/**
 * Attrazione magnetica del cursore.
 *
 * Il contenuto si sposta di poco verso il puntatore quando gli passa vicino, e
 * torna al suo posto quando si allontana. Applicata all'invito all'azione
 * principale rende il bersaglio piu' facile da centrare, oltre che piu' vivo:
 * il pulsante va incontro al cursore invece di stare fermo ad aspettarlo.
 *
 * Attiva solo dove esiste davvero un puntatore fine. Su un telefono non c'e'
 * nulla da attrarre — e il tocco arriva gia' sul bersaglio — quindi il
 * listener non viene nemmeno registrato: nessun costo dove non serve, che e'
 * dove sta l'80% del traffico.
 */
export function Magnetico({
  children,
  forza = 0.28,
  className,
}: {
  children: ReactNode;
  /** Quota dello scostamento dal centro che viene seguita, da 0 a 1. */
  forza?: number;
  className?: string;
}) {
  const box = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const menoMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || menoMovimento.matches) return;

    const ctx = gsap.context(() => {
      const muovi = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        gsap.to(el, {
          x: (e.clientX - (r.left + r.width / 2)) * forza,
          y: (e.clientY - (r.top + r.height / 2)) * forza,
          duration: 0.45,
          ease: "power3.out",
        });
      };
      // elastic in uscita: il ritorno a posto e' la meta' visibile dell'effetto
      const rilascia = () =>
        gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.45)" });

      el.addEventListener("pointermove", muovi);
      el.addEventListener("pointerleave", rilascia);
      return () => {
        el.removeEventListener("pointermove", muovi);
        el.removeEventListener("pointerleave", rilascia);
      };
    }, box);

    return () => ctx.revert();
  }, [forza]);

  return (
    <span ref={box} className={`inline-block ${className ?? ""}`}>
      {children}
    </span>
  );
}

"use client";

import { useLayoutEffect, useRef, type ReactNode, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Comparsa allo scorrimento.
 *
 * E' un client component che accetta children: cosi' le sezioni restano
 * server component e non trasciniamo il loro contenuto nel bundle del browser.
 *
 * L'animazione e' volutamente piccola (16px e mezzo secondo). Su una pagina che
 * deve vendere, il movimento serve a guidare l'occhio verso il prossimo blocco,
 * non a farsi notare: un'entrata vistosa rallenta la lettura e allontana dal
 * pulsante.
 */
/**
 * Tre effetti, un solo componente.
 *
 * - "salita"   comparsa dal basso a scaglioni. E' il comportamento storico e
 *              resta il predefinito: nessuna chiamata esistente cambia.
 * - "maschera" il blocco si scopre dal basso come una tenda che si alza.
 *              Per le fotografie e i riquadri grandi, dove far scivolare
 *              l'elemento intero risulterebbe pesante.
 * - "ingresso" parte al montaggio invece che allo scorrimento. Serve a cio'
 *              che e' gia' visibile al caricamento, come il titolo dell'hero:
 *              li' uno scroll trigger non scatterebbe mai.
 */
export type Effetto = "salita" | "maschera" | "ingresso";

export function Reveal({
  children,
  as: Tag = "div",
  effetto = "salita",
  scaglionamento = 0.08,
  ritardo = 0,
  className,
}: {
  children: ReactNode;
  /** Il tag reso. Volutamente ristretto: con ElementType generico TypeScript
   *  riduce le props dell'unione a "never" e non accetta piu' ne' ref ne'
   *  className. */
  as?: "div" | "ul" | "section";
  effetto?: Effetto;
  scaglionamento?: number;
  ritardo?: number;
  className?: string;
}) {
  const box = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;

    // gsap.context isola le animazioni create qui dentro: al ritorno le
    // smonta tutte, ScrollTrigger compresi, senza doverli elencare.
    const ctx = gsap.context(() => {
      // matchMedia spegne tutto se il sistema chiede meno movimento, e al
      // ritorno ripristina i valori: gli elementi restano visibili, non
      // congelati a opacita' zero.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Nascondo solo cio' che in questo momento sta sotto la piega.
        //
        // gsap.from porta subito l'elemento a opacita' zero e lo riporta su
        // quando lo scroll trigger scatta. Se il trigger non scatta — perche'
        // la pagina cambia altezza dopo il calcolo, perche' l'elemento e' gia'
        // passato, perche' qualcosa va storto — il contenuto resta invisibile
        // per sempre. Su una pagina che deve vendere e' il peggior guasto
        // possibile: si perde il testo senza accorgersene.
        //
        // Limitando l'effetto a cio' che l'utente non sta guardando, il caso
        // peggiore diventa "l'animazione non parte", non "il testo sparisce".
        const tutti = Array.from(el.children);

        // "ingresso" non aspetta lo scorrimento: anima subito quello che c'e'
        // gia' a schermo. Non passa dal filtro sotto la piega proprio perche'
        // riguarda cio' che l'utente sta guardando adesso.
        if (effetto === "ingresso") {
          if (tutti.length === 0) return;
          gsap.from(tutti, {
            opacity: 0,
            y: 24,
            clipPath: "inset(0 0 100% 0)",
            duration: 1.1,
            delay: ritardo,
            ease: "power3.out",
            stagger: scaglionamento,
            // Ripulisce le proprieta' a fine corsa: una clip-path lasciata
            // sull'elemento impedirebbe a un'ombra di uscire dal riquadro.
            clearProps: "clipPath",
          });
          return;
        }

        const figli = tutti.filter(
          (f) => f.getBoundingClientRect().top > window.innerHeight,
        );
        if (figli.length === 0) return;

        gsap.from(figli, {
          opacity: 0,
          ...(effetto === "maschera"
            ? { clipPath: "inset(0 0 100% 0)", y: 0, duration: 1.05, ease: "power3.out", clearProps: "clipPath" }
            : { y: 16, duration: 0.5, ease: "power2.out" }),
          delay: ritardo,
          stagger: scaglionamento,
          scrollTrigger: {
            trigger: el,
            // Scatta appena il blocco entra dal bordo inferiore.
            //
            // Con una soglia piu' alta (es. "top 80%") il blocco deve salire
            // fino a un quinto dello schermo: per i blocchi vicini al fondo
            // pagina quel punto non e' raggiungibile, la pagina finisce prima,
            // e l'animazione non parte mai lasciandoli invisibili.
            start: "top bottom-=40",
            once: true,
          },
        });
      });
    }, box);

    // Il 3D si carica dopo e puo' spostare quello che ha sotto: senza un
    // ricalcolo, ScrollTrigger resta con le misure vecchie e certi blocchi non
    // scattano mai.
    const ricalcola = () => ScrollTrigger.refresh();
    window.addEventListener("load", ricalcola);

    return () => {
      window.removeEventListener("load", ricalcola);
      ctx.revert();
    };
  }, [effetto, scaglionamento, ritardo]);

  // Restringo a un tag concreto: le tre alternative condividono le props che
  // servono qui, ma TypeScript le riconcilia solo con un'asserzione.
  const Componente = Tag as "div";

  return (
    <Componente ref={box as RefObject<HTMLDivElement>} className={className}>
      {children}
    </Componente>
  );
}

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

        // Chi decide COSA nascondere dev'essere lo stesso che decide QUANDO
        // mostrarlo, e prima non lo era.
        //
        // Il filtro guardava ogni figlio, lo scroll trigger guarda il
        // contenitore. Su un riquadro alto — la scheda dell'email — il
        // contenitore era gia' entrato mentre il pulsante in fondo stava
        // ancora sotto la piega: il pulsante veniva nascosto, il trigger era
        // gia' passato, e restava a opacita' zero per sempre. La CTA
        // principale di quella sezione, invisibile.
        //
        // Ora la domanda e' una sola, sul contenitore: se e' gia' a schermo
        // non si nasconde niente e al massimo l'animazione non parte; se e'
        // sotto la piega si nasconde tutto, e il trigger scattera' di sicuro
        // perche' quel punto deve ancora essere attraversato.
        if (el.getBoundingClientRect().top <= window.innerHeight) return;
        const figli = tutti;
        if (figli.length === 0) return;

        // Oltre le otto voci il passo si accorcia da solo.
        //
        // Con un passo fisso, una lista di undici voci fa comparire l'ultima
        // dopo quasi un secondo: chi legge ha gia' finito la prima riga e
        // aspetta le altre. Tenendo la sequenza entro ~0,4 s l'elenco si
        // completa mentre l'occhio lo percorre, invece di inseguirlo.
        const passo =
          figli.length > 8
            ? Math.min(scaglionamento, 0.4 / figli.length)
            : scaglionamento;

        const anim = gsap.from(figli, {
          opacity: 0,
          ...(effetto === "maschera"
            ? { clipPath: "inset(0 0 100% 0)", y: 0, duration: 1.05, ease: "power3.out", clearProps: "clipPath" }
            : { y: 16, duration: 0.5, ease: "power2.out" }),
          delay: ritardo,
          stagger: passo,
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

        // Rete di sicurezza.
        //
        // La promessa di questo componente e' che il caso peggiore sia
        // "l'animazione non parte", mai "il contenuto sparisce". Il filtro
        // sopra riduce il rischio ma non lo annulla: un tween puo' restare a
        // meta' per ragioni che non dipendono da qui — un rilayout, un
        // rimontaggio di React, una tela che cambia altezza. E' successo
        // davvero, sulla CTA principale della sezione contatto, che e' rimasta
        // invisibile mentre i sei elementi accanto erano a posto.
        //
        // Quindi dopo il tempo massimo che l'animazione puo' impiegare si
        // controlla, e qualunque cosa sia ancora trasparente viene ripulita.
        // Costa un timer per blocco e toglie di mezzo un'intera classe di
        // guasti silenziosi.
        const durataMassima =
          (ritardo + passo * figli.length + 1.2) * 1000;
        const salvagente = window.setTimeout(() => {
          for (const f of figli) {
            if (Number(getComputedStyle(f).opacity) < 0.95) {
              gsap.set(f, { clearProps: "opacity,transform,translate,rotate,scale" });
            }
          }
        }, durataMassima);
        return () => {
          window.clearTimeout(salvagente);
          anim.kill();
        };
      });
    }, box);

    // Le fotografie si caricano dopo e spostano quello che hanno sotto: senza
    // un ricalcolo, ScrollTrigger resta con le misure vecchie e certi blocchi
    // non scattano mai.
    //
    // Il solo addEventListener non basta: con le risorse in cache "load" e'
    // gia' scattato prima che questo effetto venga eseguito, e il ricalcolo
    // non arriva. Quindi si controlla anche lo stato corrente.
    const ricalcola = () => ScrollTrigger.refresh();
    if (document.readyState === "complete") ricalcola();
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

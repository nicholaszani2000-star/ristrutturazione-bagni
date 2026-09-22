"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Icon } from "@/components/Icon";
import { Button } from "@/components/Button";
import { Reveal } from "@/components/Reveal";

/**
 * Sezione concept 3D.
 *
 * E' deliberatamente separata da Prima/Dopo: li' ci sono i cantieri veri, qui
 * una visualizzazione di materiali e luce. Tenerle distinte non e' una scelta
 * di impaginazione — un render presentato come lavoro eseguito, su una pagina
 * che porta una P.IVA, e' pubblicita' ingannevole.
 *
 * Il pacchetto three/R3F pesa, e l'80% del traffico arriva da Meta su rete
 * mobile. Per questo la scena si scarica solo quando la sezione sta per
 * entrare a schermo, e non viene renderizzata sul server (WebGL li' non
 * esiste). ssr:false funziona solo dentro un client component: per questo
 * l'import sta qui e non nella pagina.
 */
const BagnoScene = dynamic(() => import("@/components/three/BagnoScene"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-[#0d2228]">
      <span className="text-sm font-medium text-white/70">Preparo il concept…</span>
    </div>
  ),
});

const MATERIALI = [
  "Grandi lastre effetto pietra",
  "Doccia walk-in in vetro",
  "Rain shower a soffitto",
  "Mobile sospeso scuro",
  "Specchio circolare retroilluminato",
  "Nicchie illuminate",
];

/**
 * WebGL puo' mancare: browser vecchi, GPU in lista nera, accelerazione spenta.
 * Il risultato si tiene in cache perche' la verifica crea un canvas, e viene
 * letta a ogni render.
 */
let cacheWebGL: boolean | null = null;
function supportaWebGL() {
  if (cacheWebGL !== null) return cacheWebGL;
  try {
    const c = document.createElement("canvas");
    cacheWebGL = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    cacheWebGL = false;
  }
  return cacheWebGL;
}

/**
 * Legge una media query senza scrivere stato dentro un effetto.
 *
 * Impostare lo stato appena montati provoca un secondo render a catena, e la
 * pagina sfarfalla. useSyncExternalStore e' fatto per questo: il valore lato
 * server e' dichiarato a parte, quindi l'HTML generato e l'idratazione
 * coincidono.
 */
function useMediaQuery(query: string, valoreSulServer: boolean) {
  return useSyncExternalStore(
    (avvisa) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", avvisa);
      return () => m.removeEventListener("change", avvisa);
    },
    () => window.matchMedia(query).matches,
    () => valoreSulServer,
  );
}

export function Progetto3D() {
  const box = useRef<HTMLDivElement>(null);
  // La parallasse legge da un ref, non dallo stato: aggiornare lo stato a ogni
  // fotogramma di scorrimento farebbe ridisegnare l'albero React per niente.
  const progresso = useRef(0);

  const [visibile, setVisibile] = useState(false);
  const [inVista, setInVista] = useState(false);

  // Riflessi e post-produzione solo dove c'e' margine: su schermo piccolo
  // costano piu' di quanto rendano.
  const qualitaAlta = useMediaQuery("(min-width: 1024px)", false);
  const menoMovimento = useMediaQuery("(prefers-reduced-motion: reduce)", false);
  const animato = inVista && !menoMovimento;

  const webgl = useSyncExternalStore(
    () => () => {},
    () => supportaWebGL(),
    // Sul server si assume di si': cosi' l'HTML non nasce gia' col messaggio
    // di ripiego, che comparirebbe per un istante anche a chi ha WebGL.
    () => true,
  );

  useEffect(() => {
    const el = box.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([e]) => {
        // Una volta caricata resta caricata: rimontarla a ogni passaggio
        // vorrebbe dire ricompilare le shader e rifare il volo di camera.
        if (e.isIntersecting) setVisibile(true);
        setInVista(e.isIntersecting);
      },
      { rootMargin: "300px 0px", threshold: 0.01 },
    );
    obs.observe(el);

    let rafId = 0;
    const aggiorna = () => {
      rafId = 0;
      const r = el.getBoundingClientRect();
      const totale = r.height + window.innerHeight;
      progresso.current = totale > 0 ? Math.min(1, Math.max(0, (window.innerHeight - r.top) / totale)) : 0;
    };
    const suScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(aggiorna);
    };
    window.addEventListener("scroll", suScroll, { passive: true });
    aggiorna();

    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", suScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section id="progetto" className="bg-navy py-[length:var(--spacing-section)]">
      <div className="wrap">
        <p className="mb-3 text-center text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-sky">
          Concept 3D
        </p>
        <h2 className="mx-auto mb-4 max-w-[20ch] text-center text-white">
          Immagina il tuo prossimo bagno.
        </h2>
        <p className="mx-auto mb-10 max-w-[56ch] text-center text-white/70">
          Un concept 3D per vedere materiali, luce e atmosfera prima di iniziare.
        </p>

        <div
          ref={box}
          className="group relative h-[clamp(20rem,58vw,34rem)] w-full overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-[#0d2228] shadow-[var(--shadow-lift)] transition-shadow duration-500 hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
        >
          {!webgl ? (
            // Fallback senza WebGL: niente canvas vuoto, si dice cosa c'e'
            // nel concept con la stessa palette.
            <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#17414d] to-[#0d2228] px-6 text-center">
              <div>
                <p className="mb-2 font-display text-lg font-semibold text-white">
                  Il concept 3D non può essere mostrato su questo browser.
                </p>
                <p className="mx-auto max-w-[44ch] text-sm text-white/70">
                  Materiali previsti: grandi lastre effetto pietra, doccia walk-in in
                  vetro, mobile sospeso scuro, specchio circolare retroilluminato.
                </p>
              </div>
            </div>
          ) : visibile ? (
            <BagnoScene animato={animato} qualitaAlta={qualitaAlta} progresso={progresso} />
          ) : (
            <div className="h-full w-full bg-[#0d2228]" />
          )}

          {webgl && (
            <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/45 px-3 py-1.5 text-[11px] font-semibold text-white/90 backdrop-blur-sm transition-opacity duration-500 group-hover:opacity-60">
              Trascina per girare · pizzica per avvicinare
            </span>
          )}
        </div>

        <Reveal as="ul" className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-x-6 gap-y-3">
          {MATERIALI.map((m) => (
            <li key={m} className="flex items-center gap-2 text-sm font-medium text-white/85">
              <Icon name="check" className="size-[18px] shrink-0 text-sky" />
              {m}
            </li>
          ))}
        </Reveal>

        <p className="mx-auto mt-8 max-w-[54ch] text-center text-sm text-white/60">
          Questa è una visualizzazione di stile, non un lavoro eseguito. I nostri
          cantieri veri sono qui sopra, nella sezione Prima e dopo.
        </p>

        <div className="mt-6 flex justify-center">
          <Button href="#preventivo" variant="light" size="lg" className="max-sm:w-full">
            Scopri il progetto
          </Button>
        </div>
      </div>
    </section>
  );
}

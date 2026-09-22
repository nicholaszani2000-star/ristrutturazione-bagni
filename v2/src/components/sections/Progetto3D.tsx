"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { Button } from "@/components/Button";
import { Reveal } from "@/components/Reveal";

/**
 * Sezione 3D.
 *
 * Il pacchetto three/R3F pesa parecchio, e l'80% del traffico arriva da Meta
 * su rete mobile. Per questo la scena:
 *   - si scarica solo quando la sezione sta per entrare a schermo, cosi' non
 *     pesa sul primo caricamento, che e' quello che decide se la pagina viene
 *     abbandonata;
 *   - non viene renderizzata sul server (ssr: false), perche' WebGL non esiste
 *     li'. Questa opzione funziona solo dentro un client component: per questo
 *     l'import sta qui e non nella pagina.
 */
const BagnoScene = dynamic(() => import("@/components/three/BagnoScene"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-sand-100">
      <span className="text-sm font-medium text-muted">Carico il modello…</span>
    </div>
  ),
});

const MOSTRATI = [
  "Piatto doccia con lastra in vetro",
  "Mobile sospeso con lavabo",
  "Specchio retroilluminato",
  "WC e bidet sospesi",
  "Termoarredo",
];

export function Progetto3D() {
  const box = useRef<HTMLDivElement>(null);
  const [visibile, setVisibile] = useState(false);
  const [animato, setAnimato] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;

    const menoMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");

    const obs = new IntersectionObserver(
      ([e]) => {
        // Una volta caricata resta caricata: rimontarla a ogni passaggio
        // vorrebbe dire ricompilare le shader e far scattare la scena.
        if (e.isIntersecting) setVisibile(true);
        setAnimato(e.isIntersecting && !menoMovimento.matches);
      },
      // Parte con un po' di anticipo, cosi' arriva gia' pronta.
      { rootMargin: "300px 0px", threshold: 0.01 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="progetto" className="bg-white py-[length:var(--spacing-section)]">
      <div className="wrap">
        <p className="mb-3 text-center text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-blue-700">
          Il progetto
        </p>
        <h2 className="mx-auto mb-4 max-w-[22ch] text-center">
          Guarda il bagno che ricevi, non una foto di un altro.
        </h2>
        <p className="mx-auto mb-10 max-w-[58ch] text-center text-muted">
          Questo è il 3×2 m dell&apos;offerta, in scala reale. Girarlo con il dito:
          quello che vedi dentro è la stessa lista che trovi qui sotto, alla voce
          «cosa comprende».
        </p>

        <div
          ref={box}
          className="relative h-[clamp(20rem,58vw,32rem)] w-full overflow-hidden rounded-[var(--radius-card)] border border-sand-200 bg-sand-100 shadow-[var(--shadow-lift)]"
        >
          {visibile ? (
            <BagnoScene animato={animato} />
          ) : (
            <div className="h-full w-full bg-sand-100" />
          )}

          <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-navy/85 px-3 py-1.5 text-[11px] font-semibold text-white">
            Trascina per girare · pizzica per avvicinare
          </span>
        </div>

        <Reveal as="ul" className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-x-6 gap-y-3">
          {MOSTRATI.map((m) => (
            <li key={m} className="flex items-center gap-2 text-sm font-medium text-navy">
              <Icon name="check" className="size-[18px] shrink-0 text-blue" />
              {m}
            </li>
          ))}
        </Reveal>

        <p className="mx-auto mt-8 max-w-[52ch] text-center text-sm text-muted">
          Il tuo bagno ha una misura diversa? Il sopralluogo è gratuito e il
          prezzo te lo diamo per intero prima di iniziare.
        </p>
        <div className="mt-5 flex justify-center">
          <Button href="#preventivo" size="lg" className="max-sm:w-full">
            Richiedi il preventivo gratuito
          </Button>
        </div>
      </div>
    </section>
  );
}

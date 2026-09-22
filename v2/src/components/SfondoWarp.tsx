"use client";

import dynamic from "next/dynamic";
import { useMediaQuery, useWebGL } from "@/lib/media";

/**
 * ssr: false perche' una tela WebGL non esiste sul server, e import
 * dinamico perche' la libreria dello shader pesa piu' di tutto il resto
 * del sito: caricandola a parte, la prima schermata arriva con la
 * fotografia — che e' anche l'elemento LCP — e lo shader si aggiunge dopo,
 * senza mai ritardarla.
 */
const TelaWarp = dynamic(() => import("@/components/TelaWarp"), { ssr: false });

/**
 * Strato decorativo sopra la fotografia dell'hero. Non sostituisce niente:
 * se WebGL manca questo componente non rende nulla e resta la fotografia,
 * che e' la versione che il sito ha sempre avuto.
 */
export function SfondoWarp({ className }: { className?: string }) {
  const webgl = useWebGL();
  const menoMovimento = useMediaQuery("(prefers-reduced-motion: reduce)", false);

  if (!webgl) return null;

  return (
    <div aria-hidden className={className}>
      <TelaWarp fermo={menoMovimento} />
    </div>
  );
}

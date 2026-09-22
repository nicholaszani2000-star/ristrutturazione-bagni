"use client";

import { useSyncExternalStore } from "react";

/**
 * Legge una media query senza scrivere stato dentro un effetto.
 *
 * Impostare lo stato appena montati provoca un secondo render a catena, e la
 * regola del compilatore React lo segnala. useSyncExternalStore risolve alla
 * radice: il valore arriva gia' corretto al primo render nel browser, e sul
 * server si usa quello dichiarato, cosi' HTML e prima idratazione coincidono.
 */
export function useMediaQuery(query: string, valoreSulServer: boolean) {
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

/**
 * WebGL puo' mancare: browser vecchi, GPU in lista nera, accelerazione spenta.
 * Il risultato si tiene in cache perche' la verifica crea un canvas, e viene
 * letta a ogni render.
 */
let cacheWebGL: boolean | null = null;
export function supportaWebGL() {
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
 * Sul server risponde sempre "no". Chi legge questo valore decide se montare
 * qualcosa in piu' sopra a una pagina che deve gia' funzionare da sola: se
 * partisse da "si'", l'HTML nascerebbe con un buco al posto della tela.
 */
export function useWebGL() {
  return useSyncExternalStore(
    () => () => {},
    () => supportaWebGL(),
    () => false,
  );
}

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

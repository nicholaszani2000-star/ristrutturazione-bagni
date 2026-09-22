"use client";

import { useEffect, useSyncExternalStore } from "react";
import { SITE } from "@/config/site";
import { iscrivi, stato, statoSulServer } from "@/lib/consenso";
import { avvia, traccia } from "@/lib/ga4";

/**
 * Avvia la misurazione e registra i contatti.
 *
 * I clic su telefono e WhatsApp si intercettano con un solo ascoltatore sul
 * documento, invece di aggiungere un gestore a ogni pulsante. Quei collegamenti
 * stanno in intestazione, hero, modulo, piede e barra fissa: passare da ognuno
 * vorrebbe dire trasformarli tutti in componenti client e sparpagliare il
 * tracciamento in sei file. Cosi' resta in uno, e un pulsante aggiunto domani
 * viene misurato senza toccare niente.
 */
export function Analytics() {
  const consenso = useSyncExternalStore(iscrivi, stato, statoSulServer);
  const attivo = consenso === "accettato";

  useEffect(() => {
    if (!attivo) return;
    avvia(SITE.integrations.ga4Id);
  }, [attivo]);

  useEffect(() => {
    if (!attivo) return;

    const suClic = (e: MouseEvent) => {
      const bersaglio = e.target;
      if (!(bersaglio instanceof Element)) return;
      const a = bersaglio.closest("a[href]");
      if (!a) return;

      const href = a.getAttribute("href") ?? "";
      // In quale sezione stava il pulsante: serve a capire dove si converte.
      const dove = a.closest("section")?.id || a.closest("header,footer")?.tagName.toLowerCase() || "altro";

      if (href.startsWith("tel:")) traccia("contatto_telefono", { posizione: dove });
      else if (href.includes("wa.me")) traccia("contatto_whatsapp", { posizione: dove });
    };

    document.addEventListener("click", suClic);
    return () => document.removeEventListener("click", suClic);
  }, [attivo]);

  return null;
}

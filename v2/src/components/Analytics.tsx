"use client";

import { useEffect, useSyncExternalStore } from "react";
import { SITE } from "@/config/site";
import { iscrivi, stato, statoSulServer } from "@/lib/consenso";
import { avvia, traccia } from "@/lib/ga4";
import { avviaPixel, tracciaMeta } from "@/lib/meta";

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
    avviaPixel(SITE.integrations.metaPixelId);
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

      // Lo stesso gesto va segnato a entrambi: "Contact" e' l'evento
      // standard di Meta per un contatto avviato, ed e' quello su cui si
      // ottimizzano le campagne.
      if (href.startsWith("tel:")) {
        traccia("contatto_telefono", { posizione: dove });
        tracciaMeta("Contact", { canale: "telefono", posizione: dove });
      } else if (href.includes("wa.me")) {
        traccia("contatto_whatsapp", { posizione: dove });
        tracciaMeta("Contact", { canale: "whatsapp", posizione: dove });
      } else if (href.startsWith("mailto:")) {
        traccia("contatto_email", { posizione: dove });
        tracciaMeta("Contact", { canale: "email", posizione: dove });
      }
    };

    document.addEventListener("click", suClic);
    return () => document.removeEventListener("click", suClic);
  }, [attivo]);

  return null;
}

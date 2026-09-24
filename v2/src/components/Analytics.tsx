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

  // ViewContent: chi arriva a vedere il prezzo.
  //
  // Con pochi contatti a settimana e' il segnale intermedio che serve di piu':
  // dice a Meta chi si e' interessato davvero, oltre a chi ha solo aperto la
  // pagina, e diventa un pubblico per il retargeting ("ha visto il prezzo ma
  // non ha scritto"). Una volta per visita.
  //
  // Si osserva la cifra del prezzo, non l'intera sezione. La prima versione
  // chiedeva il 40% della sezione a schermo: su telefono la sezione e' alta
  // due schermi e mezzo, il 40% non entrava mai e l'evento non partiva su
  // nessun telefono — cioe' per l'80% del traffico. Trovato nell'audit.
  useEffect(() => {
    if (!attivo) return;
    const offerta = document.querySelector("#offerta [data-prezzo]");
    if (!offerta || !("IntersectionObserver" in window)) return;

    const osservatore = new IntersectionObserver(
      (voci) => {
        if (!voci.some((v) => v.isIntersecting)) return;
        osservatore.disconnect();
        traccia("vista_offerta", { valore: SITE.offer.price });
        tracciaMeta("ViewContent", {
          content_name: "Bagno 3x2 m chiavi in mano",
          content_category: "Ristrutturazione bagno",
          currency: "EUR",
          value: SITE.offer.price,
        });
      },
      { threshold: 0.6 },
    );
    osservatore.observe(offerta);
    return () => osservatore.disconnect();
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
      const dove =
        a.closest("section")?.id ||
        (a.closest('nav[aria-label="Contatti rapidi"]') ? "barra-mobile" : "") ||
        a.closest("header,footer")?.tagName.toLowerCase() ||
        "altro";

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

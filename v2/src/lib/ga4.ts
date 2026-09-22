/**
 * Google Analytics 4.
 *
 * Lo script non sta nel documento: viene aggiunto solo quando l'utente accetta.
 * Con next/script sarebbe partito al caricamento della pagina, e in Italia i
 * cookie di misurazione vogliono il consenso PRIMA di essere scritti — non un
 * avviso dopo.
 *
 * Le visualizzazioni di pagina da sole non dicono nulla: su una pagina che deve
 * portare contatti, la conversione e' il preventivo inviato, la chiamata, il
 * messaggio su WhatsApp. Sono quelli gli eventi qui sotto.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...argomenti: unknown[]) => void;
  }
}

let avviato = false;

export function avvia(id: string) {
  if (avviato || typeof document === "undefined") return;
  if (!id || id.startsWith("[")) return; // segnaposto non sostituito
  avviato = true;

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  // Funzione dichiarata, non arrow: serve "arguments", che le arrow non hanno.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", id);
}

export function traccia(nome: string, parametri?: Record<string, unknown>) {
  window.gtag?.("event", nome, parametri);
}

/**
 * Meta Pixel.
 *
 * Stessa regola di GA4: lo script non sta nel documento, viene aggiunto solo
 * quando l'utente accetta. Il Pixel scrive il cookie _fbp, che e' un cookie di
 * profilazione a tutti gli effetti: in Italia va consentito PRIMA, non
 * annunciato dopo.
 *
 * Manca di proposito il <noscript><img src="facebook.com/tr?..."></noscript>
 * del frammento originale. Quel pixel parte al caricamento della pagina,
 * sempre, senza passare da nessun consenso: e' esattamente cio' che rende
 * inutile il banner. Chi ha JavaScript spento non viene misurato, ed e'
 * giusto cosi'.
 */

type Fbq = {
  (...argomenti: unknown[]): void;
  callMethod?: (...argomenti: unknown[]) => void;
  queue?: unknown[];
  loaded?: boolean;
  version?: string;
  push?: unknown;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

let avviato = false;

export function avviaPixel(id: string) {
  if (avviato || typeof document === "undefined") return;
  if (!id || id.startsWith("[")) return; // segnaposto non sostituito
  avviato = true;

  // La coda: le chiamate fatte prima che fbevents.js sia scaricato si
  // accumulano e partono al suo arrivo. E' lo stesso meccanismo del frammento
  // ufficiale, riscritto in modo leggibile.
  const n: Fbq = function (...argomenti: unknown[]) {
    if (n.callMethod) n.callMethod(...argomenti);
    else n.queue!.push(argomenti);
  } as Fbq;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];
  window.fbq = n;
  window._fbq = window._fbq ?? n;

  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);

  window.fbq("init", id);
  tracciaMeta("PageView");
}

/**
 * Un identificativo per ogni evento, uguale nel browser e sul server: e' da
 * questo che Meta capisce che le due copie sono lo stesso evento e ne tiene
 * una sola.
 */
function nuovoId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

/**
 * Manda l'evento a Meta per due strade: il Pixel nel browser e la Conversions
 * API attraverso la nostra funzione su Netlify (netlify/functions).
 *
 * Tutto dipende da window.fbq, che esiste solo dopo "Accetta": senza consenso
 * non parte ne' l'una ne' l'altra copia.
 *
 * La copia per il server usa keepalive: un clic su "Chiama" o su WhatsApp
 * porta via la pagina, e senza la richiesta verrebbe interrotta a meta'.
 * Se la funzione non risponde non succede niente di visibile: il Pixel ha gia'
 * fatto la sua parte.
 */
export function tracciaMeta(
  nome: string,
  parametri?: Record<string, unknown>,
  utente?: { em?: string },
) {
  if (!window.fbq) return;
  const id = nuovoId();
  window.fbq("track", nome, parametri ?? {}, { eventID: id });

  try {
    void fetch("/api/meta-evento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ evento: nome, id, url: location.href, parametri, em: utente?.em }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* il Pixel e' gia' partito: basta cosi' */
  }
}

/**
 * Normalizza e cifra un indirizzo email come vuole Meta.
 *
 * L'indirizzo non parte mai in chiaro: viene ridotto a minuscole, ripulito
 * dagli spazi e trasformato in SHA-256. Meta accetta il valore gia' cifrato e
 * lo confronta con la propria versione cifrata dello stesso indirizzo — e'
 * cosi' che si costruisce un pubblico mirato senza spedire a nessuno la
 * rubrica dei clienti.
 *
 * crypto.subtle esiste solo in contesto sicuro (https, o localhost). Se manca,
 * si rinuncia all'abbinamento invece di ripiegare sul testo in chiaro.
 */
export async function emailCifrata(email: string): Promise<string | undefined> {
  const pulita = email.trim().toLowerCase();
  if (!pulita || !globalThis.crypto?.subtle) return undefined;
  const dati = new TextEncoder().encode(pulita);
  const somma = await crypto.subtle.digest("SHA-256", dati);
  return Array.from(new Uint8Array(somma))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Riconosce l'utente a Meta tramite l'indirizzo cifrato.
 *
 * Riceve l'indirizzo gia' cifrato con emailCifrata(). Va chiamata dopo che la
 * persona ha lasciato l'email e ha acconsentito: da quel momento gli eventi
 * del Pixel sono collegabili a quel contatto, ed e' quello che permette le
 * campagne mirate e i pubblici simili.
 */
export function riconosci(id: string, em: string) {
  window.fbq?.("init", id, { em });
}

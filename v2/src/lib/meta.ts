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
/**
 * I dati di chi ha lasciato un contatto, gia' cifrati in SHA-256.
 * Le chiavi sono quelle di Meta: email, telefono, nome, cognome, citta', paese.
 */
export type UtenteCifrato = Partial<Record<"em" | "ph" | "fn" | "ln" | "ct" | "country", string>>;

export function tracciaMeta(
  nome: string,
  parametri?: Record<string, unknown>,
  utente?: UtenteCifrato,
) {
  if (!window.fbq) return;
  const id = nuovoId();
  window.fbq("track", nome, parametri ?? {}, { eventID: id });

  try {
    void fetch("/api/meta-evento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ evento: nome, id, url: location.href, parametri, utente }),
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
async function sha256(testo: string): Promise<string | undefined> {
  if (!testo || !globalThis.crypto?.subtle) return undefined;
  const somma = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(testo));
  return Array.from(new Uint8Array(somma))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function emailCifrata(email: string): Promise<string | undefined> {
  return sha256(email.trim().toLowerCase());
}

/** Solo lettere, minuscole: "D'Angelo" -> "dangelo", "Busto Arsizio" -> "bustoarsizio".
 *  E' la forma in cui Meta confronta nomi e citta'. */
const soloLettere = (v: string) => v.normalize("NFC").toLowerCase().replace(/[^\p{L}]/gu, "");

/**
 * Il numero nella forma che vuole Meta: solo cifre, con il prefisso del paese.
 * Chi scrive "333 123 4567" intende un numero italiano: si aggiunge il 39.
 */
export function telefonoInternazionale(telefono: string) {
  const t = telefono.trim();
  const cifre = t.replace(/\D/g, "");
  if (t.startsWith("+")) return cifre;
  if (cifre.startsWith("00")) return cifre.slice(2);
  if (cifre.length === 12 && cifre.startsWith("39")) return cifre;
  return `39${cifre}`;
}

/**
 * Cifra i dati di una richiesta di sopralluogo per l'abbinamento di Meta.
 * Il nome si divide in nome e cognome alla prima parola; se qualcosa manca,
 * quel campo semplicemente non parte.
 */
export async function utenteCifrato(d: {
  email?: string;
  telefono?: string;
  nome?: string;
  comune?: string;
}): Promise<UtenteCifrato> {
  const [primo = "", ...resto] = (d.nome ?? "").trim().split(/\s+/);
  const valori = {
    em: d.email ? d.email.trim().toLowerCase() : "",
    ph: d.telefono ? telefonoInternazionale(d.telefono) : "",
    fn: soloLettere(primo),
    ln: soloLettere(resto.join("")),
    ct: d.comune ? soloLettere(d.comune) : "",
    country: "it",
  };
  const risultato: UtenteCifrato = {};
  for (const [k, v] of Object.entries(valori)) {
    const h = await sha256(v);
    if (h) risultato[k as keyof UtenteCifrato] = h;
  }
  return risultato;
}

/**
 * Riconosce l'utente a Meta tramite l'indirizzo cifrato.
 *
 * Riceve i dati gia' cifrati (emailCifrata() o utenteCifrato()). Va chiamata
 * dopo che la persona ha lasciato i suoi dati: da quel momento gli eventi del
 * Pixel sono collegabili a quel contatto, ed e' quello che permette le
 * campagne mirate e i pubblici simili.
 */
export function riconosci(id: string, utente: UtenteCifrato | string) {
  window.fbq?.("init", id, typeof utente === "string" ? { em: utente } : utente);
}

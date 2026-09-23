/**
 * Consenso ai cookie di misurazione.
 *
 * Tenuto fuori da React di proposito: la scelta va letta anche da codice che
 * non sta dentro un componente (il caricatore di GA4), e va condivisa fra tutti
 * i punti che la osservano senza passarsela come proprieta'.
 *
 * Il valore vive in localStorage. Puo' mancare o lanciare — finestra anonima,
 * dati del sito bloccati — e in quel caso si ricade su "ignoto", cioe' nessuna
 * misurazione: in dubbio non si traccia.
 */

export type Consenso = "sul-server" | "ignoto" | "accettato" | "rifiutato";

const CHIAVE = "easybagno:consenso-cookie";

let corrente: Consenso | null = null;
const ascoltatori = new Set<() => void>();

function leggi(): Consenso {
  if (corrente !== null) return corrente;
  try {
    const v = localStorage.getItem(CHIAVE);
    corrente = v === "accettato" || v === "rifiutato" ? v : "ignoto";
  } catch {
    corrente = "ignoto";
  }
  return corrente;
}

function avvisaTutti() {
  ascoltatori.forEach((f) => f());
}

export function iscrivi(f: () => void) {
  ascoltatori.add(f);
  return () => {
    ascoltatori.delete(f);
  };
}

export const stato = (): Consenso => leggi();

/**
 * Sul server non esiste localStorage, e non si puo' indovinare.
 *
 * Restituendo un valore a se' stante, l'HTML generato non mostra la fascia ne'
 * carica nulla: dopo l'idratazione il valore vero prende il posto di questo.
 * Cosi' chi ha gia' scelto non vede la fascia comparire e sparire.
 */
export const statoSulServer = (): Consenso => "sul-server";

/**
 * Cosa succede quando qualcuno ci ripensa.
 *
 * Revocare il consenso deve fermare la misurazione, non solo smettere di
 * avviarla alla prossima visita. Tre cose, in quest'ordine:
 *   1. si avvisano gli script gia' caricati in questa pagina, con le funzioni
 *      ufficiali che Google e Meta prevedono per la revoca;
 *   2. si cancellano i cookie che hanno gia' scritto;
 *   3. da li' in avanti, alla visita successiva, gli script non partono piu'.
 *
 * I cookie di Google stanno di solito sul dominio padre (.easybagno.it), non
 * su www: per questo si prova su ogni livello del nome, altrimenti la
 * cancellazione "riesce" e il cookie resta dov'era.
 */
const DI_MISURAZIONE = /^(_ga|_gid|_gat|_fbp|_fbc)/;

function fermaMisurazione() {
  if (typeof window === "undefined") return;

  window.gtag?.("consent", "update", { analytics_storage: "denied", ad_storage: "denied" });
  window.fbq?.("consent", "revoke");

  const parti = location.hostname.split(".");
  const domini = [
    "",
    ...parti.map((_, i) => "." + parti.slice(i).join(".")).filter((d) => d.split(".").length > 2),
  ];
  for (const voce of document.cookie.split(";")) {
    const nome = voce.split("=")[0].trim();
    if (!DI_MISURAZIONE.test(nome)) continue;
    for (const d of domini) {
      document.cookie = `${nome}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d ? `; domain=${d}` : ""}`;
    }
  }
}

export function imposta(v: "accettato" | "rifiutato") {
  if (v === "rifiutato") fermaMisurazione();
  corrente = v;
  try {
    localStorage.setItem(CHIAVE, v);
  } catch {
    // Se non si puo' ricordare la scelta, la si richiedera' di nuovo: fastidioso,
    // ma meglio che misurare senza permesso.
  }
  avvisaTutti();
}

export function azzera() {
  fermaMisurazione();
  corrente = "ignoto";
  try {
    localStorage.removeItem(CHIAVE);
  } catch {
    /* niente da ripulire */
  }
  avvisaTutti();
}

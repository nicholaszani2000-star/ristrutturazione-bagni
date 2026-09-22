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

export function imposta(v: "accettato" | "rifiutato") {
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
  corrente = "ignoto";
  try {
    localStorage.removeItem(CHIAVE);
  } catch {
    /* niente da ripulire */
  }
  avvisaTutti();
}

import { SITE } from "@/config/site";

/**
 * Invio a Supabase.
 *
 * Poche POST, senza la libreria @supabase/supabase-js: per tre chiamate
 * sarebbero centinaia di kB nel pacchetto del browser in cambio di niente.
 *
 * La chiave usata qui e' quella PUBBLICABILE, ed e' pensata per stare nel
 * codice del browser. Con questa chiave si puo' solo inserire (attraverso le
 * funzioni del database) e verificare un buono di cui si conosce il codice:
 * non si puo' leggere un contatto, modificarlo o cancellarlo. Il rischio e'
 * qualche riga di spam, non una fuga di dati.
 */

/**
 * Da dove arriva la visita.
 *
 * Senza questi campi, a campagna avviata non si sa quale annuncio ha
 * portato il contatto: si vede solo che sono arrivati contatti. Sono letti
 * dall'indirizzo, dove Meta e Google li aggiungono da soli.
 */
export function provenienza() {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  // Tagliati alle lunghezze che il database accetta: un referrer lunghissimo
  // non deve far rifiutare una richiesta vera.
  const corto = (v: string | null | undefined, max = 200) => (v ? v.slice(0, max) : undefined);
  return {
    // "||" e non "??": chi apre il sito digitando l'indirizzo ha un
    // referrer vuoto, "", che per "??" e' un valore valido. Finiva in
    // archivio una fonte vuota invece di nessuna fonte.
    fonte: corto(p.get("utm_source") || document.referrer),
    campagna: corto(p.get("utm_campaign")),
    // Quale inserzione: negli indirizzi degli annunci e' utm_content
    // (A-dopo, B-prima-dopo, C-sconto). E' cosi' che si sa quale spegnere.
    annuncio: corto(p.get("utm_content")),
    // Con l'host: il sito risponde anche all'indirizzo tecnico di Netlify,
    // e senza non si distinguerebbe un'iscrizione vera da una prova.
    pagina: corto(window.location.host + window.location.pathname, 500),
  };
}

/**
 * Chiama una funzione del database (RPC) e restituisce la prima riga.
 *
 * Le iscrizioni e le richieste passano da funzioni invece che da un
 * inserimento diretto perche' devono restituire il codice del buono, e il
 * ruolo anonimo non ha il permesso di rileggere le tabelle. Le funzioni fanno
 * gli stessi controlli delle regole di inserimento e restituiscono solo il
 * codice e la scadenza.
 */
async function rpc<T>(funzione: string, parametri: Record<string, unknown>): Promise<T | null> {
  const { url, publishableKey } = SITE.integrations.supabase;
  if (!url || url.startsWith("[")) return null;

  const r = await fetch(`${url}/rest/v1/rpc/${funzione}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: publishableKey,
      Authorization: `Bearer ${publishableKey}`,
    },
    body: JSON.stringify(parametri),
  });
  if (!r.ok) throw new Error(`Supabase ha risposto ${r.status}`);
  const righe = (await r.json()) as T[];
  return righe[0] ?? null;
}

/** Il buono sconto: codice unico e ultimo giorno di validita' (AAAA-MM-GG). */
export type Buono = { codice: string; validoFino: string };

function conProvenienza() {
  const p = provenienza();
  return {
    p_fonte: p.fonte ?? null,
    p_campagna: p.campagna ?? null,
    p_annuncio: p.annuncio ?? null,
    p_pagina: p.pagina ?? null,
  };
}

/**
 * Iscrizione alla lista per lo sconto.
 *
 * Tabella separata dai contatti, e non e' pignoleria: un preventivo e
 * un'iscrizione a una lista hanno basi giuridiche diverse e tempi di
 * conservazione diversi. Tenerli nella stessa tabella vuol dire non poter piu'
 * cancellare gli uni senza toccare gli altri il giorno in cui qualcuno chiede
 * la cancellazione.
 */
export async function inviaIscrizione(
  email: string,
): Promise<{ buono: Buono | null; giaIscritto: boolean }> {
  // Stessa normalizzazione che si usa per l'abbinamento di Meta: minuscole e
  // senza spazi. Senza, "Mario@X.it" e "mario@x.it" diventano due iscritti,
  // e la stessa persona riceve la promozione due volte.
  const riga = await rpc<{ codice: string | null; valido_fino_al: string | null; gia_iscritto: boolean }>(
    "iscrivi_sconto",
    { p_email: email.trim().toLowerCase(), p_consenso: true, ...conProvenienza() },
  );
  if (!riga) return { buono: null, giaIscritto: false };
  // Un'email gia' iscritta non riceve di nuovo il codice: lo vede solo chi si
  // e' iscritto la prima volta, non chiunque conosca quell'indirizzo.
  if (riga.gia_iscritto || !riga.codice || !riga.valido_fino_al) {
    return { buono: null, giaIscritto: riga.gia_iscritto };
  }
  return { buono: { codice: riga.codice, validoFino: riga.valido_fino_al }, giaIscritto: false };
}

/**
 * Richiesta di sopralluogo.
 *
 * Va nella tabella "leads", separata dalle iscrizioni allo sconto per lo
 * stesso motivo scritto sopra. Lo stato, l'id, la data e il codice del buono
 * li decide il database.
 */
export type Richiesta = {
  nome: string;
  telefono: string;
  comune: string;
  tipo_intervento: string;
  quando?: string;
  email?: string;
  messaggio?: string;
};

export async function inviaRichiesta(r: Richiesta): Promise<Buono | null> {
  const riga = await rpc<{ codice: string; valido_fino_al: string }>("richiedi_sopralluogo", {
    p_nome: r.nome,
    p_telefono: r.telefono,
    p_comune: r.comune,
    p_tipo: r.tipo_intervento,
    p_privacy: true,
    p_quando: r.quando ?? null,
    p_email: r.email?.trim().toLowerCase() || null,
    p_messaggio: r.messaggio ?? null,
    ...conProvenienza(),
  });
  return riga ? { codice: riga.codice, validoFino: riga.valido_fino_al } : null;
}

/** Lo stato di un buono, per la pagina /sconto/. Niente dati personali in chiaro. */
export type EsitoVerifica = {
  stato: "VALIDO" | "SCADUTO" | "GIA_USATO" | "NON_TROVATO";
  valido_fino_al: string | null;
  tipo: "sopralluogo" | "email" | null;
  intestatario: string | null;
};

export async function verificaSconto(codice: string): Promise<EsitoVerifica | null> {
  return rpc<EsitoVerifica>("verifica_sconto", { p_codice: codice });
}

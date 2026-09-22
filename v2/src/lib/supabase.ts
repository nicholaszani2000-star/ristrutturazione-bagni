import { SITE } from "@/config/site";

/**
 * Invio di un contatto a Supabase.
 *
 * Una sola POST, senza la libreria @supabase/supabase-js: per un unico
 * inserimento sarebbero centinaia di kB nel pacchetto del browser in cambio di
 * niente.
 *
 * La chiave usata qui e' quella PUBBLICABILE, ed e' pensata per stare nel
 * codice del browser. Sulla tabella esiste una sola policy, di solo
 * inserimento: con questa chiave non si puo' leggere un contatto, modificarlo
 * o cancellarlo. Il rischio e' qualche riga di spam, non una fuga di dati.
 */

type Lead = {
  nome: string;
  telefono: string;
  email?: string;
  comune?: string;
  tipo_intervento?: string;
  messaggio?: string;
  consenso_marketing: boolean;
};

/**
 * Da dove arriva la visita.
 *
 * Senza questi due campi, a campagna avviata non si sa quale annuncio ha
 * portato il contatto: si vede solo che sono arrivati contatti. Sono letti
 * dall'indirizzo, dove Meta e Google li aggiungono da soli.
 */
function provenienza() {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  return {
    fonte: p.get("utm_source") ?? document.referrer ?? undefined,
    campagna: p.get("utm_campaign") ?? undefined,
    pagina: window.location.pathname,
  };
}

export async function inviaLead(lead: Lead) {
  const { url, publishableKey } = SITE.integrations.supabase;
  if (!url || url.startsWith("[")) return;

  const r = await fetch(`${url}/rest/v1/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: publishableKey,
      Authorization: `Bearer ${publishableKey}`,
      // NON TOGLIERE.
      //
      // Non e' un'ottimizzazione: e' l'intestazione che tiene in piedi
      // l'inserimento. Senza, PostgREST aggiunge un RETURNING per restituire
      // la riga appena scritta — e RETURNING ha bisogno del permesso di
      // LETTURA, che al ruolo anonimo abbiamo tolto apposta. Il risultato
      // sarebbe "new row violates row-level security policy" su ogni
      // contatto: verificato, non ipotizzato.
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ ...lead, ...provenienza() }),
  });

  if (!r.ok) throw new Error(`Supabase ha risposto ${r.status}`);
}

"use client";

import { useEffect, useRef, useState } from "react";
import { SITE } from "@/config/site";
import { links } from "@/lib/links";
import { verificaSconto, type EsitoVerifica } from "@/lib/supabase";
import { dataItaliana } from "@/components/BuonoSconto";
import { Icon } from "@/components/Icon";
import { Button, stileBottone } from "@/components/Button";

/**
 * Verifica di un buono sconto.
 *
 * Ci arriva chi inquadra il QR del buono: al sopralluogo e' chi fa il
 * preventivo, ma puo' essere anche il cliente stesso. Il codice sta
 * nell'indirizzo (?c=EB-XXXX-XXXX) e si puo' anche scrivere a mano.
 *
 * Il database risponde solo con lo stato, la scadenza e un nome accorciato
 * ("Mario R."): chi ha il codice non vede telefono, email o comune.
 */

type Stato =
  | { fase: "vuoto" }
  | { fase: "controllo" }
  | { fase: "esito"; codice: string; esito: EsitoVerifica }
  | { fase: "errore" };

/** "eb 7k2m p9qx" -> "EB-7K2M-P9QX". Accetta anche il codice senza trattini. */
export function normalizzaCodice(v: string) {
  const s = v.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const corpo = s.startsWith("EB") ? s.slice(2) : s;
  if (corpo.length !== 8) return v.trim().toUpperCase();
  return `EB-${corpo.slice(0, 4)}-${corpo.slice(4)}`;
}

const STILI = {
  VALIDO: { icona: "check", fondo: "bg-success-bg", colore: "text-success", titolo: "Buono valido" },
  SCADUTO: { icona: "clock", fondo: "bg-[#fdf3e3]", colore: "text-[#8a5a00]", titolo: "Buono scaduto" },
  GIA_USATO: { icona: "lock", fondo: "bg-surface-2", colore: "text-navy", titolo: "Buono già usato" },
  NON_TROVATO: { icona: "minus", fondo: "bg-[#fbeceb]", colore: "text-[#a8321f]", titolo: "Codice non trovato" },
} as const;

export function VerificaSconto() {
  const [stato, setStato] = useState<Stato>({ fase: "vuoto" });
  const [testo, setTesto] = useState("");
  const risultato = useRef<HTMLDivElement>(null);

  async function controlla(grezzo: string) {
    const codice = normalizzaCodice(grezzo);
    if (!codice) return;
    setTesto(codice);
    setStato({ fase: "controllo" });
    try {
      const esito = await verificaSconto(codice);
      setStato(esito ? { fase: "esito", codice, esito } : { fase: "errore" });
    } catch {
      setStato({ fase: "errore" });
    }
  }

  // Il codice arriva dal QR nell'indirizzo: si controlla subito, senza
  // chiedere niente. Letto qui e non con useSearchParams perche' il sito e'
  // statico: la pagina e' la stessa per ogni codice.
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("c");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lettura una tantum dell'indirizzo
    if (c) void controlla(c);
  }, []);

  useEffect(() => {
    if (stato.fase === "esito" || stato.fase === "errore") risultato.current?.focus({ preventScroll: true });
  }, [stato.fase]);

  function invia(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void controlla(testo);
  }

  return (
    <div className="grid gap-8">
      <div aria-live="polite">
        {stato.fase === "controllo" && (
          <p className="rounded-2xl border border-line bg-white p-6 text-muted">Controllo il buono…</p>
        )}

        {stato.fase === "errore" && (
          <div
            ref={risultato}
            tabIndex={-1}
            className="rounded-2xl border border-line bg-white p-6 outline-none"
          >
            <p className="font-display text-lg font-semibold text-navy">Non riesco a controllarlo adesso.</p>
            <p className="mt-2 leading-relaxed text-muted">
              Riprova tra poco, oppure chiamaci al{" "}
              <a href={links.tel} className="tabular font-semibold text-blue-700 underline underline-offset-2">
                {SITE.contact.phoneDisplay}
              </a>
              : lo verifichiamo noi.
            </p>
          </div>
        )}

        {stato.fase === "esito" && <Esito rif={risultato} codice={stato.codice} esito={stato.esito} />}
      </div>

      <form onSubmit={invia} className="rounded-2xl border border-line bg-white p-6">
        <label htmlFor="codice-buono" className="block font-display font-semibold text-navy">
          {stato.fase === "vuoto" ? "Scrivi il codice del buono" : "Controlla un altro codice"}
        </label>
        <p className="mt-1 text-sm text-muted">È sotto il QR, nella forma EB-XXXX-XXXX.</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            id="codice-buono"
            value={testo}
            onChange={(e) => setTesto(e.target.value)}
            placeholder="EB-XXXX-XXXX"
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            className="tabular w-full rounded-xl border border-line bg-white px-4 py-3 text-base uppercase tracking-wider text-ink placeholder:text-muted/70 focus:border-blue focus:ring-2 focus:ring-blue/25 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue"
          />
          <button
            type="submit"
            disabled={stato.fase === "controllo"}
            className={stileBottone("primary", "md", "shrink-0")}
          >
            Verifica
          </button>
        </div>
      </form>
    </div>
  );
}

function Esito({
  rif,
  codice,
  esito,
}: {
  rif: React.RefObject<HTMLDivElement | null>;
  codice: string;
  esito: EsitoVerifica;
}) {
  const s = STILI[esito.stato];
  const scadenza = esito.valido_fino_al ? dataItaliana(esito.valido_fino_al) : null;
  const origine = esito.tipo === "sopralluogo" ? "richiesta di sopralluogo" : "iscrizione con l'email";

  return (
    <div
      ref={rif}
      tabIndex={-1}
      className="overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-card)] outline-none"
    >
      <div className={`flex items-center gap-4 p-6 ${s.fondo}`}>
        <span className={`grid size-12 shrink-0 place-items-center rounded-full bg-white ${s.colore}`}>
          <Icon name={s.icona} className="size-6" />
        </span>
        <div className="min-w-0">
          <p className={`font-display text-xl font-bold ${s.colore}`}>{s.titolo}</p>
          <p className="tabular break-all font-display font-semibold tracking-wide text-navy">{codice}</p>
        </div>
      </div>

      <div className="p-6 leading-relaxed text-ink">
        {esito.stato === "VALIDO" && (
          <>
            <p>
              Sconto del <strong className="font-semibold">{SITE.promo.percentuale}%</strong>{" "}
              {SITE.promo.suCosa} firmato dopo il sopralluogo.
            </p>
            <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-[auto_1fr] sm:gap-x-6">
              {esito.intestatario && (
                <>
                  <dt className="text-muted">Intestato a</dt>
                  <dd className="font-semibold text-navy">{esito.intestatario}</dd>
                </>
              )}
              {scadenza && (
                <>
                  <dt className="text-muted">Valido fino al</dt>
                  <dd className="font-semibold text-navy">{scadenza}</dd>
                </>
              )}
              <dt className="text-muted">Ottenuto con</dt>
              <dd className="font-semibold text-navy">{origine}</dd>
            </dl>
          </>
        )}

        {esito.stato === "SCADUTO" && (
          <p>
            Il buono valeva fino al <strong className="font-semibold">{scadenza}</strong>. Se hai
            fissato il sopralluogo prima di quella data, chiamaci: lo verifichiamo noi.
          </p>
        )}

        {esito.stato === "GIA_USATO" && (
          <p>Questo buono è già stato applicato a un preventivo firmato. Ogni buono vale una volta sola.</p>
        )}

        {esito.stato === "NON_TROVATO" && (
          <p>
            Controlla di averlo scritto bene. Nei codici non ci sono mai le lettere O e I, né i
            numeri 0 e 1: così non si confondono.
          </p>
        )}

        {esito.stato !== "VALIDO" && (
          <p className="mt-4 text-sm text-muted">
            Per qualsiasi dubbio chiamaci al{" "}
            <a href={links.tel} className="tabular font-semibold text-blue-700 underline underline-offset-2">
              {SITE.contact.phoneDisplay}
            </a>
            .
          </p>
        )}
      </div>

      {esito.stato !== "GIA_USATO" && (
        <div className="border-t border-line bg-surface p-6">
          <Button href="/#sopralluogo" size="md" className="w-full sm:w-auto">
            {esito.stato === "VALIDO" ? "Non hai ancora fissato il sopralluogo? Richiedilo" : "Richiedi il sopralluogo gratuito"}
          </Button>
        </div>
      )}
    </div>
  );
}

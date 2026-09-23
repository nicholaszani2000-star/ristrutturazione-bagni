"use client";

import { useState } from "react";
import { SITE } from "@/config/site";
import { links } from "@/lib/links";
import { traccia } from "@/lib/ga4";
import { inviaLead } from "@/lib/supabase";
import { Icon } from "@/components/Icon";
import { stileBottone } from "@/components/Button";
import { Reveal } from "@/components/Reveal";

/**
 * Modulo preventivo — la destinazione di ogni invito all'azione della pagina.
 *
 * Invia a Netlify Forms. Scelta voluta finche' non c'e' Supabase: Netlify
 * riconosce il modulo dall'HTML generato al momento della pubblicazione e
 * raccoglie gli invii senza una riga di backend. Cosi' i contatti arrivano da
 * subito invece di aspettare l'infrastruttura, che e' il modo tipico di perdere
 * le prime settimane di campagna.
 *
 * Perche' funzioni servono tre cose che sembrano superflue e non lo sono:
 *   - data-netlify sul form, che ne fa avvenire il riconoscimento;
 *   - un campo nascosto form-name, perche' l'invio via fetch non passa
 *     dall'attributo name del form;
 *   - un campo esca (honeypot) invisibile: i robot lo compilano, le persone no.
 *
 * L'invio passa da fetch invece che dal comportamento predefinito del browser
 * per restare nella pagina: un utente sbalzato sulla schermata di conferma di
 * Netlify perde il contesto, e chi arriva da un annuncio non torna indietro.
 */

const NOME_MODULO = "preventivo";

type Stato = "fermo" | "invio" | "ok" | "errore";

export function Preventivo() {
  const [stato, setStato] = useState<Stato>("fermo");

  async function invia(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStato("invio");
    try {
      const dati = new FormData(form);
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(dati as unknown as Record<string, string>).toString(),
      });

      setStato("ok");
      form.reset();
      // Evento standard GA4 per un contatto acquisito: e' questo che va
      // segnato come conversione, non la visualizzazione della pagina.
      traccia("generate_lead", { metodo: "modulo", valore_offerta: SITE.offer.price });

      // Copia in archivio, in un try separato di proposito.
      //
      // Netlify ha gia' preso il contatto e fatto partire la notifica: il
      // contatto e' salvo. Se Supabase non risponde, l'utente non deve vedere
      // un errore per una richiesta che invece e' arrivata — lo manderebbe a
      // reinviare, o peggio ad andarsene credendo di non essere passato.
      try {
        await inviaLead({
          nome: String(dati.get("nome") ?? ""),
          telefono: String(dati.get("telefono") ?? ""),
          email: String(dati.get("email") ?? "") || undefined,
          comune: String(dati.get("comune") ?? "") || undefined,
          // Non si sceglie piu' nulla nel modulo: l'offerta e' una sola, e
          // registrarla comunque serve a sapere su cosa e' arrivata la
          // richiesta quando le offerte diventeranno piu' di una.
          tipo_intervento: SITE.offer.title,
          messaggio: String(dati.get("messaggio") ?? "") || undefined,
          consenso_marketing: false,
        });
      } catch {
        // Silenzio voluto: il contatto e' gia' al sicuro su Netlify.
      }
    } catch {
      setStato("errore");
    }
  }

  const campo =
    "w-full rounded-xl border border-line bg-white px-4 py-3 text-base text-ink " +
    "outline-none transition-colors placeholder:text-muted/70 focus:border-blue " +
    "focus:ring-2 focus:ring-blue/25";
  const etichetta = "mb-1.5 block text-sm font-semibold text-navy";

  return (
    <section id="preventivo" className="scroll-mt-24 bg-tint py-[length:var(--spacing-section)]">
      <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-start lg:gap-16">
        <div>
          <p className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-blue-700">
            Preventivo gratuito
          </p>
          <h2 className="mb-4 max-w-[18ch]">Dicci com&apos;è il tuo bagno oggi.</h2>
          <p className="max-w-[52ch] text-muted">
            Ti richiamiamo entro un giorno lavorativo. Il sopralluogo è gratuito
            e senza impegno: alla fine hai un prezzo scritto per intero, non una
            stima al telefono.
          </p>

          <Reveal as="ul" className="mt-8 grid gap-4">
            {[
              { i: "clock", t: "Risposta entro 1 giorno lavorativo" },
              { i: "survey", t: "Sopralluogo gratuito, nessun impegno" },
              { i: "receipt", t: "Prezzo bloccato in contratto prima di iniziare" },
              { i: "lock", t: "I tuoi dati restano a noi, nessun call center" },
            ].map((r) => (
              <li key={r.t} className="flex items-start gap-3 text-sm text-ink">
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-sky-soft">
                  <Icon name={r.i as "clock"} className="size-[17px] text-blue-700" />
                </span>
                {r.t}
              </li>
            ))}
          </Reveal>

          <div className="mt-8 rounded-2xl border border-line bg-white p-5">
            <p className="mb-3 text-sm font-semibold text-navy">Preferisci parlarne subito?</p>
            <div className="flex flex-wrap gap-2.5">
              <a href={links.tel} className={stileBottone("ghost", "md", "text-sm")}>
                <Icon name="phone" className="size-4" />
                {SITE.contact.phoneDisplay}
              </a>
              <a
                href={links.whatsapp}
                target="_blank"
                rel="noopener"
                className={stileBottone("whatsapp", "md", "text-sm")}
              >
                <Icon name="whatsapp" className="size-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Maschera: la card del modulo e' l'elemento piu' grande della
            sezione, e si scopre invece di scivolare dentro. */}
        <Reveal effetto="maschera">
        <div className="rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-[var(--shadow-lift)] sm:p-8">
          {stato === "ok" ? (
            <div className="py-10 text-center">
              <span className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-whatsapp/12">
                <Icon name="check" className="size-7 text-whatsapp" />
              </span>
              <h3 className="mb-2 font-display text-xl font-bold text-navy">Richiesta ricevuta.</h3>
              <p className="mx-auto max-w-[36ch] text-sm text-muted">
                Ti richiamiamo entro un giorno lavorativo. Se hai fretta, scrivici
                su WhatsApp: rispondiamo prima.
              </p>
              <a
                href={links.whatsapp}
                target="_blank"
                rel="noopener"
                className={stileBottone("whatsapp", "md", "mt-6")}
              >
                <Icon name="whatsapp" className="size-5" />
                Scrivici su WhatsApp
              </a>
            </div>
          ) : (
            <form
              name={NOME_MODULO}
              method="POST"
              data-netlify="true"
              netlify-honeypot="lascia-vuoto"
              onSubmit={invia}
              className="grid gap-4"
            >
              {/* Serve all'invio via fetch: senza, il messaggio arriva senza
                  nome e viene scartato. */}
              <input type="hidden" name="form-name" value={NOME_MODULO} />
              {/* Nell'email di Netlify comparirebbe altrimenti una richiesta
                  senza indicazione di cosa e' stato chiesto. */}
              <input type="hidden" name="intervento" value={SITE.offer.title} />

              {/* Esca per i robot: nascosta alle persone e alle tecnologie
                  assistive, quindi solo un automatismo la compila. */}
              <p className="hidden" aria-hidden>
                <label>
                  Lascia vuoto questo campo
                  <input name="lascia-vuoto" tabIndex={-1} autoComplete="off" />
                </label>
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={etichetta} htmlFor="nome">
                    Nome e cognome <span className="text-blue-700">*</span>
                  </label>
                  <input id="nome" name="nome" required autoComplete="name" className={campo} placeholder="Mario Rossi" />
                </div>
                <div>
                  <label className={etichetta} htmlFor="telefono">
                    Telefono <span className="text-blue-700">*</span>
                  </label>
                  <input
                    id="telefono" name="telefono" required type="tel"
                    autoComplete="tel" inputMode="tel" className={campo} placeholder="333 123 4567"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={etichetta} htmlFor="email">Email</label>
                  <input
                    id="email" name="email" type="email" autoComplete="email"
                    inputMode="email" className={campo} placeholder="mario@esempio.it"
                  />
                </div>
                <div>
                  <label className={etichetta} htmlFor="comune">Comune</label>
                  <input id="comune" name="comune" autoComplete="address-level2" className={campo} placeholder="Gallarate" />
                </div>
              </div>

              <div>
                <label className={etichetta} htmlFor="messaggio">Qualcosa che dovremmo sapere?</label>
                <textarea
                  id="messaggio" name="messaggio" rows={3} className={`${campo} resize-y`}
                  placeholder="Misure del bagno, tempi, vincoli condominiali…"
                />
              </div>

              <label className="flex items-start gap-3 text-sm text-muted">
                <input type="checkbox" name="consenso" required className="mt-1 size-4 shrink-0 accent-[#1b84dd]" />
                <span>
                  Ho letto l&apos;
                  <a href="/privacy" className="font-semibold text-blue-700 underline underline-offset-2">
                    informativa privacy
                  </a>{" "}
                  e acconsento al trattamento dei dati per essere ricontattato.{" "}
                  <span className="text-blue-700">*</span>
                </span>
              </label>

              {stato === "errore" && (
                <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  Invio non riuscito. Riprova, oppure scrivici su WhatsApp al{" "}
                  {SITE.contact.whatsappDisplay}.
                </p>
              )}

              <button
                type="submit"
                disabled={stato === "invio"}
                className={stileBottone("primary", "lg", "mt-1 w-full disabled:opacity-60")}
              >
                {stato === "invio" ? "Invio…" : "Richiedi il preventivo gratuito"}
              </button>

              <p className="text-center text-xs text-muted">
                Nessun costo, nessun impegno. Ti ricontattiamo solo noi.
              </p>
            </form>
          )}
        </div>
        </Reveal>
      </div>
    </section>
  );
}

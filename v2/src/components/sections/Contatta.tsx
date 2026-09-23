"use client";

import { useState } from "react";
import { SITE } from "@/config/site";
import { links, euro, euroCent } from "@/lib/links";
import { traccia } from "@/lib/ga4";
import { inviaIscrizione } from "@/lib/supabase";
import { Icon } from "@/components/Icon";
import { stileBottone } from "@/components/Button";
import { Reveal } from "@/components/Reveal";

const NOME_MODULO = "sconto";

const risparmio = (SITE.offer.price * SITE.promo.percentuale) / 100;

/**
 * Due blocchi: scrivere un'email, e lasciarla per lo sconto.
 *
 * Sono due gesti diversi e vanno tenuti separati. Il primo apre il programma
 * di posta con la traccia gia' scritta: chi ha una domanda precisa la fa con
 * le sue parole, senza passare da un modulo che gliele incasella. Il secondo
 * chiede un solo campo, perche' ogni campo in piu' su un'iscrizione e' gente
 * che se ne va.
 *
 * Il consenso e' un caso a parte. Quello del preventivo copre la risposta a
 * una richiesta; questo copre l'invio di comunicazioni commerciali, che e' una
 * finalita' diversa e vuole una spunta sua, non precompilata. Metterli insieme
 * sarebbe piu' comodo e sarebbe irregolare.
 */
export function Contatta() {
  const [stato, setStato] = useState<"fermo" | "invio" | "ok" | "errore">("fermo");

  async function iscrivi(e: React.FormEvent<HTMLFormElement>) {
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
      traccia("iscrizione_sconto", { valore_sconto: risparmio });

      // Copia in archivio, in un try a parte: Netlify ha gia' l'iscrizione, e
      // un errore qui non deve far credere a chi si e' iscritto di non
      // esserci riuscito.
      try {
        await inviaIscrizione(String(dati.get("email") ?? ""));
      } catch {
        /* silenzio voluto */
      }
    } catch {
      setStato("errore");
    }
  }

  const campo =
    "w-full rounded-xl border border-line bg-white px-4 py-3 text-base text-ink " +
    "outline-none transition-colors placeholder:text-muted/70 focus:border-blue " +
    "focus:ring-2 focus:ring-blue/25";

  return (
    <section id="scrivici" className="relative isolate overflow-hidden bg-surface py-[length:var(--spacing-section)]">
      <div aria-hidden className="velo-acqua -z-10" />

      <div className="wrap grid gap-6 lg:grid-cols-2 lg:gap-8">
        {/* ------------------------- scrivi un'email ------------------------- */}
        <Reveal className="filo-luce flex flex-col rounded-[var(--radius-card)] border border-line bg-white p-7 shadow-[var(--shadow-card)] sm:p-9">
          <span className="grid size-12 place-items-center rounded-2xl bg-sky-soft text-blue-700">
            <Icon name="mail" className="size-6" />
          </span>

          <h2 className="mt-6 text-[length:var(--text-h2)]">
            Scrivici{" "}
            <span className="text-blue">un&apos;email.</span>
          </h2>
          <p className="mt-4 leading-relaxed text-muted">
            Se preferisci spiegare a parole tue, apri la posta e scrivi. Il messaggio è già
            impostato con le tre cose che ci servono per risponderti con un prezzo invece che con
            un &laquo;dipende&raquo;.
          </p>

          <p className="mt-6 flex items-center gap-2.5 rounded-xl bg-surface px-4 py-3 font-display text-sm font-semibold text-navy">
            <Icon name="mail" className="size-4 shrink-0 text-blue-700" />
            <span className="break-all">{SITE.contact.email}</span>
          </p>

          <a
            href={links.mail}
            className={stileBottone("primary", "lg", "mt-6 w-full sm:w-auto sm:self-start")}
          >
            Apri la posta e scrivi
            <Icon
              name="chevron"
              className="size-4 -rotate-90 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </a>

          <p className="mt-4 text-sm text-muted">
            Si apre il tuo programma di posta — Gmail, Mail, Outlook, quello che usi.
          </p>
        </Reveal>

        {/* ---------------------- sconto per l'iscrizione ---------------------- */}
        <Reveal className="luce-scorrevole filo-luce flex flex-col rounded-[var(--radius-card)] bg-[linear-gradient(140deg,#0e2c47_0%,#143a5c_42%,#1663b0_100%)] p-7 text-white shadow-[var(--shadow-acqua)] sm:p-9">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/18 px-4 py-1.5 font-display text-[0.8rem] font-semibold">
            <Icon name="receipt" className="size-4" />
            Sconto {SITE.promo.percentuale}%
          </span>

          <h2 className="mt-5 text-[length:var(--text-h2)] text-white">
            Lascia l&apos;email,
            <br />
            <span className="text-sky-200">hai il {SITE.promo.percentuale}%.</span>
          </h2>
          <p className="mt-4 leading-relaxed text-white/85">
            {SITE.promo.percentuale}% {SITE.promo.suCosa}: sul bagno 3×2 m da {euro(SITE.offer.price)} sono{" "}
            <strong className="font-semibold text-white">{euroCent(risparmio)}</strong> in meno.
            Valido {SITE.promo.validita}.
          </p>

          {stato === "ok" ? (
            <div className="mt-7 rounded-2xl bg-white/12 p-6">
              <span className="mb-3 grid size-11 place-items-center rounded-full bg-white/20">
                <Icon name="check" className="size-6" />
              </span>
              <p className="font-display text-lg font-semibold">Iscrizione registrata.</p>
              <p className="mt-2 text-sm leading-relaxed text-white/85">
                Lo sconto è tuo. Ricordalo al sopralluogo: lo troviamo già applicato nel
                preventivo.
              </p>
            </div>
          ) : (
            <form
              name={NOME_MODULO}
              method="POST"
              data-netlify="true"
              netlify-honeypot="lascia-vuoto"
              onSubmit={iscrivi}
              className="mt-7"
            >
              <input type="hidden" name="form-name" value={NOME_MODULO} />
              <p className="hidden" aria-hidden>
                <label>
                  Non compilare: <input name="lascia-vuoto" tabIndex={-1} />
                </label>
              </p>

              <label htmlFor="email-sconto" className="mb-1.5 block text-sm font-semibold">
                La tua email <span className="text-white">*</span>
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="email-sconto"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="mario@esempio.it"
                  className={`${campo} sm:flex-1`}
                />
                <button
                  type="submit"
                  disabled={stato === "invio"}
                  className={stileBottone("secondaryDark", "md", "shrink-0 disabled:opacity-60")}
                >
                  {stato === "invio" ? "Invio…" : `Ottieni il ${SITE.promo.percentuale}%`}
                </button>
              </div>

              {/* Spunta separata e non precompilata: e' una finalita' diversa
                  da quella del preventivo, e va consentita a parte. */}
              <label className="mt-5 flex items-start gap-3 text-sm leading-relaxed text-white">
                <input
                  type="checkbox"
                  name="consenso-marketing"
                  required
                  className="mt-0.5 size-6 shrink-0 accent-[#ffffff]"
                />
                <span>
                  Acconsento a ricevere l&apos;offerta e comunicazioni commerciali da{" "}
                  {SITE.legal.company}. Posso disiscrivermi quando voglio.{" "}
                  <a
                    href="/privacy"
                    className="font-semibold text-white underline underline-offset-2"
                  >
                    Informativa privacy
                  </a>
                  .
                </span>
              </label>

              {stato === "errore" ? (
                <p role="alert" className="mt-4 rounded-xl bg-white/15 px-4 py-3 text-sm">
                  Non è partita. Riprova, oppure scrivici direttamente a {SITE.contact.email}.
                </p>
              ) : null}
            </form>
          )}

          <p className="mt-7 border-t border-white/20 pt-5 text-[0.8rem] leading-relaxed text-white/90">
            {SITE.promo.condizioni}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

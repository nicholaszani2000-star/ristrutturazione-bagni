import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { SITE } from "@/config/site";

import { Contatore } from "@/components/Contatore";
import { Reveal } from "@/components/Reveal";

export function Offer() {
  return (
    <section id="offerta" className="bg-white py-[length:var(--spacing-section)]">
      <div className="wrap">
        <div className="mx-auto mb-14 max-w-[62ch] text-center">
          <p className="mb-3 font-display text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-blue-700">
            L&apos;offerta
          </p>
          <h2 className="text-[length:var(--text-h2)]">
            Il prezzo per intero, prima di iniziare
          </h2>
          <p className="mt-4 text-[length:var(--text-lead)] leading-relaxed text-muted">
            In giro leggi &laquo;a partire da&raquo;. Poi arriva il conto e sale del 20–30%.
            Noi facciamo il contrario: ti diciamo subito quanto costa e cosa comprende.
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          {/* --- Pannello prezzo: resta in vista mentre si scorre l'elenco --- */}
          <div className="grad-brand luce-scorrevole filo-luce rounded-[var(--radius-card)] p-7 text-white shadow-[var(--shadow-acqua)] lg:sticky lg:top-24">
            <span className="inline-flex rounded-full bg-white/18 px-4 py-1.5 font-display text-[0.8rem] font-semibold">
              {SITE.offer.subtitle}
            </span>

            <h3 className="mt-4 text-white">{SITE.offer.title}</h3>
            <p className="mt-1 text-sm text-white/80">{SITE.offer.size}</p>

            <p className="tabular mt-5 font-display text-[length:var(--text-price)] font-bold leading-none tracking-[-0.03em]">
              <Contatore valore={SITE.offer.price} />
            </p>
            <p className="mt-2 text-sm text-white/85">{SITE.offer.vatNote}</p>

            <p className="mt-6 border-t border-white/22 pt-6 font-display text-[1.05rem] font-semibold">
              {SITE.offer.claim}
            </p>

            <Button href="#preventivo" variant="secondaryDark" size="lg" block className="mt-6">
              Richiedi il preventivo gratuito
            </Button>

            <p className="mt-4 text-sm leading-relaxed text-white/85">
              Il tuo bagno ha una misura diversa?{" "}
              <a href="#preventivo" className="font-semibold text-white underline underline-offset-2">
                Mandaci la richiesta
              </a>
              : dopo il sopralluogo ti diamo il prezzo esatto per la tua metratura.
            </p>
          </div>

          {/* --- Incluso / non incluso: è la lista che i concorrenti nascondono --- */}
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="mb-5 flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-success-bg text-success">
                  <Icon name="check" className="size-5" />
                </span>
                Cosa comprende
              </h3>
              <Reveal as="ul" className="grid gap-3">
                {SITE.offer.included.map((item) => (
                  <li key={item} className="grid grid-cols-[22px_1fr] items-start gap-3 text-sm leading-relaxed">
                    <Icon name="check" className="mt-0.5 size-[22px] text-success" />
                    <span>{item}</span>
                  </li>
                ))}
              </Reveal>
            </div>

            <div>
              <h3 className="mb-5 flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-surface-2 text-muted">
                  <Icon name="minus" className="size-5" />
                </span>
                Cosa non comprende
              </h3>
              <Reveal as="ul" className="grid gap-3">
                {SITE.offer.excluded.map((item) => (
                  <li key={item} className="grid grid-cols-[22px_1fr] items-start gap-3 text-sm leading-relaxed text-muted">
                    <Icon name="minus" className="mt-0.5 size-[22px]" />
                    <span>{item}</span>
                  </li>
                ))}
              </Reveal>

              <p className="mt-6 rounded-r-lg border-l-4 border-avviso-bordo bg-avviso-bg px-5 py-4 text-sm leading-relaxed text-avviso-ink">
                {SITE.offer.surprisesNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

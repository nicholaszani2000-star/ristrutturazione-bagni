import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { SITE } from "@/config/site";
import { links, euro } from "@/lib/links";
import { Reveal } from "@/components/Reveal";

/**
 * L'ultima richiesta, prima del modulo.
 *
 * Chi arriva qui ha letto tutto: non serve rispiegare l'offerta, serve
 * togliere l'ultimo attrito, che e' sempre lo stesso — "e se poi mi tocca
 * comprare qualcosa?". Per questo la riga sotto dice cosa NON succede.
 *
 * Fascia blu piena e una sola azione: e' l'unico blocco della pagina che non
 * argomenta, e deve leggersi in due secondi. Telefono e WhatsApp restano
 * sotto, in chiaro, per chi non compila moduli.
 */
export function CtaFinale() {
  return (
    <section className="bg-white">
      <div className="wrap">
        <Reveal className="grad-brand luce-scorrevole filo-luce rounded-[2rem] px-7 py-10 text-white shadow-[var(--shadow-acqua)] sm:px-12 sm:py-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div className="max-w-[34rem]">
              <p className="flex items-center gap-2.5 font-display text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-white/80">
                <Icon name="survey" className="size-4" />
                Pronto a rifare il tuo bagno?
              </p>
              <h2 className="mt-3 text-[length:var(--text-h2)] text-white">
                Partiamo dal sopralluogo. È gratis.
              </h2>
              <p className="mt-4 leading-relaxed text-white/85">
                Veniamo a misurare, guardiamo scarichi e impianti, e ti lasciamo un preventivo
                scritto con il prezzo definitivo. Se non ti convince, finisce lì.
              </p>
            </div>

            <div className="shrink-0 lg:text-right">
              <Button
                href="#preventivo"
                variant="secondaryDark"
                size="lg"
                className="whitespace-nowrap max-sm:w-full"
              >
                Richiedi un preventivo
                <Icon
                  name="chevron"
                  className="size-4 -rotate-90 transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Button>

              <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm lg:justify-end">
                <a
                  href={links.tel}
                  className="inline-flex min-h-6 items-center gap-2 font-display font-semibold text-white underline decoration-white/40 decoration-2 underline-offset-4 transition-colors hover:decoration-white"
                >
                  <Icon name="phone" className="size-4" />
                  <span className="tabular">{SITE.contact.phoneDisplay}</span>
                </a>
                <a
                  href={links.whatsapp}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex min-h-6 items-center gap-2 font-display font-semibold text-white underline decoration-white/40 decoration-2 underline-offset-4 transition-colors hover:decoration-white"
                >
                  <Icon name="whatsapp" className="size-4" />
                  WhatsApp
                </a>
              </p>
            </div>
          </div>

          <p className="mt-9 border-t border-white/20 pt-6 text-sm leading-relaxed text-white/70">
            Nessun anticipo per il sopralluogo · nessun obbligo di firmare · il prezzo di{" "}
            {euro(SITE.offer.price)} resta quello scritto nel preventivo
          </p>
        </Reveal>
      </div>
    </section>
  );
}

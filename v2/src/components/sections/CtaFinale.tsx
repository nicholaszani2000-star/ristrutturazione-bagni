import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { Onda } from "@/components/Onda";
import { SITE } from "@/config/site";
import { links, euro } from "@/lib/links";
import { Reveal } from "@/components/Reveal";

/**
 * L'ultima richiesta, prima del footer.
 *
 * Chi arriva qui ha letto tutto: non serve rispiegare l'offerta, serve
 * togliere l'ultimo attrito, che e' sempre lo stesso — "e se poi mi tocca
 * comprare qualcosa?". Per questo la riga sotto ai pulsanti dice cosa NON
 * succede.
 *
 * Fondo scuro: e' l'unico modo perche' un blocco che ripete un'azione gia'
 * vista tre volte si distingua dal resto invece di sembrare un doppione.
 */
export function CtaFinale() {
  return (
    <section className="relative isolate overflow-hidden bg-navy text-white">
      <div aria-hidden className="velo-acqua-scuro -z-10" />

      <div className="wrap relative py-[clamp(4.5rem,8vw,7.5rem)]">
        <Reveal className="mx-auto max-w-[56ch] text-center">
          <h2 className="text-[length:var(--text-h2)] text-white">
            Partiamo dal sopralluogo. È gratis.
          </h2>
          <p className="mt-4 text-[length:var(--text-lead)] leading-relaxed text-white/75">
            Veniamo a misurare, guardiamo scarichi e impianti, e ti lasciamo un preventivo scritto
            con il prezzo definitivo. Se non ti convince, finisce lì.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Button href="#preventivo" size="lg" className="max-sm:w-full">
              Richiedi il preventivo gratuito
              <Icon
                name="chevron"
                className="size-4 -rotate-90 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Button>
            <Button
              href={links.whatsapp}
              variant="whatsapp"
              size="lg"
              target="_blank"
              rel="noopener"
              className="max-sm:w-full"
            >
              <Icon name="whatsapp" className="size-5" />
              Scrivici su WhatsApp
            </Button>
            <Button href={links.tel} variant="secondaryDark" size="lg" className="max-sm:w-full">
              <Icon name="phone" className="size-5" />
              <span className="tabular">{SITE.contact.phoneDisplay}</span>
            </Button>
          </div>

          <p className="mt-7 text-sm leading-relaxed text-white/60">
            Nessun anticipo per il sopralluogo · nessun obbligo di firmare · il prezzo di{" "}
            {euro(SITE.offer.price)} resta quello scritto nel preventivo
          </p>
        </Reveal>
      </div>

      <div aria-hidden className="absolute inset-x-0 top-0 rotate-180">
        <Onda colore="fill-white" variante="mossa" />
      </div>
      <div aria-hidden className="absolute inset-x-0 bottom-0 translate-y-px">
        <Onda colore="fill-surface" variante="calma" />
      </div>
    </section>
  );
}

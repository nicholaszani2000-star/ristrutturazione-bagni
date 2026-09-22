import Image from "next/image";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { SITE } from "@/config/site";
import { links, euro } from "@/lib/links";
import { Reveal } from "@/components/Reveal";

const TRUST = [
  "Chiavi in mano",
  "Sopralluogo gratuito",
  "Prezzo bloccato in contratto",
  "Impianti certificati",
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-sand-50 pt-14 lg:pt-20">
      <div className="wrap grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        {/* --- Colonna testo: il percorso di conversione --- */}
        <div>
          <p className="mb-3 font-display text-[clamp(1rem,0.95rem+0.4vw,1.25rem)] font-semibold text-blue-700">
            {SITE.brand.payoff}
          </p>

          <h1 className="mb-5 text-[length:var(--text-display)]">
            Ristruttura il tuo bagno.
            <br />
            <span className="grad-brand bg-clip-text text-transparent">
              Pensiamo noi a tutto.
            </span>
          </h1>

          <p className="max-w-[54ch] text-[length:var(--text-lead)] leading-relaxed text-muted">
            Bagno completo chiavi in mano a <strong className="text-ink">{SITE.zone.long}</strong>:
            demolizione, impianti, piastrelle e sanitari. Un unico interlocutore,
            un unico prezzo, scritto per intero prima di iniziare.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="#preventivo" size="lg" className="max-sm:w-full">
              Richiedi preventivo gratuito
            </Button>
            <Button href={links.whatsapp} variant="whatsapp" size="lg" target="_blank" rel="noopener" className="max-sm:w-full">
              <Icon name="whatsapp" className="size-5" />
              WhatsApp
            </Button>
            <Button href={links.tel} variant="ghost" size="lg" className="max-sm:w-full">
              <Icon name="phone" className="size-5" />
              Chiama ora
            </Button>
          </div>

          <Reveal as="ul" className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-6">
            {TRUST.map((t) => (
              <li key={t} className="flex items-center gap-2 text-sm font-medium text-navy">
                <Icon name="check" className="size-[18px] shrink-0 text-blue" />
                {t}
              </li>
            ))}
          </Reveal>
        </div>

        {/* --- Colonna foto: un lavoro vero, non un render --- */}
        <div className="relative">
          <figure className="overflow-hidden rounded-[var(--radius-card)] border border-sand-200 shadow-[var(--shadow-lift)]">
            <Image
              src="/images/bagno-dopo.webp"
              alt="Bagno ristrutturato da Easy-Bagno: microcemento, doccia walk-in con profilo nero, mobile sospeso e specchio retroilluminato"
              width={1200}
              height={2036}
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="h-[clamp(22rem,55vw,34rem)] w-full object-cover object-center"
            />
          </figure>

          {/* Etichetta prezzo: il numero è l'amo, sta sulla foto */}
          <div className="absolute -bottom-6 right-4 rounded-2xl border border-sand-200 bg-white p-5 shadow-[var(--shadow-lift)] sm:right-6">
            <span className="block text-[0.72rem] font-semibold uppercase tracking-wider text-muted">
              {SITE.offer.title}
            </span>
            <span className="tabular block font-display text-[1.9rem] font-bold leading-tight text-navy">
              {euro(SITE.offer.price)}
            </span>
            <span className="block text-xs font-semibold text-blue-700">
              tutto compreso
            </span>
          </div>
        </div>
      </div>

      {/* Onda di chiusura, come sul biglietto da visita */}
      <div aria-hidden className="mt-16 lg:mt-20">
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="block h-[clamp(2.5rem,5vw,5rem)] w-full">
          <path fill="#fff" d="M0 44c180-40 360-40 540 0s360 40 540 0 300-30 360-18V90H0Z" />
        </svg>
      </div>
    </section>
  );
}

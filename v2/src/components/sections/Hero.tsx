import Image from "next/image";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { SITE } from "@/config/site";
import { links, euro } from "@/lib/links";
import { Reveal } from "@/components/Reveal";

const PUNTI = [
  { icon: "tiles", titolo: "Materiali di qualità", testo: "e resistenti" },
  { icon: "design", titolo: "Soluzioni su misura", testo: "per ogni spazio" },
  { icon: "cert", titolo: "Assistenza dedicata", testo: "dal progetto alla consegna" },
] as const;

export function Hero() {
  return (
    <section id="top" className="relative isolate min-h-[max(38rem,88svh)] overflow-hidden bg-navy">
      {/* Fondale: il lavoro vero dell'azienda, non uno stock.
          priority perche' e' l'elemento piu' grande della prima schermata:
          caricarlo tardi vorrebbe dire mostrare un rettangolo scuro proprio
          nel momento in cui si decide se restare. */}
      <Image
        src="/images/bagno-dopo.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />

      {/* Velatura: senza, il testo bianco sulla foto non raggiunge il contrasto
          minimo di leggibilita'. Piu' fitta a sinistra, dove sta il testo. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(9,20,28,0.94)_0%,rgba(9,20,28,0.82)_38%,rgba(9,20,28,0.45)_66%,rgba(9,20,28,0.3)_100%)]"
      />

      <div className="wrap flex min-h-[max(38rem,88svh)] flex-col justify-center py-20 lg:py-24">
        <div className="max-w-[46rem]">
          <p className="mb-5 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-sky">
            Ristrutturazione bagno
          </p>

          <h1 className="mb-6 text-[length:var(--text-display)] text-white">
            Il tuo bagno,
            <br />
            una nuova{" "}
            <span className="bg-gradient-to-r from-sky to-blue bg-clip-text text-transparent">
              esperienza.
            </span>
          </h1>

          <p className="max-w-[46ch] text-[length:var(--text-lead)] leading-relaxed text-white/75">
            Chiavi in mano a <strong className="font-semibold text-white">{SITE.zone.long}</strong>:
            demolizione, impianti, piastrelle e sanitari. Un unico interlocutore,
            un unico prezzo — {euro(SITE.offer.price)} per il bagno 3×2 m,
            scritto per intero prima di iniziare.
          </p>

          {/* Tre modi di rispondere: modulo per chi valuta, WhatsApp per chi
              scrive, telefono per chi ha fretta. Toglierne due per pulizia
              grafica vorrebbe dire perdere chi non usa il terzo. */}
          <div className="mt-9 flex flex-wrap gap-3">
            <Button href="#preventivo" size="lg" className="max-sm:w-full">
              Richiedi preventivo gratuito
              <Icon name="chevron" className="size-4 -rotate-90" />
            </Button>
            <Button href={links.whatsapp} variant="whatsapp" size="lg" target="_blank" rel="noopener" className="max-sm:w-full">
              <Icon name="whatsapp" className="size-5" />
              WhatsApp
            </Button>
            <Button href={links.tel} variant="light" size="lg" className="max-sm:w-full">
              <Icon name="phone" className="size-5" />
              {SITE.contact.phoneDisplay}
            </Button>
          </div>

          <Reveal as="ul" className="mt-12 grid gap-5 border-t border-white/15 pt-7 sm:grid-cols-3">
            {PUNTI.map((p) => (
              <li key={p.titolo} className="flex items-start gap-3">
                <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg border border-white/20 bg-white/5">
                  <Icon name={p.icon} className="size-[18px] text-sky" />
                </span>
                <span className="text-sm leading-snug text-white/80">
                  <strong className="block font-semibold text-white">{p.titolo}</strong>
                  {p.testo}
                </span>
              </li>
            ))}
          </Reveal>
        </div>
      </div>

      {/* Scorciatoia al prima/dopo: chi arriva da un annuncio vuole vedere un
          lavoro finito prima di leggere qualsiasi cosa. */}
      <a
        href="#prima-dopo"
        className="absolute bottom-6 right-5 hidden items-center gap-3 rounded-full border border-white/20 bg-black/35 py-2 pl-3 pr-4 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:bg-black/55 lg:inline-flex"
      >
        <span className="relative size-9 overflow-hidden rounded-full border border-white/30">
          <Image src="/images/bagno-prima.webp" alt="" fill sizes="36px" className="object-cover" />
        </span>
        <Icon name="arrows" className="size-3.5 text-sky" />
        <span className="relative size-9 overflow-hidden rounded-full border border-white/30">
          <Image src="/images/bagno-dopo.webp" alt="" fill sizes="36px" className="object-cover" />
        </span>
        Prima / Dopo
      </a>

      <span
        aria-hidden
        className="pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-white/50 lg:flex"
      >
        Scorri
        <Icon name="chevron" className="size-4 animate-bounce" />
      </span>
    </section>
  );
}

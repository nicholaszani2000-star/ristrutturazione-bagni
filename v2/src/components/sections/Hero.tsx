import Image from "next/image";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { Onda } from "@/components/Onda";
import { SITE } from "@/config/site";
import { links, euro } from "@/lib/links";
import { Reveal } from "@/components/Reveal";
import { Parallasse } from "@/components/Parallasse";
import { Magnetico } from "@/components/Magnetico";

/**
 * Tre promesse, non sei. Sono quelle che un cliente verifica prima di
 * chiamare; il resto della pagina le argomenta.
 */
const PROVE = [
  { icon: "lock", testo: "Prezzo bloccato in contratto" },
  { icon: "cert", testo: "Impianti certificati DM 37/08" },
  { icon: "clock", testo: `Pronto in ${SITE.offer.duration}` },
] as const;

/**
 * L'hero e' chiara, non scura.
 *
 * Prima la fotografia riempiva tutto lo schermo sotto una velatura al 90%: una
 * parete di blu notte. Per un'impresa che vende bagni nuovi e' il messaggio
 * sbagliato — un bagno nuovo e' luce, superfici pulite, riflessi. Quindi la
 * fotografia torna a essere una fotografia, dentro a una cornice, su un fondo
 * bianco illuminato di azzurro; e il testo sta su bianco, dove si legge senza
 * bisogno di coprire niente.
 *
 * La profondita' arriva da strati (velo di luce, cornice, pannello in vetro
 * appoggiato sopra) e non da un motore 3D.
 */
export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-white">
      <div aria-hidden className="velo-acqua -z-10" />

      <div className="wrap grid items-center gap-y-12 pb-[clamp(3.5rem,6vw,6rem)] pt-[clamp(2.5rem,5vw,4.5rem)] lg:grid-cols-[1.03fr_0.97fr] lg:gap-x-14">
        {/* ------------------------------ testo ------------------------------ */}
        <div className="max-w-[34rem]">
          {/* Sopra la piega uno ScrollTrigger non scatterebbe mai: qui
              l'ingresso parte al montaggio, scaglionato nell'ordine in cui si
              legge. */}
          <Reveal effetto="ingresso" scaglionamento={0.1} ritardo={0.1}>
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 font-display text-[0.78rem] font-semibold text-blue-700">
              <Icon name="pin" className="size-3.5" />
              {SITE.zone.long}
            </p>

            <h1 className="text-[length:var(--text-display)]">
              Il tuo bagno nuovo,
              <br />
              <span className="bg-gradient-to-r from-blue-700 via-blue to-sky bg-clip-text text-transparent">
                chiavi in mano.
              </span>
            </h1>

            <p className="mt-6 max-w-[46ch] text-[length:var(--text-lead)] leading-relaxed text-muted">
              Demolizione, impianti, piastrelle e sanitari: un solo
              interlocutore e un solo prezzo, scritto per intero prima di
              iniziare. <strong className="font-semibold text-ink">{euro(SITE.offer.price)}</strong> per
              il bagno 3×2 m, {SITE.offer.vatNote}.
            </p>
          </Reveal>

          {/* Due azioni, non cinque. La primaria e' una sola in tutta la
              schermata; telefono e WhatsApp restano un tocco piu' in basso
              nella barra fissa su telefono e nell'intestazione su desktop. */}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Magnetico className="max-sm:w-full">
              <Button href="#preventivo" size="lg" className="max-sm:w-full">
                Richiedi preventivo gratuito
                <Icon
                  name="chevron"
                  className="size-4 -rotate-90 transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Button>
            </Magnetico>
            <Button href="#prima-dopo" variant="secondary" size="lg" className="max-sm:w-full">
              Guarda i lavori
            </Button>
          </div>

          <p className="mt-5 text-sm text-muted">
            Oppure chiama:{" "}
            <a
              href={links.tel}
              className="tabular font-display font-semibold text-blue-700 underline decoration-sky decoration-2 underline-offset-4 transition-colors hover:text-navy"
            >
              {SITE.contact.phoneDisplay}
            </a>{" "}
            · {SITE.contact.hours}
          </p>

          <Reveal as="ul" className="mt-10 grid gap-3 border-t border-line pt-7 sm:grid-cols-3">
            {PROVE.map((p) => (
              <li key={p.testo} className="flex items-start gap-2.5 text-sm font-medium leading-snug text-ink">
                <Icon name={p.icon} className="mt-0.5 size-[18px] shrink-0 text-blue" />
                {p.testo}
              </li>
            ))}
          </Reveal>
        </div>

        {/* ---------------------------- fotografia ---------------------------- */}
        <Reveal className="relative">
          {/* Alone dietro alla cornice: stacca la fotografia dal bianco senza
              bisogno di un bordo marcato. */}
          <div
            aria-hidden
            className="absolute -inset-y-6 inset-x-0 -z-10 rounded-[3rem] bg-[radial-gradient(60%_60%_at_60%_40%,rgb(86_180_238/0.28),transparent_70%)] blur-xl"
          />

          <div className="filo-luce relative overflow-hidden rounded-[2rem] border border-white shadow-[var(--shadow-acqua)]">
            {/* La parallasse lavora su una scala del 108%: il ritaglio della
                fotografia resta quello scelto, l'eccedenza la taglia la
                cornice. */}
            <div className="aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]">
              <Parallasse ampiezza={26} className="size-full">
                <Image
                  src="/images/bagno-dopo.webp"
                  alt="Bagno ristrutturato da BIODOMUS a Gallarate: doccia a filo pavimento, rivestimento in grès e nicchia illuminata"
                  fill
                  priority
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  className="scale-108 object-cover object-center"
                />
              </Parallasse>
            </div>
          </div>

          {/* Pannello in vetro appoggiato sopra: e' il prezzo, ed e' anche cio'
              che da' spessore alla composizione. */}
          <div className="vetro absolute -bottom-5 left-4 rounded-2xl px-5 py-4 shadow-[var(--shadow-card)] sm:left-6 sm:-bottom-6">
            <p className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-blue-700">
              Bagno 3×2 m, tutto compreso
            </p>
            <p className="tabular mt-1 font-display text-[clamp(1.9rem,1.2rem+2vw,2.6rem)] font-bold leading-none tracking-[-0.03em] text-navy">
              {euro(SITE.offer.price)}
            </p>
          </div>

          <div className="vetro absolute -top-3 right-4 hidden items-center gap-2 rounded-full px-4 py-2 font-display text-[0.78rem] font-semibold text-navy shadow-[var(--shadow-card)] sm:inline-flex">
            <Icon name="check" className="size-4 text-success" />
            Lavoro eseguito, non un rendering
          </div>
        </Reveal>
      </div>

      <Onda colore="fill-surface" variante="calma" />
    </section>
  );
}

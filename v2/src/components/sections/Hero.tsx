import Image from "next/image";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { SITE } from "@/config/site";
import { links, euro } from "@/lib/links";
import { Reveal } from "@/components/Reveal";
import { Parallasse } from "@/components/Parallasse";
import { Magnetico } from "@/components/Magnetico";

/**
 * Quattro promesse verificabili, non quattro aggettivi. Ognuna corrisponde a
 * qualcosa che il resto della pagina dimostra: il sopralluogo sta nel
 * processo, i tempi nel preventivo, le certificazioni nelle garanzie.
 */
const PROMESSE = [
  { icon: "survey", titolo: "Sopralluogo", resto: "gratuito e senza impegno" },
  { icon: "clock", titolo: "10–15 giorni", resto: "data di fine in contratto" },
  { icon: "cert", titolo: "Certificati", resto: "impianti a norma DM 37/08" },
  { icon: "users", titolo: "Un referente", resto: "anche dopo la consegna" },
] as const;

/**
 * L'hero.
 *
 * La fotografia esce dal bordo destro dello schermo invece di stare dentro a
 * una cornice. E' una differenza piccola da scrivere e grossa da guardare: una
 * foto incorniciata e' un'illustrazione dell'articolo, una foto che esce dal
 * bordo e' un ambiente in cui si entra. Il testo resta nella colonna di
 * lettura, dove il contrasto e' quello del bianco e non dipende da nessuna
 * velatura.
 *
 * La profondita' viene da tre strati e nient'altro: il velo di luce dietro al
 * testo, la fotografia con una parallasse minima, il pannello del prezzo
 * appoggiato sopra.
 */
export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-white">
      <div aria-hidden className="velo-acqua -z-10" />

      <div className="grid items-stretch gap-y-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)]">
        {/* ------------------------------ testo ------------------------------ */}
        <div className="flex flex-col justify-center px-5 pt-[clamp(2rem,5vw,3.5rem)] lg:py-[clamp(3.5rem,5vw,6rem)] lg:pl-[max(1.25rem,calc((100vw-76rem)/2))] lg:pr-14">
          <div className="max-w-[37rem]">
            {/* Sopra la piega uno ScrollTrigger non scatterebbe mai: qui
                l'ingresso parte al montaggio, nell'ordine in cui si legge. */}
            <Reveal effetto="ingresso" scaglionamento={0.09} ritardo={0.08}>
              <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-sky-soft px-4 py-1.5 font-display text-[0.78rem] font-semibold text-blue-700">
                <Icon name="pin" className="size-3.5" />
                Ristrutturazione bagni a {SITE.zone.short}
              </p>

              <h1 className="text-[length:var(--text-display)]">
                Il tuo nuovo bagno,
                <br />
                <span className="text-blue">senza stress.</span>
              </h1>

              <p className="mt-6 max-w-[44ch] text-[length:var(--text-lead)] leading-relaxed text-muted">
                Demolizione, impianti, piastrelle e sanitari: un solo
                interlocutore e un solo prezzo, scritto per intero prima di
                iniziare. Tu dici come lo vuoi, al resto pensiamo noi.
              </p>
            </Reveal>

            {/* Quattro colonne su schermo largo, due su telefono: in due righe
                da due si leggono a colpo d'occhio, in una colonna sola
                diventerebbero un elenco da scorrere. */}
            <Reveal as="ul" className="mt-9 grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-4">
              {PROMESSE.map((p) => (
                <li key={p.titolo}>
                  <span className="mb-3 grid size-11 place-items-center rounded-full bg-sky-soft text-blue-700">
                    <Icon name={p.icon} className="size-5" />
                  </span>
                  <strong className="block font-display text-[0.94rem] font-semibold leading-snug text-navy">
                    {p.titolo}
                  </strong>
                  <span className="text-sm leading-snug text-muted">{p.resto}</span>
                </li>
              ))}
            </Reveal>

            <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
              <Magnetico className="max-sm:w-full">
                <Button href="#scrivici" size="lg" className="whitespace-nowrap max-sm:w-full">
                  Scrivici un’email
                  <Icon
                    name="chevron"
                    className="size-4 -rotate-90 transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </Button>
              </Magnetico>

              {/* Seconda azione senza pulsante: due pulsanti affiancati hanno
                  lo stesso peso, e allora non c'e' piu' una primaria. */}
              <a
                href="#processo"
                className="group inline-flex min-h-12 shrink-0 items-center gap-3 whitespace-nowrap font-display font-semibold text-navy transition-colors hover:text-blue-700"
              >
                <span className="grid size-11 place-items-center rounded-full border border-line bg-white text-blue-700 shadow-[0_1px_2px_rgb(20_58_92/0.05)] transition-[border-color,box-shadow] duration-300 group-hover:border-sky group-hover:shadow-[var(--shadow-card)]">
                  <Icon name="chevron" className="size-4" />
                </span>
                Scopri come funziona
              </a>
            </div>

            <p className="mt-7 text-sm text-muted">
              Oppure chiama{" "}
              <a
                href={links.tel}
                className="tabular font-display font-semibold text-blue-700 underline decoration-sky decoration-2 underline-offset-4 transition-colors hover:text-navy"
              >
                {SITE.contact.phoneDisplay}
              </a>{" "}
              · {SITE.contact.hours}
            </p>
          </div>
        </div>

        {/* ---------------------------- fotografia ---------------------------- */}
        <div className="relative min-h-[21rem] sm:min-h-[26rem] lg:min-h-[44rem] lg:self-stretch">
          <div className="absolute inset-0 overflow-hidden max-lg:mx-5 max-lg:rounded-[1.75rem] lg:rounded-bl-[3.5rem]">
            <Parallasse ampiezza={22} className="size-full">
              <Image
                src="/images/bagno-dopo.webp"
                alt="Bagno ristrutturato da BIODOMUS a Gallarate: doccia a filo pavimento, rivestimento in grès e nicchia illuminata"
                fill
                priority
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="scale-106 object-cover object-center"
              />
            </Parallasse>

            {/* Firma: l'unico elemento non geometrico della pagina. Il velo
                sotto serve al contrasto — su una fotografia il bianco puro non
                e' mai garantito. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_top,rgb(10_28_44/0.55),transparent)]"
            />
            <p className="absolute bottom-7 right-7 max-w-[15ch] text-right font-[family-name:var(--font-scritto)] text-[clamp(1.4rem,1rem+1.4vw,2.05rem)] leading-tight text-white drop-shadow-[0_1px_8px_rgb(10_28_44/0.5)]">
              {SITE.brand.payoff}
            </p>
          </div>

          <div className="vetro absolute bottom-7 left-7 rounded-2xl px-5 py-4 shadow-[var(--shadow-lift)] max-sm:hidden">
            <p className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-blue-700">
              Bagno 3×2 m, tutto compreso
            </p>
            <p className="tabular mt-1 font-display text-[clamp(1.9rem,1.2rem+1.6vw,2.4rem)] font-bold leading-none tracking-[-0.03em] text-navy">
              {euro(SITE.offer.price)}
            </p>
            <p className="mt-1 text-xs text-muted">{SITE.offer.vatNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

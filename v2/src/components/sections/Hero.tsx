import Image from "next/image";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { SITE } from "@/config/site";
import { links, euro } from "@/lib/links";
import { Reveal } from "@/components/Reveal";
import { Parallasse } from "@/components/Parallasse";
import { Magnetico } from "@/components/Magnetico";
import { SfondoWarp } from "@/components/SfondoWarp";

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
      {/* Lo spazio per la parallasse arriva da una scala del 10%, non da un
          contenitore piu' alto. Alzando il contenitore cambiava il ritaglio
          della fotografia, e l'inquadratura non e' una cosa da modificare per
          far posto a un effetto: con la scala la composizione resta centrata
          dov'era, e l'eccedenza viene tagliata dal riquadro esterno. */}
      <div aria-hidden className="absolute inset-0 -z-20 overflow-hidden">
        <Parallasse ampiezza={40} className="absolute inset-0">
          <Image
            src="/images/bagno-dopo.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="scale-110 object-cover object-center"
          />
        </Parallasse>
      </div>

      {/* Lo shader del marchio, sopra la fotografia e sotto la velatura.
          La maschera lo fa svanire verso destra sugli schermi larghi e verso
          il basso su quelli stretti: da una parte il colore dell'azienda
          dietro al testo, dall'altra il bagno vero che resta in vista. E' il
          lavoro finito a vendere, non il fondale — quindi il fondale si
          ritira dove c'e' la fotografia invece di coprirla. */}
      <SfondoWarp className="comparsa pointer-events-none absolute inset-0 -z-[15] [mask-image:linear-gradient(to_bottom,#000_0%,#000_46%,transparent_88%)] lg:[mask-image:linear-gradient(105deg,#000_0%,#000_40%,transparent_80%)]" />

      {/* Velatura: senza, il testo chiaro sul fondale non raggiunge il
          contrasto minimo di leggibilita'.

          Due profili, perche' due impaginazioni. Da lg in su il testo sta a
          sinistra e la fotografia a destra, quindi la velatura corre in
          orizzontale e si dirada dove non c'e' niente da leggere. Sotto lg il
          testo occupa tutta la larghezza e si sviluppa in verticale: la stessa
          sfumatura orizzontale lasciava la parte bassa del paragrafo su un
          fondale chiaro, ed era li' che il contrasto scendeva a 2.68:1 —
          misurato, non stimato, e sbagliato gia' prima di questo shader. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(9,20,28,0.78)_0%,rgba(9,20,28,0.76)_58%,rgba(9,20,28,0.55)_100%)] lg:bg-[linear-gradient(100deg,rgba(9,20,28,0.94)_0%,rgba(9,20,28,0.82)_38%,rgba(9,20,28,0.45)_66%,rgba(9,20,28,0.3)_100%)]"
      />

      <div className="wrap flex min-h-[max(38rem,88svh)] flex-col justify-center py-20 lg:py-24">
        <div className="max-w-[46rem]">
          {/* Ingresso invece di comparsa allo scorrimento: qui siamo sopra la
              piega, e uno scroll trigger non scatterebbe mai. Lo scaglionamento
              fa entrare occhiello, titolo e sottotitolo in quest'ordine, che e'
              anche l'ordine in cui si leggono. */}
          <Reveal effetto="ingresso" scaglionamento={0.12} ritardo={0.15}>
            <p className="mb-5 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-sky-200">
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
          </Reveal>

          {/* Tre modi di rispondere: modulo per chi valuta, WhatsApp per chi
              scrive, telefono per chi ha fretta. Toglierne due per pulizia
              grafica vorrebbe dire perdere chi non usa il terzo. */}
          <div className="mt-9 flex flex-wrap gap-3">
            <Magnetico className="max-sm:w-full">
              <Button href="#preventivo" size="lg" className="max-sm:w-full">
                Richiedi preventivo gratuito
                <Icon name="chevron" className="size-4 -rotate-90" />
              </Button>
            </Magnetico>
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

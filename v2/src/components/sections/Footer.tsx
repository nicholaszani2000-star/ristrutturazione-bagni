import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Icon } from "@/components/Icon";
import { SITE } from "@/config/site";
import { links } from "@/lib/links";

const NAVIGA = [
  { href: "#offerta", testo: "L'offerta" },
  { href: "#prima-dopo", testo: "Prima e dopo" },
  { href: "#progetto", testo: "Concept 3D" },
  { href: "#preventivo", testo: "Preventivo gratuito" },
];

export function Footer() {
  const L = SITE.legal;
  return (
    <footer className="bg-navy pb-28 pt-16 text-white/70 lg:pb-16">
      <div className="wrap grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr]">
        <div>
          <Logo tono="chiaro" />
          <p className="mt-4 max-w-[36ch] text-sm leading-relaxed">
            Ristrutturazione bagni chiavi in mano a {SITE.zone.long}. Un unico
            interlocutore, un prezzo scritto per intero prima di iniziare.
          </p>
        </div>

        <nav aria-label="Sezioni del sito">
          <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-white">
            Naviga
          </h2>
          <ul className="grid gap-2.5 text-sm">
            {NAVIGA.map((v) => (
              <li key={v.href}>
                <Link href={v.href} className="transition-colors hover:text-sky">
                  {v.testo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-white">
            Contatti
          </h2>
          <ul className="grid gap-2.5 text-sm">
            <li>
              <a href={links.tel} className="inline-flex items-center gap-2 transition-colors hover:text-sky">
                <Icon name="phone" className="size-4 text-sky" />
                <span className="tabular">{SITE.contact.phoneDisplay}</span>
              </a>
            </li>
            <li>
              <a href={links.whatsapp} target="_blank" rel="noopener" className="inline-flex items-center gap-2 transition-colors hover:text-sky">
                <Icon name="whatsapp" className="size-4 text-sky" />
                <span className="tabular">{SITE.contact.whatsappDisplay}</span>
              </a>
            </li>
            <li>
              <a href={links.mail} className="inline-flex items-center gap-2 break-all transition-colors hover:text-sky">
                <Icon name="mail" className="size-4 shrink-0 text-sky" />
                {SITE.contact.email}
              </a>
            </li>
            <li className="flex items-start gap-2 pt-1">
              <Icon name="pin" className="mt-0.5 size-4 shrink-0 text-sky" />
              <span>
                {L.address}, {L.zip} {L.city} ({L.province})
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Icon name="clock" className="mt-0.5 size-4 shrink-0 text-sky" />
              {SITE.contact.hours}
            </li>
          </ul>
        </div>
      </div>

      {/* Dati societari: obbligatori su un sito che vende, e sono anche il
          segnale piu' economico che dietro c'e' un'azienda vera. */}
      <div className="wrap mt-12 flex flex-col gap-3 border-t border-white/12 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
        <p>
          {L.company} · P.IVA {L.vat} · {L.address}, {L.zip} {L.city} ({L.province})
          <span className="hidden sm:inline"> · </span>
          <br className="sm:hidden" />
          PEC {L.pec} · SDI {L.sdi}
        </p>
        <p className="flex gap-4">
          <Link href="/privacy" className="underline underline-offset-2 transition-colors hover:text-sky">
            Privacy
          </Link>
          <Link href="/cookie" className="underline underline-offset-2 transition-colors hover:text-sky">
            Cookie
          </Link>
        </p>
      </div>
    </footer>
  );
}

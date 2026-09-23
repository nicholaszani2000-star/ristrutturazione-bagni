import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { SITE } from "@/config/site";
import { links } from "@/lib/links";

/**
 * Quattro voci, non sette.
 *
 * Su una pagina singola il menu non serve a navigare — si puo' scorrere — ma
 * a dichiarare cosa c'e' dentro prima che il visitatore decida se scorrere.
 * Per questo le voci sono le domande che si fa: cosa fanno, come lavorano,
 * cosa hanno gia' fatto, e le obiezioni.
 *
 * Su telefono spariscono: li' la navigazione e' la barra fissa in basso, e un
 * menu a panino in piu' sarebbe un tocco in piu' per arrivare alla stessa
 * cosa.
 */
const VOCI = [
  { href: "#servizi", testo: "Servizi" },
  { href: "#processo", testo: "Come funziona" },
  { href: "#prima-dopo", testo: "Lavori" },
  { href: "#domande", testo: "Domande" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line-soft bg-white/85 backdrop-blur-xl backdrop-saturate-150">
      <div className="wrap flex min-h-[4.25rem] items-center justify-between gap-6">
        <Link href="#top" aria-label={`${SITE.brand.name}, torna all'inizio`} className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Sezioni della pagina" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {VOCI.map((v) => (
              <li key={v.href}>
                <Link
                  href={v.href}
                  // L'underline cresce dal centro al passaggio: e' l'unica
                  // micro-interazione del menu, e basta.
                  className="group relative inline-flex min-h-6 items-center text-[0.94rem] font-medium text-ink transition-colors hover:text-blue-700"
                >
                  {v.testo}
                  <span
                    aria-hidden
                    className="absolute -bottom-0.5 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-blue transition-[width] duration-300 ease-out group-hover:w-full"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <a
            href={links.tel}
            className="hidden items-center gap-2 font-display font-semibold text-navy transition-colors hover:text-blue-700 sm:inline-flex lg:hidden xl:inline-flex"
          >
            <span className="grid size-9 place-items-center rounded-full bg-sky-soft text-blue-700">
              <Icon name="phone" className="size-4" />
            </span>
            <span className="tabular">{SITE.contact.phoneDisplay}</span>
          </a>

          <Button href="#scrivici" className="max-md:hidden">
            Scrivici
            <Icon
              name="chevron"
              className="size-4 -rotate-90 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Button>
        </div>
      </div>
    </header>
  );
}

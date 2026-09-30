import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { VerificaSconto } from "@/components/VerificaSconto";
import { SITE } from "@/config/site";

/**
 * La pagina a cui porta il QR del buono sconto.
 *
 * Fuori da Google (noindex) e fuori dalla sitemap: e' uno strumento, non una
 * pagina da trovare cercando. Niente canonical: ogni indirizzo porta un codice
 * diverso e nessuno di questi va indicizzato.
 */
export const metadata: Metadata = {
  title: { absolute: `Verifica buono sconto | ${SITE.brand.short}` },
  description: `Controlla se un buono sconto ${SITE.brand.short} è valido, scaduto o già usato.`,
  robots: { index: false, follow: false },
};

export default function PaginaSconto() {
  return (
    <>
      <header className="border-b border-line bg-white">
        <div className="wrap flex min-h-[4.25rem] items-center">
          <Link href="/" aria-label={`${SITE.brand.name} Ristrutturazione bagno, torna alla pagina principale`}>
            <Logo />
          </Link>
        </div>
      </header>

      <main id="contenuto" className="bg-surface">
        <div className="wrap max-w-[40rem] py-12 sm:py-16">
          <p className="font-display text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-blue-700">
            Buono sconto {SITE.promo.percentuale}%
          </p>
          <h1 className="mt-3 mb-8 text-[clamp(1.8rem,1.4rem+1.6vw,2.5rem)]">Verifica del buono</h1>
          <VerificaSconto />
        </div>
      </main>
    </>
  );
}

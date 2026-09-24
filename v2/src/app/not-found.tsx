import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: `Pagina non trovata — ${SITE.brand.name}`,
  robots: { index: false, follow: true },
};

/**
 * La 404.
 *
 * Prima era quella predefinita di Next, in inglese e senza marchio: chi
 * arrivava da un link vecchio o sbagliato vedeva "This page could not be
 * found" e se ne andava. Qui c'e' una strada sola, verso la pagina che vende.
 */
export default function NonTrovata() {
  return (
    <>
      <header className="border-b border-line bg-white">
        <div className="wrap flex min-h-[4.25rem] items-center">
          <Link href="/" aria-label={`${SITE.brand.name}, torna alla pagina principale`}>
            <Logo />
          </Link>
        </div>
      </header>

      <main id="contenuto" className="wrap max-w-[40rem] py-20 text-center">
        <p className="font-display text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-blue-700">
          Errore 404
        </p>
        <h1 className="mt-4 text-[clamp(1.9rem,1.5rem+1.6vw,2.7rem)]">Questa pagina non c&apos;è.</h1>
        <p className="mt-4 leading-relaxed text-muted">
          Forse il link è vecchio o c&apos;è un errore nell&apos;indirizzo. Il bagno chiavi in mano
          a {SITE.zone.short} è nella pagina principale.
        </p>
        <Button href="/" size="lg" className="mt-8">
          Vai alla pagina principale
        </Button>
      </main>
    </>
  );
}

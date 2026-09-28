import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/Logo";
import { Icon } from "@/components/Icon";
import { stileBottone } from "@/components/Button";
import { SITE } from "@/config/site";
import { links } from "@/lib/links";
import { AREA_SERVITA, ID, briciole, jsonLd } from "@/lib/dati-strutturati";

/**
 * Impaginazione per le pagine di approfondimento previste in
 * config/pagine.ts (PAGINE_FUTURE). Oggi non la usa nessuna pagina: e' pronta
 * perche' la prima si possa pubblicare senza reinventare la struttura.
 *
 * Cosa da' gia' fatto:
 *  - briciole di pane visibili (Home › pagina) e le stesse in BreadcrumbList;
 *  - un solo H1, il titolo passato; i sottotitoli del contenuto vanno in H2;
 *  - il servizio nei dati strutturati, collegato all'impresa della home (@id);
 *  - il riquadro con sopralluogo, telefono e WhatsApp, come nella home;
 *  - il collegamento di ritorno alla home e alle pagine legali.
 *
 * I collegamenti alle sezioni della home sono "/#...", non "#...": da qui
 * un'ancora sola porterebbe a un punto che in questa pagina non esiste.
 *
 * Il contenuto deve essere proprio di questa pagina. Lo stesso testo della
 * home con il nome di un comune cambiato e' una "doorway page".
 */
export function PaginaServizio({
  percorso,
  titolo,
  briciola,
  introduzione,
  servizio,
  children,
}: {
  /** Come in config/pagine.ts, con la barra finale. */
  percorso: string;
  /** L'H1 della pagina. */
  titolo: string;
  /** Il nome breve nelle briciole di pane. */
  briciola: string;
  introduzione: ReactNode;
  /** Il servizio descritto, per i dati strutturati. */
  servizio: { nome: string; descrizione: string };
  children: ReactNode;
}) {
  const dati = [
    briciole([
      { nome: "Home", percorso: "/" },
      { nome: briciola, percorso },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: servizio.nome,
      description: servizio.descrizione,
      provider: { "@id": ID.impresa },
      areaServed: AREA_SERVITA,
      url: `${SITE.brand.url}${percorso}`,
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(dati) }} />

      <header className="border-b border-line bg-white">
        <div className="wrap flex min-h-[4.25rem] items-center justify-between gap-4">
          <Link href="/" aria-label={`${SITE.brand.name} Ristrutturazione bagno, torna alla pagina principale`}>
            <Logo />
          </Link>
          <a href={links.tel} className="tabular inline-flex min-h-11 items-center gap-2 font-display font-semibold text-navy">
            <Icon name="phone" className="size-4 text-blue-700" />
            {SITE.contact.phoneDisplay}
          </a>
        </div>
      </header>

      <main id="contenuto" className="wrap max-w-[52rem] py-12">
        <nav aria-label="Percorso" className="mb-6 text-sm text-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="underline underline-offset-2 hover:text-blue-700">
                Home
              </Link>
            </li>
            <li aria-hidden>›</li>
            <li aria-current="page" className="font-semibold text-navy">
              {briciola}
            </li>
          </ol>
        </nav>

        <h1 className="text-[clamp(1.9rem,1.5rem+1.6vw,2.7rem)]">{titolo}</h1>
        <div className="mt-5 text-[length:var(--text-lead)] leading-relaxed text-muted">{introduzione}</div>

        <div className="mt-10 grid gap-7 leading-relaxed text-ink [&_a]:font-semibold [&_a]:text-blue-700 [&_a]:underline [&_a]:underline-offset-2 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-navy [&_li]:mb-1.5 [&_ul]:list-disc [&_ul]:pl-5">
          {children}
        </div>

        <aside className="mt-14 rounded-[var(--radius-card)] border border-line bg-surface p-7">
          <p className="font-display text-xl font-bold text-navy">Sopralluogo gratuito a {SITE.zone.long}</p>
          <p className="mt-2 text-muted">
            Veniamo a misurare e ti lasciamo un preventivo scritto, con il prezzo definitivo.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link href="/#sopralluogo" className={stileBottone("primary", "md")}>
              Richiedi il sopralluogo
            </Link>
            <a href={links.tel} className={stileBottone("secondary", "md")}>
              <Icon name="phone" className="size-4" />
              <span className="tabular">{SITE.contact.phoneDisplay}</span>
            </a>
            <a href={links.whatsapp} target="_blank" rel="noopener" className={stileBottone("whatsapp", "md")}>
              <Icon name="whatsapp" className="size-4" />
              WhatsApp
            </a>
          </div>
        </aside>

        <p className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-6 text-sm">
          <Link href="/" className="font-semibold text-blue-700 underline underline-offset-2">
            ← Ristrutturazione bagno a Gallarate: torna alla home
          </Link>
          <Link href="/privacy/" className="text-muted underline underline-offset-2">
            Privacy
          </Link>
          <Link href="/cookie/" className="text-muted underline underline-offset-2">
            Cookie
          </Link>
        </p>
      </main>
    </>
  );
}

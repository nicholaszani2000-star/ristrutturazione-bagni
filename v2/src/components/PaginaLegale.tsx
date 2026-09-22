import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/Logo";
import { SITE } from "@/config/site";

/**
 * Impaginazione comune alle pagine legali.
 *
 * Volutamente spoglia: niente barra fissa, niente inviti all'azione. Chi apre
 * l'informativa sta verificando, non comprando; riempirla di pulsanti la fa
 * sembrare un'altra pagina di vendita e ottiene l'effetto opposto.
 */
export function PaginaLegale({
  titolo,
  aggiornamento,
  children,
}: {
  titolo: string;
  aggiornamento: string;
  children: ReactNode;
}) {
  return (
    <>
      <header className="border-b border-line bg-white">
        <div className="wrap flex min-h-[4.25rem] items-center">
          <Link href="/" aria-label={`${SITE.brand.name}, torna alla pagina principale`}>
            <Logo />
          </Link>
        </div>
      </header>

      <main id="contenuto" className="wrap max-w-[52rem] py-14">
        <h1 className="mb-2 text-[clamp(1.9rem,1.5rem+1.6vw,2.7rem)]">{titolo}</h1>
        <p className="mb-10 text-sm text-muted">Ultimo aggiornamento: {aggiornamento}</p>
        <div className="grid gap-7 leading-relaxed text-ink [&_a]:font-semibold [&_a]:text-blue-700 [&_a]:underline [&_a]:underline-offset-2 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-navy [&_li]:mb-1.5 [&_p]:text-[0.98rem] [&_ul]:list-disc [&_ul]:pl-5">
          {children}
        </div>

        <p className="mt-12 border-t border-line pt-6">
          <Link href="/" className="font-semibold text-blue-700 underline underline-offset-2">
            ← Torna alla pagina principale
          </Link>
        </p>
      </main>
    </>
  );
}

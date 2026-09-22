import type { Metadata } from "next";
import Link from "next/link";
import { PaginaLegale } from "@/components/PaginaLegale";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: `Cookie policy — ${SITE.brand.name}`,
  description: "Quali cookie usa il sito EasyBagno.it.",
  robots: { index: true, follow: true },
};

export default function Cookie() {
  return (
    <PaginaLegale titolo="Cookie policy" aggiornamento="settembre 2026">
      <p>
        I cookie sono piccoli file che un sito salva sul tuo dispositivo. Non
        tutti servono alla stessa cosa, e non tutti richiedono il tuo consenso.
      </p>

      <div>
        <h2>Cosa usa questo sito, oggi</h2>
        <p>
          Al momento questo sito usa <strong>solo cookie tecnici</strong>, necessari a
          farlo funzionare e a proteggere l&apos;invio del modulo dagli abusi. Per i
          cookie tecnici la normativa non richiede il consenso preventivo, e per
          questo non vedi una finestra che te lo chiede.
        </p>
        <p>
          Non sono attivi cookie di profilazione, né strumenti di misurazione
          statistica o di pubblicità.
        </p>
      </div>

      <div>
        <h2>Cosa cambierà</h2>
        <p>
          È previsto l&apos;inserimento di strumenti di misurazione del traffico e di
          misurazione delle campagne pubblicitarie. Dal momento in cui saranno
          attivi comparirà una finestra per raccogliere il tuo consenso prima che
          vengano installati, e questa pagina sarà aggiornata con l&apos;elenco
          puntuale dei cookie e delle loro durate.
        </p>
      </div>

      <div>
        <h2>Come gestirli dal browser</h2>
        <p>
          Puoi cancellare o bloccare i cookie dalle impostazioni del tuo browser.
          Bloccando quelli tecnici, però, alcune parti del sito potrebbero smettere
          di funzionare — per esempio l&apos;invio del modulo.
        </p>
      </div>

      <div>
        <h2>Dati personali</h2>
        <p>
          Come trattiamo i dati che ci lasci è spiegato nell&apos;{" "}
          <Link href="/privacy">informativa privacy</Link>.
        </p>
      </div>
    </PaginaLegale>
  );
}

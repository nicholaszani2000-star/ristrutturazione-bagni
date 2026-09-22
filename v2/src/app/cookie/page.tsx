import type { Metadata } from "next";
import Link from "next/link";
import { PaginaLegale } from "@/components/PaginaLegale";
import { RevocaConsenso } from "@/components/RevocaConsenso";
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
        <h2>Cookie tecnici — sempre attivi</h2>
        <p>
          Servono a far funzionare il sito e a proteggere l&apos;invio del modulo dagli
          abusi. Per questi la normativa non richiede il consenso preventivo.
        </p>
        <p>
          Ricordiamo anche la tua scelta sui cookie di misurazione, salvandola nel
          browser: senza, ti chiederemmo il consenso a ogni visita.
        </p>
      </div>

      <div>
        <h2>Cookie di misurazione — solo se acconsenti</h2>
        <p>
          Usiamo <strong>Google Analytics 4</strong> per capire quante persone
          visitano il sito, da dove arrivano e quali pagine leggono. Ci serve a
          sapere se la pubblicità che paghiamo porta richieste vere.
        </p>
        <p>
          <strong>Non partono da soli.</strong> Finché non premi «Accetta» nella
          fascia in fondo alla pagina, lo script di Google non viene nemmeno
          scaricato e nessun cookie di misurazione viene scritto. Se premi
          «Rifiuta», non succede nulla e il sito funziona identico.
        </p>
        <p>
          I cookie installati da Google Analytics in caso di consenso sono{" "}
          <code>_ga</code> e <code>_ga_&lt;ID&gt;</code>, con durata di due anni.
          Il titolare del trattamento per questi dati è Google Ireland Limited.
        </p>
      </div>

      <div>
        <h2>La tua scelta</h2>
        <RevocaConsenso />
      </div>

      <div>
        <h2>Cosa non c&apos;è</h2>
        <p>
          Non sono attivi cookie di profilazione pubblicitaria né strumenti di
          remarketing. Quando lo saranno, questa pagina verrà aggiornata prima che
          entrino in funzione.
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

import { Icon } from "@/components/Icon";
import { IntestazioneSezione } from "@/components/IntestazioneSezione";
import { BagnoAssonometrico } from "@/components/BagnoAssonometrico";
import { SITE } from "@/config/site";
import { Reveal } from "@/components/Reveal";

/**
 * Cosa vedi prima che arrivi la mazzetta.
 *
 * E' la risposta alla paura che blocca piu' preventivi di tutte: "e se poi non
 * mi piace?". Per questo le tre schede non dicono quanto siamo bravi ma cosa
 * viene deciso PRIMA — disposizione, materiali, prezzo. Sono le stesse tre
 * cose che stanno nel preventivo scritto, quindi non e' una promessa nuova: e'
 * il rendere visibile una che la pagina fa gia'.
 *
 * Niente numeri sui clienti serviti o sugli anni di attivita': non li ho, e su
 * una pagina che espone una partita IVA vera inventarli e' pubblicita'
 * ingannevole.
 */
const SCHEDE = [
  {
    icon: "design",
    titolo: "Disposizione",
    testo: "Dove finiscono lavabo, sanitari e doccia, con le misure.",
    cella: "lg:col-start-1 lg:row-start-1 lg:self-start xl:-ml-8",
  },
  {
    icon: "tiles",
    titolo: "Materiali",
    testo: "Piastrelle, sanitari e rubinetteria scelti dal capitolato.",
    cella: "lg:col-start-3 lg:row-start-2 lg:self-center xl:-mr-8",
  },
  {
    icon: "lock",
    titolo: "Prezzo definitivo",
    testo: "Quello che vedi è quello che firmi, esclusioni comprese.",
    cella: "lg:col-start-1 lg:row-start-3 lg:self-end lg:ml-2",
  },
] as const;

export function Progetto() {
  return (
    <section id="progetto" className="relative isolate overflow-hidden bg-surface py-[length:var(--spacing-section)]">
      <div aria-hidden className="velo-acqua -z-10" />

      <div className="wrap grid items-center gap-y-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-x-14">
        <IntestazioneSezione
          occhiello="Progettazione"
          titolo="Lo vedi prima,"
          accento="non dopo."
          testo={`${SITE.process[1].text} Se qualcosa non ti convince si cambia sul foglio, che costa zero, invece che in cantiere.`}
          azione={{ href: "#scrivici", testo: "Scrivici per il sopralluogo" }}
        />

        <Reveal className="relative">
          <BagnoAssonometrico className="mx-auto block aspect-[5.2/4.6] w-full max-w-[36rem] overflow-visible" />

          {/* Su schermo largo le schede galleggiano sopra al disegno, messe da
              una griglia di tre righe per tre colonne sovrapposta al riquadro.
              Sotto lg tornano in fila: sovrapposte a un disegno alto duecento
              pixel sarebbero illeggibili. */}
          <ul className="mt-8 grid gap-4 sm:grid-cols-3 lg:absolute lg:inset-0 lg:mt-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.5fr)_minmax(0,1fr)] lg:grid-rows-3 lg:gap-0">
            {SCHEDE.map((s) => (
              <li
                key={s.titolo}
                className={`vetro filo-luce h-fit rounded-2xl p-4 shadow-[var(--shadow-card)] lg:max-w-[15.5rem] ${s.cella}`}
              >
                <p className="flex items-center gap-2 font-display text-[0.95rem] font-semibold text-navy">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-sky-soft text-blue-700">
                    <Icon name={s.icon} className="size-4" />
                  </span>
                  {s.titolo}
                </p>
                <p className="mt-2 text-sm leading-snug text-muted">{s.testo}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

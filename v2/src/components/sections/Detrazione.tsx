import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { SITE } from "@/config/site";
import { euro, euroCent } from "@/lib/links";
import { Reveal } from "@/components/Reveal";
import { Onda } from "@/components/Onda";

/**
 * Sta subito dopo il prezzo, e non e' un caso: e' il punto in cui 9.490 €
 * smette di essere il numero che il visitatore porta via. Metterla piu' in
 * basso vorrebbe dire lasciarlo uscire dalla pagina con la cifra piena in
 * testa.
 *
 * I conti si ricavano dal prezzo e dalle aliquote in site.ts, non sono
 * scritti a mano: se cambia il listino o l'aliquota, qui cambia da solo.
 * Su una pagina che espone una partita IVA vera, un numero rimasto indietro
 * e' pubblicita' ingannevole, non una svista.
 */
const { price: prezzo } = SITE.offer;
const { ratePrimary, rateSecondary, years, maxSpend, note, disclaimer } = SITE.taxCredit;

const detrazionePrima = Math.round((prezzo * ratePrimary) / 100);
const restaPrima = prezzo - detrazionePrima;
const rataAnnuale = detrazionePrima / years;

const detrazioneSeconda = Math.round((prezzo * rateSecondary) / 100);
const restaSeconda = prezzo - detrazioneSeconda;

export function Detrazione() {
  return (
    <section
      id="detrazione"
      className="relative isolate overflow-hidden bg-navy py-[length:var(--spacing-section)] text-white"
    >
      <div aria-hidden className="velo-acqua-scuro -z-10" />

      {/* Onda in entrata e in uscita: e' lo stacco piu' forte della pagina
          (bianco -> blu notte), e una riga netta lo farebbe sembrare un
          banner incollato invece che una parte della stessa pagina. */}
      <div aria-hidden className="absolute inset-x-0 top-0 rotate-180">
        <Onda colore="fill-white" variante="calma" />
      </div>
      <div aria-hidden className="absolute inset-x-0 bottom-0 translate-y-px">
        <Onda colore="fill-surface" variante="mossa" />
      </div>

      <div className="wrap relative pt-[clamp(1rem,2vw,2rem)] pb-[clamp(1.5rem,3vw,3rem)]">
        <div className="mx-auto mb-12 max-w-[62ch] text-center">
          <p className="mb-3 font-display text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-sky-200">
            Detrazione fiscale {SITE.taxCredit.year}
          </p>
          <h2 className="text-[length:var(--text-h2)] text-white">
            Metà della spesa torna indietro
          </h2>
          {/* "Torna indietro", non "sconto": la detrazione non abbassa la
              fattura, si recupera dalle tasse in dieci anni. Scriverlo come
              uno sconto sarebbe piu' efficace e sarebbe falso. */}
          <p className="mt-4 text-[length:var(--text-lead)] leading-relaxed text-white/75">
            Non è uno sconto sul prezzo: è una detrazione IRPEF che recuperi in{" "}
            {years} anni, una quota all&apos;anno, presentando la fattura dei lavori.
          </p>
        </div>

        <Reveal className="grid items-stretch gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* --- Il conto, in chiaro --- */}
          <div className="rounded-[var(--radius-card)] border border-white/15 bg-white/[0.06] p-7 sm:p-9">
            <p className="font-display text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-sky-200">
              Abitazione principale · {ratePrimary}%
            </p>

            <dl className="mt-6 space-y-4">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-white/75">Il bagno chiavi in mano</dt>
                <dd className="tabular font-display text-[1.35rem] font-semibold">{euro(prezzo)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-b border-white/15 pb-4">
                <dt className="text-white/75">Detrazione IRPEF {ratePrimary}%</dt>
                <dd className="tabular font-display text-[1.35rem] font-semibold text-sky-200">
                  − {euro(detrazionePrima)}
                </dd>
              </div>
              {/* items-end, non items-baseline: fra un'etichetta di 1 rem e un
                  numero di 2,6 rem la linea di base apre un vuoto che sembra
                  un errore di impaginazione. Allineando i piedi, il numero
                  poggia sull'etichetta e la riga si legge come una somma. */}
              <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
                <dt className="font-display text-[1.05rem] font-semibold">Costo reale per te</dt>
                <dd className="tabular font-display text-[2.6rem] font-bold leading-[0.95] tracking-[-0.03em]">
                  {euro(restaPrima)}
                </dd>
              </div>
            </dl>

            <p className="mt-6 flex items-start gap-3 rounded-xl bg-white/[0.06] p-4 text-sm leading-relaxed text-white/85">
              <Icon name="clock" className="mt-0.5 size-[18px] shrink-0 text-sky-200" />
              <span>
                Recuperati in {years} quote annuali da{" "}
                <strong className="font-semibold text-white">{euroCent(rataAnnuale)}</strong>, non
                tutti insieme. La prima con la dichiarazione dell&apos;anno successivo ai lavori.
              </span>
            </p>

            <Button href="#preventivo" variant="secondaryDark" size="lg" className="mt-7 max-sm:w-full">
              Richiedi il preventivo gratuito
              <Icon name="chevron" className="size-4 -rotate-90" />
            </Button>
          </div>

          {/* --- Seconda casa e scadenza --- */}
          <div className="flex flex-col gap-6">
            <div className="rounded-[var(--radius-card)] border border-white/15 p-7">
              <p className="font-display text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-white/60">
                Seconda casa · {rateSecondary}%
              </p>
              <p className="tabular mt-4 font-display text-[2rem] font-bold leading-none">
                {euro(restaSeconda)}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Costo reale con la detrazione del {rateSecondary}%, cioè {euro(detrazioneSeconda)}{" "}
                recuperati in {years} anni.
              </p>
            </div>

            {/* Questa scadenza e' vera e sta nella norma: e' l'unica leva di
                urgenza che questa pagina puo' usare senza inventarsi niente. */}
            <div className="flex flex-1 flex-col justify-center gap-3 rounded-[var(--radius-card)] border border-sky/30 bg-sky/10 p-7">
              <Icon name="clock" className="size-6 text-sky-200" />
              <p className="text-sm leading-relaxed text-white/85">
                <strong className="block font-semibold text-white">
                  Dal {SITE.taxCredit.year + 1} l&apos;aliquota scende
                </strong>
                Sull&apos;abitazione principale si passa dal {ratePrimary}% al {rateSecondary}%.
                Sugli stessi {euro(prezzo)} sono {euro(detrazionePrima - detrazioneSeconda)} in meno
                da recuperare.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Le condizioni stanno qui, leggibili, non in una nota da otto pixel:
            e' anche l'unico modo in cui la sezione regge un controllo. */}
        <div className="mx-auto mt-10 max-w-[75ch] space-y-2 border-t border-white/15 pt-7 text-sm leading-relaxed text-white/60">
          <p>{note}</p>
          <p>
            Il tetto di spesa agevolabile è di {euro(maxSpend)} per unità immobiliare. Il pagamento
            va fatto con bonifico dedicato ai lavori di ristrutturazione, quello che riporta causale,
            codice fiscale di chi detrae e partita IVA dell&apos;impresa.
          </p>
          <p className="font-medium text-white/75">{disclaimer}</p>
        </div>
      </div>
    </section>
  );
}

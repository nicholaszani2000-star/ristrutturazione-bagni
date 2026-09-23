import { Icon } from "@/components/Icon";
import { SITE } from "@/config/site";
import { Reveal } from "@/components/Reveal";

/**
 * Prova sociale, senza recensioni inventate.
 *
 * Il posto delle testimonianze, nel pattern di conversione, e' qui: subito
 * prima dell'ultima richiesta. Solo che testimonianze vere non ce ne sono
 * ancora, e scriverne di finte su una pagina che espone una partita IVA reale
 * non e' una scorciatoia di copy, e' pubblicita' ingannevole.
 *
 * Quindi al loro posto c'e' l'altra prova che un'impresa edile puo' dare, ed
 * e' piu' forte di cinque stelline anonime: i dati con cui il visitatore puo'
 * andare a controllare da solo chi siamo. Quando arriveranno recensioni vere,
 * si aggiungono a questa sezione — non la sostituiscono.
 */
const REGISTRO = [
  { etichetta: "Ragione sociale", valore: SITE.legal.company },
  { etichetta: "Partita IVA", valore: SITE.legal.vat },
  {
    etichetta: "Sede",
    valore: `${SITE.legal.address} — ${SITE.legal.zip} ${SITE.legal.city} (${SITE.legal.province})`,
  },
  { etichetta: "PEC", valore: SITE.legal.pec },
] as const;

const CERTIFICAZIONI = [
  {
    icon: "cert",
    titolo: "Conformità DM 37/08",
    testo:
      "Dichiarazione di conformità su impianto idraulico ed elettrico, rilasciata a fine lavori e intestata a te.",
  },
  {
    icon: "receipt",
    titolo: "Fattura e documenti per la detrazione",
    testo:
      "Fattura con la dicitura corretta e il riepilogo dei lavori, pronti da consegnare al commercialista o al CAF.",
  },
  {
    icon: "doc",
    titolo: "Preventivo scritto e vincolante",
    testo:
      "Prezzo, capitolato dei materiali, esclusioni e data di fine lavori su carta, firmati prima di iniziare.",
  },
] as const;

export function Credenziali() {
  return (
    <section id="chi-siamo" className="relative isolate overflow-hidden bg-surface py-[length:var(--spacing-section)]">
      <div aria-hidden className="velo-acqua -z-10" />

      <div className="wrap">
        <div className="mx-auto mb-14 max-w-[62ch] text-center">
          <p className="mb-3 font-display text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-blue-700">
            Chi siamo
          </p>
          <h2 className="text-[length:var(--text-h2)]">Un&apos;impresa che puoi verificare</h2>
          <p className="mt-4 text-[length:var(--text-lead)] leading-relaxed text-muted">
            Prima di far demolire un bagno vale la pena sapere a chi si apre la porta. Questi sono i
            dati con cui puoi controllarci, e le carte che ti restano in mano a lavori finiti.
          </p>
        </div>

        <Reveal className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          {/* --- visura --- */}
          <div className="vetro filo-luce rounded-[var(--radius-card)] p-7 shadow-[var(--shadow-card)] sm:p-8">
            <p className="font-display text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-blue-700">
              Dati dell&apos;impresa
            </p>

            <dl className="mt-6 space-y-4">
              {REGISTRO.map((r) => (
                <div key={r.etichetta} className="border-b border-line pb-4 last:border-0 last:pb-0">
                  <dt className="text-sm text-muted">{r.etichetta}</dt>
                  <dd className="mt-0.5 font-display font-semibold text-navy">{r.valore}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-6 flex items-start gap-2.5 text-sm leading-relaxed text-muted">
              <Icon name="pin" className="mt-0.5 size-4 shrink-0 text-blue" />
              Lavoriamo a {SITE.zone.long}. La sede è un indirizzo vero: ci trovi anche dopo la
              consegna, che è il momento in cui serve davvero.
            </p>
          </div>

          {/* --- cosa resta in mano --- */}
          <ul className="grid content-start gap-5">
            {CERTIFICAZIONI.map((c) => (
              <li
                key={c.titolo}
                className="flex gap-4 rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-[var(--shadow-card)]"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-sky-soft text-blue-700">
                  <Icon name={c.icon} className="size-5" />
                </span>
                <div>
                  <h3 className="text-[length:var(--text-h3)]">{c.titolo}</h3>
                  <p className="mt-1.5 leading-relaxed text-muted">{c.testo}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

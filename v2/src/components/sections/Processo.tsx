import { Icon } from "@/components/Icon";
import { SITE } from "@/config/site";
import { Reveal } from "@/components/Reveal";

/**
 * Chi sta per far demolire il proprio bagno ha una paura precisa e concreta:
 * non sapere cosa succede, in che ordine, e per quanti giorni restera' senza.
 * Questa sezione risponde a quella paura e a nient'altro, per questo sta prima
 * delle garanzie e della FAQ.
 */
export function Processo() {
  return (
    <section id="processo" className="py-[length:var(--spacing-section)]">
      <div className="wrap">
        <div className="mx-auto mb-14 max-w-[62ch] text-center">
          <p className="mb-3 font-display text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-blue-700">
            Come lavoriamo
          </p>
          <h2 className="text-[length:var(--text-h2)]">Dal sopralluogo alle chiavi, in sei passi</h2>
          <p className="mt-4 text-[length:var(--text-lead)] leading-relaxed text-muted">
            {SITE.offer.duration} di cantiere. {SITE.offer.durationNote}
          </p>
        </div>

        <Reveal as="ul" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SITE.process.map((passo, i) => (
            <li
              key={passo.title}
              className="rounded-[var(--radius-card)] border border-line bg-white p-7 shadow-[var(--shadow-card)]"
            >
              {/* Il numero era una filigrana gigante in text-tint: 1,06:1 su
                  fondo bianco, cioe' invisibile. Una sezione che si intitola
                  "in sei passi" non puo' permettersi che il passo non si
                  legga, quindi il numero diventa un'etichetta vera accanto
                  all'icona. */}
              <div className="flex items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-sky-soft">
                  <Icon name={passo.icon} className="size-5 text-blue-700" />
                </span>
                <span className="tabular font-display text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-muted">
                  Passo {i + 1}
                </span>
              </div>

              <h3 className="mt-5 text-[length:var(--text-h3)]">{passo.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{passo.text}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

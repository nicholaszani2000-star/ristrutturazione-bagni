import { Icon } from "@/components/Icon";
import { SITE } from "@/config/site";
import { Reveal } from "@/components/Reveal";

/**
 * Il titolo dice "per iscritto" di proposito. Ogni impresa promette a voce le
 * stesse sei cose; il punto di differenza non e' prometterle, e' metterle nel
 * contratto. La sezione funziona solo finche' e' vero, quindi i testi restano
 * quelli concordati col titolare in site.ts e non si abbelliscono qui.
 */
export function Garanzie() {
  return (
    <section id="garanzie" className="bg-white py-[length:var(--spacing-section)]">
      <div className="wrap">
        <div className="mx-auto mb-14 max-w-[62ch] text-center">
          <p className="mb-3 font-display text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-blue-700">
            Perché noi
          </p>
          <h2 className="text-[length:var(--text-h2)]">Quello che mettiamo per iscritto</h2>
          <p className="mt-4 text-[length:var(--text-lead)] leading-relaxed text-muted">
            Sono le sei cose che di solito restano promesse a voce. Qui finiscono nel preventivo,
            dove puoi rileggerle anche fra sei mesi.
          </p>
        </div>

        <Reveal as="ul" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SITE.differentiators.map((punto) => (
            <li
              key={punto.title}
              className="flex gap-4 rounded-[var(--radius-card)] border border-line bg-white p-7 shadow-[var(--shadow-card)]"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-sky-soft">
                <Icon name={punto.icon} className="size-5 text-blue-700" />
              </span>
              <div>
                <h3 className="text-[length:var(--text-h3)]">{punto.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{punto.text}</p>
              </div>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

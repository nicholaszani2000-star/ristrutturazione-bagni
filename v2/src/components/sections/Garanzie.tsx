import { Icon } from "@/components/Icon";
import { IntestazioneSezione } from "@/components/IntestazioneSezione";
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
    <section id="garanzie" className="relative isolate overflow-hidden bg-white py-[length:var(--spacing-section)]">
      <div aria-hidden className="velo-acqua -z-10" />

      <div className="wrap grid gap-y-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-x-16">
        <IntestazioneSezione
          occhiello="Perché EasyBagno"
          titolo="Un nuovo bagno,"
          accento="e niente sorprese."
          testo="Sono le sei cose che di solito restano promesse a voce. Qui finiscono nel preventivo, dove puoi rileggerle anche fra sei mesi."
          azione={{ href: "#preventivo", testo: "Richiedi un preventivo", variante: "secondary" }}
          className="lg:sticky lg:top-28 lg:self-start"
        />

        <Reveal as="ul" className="grid gap-5 sm:grid-cols-2">
          {SITE.differentiators.map((punto) => (
            <li
              key={punto.title}
              className="filo-luce rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-sky-soft text-blue-700">
                <Icon name={punto.icon} className="size-5" />
              </span>
              <h3 className="mt-4 text-[length:var(--text-h3)]">{punto.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{punto.text}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

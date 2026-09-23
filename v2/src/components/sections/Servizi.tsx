import { Icon } from "@/components/Icon";
import { IntestazioneSezione } from "@/components/IntestazioneSezione";
import { SITE } from "@/config/site";
import { euro } from "@/lib/links";
import { Reveal } from "@/components/Reveal";

/**
 * Serve a non perdere chi arriva dall'annuncio ma non ha un bagno 3×2: senza
 * questa sezione quella persona conclude "non fanno il mio caso" e se ne va.
 *
 * La prima scheda e' piu' grande delle altre perche' e' l'offerta che la
 * pagina spinge: una griglia di cinque riquadri identici direbbe che sono
 * cinque cose ugualmente importanti, e non lo sono.
 */
export function Servizi() {
  const [primo, ...altri] = SITE.services;

  return (
    <section id="servizi" className="bg-white py-[length:var(--spacing-section)]">
      <div className="wrap grid gap-y-12 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-x-16">
        <IntestazioneSezione
          occhiello="Cosa facciamo"
          titolo="Non solo il bagno"
          accento={`da ${euro(SITE.offer.price)}.`}
          testo="L'offerta in evidenza copre la misura più richiesta. Se il tuo bagno è diverso, o se ti serve solo una parte del lavoro, lo facciamo lo stesso."
          azione={{ href: "#scrivici", testo: "Scrivici il tuo caso" }}
          className="lg:sticky lg:top-28 lg:self-start"
        />

        <Reveal as="ul" className="grid gap-5 sm:grid-cols-2">
          <li className="filo-luce luce-scorrevole grad-brand rounded-[var(--radius-card)] p-7 text-white shadow-[var(--shadow-acqua)] sm:col-span-2">
            <span className="grid size-11 place-items-center rounded-xl bg-white/18">
              <Icon name={primo.icon} className="size-5" />
            </span>
            <h3 className="mt-5 text-[length:var(--text-h3)] text-white">{primo.title}</h3>
            <p className="mt-2 max-w-[48ch] leading-relaxed text-white/85">{primo.text}</p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 font-display text-sm font-semibold">
              <Icon name="check" className="size-4" />
              {euro(SITE.offer.price)} per 3×2 m · {SITE.offer.vatNote}
            </p>
          </li>

          {altri.map((s) => (
            <li
              key={s.title}
              className="rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-sky-soft text-blue-700">
                <Icon name={s.icon} className="size-5" />
              </span>
              <h3 className="mt-4 text-[length:var(--text-h3)]">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{s.text}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

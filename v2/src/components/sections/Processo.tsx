import { Icon } from "@/components/Icon";
import { IntestazioneSezione } from "@/components/IntestazioneSezione";
import { SITE } from "@/config/site";
import { Reveal } from "@/components/Reveal";

/**
 * Chi sta per far demolire il proprio bagno ha una paura precisa: non sapere
 * cosa succede, in che ordine, e per quanti giorni restera' senza. Questa
 * sezione risponde a quella e a nient'altro.
 *
 * L'intestazione sta a sinistra e i passi a destra, come nel resto della
 * pagina. Centrare il titolo sopra a una griglia e' la disposizione che si
 * vede ovunque; un'intestazione di fianco tiene insieme promessa e prova nello
 * stesso colpo d'occhio, ed e' anche l'unico modo per far stare sei passi
 * senza farli sembrare un modulo da compilare.
 */
export function Processo() {
  return (
    <section id="processo" className="bg-surface py-[length:var(--spacing-section)]">
      <div className="wrap grid gap-y-12 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-x-16">
        <IntestazioneSezione
          occhiello="Il nostro processo"
          titolo="Dal sopralluogo alla consegna,"
          accento="tutto incluso."
          testo={`${SITE.offer.duration} di cantiere. ${SITE.offer.durationNote}`}
          azione={{ href: "#servizi", testo: "Tutti i servizi" }}
          className="lg:sticky lg:top-28 lg:self-start"
        />

        <Reveal as="ul" className="grid gap-x-8 gap-y-9 sm:grid-cols-2 xl:grid-cols-3">
          {SITE.process.map((passo, i) => (
            <li key={passo.title}>
              {/* Il numerale e' grande e in blu pieno, non in filigrana: a
                  quella dimensione la soglia di contrasto e' 3:1 e il blu su
                  azzurro chiaro la supera, mentre un tono pallido come si vede
                  spesso resterebbe sotto e il passo non si leggerebbe. */}
              <span className="mb-5 grid size-14 place-items-center rounded-2xl bg-white shadow-[0_1px_2px_rgb(20_58_92/0.06)]">
                <span aria-hidden className="tabular font-display text-[1.6rem] font-bold leading-none text-blue">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </span>

              <h3 className="flex items-center gap-2.5 text-[length:var(--text-h3)]">
                <Icon name={passo.icon} className="size-[18px] shrink-0 text-blue-700" />
                {passo.title}
              </h3>
              <p className="mt-2 leading-relaxed text-muted">{passo.text}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

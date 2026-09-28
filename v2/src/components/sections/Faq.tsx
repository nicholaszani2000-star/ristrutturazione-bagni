import { Icon } from "@/components/Icon";
import { SITE, FAQ_VISIBILI } from "@/config/site";
import { links } from "@/lib/links";
import { Reveal } from "@/components/Reveal";
import { IntestazioneSezione } from "@/components/IntestazioneSezione";

/**
 * Le domande con la risposta ancora fra parentesi quadre non compaiono: e'
 * la regola dei segnaposto di site.ts. Meglio sei domande vere che sette con
 * una risposta inventata sulla garanzia — che poi e' esattamente il punto su
 * cui un cliente tornerebbe a chiedere conto.
 *
 * I dati strutturati FAQPage non stanno piu' qui: sono nel grafo unico della
 * home (lib/dati-strutturati.ts), con le stesse domande di FAQ_VISIBILI.
 */
const DOMANDE = FAQ_VISIBILI;

export function Faq() {
  if (DOMANDE.length === 0) return null;

  return (
    <section id="domande" className="bg-surface py-[length:var(--spacing-section)]">
      <div className="wrap">
        <IntestazioneSezione
          occhiello="Domande frequenti"
          titolo="Le risposte che servono"
          accento="prima di firmare."
          centrata
          className="mb-12"
        />

        {/* details/summary invece di un accordion in JavaScript: si apre anche
            se lo script non parte, lo legge uno screen reader senza aiuti, e
            la ricerca interna del browser trova il testo chiuso. */}
        <Reveal className="mx-auto max-w-[75ch] divide-y divide-line overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-card)]">
          {DOMANDE.map((d) => (
            <details key={d.q} name="faq" className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 font-display text-[1.05rem] font-semibold transition-colors hover:bg-surface focus-visible:bg-surface [&::-webkit-details-marker]:hidden">
                {d.q}
                <Icon
                  name="chevron"
                  aria-hidden
                  className="size-5 shrink-0 text-blue-700 transition-transform duration-300 group-open:rotate-180"
                />
              </summary>
              <p className="px-6 pb-6 leading-relaxed text-muted">{d.a}</p>
            </details>
          ))}
        </Reveal>

        <p className="mx-auto mt-8 max-w-[75ch] text-center leading-relaxed text-muted">
          Non hai trovato la tua domanda?{" "}
          <a
            href={links.tel}
            className="font-semibold text-blue-700 underline underline-offset-2"
          >
            Chiama il {SITE.contact.phoneDisplay}
          </a>{" "}
          oppure{" "}
          <a
            href="#scrivici"
            className="font-semibold text-blue-700 underline underline-offset-2"
          >
            scrivici un’email
          </a>
          : rispondiamo {SITE.contact.hours.toLowerCase()}.
        </p>
      </div>
    </section>
  );
}

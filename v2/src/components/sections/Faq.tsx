import { Icon } from "@/components/Icon";
import { SITE, isPlaceholder } from "@/config/site";
import { links } from "@/lib/links";
import { Reveal } from "@/components/Reveal";

/**
 * Le domande con la risposta ancora fra parentesi quadre non compaiono: e'
 * la regola dei segnaposto di site.ts. Meglio sei domande vere che sette con
 * una risposta inventata sulla garanzia — che poi e' esattamente il punto su
 * cui un cliente tornerebbe a chiedere conto.
 */
const DOMANDE = SITE.faq.filter((d) => !isPlaceholder(d.a));

/**
 * Dati strutturati FAQPage: le stesse domande che stanno nella pagina, in un
 * formato che Google puo' mostrare direttamente nei risultati. Vale solo
 * perche' il testo e' davvero visibile qui sotto — dichiarare risposte che la
 * pagina non contiene e' contro le linee guida, oltre che inutile.
 */
const datiStrutturati = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: DOMANDE.map((d) => ({
    "@type": "Question",
    name: d.q,
    acceptedAnswer: { "@type": "Answer", text: d.a },
  })),
};

export function Faq() {
  if (DOMANDE.length === 0) return null;

  return (
    <section id="domande" className="bg-white py-[length:var(--spacing-section)]">
      <script
        type="application/ld+json"
        // Il minore va neutralizzato: un "<" dentro una risposta chiuderebbe
        // il tag script prima del tempo e romperebbe la pagina.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(datiStrutturati).replace(/</g, "\\u003c"),
        }}
      />

      <div className="wrap">
        <div className="mx-auto mb-12 max-w-[62ch] text-center">
          <p className="mb-3 font-display text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-blue-700">
            Domande frequenti
          </p>
          <h2 className="text-[length:var(--text-h2)]">Le risposte che servono prima di firmare</h2>
        </div>

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
            href="#preventivo"
            className="font-semibold text-blue-700 underline underline-offset-2"
          >
            scrivici dal modulo
          </a>
          : rispondiamo {SITE.contact.hours.toLowerCase()}.
        </p>
      </div>
    </section>
  );
}

import { Icon } from "@/components/Icon";
import { SITE } from "@/config/site";
import { Reveal } from "@/components/Reveal";

/**
 * Fascia sottile subito sotto all'hero.
 *
 * Il catalogo mette la prova subito dopo l'hero, prima di qualunque
 * argomentazione, e la ragione e' che a questo punto il visitatore ha una sola
 * domanda: "posso fidarmi di questi?". Quattro risposte brevi, nessuna
 * ripetizione di cio' che ha appena letto sopra: qui non ci sono promesse
 * commerciali ma fatti controllabili.
 */
const VOCI = [
  { icon: "survey", forte: "Gratuito", resto: "sopralluogo e preventivo" },
  { icon: "receipt", forte: "50%", resto: "in detrazione fiscale" },
  { icon: "pin", forte: "Gallarate", resto: `P.IVA ${SITE.legal.vat}` },
  { icon: "users", forte: "Un referente", resto: "dal primo giorno alla consegna" },
] as const;

export function TrustBar() {
  return (
    <section aria-label="Perché fidarsi" className="bg-surface">
      <Reveal
        as="ul"
        className="wrap grid grid-cols-2 gap-x-5 gap-y-6 py-9 lg:grid-cols-4 lg:py-11"
      >
        {VOCI.map((v) => (
          <li key={v.forte} className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line-soft bg-white text-blue-700 shadow-[0_1px_2px_rgb(20_58_92/0.05)]">
              <Icon name={v.icon} className="size-[18px]" />
            </span>
            <span className="text-sm leading-snug">
              <strong className="block font-display font-semibold text-navy">{v.forte}</strong>
              <span className="text-muted">{v.resto}</span>
            </span>
          </li>
        ))}
      </Reveal>
    </section>
  );
}

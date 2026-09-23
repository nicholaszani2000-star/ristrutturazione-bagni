import type { ReactNode } from "react";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";

/**
 * L'intestazione di sezione, una volta sola.
 *
 * Prima ogni sezione si scriveva la propria: stessa struttura ricopiata sette
 * volte, con sette occasioni di divergere. Ora e' un componente, e il ritmo
 * della pagina e' garantito dal codice invece che dalla disciplina.
 *
 * Due regole di composizione, entrambe prese dal riferimento:
 *
 * - Il titolo e' a DUE TINTE: la prima riga in navy dice di cosa si parla, la
 *   seconda in blu dice la promessa. E' quello che fa sembrare progettata una
 *   pagina che altrimenti sarebbe solo ordinata.
 * - L'allineamento di base e' a SINISTRA, su due colonne, con il visuale a
 *   destra. Centrare tutto e' la scorciatoia che fa sembrare ogni landing
 *   uguale all'altra; si centra solo dove non c'e' un visuale accanto.
 */
type Props = {
  occhiello: string;
  titolo: string;
  accento: string;
  testo?: string;
  azione?: { href: string; testo: string; variante?: "primary" | "secondary" };
  /** Centrata quando la sezione non ha una colonna visuale accanto. */
  centrata?: boolean;
  chiaro?: boolean;
  children?: ReactNode;
  className?: string;
};

export function IntestazioneSezione({
  occhiello,
  titolo,
  accento,
  testo,
  azione,
  centrata = false,
  chiaro = false,
  children,
  className = "",
}: Props) {
  return (
    <div className={`${centrata ? "mx-auto max-w-[60ch] text-center" : "max-w-[34rem]"} ${className}`}>
      <p
        className={`mb-4 font-display text-[0.72rem] font-semibold uppercase tracking-[0.18em] ${
          chiaro ? "text-sky-200" : "text-blue-700"
        }`}
      >
        {occhiello}
      </p>

      <h2 className={`text-[length:var(--text-h2)] ${chiaro ? "text-white" : ""}`}>
        {titolo}{" "}
        <span className={chiaro ? "text-sky-200" : "text-blue"}>{accento}</span>
      </h2>

      {testo ? (
        <p
          className={`mt-5 text-[length:var(--text-lead)] leading-relaxed ${
            chiaro ? "text-white/75" : "text-muted"
          } ${centrata ? "mx-auto" : ""}`}
        >
          {testo}
        </p>
      ) : null}

      {children}

      {azione ? (
        <Button
          href={azione.href}
          variant={azione.variante ?? "primary"}
          className={`mt-8 ${centrata ? "mx-auto" : ""}`}
        >
          {azione.testo}
          <Icon
            name="chevron"
            className="size-4 -rotate-90 transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Button>
      ) : null}
    </div>
  );
}

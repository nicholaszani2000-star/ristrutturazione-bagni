import Link from "next/link";
import type { ComponentProps } from "react";

/**
 * Un solo sistema di CTA, quattro ruoli.
 *
 * Non quattro stili a piacere: quattro POSIZIONI in una gerarchia. In ogni
 * schermata c'e' al massimo una "primary". Se ce ne fossero due, non ce ne
 * sarebbe nessuna.
 *
 *   primary        l'azione della pagina: chiedere il preventivo
 *   secondary      l'alternativa, su fondo chiaro (guarda i lavori, chiama)
 *   secondaryDark  la stessa alternativa, su fondo scuro
 *   whatsapp       canale proprio, tenuto verde perche' il verde E' il
 *                  riconoscimento: e' l'unico colore fuori palette ammesso
 *
 * "group" sulla base serve alle micro-interazioni: le icone dentro al pulsante
 * reagiscono al passaggio del mouse senza bisogno di stato in JavaScript.
 */
const base =
  "group relative isolate inline-flex min-h-12 cursor-pointer select-none items-center " +
  "justify-center gap-2 rounded-full border px-6 font-display text-base font-semibold " +
  "leading-tight transition-[transform,box-shadow,background-color,border-color] " +
  "duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:duration-75 " +
  "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-blue";

const variants = {
  // blue-700 e non blue: bianco su #1b84dd da' 3,90:1, sotto il minimo di
  // 4,5:1 per un testo di 17px semibold. Su #1663b0 sale a 6,09:1.
  //
  // Al passaggio del mouse il colore non cambia: il segnale e' il riflesso che
  // si accende piu' l'ombra che si allarga. Cambiare anche il colore sarebbe
  // un terzo segnale per la stessa cosa.
  primary:
    "border-blue-700 bg-blue-700 text-white shadow-[var(--shadow-card)] riflesso " +
    "hover:shadow-[var(--shadow-acqua)]",

  secondary:
    "border-line bg-white text-navy shadow-[0_1px_2px_rgb(20_58_92/0.04)] " +
    "hover:border-sky hover:bg-surface hover:shadow-[var(--shadow-card)]",

  secondaryDark:
    "border-white/25 bg-white/10 text-white backdrop-blur-sm " +
    "hover:border-white/45 hover:bg-white/18",

  whatsapp:
    "border-whatsapp bg-whatsapp text-white shadow-[var(--shadow-card)] " +
    "hover:border-whatsapp-dark hover:bg-whatsapp-dark hover:shadow-[var(--shadow-lift)]",
} as const;

const sizes = {
  md: "px-6 text-base",
  lg: "min-h-14 px-8 text-[1.06rem]",
} as const;

/**
 * Le stesse classi, disponibili fuori dal componente.
 *
 * Il modulo ha bisogno di un <button type="submit">, che non e' un link: senza
 * questa funzione le classi andrebbero ricopiate a mano, e la prima modifica
 * al pulsante lascerebbe indietro l'invio del modulo.
 */
export function stileBottone(
  variant: keyof typeof variants = "primary",
  size: keyof typeof sizes = "md",
  extra = "",
) {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`;
}

type Props = ComponentProps<typeof Link> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  block?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  block = false,
  className = "",
  ...props
}: Props) {
  return (
    <Link
      className={`${base} ${variants[variant]} ${sizes[size]} ${block ? "w-full" : ""} ${className}`}
      {...props}
    />
  );
}

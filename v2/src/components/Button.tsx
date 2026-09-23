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
  "leading-tight transition-[transform,box-shadow,background-color,border-color,opacity] " +
  "duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:duration-75 " +
  "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-blue " +
  // Stato disabilitato, una volta per tutte: senza, ogni chiamante se lo
  // inventa e il modulo finisce con un pulsante che sembra premibile mentre
  // sta gia' inviando.
  "aria-disabled:pointer-events-none aria-disabled:opacity-45 " +
  "disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none";

const variants = {
  // blue-700 e non blue: bianco su #1b84dd da' 3,90:1, sotto il minimo di
  // 4,5:1 per un testo di 17px semibold. Su #1663b0 sale a 6,09:1.
  //
  // L'alone al passaggio del mouse e' un anello di colore piu' un'ombra della
  // stessa tinta: e' la resa in CSS del bagliore della tavola dei CTA, e costa
  // due box-shadow invece di un filtro o di una tela.
  primary:
    "border-blue-700 bg-blue-700 text-white shadow-[var(--shadow-card)] riflesso " +
    "hover:shadow-[0_0_0_4px_rgb(27_132_221/0.20),0_14px_30px_rgb(22_99_176/0.38)] " +
    "active:bg-navy active:border-navy",

  secondary:
    "border-line bg-white text-navy shadow-[0_1px_2px_rgb(20_58_92/0.04)] " +
    "hover:border-sky hover:bg-surface hover:shadow-[var(--shadow-card)] " +
    "active:bg-surface-2",

  // Su fondo blu o navy. Bianco pieno, non un contorno traslucido: su quel
  // fondo un contorno e' un invito che si vede solo se lo cerchi.
  secondaryDark:
    "border-white bg-white text-navy shadow-[var(--shadow-card)] riflesso-scuro " +
    "hover:shadow-[0_0_0_4px_rgb(255_255_255/0.25),0_14px_30px_rgb(10_28_44/0.35)] " +
    "active:bg-surface",

  whatsapp:
    "border-whatsapp bg-whatsapp text-white shadow-[var(--shadow-card)] " +
    "hover:border-whatsapp-dark hover:bg-whatsapp-dark " +
    "hover:shadow-[0_0_0_4px_rgb(37_211_102/0.22),0_14px_30px_rgb(29_168_81/0.35)] " +
    "active:bg-whatsapp-dark",

  // Il grado piu' leggero della scala: nessun riquadro, solo testo e freccia.
  // Serve dove un pulsante sarebbe troppo — accanto a una primaria, dentro a
  // un paragrafo — e senza di lui quei posti finiscono con una "secondary"
  // che ruba peso alla primaria.
  link:
    "min-h-6 gap-1.5 border-transparent px-0 text-blue-700 underline decoration-sky " +
    "decoration-2 underline-offset-[6px] hover:translate-y-0 hover:text-navy " +
    "hover:decoration-blue-700",
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
  const taglia = variant === "link" ? "" : sizes[size];
  return `${base} ${variants[variant]} ${taglia} ${extra}`;
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
      className={`${base} ${variants[variant]} ${variant === "link" ? "" : sizes[size]} ${block ? "w-full" : ""} ${className}`}
      {...props}
    />
  );
}

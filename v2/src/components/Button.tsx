import Link from "next/link";
import type { ComponentProps } from "react";

const base =
  "inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full " +
  "border-2 px-6 font-display text-base font-semibold leading-tight " +
  "transition-[background-color,border-color,transform,box-shadow] duration-200 " +
  "hover:-translate-y-px active:translate-y-0";

const variants = {
  // blue-700 e non blue: bianco su #1b84dd da' 3,90:1, sotto il minimo di
  // 4,5:1 per un testo di 17px semibold. Su #1663b0 sale a 6,09:1. E' lo
  // stesso token che prima serviva da stato hover, quindi il marchio non
  // cambia — cambia la leggibilita' al sole, che e' dove questi pulsanti
  // vengono guardati davvero.
  //
  // Il colore ora resta fermo al passaggio del mouse: il segnale e' il
  // riflesso che si accende, piu' l'ombra.
  primary: "border-blue-700 bg-blue-700 text-white riflesso hover:shadow-[var(--shadow-lift)]",
  whatsapp: "border-whatsapp bg-whatsapp text-white hover:border-whatsapp-dark hover:bg-whatsapp-dark hover:shadow-card",
  ghost: "border-line bg-transparent text-navy hover:border-blue hover:bg-tint",
  light: "border-white bg-white text-navy hover:border-sand-100 hover:bg-sand-100",
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
 * al bottone lascerebbe indietro l'invio del modulo.
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

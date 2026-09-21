import Link from "next/link";
import type { ComponentProps } from "react";

const base =
  "inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full " +
  "border-2 px-6 font-display text-base font-semibold leading-tight " +
  "transition-[background-color,border-color,transform,box-shadow] duration-200 " +
  "hover:-translate-y-px active:translate-y-0";

const variants = {
  primary: "border-blue bg-blue text-white hover:border-blue-700 hover:bg-blue-700 hover:shadow-card",
  whatsapp: "border-whatsapp bg-whatsapp text-white hover:border-whatsapp-dark hover:bg-whatsapp-dark hover:shadow-card",
  ghost: "border-line bg-transparent text-navy hover:border-blue hover:bg-tint",
  light: "border-white bg-white text-navy hover:border-sand-100 hover:bg-sand-100",
} as const;

const sizes = {
  md: "px-6 text-base",
  lg: "min-h-14 px-8 text-[1.06rem]",
} as const;

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

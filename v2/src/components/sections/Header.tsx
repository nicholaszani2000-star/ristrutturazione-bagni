import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { SITE } from "@/config/site";
import { links } from "@/lib/links";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/92 backdrop-blur-md backdrop-saturate-150">
      <div className="wrap flex min-h-[4.25rem] items-center justify-between gap-4">
        <Link href="#top" aria-label={`${SITE.brand.name}, torna all'inizio`}>
          <Logo />
        </Link>

        <div className="flex items-center gap-3">
          <a
            href={links.tel}
            className="hidden items-center gap-2 font-display font-semibold text-navy transition-colors hover:text-blue-700 sm:inline-flex"
          >
            <span className="grid size-9 place-items-center rounded-full bg-blue text-white">
              <Icon name="phone" className="size-4" />
            </span>
            <span className="tabular">{SITE.contact.phoneDisplay}</span>
          </a>
          <Button href="#preventivo" className="hidden md:inline-flex">
            Richiedi preventivo
          </Button>
        </div>
      </div>
    </header>
  );
}

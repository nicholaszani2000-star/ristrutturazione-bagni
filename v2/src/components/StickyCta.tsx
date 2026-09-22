import { Icon } from "@/components/Icon";
import { links } from "@/lib/links";

/**
 * Barra fissa solo su mobile. Il body riserva lo spazio in fondo
 * (pb-[4.75rem]) così non copre mai l'ultima riga di contenuto.
 */
export function StickyCta() {
  const item =
    "flex min-h-[3.75rem] flex-col items-center justify-center gap-1 bg-white " +
    "font-display text-[0.72rem] font-semibold leading-tight active:bg-tint";

  return (
    <nav
      aria-label="Contatti rapidi"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 gap-px border-t border-line bg-line pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgb(20_58_92/0.10)] lg:hidden"
    >
      <a href={links.tel} className={`${item} text-navy`}>
        <Icon name="phone" className="size-5" />
        Chiama
      </a>
      <a href={links.whatsapp} target="_blank" rel="noopener" className={`${item} text-whatsapp-dark`}>
        <Icon name="whatsapp" className="size-5" />
        WhatsApp
      </a>
      <a href="#preventivo" className={`${item} !bg-blue-700 text-white`}>
        <Icon name="doc" className="size-5" />
        Preventivo
      </a>
    </nav>
  );
}

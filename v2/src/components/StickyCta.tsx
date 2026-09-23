import { Icon } from "@/components/Icon";
import { SITE } from "@/config/site";
import { links } from "@/lib/links";

/**
 * Barra fissa su telefono: WhatsApp · Email · 5%.
 *
 * Tre canali che partono tutti dal cliente. Prima la terza voce portava al
 * modulo preventivo, cioe' a lasciare un numero e aspettare: e' esattamente
 * il modello che abbiamo tolto. Adesso porta allo sconto, che e' l'unica cosa
 * che il visitatore ottiene subito invece di attendere.
 *
 * Il body riserva lo spazio in fondo (pb-[4.75rem]) cosi' la barra non copre
 * mai l'ultima riga di contenuto.
 */
export function StickyCta() {
  const item =
    "flex min-h-[3.75rem] flex-col items-center justify-center gap-1 bg-white " +
    "font-display text-[0.72rem] font-semibold leading-tight active:bg-surface";

  return (
    <nav
      aria-label="Contatti rapidi"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 gap-px border-t border-line bg-line pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgb(20_58_92/0.10)] lg:hidden"
    >
      <a
        href={links.whatsapp}
        target="_blank"
        rel="noopener"
        className={`${item} text-whatsapp-dark`}
      >
        <Icon name="whatsapp" className="size-5" />
        WhatsApp
      </a>
      <a href={links.mail} className={`${item} text-navy`}>
        <Icon name="mail" className="size-5" />
        Email
      </a>
      <a href="#scrivici" className={`${item} !bg-blue-700 text-white`}>
        <Icon name="receipt" className="size-5" />
        Sconto {SITE.promo.percentuale}%
      </a>
    </nav>
  );
}

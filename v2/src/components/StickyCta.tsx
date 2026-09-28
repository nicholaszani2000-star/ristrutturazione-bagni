import { Icon } from "@/components/Icon";
import { links } from "@/lib/links";

/**
 * Barra fissa su telefono: WhatsApp · Chiama · Sopralluogo.
 *
 * La voce in blu e' l'azione della pagina, la richiesta di sopralluogo; le
 * altre due sono per chi preferisce cominciare lui. Su telefono una chiamata
 * e' un tocco, ed e' il contatto che vale di piu': per questo ha preso il
 * posto dell'email, che resta nella sezione "Scrivici" e nel piede.
 *
 * Il body riserva lo spazio in fondo (pb-[4.75rem]) cosi' la barra non copre
 * mai l'ultima riga di contenuto.
 */
export function StickyCta() {
  const item =
    "flex min-h-[3.75rem] flex-col items-center justify-center gap-1 bg-white px-1 text-center " +
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
      <a href={links.tel} className={`${item} text-navy`}>
        <Icon name="phone" className="size-5" />
        Chiama
      </a>
      <a href="#sopralluogo" className={`${item} !bg-blue-700 text-white`}>
        <Icon name="survey" className="size-5" />
        Sopralluogo gratis
      </a>
    </nav>
  );
}

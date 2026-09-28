import type { Metadata } from "next";
import { SITE } from "@/config/site";

/**
 * Metadati di una pagina, costruiti tutti nello stesso modo.
 *
 * Prima il layout dichiarava titolo, descrizione e Open Graph della home, e
 * le altre pagine li ereditavano: privacy e cookie finivano condivise con il
 * titolo, la descrizione e l'indirizzo (og:url) della home. Ogni pagina ora
 * passa da qui e dichiara i propri, con il canonical che punta a se stessa.
 */

/** L'immagine per le condivisioni: 1200x630, gia' in public/images. */
export const IMMAGINE_SOCIAL = {
  url: "/images/og.jpg",
  width: 1200,
  height: 630,
  alt: `Il tuo nuovo bagno, senza stress: bagno 3×2 m chiavi in mano a ${SITE.zone.long}, tutto compreso`,
};

type Pagina = {
  /** Percorso con la barra finale, come lo serve il sito: "/", "/privacy/". */
  percorso: string;
  /** Titolo completo, gia' con il nome del marchio. */
  titolo: string;
  descrizione: string;
  /** Titolo per Facebook, WhatsApp e simili, se diverso da quello di Google. */
  titoloSocial?: string;
  descrizioneSocial?: string;
};

export function metadatiPagina(p: Pagina): Metadata {
  const titoloSocial = p.titoloSocial ?? p.titolo;
  const descrizioneSocial = p.descrizioneSocial ?? p.descrizione;
  return {
    title: { absolute: p.titolo },
    description: p.descrizione,
    alternates: { canonical: p.percorso },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "it_IT",
      siteName: SITE.brand.short,
      url: p.percorso,
      title: titoloSocial,
      description: descrizioneSocial,
      images: [IMMAGINE_SOCIAL],
    },
    twitter: {
      card: "summary_large_image",
      title: titoloSocial,
      description: descrizioneSocial,
      images: [IMMAGINE_SOCIAL.url],
    },
  };
}

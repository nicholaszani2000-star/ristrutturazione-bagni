import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";
import { PAGINE } from "@/config/pagine";

export const dynamic = "force-static";

/**
 * Solo le pagine pubblicate e indicizzabili, con l'indirizzo canonico (barra
 * finale compresa) e la data dell'ultima modifica vera del contenuto, presa
 * da config/pagine.ts. Le pagine previste ma non ancora scritte
 * (PAGINE_FUTURE) restano fuori, e la 404 non c'e' per definizione.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(PAGINE).map((p) => ({
    url: `${SITE.brand.url}${p.percorso}`,
    lastModified: p.aggiornata,
  }));
}

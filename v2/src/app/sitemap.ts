import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";

export const dynamic = "force-static";

/**
 * Tre pagine, e tante resteranno. La data di modifica e' quella della build:
 * su un sito che cambia quando cambia il listino e' l'informazione giusta, e
 * non richiede di ricordarsi di aggiornarla a mano.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const aggiornato = new Date();
  return [
    { url: `${SITE.brand.url}/`, lastModified: aggiornato, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE.brand.url}/privacy/`, lastModified: aggiornato, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE.brand.url}/cookie/`, lastModified: aggiornato, changeFrequency: "yearly", priority: 0.3 },
  ];
}

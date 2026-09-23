import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";

export const dynamic = "force-static";

/**
 * Le pagine legali restano indicizzabili — sono un segnale di serieta' per
 * un'impresa vera, non pagine da nascondere. Non c'e' nulla da escludere:
 * il sito e' una pagina sola piu' privacy e cookie.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE.brand.url}/sitemap.xml`,
    host: SITE.brand.url,
  };
}

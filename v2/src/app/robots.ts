import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";

export const dynamic = "force-static";

/**
 * Tutto aperto: il sito e' la home piu' privacy e cookie, e le pagine legali
 * restano indicizzabili — sono un segnale di serieta' per un'impresa vera.
 * Niente "Host": e' una direttiva solo di Yandex, Google la ignora.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE.brand.url}/sitemap.xml`,
  };
}

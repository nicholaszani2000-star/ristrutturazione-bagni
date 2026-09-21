import { SITE } from "@/config/site";

/** Link di contatto costruiti una volta sola, usati ovunque. */
export const links = {
  tel: `tel:${SITE.contact.phoneRaw}`,
  whatsapp: `https://wa.me/${SITE.contact.whatsapp}?text=${encodeURIComponent(
    SITE.contact.whatsappMessage,
  )}`,
  mail: `mailto:${SITE.contact.email}?subject=${encodeURIComponent(
    "Richiesta preventivo ristrutturazione bagno",
  )}`,
} as const;

/**
 * Formattazione italiana fatta a mano, di proposito.
 *
 * Intl qui non è affidabile: il Node che compila il sito ha ICU ridotto e
 * restituisce "9490 €" invece di "9.490 €". Siccome la pagina è statica, il
 * formato sbagliato finirebbe cotto nell'HTML e il browser non potrebbe
 * rimediare. Per un prezzo fisso non serve la macchina dell'i18n.
 */
export const migliaia = (n: number) =>
  String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export const euro = (n: number) => `${migliaia(n)} €`;

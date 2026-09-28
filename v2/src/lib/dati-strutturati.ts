import { SITE, FAQ_VISIBILI } from "@/config/site";
import { PAGINE } from "@/config/pagine";

/**
 * Dati strutturati schema.org della home, in un grafo unico.
 *
 * Un solo blocco JSON-LD con i nodi collegati fra loro per @id: l'impresa, il
 * sito, la pagina (che e' anche la pagina delle domande frequenti) e il
 * servizio con la sua offerta. Prima erano due blocchi scollegati, uno nel
 * layout e uno nelle FAQ, e l'impresa compariva anche su privacy e cookie.
 *
 * Regola: qui va solo cio' che la pagina mostra. Niente recensioni, niente
 * valutazioni, niente coordinate o fasce di prezzo che il sito non dichiara.
 */

const BASE = SITE.brand.url;
export const ID = {
  impresa: `${BASE}/#impresa`,
  sito: `${BASE}/#sito`,
  pagina: `${BASE}/#pagina`,
  servizio: `${BASE}/#ristrutturazione-bagno`,
  logo: `${BASE}/#logo`,
} as const;

/** Le zone servite: i comuni nominati nel sito e la provincia. */
export const AREA_SERVITA = [
  ...SITE.zone.comuni.map((c) => ({ "@type": "City", name: c })),
  { "@type": "AdministrativeArea", name: "Provincia di Varese" },
];

function impresa() {
  const L = SITE.legal;
  return {
    // GeneralContractor e' il tipo di LocalBusiness per un'impresa che fa
    // lavori edili completi (sottotipo di HomeAndConstructionBusiness).
    "@type": "GeneralContractor",
    "@id": ID.impresa,
    name: SITE.brand.short,
    alternateName: SITE.brand.name,
    legalName: L.company,
    description: `Ristrutturazione bagno chiavi in mano a ${SITE.zone.long}. ${SITE.brand.claim}`,
    url: `${BASE}/`,
    logo: {
      "@type": "ImageObject",
      "@id": ID.logo,
      url: `${BASE}/images/logo-easybagno.png`,
      width: 512,
      height: 512,
      caption: SITE.brand.short,
    },
    image: [`${BASE}/images/og.jpg`, `${BASE}/images/bagno-ristrutturato.webp`],
    telephone: SITE.contact.phoneRaw,
    email: SITE.contact.email,
    vatID: L.vat,
    address: {
      "@type": "PostalAddress",
      streetAddress: L.address,
      postalCode: L.zip,
      addressLocality: L.city,
      addressRegion: L.province,
      addressCountry: L.country,
    },
    areaServed: AREA_SERVITA,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: SITE.contact.orari.giorni,
        opens: SITE.contact.orari.apre,
        closes: SITE.contact.orari.chiude,
      },
    ],
  };
}

function sito() {
  return {
    "@type": "WebSite",
    "@id": ID.sito,
    url: `${BASE}/`,
    name: SITE.brand.short,
    alternateName: SITE.brand.name,
    inLanguage: "it-IT",
    publisher: { "@id": ID.impresa },
  };
}

function pagina() {
  const home = PAGINE.home;
  return {
    // La home mostra le domande frequenti per intero: e' anche una FAQPage.
    "@type": FAQ_VISIBILI.length ? ["WebPage", "FAQPage"] : "WebPage",
    "@id": ID.pagina,
    url: `${BASE}${home.percorso}`,
    name: home.titolo,
    description: home.descrizione,
    inLanguage: "it-IT",
    dateModified: home.aggiornata,
    isPartOf: { "@id": ID.sito },
    about: { "@id": ID.impresa },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${BASE}/images/bagno-ristrutturato.webp`,
      width: 728,
      height: 924,
    },
    ...(FAQ_VISIBILI.length && {
      mainEntity: FAQ_VISIBILI.map((d) => ({
        "@type": "Question",
        name: d.q,
        acceptedAnswer: { "@type": "Answer", text: d.a },
      })),
    }),
  };
}

function servizio() {
  const O = SITE.offer;
  return {
    "@type": "Service",
    "@id": ID.servizio,
    name: "Ristrutturazione bagno chiavi in mano",
    serviceType: "Ristrutturazione bagno",
    description:
      "Demolizione, impianto idraulico ed elettrico nuovi con certificazione di conformità, pavimento e rivestimento, sanitari, box doccia e consegna del bagno pronto all'uso, con un solo referente.",
    provider: { "@id": ID.impresa },
    areaServed: AREA_SERVITA,
    offers: {
      "@type": "Offer",
      name: `${O.title} chiavi in mano`,
      description: `${O.subtitle}: ${O.included.join("; ")}.`,
      price: String(O.price),
      priceCurrency: "EUR",
      url: `${BASE}/#offerta`,
      seller: { "@id": ID.impresa },
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Lavori di ristrutturazione del bagno",
      itemListElement: SITE.services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title, description: s.text },
      })),
    },
  };
}

export function grafoHome() {
  return {
    "@context": "https://schema.org",
    "@graph": [impresa(), sito(), pagina(), servizio()],
  };
}

/** Per le pagine future (PaginaServizio): briciole di pane visibili e nei dati. */
export function briciole(voci: { nome: string; percorso: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: voci.map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: v.nome,
      item: `${BASE}${v.percorso}`,
    })),
  };
}

/** JSON sicuro dentro a <script>: un "<" nel testo chiuderebbe il tag. */
export const jsonLd = (dati: unknown) => JSON.stringify(dati).replace(/</g, "\\u003c");

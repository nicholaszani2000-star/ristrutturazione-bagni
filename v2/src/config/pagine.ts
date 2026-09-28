import { SITE } from "@/config/site";
import { migliaia } from "@/lib/links";

/**
 * Le pagine del sito, in un posto solo.
 *
 * Da qui leggono i metadati di ogni pagina (lib/seo.ts) e la sitemap: una
 * pagina che non sta in questo elenco non finisce nella sitemap, e una che ci
 * sta ha titolo, descrizione e canonical dichiarati una volta sola.
 *
 * "aggiornata" e' la data dell'ultima modifica vera del contenuto, da
 * cambiare a mano quando si cambia il testo. Non la data della build: Google
 * smette di fidarsi di un lastmod che cambia a ogni pubblicazione anche quando
 * la pagina e' identica.
 */
export type Pagina = {
  percorso: string;
  titolo: string;
  descrizione: string;
  titoloSocial?: string;
  descrizioneSocial?: string;
  aggiornata: string;
};

export const PAGINE = {
  home: {
    percorso: "/",
    titolo: `Ristrutturazione bagno a Gallarate, chiavi in mano | ${SITE.brand.short}`,
    descrizione: `Ristrutturazione bagno chiavi in mano a ${SITE.zone.long}: bagno 3×2 m a ${migliaia(SITE.offer.price)} € tutto compreso, sopralluogo gratuito e prezzo bloccato.`,
    titoloSocial: `Ristrutturazione bagno a Gallarate, chiavi in mano`,
    descrizioneSocial: `Il tuo nuovo bagno, senza stress: bagno 3×2 m a ${migliaia(SITE.offer.price)} € tutto compreso. Sopralluogo gratuito a ${SITE.zone.long}.`,
    aggiornata: "2026-09-28",
  },
  privacy: {
    percorso: "/privacy/",
    titolo: `Informativa privacy | ${SITE.brand.short}`,
    descrizione: `Come ${SITE.legal.company} tratta i dati personali di chi usa il sito ${SITE.brand.name} e richiede un sopralluogo.`,
    aggiornata: "2026-09-28",
  },
  cookie: {
    percorso: "/cookie/",
    titolo: `Cookie policy | ${SITE.brand.short}`,
    descrizione: `Quali cookie usa il sito ${SITE.brand.name}, a cosa servono e come cambiare la tua scelta.`,
    aggiornata: "2026-09-28",
  },
} satisfies Record<string, Pagina>;

/**
 * Pagine previste e NON ancora pubblicate.
 *
 * Restano fuori dalla sitemap e dai collegamenti finche' non hanno un
 * contenuto proprio. Una pagina per comune con lo stesso testo e il nome
 * della citta' cambiato e' una "doorway page": Google la tratta come spam e
 * puo' penalizzare tutto il sito. Per ognuna e' scritto cosa serve perche'
 * valga la pena farla.
 *
 * Per pubblicarne una: crea src/app/<percorso>/page.tsx con il componente
 * PaginaServizio, sposta la voce in PAGINE qui sopra e collegala dalla home
 * con un testo che dica dove porta.
 */
export const PAGINE_FUTURE = [
  {
    percorso: "/costo-ristrutturazione-bagno/",
    argomento: "Quanto costa ristrutturare un bagno",
    serve: "Voci di costo reali (demolizione, impianti, rivestimenti, sanitari), fasce di prezzo per misure diverse dal 3×2, cosa fa salire il prezzo. Solo cifre confermate dal titolare.",
  },
  {
    percorso: "/sostituzione-vasca-doccia/",
    argomento: "Da vasca a doccia",
    serve: "Prezzo o fascia di prezzo dell'intervento, tempi, foto di lavori veri (la coppia prima/dopo in home e' gia' un esempio), cosa comprende.",
  },
  {
    percorso: "/bagno-chiavi-in-mano/",
    argomento: "Il bagno chiavi in mano",
    serve: "Attenzione: e' l'argomento della home. Ha senso solo con un contenuto diverso (es. capitolato dei materiali, scelta di piastrelle e sanitari), altrimenti le due pagine si fanno concorrenza.",
  },
  {
    percorso: "/ristrutturazione-bagno-gallarate/",
    argomento: "Ristrutturazione bagno a Gallarate",
    serve: "Attenzione: e' la parola chiave della home. Da non creare finche' la home resta la pagina per Gallarate.",
  },
  {
    percorso: "/ristrutturazione-bagno-busto-arsizio/",
    argomento: "Ristrutturazione bagno a Busto Arsizio",
    serve: "Lavori fatti a Busto Arsizio (foto, tipo di intervento, quartiere), eventuali recensioni vere di clienti del posto.",
  },
  {
    percorso: "/ristrutturazione-bagno-cassano-magnago/",
    argomento: "Ristrutturazione bagno a Cassano Magnago",
    serve: "Come sopra: lavori e clienti veri a Cassano Magnago.",
  },
  {
    percorso: "/ristrutturazione-bagno-varese/",
    argomento: "Ristrutturazione bagno a Varese",
    serve: "Conferma che si lavora a Varese citta' e lavori fatti li'.",
  },
] as const;

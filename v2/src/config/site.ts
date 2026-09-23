/**
 * UNICA FONTE DI VERITÀ dei contenuti.
 * Chi aggiorna prezzi o recapiti tocca solo questo file.
 *
 * Regola: un valore fra parentesi quadre è un segnaposto. Il sito lo ignora
 * finché non viene sostituito con il valore vero.
 */

export const isPlaceholder = (v: string) =>
  v.trim().startsWith("[") && v.trim().endsWith("]");

export const SITE = {
  brand: {
    name: "EasyBagno.it",
    tagline: "Ristrutturazione bagno · chiavi in mano",
    payoff: "Il tuo bagno, in buone mani.",
    claim: "Dal progetto alla realizzazione, pensiamo a tutto noi.",
    domain: "easybagno.it",
    url: "https://easybagno.it",
  },

  zone: {
    long: "Gallarate e provincia di Varese",
    short: "Gallarate (VA)",
  },

  contact: {
    phoneDisplay: "349 239 1107",
    phoneRaw: "+393492391107",
    whatsapp: "393499711646",
    whatsappDisplay: "349 971 1646",
    whatsappMessage:
      "Ciao, vorrei informazioni per la ristrutturazione del mio bagno.",
    // Sostituire con info@easy-bagno.it quando la casella sul dominio è attiva
    email: "biodomus2025@libero.it",
    hours: "Lun–Ven 8:00–18:00 · Sab su appuntamento",
  },

  legal: {
    company: "BIODOMUS SRLS",
    address: "Via Carlo Noè, 45",
    zip: "21013",
    city: "Gallarate",
    province: "VA",
    country: "IT",
    vat: "04059520124",
    sdi: "USAL8PV",
    pec: "biodomus@cgn.legalmail.it",
  },

  /**
   * L'OFFERTA. Il prezzo vale per questa metratura e non è modificabile
   * dall'utente: per misure diverse si passa dal form.
   *
   * Nessun prezzo barrato: per il Codice del Consumo dovrebbe essere un
   * prezzo realmente praticato prima, e non lo è.
   */
  offer: {
    title: "Bagno completo 3×2 m",
    subtitle: "Chiavi in mano, tutto compreso",
    size: "circa 6 m² · la misura più richiesta",
    price: 9490,
    // ⚠️ DA CONFERMARE col commercialista prima del lancio
    vatNote: "IVA agevolata 10% inclusa",
    claim: 'Un prezzo solo, scritto per intero. Nessun "a partire da".',
    duration: "10–15 giorni lavorativi",
    durationNote:
      "Dalla demolizione alla consegna. La data di fine è scritta nel preventivo.",

    included: [
      "Demolizione del bagno esistente e smaltimento in discarica autorizzata",
      "Rifacimento completo dell'intonaco alle pareti",
      "Impianto idraulico nuovo, con certificazione di conformità",
      "Impianto elettrico nuovo, con certificazione di conformità",
      "Pavimento e rivestimento: piastrelle a scelta dal nostro capitolato",
      "Sanitari completi: WC e bidet con scarico e rubinetteria",
      "Box doccia con piatto doccia e miscelatore",
      "Lavabo con mobile e specchio",
      "Termoarredo (scaldasalviette)",
      "Sigillature, silicone e finiture",
      "Pulizia finale del cantiere e consegna pronta all'uso",
    ],

    // ⚠️ DA CONFERMARE col titolare. È la lista che protegge dalle contestazioni.
    excluded: [
      "Spostamento della colonna di scarico condominiale",
      "Opere strutturali o su muri portanti",
      "Rifacimento del massetto se emergono danni non visibili prima della demolizione",
      "Bonifica di amianto o tubature in piombo preesistenti",
      "Pratiche edilizie comunali, se il tuo intervento le richiede",
    ],

    surprisesNote:
      "Se durante la demolizione salta fuori un problema nascosto — una vecchia infiltrazione, una tubatura in piombo — ci fermiamo, ti mostriamo la foto e ti diamo il costo prima di proseguire. Non troverai mai un extra in fattura senza averlo approvato.",
  },

  /**
   * Detrazione fiscale. Spese 2026 — Agenzia delle Entrate, Bonus Ristrutturazioni.
   * VERIFICARE OGNI ANNO: dal 2027 l'abitazione principale scende al 36%.
   */
  taxCredit: {
    year: 2026,
    ratePrimary: 50,
    rateSecondary: 36,
    maxSpend: 96000,
    years: 10,
    note: "Detrazione IRPEF ripartita in 10 quote annuali di pari importo. Dal 2027 la percentuale sull'abitazione principale scende al 36%.",
    disclaimer:
      "Importi indicativi. La detrazione spetta se hai i requisiti previsti e va verificata con il tuo commercialista o CAF.",
  },

  /**
   * Cosa facciamo. Non e' un elenco inventato per riempire una sezione: sono
   * gli stessi interventi che l'impresa gia' elenca nel modulo di richiesta
   * (form.interventionTypes), scritti per essere letti invece che scelti da
   * una tendina. Se un giorno l'impresa smette di fare uno di questi, va tolto
   * da tutti e due i posti.
   */
  services: [
    {
      icon: "tiles",
      title: "Bagno completo chiavi in mano",
      text: "Demolizione, impianti, rivestimenti e sanitari. Un solo referente dal sopralluogo alla consegna.",
      evidenza: true,
    },
    {
      icon: "design",
      title: "Bagno su misura",
      text: "Metrature diverse dai 3×2 m, bagni ciechi, sottotetti e secondi bagni. Prezzo esatto dopo il sopralluogo.",
    },
    {
      icon: "plumbing",
      title: "Da vasca a doccia",
      text: "Sostituzione della vasca con un piatto a filo pavimento, senza rifare tutto il bagno.",
    },
    {
      icon: "survey",
      title: "Sanitari e rubinetteria",
      text: "Sostituzione di WC, bidet, lavabo e miscelatori, con allacci e scarichi a norma.",
    },
    {
      icon: "demo",
      title: "Pavimento e rivestimento",
      text: "Rifacimento delle sole superfici quando impianti e sanitari sono ancora in buono stato.",
    },
  ],

  /** I 6 passaggi del biglietto da visita */
  process: [
    { icon: "survey", title: "Sopralluogo", text: "Veniamo a misurare, ascoltiamo cosa vuoi e controlliamo impianti e scarichi esistenti. Gratuito e senza impegno." },
    { icon: "design", title: "Progettazione", text: "Ti proponiamo disposizione e materiali. Vedi come sarà il bagno prima che iniziamo." },
    { icon: "demo", title: "Demolizione", text: "Smontiamo il vecchio bagno e smaltiamo le macerie. Proteggiamo il resto della casa." },
    { icon: "plumbing", title: "Impianti", text: "Idraulico ed elettrico rifatti a norma, con dichiarazione di conformità intestata a te." },
    { icon: "tiles", title: "Rivestimenti", text: "Posa di pavimento, rivestimento, sanitari, box doccia e mobile lavabo." },
    { icon: "keys", title: "Consegna", text: "Puliamo il cantiere e ti consegniamo il bagno pronto da usare, con le certificazioni." },
  ],

  /** Le garanzie che i concorrenti non mettono per iscritto */
  differentiators: [
    { icon: "lock", title: "Prezzo bloccato in contratto", text: "Quello che firmi è quello che paghi. Nessun ricalcolo a lavori iniziati." },
    { icon: "cert", title: "Impianti certificati", text: "Dichiarazione di conformità DM 37/08 su idraulico ed elettrico, intestata a te." },
    { icon: "clock", title: "Data di fine per iscritto", text: "La consegna è nel preventivo, non una promessa a voce." },
    { icon: "users", title: "Un solo interlocutore", text: "Niente rimpalli fra idraulico, piastrellista ed elettricista: rispondiamo noi di tutto." },
    { icon: "pin", title: "Impresa del posto", text: "Sede e partita IVA verificabili a Gallarate. Ci trovi anche dopo la consegna." },
    { icon: "receipt", title: "Fattura per la detrazione", text: "Prepariamo la documentazione corretta per portare i lavori in detrazione." },
  ],

  /**
   * Sconto per chi lascia l'indirizzo email.
   *
   * ⚠️ DA CONFERMARE COL TITOLARE PRIMA DI PUBBLICARE: percentuale, su cosa si
   * applica e per quanto vale. Non è una frase di marketing, è un impegno
   * commerciale: chi si iscrive deve poterlo usare davvero, e le condizioni
   * scritte qui sono quelle che l'impresa dovrà rispettare. Se cambiano, si
   * cambiano qui e cambiano ovunque nella pagina.
   */
  promo: {
    percentuale: 5,
    suCosa: "sul preventivo del bagno completo",
    validita: "60 giorni dall'iscrizione",
    condizioni:
      "Lo sconto si applica al preventivo firmato dopo il sopralluogo e non è cumulabile con altre promozioni in corso.",
  },

  /** SOLO recensioni vere. Finché è vuoto, la sezione non si renderizza. */
  reviews: [] as { name: string; city: string; rating: number; text: string }[],

  faq: [
    { q: "Quanto costa davvero rifare un bagno?", a: "Per un bagno di circa 3×2 metri il prezzo chiavi in mano è 9.490 €, e comprende tutto quello che trovi nell'elenco qui sopra. Per misure o richieste diverse facciamo il preventivo dopo il sopralluogo: è gratuito e non ti impegna." },
    { q: "Quanto tempo resto senza bagno?", a: "Il cantiere dura in media 10–15 giorni lavorativi. La data di fine è scritta nel preventivo e ti avvisiamo subito se qualcosa cambia." },
    { q: "Il prezzo può cambiare a lavori iniziati?", a: "No. Il prezzo che firmi è bloccato. L'unica eccezione sono i problemi nascosti che si scoprono solo demolendo: in quel caso ci fermiamo, ti mostriamo le foto e ti diamo il costo. Decidi tu prima che proseguiamo." },
    { q: "Posso scaricare la spesa?", a: "Sì. Nel 2026 i lavori di ristrutturazione del bagno sull'abitazione principale danno diritto alla detrazione IRPEF del 50%, recuperata in 10 anni. Sulla seconda casa è il 36%. Prepariamo la fattura e i documenti giusti. Per la tua situazione conferma sempre con il commercialista." },
    { q: "Che garanzia avete sui lavori?", a: "[DA CONFERMARE: anni di garanzia sulle opere e sui materiali posati.]" },
    { q: "In quali zone lavorate?", a: "Lavoriamo a Gallarate e in provincia di Varese. Se sei appena fuori zona chiamaci lo stesso: valutiamo caso per caso." },
    { q: "Posso scegliere io piastrelle e sanitari?", a: "Sì. Il prezzo comprende la scelta dal nostro capitolato. Se preferisci materiali diversi ti diciamo subito la differenza di costo, prima di firmare." },
  ],

  form: {
    interventionTypes: [
      "Bagno completo 3×2 (offerta 9.490 €)",
      "Bagno completo, misura diversa",
      "Sostituzione vasca con doccia",
      "Solo sanitari e rubinetteria",
      "Solo rivestimenti e pavimento",
      "Non lo so ancora, vorrei un consiglio",
    ],
  },

  integrations: {
    /** Stream "easybagno.it" (ID 15826734180). Parte solo dopo il consenso. */
    ga4Id: "G-FCEM78H075",
    /** Pixel "EasyBagno". Parte solo dopo il consenso, come GA4. */
    metaPixelId: "1640497950773690",

    /**
     * Progetto "easy-bagno" (eu-central-1).
     *
     * La chiave e' quella PUBBLICABILE: sta nel codice del browser di
     * proposito. Sulla tabella iscrizioni c'e' una sola policy, di solo
     * inserimento e solo con consenso_marketing a true — con questa chiave
     * non si legge, non si modifica, non si cancella. Non e' un segreto
     * sfuggito.
     */
    supabase: {
      url: "https://mwydejjaevqamsjayghk.supabase.co",
      publishableKey: "sb_publishable_Pc7dVMi6Y1vZEAxlA9ziaw_okChxE0i",
    },
  },
} as const;

export type Site = typeof SITE;

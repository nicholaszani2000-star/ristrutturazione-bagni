/* =============================================================================
   EASY-BAGNO.IT — FILE DATI UNICO
   =============================================================================
   Questo è l'UNICO file da modificare per cambiare i dati del sito.
   Non serve saper programmare: cambia solo il testo tra le "virgolette".

   REGOLA: un valore scritto tra parentesi quadre, tipo "[META PIXEL ID]",
   è un segnaposto. Finché resta così, il sito lo ignora e non lo mostra.
   Appena lo sostituisci con il valore vero, si attiva da solo.
   ========================================================================== */

window.CONFIG = {

  /* ---------------------------------------------------------------------
     1. AZIENDA E CONTATTI
     --------------------------------------------------------------------- */
  business: {
    name: "Easy-Bagno.it",
    tagline: "Ristrutturazione bagni · chiavi in mano",
    slogan: "Il tuo bagno, in buone mani.",

    // Zona servita: appare nel titolo, nei sottotitoli e nei dati SEO.
    zone: "Gallarate e provincia di Varese",
    zoneShort: "Gallarate (VA)",

    // Telefono per le chiamate
    phoneDisplay: "349 239 1107",
    phoneRaw: "+393492391107",

    // WhatsApp: numero in formato internazionale SENZA + e SENZA spazi
    whatsappNumber: "393499711646",
    whatsappDisplay: "349 971 1646",
    whatsappMessage: "Ciao, vorrei informazioni per la ristrutturazione del mio bagno.",

    // NOTA: quando attivi la casella sul dominio (es. info@easy-bagno.it)
    // sostituisci qui sotto. Deve essere un indirizzo che ricevi davvero.
    email: "biodomus2025@libero.it",

    domain: "easy-bagno.it",
    siteUrl: "https://easy-bagno.it",

    // Orari di reperibilità — usati nella scheda contatti e nei dati SEO.
    hours: "Lun–Ven 8:00–18:00 · Sab su appuntamento"
  },

  /* ---------------------------------------------------------------------
     2. DATI LEGALI (obbligatori su un sito aziendale italiano)
     --------------------------------------------------------------------- */
  legalEntity: {
    companyName: "BIODOMUS SRLS",
    address: "Via Carlo Noè, 45",
    zip: "21013",
    city: "Gallarate",
    province: "VA",
    country: "IT",
    vat: "04059520124",       // Partita IVA
    sdi: "USAL8PV",           // Codice destinatario fatturazione elettronica
    pec: "biodomus@cgn.legalmail.it"
  },

  /* ---------------------------------------------------------------------
     3. L'OFFERTA — BAGNO COMPLETO 3x2 METRI
     ---------------------------------------------------------------------
     ATTENZIONE PREZZO: il prezzo qui sotto è quello che vede il cliente.
     Se un giorno vuoi mostrare un prezzo barrato (es. 11.000 barrato e
     9.490 in promo), compila "priceOriginal". Per legge (Codice del
     Consumo) il prezzo barrato deve essere un prezzo REALMENTE praticato
     prima. Se non lo hai mai praticato, LASCIALO COME SEGNAPOSTO.
     --------------------------------------------------------------------- */
  offer: {
    title: "Bagno completo 3×2 m",
    subtitle: "Chiavi in mano, tutto compreso",
    sizeLabel: "circa 6 m² · misura più richiesta",

    price: "9.490",
    currency: "€",
    priceOriginal: "[PREZZO ORIGINALE — solo se realmente praticato prima]",
    discountLabel: "[ES. -15% — solo se c'e' un prezzo originale vero]",

    // DA CONFERMARE PRIMA DEL LANCIO: l'IVA è inclusa o esclusa?
    // Sulle ristrutturazioni residenziali di norma si applica l'IVA
    // agevolata al 10%. Verifica con il tuo commercialista e scrivi qui
    // la dicitura esatta.
    vatNote: "IVA agevolata 10% inclusa",

    claim: "Un prezzo solo, scritto per intero. Nessun \"a partire da\".",

    // Cosa comprende il prezzo.
    included: [
      "Demolizione del bagno esistente e smaltimento delle macerie in discarica autorizzata",
      "Rifacimento completo dell'intonaco alle pareti",
      "Impianto idraulico nuovo, con certificazione di conformità",
      "Impianto elettrico nuovo, con certificazione di conformità",
      "Pavimento e rivestimento: piastrelle a scelta dal nostro capitolato",
      "Sanitari completi: WC e bidet con scarico e rubinetteria",
      "Box doccia con piatto doccia e miscelatore",
      "Lavabo con mobile e specchio",
      "Termoarredo (scaldasalviette)",
      "Sigillature, silicone e finiture",
      "Pulizia finale del cantiere e consegna pronta all'uso"
    ],

    // Cosa NON comprende. Questa lista è il nostro punto di forza:
    // i concorrenti la nascondono e poi presentano il conto.
    // DA CONFERMARE PRIMA DEL LANCIO con il titolare.
    excluded: [
      "Spostamento della colonna di scarico condominiale",
      "Opere strutturali o su muri portanti",
      "Rifacimento del massetto se sotto si trovano danni non visibili prima della demolizione",
      "Bonifica di eventuale amianto o tubature in piombo preesistenti",
      "Pratiche edilizie comunali, se il tuo intervento le richiede"
    ],

    // Nota onesta sugli imprevisti.
    surprisesNote: "Se durante la demolizione salta fuori un problema nascosto (un'infiltrazione vecchia, una tubatura in piombo), ti fermiamo, ti mostriamo la foto e ti diamo il costo prima di proseguire. Non troverai mai un extra in fattura senza averlo approvato.",

    // Tempi di cantiere.
    durationLabel: "10–15 giorni lavorativi",
    durationNote: "Dalla demolizione alla consegna. Ti diamo la data di fine per iscritto nel preventivo."
  },

  /* ---------------------------------------------------------------------
     4. DETRAZIONE FISCALE
     ---------------------------------------------------------------------
     Percentuali valide per le spese sostenute nel 2026.
     Fonte: Agenzia delle Entrate — Bonus Ristrutturazioni.
     VERIFICA OGNI ANNO: dal 2027 la prima casa scende al 36%.
     --------------------------------------------------------------------- */
  taxCredit: {
    enabled: true,
    year: "2026",
    ratePrimary: 50,        // abitazione principale
    rateSecondary: 36,      // seconda casa
    maxSpend: 96000,        // tetto di spesa per unità immobiliare
    years: 10,              // rate annuali
    note: "Detrazione IRPEF ripartita in 10 quote annuali di pari importo. Dal 2027 la percentuale sull'abitazione principale scende al 36%.",
    disclaimer: "Importi indicativi. La detrazione spetta se hai i requisiti previsti e va verificata con il tuo commercialista o CAF."
  },

  /* ---------------------------------------------------------------------
     5. PROCESSO — i 6 passaggi del biglietto da visita
     --------------------------------------------------------------------- */
  process: [
    { icon: "survey",   title: "Sopralluogo",              text: "Veniamo a misurare il bagno, ascoltiamo cosa vuoi e controlliamo impianti e scarichi esistenti. Gratuito e senza impegno." },
    { icon: "design",   title: "Progettazione",            text: "Ti proponiamo la disposizione e i materiali. Vedi come sarà il bagno prima che iniziamo." },
    { icon: "demo",     title: "Demolizione e rifacimento", text: "Smontiamo il vecchio bagno e smaltiamo le macerie. Proteggiamo il resto della casa." },
    { icon: "plumbing", title: "Impianti",                 text: "Idraulico ed elettrico rifatti a norma, con dichiarazione di conformità rilasciata a te." },
    { icon: "tiles",    title: "Rivestimenti e sanitari",  text: "Posa di pavimento, rivestimento, sanitari, box doccia e mobile lavabo." },
    { icon: "keys",     title: "Consegna chiavi in mano",  text: "Puliamo il cantiere e ti consegniamo il bagno pronto da usare, con le certificazioni." }
  ],

  /* ---------------------------------------------------------------------
     6. PERCHÉ NOI — le garanzie che i concorrenti non danno
     --------------------------------------------------------------------- */
  differentiators: [
    { icon: "price",   title: "Prezzo bloccato in contratto",   text: "Quello che firmi è quello che paghi. Nessun ricalcolo a lavori iniziati." },
    { icon: "cert",    title: "Impianti certificati",           text: "Dichiarazione di conformità DM 37/08 su idraulico ed elettrico, intestata a te." },
    { icon: "clock",   title: "Data di fine per iscritto",      text: "La data di consegna è nel preventivo, non una promessa a voce." },
    { icon: "shield",  title: "Un solo interlocutore",          text: "Niente rimpalli tra idraulico, piastrellista ed elettricista: rispondiamo noi di tutto." },
    { icon: "local",   title: "Impresa del posto",              text: "Siamo a Gallarate con sede e partita IVA verificabili. Ci trovi anche dopo la consegna." },
    { icon: "receipt", title: "Fattura per la detrazione",      text: "Ti prepariamo la documentazione corretta per portare i lavori in detrazione." }
  ],

  /* ---------------------------------------------------------------------
     7. RECENSIONI
     ---------------------------------------------------------------------
     REGOLA: inserisci SOLO recensioni vere di clienti veri.
     Finché l'elenco è vuoto, la sezione non viene mostrata.
     Formato: { name: "Mario R.", city: "Gallarate", text: "...", rating: 5 }
     --------------------------------------------------------------------- */
  reviews: [],

  /* ---------------------------------------------------------------------
     8. FAQ — risposte da confermare con il titolare
     --------------------------------------------------------------------- */
  faq: [
    { q: "Quanto costa davvero rifare un bagno?",
      a: "Per un bagno di circa 3×2 metri il nostro prezzo chiavi in mano è di 9.490 €, e comprende tutto quello che trovi nell'elenco qui sopra. Per misure o richieste diverse facciamo il preventivo dopo il sopralluogo: è gratuito e non ti impegna." },
    { q: "Quanto tempo resto senza bagno?",
      a: "Il cantiere dura in media 10–15 giorni lavorativi. Ti diamo la data di fine per iscritto nel preventivo e ti avvisiamo subito se qualcosa cambia." },
    { q: "Il prezzo può cambiare a lavori iniziati?",
      a: "No. Il prezzo che firmi è bloccato. L'unica eccezione sono i problemi nascosti che si scoprono solo demolendo, ad esempio una vecchia infiltrazione: in quel caso ci fermiamo, ti mostriamo le foto e ti diamo il costo. Decidi tu prima che proseguiamo." },
    { q: "Posso scaricare la spesa?",
      a: "Sì. Nel 2026 i lavori di ristrutturazione del bagno sull'abitazione principale danno diritto alla detrazione IRPEF del 50%, recuperata in 10 anni. Sulla seconda casa è il 36%. Ti prepariamo la fattura e i documenti giusti. Per la tua situazione specifica conferma sempre con il commercialista." },
    { q: "Che garanzia avete sui lavori?",
      a: "[DA CONFERMARE: anni di garanzia sulle opere e sui materiali posati.]" },
    { q: "In quali zone lavorate?",
      a: "Lavoriamo a Gallarate e in provincia di Varese. Se sei appena fuori zona chiamaci lo stesso: valutiamo caso per caso." },
    { q: "Posso scegliere io piastrelle e sanitari?",
      a: "Sì. Il prezzo comprende la scelta dal nostro capitolato. Se preferisci materiali diversi ti diciamo subito la differenza di costo, prima di firmare." }
  ],

  /* ---------------------------------------------------------------------
     9. FORM PREVENTIVO
     --------------------------------------------------------------------- */
  form: {
    interventionTypes: [
      "Bagno completo 3×2 (offerta 9.490 €)",
      "Bagno completo, misura diversa",
      "Solo sostituzione vasca con doccia",
      "Solo sanitari e rubinetteria",
      "Solo rivestimenti e pavimento",
      "Non lo so ancora, vorrei un consiglio"
    ],
    // Incentivo per lasciare l'email. Serve anche a costruire la lista
    // per le promozioni future (solo a chi da' il consenso marketing).
    emailIncentive: {
      enabled: true,
      label: "5%",
      text: "Lascia la tua email e ricevi uno sconto dedicato del 5% sul preventivo."
    }
  },

  /* =====================================================================
     10. INTEGRAZIONI — FASE 2
     =====================================================================
     NON SONO ANCORA COLLEGATE. Ogni voce è un segnaposto.
     Appena incolli il valore vero, la funzione corrispondente si attiva
     da sola: non serve toccare altro codice.
     Le istruzioni passo-passo sono nel README.md.
     ================================================================== */
  integrations: {
    // Dove finiscono i lead. Endpoint Supabase Edge Function oppure webhook n8n.
    leadsEndpoint: "[INCOLLA QUI IL TUO WEBHOOK URL]",

    // Salvataggio diretto su tabella Supabase (alternativa all'endpoint).
    supabaseUrl: "[SUPABASE URL]",
    supabaseAnonKey: "[SUPABASE ANON KEY]",
    supabaseTable: "leads",

    // Tracking
    metaPixelId: "[META PIXEL ID]",
    ga4Id: "[GA4 MEASUREMENT ID]",

    // Verifica proprietà sito
    googleSiteVerification: "[GOOGLE SITE VERIFICATION]"
  },

  /* ---------------------------------------------------------------------
     11. PRIVACY
     --------------------------------------------------------------------- */
  legal: {
    privacyUrl: "privacy.html",
    cookieUrl: "cookie.html"
  }
};

# Audit EasyBagno.it — 24 settembre 2026

Audit fatto **prima** di modificare: prima l'analisi, poi solo correzioni
sicure e verificate. Niente landing nuova, niente architettura riscritta,
nessun componente, contenuto, form o tracciamento rimosso.

Legenda: ✅ a posto · 🔧 corretto oggi · ⚠️ da fare tu · ℹ️ lasciato com'è, con il motivo

---

## Come è costruito

| | |
|---|---|
| Framework | Next.js 16 (App Router), esportato come sito statico |
| Stile | Tailwind CSS 4, token in `v2/src/app/globals.css` (blu, azzurro, bianco) |
| Testi e dati | un solo file: `v2/src/config/site.ts` |
| Animazioni | GSAP: comparsa allo scorrimento, parallasse leggera, contatore, pulsante magnetico |
| Hosting | Netlify, progetto `beamish-heliotrope-e2d8a2`, dominio `easybagno.it`, pubblicato da GitHub |
| Funzioni server | una: `/api/meta-evento` (Conversions API di Meta) |
| Lead | Supabase (tabella `iscrizioni`) + Netlify Forms (modulo `sconto`) |

Pagine: `/`, `/privacy/`, `/cookie/`, 404. Sezioni della home, in ordine:
Header · Hero · TrustBar · Servizi · Offerta · Detrazione · Prima/dopo ·
Progetto · Processo · Garanzie · Chi siamo · Scrivici + Sconto 5% · FAQ ·
CTA finale · Footer · barra fissa mobile.

---

## 1. Progetto e codice

- ✅ **Componenti**: 16 componenti e 15 sezioni, **tutti usati**. Nessun componente orfano.
- ✅ **Dipendenze**: 4 in produzione (next, react, react-dom, gsap), tutte usate. Le librerie 3D erano già state tolte.
- ✅ **Vecchia versione del sito**: già rimossa dalla radice del repo.
- 🔧 **`LEGGIMI-NETLIFY.txt` era pubblicato** su `easybagno.it/LEGGIMI-NETLIFY.txt`: note interne leggibili da chiunque. Spostato nella radice del repo, **non va più online**.
- ℹ️ **Candidati alla rimozione, non toccati**: `v2/scripts/preview-relative.mjs` e lo script `build:offline` (servivano per lo zip da aprire con doppio clic, oggi inutile), `v2/previews/` (screenshot vecchi), la tabella Supabase `leads` (vuota, non usata). Non incidono sul sito; li tolgo se me lo dici.

## 2. Badge "Powered by Netlify"

- ✅ **Non viene dal codice.** Ho cercato in sorgenti, configurazione e build pubblicata: nessun badge, nessuno script di Netlify, nessun iframe. L'HTML del sito non carica script di terzi.
- ⚠️ **Lo aggiunge Netlify dal suo pannello**, e lo strumento Netlify che ho a disposizione non legge quelle impostazioni. Da qui non riesco nemmeno ad aprire easybagno.it: la rete dell'ambiente lo blocca. Controlla in quest'ordine:
  1. **L'indirizzo che stai guardando.** La barra di Netlify ("Netlify Drawer") compare sugli indirizzi di anteprima, come `claude-new-session-01gjm2--beamish-heliotrope-e2d8a2.netlify.app` o quelli con `6ab…--beamish…`, **non** sul sito di produzione. Apri **https://easybagno.it** digitandolo.
  2. **Project configuration → Build & deploy → Post processing → Snippet injection**: se c'è uno snippet, eliminalo. Nel nostro codice non c'è.
  3. **Project configuration → Build & deploy → Deploy Previews → Netlify Drawer** (o "toolbar"): disattivalo.
  4. Se resta ancora: tieni premuto sul badge, copia il link e mandamelo insieme a uno screenshot. Da quello capisco da dove arriva.
- ℹ️ Hosting, deploy, DNS e dominio **non sono stati toccati**.

## 3. Servizi cloud

- ✅ **Nessun elemento "cloud" visibile**: niente toolbar, overlay o strumenti di sviluppo nella versione pubblica. L'indicatore di Next.js esiste solo in sviluppo locale.
- ✅ **Servizi attivi, tutti necessari**:
  - funzione `/api/meta-evento` (Conversions API);
  - Supabase (archivio dei lead);
  - Netlify Forms (avviso email);
  - "observability" di Netlify sulla funzione: lato server, non si vede sul sito.

  Non ho disattivato niente.

## 4. GA4

- ✅ **Un solo tag**, ID `G-FCEM78H075`, caricato **solo dopo "Accetta"**. Dopo il consenso si caricano 1 script e 1 `config`, niente doppioni, e alla ricarica di nuovo una sola volta.
- ✅ **Eventi**:
  - `page_view`, automatico;
  - `contatto_telefono`, `contatto_whatsapp`, `contatto_email`, ognuno con la posizione del pulsante;
  - `generate_lead` e `iscrizione_sconto` all'iscrizione;
  - `vista_offerta`.
- 🔧 **`vista_offerta` non partiva mai su telefono** (vedi punto 5). Corretto.
- 🔧 I clic dalla barra fissa ora risultano come posizione `barra-mobile`; prima erano `altro`.
- ⚠️ In GA4 segna `generate_lead` come **evento chiave**: Admin → Events.

## 5. Meta Pixel

- ✅ **Un solo Pixel**, `1640497950773690` ("dati di easybagno"), collegato all'account pubblicitario Easybagno. Caricato solo dopo "Accetta": 1 script, 1 `init`, 1 `PageView`.
- ✅ **Eventi**: `PageView`, `ViewContent`, `Contact` (telefono, WhatsApp, email), `Lead` con email cifrata SHA-256.
- ✅ **Conversions API**: ogni evento ha il suo gemello dal server con lo stesso `event_id`, così Meta non conta doppio. La funzione è pubblicata su Netlify. ⚠️ Resta spenta finché non inserisci `META_CAPI_TOKEN`.
- 🔧 **Errore trovato e corretto: `ViewContent` non partiva mai su telefono.** L'evento aspettava che il 40% della sezione offerta fosse a schermo, ma su mobile la sezione è alta 2,5 schermi e quel 40% non entra mai. Ora l'evento guarda la cifra del prezzo. Verificato su iPhone SE, iPhone 14, Pixel 7, iPad e desktop: parte una volta. Senza questa correzione il pubblico "Hanno visto il prezzo" sarebbe rimasto vuoto.
- ✅ **Revoca del consenso**: cancella `_ga`, `_fbp` e `_fbc` e ferma entrambi gli script.

## 6. Modulo sconto e lead

| Caso | Risultato |
|---|---|
| Email vuota | bloccato dal browser, nessun invio |
| Email non valida | bloccato dal browser, nessun invio |
| Senza spunta del consenso | bloccato, nessun invio |
| Tutto ok | "Fatto. Hai diritto al 5%", salvato su Supabase **e** Netlify |
| Supabase non risponde | successo: l'iscrizione arriva a Netlify |
| Netlify non risponde | successo: l'iscrizione arriva a Supabase |
| Entrambi giù | messaggio d'errore leggibile (`role="alert"`) con email e WhatsApp alternativi |

- ✅ **Antispam** con campo trappola (honeypot) nascosto e fuori dalla tabulazione.
- ✅ **Campo email a 16 px**, quindi iPhone non fa lo zoom quando lo tocchi.
- ✅ **Modulo `sconto` registrato su Netlify**, con un invio vero ricevuto.
- ⚠️ In **Forms → Form notifications** attiva l'avviso email, se non l'hai già fatto.

## 7. Mobile

Provato con Chromium simulando iPhone SE, 14, 14 Pro Max, Android 360 e iPad Mini.

- ✅ **Scroll orizzontale: 0** su tutti i dispositivi. Nessun elemento tagliato o fuori schermo, nessun errore nella console.
- ✅ Il banner cookie sta **sopra** la barra fissa, e la barra non copre mai il fondo pagina.
- 🔧 **iPhone con linea Home**: la barra fissa usava i margini di sicurezza, ma senza `viewport-fit=cover` iOS li comunica a 0. Aggiunto; barra, banner, contenitori, hero e footer ora rispettano i margini, anche con l'iPhone in orizzontale.
- 🔧 Link del footer portati a 44 px di altezza al tocco su telefono (prima 24).
- 🔧 Pulsante "Scrivici per il tuo preventivo" centrato quando va su due righe.
- ⚠️ **Safari vero non l'ho potuto provare**: qui c'è solo Chromium. Le correzioni per iPhone sono quelle standard di WebKit, ma fai un controllo dal tuo iPhone su https://easybagno.it: barra in basso, banner, modulo sconto.
- ℹ️ Sugli schermi piccoli il banner cookie copre buona parte del primo schermo. È normale per un banner di consenso, e sparisce alla prima scelta. Il testo si potrebbe accorciare: te lo propongo, non l'ho toccato.

## 8. Desktop e tablet

Provato a 768, 1024, 1280 e 1440 px.

- ✅ Nessuno scroll orizzontale, immagini non deformate, layout stabile (CLS 0).
- 🔧 A 1024 px la scheda "Materiali" della sezione Progetto toccava il bordo destro: ora ha 20 px di margine.

## 9. Design

- ✅ Identità coerente: blu, azzurro e bianco, look pulito. Una sola sezione scura, la Detrazione in blu navy, come accento. Niente 3D, niente video nell'hero, niente estetica dark o gaming.
- 🔧 Occhielli delle sezioni da 11,5 a 12 px, per leggibilità.
- ⚠️ **Le foto originali sono piccole** (728×924 px). Su iPhone e iPad vengono ingrandite fino a ×1,7–×2 e perdono nitidezza. Mandami gli originali o altri cantieri veri e li sostituisco.

## 10. Hero e CTA

- ℹ️ **21st.dev non è raggiungibile da questa sessione**: il server MCP 21st risponde "403 Forbidden" dal proxy e il sito è bloccato dalla rete. Come chiedi, **non ho inventato componenti nuovi**. Gli effetti attuali sono già sottili e a tema acqua e luce:
  - riflesso che scorre sul pulsante principale;
  - pulsante magnetico;
  - velo di luce dietro l'hero;
  - filo di luce sulle schede.

  Quando 21st è di nuovo raggiungibile (va aggiunto `21st.dev` ai domini permessi dell'ambiente), cerco lì "shimmer / glow / spotlight button" e ti propongo le varianti prima di cambiare qualcosa.

## 11. Prestazioni

- ✅ **Immagini**: WebP da 84 KB e 53 KB. La foto dell'hero è precaricata; le altre caricano solo quando servono.
- 🔧 **Font**: Caveat, il font a mano per una sola frase decorativa, non è più precaricato. Tolti 51 KB dal primo caricamento; restano 3 font precaricati.
- ✅ **CSS**: 11 KB compressi.
- ℹ️ **JavaScript**: circa 240 KB compressi. Sono Next.js, React e GSAP, cioè il peso dell'architettura attuale. Ridurlo vorrebbe dire riscriverla, e hai chiesto di non farlo.
- ✅ **Layout**: CLS 0 su tutti i dispositivi. Il movimento ridotto è rispettato (con "riduci movimento" attivo nel sistema, le animazioni si spengono).

## 12. Accessibilità

- ✅ **Contrasto** misurato sui pixel: tutti i testi sopra soglia.
- ✅ **Tastiera**: anello di fuoco visibile ovunque, link "Vai al contenuto", ordine logico.
- ✅ **Struttura**: `lang="it"`, un solo H1, titoli in ordine, landmark completi.
- ✅ **Testi alternativi e nomi**: nessuna immagine senza `alt`, nessun link o pulsante senza nome, tutti i campi con etichetta.
- 🔧 **Id duplicati** nel logo (intestazione + footer): ora unici.

## SEO

- ✅ Title, Open Graph, anteprima Twitter, dati strutturati (`HomeAndConstructionBusiness` + `FAQPage`), robots.txt.
- 🔧 **Privacy e cookie dichiaravano la home come pagina canonica**: ora ognuna ha la sua.
- 🔧 **Sitemap** con gli indirizzi finali, con la barra finale, così Netlify non deve reindirizzare.
- 🔧 **Meta description** da 190 a 160 caratteri: prima Google tagliava la parte sul sopralluogo gratuito.
- 🔧 **Pagina 404** in italiano con il marchio, al posto di quella predefinita in inglese.

---

## Le cose che restano a te

1. **Badge Netlify**: segui i controlli al punto 2.
2. **Controllo da iPhone** su https://easybagno.it.
3. **`META_CAPI_TOKEN`** su Netlify per accendere la Conversions API.
4. **Evento chiave `generate_lead`** in GA4 e **notifica email** del modulo su Netlify.
5. **IVA 10% inclusa**, anni di garanzia, esclusioni, condizioni dello sconto: da confermare.
6. **Recensioni vere** (oggi non c'è una sezione recensioni: nessuna è stata inventata) e **foto in alta risoluzione**.
7. Su Meta: **metodo di pagamento** e **Pagina Facebook** sull'account Easybagno.

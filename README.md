# Easy-Bagno.it — landing per preventivi

Sito statico a pagina singola per **BIODOMUS SRLS**, pensato per un unico scopo:
**far arrivare richieste di preventivo, chiamate e messaggi WhatsApp**.

Niente framework, niente compilazione: sono file HTML, CSS e JavaScript.
Si pubblica caricando la cartella così com'è.

---

## Indice

1. [Come modificare i testi e i numeri](#1-come-modificare-i-testi-e-i-numeri)
2. [Da confermare prima di andare online](#2-da-confermare-prima-di-andare-online)
3. [Come caricare le foto](#3-come-caricare-le-foto)
4. [Pubblicare su Netlify e collegare il dominio](#4-pubblicare-su-netlify-e-collegare-il-dominio)
5. [Fase 2 — cosa collegare e dove](#5-fase-2--cosa-collegare-e-dove)
6. [MCP e servizi necessari](#6-mcp-e-servizi-necessari)
7. [Checklist pre-lancio](#7-checklist-pre-lancio)
8. [Struttura dei file](#8-struttura-dei-file)

---

## 1. Come modificare i testi e i numeri

**Tutto quello che cambia sta in un unico file: `js/config.js`.**
Non serve toccare nient'altro. Apri il file con un editor di testo, cambia quello
che c'è tra le virgolette, salva e ricarica la pagina.

```js
phoneDisplay: "349 239 1107",     // come appare scritto
phoneRaw: "+393492391107",        // quello che compone il telefono
```

### La regola dei segnaposto

Un valore scritto tra parentesi quadre è un **segnaposto**:

```js
metaPixelId: "[META PIXEL ID]"
```

Finché resta così, il sito lo **ignora**: non mostra niente e non attiva niente.
Appena lo sostituisci con il valore vero, la funzione corrispondente si accende
da sola. Non c'è altro da fare.

### Cose che si cambiano spesso

| Cosa | Dove in `config.js` |
|---|---|
| Numero di telefono / WhatsApp | `business.phoneDisplay`, `business.phoneRaw`, `business.whatsappNumber` |
| Email | `business.email` |
| Zona servita | `business.zone` |
| Prezzo dell'offerta | `offer.price` |
| Cosa è incluso / escluso | `offer.included`, `offer.excluded` |
| Durata del cantiere | `offer.durationLabel` |
| Domande frequenti | `faq` |
| Recensioni | `reviews` |

### Aggiungere una recensione

Solo recensioni **vere**. Finché l'elenco è vuoto la sezione non compare.

```js
reviews: [
  { name: "Mario R.", city: "Gallarate", rating: 5,
    text: "Lavoro finito nei tempi promessi, prezzo rispettato." }
],
```

### Il prezzo barrato

Per legge (Codice del Consumo) un prezzo barrato deve essere un prezzo che hai
**davvero praticato prima**. Non inventarlo. Se ce l'hai, compila
`offer.priceOriginal` e `offer.discountLabel`; altrimenti lasciali come sono e il
barrato non comparirà.

---

## 2. Da confermare prima di andare online

Queste voci sono state scritte in base a quanto concordato, ma **vanno controllate
da te prima della pubblicazione**. Sono tutte in `js/config.js`.

| # | Voce | Perché è importante |
|---|---|---|
| 1 | **`offer.vatNote` — "IVA agevolata 10% inclusa"** | I 9.490 € sono IVA inclusa o esclusa? Va scritto giusto: è un obbligo verso il consumatore. Verifica con il commercialista. |
| 2 | **`offer.included` (11 voci)** | Controlla riga per riga che sia tutto davvero compreso nel prezzo. |
| 3 | **`offer.excluded` (5 voci)** | Sono le esclusioni tipiche del settore. Aggiungi o togli quello che serve: è questa lista che ti protegge dalle contestazioni. |
| 4 | **`offer.durationLabel` — "10–15 giorni lavorativi"** | Confermi questi tempi? La timeline giorno per giorno è nella sezione "I tempi" di `index.html`. |
| 5 | **FAQ "Che garanzia avete sui lavori?"** | È l'unica risposta lasciata come segnaposto: scrivici gli anni di garanzia che dai. |
| 6 | **`business.hours`** | Orari di reperibilità. |
| 7 | **`business.email`** | Oggi punta a `biodomus2025@libero.it`. Quando attivi `info@easy-bagno.it` sul dominio, cambialo qui. |
| 8 | **Sconto 5% per l'email** | Se lo confermi va onorato. Per toglierlo: `form.emailIncentive.enabled: false`. |
| 9 | **`privacy.html` e `cookie.html`** | Bozze complete ma generiche: falle validare dal consulente privacy. |

---

## 3. Come caricare le foto

Il sito ha tre punti dove vanno le tue foto reali. Ora ci sono dei riquadri
a righe che dicono quale file caricare.

| Dove | File da mettere in `assets/` | Come sostituirlo |
|---|---|---|
| Prima / Dopo | `prima-1.jpg` e `dopo-1.jpg` | In `index.html` cerca `<!-- SOSTITUISCI le due immagini` |
| Galleria lavori | `lavoro-1.jpg` … `lavoro-4.jpg` | In `index.html` cerca `<!-- SOSTITUISCI ogni riquadro` |

Sostituisci il blocco:

```html
<div class="photo-slot">…</div>
```

con:

```html
<img src="assets/lavoro-1.jpg" alt="Bagno ristrutturato a Gallarate"
     width="800" height="800" loading="lazy">
```

**Consigli pratici**

- Per il prima/dopo scatta dallo **stesso punto**, stessa altezza. È il confronto
  che convince.
- Ridimensiona a circa 1200px di lato lungo, formato `.jpg` o `.webp`, sotto i 250 KB.
- Scrivi sempre l'`alt`: è quello che legge Google e chi usa uno screen reader.
- Metti `width` e `height`: evita che la pagina "salti" mentre carica.

> Le illustrazioni del bagno (`hero-bagno.svg`) sono disegni vettoriali, non
> fotografie. Sono lì apposta: mettere render finti spacciandoli per lavori tuoi
> sarebbe pubblicità ingannevole. Appena hai le foto vere, usa quelle.

---

## 4. Pubblicare su Netlify e collegare il dominio

1. Su [netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**.
2. Collega GitHub e scegli questo repository.
3. Impostazioni di build — lascia così:
   - **Build command**: vuoto
   - **Publish directory**: `.`
   (sono già scritte in `netlify.toml`, non dovrebbe chiederti niente)
4. **Deploy**. In meno di un minuto il sito è online su un indirizzo `*.netlify.app`.
5. Dominio: **Domain settings** → **Add a domain** → `easy-bagno.it`.
6. Su Register (dove compri il dominio) imposta i DNS che ti indica Netlify.
7. Il certificato HTTPS lo genera Netlify da solo, gratis. Aspetta che diventi verde.
8. Quando il dominio funziona, **togli il commento** alla regola di redirect www
   in fondo a `netlify.toml`.

Ogni volta che fai `git push`, Netlify ripubblica da solo.

---

## 5. Fase 2 — cosa collegare e dove

Il codice è **già pronto** per tutte queste integrazioni: gli agganci ci sono e
sono commentati. Devi solo incollare gli identificativi al posto giusto.

### 5.1 Meta Pixel (Facebook / Instagram)

1. [business.facebook.com](https://business.facebook.com) → **Gestione eventi** →
   **Collega origine dati** → **Web**.
2. Copia il **Pixel ID** (un numero lungo).
3. Incollalo in `js/config.js`:
   ```js
   metaPixelId: "123456789012345",
   ```

Da quel momento partono da soli: `PageView`, `ViewContent` (sezione offerta),
`Contact` (click su telefono e WhatsApp) e **`Lead`** (form inviato).
**La conversione da ottimizzare nelle campagne è `Lead`.** Non ottimizzare mai
sulle visite alla pagina.

### 5.2 Meta CAPI (conversioni lato server) — importante

Il pixel da solo perde conversioni: adblocker, iOS, cookie bloccati. La
**Conversions API** manda lo stesso evento anche dal server, e i due si uniscono
grazie allo stesso `event_id`.

L'aggancio è già scritto e commentato in `js/main.js` — cerca
`sendLeadToCapi`. Serve una funzione serverless (Netlify Function) che riceva
l'evento e chiami Meta con l'access token.

> **Il token di Meta non va MAI scritto in `config.js`.** Quel file è pubblico:
> chiunque può leggerlo. Va nelle variabili d'ambiente di Netlify.

### 5.3 Google Analytics 4

1. [analytics.google.com](https://analytics.google.com) → crea proprietà → flusso dati Web.
2. Copia l'**ID misurazione** (formato `G-XXXXXXXXXX`).
3. In `js/config.js`:
   ```js
   ga4Id: "G-XXXXXXXXXX",
   ```
4. In GA4 segna `lead` come **conversione** (Admin → Eventi → Segna come conversione).

### 5.4 Supabase — salvare i lead e le email

Serve per conservare le richieste e costruire la lista per le promozioni future.

**Passo 1 — crea la tabella.** In Supabase → SQL Editor:

```sql
create table public.leads (
  id                 bigserial primary key,
  data               timestamptz not null default now(),
  nome               text not null,
  telefono           text not null,
  email              text,
  comune             text,
  tipo_intervento    text,
  messaggio          text,
  consenso_marketing boolean not null default false,
  fonte              text,
  campagna           text,
  stato              text not null default 'Nuovo',
  pagina             text
);

alter table public.leads enable row level security;

-- Il sito può solo INSERIRE. Non può leggere né modificare niente:
-- così, anche conoscendo la chiave pubblica, nessuno può scaricarsi i tuoi lead.
create policy "il sito puo solo inserire"
  on public.leads for insert to anon with check (true);
```

**Passo 2 — collega il sito.** In Supabase → Project Settings → API, copia
**Project URL** e la chiave **anon / publishable**, e mettile in `js/config.js`:

```js
supabaseUrl: "https://xxxxxxxx.supabase.co",
supabaseAnonKey: "eyJhbGciOi…",
```

Fatto: il form comincia a salvare da solo.

> **Solo la chiave `anon` va nel sito.** La chiave `service_role` dà accesso
> completo al database: non deve mai finire in `config.js`.

**Le email per le promozioni.** Puoi scrivere solo a chi ha spuntato il consenso
marketing. Per estrarre la lista:

```sql
select email, nome, comune from public.leads
where consenso_marketing = true and email is not null;
```

### 5.5 Notifica immediata al titolare

Un lead che resta in un database per tre giorni è un lead perso. Due modi:

- **Brevo** — crea un automation che ti manda una email (o un SMS) a ogni nuova riga.
- **n8n** — un workflow con un nodo Webhook. Copia l'URL del webhook e mettilo in
  `js/config.js` alla voce `leadsEndpoint`: il form comincerà a mandare lì.
  Da n8n puoi poi inoltrare su email, Telegram, Google Sheets, quello che vuoi.

### 5.6 Variabili d'ambiente su Netlify

Token e chiavi segrete si impostano **a mano** nel pannello Netlify:
**Site settings → Environment variables**.

Da mettere lì (quando servono, per le funzioni serverless):

| Nome | A cosa serve |
|---|---|
| `META_CAPI_TOKEN` | Token della Conversions API |
| `META_PIXEL_ID` | Pixel ID lato server |
| `SUPABASE_SERVICE_KEY` | Chiave completa, solo per funzioni serverless |
| `BREVO_API_KEY` | Invio email di notifica |

**Non vanno mai in `config.js`**, che è leggibile da chiunque visiti il sito.

---

## 6. MCP e servizi necessari

Elenco dei collegamenti da autorizzare per completare il progetto.

### Già collegati e funzionanti

| Servizio | A cosa serve qui |
|---|---|
| **GitHub** | Repository del sito, deploy automatico |
| **Supabase** | Tabella lead, email per le promozioni |

### Da autorizzare (richiedono il tuo login)

| Servizio | A cosa serve | Come si autorizza |
|---|---|---|
| **Netlify** | Pubblicazione, dominio, variabili d'ambiente | Impostazioni connettori su claude.ai |
| **Meta Ads** | Pixel, CAPI, campagne sull'account dedicato | Impostazioni connettori su claude.ai |
| **Brevo** | Notifica immediata dei lead, newsletter | Impostazioni connettori su claude.ai |

### Da configurare a parte

| Servizio | Nota |
|---|---|
| **GA4** | Non ha un MCP di configurazione: la proprietà va creata a mano su analytics.google.com. Serve solo l'ID `G-…`. |
| **n8n** | Al momento il collegamento restituisce errore 404: va sistemato prima di poterlo usare per i webhook. |
| **21st MCP** | Già configurato in `.mcp.json`. Serve una chiave gratuita da [21st.dev/mcp](https://21st.dev/mcp) da mettere nella variabile `API_KEY_21ST`. Utile per componenti UI, non indispensabile per questo sito (è in HTML puro). |
| **Higgsfield** | Credito attuale: **0** (piano free). Serve un piano a pagamento per generare immagini o video. |
| **Remotion** | Per video promozionali da usare nelle campagne Meta. Da valutare in una fase successiva. |

### Ordine consigliato

1. **Netlify** → il sito va online (senza questo, il resto non serve).
2. **Supabase** → i lead vengono salvati.
3. **Brevo** o **n8n** → ricevi la notifica e richiami il cliente in giornata.
4. **Meta Pixel + GA4** → si misura.
5. **Meta CAPI** → si misura bene, e solo a questo punto si spingono le campagne.

> Non far partire campagne a pagamento prima del punto 4. È esattamente l'errore
> del progetto precedente: annunci attivi, tracciamento rotto, conversioni a zero.

---

## 7. Checklist pre-lancio

Da spuntare prima di mandare traffico a pagamento.

**Contenuti**
- [ ] Le 9 voci del punto 2 sono state confermate
- [ ] Foto reali caricate (prima/dopo + almeno 4 lavori)
- [ ] Garanzia sui lavori scritta nelle FAQ
- [ ] Nessun `[TESTO TRA PARENTESI]` visibile nella pagina

**Funzionamento** (provalo dal telefono, non solo dal computer)
- [ ] Il pulsante *Chiama* apre il telefono col numero giusto
- [ ] *WhatsApp* apre la chat col messaggio già scritto
- [ ] L'email si apre e l'indirizzo è giusto
- [ ] Il form invia e compare "Richiesta inviata!"
- [ ] **Ti è arrivata la notifica del lead di prova**
- [ ] La barra in basso non copre il contenuto

**Tecnica**
- [ ] Sito online in HTTPS sul dominio definitivo
- [ ] `sitemap.xml`, `robots.txt` e i link nel footer puntano al dominio vero
- [ ] Sito verificato in [Google Search Console](https://search.google.com/search-console)
- [ ] Anteprima WhatsApp corretta ([Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/))
- [ ] Punteggio Lighthouse mobile ≥ 90
- [ ] Banner cookie installato **prima** di attivare Pixel e GA4

**Legale**
- [ ] Privacy e cookie policy validate
- [ ] Le date `[data di pubblicazione]` nelle due pagine sono state compilate
- [ ] Prezzo e IVA scritti in modo corretto

---

## 8. Struttura dei file

```
.
├── index.html            la pagina
├── privacy.html          informativa privacy (bozza da validare)
├── cookie.html           cookie policy (bozza da validare)
├── css/styles.css        grafica: colori, caratteri, layout
├── js/
│   ├── config.js         ⬅ L'UNICO FILE DA MODIFICARE
│   └── main.js           logica: form, slider, calcolatore, tracciamento
├── assets/
│   ├── logo.svg          logo
│   ├── favicon.svg       icona nella scheda del browser
│   ├── hero-bagno.svg    illustrazione
│   ├── og-image.png      anteprima per WhatsApp e Facebook
│   └── (qui le tue foto)
├── netlify.toml          configurazione di pubblicazione
├── robots.txt            istruzioni per Google
├── sitemap.xml           elenco pagine per Google
└── .mcp.json             configurazione del 21st MCP
```

### Vedere il sito sul proprio computer

Aprire `index.html` con doppio clic funziona quasi del tutto, ma per provarlo
davvero conviene avviare un server locale:

```bash
python3 -m http.server 8000
```

Poi apri `http://localhost:8000`.

### Scelte tecniche, in breve

- **Niente framework**: una landing di 10 sezioni non ne ha bisogno. Meno codice,
  meno cose che si rompono, pagina più veloce sul telefono — e da lì arriva quasi
  tutto il traffico.
- **Un solo file dati**: chi aggiorna i prezzi non deve saper programmare.
- **Tracciamento spento finché gli ID sono finti**: impossibile mandare dati
  sporchi a Meta o a Google per distrazione.
- **Il prezzo in chiaro**: i concorrenti scrivono "a partire da" e poi il conto
  sale del 20–30%. Mostrare il prezzo intero e la lista di cosa *non* è incluso è
  il vantaggio competitivo principale di questa pagina.
- **Il calcolatore della detrazione**: trasforma "9.490 €" in "ti costa davvero
  4.745 €". È il passaggio che fa scattare la richiesta di preventivo.

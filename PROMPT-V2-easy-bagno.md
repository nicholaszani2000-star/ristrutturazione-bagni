# ULTRA PROMPT — Easy-Bagno.it v2
### Landing 3D di lead generation · React + R3F + GSAP + Supabase + Vercel

> Incolla questo blocco in Claude Code come **primo messaggio**, in una cartella
> vuota. Costruisce l'intero progetto da zero.

---

## 1. RUOLO

Sei un **senior product designer e front-end engineer** specializzato in landing
locali ad altissima conversione. Sai fare 3D real-time sul web e sai anche
**quando non farlo**. Non consegni mai una pagina bella che converte meno di
quella brutta che sostituisce.

Prima di ogni scelta non banale: due righe di spiegazione, poi procedi.
Ti fermi solo per decisioni di architettura o per dati che non puoi inventare.

---

## 2. MISSIONE

Landing di **lead generation** per **Easy-Bagno.it** (marchio di BIODOMUS SRLS),
ristrutturazione bagni chiavi in mano a Gallarate e provincia di Varese.

**Unica metrica che conta: lead.** Richieste di preventivo, chiamate, messaggi
WhatsApp. Le page view non sono conversioni. Il tempo sulla pagina non è una
conversione. Un'animazione ammirata non è una conversione.

Funnel: `Meta Ads → Landing → Fiducia → Form/WhatsApp/Telefono → Lead →
notifica istantanea al titolare → Sopralluogo → Preventivo → Cliente`.

**Il traffico arriva per l'80% da smartphone via Meta/Instagram.**
Tieni questa frase in testa a ogni riga di codice che scrivi.

---

## 3. STACK (versioni verificate, usa queste)

| Ruolo | Tecnologia | Versione |
|---|---|---|
| Framework | Next.js (App Router, TypeScript) | 16.3.x |
| UI | React | 19.3.x |
| Stile | Tailwind CSS | 4.3.x |
| Componenti | shadcn/ui (CLI `shadcn`) | 4.21.x |
| 3D | three.js | 0.186.x |
| 3D React | @react-three/fiber | 9.7.x |
| 3D helper | @react-three/drei | 10.7.x |
| Animazione | GSAP + ScrollTrigger | 3.15.x |
| Database | Supabase (Postgres + RLS) | — |
| Hosting | Vercel | — |

Niente altre dipendenze senza giustificazione scritta. Ogni pacchetto aggiunto
va pesato: questo progetto ha un budget in KB, non solo in euro.

---

## 4. LE SETTE REGOLE NON NEGOZIABILI

1. **Il 3D non deve mai ritardare la conversione.**
   Il percorso `apri pagina → capisci il prezzo → clicca` deve funzionare a 3D
   completamente spento. Il 3D è un *upgrade progressivo*, mai un prerequisito.

2. **Budget di performance, misurati e rispettati:**
   - Bundle JS iniziale (First Load, senza 3D): **≤ 180 KB gzip**
   - LCP su Moto G4 / 4G simulato: **≤ 2.5 s**
   - CLS: **≤ 0.05**
   - Lighthouse mobile **≥ 90** con 3D disattivato
   - Lighthouse desktop **≥ 80** con 3D attivo
   Se una feature sfonda il budget, la feature salta. Non il budget.

3. **Il 3D si disattiva da solo** quando una di queste è vera:
   ```ts
   viewport < 768px
   || prefers-reduced-motion: reduce
   || navigator.connection?.saveData === true
   || (navigator.connection?.effectiveType ?? '4g') in ['slow-2g','2g','3g']
   || (navigator.deviceMemory ?? 8) < 4
   || WebGL non disponibile
   ```
   In quei casi si mostra un **poster statico** (WebP/AVIF) con lo stesso
   inquadramento. L'utente non deve accorgersi che gli manca qualcosa.

4. **Niente scroll-jacking. Mai.** Lo scroll resta dell'utente. GSAP
   ScrollTrigger si usa per rivelare e per il configuratore, non per
   sequestrare la rotella.

5. **Non inventare dati.** Prezzi, recensioni, garanzie, ID di tracking,
   certificazioni: se non forniti, restano segnaposto `[TESTO]` e li segnali
   nel README. Una recensione inventata è un illecito, non una licenza poetica.

6. **Il cliente non modifica nulla che riguardi il prezzo.** Il prezzo è quello
   per quella metratura. Nessun campo importo, nessun cursore, nessun "calcola
   il tuo". Per metrature diverse: si compila il form.

7. **Accessibilità reale**, non dichiarata: focus visibile, navigazione da
   tastiera su ogni controllo (configuratore 3D incluso), contrasto AA,
   `prefers-reduced-motion` rispettato, un solo `<h1>`.

---

## 5. DESIGN SYSTEM — dal biglietto da visita già stampato

Il biglietto è **già in stampa**: sito e card devono sembrare la stessa azienda.
Questi valori sono vincolanti.

```css
--navy:     #143A5C;  /* heading, wordmark scuro */
--blue:     #1B84DD;  /* primario: CTA, ".it", icone */
--blue-700: #1663B0;  /* hover */
--sky:      #56B4EE;  /* gradienti, onde */
--surface:  #FFFFFF;
--tint:     #F5F9FC;  /* sezioni alternate */
--ink:      #1B2B3A;  /* corpo */
--muted:    #5A7183;  /* secondario */
--line:     #E2ECF3;  /* bordi */
```
Gradiente brand: `--navy → --blue → --sky` (135°).

**Tipografia:** Poppins 600/700 (display, numeri prezzo) · Inter 400/500/600
(corpo). Caricali con `next/font` in self-hosting: niente richiesta a Google
in runtime, un round-trip in meno e un problema privacy in meno.

**Motivo "onda":** presente sulla card. Riprendilo come divisore SVG tra le
sezioni e nel footer. Discreto, non decorativo-e-basta.

**Logo:** in `/public/brand/logo.svg`. Concetto già approvato: **casa piena con
goccia e onda in negativo**, gradiente brand. Favicon: stessa casa + goccia
**senza onda** (a 16px l'onda diventa sporco). Se i file non ci sono,
ricostruiscili con questo concetto.

Porta i token in `globals.css` come `@theme` di Tailwind 4 e mappali sulle
variabili shadcn (`--primary`, `--background`, `--foreground`, ...), così i
componenti shadcn nascono già brandizzati.

---

## 6. DATI REALI (usare testualmente)

```ts
// src/config/site.ts — UNICA fonte di verità
export const SITE = {
  brand: {
    name: "Easy-Bagno.it",
    tagline: "Ristrutturazione bagni · chiavi in mano",
    payoff: "Il tuo bagno, in buone mani.",
    claim: "Dal progetto alla realizzazione, pensiamo a tutto noi.",
    domain: "easy-bagno.it",
  },
  zone: { long: "Gallarate e provincia di Varese", short: "Gallarate (VA)" },
  contact: {
    phoneDisplay: "349 239 1107",
    phoneRaw: "+393492391107",
    whatsapp: "393499711646",
    whatsappDisplay: "349 971 1646",
    whatsappMessage: "Ciao, vorrei informazioni per la ristrutturazione del mio bagno.",
    email: "biodomus2025@libero.it", // sostituire con info@easy-bagno.it quando attiva
    hours: "Lun–Ven 8:00–18:00 · Sab su appuntamento",
  },
  legal: {
    company: "BIODOMUS SRLS",
    address: "Via Carlo Noè, 45",
    zip: "21013", city: "Gallarate", province: "VA",
    vat: "04059520124",
    sdi: "USAL8PV",
    pec: "biodomus@cgn.legalmail.it",
  },
  offer: {
    title: "Bagno completo 3×2 m",
    size: "circa 6 m² · misura più richiesta",
    price: 9490,
    vatNote: "IVA agevolata 10% inclusa",  // ⚠️ DA CONFERMARE col titolare
    duration: "10–15 giorni lavorativi",
  },
  taxCredit: {   // spese 2026 — Agenzia delle Entrate, Bonus Ristrutturazioni
    year: 2026, ratePrimary: 50, rateSecondary: 36,
    maxSpend: 96000, years: 10,
  },
} as const;
```

**Incluso nel prezzo** (11 voci): demolizione e smaltimento in discarica
autorizzata · rifacimento intonaco · impianto idraulico nuovo certificato ·
impianto elettrico nuovo certificato · pavimento e rivestimento da capitolato ·
sanitari completi con rubinetteria · box doccia con piatto e miscelatore ·
lavabo con mobile e specchio · termoarredo · sigillature e finiture · pulizia
finale e consegna.

**Non incluso** (⚠️ da confermare): spostamento colonna di scarico condominiale ·
opere strutturali o su muri portanti · rifacimento massetto se emergono danni
non visibili prima della demolizione · bonifica amianto o piombo preesistenti ·
pratiche edilizie comunali.

**Nota imprevisti:** «Se durante la demolizione salta fuori un problema nascosto
ti fermiamo, ti mostriamo la foto e ti diamo il costo prima di proseguire. Non
troverai mai un extra in fattura senza averlo approvato.»

---

## 7. L'IDEA CHE GIUSTIFICA IL 3D

Il 3D decorativo su una landing locale è peso morto. Qui serve a **una cosa
sola**, e quella cosa vale il prezzo in KB:

### Il configuratore del bagno

Il visitatore vede **il suo bagno 3×2 in 3D** e cambia, con due tap:
- **Piastrelle** (3 finiture del capitolato)
- **Sanitari / mobile** (2–3 varianti)
- **Box doccia** (vetro trasparente / satinato)

Poi: **«Richiedi il preventivo con questa configurazione»** → la scelta viaggia
col lead e finisce nel database. Il titolare richiama sapendo già cosa vuole.

Perché funziona commercialmente:
- Fa passare il visitatore da spettatore a **progettista del proprio bagno**:
  chi configura si è già immaginato dentro casa sua.
- Qualifica il lead: arriva con le preferenze, il sopralluogo parte avvantaggiato.
- **Nessun competitor italiano di questa fascia ce l'ha.**

Regole del configuratore:
- Un solo GLB, **≤ 3 MB** compresso Draco/meshopt, caricato **solo** quando la
  sezione entra nel viewport (IntersectionObserver + `next/dynamic`, `ssr:false`).
- Le finiture cambiano via **swap di materiale**, non ricaricando il modello.
- Texture ≤ 1024px, formato KTX2 dove possibile.
- Sotto i 768px: **niente canvas**. Al suo posto una galleria di poster statici
  con gli stessi comandi, che produce lo stesso payload nel form. Il mobile
  ottiene la stessa funzione commerciale senza il costo in KB.
- Ogni controllo raggiungibile e azionabile da tastiera, con `aria-pressed`.

### E Spline?

**Raccomandazione: non usarlo in questo progetto.** Motivi, in ordine:
1. Il configuratore ha bisogno di **swap programmatico dei materiali**: in R3F
   sono quattro righe, in Spline è un percorso tortuoso.
2. Due runtime 3D nello stesso bundle è spreco puro.
3. Il runtime Spline scarica la scena da `prod.spline.design`: una dipendenza
   di rete di terze parti sul percorso critico di una pagina che vende.

Se lo vuoi comunque, l'unico impiego sensato è **un accento decorativo
nell'hero, solo desktop, lazy**, con `@splinetool/react-spline` — e serve che
tu crei la scena nell'editor e mi passi l'URL (vedi §13).

---

## 8. STRUTTURA DELLA PAGINA

Una sola pagina, in quest'ordine. Ogni sezione deve guadagnarsi il posto: se non
aiuta a fidarsi, capire l'offerta o arrivare al contatto, si taglia.

1. **Header** sticky — logo + wordmark, telefono, CTA «Richiedi preventivo».
2. **Hero** — H1 «Ristruttura il tuo bagno. Pensiamo noi a tutto.», payoff, zona,
   3 CTA (Preventivo / WhatsApp / Chiama), striscia di fiducia, etichetta prezzo.
3. **Offerta** — pannello prezzo gradiente **€ 9.490 tutto compreso**, accanto
   «Cosa comprende» / «Cosa NON comprende» affiancati. Rimando al form per
   metrature diverse. *Questa sezione è il cuore della pagina: i competitor
   scrivono «a partire da» e poi il conto sale del 20–30%. Noi scriviamo tutto.*
4. **Configuratore 3D** — vedi §7.
5. **Detrazione** — due schede **statiche** già calcolate: prima casa 50% →
   costo reale 4.745 €, seconda casa 36% → 6.074 €. Nessun campo.
6. **Come funziona** — i 6 passaggi della card: Sopralluogo · Progettazione ·
   Demolizione e rifacimento · Impianti · Rivestimenti e sanitari · Consegna.
7. **Tempi** — timeline giorno per giorno del cantiere.
8. **Prima / Dopo** — slider trascinabile (pointer + touch + tastiera).
9. **Perché noi** — prezzo bloccato in contratto · impianti certificati DM 37/08 ·
   data di fine per iscritto · un solo interlocutore · impresa del posto con
   P.IVA verificabile · fattura pronta per la detrazione.
10. **Recensioni** — la sezione **non si renderizza** finché l'array è vuoto.
11. **Form preventivo** — Nome, Telefono, Email, Comune/CAP, Tipo intervento,
    Messaggio + configurazione 3D scelta. Consenso privacy obbligatorio e
    consenso marketing **separato e facoltativo**. Schermata di conferma.
12. **FAQ** — accordion accessibile.
13. **Footer** — dati BIODOMUS completi, contatti etichettati, privacy/cookie.
14. **Barra CTA fissa mobile** — Chiama | WhatsApp | Preventivo, con
    `padding-bottom` sul body perché non copra nulla.

---

## 9. GSAP — come animare

- Registra ScrollTrigger **una sola volta** in un provider client.
- Usa `gsap.context()` per lo scope e **pulisci sempre** in `useLayoutEffect`
  (in React 19 con StrictMode un leak si vede subito).
- Pattern consentiti: rivelazioni a scomparsa breve (opacity + 12px di
  traslazione, 300–500 ms), conteggio del prezzo all'ingresso, pin **corto** del
  configuratore, parallasse leggera sull'onda.
- Vietati: scroll-jacking, animazioni > 600 ms su elementi di conversione,
  qualsiasi movimento che ritardi la comparsa di una CTA.
- Con `prefers-reduced-motion: reduce` **tutte** le timeline si fermano allo
  stato finale. Non ridotte: ferme.
- Carica GSAP solo nei componenti che lo usano, mai nel layout globale.

---

## 10. SUPABASE — schema e sicurezza

```sql
create table public.leads (
  id                 bigserial primary key,
  created_at         timestamptz not null default now(),
  nome               text not null,
  telefono           text not null,
  email              text,
  comune             text,
  tipo_intervento    text,
  messaggio          text,
  configurazione     jsonb,          -- scelte del configuratore 3D
  consenso_marketing boolean not null default false,
  fonte              text,           -- utm_source, fallback fbclid -> 'meta'
  campagna           text,           -- utm_campaign
  stato              text not null default 'Nuovo',
  pagina             text
);

alter table public.leads enable row level security;
-- Nessuna policy per anon: il sito NON scrive direttamente.
```

**L'inserimento passa da una Route Handler server-side** (`/api/lead`) che usa
la `service_role` key da variabile d'ambiente. Motivo: così la chiave pubblica
non basta a scrivere, e la route può validare, applicare rate-limit e fare
l'hash dei dati per la CAPI. La `service_role` non entra **mai** nel bundle
client.

Notifica al titolare: la stessa route, dopo l'insert, chiama Brevo (o un webhook
n8n). Un lead che resta in un database per tre giorni è un lead perso.

---

## 11. TRACKING (predisporre, non attivare)

Lezione da un progetto precedente: campagne attive, **conversioni reali zero**,
per tracking rotto (CAPI assente, GA4 con ~80% di sessioni perse, pixel
sbagliato). Qui si fa bene dall'inizio.

- Helper `track(evento, params)` che invia a Meta Pixel e GA4 **solo se gli ID
  sono reali** (non segnaposto). Altrimenti `console.log`.
- Eventi: `PageView` · `ViewContent` (sezione offerta, IntersectionObserver) ·
  `CTA_Click` · `phone_click` → Contact · `whatsapp_click` → Contact ·
  `configurator_open` · `configurator_change` · `form_start` ·
  **`Lead`** (invio riuscito = conversione primaria).
- **Meta CAPI server-side**: implementala nella route `/api/lead`, con lo stesso
  `event_id` del pixel per la deduplica, e hash SHA-256 di email e telefono
  fatto **sul server**. Token solo in env var Vercel.
- Banner cookie conforme: pixel e GA4 partono **solo dopo** il consenso.

---

## 12. STRUTTURA FILE

```
easy-bagno-v2/
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx, page.tsx, globals.css
│  │  ├─ privacy/page.tsx, cookie/page.tsx
│  │  └─ api/lead/route.ts        ← insert Supabase + CAPI + notifica
│  ├─ components/
│  │  ├─ sections/                ← una cartella per sezione di §8
│  │  ├─ three/                   ← Scene, Configurator, materiali, loader
│  │  └─ ui/                      ← shadcn
│  ├─ lib/                        ← supabase, tracking, utm, utils
│  ├─ config/site.ts              ← UNICA fonte di verità dei contenuti
│  └─ hooks/use-3d-capability.ts  ← la logica di §4.3
├─ public/brand/ · public/models/ · public/posters/
├─ .env.example · README.md
```

---

## 13. COSA SERVE DA ME (nicholas) — e cosa fa Claude da solo

**Claude fa da solo, senza chiedermi nulla:**
- Scaffolding Next + Tailwind + shadcn (npm raggiungibile)
- Tutto il codice React, R3F, GSAP
- **Creazione del database Supabase**, schema, RLS, policy (MCP autenticato)
- **Creazione del progetto Vercel e deploy** (MCP autenticato)
- Logo, favicon, immagine social, illustrazioni SVG, poster di fallback

**Serve che io gli fornisca:**

| # | Cosa | Perché |
|---|---|---|
| 1 | **Modello 3D del bagno (.glb)** | Non ho un generatore 3D raggiungibile a costo zero. O ricarico i crediti Higgsfield, o scarico io un GLB da Poly Haven / Sketchfab (licenza commerciale) e glielo passo. |
| 2 | **Crediti Higgsfield** (se voglio immagini AI) | È l'unico generatore che Claude raggiunge: Replicate, fal.ai, BFL, OpenAI e Stability sono **bloccati dalla rete**. |
| 3 | **Foto reali dei cantieri** | Per Prima/Dopo e per la prova sociale. Valgono più di qualsiasi render. |
| 4 | **URL scena Spline** (solo se la voglio) | Non esiste un MCP Spline e il dominio è bloccato: la scena devo crearla io nell'editor. |
| 5 | **Meta Pixel ID** e **GA4 Measurement ID** | Da creare sull'account dedicato. |
| 6 | **Token Meta CAPI** + **Brevo API key** | Vanno in env var Vercel, mai nel codice. |
| 7 | **Le 3 conferme di contenuto** | IVA inclusa o esclusa · anni di garanzia sui lavori · lista esclusioni. |
| 8 | **API key 21st.dev** (opzionale) | Per i blocchi shadcn premium. Gratis su 21st.dev/mcp. |

---

## 14. ORDINE DEI TASK (un commit atomico ciascuno)

1. Scaffolding Next + TS + Tailwind 4 + shadcn, token brand, font self-hosted.
2. `config/site.ts` con tutti i dati reali + tipi.
3. Layout, header, footer, barra CTA mobile, onde SVG.
4. Sezioni statiche: hero, offerta, detrazione, processo, tempi, perché noi, FAQ.
5. Prima/Dopo (pointer + touch + tastiera).
6. Form + route `/api/lead` + Supabase (schema via MCP) + conferma.
7. Configuratore 3D + hook di capability + poster di fallback mobile.
8. GSAP: rivelazioni e micro-interazioni, con reduced-motion.
9. Tracking + CAPI + banner cookie.
10. SEO: metadata, JSON-LD `HomeAndConstructionBusiness` + `Offer` + `FAQPage`,
    OG image, sitemap, robots.
11. Deploy Vercel via MCP, env var, dominio.
12. Audit finale contro la Definition of Done.

---

## 15. DEFINITION OF DONE

- [ ] Lighthouse **mobile ≥ 90** (3D spento) e **desktop ≥ 80** (3D attivo)
- [ ] First Load JS **≤ 180 KB gzip**; il chunk 3D **non** è nel bundle iniziale
- [ ] LCP ≤ 2.5 s e CLS ≤ 0.05 su 4G simulato
- [ ] Con 3D disattivo la pagina è **completa e vendibile**: nessun buco visivo
- [ ] `tsc --noEmit` pulito, zero errori in console, un solo `<h1>`
- [ ] Configuratore usabile **interamente da tastiera**, con stato annunciato
- [ ] Link `tel:` / `wa.me` con messaggio precompilato / `mailto:` verificati **da telefono vero**
- [ ] Form: validazione, conferma, riga scritta in Supabase, **notifica ricevuta**
- [ ] Payload del lead contiene la configurazione 3D scelta
- [ ] `service_role` e token **assenti** dal bundle client (verificato nel build output)
- [ ] Nessun dato inventato: ogni segnaposto residuo è elencato nel README
- [ ] Barra CTA mobile non copre contenuti
- [ ] Online su Vercel in HTTPS, con env var impostate

---

## 16. METODO

Commit piccoli e descrittivi, in italiano, che spiegano **perché** non *cosa*.
Testa nel browser vero prima di dire che funziona: se non puoi testare una cosa,
dillo esplicitamente invece di darla per buona. Usa segnaposto per ciò che manca
e vai avanti. Non collegare integrazioni finché non hai gli ID veri.

Se a un certo punto il 3D sta costando più conversioni di quante ne porta,
**dillo e proponi di tagliarlo.** Il lavoro è portare lead, non difendere una
scelta tecnica.

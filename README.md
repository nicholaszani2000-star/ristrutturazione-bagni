# EasyBagno.it

Landing page di **BIODOMUS SRLS** (Gallarate, VA) per la ristrutturazione del
bagno chiavi in mano. Serve a una cosa sola: far arrivare contatti dalle
campagne Meta e da Google — richieste di sopralluogo, telefono, WhatsApp,
email e iscrizioni allo sconto del 5%. Cosa manca per il lancio:
`LEGGIMI-NETLIFY.txt`, sezione 5.

## Dove sta cosa

```
v2/                     il sito (Next.js 16, export statico)
  src/config/site.ts    TUTTI i testi che cambiano: prezzo, numeri, email,
                        FAQ, sconto, comuni serviti, ID di GA4 e Meta.
  src/config/pagine.ts  titolo, descrizione e data di ogni pagina (SEO, sitemap)
                        e le pagine previste ma non ancora pubblicate
  src/components/       sezioni della pagina e componenti
  src/lib/              consenso cookie, GA4, Meta Pixel, Supabase
  public/               foto, anteprima social, _headers, _redirects
  netlify.toml          comando di build, cartella, intestazioni
netlify.toml            dice a Netlify che il sito sta in v2/
LEGGIMI-NETLIFY.txt     pubblicazione, integrazioni, cose da fare (NON va online)
annunci/                immagini e testi per Meta (CAMPAGNA.md), non pubblicati sul sito
reference/              materiale di consultazione, non pubblicato
.claude/, .mcp.json     skill e server MCP per lo sviluppo
```

## Pubblicare

Netlify → progetto → *Build & deploy* → *Link repository* → questo repo,
branch `claude/new-session-01gjm2`. Non serve impostare altro: il
`netlify.toml` nella radice porta Netlify in `v2/`, dove trova il comando
(`npm run build:netlify`) e la cartella da pubblicare (`out`).

In locale:

```bash
cd v2
npm install
npm run dev              # sviluppo su http://localhost:3000
npm run build:netlify    # sito statico in v2/out, quello che va online
```

## SEO

- **Titoli e descrizioni**: in `src/config/pagine.ts`. Ogni pagina li usa con
  `metadatiPagina()` (`src/lib/seo.ts`), che mette anche canonical e Open Graph.
- **Dati strutturati**: un solo grafo JSON-LD nella home
  (`src/lib/dati-strutturati.ts`): impresa, sito, pagina con le FAQ, servizio con
  l'offerta. Prende tutto da `site.ts`: se cambia un dato li', cambia anche qui.
- **Sitemap e robots**: generati da `src/app/sitemap.ts` e `robots.ts`. Nella
  sitemap vanno solo le pagine di `PAGINE`. Quando cambi il testo di una
  pagina, aggiorna la sua data `aggiornata`.
- **Nuova pagina** (es. `/costo-ristrutturazione-bagno/`): leggi prima cosa
  serve in `PAGINE_FUTURE`, poi crea `src/app/costo-ristrutturazione-bagno/page.tsx`
  con il componente `PaginaServizio`, sposta la voce in `PAGINE` e collegala
  dalla home. Mai lo stesso testo con il nome del comune cambiato.

## Integrazioni

| Servizio | Cosa fa | Quando parte |
|---|---|---|
| GA4 `G-FCEM78H075` | visite, clic su contatti, `generate_lead` = richiesta di sopralluogo | solo dopo "Accetta" |
| Meta Pixel `1640497950773690` + Conversions API | `Lead` = richiesta di sopralluogo, `CompleteRegistration` = sconto, `Contact`, `ViewContent`; dati cifrati SHA-256 | solo dopo "Accetta" |
| Supabase `easy-bagno` | `leads` (vista `richieste`) e `iscrizioni` (vista `sconti`), con fonte/campagna/annuncio UTM | a ogni invio |
| Netlify Forms | moduli `sopralluogo` e `sconto`, notifica via email | a ogni invio |

Dettagli e passaggi da fare nei pannelli: `LEGGIMI-NETLIFY.txt`.

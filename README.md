# EasyBagno.it

Landing page di **BIODOMUS SRLS** (Gallarate, VA) per la ristrutturazione del
bagno chiavi in mano. Serve a una cosa sola: far arrivare contatti dalle
campagne Meta — email, WhatsApp, telefono e iscrizioni allo sconto del 5%.

## Dove sta cosa

```
v2/                     il sito (Next.js 16, export statico)
  src/config/site.ts    TUTTI i testi che cambiano: prezzo, numeri, email,
                        FAQ, sconto, ID di GA4 e Meta. Si tocca solo questo.
  src/components/       sezioni della pagina e componenti
  src/lib/              consenso cookie, GA4, Meta Pixel, Supabase
  public/               foto, anteprima social, LEGGIMI-NETLIFY.txt
  netlify.toml          comando di build, cartella, intestazioni
netlify.toml            dice a Netlify che il sito sta in v2/
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

## Integrazioni

| Servizio | Cosa fa | Quando parte |
|---|---|---|
| GA4 `G-FCEM78H075` | visite, clic su contatti, iscrizioni | solo dopo "Accetta" |
| Meta Pixel `1640497950773690` | PageView, Contact, Lead + email cifrata SHA-256 | solo dopo "Accetta" |
| Supabase `easy-bagno` | tabella `iscrizioni`: email + fonte/campagna UTM | a ogni iscrizione con consenso |
| Netlify Forms | modulo `sconto`, notifica via email | a ogni iscrizione |

Dettagli e passaggi da fare nei pannelli: `v2/public/LEGGIMI-NETLIFY.txt`.

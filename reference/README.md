# reference/

Materiale di consultazione. **Non fa parte del sito**: non viene pubblicato né
caricato dalle pagine.

## `tailwind-v4-theme.css`

Il tema di default di **Tailwind CSS 4.3.3**, estratto dal sorgente ufficiale
(`packages/tailwindcss/theme.css`).

Serve perché `tailwindcss.com` **non è raggiungibile** dalla sessione di
sviluppo: la policy di rete blocca tutto tranne i registri dei pacchetti. Questo
file è quindi l'unica fonte autorevole offline per:

- i **286 colori** della palette in formato `oklch`
- la scala di spaziature, i raggi, le ombre, i breakpoint
- i nomi esatti delle variabili `--color-*`, `--spacing-*`, `--text-*`

### Perché conta per questo progetto

Tailwind 4 ha cambiato impianto rispetto alla 3:

| | v3 | v4 |
|---|---|---|
| Configurazione | `tailwind.config.js` | blocco `@theme` in CSS |
| Import | `@tailwind base;` | `@import "tailwindcss";` |
| Colori | esadecimali | `oklch()` |
| PostCSS | `tailwindcss` | `@tailwindcss/postcss` |

I token del marchio Easy-Bagno (navy `#143A5C`, blue `#1B84DD`, sky `#56B4EE`)
vanno dichiarati dentro `@theme`, **non** in un file di configurazione.

---

## Nota sull'MCP `tailwindcss-mcp-server`

È configurato in `.mcp.json`, e funziona: 7 tool su 8 girano offline.

**Ma i suoi dati sono fermi a Tailwind 3.** Nel pacchetto compaiono
`@tailwind base` e `tailwind.config`, e non c'è traccia di `@theme`, `oklch` o
`@tailwindcss/postcss`. Se gli chiedi come impostare Tailwind ti risponde con la
procedura v3, che sulla 4.3 è sbagliata.

Inoltre `search_tailwind_docs` non funziona qui: fa scraping di
`tailwindcss.com`, che è bloccato.

**Per impostazione e configurazione fai fede a questo file, non all'MCP.**
L'MCP resta utile per `convert_css_to_tailwind` e `generate_color_palette`, che
sono indipendenti dalla versione.

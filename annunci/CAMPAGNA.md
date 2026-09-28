# Campagna Meta — EasyBagno.it

Tutto quello che serve per far partire gli annunci. Le immagini sono in questa
cartella, i testi sono qui sotto, le impostazioni sono già decise.

## Prima di partire (solo tu puoi farlo)

1. **Metodo di pagamento** sull'account pubblicitario *Easybagno*
   (Gestione inserzioni → Impostazioni di pagamento).
2. **Pagina Facebook** "EasyBagno" collegata all'account *Easybagno*
   (Business Manager → Account → Pagine), più il profilo Instagram se c'è.
3. **IVA**: sulle grafiche il prezzo è scritto senza la dicitura "IVA inclusa".
   Finché il commercialista non conferma, lascialo così.
4. **Notifica delle richieste** (2 minuti, una volta sola): su Netlify →
   progetto → *Project configuration* → *Notifications* → *Emails and
   webhooks* → *Form submission notifications* → *Add notification* →
   *Email notification*. Modulo: **sopralluogo**. Email: quella che leggi dal
   telefono. Da lì ogni richiesta ti arriva in casella appena viene inviata.
5. **GA4**: in *Amministrazione → Eventi* segna **generate_lead** come evento
   chiave. È la richiesta di sopralluogo.

## Impostazioni della campagna

| Voce | Valore |
|---|---|
| Account | Easybagno (1836403044189994) |
| Obiettivo | **Contatti** |
| Nome | EasyBagno · Lead · Bagno 3x2 9.490€ · Gallarate |
| Budget | **11,50 € al giorno** a livello di campagna = circa **350 € al mese**. Meta in un giorno può spendere un po' di più o di meno, ma sulla settimana resta nella media. |
| Strategia di offerta | Volume più alto (senza limite di costo) |
| Luogo della conversione | Sito web |
| Evento di conversione | **Lead** — Pixel "dati di easybagno". Dal 28/09/2026 Lead è **solo la richiesta di sopralluogo** (nome, telefono, comune). L'email per lo sconto è un evento diverso (CompleteRegistration) e non conta come risultato. |
| Zona | Raggio **30 km da Gallarate** (Via Carlo Noè 45) |
| Età | da 30 anni in su (come suggerimento, con il pubblico Advantage+ attivo) |
| Escludi | "EasyBagno · Richieste sopralluogo 180 giorni", "EasyBagno · Iscritti sconto 180 giorni" e "EasyBagno · Hanno cliccato un contatto 90 giorni": sono persone già arrivate, non si paga per riprenderle |
| Posizionamenti | Advantage+ (automatici) |
| DSA — beneficiario e pagatore | BIODOMUS SRLS |
| Pulsante | **Richiedi preventivo** |

**Indirizzo di destinazione**, uno per inserzione, così in Supabase si vede
quale annuncio ha portato la richiesta (colonna *annuncio*):

- A: `https://easybagno.it/?utm_source=facebook&utm_medium=paid&utm_campaign=bagno-3x2&utm_content=A-dopo`
- B: `https://easybagno.it/?utm_source=facebook&utm_medium=paid&utm_campaign=bagno-3x2&utm_content=B-prima-dopo`
- C: `https://easybagno.it/?utm_source=facebook&utm_medium=paid&utm_campaign=bagno-3x2&utm_content=C-sconto`

## Pubblici già creati sull'account

| Pubblico | Contiene | Uso |
|---|---|---|
| EasyBagno · Visitatori sito 180 giorni | chi ha visitato il sito | retargeting, base per i pubblici simili |
| EasyBagno · Hanno visto il prezzo 30 giorni | chi è arrivato alla sezione dell'offerta | retargeting: interessati che non hanno scritto |
| EasyBagno · Richieste sopralluogo 180 giorni | chi ha inviato la richiesta di sopralluogo (evento Lead) | da escludere; **base dei pubblici simili** |
| EasyBagno · Iscritti sconto 180 giorni | chi ha lasciato solo l'email per il 5% (evento CompleteRegistration) | da escludere |
| EasyBagno · Hanno cliccato un contatto 90 giorni | clic su telefono, WhatsApp, email | da escludere |

I pubblici simili (lookalike) si creano quando "Richieste sopralluogo" supera le
100 persone: prima Meta non ha abbastanza esempi.

## Le tre inserzioni

Ogni inserzione usa tre formati della stessa grafica: Meta sceglie da solo
quale mostrare in base al posizionamento.

| Inserzione | Feed (4:5) | Storie e Reel (9:16) | Quadrato (1:1) |
|---|---|---|---|
| A — Il bagno finito | A-dopo-4x5.jpg | A-dopo-9x16.jpg | A-dopo-1x1.jpg |
| B — Prima e dopo | B-prima-dopo-4x5.jpg | B-prima-dopo-9x16.jpg | B-prima-dopo-1x1.jpg |
| C — Sopralluogo + 5% | C-sconto-4x5.jpg | C-sconto-9x16.jpg | — |

Nei formati 9:16 il 14% in alto e il 35% in basso sono lasciati senza testo:
lì Instagram e Facebook mettono nome, didascalia e pulsante.

### A — Il bagno finito

**Testo principale**

> Rifare il bagno senza pensieri, con un prezzo chiaro fin dall'inizio.
>
> Bagno 3×2 m chiavi in mano a 9.490 €: demolizione, impianti, piastrelle e sanitari, con un solo referente dall'inizio alla fine.
>
> ✓ Sopralluogo gratuito e senza impegno
> ✓ 10–15 giorni lavorativi, con la data di fine scritta nel preventivo
> ✓ Impianti certificati secondo il DM 37/08
>
> Lavoriamo a Gallarate e in provincia di Varese.

**Titolo:** Bagno chiavi in mano a 9.490 €
**Descrizione:** Sopralluogo gratuito · Gallarate (VA)

### B — Prima e dopo

**Testo principale**

> Da così a così, in 10–15 giorni lavorativi.
>
> Pensiamo a tutto noi: demolizione, impianti, piastrelle, sanitari. Un prezzo solo, scritto per intero prima di iniziare: 9.490 € per il bagno 3×2 m chiavi in mano.
>
> Sopralluogo gratuito a Gallarate e in provincia di Varese.

**Titolo:** Il tuo nuovo bagno, senza stress
**Descrizione:** Prezzo chiuso · 10–15 giorni lavorativi

### C — Sopralluogo gratuito + 5%

**Testo principale**

> Stai pensando di rifare il bagno?
>
> Richiedi il sopralluogo gratuito sul sito: lasci nome e telefono, ti richiamiamo noi per fissare il giorno. In più hai il 5% di sconto sul preventivo: sul bagno 3×2 m chiavi in mano da 9.490 € sono 474,50 € in meno.
>
> Sconto valido 60 giorni dalla richiesta, sul preventivo firmato dopo il sopralluogo. Gallarate e provincia di Varese.

**Titolo:** Sopralluogo gratis e -5% sul bagno
**Descrizione:** Lasci il numero, ti richiamiamo noi

## Cosa guardare dopo la prima settimana

- **Costo per Lead** di ciascuna inserzione: quella che costa di più si spegne.
  Con 350 € al mese aspetta almeno 10-15 richieste prima di giudicare
  un'inserzione: con numeri più piccoli è ancora fortuna.
- **Richieste in Supabase** (vista `richieste`): una riga per richiesta, la più
  recente in alto. *annuncio* dice quale inserzione l'ha portata, *sconto_5* se
  lo sconto è ancora valido. Nella tabella `leads` aggiorna la colonna *stato*
  man mano: Nuovo → Chiamato → Sopralluogo fissato → Preventivo inviato →
  Firmato / Perso. Dopo un mese sai quante richieste diventano lavori, che è il
  numero che conta davvero.
- **Iscritti allo sconto** (vista `sconti`): chi ha lasciato solo l'email.
- Non toccare budget e pubblico nei primi 5-7 giorni: Meta sta ancora
  imparando e ogni modifica fa ricominciare da capo.

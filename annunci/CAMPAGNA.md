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

## Impostazioni della campagna

| Voce | Valore |
|---|---|
| Account | Easybagno (1836403044189994) |
| Obiettivo | **Contatti** |
| Nome | EasyBagno · Lead · Bagno 3x2 9.490€ · Gallarate |
| Budget | **15 € al giorno** a livello di campagna, per le prime due settimane. Poi si decide sui numeri veri. |
| Strategia di offerta | Volume più alto (senza limite di costo) |
| Luogo della conversione | Sito web |
| Evento di conversione | **Lead** — Pixel "dati di easybagno" |
| Zona | Raggio **30 km da Gallarate** (Via Carlo Noè 45) |
| Età | da 30 anni in su (come suggerimento, con il pubblico Advantage+ attivo) |
| Escludi | "EasyBagno · Iscritti sconto 180 giorni" e "EasyBagno · Hanno cliccato un contatto 90 giorni": sono persone già arrivate, non si paga per riprenderle |
| Posizionamenti | Advantage+ (automatici) |
| DSA — beneficiario e pagatore | BIODOMUS SRLS |
| Pulsante | **Richiedi preventivo** |

**Indirizzo di destinazione**, uno per inserzione, così in Supabase si vede
quale annuncio ha portato l'iscritto:

- A: `https://easybagno.it/?utm_source=facebook&utm_medium=paid&utm_campaign=bagno-3x2&utm_content=A-dopo`
- B: `https://easybagno.it/?utm_source=facebook&utm_medium=paid&utm_campaign=bagno-3x2&utm_content=B-prima-dopo`
- C: `https://easybagno.it/?utm_source=facebook&utm_medium=paid&utm_campaign=bagno-3x2&utm_content=C-sconto`

## Pubblici già creati sull'account

| Pubblico | Contiene | Uso |
|---|---|---|
| EasyBagno · Visitatori sito 180 giorni | chi ha visitato il sito | retargeting, base per i pubblici simili |
| EasyBagno · Hanno visto il prezzo 30 giorni | chi è arrivato alla sezione dell'offerta | retargeting: interessati che non hanno scritto |
| EasyBagno · Iscritti sconto 180 giorni | chi ha lasciato l'email per il 5% | da escludere; base dei pubblici simili |
| EasyBagno · Hanno cliccato un contatto 90 giorni | clic su telefono, WhatsApp, email | da escludere |

I pubblici simili (lookalike) si creano quando "Iscritti sconto" supera le 100
persone: prima Meta non ha abbastanza esempi.

## Le tre inserzioni

Ogni inserzione usa tre formati della stessa grafica: Meta sceglie da solo
quale mostrare in base al posizionamento.

| Inserzione | Feed (4:5) | Storie e Reel (9:16) | Quadrato (1:1) |
|---|---|---|---|
| A — Il bagno finito | A-dopo-4x5.jpg | A-dopo-9x16.jpg | A-dopo-1x1.jpg |
| B — Prima e dopo | B-prima-dopo-4x5.jpg | B-prima-dopo-9x16.jpg | B-prima-dopo-1x1.jpg |
| C — Sconto 5% | C-sconto-4x5.jpg | C-sconto-9x16.jpg | — |

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

### C — Sconto 5%

**Testo principale**

> Stai pensando di rifare il bagno?
>
> Lascia la tua email sul sito: hai il 5% di sconto sul preventivo. Sul bagno 3×2 m chiavi in mano da 9.490 € sono 474,50 € in meno.
>
> Valido 60 giorni dall'iscrizione, sul preventivo firmato dopo il sopralluogo. Gallarate e provincia di Varese.

**Titolo:** -5% sul tuo nuovo bagno
**Descrizione:** Lascia l'email e blocca lo sconto

## Cosa guardare dopo la prima settimana

- **Costo per Lead** di ciascuna inserzione: quella che costa di più si spegne.
- **Iscrizioni in Supabase** (tabella `sconti`): la colonna *campagna* e
  la colonna *fonte* dicono da quale annuncio arrivano.
- Non toccare budget e pubblico nei primi 5-7 giorni: Meta sta ancora
  imparando e ogni modifica fa ricominciare da capo.

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

## Già creato su Meta (ricreato il 30/09/2026, tutto IN PAUSA)

| Cosa | Nome | ID |
|---|---|---|
| Campagna | EasyBagno · Lead · Bagno 3x2 9.490€ · Gallarate | 120250803597600005 |
| Gruppo di inserzioni | Gallarate 30 km · Lead sito · Advantage+ | 120250803598470005 |

Il gruppo è già impostato: evento **Lead** del Pixel (qualità
dell'abbinamento 9,3 su 10), raggio 30 km da Gallarate solo per chi ci abita o
ci passa spesso, Svizzera esclusa, età lasciata a Meta (Advantage+), esclusi
chi ha già chiesto il sopralluogo o vi ha già chiamato, beneficiario e
pagatore DSA BIODOMUS SRLS, posizionamenti automatici. Rivisto il 03/10.

**Le 19 immagini sono già nella libreria dell'account** (Gestione inserzioni →
Contenuti multimediali), con il nome "EasyBagno …": A, B e C nei tre formati,
le 6 schede del carosello D e le 5 del carosello E.

**Mancano solo le 5 inserzioni**, che Meta non permette di creare senza una
Pagina Facebook. E per accendere la campagna serve il metodo di pagamento.

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
| Zona | Raggio **30 km da Gallarate** (Via Carlo Noè 45), solo chi **ci abita o ci passa spesso** (non chi è solo di passaggio, per esempio a Malpensa). **Svizzera esclusa**: il raggio arriva fino a Stabio e Mendrisio. Dentro il raggio ci sono anche Novara, Legnano e Saronno: da confermare se li servite |
| Età | da 30 anni in su (come suggerimento, con il pubblico Advantage+ attivo) |
| Escludi | "EasyBagno · Richieste sopralluogo 180 giorni" e "EasyBagno · Hanno cliccato un contatto 90 giorni": hanno già chiesto il sopralluogo o vi hanno già chiamato. **Gli iscritti allo sconto NON sono esclusi** (cambiato il 03/10): hanno lasciato solo l'email, sono i più vicini a chiedere il sopralluogo |
| Posizionamenti | Advantage+ (automatici) |
| DSA — beneficiario e pagatore | BIODOMUS SRLS |
| Pulsante | **Richiedi preventivo** |

**Indirizzo di destinazione**, uno per inserzione, così in Supabase si vede
quale annuncio ha portato la richiesta (colonna *annuncio*):

- A: `https://easybagno.it/?utm_source=facebook&utm_medium=paid&utm_campaign=bagno-3x2&utm_content=A-dopo`
- B: `https://easybagno.it/?utm_source=facebook&utm_medium=paid&utm_campaign=bagno-3x2&utm_content=B-prima-dopo`
- C: `https://easybagno.it/?utm_source=facebook&utm_medium=paid&utm_campaign=bagno-3x2&utm_content=C-sconto`
- D (carosello): `https://easybagno.it/?utm_source=facebook&utm_medium=paid&utm_campaign=bagno-3x2&utm_content=D-compreso`
- E (carosello): `https://easybagno.it/?utm_source=facebook&utm_medium=paid&utm_campaign=bagno-3x2&utm_content=E-prima-dopo`
- F (carosello): `https://easybagno.it/?utm_source=facebook&utm_medium=paid&utm_campaign=bagno-3x2&utm_content=F-cantiere`

Nei caroselli ogni scheda usa lo stesso indirizzo del suo carosello.

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

## Le sei inserzioni

Tre a immagine singola (A, B, C) e tre caroselli (D, E, F), tutte nello stesso
gruppo di inserzioni: con 11,50 € al giorno un gruppo solo impara prima.
Meta sposta da sola la spesa su quella che porta più richieste.

Le inserzioni a immagine singola usano tre formati della stessa grafica: Meta
sceglie da solo quale mostrare in base al posizionamento.

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
> Richiedi il sopralluogo gratuito sul sito: lasci nome e telefono, ti richiamiamo noi per fissare il giorno. In più ricevi subito sul telefono il buono sconto del 5% con il QR, da mostrare al sopralluogo: sul bagno 3×2 m chiavi in mano da 9.490 € sono 474,50 € in meno.
>
> Sconto valido 60 giorni dalla richiesta, sul preventivo firmato dopo il sopralluogo. Gallarate e provincia di Varese.

**Titolo:** Sopralluogo gratis e -5% sul bagno
**Descrizione:** Lasci il numero, ti richiamiamo noi

### D — Carosello "Cosa comprende il prezzo"

Sei schede 1080×1080 in `carosello-D-compreso/`, in quest'ordine.

**Testo principale**

> Quanto costa davvero rifare il bagno? Da noi il prezzo è uno solo, scritto per intero: 9.490 € per il bagno 3×2 m chiavi in mano.
>
> Scorri le schede: demolizione, impianti certificati, piastrelle, sanitari, box doccia e mobile lavabo sono dentro. Prezzo bloccato in contratto e data di fine scritta nel preventivo.
>
> Richiedi il sopralluogo gratuito: ricevi subito il buono sconto del 5% con il QR, da mostrare al sopralluogo. Gallarate e provincia di Varese.

| Scheda | File | Titolo | Descrizione |
|---|---|---|---|
| 1 | D1.jpg | Bagno 3×2 m a 9.490 € | Chiavi in mano |
| 2 | D2.jpg | Demolizione e smaltimento | Compresi nel prezzo |
| 3 | D3.jpg | Impianti nuovi e certificati | Conformità DM 37/08 |
| 4 | D4.jpg | Piastrelle, sanitari e doccia | Compresi nel prezzo |
| 5 | D5.jpg | Prezzo e data di fine scritti | 10–15 giorni lavorativi |
| 6 | D6.jpg | Sopralluogo gratis + 5% | Buono con QR subito |

Impostazioni del carosello: **togli** la spunta "Mostra automaticamente
prima le schede più performanti" (l'ordine racconta una storia) e **togli**
"Aggiungi una scheda con l'immagine del profilo alla fine".

### E — Carosello "Prima e dopo"

Cinque schede 1080×1080 in `carosello-E-prima-dopo/`.

**Testo principale**

> Da così a così, in 10–15 giorni lavorativi.
>
> Sopralluogo gratuito, preventivo scritto con prezzo chiuso e data di fine, lavori con un solo referente, consegna con le certificazioni degli impianti.
>
> Bagno 3×2 m chiavi in mano: 9.490 €. Richiedi il sopralluogo: il buono sconto del 5% con il QR ti arriva subito sul telefono.

| Scheda | File | Titolo | Descrizione |
|---|---|---|---|
| 1 | E1.jpg | Il bagno prima | Scorri → |
| 2 | E2.jpg | Il bagno dopo | 10–15 giorni lavorativi |
| 3 | E3.jpg | Come lavoriamo | Un solo referente |
| 4 | E4.jpg | Prezzo bloccato in contratto | Impianti certificati |
| 5 | E5.jpg | Richiedi il sopralluogo gratuito | Buono 5% con QR |

Stesse due spunte da togliere del carosello D.

Nelle schede D6 ed E5 il buono è un esempio: il codice è coperto
(EB-••••-••••) e il QR porta solo a easybagno.it. Il codice vero lo
genera il sito per ciascuno.

### F — Carosello "Un nostro cantiere"

Le foto di un vostro lavoro vero (durante e finito), in `carosello-F-cantiere/`
(F1-F3) più due schede già fatte: E4 (garanzie) e D6 (sopralluogo + 5%).

**Testo principale**

> Questo è un nostro cantiere: durante i lavori e a lavori finiti. Stesso punto, stessa finestra.
>
> Lo facciamo chiavi in mano, con un solo referente: bagno 3×2 m a 9.490 € tutto compreso, prezzo e data di fine scritti nel preventivo.
>
> Richiedi il sopralluogo gratuito: ricevi subito il buono sconto del 5% con il QR, da mostrare al sopralluogo. Gallarate e dintorni.

| Scheda | File | Titolo | Descrizione |
|---|---|---|---|
| 1 | F1.jpg | Un nostro cantiere | Durante i lavori |
| 2 | F2.jpg | Lo stesso bagno, finito | Stesso punto, stessa finestra |
| 3 | F3.jpg | Bagno 3×2 m a 9.490 € | Tutto compreso |
| 4 | ../carosello-E-prima-dopo/E4.jpg | Prezzo bloccato in contratto | Impianti certificati |
| 5 | ../carosello-D-compreso/D6.jpg | Sopralluogo gratis + 5% | Buono con QR subito |

## Il buono con il QR, al sopralluogo

Chi richiede il sopralluogo o lascia l'email riceve un codice unico con un QR
e di solito ne fa uno screenshot. Al sopralluogo inquadralo con la fotocamera:
si apre easybagno.it/sconto/ e ti dice se è **valido**, **scaduto** o **già
usato**, con il nome accorciato ("Mario R."). Quando applichi lo sconto a un
contratto firmato, segnalo come usato (istruzioni in `LEGGIMI-NETLIFY.txt`,
sezione 2): così non vale una seconda volta.

## Cosa guardare dopo la prima settimana

- **Costo per Lead** di ciascuna inserzione: quella che costa di più si spegne.
  Con 350 € al mese aspetta almeno 10-15 richieste prima di giudicare
  un'inserzione: con numeri più piccoli è ancora fortuna.
- **Richieste in Supabase** (vista `richieste`): una riga per richiesta, la più
  recente in alto. *annuncio* dice quale inserzione l'ha portata, *sconto_5* se
  lo sconto è ancora valido, *codice* il buono che il cliente ti mostrerà. Nella tabella `leads` aggiorna la colonna *stato*
  man mano: Nuovo → Chiamato → Sopralluogo fissato → Preventivo inviato →
  Firmato / Perso. Dopo un mese sai quante richieste diventano lavori, che è il
  numero che conta davvero.
- **Iscritti allo sconto** (vista `sconti`): chi ha lasciato solo l'email.
- Non toccare budget e pubblico nei primi 5-7 giorni: Meta sta ancora
  imparando e ogni modifica fa ricominciare da capo.

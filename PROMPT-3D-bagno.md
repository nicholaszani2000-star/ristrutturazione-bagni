# PROMPT 3D — Bagno 3×2 m per Easy-Bagno.it

> Da incollare nell'**AI di Spline desktop** (o dare a chi modella in Blender,
> o a un freelance). Serve **un solo asset**: il modello 3D del bagno che il
> cliente potrà ruotare e configurare sul sito.

---

## COSA DEVI COSTRUIRE

Un **bagno moderno di 3,00 × 2,00 m** (6 m², altezza 2,70 m), completo e
fotografabile da un angolo, destinato a un **configuratore web interattivo**.

Non è una scena d'arte: è un prodotto. Deve essere **leggero, pulito e con i
nomi giusti**, perché un'applicazione React ci scambierà i materiali a runtime.

---

## 1. VINCOLI TECNICI (non negoziabili)

| Vincolo | Valore |
|---|---|
| Unità | **metri** |
| Orientamento | **Y up** |
| Origine (0,0,0) | **centro del pavimento** |
| Triangoli totali | **≤ 60.000** |
| Texture | max **1024×1024**, tileable, il meno possibile |
| Export | **GLB** (glTF 2.0 binario), Draco o meshopt |
| Peso finale | **≤ 3 MB** |
| Illuminazione | **NON bakeare luci né ombre** nelle texture |
| Materiali | **PBR standard** (base color, roughness, metalness) |

**Sulla luce:** il sito illumina la scena da solo con un ambiente HDRI. Se
inchiodi luci e ombre nelle texture, il modello risulterà sporco e pesante.
Consegna materiali puliti.

**Niente:** animazioni, rig, camere multiple, post-processing, particelle,
oggetti nascosti, geometria duplicata dentro i muri.

---

## 2. PIANTA — misure esatte

Stanza aperta su due lati, così la camera guarda dentro dall'angolo.

```
                   Z = -1.00  (parete di fondo, 3 m)
   X=-1.5 ┌────────────────────────────────────┐ X=+1.5
          │  DOCCIA        MOBILE LAVABO       │
          │  0.90×1.40     1.20 largo          │  parete destra
  parete  │                                    │  (2 m)
  sinistra│                              WC    │
   (2 m)  │                              BIDET │
          └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
                   Z = +1.00  (lato aperto, verso camera)
```

**Posizioni (centro dell'oggetto, in metri):**

| Oggetto | Posizione X, Y, Z | Dimensioni |
|---|---|---|
| Pavimento | 0, 0, 0 | 3,00 × 2,00 |
| Parete fondo | 0, 1,35, −1,00 | 3,00 × 2,70 |
| Parete sinistra | −1,50, 1,35, 0 | 2,00 × 2,70 |
| Piatto doccia | −1,05, 0,02, −0,30 | 0,90 × 1,40 × 0,04 |
| Vetro doccia (fisso) | −0,60, 1,00, −0,30 | 1,40 largo × 2,00 alto, spess. 0,01 |
| Soffione a pioggia | −1,05, 2,10, −0,60 | Ø 0,25 |
| Mobile lavabo (sospeso) | 0,25, 0,70, −0,76 | 1,20 × 0,50 × 0,45 |
| Top lavabo | 0,25, 0,93, −0,76 | 1,20 × 0,50 × 0,04 |
| Lavabo d'appoggio | 0,25, 1,02, −0,76 | Ø 0,42 × 0,14 |
| Rubinetto alto | 0,25, 1,10, −0,95 | h 0,30 |
| Specchio tondo | 0,25, 1,60, −0,99 | Ø 0,70 |
| WC sospeso | 1,25, 0,42, −0,45 | 0,36 × 0,55 |
| Bidet sospeso | 1,25, 0,42, 0,20 | 0,36 × 0,55 |
| Termoarredo | −1,48, 1,40, 0,55 | 0,50 largo × 1,00 alto |

Il mobile è **sospeso**: lascia 0,20 m di luce sotto. Anche WC e bidet sospesi.

---

## 3. NOMI — LA PARTE PIÙ IMPORTANTE

Il codice del sito cerca gli oggetti e i materiali **per nome esatto**. Se i
nomi cambiano, il configuratore non funziona. Usa **questi**, in inglese, con
maiuscole e underscore come scritti:

### Mesh (nodi)

```
Room_Floor
Room_WallBack
Room_WallLeft
Shower_Tray
Shower_Glass
Shower_Head
Vanity_Cabinet
Vanity_Top
Vanity_Basin
Vanity_Faucet
Mirror_Glass
Mirror_Frame
WC
Bidet
Towel_Warmer
```

### Materiali

| Nome materiale | Applicato a | Ruolo |
|---|---|---|
| `MAT_Floor` | Room_Floor | **configurabile** |
| `MAT_WallTile` | Room_WallBack, Room_WallLeft | **configurabile** |
| `MAT_Cabinet` | Vanity_Cabinet | **configurabile** |
| `MAT_Glass` | Shower_Glass, Mirror_Glass | **configurabile** (trasparente/satinato) |
| `MAT_Ceramic` | Vanity_Basin, WC, Bidet, Shower_Tray | fisso, bianco opaco |
| `MAT_Metal` | Vanity_Faucet, Shower_Head, Mirror_Frame, Towel_Warmer | fisso, cromo |

**Regola ferrea:** ogni materiale è **una sola istanza condivisa**. Non
duplicare `MAT_Ceramic` in `MAT_Ceramic.001`, `MAT_Ceramic_2` eccetera: il
codice cambia il materiale una volta e deve aggiornarsi ovunque.

---

## 4. VALORI DI PARTENZA DEI MATERIALI

Questi sono i colori del marchio: il modello deve nascere già coordinato al sito.

| Materiale | Base color | Roughness | Metalness | Note |
|---|---|---|---|---|
| `MAT_Floor` | `#E8EEF4` | 0,35 | 0 | grigio chiarissimo, effetto gres |
| `MAT_WallTile` | `#FFFFFF` | 0,25 | 0 | bianco lucido |
| `MAT_Cabinet` | `#143A5C` | 0,45 | 0 | blu navy del marchio |
| `MAT_Glass` | `#DCEEF9` | 0,05 | 0 | **trasparenza 0,12**, spessore 0,01 |
| `MAT_Ceramic` | `#FFFFFF` | 0,20 | 0 | — |
| `MAT_Metal` | `#1B2B3A` | 0,25 | 0,9 | canna di fucile |

Sul pavimento e sul rivestimento: se metti una texture di piastrella, dev'essere
**tileable**, 1024 px, formato grande (60×60 per il pavimento, 30×60 per la
parete). Meglio ancora: nessuna texture, solo colore piatto e le fughe fatte con
una griglia leggerissima. Pesa un decimo e sul web si vede uguale.

---

## 5. CAMERA

Una sola camera, chiamata `Camera_Main`:

- Posizione: `(2.6, 1.7, 2.4)`
- Punta verso: `(0, 1.0, -0.4)`
- Focale: **35 mm equivalente** (FOV verticale ≈ 38°)

Deve inquadrare la doccia a sinistra, il mobile al centro e i sanitari a destra,
con la stanza che si legge intera. È l'inquadratura che il visitatore vede
all'apertura.

---

## 6. QUALITÀ — cosa distingue un modello buono da uno da buttare

- **Smussa gli spigoli**: un bevel di 2–3 mm su mobile, top e piatto doccia.
  Gli spigoli vivi fanno leggere "modello 3D scadente" in un colpo d'occhio.
- **Niente compenetrazioni**: il lavabo appoggia sul top, non ci affonda dentro.
  Il mobile tocca la parete, non la attraversa.
- **Scala coerente**: un WC è alto 42 cm, non 60. Un lavabo è profondo 42 cm.
  Se le proporzioni sono sbagliate il render sembra una casa delle bambole.
- **Normali verso l'esterno**, nessuna faccia invertita.
- **UV pulite** sul pavimento e sulle pareti, così le piastrelle non risultano
  stirate.
- **Cancella tutto il resto**: niente luci di scena, niente piani d'appoggio,
  niente oggetti di riferimento lasciati dentro.

---

## 7. COSA DEVI CONSEGNARE

1. **`bagno.glb`** — il file, sotto i 3 MB. ← *questo è l'essenziale*
2. Uno **screenshot** dell'inquadratura di `Camera_Main`.
3. Un **elenco dei nomi** effettivamente usati per mesh e materiali, se per
   qualche motivo hai dovuto discostarti da quelli del punto 3.

Se lavori in **Spline** e preferisci pubblicare la scena invece di esportare:
va bene anche l'**URL `.splinecode`** — ma consegna **comunque il GLB**, perché
è quello che serve al configuratore.

---

## 8. SE NON RIESCI A FARE TUTTO

Ordine di priorità. Meglio consegnare poco e giusto che tutto e sbagliato:

1. Stanza + pavimento + pareti con i materiali nominati correttamente
2. Doccia (piatto, vetro, soffione)
3. Mobile lavabo + lavabo + rubinetto
4. Specchio
5. WC e bidet
6. Termoarredo

Se salti i punti 5 e 6 li aggiungo io lato codice. Se sbagli i **nomi** del
punto 3, invece, va rifatto tutto: quelli vengono prima di qualsiasi dettaglio
estetico.

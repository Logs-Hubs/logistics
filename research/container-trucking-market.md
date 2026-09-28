# TAM/SAM bottom-up — Software B2B per autotrasporto container in Liguria
### Genova · Savona/Vado Ligure · La Spezia — Settembre 2026

**Nota di incrocio con `MOVR_HANDOFF.md` (scritto in parallelo da un'altra sessione lo stesso giorno)**: quel file cita "99.321 aziende di autotrasporto attive fine 2025" dall'Albo Autotrasportatori. Questa ricerca, indipendentemente, trova **76.083** per lo stesso Albo allo stesso punto nel tempo (nota qui sotto: "in calo da ~99.321 nel periodo recente, -20.000 circa dal 2015" — quindi 99.321 potrebbe essere un dato più vecchio, non di fine 2025). Nessuna delle due sessioni ha raggiunto direttamente alboautotrasporto.it (proxy di rete bloccato in entrambe): **verificare la fonte primaria prima di usare uno dei due numeri in un documento esterno** (deck, business plan).

---

## 0. Come leggere questo documento

Ogni numero è etichettato:

- **[FACT]** — dato riportato direttamente da una fonte primaria pubblica, con URL. Dove il dato è arrotondato dalla fonte stessa o da agenzie di stampa che lo citano, è segnalato come "FACT (approssimato)".
- **[ESTIMATE]** — elaborazione dell'autore a partire da uno o più FACT, con formula e passaggi espliciti.
- **[HYPOTHESIS]** — assunzione non verificata da fonte diretta, necessaria per chiudere la catena di calcolo. Segnalata sempre esplicitamente, mai presentata come dato.
- **[UNKNOWN]** — dato richiesto ma non reperito in questa sessione di ricerca; dichiarato invece di essere inventato.

**Avvertenza metodologica generale**: molte fonti giornalistiche consultate (Shipmag, TrasportoEuropa, Messaggero Marittimo, ecc.) riportano comunicati delle Autorità di Sistema Portuale, ma non sempre è stato possibile raggiungere il documento statistico ufficiale originale (portsofgenoa.com e adspmarligureorientale.it sono risultati bloccati dal proxy di rete di questo ambiente in fase di WebFetch diretto). I numeri sono quindi FACT nel senso che sono citazioni dirette e concordanti di comunicati ufficiali ripresi da più testate, ma si raccomanda una verifica finale sui report statistici annuali ufficiali (portsofgenoa.com/statistiche, adspmarligureorientale.it) prima di un uso in un business plan formale.

---

## 1. Quante aziende in Liguria fanno autotrasporto container come attività core

### 1.1 Il problema di classificazione

Non esiste un codice ATECO specifico per "autotrasporto container portuale" — l'attività ricade nel codice generico **49.41.00 "Trasporto di merci su strada"** (o 49.41.0), che include anche autotrasporto non legato ai porti (edilizia, GDO, industria, ecc.). **[FACT]** Nessuna fonte reperita in questa sessione fornisce un sotto-conteggio ISTAT/ATECO specifico per "autotrasporto container/drayage portuale". Questo è un limite strutturale delle statistiche pubbliche italiane, non un errore di ricerca.
Fonti consultate su questo punto: quickfisco.it, fidocommercialista.it, codiceateco.it, codiceateco2025.it — tutte confermano che 49.41 è il codice generico più vicino, senza disaggregazione per tipo di merce o modalità (container vs sfuso vs cisterna).

Di conseguenza, la stima del numero di imprese "core container" in Liguria richiede una **triangolazione tra più fonti indirette**, illustrata di seguito.

### 1.2 Dati di base disponibili

| Dato | Valore | Etichetta | Fonte |
|---|---|---|---|
| Imprese attive ATECO 49.41 in Italia (sole forme societarie: srl, coop, spa, consorzi — non ditte individuali) | 26.757 | **[FACT]** | logisticab2b.it, "Quante aziende di autotrasporto ci sono in Italia: la mappa", elaborazione su dati InfoCamere/CCIAA (Edizioni B2B) |
| Imprese ATECO 49.41 in Liguria (stessa base, solo forme societarie) | 266 | **[FACT]** (dato citato da fonte secondaria — vedi nota sotto) | Confartigianato Trasporti, "Albo Autotrasporto: infografica sul numero di imprese per le singole regioni italiane", ripreso da logisticab2b.it |
| Imprese iscritte all'Albo Nazionale degli Autotrasportatori (tutte le forme giuridiche, autorizzazione conto terzi, Italia) — fine 2025 | 76.083 (in calo da ~99.321 nel periodo recente, -20.000 circa dal 2015) | **[FACT]** | dati Albo Autotrasporto ripresi da uominietrasporti.it ("centonumeri") e rivistatir.it |
| Imprese Albo con >100 veicoli (Italia) | 1.086, pari allo 0,95% delle imprese ma al 30,5% del parco veicolare | **[FACT]** | uominietrasporti.it, "Autotrasporto, crescono le aziende con flotte oltre i 100 veicoli" |
| Imprese Albo con 1-5 veicoli (Italia) | 56% del totale | **[FACT]** | stessa fonte |
| Soci Spediporto (associazione spedizionieri/operatori portuali di Genova) | oltre 400 unità (spedizionieri + trasportatori + depositi), pari a "il 90% delle imprese presenti in Liguria" nel settore spedizioni/trasporti portuali secondo l'associazione stessa | **[FACT]**, ma auto-dichiarato dall'associazione (non verificabile in modo indipendente in questa sessione) | spediporto.it (via ricerca), non raggiungibile direttamente per WebFetch |
| Veicoli industriali rappresentati collettivamente dalle associazioni di categoria attive sul nodo portuale di Genova (Trasportounito, Aliai, Anita, CNA-FITA, Confartigianato Trasporti, FAI, FIAP, Lega Cooperative) | circa 3.000 mezzi | **[FACT]** (dichiarazione associativa, citata in articoli su sovrapprezzo container 2024-2025) | trasportoeuropa.it, uominietrasporti.it |
| Mezzi pesanti in transito giornaliero ai varchi del porto di Genova | circa 4.000 mezzi/giorno | **[FACT]** (stima Trasportounito, ripresa da più testate) | uominietrasporti.it, mecar.it |

**Nota sul dato "266 imprese Liguria"**: non è stato possibile raggiungere direttamente la pagina con la tabella regionale completa (confartigianatotrasporti.it e logisticab2b.it sono risultati bloccati dal proxy di rete durante il tentativo di WebFetch), quindi il numero esatto e l'anno di riferimento non sono stati verificati sulla fonte primaria in questa sessione — è riportato così come restituito dal motore di ricerca, con il caveat esplicito che **include solo le forme societarie di capitali/cooperative**, escludendo le ditte individuali ("padroncini"), che nell'autotrasporto italiano sono la maggioranza numerica ma tipicamente hanno 1 solo veicolo.

### 1.3 Stima del numero di imprese Liguri "core container" — [ESTIMATE]

**Perché il dato a 266 è comunque utile**: per il segmento target di un software B2B (aziende con flotta abbastanza grande da giustificare un TMS/software gestionale — indicativamente 15+ veicoli), le ditte individuali con 1-2 mezzi sono irrilevanti. Le società di capitali/cooperative (quelle contate nel dato "266") sono un proxy ragionevole dell'universo di imprese strutturate, perché una flotta di 15+ mezzi richiede quasi sempre forma societaria per ragioni fiscali/assicurative.

**Metodo A — top-down da ATECO regionale**:
```
Imprese societarie ATECO 49.41 Liguria = 266                         [FACT, non riverificato]
Ipotesi HYPOTHESIS: quota di queste imprese la cui attività prevalente/core
è il trasporto container da/per i 3 porti liguri = 40-55%
  (ipotesi basata sulla forte concentrazione geografica dell'economia
  ligure attorno alla logistica portuale, ma NON misurata direttamente)
→ 266 × 0,40 = 106   (limite basso)
→ 266 × 0,55 = 146   (limite alto)
```

**Metodo B — bottom-up da veicoli associativi**:
```
Veicoli industriali rappresentati dalle associazioni attive sul nodo
portuale genovese = circa 3.000                                      [FACT]
Ipotesi HYPOTHESIS: fleet size medio delle imprese "strutturate"
(non padroncini singoli) attive nel drayage container = 15-20 veicoli
  (nessuna fonte diretta sulla fleet size media Ligure; valore plausibile
  desunto dal fatto che il segmento target del software è proprio 15-100
  veicoli — quindi è in parte una scelta di modellazione, non un dato)
→ 3.000 / 20 = 150   (limite basso, fleet media più grande)
→ 3.000 / 15 = 200   (limite alto, fleet media più piccola)
Nota: questo conteggio riguarda solo le associazioni attive sul nodo
Genova/Savona; non include La Spezia in modo esplicito, quindi tende
a SOTTOSTIMARE il totale ligure.
```

**Stima finale combinata — [ESTIMATE]**: incrociando i due metodi (106–200, con centro attorno a 130–150) e aggiungendo un margine per La Spezia (non coperto dal Metodo B), la stima è:

> **Numero di imprese in Liguria per cui il trasporto/drayage container è attività core, con fascia dimensionale "target B2B" (15-100 mezzi): 100–180 imprese, valore centrale adottato per gli scenari = 140.**

Questo è un **ESTIMATE con incertezza dichiarata elevata** (±35% circa attorno al centro), non un conteggio verificato. Non è stato trovato nessun elenco pubblico nominativo (es. registro Albo filtrato per "container" o "porto") che permetta un conteggio diretto.

---

## 2. Distribuzione per dimensione flotta

### 2.1 Dato nazionale disponibile — [FACT]

L'unico dato di distribuzione dimensionale reperito è **nazionale**, non ligure, e a bande larghe:

| Fascia flotta | Quota imprese (Italia) | Quota parco veicolare (Italia) | Fonte |
|---|---|---|---|
| 1-5 veicoli | 56% delle imprese Albo | non specificata | uominietrasporti.it/centonumeri |
| 6-100 veicoli (residuo) | ~43% delle imprese (per differenza) | ~69,5% del parco (per differenza) | elaborazione su stessa fonte |
| >100 veicoli | 0,95% delle imprese (1.086 imprese) | 30,5% del parco | uominietrasporti.it/centonumeri, rivistatir.it |

### 2.2 Distribuzione specifica per la Liguria / per fasce richieste (1-10, 10-20, 20-50, 50-100, 100+)

**[HYPOTHESIS / UNKNOWN]** — Nessuna fonte pubblica reperita in questa sessione (Albo Autotrasportatori, Assoporti, ASdP Liguri, ISTAT, Confetra, Spediporto, Trasportounito, Camere di Commercio) pubblica una distribuzione per fasce di flotta a livello regionale ligure, né a livello nazionale con la granularità richiesta (10-20, 20-50, 50-100). Il dato nazionale disponibile è solo a tre bande larghe (1-5 / 6-100 / >100), come sopra.

**Si dichiara esplicitamente**: qualunque tabella a 5 fasce (1-10, 10-20, 20-50, 50-100, 100+) per la Liguria sarebbe una costruzione arbitraria non supportata da fonti, e per la regola richiesta dall'utente **non viene presentata come stima numerica**, ma solo come struttura qualitativa **HYPOTHESIS**:

- **1-10 mezzi**: verosimilmente la maggioranza numerica delle imprese Liguri di autotrasporto generico (coerente con l'evidenza nazionale del 56% sotto i 5 mezzi), ma non tutte servono i porti come attività core — HYPOTHESIS, non quantificato.
- **10-20 / 20-50 mezzi**: verosimilmente la fascia dove si concentra la maggior parte delle imprese "target" per un software B2B — HYPOTHESIS coerente con la stima di 100-180 imprese del §1.3, ma senza validazione diretta.
- **50-100 mezzi**: verosimilmente pochissime imprese (ordine di grandezza: singole unità o poche decine in tutta la Liguria) — HYPOTHESIS.
- **100+ mezzi**: in Liguria esistono operatori di grande scala (es. Gruppo Spinelli, che gestisce anche terminal — 580.000+ TEU/anno movimentati dal terminal GPT — ma Spinelli è primariamente un terminalista/operatore portuale multi-attività, non solo un'impresa di autotrasporto puro) — **[FACT parziale]** su Spinelli (fonte: gruppospinelli.com, via ricerca), ma non generalizzabile ad altre imprese.

---

## 3. Volume container nei tre porti liguri e derivazione dei "truck moves"

### 3.1 Dati TEU — [FACT]

**Sistema Mar Ligure Occidentale (Genova + Savona + Vado Ligure) — anno 2025:**

| Voce | TEU | Variazione YoY | Fonte |
|---|---|---|---|
| Totale sistema | 2.999.486 | +6,3% | portsofgenoa.com (comunicato ripreso da primocanale.it, shipmag.it, trasporti-italia.com, ilnautilus.it) |
| di cui Genova | ~2.400.000 | -1,6% | idem |
| di cui Savona-Vado Ligure | ~590.000 | +58,4% (in gran parte transhipment) | idem |
| Gateway (container pieni import/export) | 1.919.700 | +4,8% | portseurope.com / worldcargonews.com / breakbulk.news, che citano il comunicato Ports of Genoa 2025 |
| Transhipment | 547.790 | +31,5% | idem |
| Residuo (vuoti/altro, per differenza: 2.999.486 - 1.919.700 - 547.790) | 531.996 | n.d. | **[ESTIMATE per sottrazione]**, non classificato esplicitamente dalla fonte |
| Quota modale ferro (sistema, 2025) | 13,2% | -2 punti vs 2024 (15,2%) | portsofgenoa.com "Boom del trasporto ferroviario" / messaggeromarittimo.it |
| Convogli ferroviari (2025) | 7.935 | -14,2% | idem |
| TEU su ferro (2025) | 322.451 | -11,6% | idem |

**Sistema Mar Ligure Orientale (La Spezia + Marina di Carrara):**

| Voce | Valore | Anno | Fonte |
|---|---|---|---|
| Totale La Spezia (porto singolo) | 1.238.258 TEU | 2024 (+8,7%) | trasportoeuropa.it, shipmag.it |
| di cui LSCT | 1.123.602 TEU | 2024 (+11%) | idem |
| di cui Terminal del Golfo | 114.656 TEU | 2024 (-9,7%) | idem |
| Gateway La Spezia | 1.142.621 TEU (92,3% del totale) | 2024 (+6,8%) | idem |
| Quota ferro (intermodale) | ~34% | 2024, 7.405 treni (+4%), 3,1 Mt (+10,2%) | trasportoeuropa.it |
| Totale La Spezia + Carrara combinato | oltre 1,3 milioni TEU | 2025 | lanazione.it |
| La Spezia H1 (semestre, anno riportato in modo non univoco dalle fonti: 2025 secondo una fonte, 2026 secondo ansa.it) | 634.021 TEU, di cui gateway 548.200 e transhipment 85.821 (gateway = 86,5%) | H1 2025/2026 (ambiguità di datazione nelle fonti consultate) | gazzettadellaspezia.com, ansa.it |
| Tonnellate totali La Spezia | 12,62 milioni t (+3,3%) | 2025 | corrieremarittimo.it |

**Avvertenza sui dati La Spezia 2025**: le fonti giornalistiche consultate riportano cifre non sempre coerenti tra loro su base annua vs semestrale, e in un caso la datazione stessa (2025 vs 2026) è ambigua tra le fonti. Il dato "oltre 1,3 milioni di TEU" per La Spezia+Carrara 2025 è quindi un **FACT approssimato**, da verificare sul report ufficiale AdSP Mar Ligure Orientale (non raggiungibile direttamente in questa sessione).

**Totale indicativo Liguria 2025 (tre porti)**: 2.999.486 + ~1.300.000 ≈ **~4,3 milioni di TEU/anno** — **[ESTIMATE]**, somma di due FACT con arrotondamento.

### 3.2 Metodologia esplicita: da TEU a "truck moves" — [ESTIMATE, con ogni assunzione etichettata]

**Assunzioni dichiarate (tutte necessarie, nessuna nascosta):**

- **A1 [HYPOTHESIS]**: solo il traffico *gateway* (container pieni import/export con origine/destinazione nell'entroterra) genera un movimento verso l'entroterra (su gomma o ferro). Il traffico di *transhipment* (trasbordo nave-nave in banchina) NON genera movimenti stradali o ferroviari verso l'esterno del porto. Questa è un'assunzione standard nella logistica portuale, ma non è stata trovata una fonte che la renda esplicita per il contesto ligure in questa sessione.
- **A2 [ESTIMATE/HYPOTHESIS per porto]**: quota gateway sul totale:
  - Genova+Savona/Vado (sistema): 64,0% **[FACT]**, calcolato da 1.919.700/2.999.486 (dati portsofgenoa.com 2025).
  - La Spezia+Carrara: si assume 90% **[HYPOTHESIS]**, prudenzialmente arrotondato per difetto rispetto al dato FACT 2024 di La Spezia singola (92,3%), per tenere conto della minore visibilità sul mix di Carrara.
- **A3 [ESTIMATE per porto]**: quota modale ferro sul traffico gateway:
  - Genova+Savona: si applica il 13,2% di quota ferro di sistema **[FACT]** direttamente al gateway, assumendo che il dato pubblicato sia già calcolato su base gateway (assunzione standard di settore, ma non confermata esplicitamente dalla fonte per il denominatore esatto — **[HYPOTHESIS sul denominatore]**).
  - La Spezia+Carrara: si usa 30%, arrotondato per difetto rispetto al 34% "intermodale" 2024 **[FACT]**, perché quel 34% potrebbe riferirsi a tonnellate totali di merce e non specificamente a TEU (ambiguità della fonte) — **[HYPOTHESIS prudenziale]**.
- **A4**: quota su gomma = 100% − quota ferro (per differenza, nessuna terza modalità significativa considerata).
- **A5 [HYPOTHESIS]**: 1 "truck move" (viaggio camion, and singolo, di consegna o ritiro) trasporta in media **1,6 TEU** (mix tipico tra container da 20' = 1 TEU/viaggio e da 40'/45' = 2 TEU/viaggio, con prevalenza di 40'). Nessuna fonte diretta reperita per la Liguria; è un'assunzione standard di settore (dichiarata come tale, non verificata).
- **A6 [HYPOTHESIS]**: non si aggiungono viaggi extra per il riposizionamento di container vuoti (il residuo ~532.000 TEU del sistema occidentale, §3.1, non classificato, è escluso dal calcolo principale) — questo rende la stima **conservativa/al ribasso**. Se si includesse anche il riposizionamento vuoti, il numero di truck moves stimato potrebbe aumentare indicativamente del 15-30% — **[HYPOTHESIS]**, non quantificato con precisione.

**Calcolo passo-passo:**

```
GENOVA + SAVONA/VADO (sistema Mar Ligure Occidentale, 2025)
Gateway TEU (FACT)                         = 1.919.700
Quota ferro applicata al gateway (A3)      = 13,2%
TEU su ferro (gateway)                     = 1.919.700 × 0,132 = 253.400
TEU su gomma (gateway)                     = 1.919.700 × 0,868 = 1.666.300
Truck moves (A5: 1,6 TEU/viaggio)          = 1.666.300 / 1,6 ≈ 1.041.400 truck moves/anno

LA SPEZIA + CARRARA (2025, stima)
Totale TEU (FACT approssimato)             = 1.300.000
Gateway (A2: 90%)                          = 1.170.000
Quota ferro applicata (A3: 30%)            = 1.170.000 × 0,30 = 351.000
TEU su gomma (gateway)                     = 1.170.000 × 0,70 = 819.000
Truck moves (A5: 1,6 TEU/viaggio)          = 819.000 / 1,6 ≈ 511.900 truck moves/anno

TOTALE LIGURIA (3 porti) — [ESTIMATE]
Truck moves/anno ≈ 1.041.400 + 511.900 ≈ 1.553.300 ≈ ~1,55 milioni truck moves/anno
```

**Verifica di plausibilità (sanity check) — [ESTIMATE vs FACT indipendente]**:
i truck moves stimati per il solo sistema Genova+Savona (1.041.400/anno) equivalgono, su circa 300 giorni lavorativi/anno, a **~3.470 viaggi/giorno**. Il dato indipendente reperito — "**circa 4.000 mezzi/giorno**" in transito ai varchi del porto di Genova **[FACT]**, fonte Trasportounito — è dello stesso ordine di grandezza (rapporto 0,87), il che dà una ragionevole plausibilità alla catena di stime sopra, pur non essendo una conferma esatta (il dato dei 4.000 mezzi/giorno include probabilmente anche traffico non-container e conteggia separatamente ogni passaggio al varco, non necessariamente il "viaggio" netto).

**Conclusione §3**: il numero di ~1,5 milioni di truck moves/anno in Liguria è un **ESTIMATE a più stadi**, con incertezza complessiva stimabile in un range **1,1 – 2,0 milioni/anno** se si fanno variare le assunzioni A2/A3/A5/A6 entro intervalli ragionevoli. Non deve essere citato come dato ufficiale.

---

## 4. Scenari di Serviceable Addressable Market (SAM) annuo

### 4.1 Definizione del segmento target

Segmento target per un tool B2B di gestione autotrasporto container: imprese con flotta **15-100 mezzi** (troppo piccole → 1 solo veicolo, spesso il titolare stesso è l'autista, scarso bisogno di software; troppo grandi → 100+ mezzi, tipicamente già dotate di TMS enterprise custom o sono terminalisti/gruppi integrati con soluzioni proprie).

Numero di imprese target in Liguria: **100–180, centrale = 140** — **[ESTIMATE]**, da §1.3.

### 4.2 Formula

```
SAM annuo = N imprese target × ACV (Annual Contract Value)
```

### 4.3 Tre scenari ACV (con range basso/centrale/alto su N)

| Scenario ACV | N basso (100) | N centrale (140) | N alto (180) |
|---|---|---|---|
| **€10.000/anno** | 100 × 10.000 = **€1.000.000** | 140 × 10.000 = **€1.400.000** | 180 × 10.000 = **€1.800.000** |
| **€20.000/anno** | 100 × 20.000 = **€2.000.000** | 140 × 20.000 = **€2.800.000** | 180 × 20.000 = **€3.600.000** |
| **€30.000/anno** | 100 × 30.000 = **€3.000.000** | 140 × 30.000 = **€4.200.000** | 180 × 30.000 = **€5.400.000** |

**Scenario centrale raccomandato per pianificazione**: SAM Liguria = **€1,4M (ACV 10k) / €2,8M (ACV 20k) / €4,2M (ACV 30k)**, con un range di incertezza complessivo di circa ±30% dovuto interamente all'incertezza su N (il §1.3 rimane il collo di bottiglia metodologico principale: non esiste un conteggio pubblico diretto delle imprese Liguri di autotrasporto container).

### 4.4 Nota su estensione nazionale/europea (fuori scope principale, solo indicativa)

**[HYPOTHESIS, molto speculativa]**: applicando lo stesso rapporto "imprese target / imprese societarie ATECO 49.41" osservato in Liguria (140/266 ≈ 53%) al totale nazionale di 26.757 imprese societarie **[FACT, §1.2]**, si otterrebbe un ordine di grandezza nazionale di ~14.000 imprese target — ma questo è **quasi certamente una sovrastima grossolana**, perché la densità di imprese "core container" per impresa di autotrasporto generico in Liguria (regione a densità portuale eccezionale) non è replicabile nelle altre regioni italiane (la maggior parte delle 26.757 imprese nazionali fa autotrasporto generico non legato a porti). Un TAM nazionale/europeo credibile richiederebbe una ricerca dedicata separata, porto per porto (Trieste, Venezia, Ravenna, Livorno, Napoli, Gioia Tauro, e i principali porti Nord-Europa/Mediterraneo), che esula dallo scope di questa analisi.

---

## 5. Sintesi dei limiti principali della ricerca

1. **Nessun conteggio pubblico diretto** delle imprese di autotrasporto container in Liguria come sottocategoria — il numero di imprese target (§1.3, §4) è un **ESTIMATE con incertezza ±30-35%**, non un FACT.
2. **Nessuna distribuzione per fasce di flotta specifica per la Liguria** — dichiarato **HYPOTHESIS/UNKNOWN** in §2.2, come richiesto.
3. **Accesso diretto bloccato** (proxy di rete dell'ambiente) ai siti ufficiali portsofgenoa.com, adspmarligureorientale.it, istat.it, confartigianatotrasporti.it, logisticab2b.it, spediporto.it — tutti i dati da questi siti sono stati ottenuti tramite ricerca/citazione di terze parti (testate di settore), non tramite lettura diretta del documento primario. Si raccomanda una verifica manuale su questi siti prima di un uso decisionale.
4. **Ambiguità di datazione** in alcune fonti su La Spezia (semestre 2025 vs 2026) — segnalata esplicitamente in §3.1.
5. La conversione TEU → truck moves (§3.2) dipende da **5 assunzioni esplicite (A1-A6)**, nessuna delle quali è verificata da una fonte diretta per il contesto ligure; il risultato (~1,55M truck moves/anno) va trattato come **ordine di grandezza**, validato solo da un controllo di coerenza indiretto (§3.2, sanity check).

---

## 6. Elenco fonti citate

- Autorità di Sistema Portuale Mar Ligure Occidentale (comunicati ripresi da terze parti): portsofgenoa.com, portseurope.com, worldcargonews.com, breakbulk.news, primocanale.it, shipmag.it, trasporti-italia.com, ilnautilus.it, messaggeromarittimo.it, genovatoday.it
- Autorità di Sistema Portuale Mar Ligure Orientale (via terze parti): trasportoeuropa.it, shipmag.it, gazzettadellaspezia.com, ansa.it, lanazione.it, corrieremarittimo.it, assagentispezia.it
- Assoporti: assoporti.it (port-graphics 2025 PDF individuato ma non aperto), shippingitaly.it, portnews.it, unispedsrl.it
- ISTAT: istat.it (Statistica Report "Trasporto marittimo in Italia 2024" e "Il trasporto di merci su strada e su ferrovia — Anno 2024" — individuati via ricerca, non aperti direttamente per blocco proxy), italpress.com, ambientenonsolo.com
- Albo Nazionale Autotrasportatori / dati settore: uominietrasporti.it ("centonumeri"), rivistatir.it, alboautotrasporto.it, logisticab2b.it, confartigianatotrasporti.it (non raggiunti direttamente)
- Associazioni di categoria: spediporto.it (via ricerca), trasportoeuropa.it (Trasportounito), liguria.bizjournal.it
- Aziende di riferimento (evidenza aneddotica, non statistica): gruppospinelli.com, selgenova.it

---

*Documento preparato con metodologia bottom-up esplicita, il 28 settembre 2026. Da aggiornare con dati primari verificati direttamente sui siti ufficiali (attualmente non raggiungibili dall'ambiente di ricerca usato) prima di un utilizzo in sede di investor deck o business plan formale.*

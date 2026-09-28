# Integrazione Movr con terminal portuali e PCS — Genova, Savona-Vado, La Spezia

Ricerca condotta il 28/09/2026 tramite ricerca web pubblica. Nessuna informazione è stata inventata; ogni affermazione è accompagnata da una fonte. Dove le fonti pubbliche non bastavano, il campo è marcato **UNKNOWN — richiede contatto diretto**. Nota metodologica: il fetch diretto verso alcuni domini (portsofgenoa.com, psagp.it, developer.apmterminals.com, edidomus.it) è risultato bloccato dal proxy di rete di questo ambiente; le informazioni derivano quindi dagli snippet di ricerca (titoli + estratti), non dalla lettura integrale delle pagine — si raccomanda una verifica diretta leggendo le pagine complete prima di decisioni di prodotto vincolanti.

---

## 0. Correzione importante alla premessa della ricerca

Il brief originale citava "terminal Vecon" come terminal container di La Spezia. Dalla ricerca risulta che **Vecon è il terminal container del porto di Venezia** (gruppo PSA — "PSA Venice VECON"), non di La Spezia. A La Spezia i due terminal contenitori operativi sono:
- **LSCT – La Spezia Container Terminal** (gruppo Contship Italia / Eurokai)
- **Terminal del Golfo (TDG)** — terminal multipurpose del gruppo Contship, prevalentemente al servizio delle linee Tarros, in fase di ampliamento

Fonti: [Vecon – Terminal Container Venezia](https://www.vecon.it/en/), [Contship Italia – LSCT](https://contshipitalia.com/en/terminals/la-spezia/), [Terminal del Golfo](https://www.terminaldelgolfo.com/), [Shipping Italy – Terminal del Golfo ampliamento](https://www.shippingitaly.it/2025/05/30/terminal-del-golfo-puo-partire-con-i-lavori-di-ampliamento-nel-porto-di-spezia/)

---

## 1. Genova

### 1.1 Panorama terminal contenitori

| Terminal | Gruppo/operatore | Note |
|---|---|---|
| PSA Genova Prà (ex Voltri Terminal Europa) | PSA International | Terminal container principale, concessione fino al 2051 |
| PSA SECH (Calata Sanità) | PSA International (dal 2024, ex Gruppo Investimenti Portuali) | Fusione/acquisizione completata nel 2024 dopo iter TAR; ricorso di Spinelli respinto |
| Terminal San Giorgio (TSG) | Ignazio Messina & C. (MSC al 49% nel gruppo Messina) | Ro-ro + lo-lo, non solo container |
| Terminal Messina | Ignazio Messina & C. | |
| C. Steinweg – GMT | Steinweg | Operatore multipurpose |

Fonti: [Shipping Italy – PSA sale al 100%](https://www.shippingitaly.it/2024/03/15/psa-sale-al-100-dei-suoi-terminal-container-italiani-in-attesa-di-un-nuovo-socio-che-non-sara-axa/), [Il Sole 24 Ore – PSA acquisisce Sech, MSC entra in Messina](https://www.ilsole24ore.com/art/risiko-genova-psa-acquisisce-sech-e-msc-entra-gruppo-messina-AD5N0pf), [Informazioni Marittime – Tar respinge ricorso Spinelli](https://www.informazionimarittime.com/post/fusione-psa-sech-genova-tar-liguria-respinge-ricorso-spinelli)

### 1.2 PSA Genova Prà — sistema di prenotazione slot

- **Nome**: Truck Appointment System **"L'Appuntamento"**, attivo dal 7 gennaio 2020. Portale `online.psagp.it`, app dedicata "PSA Genova Prà Trasportatori" (iOS/Android) con TAS, totem mobile, TMS, One Stop Office.
- **API/M2M**: la comunicazione è dichiarata avvenire "inizialmente via Web/App Service e successivamente machine-to-machine" — quindi un'integrazione M2M esiste o era prevista, ma **nessun portale developer pubblico trovato** (a differenza di APM, vedi §2). **UNKNOWN — richiede contatto psagp-marketing@globalpsa.com**.
- **Costi**: UNKNOWN, nessuna fonte pubblica cita tariffe.
- **Workflow attuale**: prenotazione via portale/app prima dell'arrivo al varco.

Fonti: [PortsOfGenoa – Nuovo servizio autotrasportatori](https://www.portsofgenoa.com/it/magazine/news/nuovo-servizio-autotrasportatori-psa-genova-pra.html), [PSA GP – Servizi Telematici & App](https://www.psagp.it/it/node/47), [App Store – PSA Genova Prà Trasportatori](https://apps.apple.com/it/app/psa-genova-pra-trasportatori/id1482763991)

### 1.3 PSA SECH (Calata Sanità)

Dopo la fusione con PSA (2024), è plausibile una migrazione verso i sistemi PSA condivisi, ma **nessuna fonte pubblica conferma esplicitamente** se SECH oggi condivide lo stesso Truck Appointment System di Prà. **UNKNOWN**.

### 1.4 Port Community System del porto di Genova

- **Nome storico**: **E-Port**, in uso almeno dal 2008 (manuale Confetra 2008), gestito tecnicamente via `ediwin.sistemietelematatica.it` (fornitore: Sistemi e Telematica).
- **Evoluzione**: dal **19 febbraio 2024**, l'inserimento del viaggio per merce containerizzata a Genova avviene **esclusivamente** tramite il nuovo portale `genova.pcspln.cloud/web/portale-adsp/` — nome che suggerisce la confluenza tra PCS genovese e Piattaforma Logistica Nazionale (PLN, vedi §4). Copre sia Genova Prà sia Savona/Vado (stessa AdSP Mar Ligure Occidentale).
- **API pubblica**: non risulta un portale developer pubblico. Accesso EDI storicamente esistente ma **specifiche tecniche non pubbliche**.
- **Registrazione**: sì, utenza nominale dopo "Registrazione Impresa"; inserimento viaggio obbligatorio dal 19/2/2024.
- **Costi**: parzialmente esenti per trasporto conto terzi secondo normativa citata; dettaglio tariffario completo **UNKNOWN**.
- **Segnale operativo**: Federlogistica lamenta pubblicamente (novembre 2025) "coni d'ombra" nel PCS di Genova — il sistema ha aree di malfunzionamento/incertezza note agli operatori.

Fonti: [PortsOfGenoa – Port Community System](https://www.portsofgenoa.com/it/porti-e-logistica/digitalizzazione/port-community-system.html), [Confetra – Manuale E-Port 2008](https://www.confetra.com/it/primopiano/E-port_Porto%20di%20Genova%20-%20Manuale%20illustrativo.pdf), [genova.pcspln.cloud – Portale ADSP](https://genova.pcspln.cloud/web/portale-adsp/), [Shipping Italy – Federlogistica coni d'ombra](https://www.shippingitaly.it/2025/11/06/federlogistica-risolvere-i-coni-dombra-del-port-community-system-di-genova/)

---

## 2. Savona–Vado Ligure

### 2.1 Vado Gateway (APM Terminals / Maersk, COSCO Shipping Ports al 40%)

- **Nome**: **TERMPoint** — sistema standard APM Terminals. Portale `termpoint.apmterminals.com`, app "APMT TERMpoint Appointments" (2020).
- **API pubblica e documentata: SÌ, confermato.** API Store pubblico APM Terminals (`developer.apmterminals.com`), voce **"TERMPoint Truck Appointments"**, esplicitamente disponibile per APM Terminals Los Angeles, Gothenburg e **Vado Ligure**, **utilizzabile gratuitamente**.
- **Registrazione**: utenti autorizzati su TERMPoint, authorization key API associata a utente/azienda/terminal.
- **Costi**: API dichiarata gratuita. Costi di onboarding tecnico non documentati. Contatto pubblicato: vadocusservice@apmterminals.com / +39 019 2891933.
- **Workflow attuale**: prenotazione via web/app; gate completamente automatizzato con lettura ottica targa/container, truck-turn-time dichiarato ~30 minuti.

Fonti: [APM Terminals – TERMPoint Truck Appointments (API Store)](https://developer.apmterminals.com/api/8), [APM Terminals – Truck Appointment API news](https://www.apmterminals.com/en/news/news-releases/2022/220818-apm-terminals-mobile-rolls-out-truck-appointment-api-for-increased-supply-chain-efficiency), [APM Terminals Vado Ligure – TAS](https://www.apmterminals.com/en/vado-ligure/etools/truck-appointment-system)

### 2.2 PCS locale

Stessa AdSP Mar Ligure Occidentale di Genova → stesso PCS E-Port/genova.pcspln.cloud (§1.4). Non risulta un PCS separato per Savona-Vado.

---

## 3. La Spezia

### 3.1 LSCT – La Spezia Container Terminal (Contship Italia / Eurokai)

- **Sistema di prenotazione**: nessun nome di prodotto commerciale pubblico trovato (diverso da "TERMPoint"/"L'Appuntamento"). Sistema di "preavviso" telematico integrato con il **Gate Operating System (GOS)** del nuovo gate automatizzato (operativo da fine ottobre 2025), che dialoga col TOS del terminal. Oltre il 90% dei camion operano tramite prenotazione.
- **Gate automatizzato**: OCR container, LPR targhe, totem, semafori, bilance — 4 corsie.
- **API pubblica/EDI**: nessuna fonte pubblica trovata. **UNKNOWN — richiede contatto diretto con Contship Italia/LSCT**.
- **Contesto rilevante**: conflitto pubblico ("guerra aperta") tra autotrasportatori e terminalisti a La Spezia nel 2022 su costi/sovrapprezzi — segnale di frizioni note nel rapporto vettori-terminal, utile per il go-to-market.

Fonti: [Shipping Italy – Nuovo gate automatizzato LSCT](https://www.shippingitaly.it/2025/10/30/un-nuovo-gate-automatizzato-entra-in-funzione-al-la-spezia-container-terminal/), [ANSA – Porto La Spezia nuovo gate automatizzato](https://www.ansa.it/liguria/notizie/2025/10/30/porto-la-spezia-un-nuovo-gate-automatizzato-per-lsct_69d57557-5181-4765-bcc2-bf16dbbabb6f.html), [Shipping Italy – Guerra aperta autotrasportatori/terminalisti La Spezia 2022](https://www.shippingitaly.it/2022/06/22/a-la-spezia-e-guerra-aperta-fra-autotrasportatori-e-terminalisti/)

### 3.2 Terminal del Golfo (TDG)

Nessuna fonte specifica trovata sul sistema di prenotazione slot separato da APNet/LSCT. **UNKNOWN**.

### 3.3 PCS — APNet

- **Nome confermato: APNet.** Sviluppato e gestito direttamente dall'AdSP Mar Ligure Orientale (non da vendor esterno), online dal **2015**. Membro **IPCSA** (International Port Community Systems Association) dal 2022. Include modulo di interoperabilità con agenzie marittime/autorità e con PMIS.
- La Spezia è stata porto pilota nazionale per **S.U.DO.CO** (Sportello Unico Doganale e dei Controlli), test operativi dall'8 novembre 2022 sul modulo "Gestione dei controlli".

Fonti: [IPCSA – benvenuto ad AdSP Ligure Orientale](https://ipcsa.international/news/2022/04/11/1408/), [AdSP Mar Ligure Orientale – Port Community System](https://www.adspmarligureorientale.it/en/adsp-marl-ligure-orientale/strategy-and-development/port-community-system/)

---

## 4. Iniziative nazionali/UE rilevanti (orizzonte 1-2 anni)

1. **Piattaforma Logistica Nazionale (PLN)**, gestita da **UIRNet S.p.A.** per conto del MIT. Genova è stato il **primo porto italiano operativamente connesso alla PLN** — il PCS locale è confluito nella PLN (da qui il dominio `genova.pcspln.cloud`). La PLN include un modulo per la gestione di aree di sosta mezzi pesanti a livello nazionale.
2. **S.U.DO.CO** — La Spezia porto pilota per il primo modulo, in test dall'8 novembre 2022.
3. **PNRR M3C2 – Investimento 2.1** "Digitalizzazione della catena logistica": **250M€** complessivi, bando specifico da **16M€** per interoperabilità dei servizi PCS delle AdSP (Decreto direttoriale MIT n. 11/2024, Decreto n. 35/2023).
4. **Obiettivo dichiarato**: interoperabilità PCS-PCS e PCS-PLN entro la seconda metà 2024 — **non verificabile pubblicamente se pienamente raggiunto operativamente** al 2026; le critiche di Federlogistica (nov. 2025) sui "coni d'ombra" del PCS genovese suggeriscono attrito residuo.

**Implicazione per Movr**: c'è una spinta politico-finanziaria concreta verso PCS interoperabili via PLN/UIRNet e verso lo sportello unico doganale. Se questi programmi maturano, potrebbero offrire un punto di integrazione unico (via PLN) invece di N integrazioni bilaterali per terminal — ma i tempi reali di maturazione non sono verificabili con certezza da fonti pubbliche.

Fonti: [TTS Italia – Genova primo porto connesso a PLN](https://www.ttsitalia.it/uirnet-e-genova-il-primo-porto-connesso-alla-piattaforma-logistica-nazionale/), [MIT – PNRR PCS](https://mit.gov.it/comunicazione/news/mit-pnrr-catena-logistica-sempre-piu-digitale-con-i-port-community-system-pcs), [FASI – bando 16M PNRR PCS](https://fasi.eu/it/articoli/novita/26483-bando-pnrr-digitalizzazione-servizi-pcs.html)

---

## 5. Sintesi comparativa

| | Genova (Prà/SECH) | Savona-Vado (APM) | La Spezia (LSCT/TDG) |
|---|---|---|---|
| Sistema slot camion | "L'Appuntamento" (Prà) + PCS `genova.pcspln.cloud` per inserimento viaggi | TERMPoint | Sistema di preavviso + gate automatizzato (nome prodotto non pubblico) |
| API pubblica documentata | Non trovata (M2M dichiarato ma non documentato) | **Sì — developer.apmterminals.com, API #8, gratuita** | Non trovata |
| EDI | Sì (storico, Sistemi e Telematica/ediwin) | Non risultano riferimenti espliciti (approccio API-first) | Non verificato |
| Registrazione obbligatoria per vettore | Sì (dal 19/2/2024) | Sì (utente TERMPoint autorizzato) | Presumibile, non confermato nel dettaglio |
| Costi noti | UNKNOWN (esenzioni parziali citate) | API dichiarata gratuita | UNKNOWN |
| PCS locale | E-Port → confluito in genova.pcspln.cloud / PLN | Stesso PCS di Genova | APNet (dal 2015, membro IPCSA) |

## 6. Raccomandazione pratica per il V1

**Non far dipendere il V1 di Movr da automazione profonda (API/EDI) dello slot booking.** Solo Vado Gateway (APM) ha un'API pubblica e gratuita confermata — utilizzabile come primo caso pilota reale di integrazione tecnica. Per Genova (PSA Prà/SECH) e La Spezia (LSCT), l'assenza di documentazione tecnica pubblica suggerisce che l'integrazione oggi richiede accordi diretti caso per caso con il terminal/AdSP.

Il V1 deve quindi trattare la prenotazione slot come **workflow semi-manuale assistito** (link/deep-link al portale del terminal corretto, notifiche, gestione documentale) con automazione reale solo dove un'API è confermata (Vado), prevedendo fin da subito un livello di astrazione che permetta di aggiungere integrazioni PLN/PCS quando l'interoperabilità nazionale matura. Coerente con il principio già fissato in `product/container-trucking-v1.md`: se l'integrazione non è disponibile, Movr dice "slot missing — action required" e lascia l'esecuzione manuale nel portale esterno.

## 7. Limiti espliciti della ricerca

- Basata su ricerca web generica, non su accesso diretto/autenticato ai portali (WebFetch bloccato per i domini principali in questo ambiente).
- Nessuna specifica tecnica di API (formati, endpoint, rate limit, autenticazione) verificata in dettaglio, tranne esistenza e gratuità della TERMPoint API di APM Terminals.
- Costi di accesso/integrazione in gran parte UNKNOWN per tutti e tre i sistemi.
- Non verificato se PSA SECH condivida oggi il sistema di prenotazione di PSA Genova Prà dopo la fusione 2024.
- Nessun dettaglio pubblico sul sistema di prenotazione di Terminal del Golfo (La Spezia).

**Prima di qualsiasi impegno di prodotto vincolato a un'integrazione tecnica specifica**: contattare direttamente AdSP Mar Ligure Occidentale, Sistemi e Telematica (fornitore E-Port), psagp-marketing@globalpsa.com, vadocusservice@apmterminals.com, Contship Italia/LSCT, AdSP Mar Ligure Orientale (ufficio APNet).

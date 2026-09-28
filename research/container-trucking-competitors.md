# Movr — Analisi competitor drayage/container trucking (USA + Europa/Italia)

Metodologia: ricerca web (WebSearch) su siti prodotto indicizzati, G2, Capterra, Software Advice, comunicati stampa, testate di settore (FreightWaves, JOC, Journal of Commerce, TrasportoEuropa, ShippingItaly, ANSA). Nessun accesso diretto a URL bloccati: mi baso sugli estratti restituiti dai motori di ricerca. Ogni affermazione è etichettata **FACT** (fonte diretta citata) o **HYPOTHESIS** (mia deduzione/inferenza, non verificata direttamente). Dove non ho trovato dati pubblici, scrivo esplicitamente **UNKNOWN**.

Nota metodologica importante trovata durante la ricerca: **non tutti e 5 i player richiesti sono realmente "USA-centrici" o "drayage-specifici"**. Questo è di per sé un finding rilevante (vedi sezioni Qargo e Raft) e viene segnalato esplicitamente invece di forzare la narrativa iniziale.

---

## 1. PortPro (drayOS)

### Target cliente
- **FACT**: PortPro è una TMS "operating platform" costruita specificamente per **drayage trucking companies e brokerage** (container/intermodale), non per truckload generico. [portpro.io](https://portpro.io/), [PortPro Launches TMS for Drayage Carriers and Brokers – TT News](https://www.ttnews.com/articles/portpro-tms-drayage)
- **FACT**: offre un prodotto dedicato "Profit Driver" per aziende **5–20 camion** (piccoli-medi vettori), oltre al piano base per flotte più grandi. [Capterra](https://www.capterra.com/p/214379/drayOS/)
- **FACT**: 550+ aziende di trasporto/brokeraggio drayage usano PortPro (dato aziendale, quindi da trattare con cautela ma citato da più fonti). [Crustdata](https://profiles.crustdata.com/company/portpro), [PitchBook](https://pitchbook.com/profiles/company/467571-97)
- **FACT**: fondata nel 2019 (New Jersey, USA), 90 dipendenti a marzo 2023 → ~188 a giugno 2026. [Crustdata]
- **HYPOTHESIS**: il grosso della clientela è mono-terminal, piccola/media impresa USA (5–50 trattori); le grandi flotte multi-terminal sembrano un segmento meno maturo del prodotto (vedi lamentele sotto).

### Pricing
- **FACT**: pricing non pubblico, custom quote, basato su numero di camion/driver. [Capterra](https://www.capterra.com/p/214379/drayOS/)
- **UNKNOWN**: fascia di prezzo esatta (€/mese per truck). Alcune recensioni G2 dicono che "il tier superiore con AI è percepito come costoso", ma senza cifre.

### Scope prodotto
- **FACT**: order entry, dispatch, container tracking, appointment-setting automatico ai terminal (pull automatico di 13 data point dal sito del terminal, booking automatico appuntamenti), messaggistica, AR/AP, reporting, per-diem monitoring, street turns, gestione "gray pool" (chassis+container secondario nello stesso load), drayOS Track (visibilità per BCO/forwarder). [portpro.io/features], [PortPro glossary](https://portpro.io/all-resources/glossary-of-commonly-used-(and-some-not)-drayage-industry-terms), [BusinessWire drayOS Track](https://www.businesswire.com/news/home/20230301005172/en/PortPro-Launches-drayOS-Track-for-Drayage-Carriers-Freight-Forwarders-and-Beneficial-Cargo-Owners)
- **FACT**: integra QuickBooks Online; integrazione via API con clienti ("EDI di nuova generazione"), lettura/trascrizione automatica di ordini da spreadsheet/PDF. [porttms.com EDI & API](https://porttms.com/edi-api-integrations), [portpro.io blog implementazione TMS]

### Punti di forza (da recensioni)
- **FACT** (G2, 4.7/5 su 55 recensioni): interfaccia intuitiva, customer support molto reattivo ("second to none"), centralizzazione tracking+fatturazione. [G2](https://www.g2.com/products/portpro/reviews)
- **FACT**: automazione appuntamenti terminal e aggiornamento automatico location di reso container/empty-return citati come time-saver concreti (case study Best Dray US). [PortPro case study](https://portpro.io/all-resources/case-studies/best-dray-us)

### Punti deboli / lamentele ricorrenti
- **FACT** (G2 pros-and-cons): "the platform is clearly designed around single-terminal motor carriers and adapted for multi-terminal ones... falls short on some basic logic, allowing for multiplication of same equipment, data upload only usable for creating data but not for updating data". [G2](https://www.g2.com/products/portpro/reviews?qs=pros-and-cons)
- **FACT**: training limitato ("only 2 times per week, very short"); alcuni utenti trovano il tier con AI "un po' caro"; driver pay a volte inconsistente; mass upload/CSV order entry lento, un ordine alla volta; mass download richiede export Excel, non sempre disponibile in ogni schermata; richiesta di un AP process più robusto. [G2], [SoftwareFinder review]

### Integrazioni
- **FACT**: QuickBooks Online; API custom con clienti/ERP/WMS; automazione dati da terminal websites (13 data point, booking appuntamenti). [porttms.com], [portpro.io]
- **UNKNOWN**: elenco pubblico completo di ELD integrati (nessuna fonte specifica trovata, a differenza di Rose Rocket che dichiara "100+ ELD").
- **HYPOTHESIS**: essendo USA-centrico, l'integrazione EDI è probabilmente pensata per motor carrier US (204/210/214 EDI standard), non per formati europei.

### Funzionalità AI reali (non marketing)
- **FACT**: "AI Agents" lanciati 2025, integrati in chat dentro il TMS: rispondono a domande operative, estraggono insight in tempo reale, automatizzano task ripetitivi (aggiornamento spreadsheet, controllo documenti, invio update di load), agentic AI che concatena più step per completare interi workflow, disponibili 24/7. [GlobeNewswire](https://www.globenewswire.com/news-release/2025/05/13/3080145/0/en/AI-Meets-Drayage-PortPro-Launches-AI-Agents-at-a-Critical-Moment-for-the-Industry.html), [portpro.io/ai]
- **HYPOTHESIS**: al netto del marketing, la parte più concreta e verificabile è "AI-driven load creation" e i data-point pull dai terminal (citati anche da utenti reali in recensioni), mentre gli "agentic workflow" più ambiziosi sono descritti soprattutto in comunicati stampa/blog aziendali e meno confermati da recensioni indipendenti.

### Perché i clienti comprano
- **FACT** (case study Best Dray US): team PortPro proviene dal settore drayage e "capisce le sfide del settore"; risparmio di tempo su appuntamenti terminal, riduzione errori umani, riduzione costi di demurrage grazie a cutoff dates nel sistema. [Case study]
- **FACT**: un cliente ha valutato 15 provider diversi prima di scegliere PortPro, motivando con "il miglior TMS sul mercato" per operazioni di scala (250-300 spedizioni/settimana). [Case study]

### Perché i clienti abbandonano / non convertono (segnali)
- **HYPOTHESIS** (dedotta dalle lamentele G2): operatori multi-terminal più grandi sembrano trovare il prodotto meno maturo per la loro complessità operativa — possibile causa di abbandono o mancata conversione per flotte grandi/multi-sede.
- **UNKNOWN**: non trovati dati pubblici su tasso di churn o testimonianze esplicite di abbandono.

### Cosa Movr NON dovrebbe copiare (specifico USA)
- **FACT/HYPOTHESIS**: l'intera logica "gray pool"/chassis pool USA-style (chassis noleggiati da pool separati dai container, con relativa gestione del per-diem chassis) è un artefatto della struttura USA del trasporto container (chassis spesso non di proprietà del vettore, gestiti da pool come TRAC/DCLI). In Europa il chassis è tipicamente di proprietà o a noleggio diretto, spesso del container stesso (specialmente in Italia con motrici+rimorchio o cavallo+semirimorchio); questa architettura dati non si trasferisce 1:1.
- **HYPOTHESIS**: l'integrazione EDI/API con "terminal websites" USA e il modello di appuntamento è specifico dei terminal operator USA (APM, TraPac, ecc.) — in Italia i terminal (PSA, Contship/LSCT, Spinelli) e soprattutto il Port Community System regionale (vedi sezione Italia) impongono un'integrazione diversa e centralizzata a livello di Autorità di Sistema Portuale, non punto-a-punto per singolo carrier.
- **HYPOTHESIS**: non copiare la dipendenza implicita da FMCSA/ELD USA (vedi sintesi generale sotto).

### Nota rilevante
- **FACT**: PortPro si è già espansa in Europa offrendo il software a operatori drayage a **Rotterdam, Paesi Bassi** (oltre a USA/Canada). Questo significa che PortPro è già un potenziale entrante diretto in Europa, non solo un riferimento USA da studiare a distanza. [Digital Commerce 360](https://www.digitalcommerce360.com/2023/10/05/roadex-portpro/)

---

## 2. Qargo

### Nota preliminare importante
- **FACT**: Qargo **non è un player USA-centrico**: è una startup belga (Gent), fondata nel 2020, con mercato principale nel **Regno Unito**, e presenza in Belgio, Paesi Bassi, Irlanda, Francia. [EU-Startups](https://www.eu-startups.com/2025/12/belgian-tms-startup-qargo-secures-e28-million-to-scale-operations-and-product-development/), [Tech.eu](https://tech.eu/2025/12/11/qargo-expands-ai-driven-transport-management-with-33m-series-b/)
- **FACT**: Qargo non è drayage-specifico ma un **TMS generalista** per carrier, freight forwarder e 3PL (pallet network operators, container transport è solo una delle verticali servite, non il core). [qargo.com/solutions/carriers], [qargo.com/transport-services/container-transport/]
- Questo significa che Qargo è più un concorrente potenziale sul mercato TMS europeo generalista che uno specialista drayage comparabile a PortPro/TruckerZoom.

### Target cliente
- **FACT**: carrier, freight forwarder, 3PL, pallet network operator — quindi PMI/medie aziende di trasporto europee multi-modali, non solo container. [qargo.com]
- **UNKNOWN**: dimensione tipica cliente (numero di camion) non specificata pubblicamente.

### Pricing
- **FACT**: pricing "basato sul fatturato trasporto (transport revenue), non sul numero di utenti, depositi o veicoli" — modello a consumo/fatturato, non per-seat. Utenti illimitati inclusi. [qargo.com/platform/pricing/]
- **UNKNOWN**: fasce di prezzo/percentuali esatte non pubblicate.

### Scope prodotto
- **FACT**: TMS con moduli per carrier/fleet management, freight forwarder, pallet network operator, container transport; "Qargo Intelligence" (AI) per creazione ordini, route planning, ottimizzazione carichi, fatturazione, prenotazione slot magazzino. [qargo.com/platform/qargo-intelligence/]

### Punti di forza / debolezza
- **FACT**: nessuna recensione indipendente trovata su G2 o Capterra (ricerca esplicita fallita — pagine non presenti o non indicizzate). Le uniche fonti disponibili sono testimonianze pubblicate dal vendor stesso (es. cliente "Nolize", "Van 't Kruis") e FeaturedCustomers.com (35 recensioni/27 case study, ma piattaforma di marketing, non review indipendente). [qargo.com/post/nolize-chooses-qargo-as-their-tms/], [FeaturedCustomers]
- **UNKNOWN**: punti deboli/lamentele ricorrenti — non trovato in ricerca pubblica indipendente. Questo è di per sé un segnale: mancanza di third-party review a differenza di PortPro/Rose Rocket suggerisce o azienda troppo giovane per accumulare recensioni verificate, o bassa penetrazione USA (dove vivono G2/Capterra).

### Integrazioni
- **FACT**: pagina dedicata "How Qargo makes integrations simple" esiste ma il contenuto dettagliato (quali ELD/EDI/port system) non è emerso nei risultati di ricerca. **UNKNOWN** l'elenco preciso.

### AI reale
- **FACT**: "Qargo Intelligence (Qi)" — legge email/PDF dei clienti e compila automaticamente i dettagli ordine; estrae dati da foto/PDF/scan (container ID, seal number, riferimenti) via app driver mobile; controlla POD/documenti/firme/tariffe/supplementi e genera fatture fornitore automaticamente. Claim aziendale: fino al 75% di riduzione tempo su task amministrativi ripetitivi. [qargo.com/us/post/ai-powered-tms-automation/], [Tech.eu]
- **HYPOTHESIS**: queste funzioni (OCR + auto-fatturazione + auto order-entry da email) sono concettualmente le più trasferibili e rilevanti per Movr, perché risolvono un problema reale e verificabile (data entry manuale) più che marketing puro — ma restano claim aziendali non confermati da recensioni terze indipendenti.

### Perché comprano / abbandonano
- **FACT** (testimonial vendor-side): un cliente descrive la scelta come unanime dopo demo comparative multiple ("da tutti i livelli dell'operazione: unanimamente Qargo al primo posto"). [qargo.com testimonial]
- **UNKNOWN**: motivi di abbandono/non conversione — nessun dato pubblico indipendente trovato.

### Rilevanza per Movr
- **HYPOTHESIS**: Qargo è il comparable più vicino a Movr in termini geografici (Europa, PMI trasporto) e di modello (TMS generalista con AI-assisted back office), ma non è focalizzato su drayage/container come specializzazione verticale — è uno spazio adiacente, non direttamente sovrapposto. Il fatto che abbia appena raccolto **€28M Series B** (dicembre 2025, guidato da Sofina, con Balderton Capital) conferma che il mercato TMS europeo con AI sta ricevendo capitale serio: segnale di validazione di mercato per Movr, ma anche di un concorrente ben finanziato che potrebbe espandersi in verticali adiacenti (incluso drayage) se non lo fa già.

---

## 3. TruckerZoom

### Target cliente
- **FACT**: si definisce "the first fully featured TMS purpose built for the intermodal drayage trucking industry", con "legacy di 15 anni" (claim aziendale). [truckerzoom.com]
- **FACT**: posizionato per "large drayage trucking companies" con dispatch avanzato per operazioni multi-location ad alto volume. [Capterra/GetApp summary]
- **UNKNOWN**: sede esatta, anno di fondazione effettivo, numero di clienti — non ho trovato dati aziendali/press verificabili indipendenti (nessun risultato Crunchbase/notizie di settore emerso nelle ricerche). Il claim "15 anni di legacy" è marketing del vendor, non verificato da fonte terza.

### Pricing
- **FACT**: nessun tier per add-on/feature separati dichiarati dal vendor ("no add-on tiers, no per-feature pricing, no bolt-ons"); trial 30 giorni senza carta; per chi cambia provider, uso gratuito fino a fine contratto col vecchio TMS. [truckerzoom.com/subscription-plan]
- **UNKNOWN**: fascia di prezzo effettiva — richiede "personalized pricing breakdown", nessuna cifra pubblica trovata.

### Scope prodotto
- **FACT**: dispatch automatizzato (pre-pull dinamici, generazione istantanea di rotte), sistema tariffario drayage multi-lato, mobile app con AI document scanner, yard management con emissione J1, driver hiring & compliance, marketplace/loadboard drayage, quote engine e tracking lato cliente, pagamento driver per miglio/ora/percentuale ricavo. [truckerzoom.com features]

### Punti di forza / debolezza
- **FACT** (Capterra, 10 recensioni — campione molto piccolo): valutazione complessiva positiva; punti di forza citati: facilità tracking qualifiche/compliance driver, affidabilità, organizzazione. [Capterra summary via search]
- **UNKNOWN**: lamentele specifiche — la ricerca non ha restituito contenuti negativi dettagliati (probabile combinazione di campione recensioni molto piccolo, 10 review, e possibile scarsa indicizzazione). Da trattare con cautela: assenza di lamentele reperite ≠ prodotto senza difetti, significa solo dati insufficienti.

### Integrazioni
- **UNKNOWN**: nessun elenco pubblico di integrazioni ELD/EDI/port system trovato nei risultati di ricerca, a differenza di PortPro e Rose Rocket.

### AI reale
- **FACT** (claim vendor): "AI-powered delivery order intake", "Open AI Order", mobile app con "AI scanner" per documenti. [truckerzoom.com/why-us], [GetApp summary]
- **HYPOTHESIS**: funzionalmente simile all'OCR/auto-order-entry di Qargo e PortPro — sembra essere diventato uno standard di categoria (auto-lettura documenti/ordini via AI) più che un differenziatore unico.

### Perché comprano / abbandonano
- **UNKNOWN**: nessuna testimonianza dettagliata o segnale di abbandono trovato in ricerca pubblica indipendente.

### Rilevanza per Movr
- **HYPOTHESIS**: TruckerZoom sembra un competitor diretto di PortPro nello stesso segmento (drayage USA, carrier medio-grandi), ma con presenza pubblica/mediatica molto più debole (assenza quasi totale da stampa di settore, Crunchbase, G2) — probabile azienda più piccola o meno finanziata. Non offre elementi di apprendimento distintivi rispetto a PortPro sulla base delle fonti trovate.

---

## 4. Rose Rocket

### Nota preliminare
- **FACT**: Rose Rocket è un TMS generalista nordamericano (Canada/USA) per **freight broker, 3PL, carrier LTL/FTL/hybrid, dedicated fleet** — con supporto dichiarato anche per drayage/intermodale, ma **non è uno specialista drayage**. Ha un gap esplicito: **"no native chassis + container number tracking"**, per cui le operazioni drayage-intensive richiedono workaround. [BestCarrierTMS](https://bestcarriertms.com/intermodal.php), [rfp.wiki]

### Target cliente
- **FACT**: freight broker, 3PL, shipper, vettori LTL/FTL, hybrid carrier, dedicated fleet; da piccole flotte a grandi imprese. [roserocket.com/personas-pages/truckload-carriers], CanvasBusinessModel target market summary

### Pricing
- **FACT**: pricing a partire da **$233/mese** (dato G2), modello **per-load** (pricing scala col volume di spedizioni, non fisso per truck/utente). [G2 pricing page](https://g2.com/products/rose-rocket/pricing)
- **FACT** (recensione Capterra): un cliente ha rifiutato di sottoscrivere perché il preventivo per-load risultava "quasi il doppio" rispetto a piattaforme concorrenti a parità di volume — segnale concreto di rischio prezzo a scala.

### Scope prodotto
- **FACT**: gestione multimodale (strada, rotaia, mare, aria, drayage, intermodale) con compliance/documentazione cross-border; visibilità su disponibilità container a porto/rotaia e sdoganamento, notifiche su cambi di stato container per prevenire demurrage. [roserocket.com/builders-use-cases/drayage]
- **FACT**: integrazioni AP con QuickBooks Online e Desktop (per tier), oltre 100 ELD supportati, web services/API per integrazioni custom. [help.roserocket.com/platform/eld-integration-overview]

### Punti di forza (recensioni)
- **FACT** (G2 4.8/5 su 15 review; Capterra 4.4/5 su 33-34 review): interfaccia intuitiva, moderna, supporto clienti reattivo, buon rapporto qualità/prezzo per funzionalità core, automazione bulk-load apprezzata, bug risolti rapidamente dal team. [G2](https://www.g2.com/compare/mercurygate-tms-vs-rose-rocket), [Capterra](https://www.capterra.com/p/153047/Rose-Rocket/reviews/)

### Punti deboli / lamentele ricorrenti
- **FACT**: sync QuickBooks problematico, workflow "click-heavy", sorprese sul pricing per-load, EDI "meno robusto di alcuni competitor completi", integrazioni percepite come "slow progress" da alcuni utenti, reporting poco flessibile. [Capterra reviews], [rfp.wiki]
- **FACT**: gap nativo su tracking chassis+container — rilevante proprio per drayage-heavy operator (workaround necessari). [BestCarrierTMS intermodal review]

### Integrazioni
- **FACT**: 100+ ELD, QuickBooks Online/Desktop, API/web services. [help.roserocket.com]
- **UNKNOWN**: integrazioni dirette con port community system o EDI CBP/AMS — non confermate in ricerca pubblica.

### Funzionalità AI reali
- **FACT**: lancio 2025 di **"TMS.ai"**, con tre "AI agent" nominati e disponibili su ogni piano: **TED** (assistente email 24/7 che trasforma email/richieste online in ordini, aggiorna ordini su follow-up, sincronizza documenti), **Rosie** (lavora dentro le spedizioni, fornisce aggiornamenti/insight sul load), **Rocky** (assistente onboarding no-code che configura il sistema e suggerisce ottimizzazioni). [Silicon UK](https://www.silicon.co.uk/press-release/rose-rocket-launches-tms-ai-ushering-in-the-ai-native-era-of-transportation-management), [roserocket.com/blog/introducing-tms-ai]
- **HYPOTHESIS**: TED (email→ordine) è concettualmente la funzione più concreta e replicabile per Movr — stesso pattern osservato in Qargo e PortPro (auto-order-entry da comunicazioni non strutturate sembra essere il "must have" AI di categoria nel 2025-2026, non un unicum).

### Perché comprano / abbandonano
- **HYPOTHESIS**: comprano per interfaccia moderna vs. TMS legacy (McLeod, MercuryGate) e per flessibilità multimodale; abbandonano/non convertono per il rischio di pricing per-load imprevedibile a volumi alti e per gap su funzionalità drayage-specifiche (chassis tracking).

### Cosa NON copiare (USA-specifico)
- **HYPOTHESIS**: il modello di pricing per-load, se applicato senza adattamento, è rischioso in un mercato come quello italiano dove i margini per singola tratta drayage sono spesso più bassi e la sensibilità al costo IT è alta — un pricing imprevedibile a scala sarebbe un forte disincentivo all'adozione da parte di PMI liguri.

---

## 5. Raft (Raft.ai, ex Vector.ai)

### Nota preliminare — mismatch importante rispetto al brief
- **FACT**: Raft **non è un software di trucking/drayage**. È una piattaforma AI per **freight forwarder e customs broker** (spedizionieri doganali/agenti marittimi-aerei), fondata nel 2017 come **Vector.ai**, con sede nel **Regno Unito** (non USA-centrica in senso stretto, anche se opera globalmente). [PYMNTS](https://www.pymnts.com/supply-chain/2023/logistics-platform-raft-raises-30-million-to-enhance-automation-products/), [Crunchbase (org "vector-ai")](https://www.crunchbase.com/organization/vector-ai), [BusinessCloud UK](https://businesscloud.co.uk/news/intelligent-logistics-platform-raft-raises-23m/)
- Questo è un finding importante: **Raft non compete direttamente con Movr sul segmento drayage/trucking**. È più un riferimento di prodotto AI-automation per un layer diverso della supply chain (forwarding/customs), utile solo concettualmente (pattern di automazione documentale/AI agent), non come competitor diretto.

### Target cliente
- **FACT**: 60+ freight forwarder in 30+ paesi, incluso il 40% della "Top 25 Global Freight Forwarders List" di Armstrong & Associates; oltre 10.000 utenti, 5+ milioni di spedizioni/anno gestite sulla piattaforma. [raft.ai], [PYMNTS]

### Pricing
- **UNKNOWN**: nessun dato pubblico su pricing (né fasce né modello) trovato in ricerca.

### Scope prodotto
- **FACT**: automazione dell'intero ciclo di vita della spedizione per forwarder/customs broker — quoting, booking, documentazione, sdoganamento; "control plane" che consolida email, record TMS, aggiornamenti carrier, comunicazioni interne in un record operativo unico; sync bidirezionale con TMS/ERP/autorità doganali/reti carrier. [raft.ai/platform], [raft.ai/solutions/customs]
- **FACT**: automatizza l'esecuzione di oltre 300.000 spedizioni/mese, dichiara di far risparmiare fino a 2 ore per spedizione, processa automaticamente il 75% delle fatture. [Air Cargo Week](https://aircargoweek.com/raft-raises-30m-to-transform-global-supply-chain-execution-with-ai/)

### Punti di forza / debolezza
- **UNKNOWN**: nessuna recensione G2/Capterra indipendente reperita (ricerca esplicita senza risultati utili). Le uniche fonti sono comunicati stampa aziendali e citazioni di clienti pubblicate dal vendor stesso (es. Navia Freight). Da trattare con cautela: mancanza di validazione indipendente.

### Integrazioni
- **FACT**: dichiarato "deep TMS integrations" e sync con ERP/autorità doganali/reti carrier (claim generico, non un elenco verificabile di sistemi specifici). [raft.ai]

### Funzionalità AI reali
- **FACT**: estrazione automatica di campi critici da fatture commerciali, packing list, bill of lading, certificati di origine; agenti AI per arricchimento dati ed eccezioni in tempo reale su pratiche doganali; validazione/matching automatico fatture. [raft.ai/solutions/customs]
- **HYPOTHESIS**: rispetto a PortPro/Qargo/Rose Rocket, Raft sembra il player più maturo/investito sull'AI documentale profonda (extraction + validation su documenti doganali complessi) perché il suo mercato (customs/forwarding) è strutturalmente più documento-intensivo del drayage puro. Concettualmente rilevante per Movr solo se Movr vuole coprire anche il layer doganale/documentale (es. dichiarazioni, bolle, CMR) oltre al puro dispatch/trucking.

### Perché comprano / Cosa NON copiare
- **FACT** (funding, $30M Series B guidato da Eight Roads con Bessemer, Episode 1, Dynamo Ventures): il mercato scommette sull'AI per ridurre il lavoro manuale documentale nel forwarding globale. [PYMNTS]
- **HYPOTHESIS**: non applicabile direttamente a Movr come benchmark di prodotto trucking; utile solo come riferimento di execution AI-per-documenti, non come mappa di funzionalità da copiare 1:1 (il dominio doganale USA/globale di Raft — es. CBP, AMS — non è il dominio di un TMS drayage locale).

---

## Sintesi: cosa copiare concettualmente da PortPro (e dal gruppo USA) vs. cosa è specifico USA e non funziona in Italia

### Cosa copiare concettualmente (pattern validati, indipendenti dalla geografia)
1. **Automazione booking/appuntamento terminal** — l'idea di eliminare il lavoro manuale di prenotazione slot terminal è validata da PortPro (dati diretti da terminal website, booking automatico) ed è un problema **reale anche in Liguria** (vedi PCSO Genova, EVA app, TEOnline La Spezia — sistemi che già digitalizzano l'accesso ma richiedono comunque interazione manuale/monitoraggio da parte del vettore). **FACT** che il problema esiste in Italia: TrasportoEuropa, ANSA, ShippingItaly confermano investimenti in gate automatizzati e PCS a Genova/La Spezia.
2. **Auto-order-entry da comunicazioni non strutturate (email/PDF → ordine)** — pattern comune a PortPro, Qargo, Rose Rocket (TED), TruckerZoom: è diventato lo standard "AI" di categoria nel 2025-2026. Alto valore, basso rischio, facilmente trasferibile.
3. **Visibilità cliente self-service (customer portal)** — tracking spedizione/container, POD, fatture, per evitare telefonate/email di follow-up — validato trasversalmente.
4. **Prevenzione demurrage/per-diem tramite notifiche su cutoff/scadenze** — concetto universale (i costi di stallo container esistono ovunque), solo le regole di calcolo (free time, tariffe) vanno localizzate.
5. **Customer support/onboarding come differenziatore competitivo percepito** — ricorrente in tutte le recensioni positive PortPro/Rose Rocket: per un mercato PMI-conservatore come quello ligure, il supporto umano diretto pesa quanto il prodotto.

### Cosa è specifico USA e NON va copiato (o va profondamente riadattato)
1. **Chassis pool USA-style (gray pool, chassis separati dal container, gestiti da pool terzi tipo TRAC/DCLI)** — non è la norma in Italia/Europa, dove il trasporto container spesso avviene con motrice+semirimorchio portacontainer di proprietà o a noleggio diretto del vettore. Costruire un data model centrato sul chassis pooling USA sarebbe over-engineering inutile per il mercato ligure.
2. **Dipendenza da ELD/FMCSA** — l'intero ecosistema USA (100+ integrazioni ELD, compliance FMCSA, hours-of-service USA) non ha equivalente diretto in Italia: qui la normativa di riferimento è il **tachigrafo digitale UE** e le regole UE su tempi di guida/riposo — sistema tecnico e regolatorio completamente diverso. Un TMS che "eredita" architetture ELD-centriche USA rischia di costruire integrazioni inutili.
3. **EDI con sistemi doganali USA (CBP, AMS/ACE)** — irrilevante per operazioni Italia/UE, dove serve invece integrazione con **Port Community System regionali** (es. PCSO di Genova gestito da Liguria Digitale, con ~6.000 utenti registrati e ~20 milioni di messaggi/anno) e con sistemi doganali UE (AIDA/Dogana italiana, sistemi doganali UE armonizzati). L'architettura di integrazione corretta per Movr è verso il **PCS regionale/portuale**, non verso un equivalente EDI "alla americana".
4. **Pricing per-load imprevedibile a scala (Rose Rocket)** — rischioso per PMI italiane più sensibili al costo prevedibile mensile; meglio un modello a fascia fissa o graduale come quello di Qargo (per fatturato) piuttosto che per singola tratta.
5. **Assunzione di un mercato altamente frammentato e "self-serve" (trial 30 giorni senza carta, TruckerZoom)** — il mercato ligure/italiano di autotrasporto container è relazionale, spesso guidato da passaparola e fiducia personale nel fornitore; un go-to-market puramente PLG/self-serve è probabilmente meno efficace del modello "high-touch sales + onboarding assistito" che PortPro stesso usa (nonostante sia USA) e che le recensioni premiano.

---

## Wedge disponibile per Movr

**HYPOTHESIS** (sintesi finale, dedotta dai findings sopra — nessun player ha dimostrato di occupare pienamente questo spazio):

1. **Nessuno specialista drayage/container-trucking europeo è emerso in ricerca pubblica.** I gestionali italiani trovati (Dylog OpenTruck, Finson Progetto Autotrasporti, SAT, CargoNet, iMove Next, Elfe Informatica, Swifty, Space Computer, Zucchetti) sono **generalisti per autotrasporto/logistica**, non specializzati su drayage container/porto. Nessuna fonte pubblica ha confermato "Melillo" o "Docsis" come prodotti esistenti per questo settore (ricerca esplicita senza risultati — trattare come **non trovato in ricerca pubblica**, non come "non esistono"). eLogia non è emerso in ricerca. Questo lascia una **nicchia verticale scoperta**: TMS pensato specificamente per il flusso container-porto-terminal-cliente in Italia/Liguria.
2. **Il vero concorrente strutturale in Italia non è un altro software, ma il Port Community System regionale (PCSO Genova/Savona, TEOnline La Spezia) più processi manuali/Excel/telefonate.** Il wedge di Movr è posizionarsi come layer applicativo **sopra** questi PCS (integrazione, non sostituzione), offrendo ai vettori ciò che i PCS non fanno: dispatch, fatturazione, gestione flotta/driver, P&L per viaggio, comunicazione col cliente finale — esattamente come PortPro fa rispetto ai terminal USA.
3. **PortPro si è già mosso su Rotterdam** (Europa) — segnale che i player USA vedono l'Europa come prossima frontiera. Questo restringe la finestra temporale per Movr: il wedge non è "nessuno ci ha pensato", ma "nessuno lo ha ancora fatto **in italiano, con supporto locale e integrato ai PCS regionali (Genova/La Spezia)**", il che è difendibile solo con esecuzione rapida e relazioni dirette con Autorità di Sistema Portuale/terminal locali — un vantaggio che un entrante USA non replica facilmente a breve termine.
4. **Qargo dimostra che il capitale per un TMS europeo AI-native esiste** (€28M Series B) ma il suo focus è generalista/multimodale (UK-centrico), non drayage/porto: lascia scoperto lo spazio verticale specifico "container + porto + drayage" in continente, specialmente nel Mediterraneo/Sud Europa dove Qargo non risulta presente (mercati dichiarati: UK, Belgio, NL, Irlanda, Francia — non Italia).
5. **Il pattern AI più difendibile e a basso rischio da costruire subito** è l'auto-order-entry da email/PDF + estrazione dati documentali (bolla, CMR, packing list) — validato come "must have" trasversale a tutti i player osservati, e particolarmente utile in un mercato come quello italiano storicamente cartaceo/email-based.

### Affermazioni deboli o non verificate (da segnalare esplicitamente)
- Esistenza di "Melillo" e "Docsis" come gestionali italiani per autotrasporto container: **non confermata in ricerca pubblica** (potrebbero esistere ma non indicizzati, essere nomi errati, o non esistere affatto).
- Pricing esatto di PortPro, TruckerZoom, Raft, dettagli fascia Qargo: **UNKNOWN**, nessuna cifra pubblica verificabile.
- Tassi di churn/abbandono per tutti e 5 i player: **nessun dato pubblico quantitativo trovato** per nessuno dei cinque; le "ragioni di abbandono" riportate sopra sono per lo più HYPOTHESIS dedotte da lamentele nelle recensioni, non conferme dirette di churn.
- Copertura reale delle recensioni G2/Capterra per Qargo, TruckerZoom, Raft: campioni molto piccoli o assenti — le conclusioni su questi tre player sono strutturalmente più deboli di quelle su PortPro e Rose Rocket, che hanno campioni di recensioni più ampi e verificabili.

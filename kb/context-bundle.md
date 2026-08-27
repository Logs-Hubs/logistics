# Movr — knowledge base completa (bundle per LLM esterni)

Questo file è la concatenazione di tutta la knowledge base del progetto Movr, generata per essere incollata o allegata comodamente in una conversazione con un altro LLM (ChatGPT, Gemini, ecc.) quando serve dargli contesto completo e aggiornato in un colpo solo.

**Fonte di verità**: repo GitHub `lasagnealpesto/logistic`, cartella `kb/`. Questo file viene rigenerato (non modificato a mano) ogni volta che qualcosa di sostanziale cambia in uno dei documenti sorgente — se lo stai leggendo, verifica la data in fondo per sapere quanto è fresco.

---

<!-- fonte: kb/todo.md -->

# To-do Movr

Fonte unica per la lista di cose da fare. La tengo aggiornata io direttamente (Edit tool, non serve chiedermelo ogni volta) man mano che completiamo cose o ne emergono di nuove, e la uso per proporre proattivamente i prossimi passi quando ha senso nel contesto.

## Clienti / outreach

- [ ] Contattare le 4 aziende a priorità alta: Lena Spedizioni, Ambra Mar, GDT Logistic, Spedimar
- [ ] Primo contatto Spediservices (apre la rete verso Spediporto)
- [ ] Verificare su LinkedIn le aziende "da confermare" del secondo giro (dimensione, attività recente)
- [ ] Modulo Flotte: verificare le 9 aziende "da confermare" in `aziende-autotrasporto-nazionale.md` (regione, dipendenti, LinkedIn/sito)
- [ ] Modulo Flotte: espandere la ricerca aziende a Nord-Ovest (Piemonte, Liguria) e Nord-Est (Trentino, Friuli), oggi coperti solo da operatori multi-regione

## Tecnico / deploy

- [ ] Verificare che il deploy `logistic-site` su Vercel mostri il rebrand Movr (in corso, controllare tab Deployments)
- [ ] Sostituire l'email placeholder `ciao@movr.app` con una vera
- [ ] Verificare disponibilità del dominio `movr.app` (o altro TLD)
- [ ] Aggiungere `DRIVER_API_KEY` su Vercel (progetto piattaforma) per abilitare le route `/api/driver/*`
- [ ] Setup Xcode Cloud sul progetto MovrDriver (repo GitHub dedicato + workflow con post-action TestFlight) per automatizzare build/upload futuri
- [ ] Invitare più tester al gruppo TestFlight oltre al primo

## Prodotto / decisioni

- [ ] Ricerca competitor (vedi `03-competitor/da-mappare.md`): prossimo passo prima di investire di più sul modulo Flotte
- [ ] Decidere il destino del modulo Flotte (AI Transport Manager): secondo prodotto, pivot, o esperimento da chiudere
- [ ] Validare il modulo Dogana (Customs Brain) con un design partner reale: oggi è tutto mock, serve un caso vero (o quasi) per capire se il flusso di readiness/validazione regge
- [ ] Decidere se/quando riprendere la roadmap AI Operations Layer oltre le fasi 1-3 (vedi `01-prodotto/roadmap-ai-operations-layer.md`) — fasi 4-6 richiedono integrazioni reali (email, storico dati) non ancora disponibili

## Idee da scoping-are (non ancora iniziate)

- [ ] Gestione appuntamenti via audio WhatsApp: definire il caso d'uso preciso (dispacciatore o autista?) prima di costruirla
- [ ] Feature aggiuntive calendario: creazione spedizione al volo dallo slot, riprogrammazione appuntamenti, vista filtrata per vettore, prenotazione ricorrente

## Fatto di recente

- [x] Modulo Dogana (Customs Brain): terzo modulo Movr, intake documenti simulato, casi doganali agganciati alle spedizioni reali, readiness score, classificazione HS con approvazione umana
- [x] Exception Center: pannello "Attenzione oggi" sulla dashboard Porti, correla blocchi doganali + demurrage + appuntamenti non pianificati in un'unica lista prioritizzata
- [x] Rebrand da Clyo a Movr, ovunque (piattaforma, sito, KB, app iOS)
- [x] Modulo Flotte (AI Transport Manager): vertical slice funzionante con motore deterministico
- [x] Knowledge base creata (repo + mirror Drive ristretto a mercato/competitor/clienti)
- [x] Annullamento appuntamenti + alert demurrage nel calendario piattaforma
- [x] To-do spostata dal mirror Drive (link che si rompeva ad ogni modifica) a qui nel repo
- [x] Prima lista aziende autotrasporto nazionale per il modulo Flotte (3 verificate, 9 da confermare)
- [x] App driver iOS compilata e pubblicata su TestFlight (Internal Testing), installata e testata su dispositivo reale

---

<!-- fonte: kb/01-prodotto/movr-porti-spedizionieri-doganali.md -->

# Movr Porti — piattaforma per spedizionieri doganali (Genova)

## Cos'è

Piattaforma di coordinamento portuale per spedizionieri doganali genovesi. Mette in un'unica vista: appuntamenti multi-terminal, tracking del mezzo (ritiro container pieno / rientro vuoto) e comunicazione con i vettori terzi, al posto di telefono, email, WhatsApp e le piattaforme di prenotazione separate di ogni terminal.

## Il problema che risolve

Il Port Community System (PCS) di Genova ha "coni d'ombra": traccia la merce, non il mezzo. In particolare:
- Ogni terminal (Genova Porto Vecchio, PSA Prà, Savona-Vado) ha il proprio sistema di appuntamenti, orari e logica
- Il rientro del container vuoto dopo la consegna non è tracciato da nessun sistema, gestito a telefono, con rischio concreto di detention
- Lo spedizioniere non ha flotta propria: coordina vettori terzi via telefonate, senza vista d'insieme su cosa succede oggi

## ICP (Ideal Customer Profile)

Spedizioniere doganale genovese, 5-30 dipendenti, gestisce import/export container su Genova/Savona-Vado, lavora con vettori terzi (non ha flotta propria), idealmente associato Spediporto.

## Cosa fa oggi la piattaforma (stato reale)

- Dashboard con colpo d'occhio su spedizioni attive, da pianificare, in scadenza (con alert demurrage)
- Pannello "Attenzione oggi" (Exception Center) in cima alla dashboard: correla blocchi doganali, appuntamenti non pianificati e demurrage in un'unica lista prioritizzata
- Calendario multi-terminal con prenotazione, modifica e annullamento appuntamenti
- Timeline di tracking per spedizione: arrivo nave → scarico → sdoganamento → appuntamento gate → ritiro → consegna → rientro vuoto
- Vista "cosa vede l'autista" in tempo reale, con notifiche push simulate e azioni (segnala ritiro, segnala rientro vuoto)
- Backend reale su Supabase (Postgres), non più dati mock: persistenza vera, aggiornamenti ottimistici in UI
- API dedicate (`/api/driver/*`) pensate per una futura app iOS nativa per l'autista (scaffold Swift già scritto, pubblicato su TestFlight)
- Modulo **Dogana / Customs Brain** (`/customs`): trasforma documenti disordinati (fatture, packing list, bill of lading, certificati) in un caso doganale strutturato e validato, agganciato alla spedizione reale — vedi `01-prodotto/roadmap-ai-operations-layer.md`

Vedi `05-stato-tecnico/` per i dettagli implementativi e cosa manca.

## Strategia go-to-market

**Fase 1 (0-6 mesi):** design partner gratuiti (3-4 aziende) in cambio di feedback settimanale strutturato. Wedge stretto: slot booking + notifiche, NON integrazione reale col PCS (troppo lenta/dipendente da terzi in questa fase).

**Fase 2 (6-18 mesi):** referral via Spediporto/Federlogistica Liguria, dialogo formale con AdSP/Liguria Digitale.

**Fase 3 (18-36 mesi):** replica su La Spezia, Livorno, Trieste, poi eventualmente un porto estero (Barcellona/Valencia).

## Deliberatamente fuori perimetro (per ora)

- Integrazione reale con le API del PCS di Liguria Digitale
- Integrazione reale con i sistemi proprietari dei singoli terminal
- Autenticazione multi-tenant reale
- Fatturazione, pagamenti, compliance documentale reale

## Brand

Nome: **Movr** (modulo "Porti"). Sito marketing separato (deploy Vercel indipendente dalla piattaforma), palette navy/teal/accent arancione. Vedi `05-stato-tecnico/` per URL e dettagli deploy.

---

<!-- fonte: kb/01-prodotto/ai-transport-manager-autotrasportatori.md -->

# AI Transport Manager — verticale per autotrasportatori PMI

## Stato

Secondo mercato in valutazione, esplorato in parallelo al modulo Porti (ex Clyo). Non è ancora una decisione di andare avanti: è una demo tecnica costruita per vedere se il concetto regge, dentro lo stesso repo, con uno switch nella UI ("Porti" / "Flotte" / "Dogana") sotto il brand ombrello Movr.

## Cos'è (tesi di prodotto)

Un layer operativo AI-native per PMI di autotrasporto conto terzi (non spedizionieri: aziende che possiedono e gestiscono la propria flotta di camion). L'idea centrale: il software di valore non è un'altra dashboard, è un livello che decide continuamente cosa dovrebbe succedere dopo, pianifica la flotta, trova carichi di ritorno, gestisce le eccezioni, parla con gli autisti.

## ICP

- 5-100 camion, 5-150 dipendenti
- Operazioni multi-carico / multi-tappa giornaliere
- Stack attuale: Excel, email, WhatsApp, TMS legacy, software GPS/flotta, software contabile
- Pain: alta complessità operativa gestita a mano da dispacciatori/titolari

## Le 8 feature "wow" della visione (dall'handover originale)

1. **Autonomous Daily Planner** (P0) — genera il piano operativo ottimale per tutta la flotta da un import di ordini
2. **AI Dispatch Copilot** (P0) — centro comando conversazionale: "cosa devo sistemare oggi", "dove sto perdendo margine"
3. **AI Backhaul Finder** (P0) — trova carichi compatibili per i rientri a vuoto
4. **AI Exception Manager** (P0) — reagisce automaticamente a ritardi, guasti, ordini urgenti
5. **AI Operations Inbox** (P0) — trasforma email/PDF/Excel/WhatsApp non strutturati in ordini di trasporto
6. **AI Driver Agent** (P1) — assistente AI per ogni autista via app/WhatsApp/voce
7. **Automatic Trip-to-Invoice** (P1) — da viaggio completato a fattura pronta
8. **Transport Company Brain** (P2) — modello operativo dell'azienda che impara nel tempo

## Principio tecnico non negoziabile

Non lasciare mai che un LLM prenda decisioni di routing matematicamente critiche. L'AI (LLM) serve per capire informazioni non strutturate, ragionare, spiegare, orchestrare. Un motore di ottimizzazione deterministico gestisce vincoli, capacità, finestre orarie e routing. Lo stesso principio è stato poi riapplicato anche nel modulo Dogana (classificazione HS mai auto-approvata, sempre revisione umana esplicita).

## Cosa è stato costruito finora (vertical slice)

Motore di pianificazione **deterministico** (nessuna chiamata LLM reale in questa demo, coerente col principio sopra: semplicemente non c'è ancora integrazione con un vero modello): assegna ordini a mezzi rispettando capacità/ADR/frigo/ore autista, incatena le tappe per ridurre i km a vuoto. Centro comando con:
- Confronto piano manuale vs piano ottimizzato AI (km a vuoto, utilizzo mezzi, margine)
- Elenco problemi rilevati con impatto economico stimato e pulsante "Applica" che modifica davvero il piano
- AI Backhaul Finder sui rientri a vuoto (carichi spot compatibili)
- Simulatore di ritardo con ripianificazione automatica
- Pannello "chiedi all'AI" con risposte basate sui dati reali calcolati (non ancora un vero LLM collegato)

Dati demo locali (15 mezzi, ~40 ordini, città del Nord Italia), non collegato a Supabase: è pensato come demo pitchabile, non come prodotto in produzione. Vedi `05-stato-tecnico/` per i dettagli implementativi.

## MVP dichiarato (non ancora tutto costruito)

Must have: import ordini Excel/PDF, gestione flotta/autisti/clienti, pianificazione, ottimizzazione routing, AI Command Center, analisi impatto finanziario, azioni raccomandate, before/after, backhaul finder, simulazione eccezioni.

Non ancora da costruire: contabilità completa, WMS completo, marketplace complesso, integrazione tachigrafo, permessi enterprise, integrazioni GPS multiple.

## Go-to-market ipotizzato

Mercato iniziale: PMI italiane a gestione familiare, 10-50 camion. Vendita founder-led + audit operativo + pilota (importare 1-2 settimane di ordini storici e mostrare cosa l'AI avrebbe ottimizzato). Pricing ipotizzato: SaaS mensile + componente su performance.

## Domanda aperta

Questo è un mercato diverso da quello del modulo Porti (proprietari di flotta vs spedizionieri senza flotta propria). Prima di investire oltre la demo tecnica, va deciso se: (a) è un secondo prodotto parallelo, (b) sostituisce il modulo Porti, o (c) resta solo un esperimento. Va anche fatta la ricerca competitor descritta in `03-competitor/`.

---

<!-- fonte: kb/01-prodotto/roadmap-ai-operations-layer.md -->

# Roadmap — Movr come AI Operations Layer per spedizionieri

Arrivata come brief esterno ("MOVR Product Strategy and Software Upgrade Brief"), valutata e in
parte già costruita. Riassume la visione a lungo termine e distingue cosa è già reale da cosa resta
solo dichiarato per ora — non modificare questa distinzione senza aver verificato lo stato reale nel
codice.

## La tesi

Movr non è solo un tool di coordinamento portuale né un software di gestione documentale: è un
layer di intelligenza operativa sopra i sistemi logistici frammentati (email, PDF, Excel, terminal,
dogana). Loop di prodotto: **Intake → Struttura → Comprendi → Decidi → Esegui → Memoria**. La
Spedizione resta sempre l'oggetto centrale — i moduli si agganciano ad essa, non vivono isolati.

## Stato per fase

| Fase | Nome | Stato | Dove |
|---|---|---|---|
| 1 | **Customs Brain** — documenti disordinati → caso doganale strutturato | **Costruita** | `/customs`, `lib/customs/` |
| 2 | **Exception Center** — "cosa serve guardare oggi" | **Costruita**, assorbita nella dashboard Porti | `AttenzioneOggi` in `app/DashboardClient.tsx`, `lib/exceptions/` |
| 3 | **Cost Brain** — esposizione economica da demurrage/detention | **Costruita in forma minima**, assorbita nell'Exception Center | stessa dashboard: badge "€ stimati" solo su demurrage già scaduto |
| 4 | Communication Brain (email → eventi strutturati) | Non costruita | — |
| 5 | Action Agents (esecuzione automatica con permessi) | Non costruita | — |
| 6 | Predictive Operations | Non costruita | — |

Moduli aggiuntivi del brief (Shipment Memory, Carrier/Trucking Orchestration, Customer Portal) sono
strategicamente sensati ma non hanno priorità: richiedono dati o integrazioni che oggi non esistono.

## Cosa è stato effettivamente costruito (fasi 1-3)

**Customs Brain** (`lib/customs/tipi.ts`, `motore.ts`, `datiDemo.ts`, `store.tsx`, `app/customs/`):
- Terzo modulo Movr nella Sidebar (Porti / Flotte / Dogana)
- `CasoDoganale` collegato opzionalmente a una `Spedizione` reale via `spedizioneId`
- Dashboard doganale: casi raggruppati in Attenzione richiesta / In revisione / Pronte per la dogana
- Simulazione di document intake ("drop" di uno ZIP demo) con sequenza di stati di elaborazione
- Readiness score calcolato deterministicamente da problemi aperti + classificazioni HS non approvate
- Validazione: problemi con severità (bloccante/errore/attenzione/info), azione "Richiedi informazioni"
  che genera una bozza di testo (non invia nulla)
- Classificazione HS: suggerita dall'IA con confidenza, richiede approvazione esplicita dell'operatore
  (mai auto-approvata) — coerente con la regola "non far decidere all'IA cose ad alto rischio"
- Copilot contestuale al caso, risposte a template su dati reali calcolati (nessun LLM reale collegato)
- "Crea bozza dichiarazione": abilitata solo a readiness 100, dichiaratamente demo (nessuna
  integrazione reale con la dogana)

**Exception Center + Cost Brain** (`lib/exceptions/`):
- Pannello "Attenzione oggi" in cima alla dashboard Porti, prima delle stat card esistenti
- Correla in un'unica lista prioritizzata: blocchi doganali aperti (da Dogana) + appuntamento non
  pianificato + demurrage in scadenza (da Porti) — non introduce segnali nuovi, incrocia quelli già
  calcolati altrove
- Un caso doganale bloccante spiega concretamente perché una spedizione Porti è "in ritardo"
  (collegamento a monte reso visibile, non solo dichiarato)
- Esposizione economica stimata (tariffa flat/giorno) mostrata **solo** quando il demurrage è già
  scaduto — deliberatamente non proiettata su rischio futuro, per non inventare un numero
- `CustomsProvider` promosso da `app/customs/layout.tsx` (rimosso) al root `app/layout.tsx`: serve
  perché la dashboard Porti, fuori dal namespace `/customs`, possa leggere lo stato dei casi
  doganali dallo stesso Context — attenzione a non re-innestare un secondo `CustomsProvider` più in
  basso nell'albero, altrimenti dashboard e `/customs` divergono su due copie di stato

## Perché le fasi 4-6 restano ferme per ora

Customs Brain ha funzionato come demo convincente perché il "drop di un file" è un'interazione reale
anche senza backend: si può simulare in modo credibile con dati mock deterministici. Le fasi
successive non hanno lo stesso trucco disponibile:

- **Communication Brain** richiede ingestion email reale (nessun accesso IMAP/webhook in questo
  ambiente) — uno screen "email in arrivo" con dati finti sarebbe l'esatto placeholder poco
  convincente che il brief stesso chiede di evitare
- **Action Agents** presuppone un sistema di permessi e canali di esecuzione reali (invio email,
  notifiche) che non esistono ancora nemmeno per le funzioni già costruite
- **Predictive Operations** richiede dati storici reali per essere credibile, non demo con 4-7
  spedizioni

Quando si vorrà riprendere da qui: la fase più economica da aggiungere dopo non è una di queste, è
probabilmente estendere l'Exception Center con più fonti di segnale mano a mano che il modulo Flotte
o l'uso reale del prodotto generano dati veri da correlare — vedi `todo.md` per lo stato dei prossimi
passi.

---

<!-- fonte: kb/02-mercato/spedizionieri-doganali-genova.md -->

# Mercato: spedizionieri doganali e case di spedizione (Genova)

## Il mestiere in breve

Lo spedizioniere doganale (freight forwarder) organizza il trasporto merci per conto del cliente (importatore/esportatore) senza possedere la flotta: coordina vettori terzi, terminal portuali, dogana, documentazione. Il valore è nel coordinamento, non negli asset fisici.

## Dimensioni del porto di Genova (contesto 2025)

- ~3 milioni di TEU movimentati tra Genova e Savona-Vado nel 2025, record storico
- ~3.700 camion al giorno attraverso i varchi portuali di Genova
- 3 terminal principali rilevanti: Genova Porto Vecchio, PSA Prà, Savona-Vado, ognuno con sistema di appuntamenti separato
- 30+ associazioni di spedizionieri/autotrasportatori in Italia; Spediporto è quella genovese, punto di riferimento per la rete locale

## Meccanica operativa (dove nasce il problema)

1. Nave arriva, container scaricato
2. Sdoganamento
3. Appuntamento al gate del terminal per il ritiro (sistema separato per ogni terminal)
4. Vettore terzo ritira il container pieno, targa tracciata al gate
5. Consegna al cliente finale
6. Rientro del container vuoto al terminal, **oggi non tracciato da nessun sistema**, gestito a telefono, rischio di detention (penale per ritardo nella restituzione)

Il Port Community System (PCS) di Liguria Digitale traccia la merce, non il mezzo: da qui il "cono d'ombra" su tracking veicolo e rientro vuoti. Federlogistica Liguria lo segnala pubblicamente da tempo. Tempi di validità viaggio ridotti da 8 a 4 giorni e app Eva resa obbligatoria, senza che i flussi operativi fossero adeguati di conseguenza.

## Shock che il settore subisce senza visibilità

- Sciopero di ottobre 2025: varchi bloccati per giorni
- Ferragosto: servono piani straordinari
- Senza vista in tempo reale su mezzi/carichi, questi eventi si "subiscono due volte" (impatto operativo + impatto di scoperta tardiva)

## ICP per Movr (modulo Porti)

Spedizioniere doganale genovese, 5-30 dipendenti, import/export container su Genova/Savona-Vado, lavora con vettori terzi (non ha flotta propria), idealmente associato Spediporto.

## Jargon essenziale

- **TEU**: Twenty-foot Equivalent Unit, unità di misura standard per container
- **PCS**: Port Community System, il sistema informativo condiviso del porto (Liguria Digitale a Genova)
- **Demurrage**: penale per il container pieno trattenuto oltre il tempo concesso al terminal/porto
- **Detention**: penale per il container (vuoto o pieno) trattenuto oltre il tempo concesso dalla compagnia di navigazione, tipicamente dopo l'uscita dal porto
- **Groupage**: consolidamento di più spedizioni piccole in un unico carico
- **Slot/appuntamento gate**: prenotazione oraria per il ritiro/consegna al varco del terminal
- **Vettore**: l'azienda di autotrasporto terza che esegue fisicamente il trasporto per conto dello spedizioniere
- **Consorzio Goas**: rete di spedizionieri genovesi storicamente associati

## Nota

Esiste anche un PDF "lezione sul mercato spedizionieri" più esteso (dimensioni, meccaniche complete, ICP, pain, jargon), prodotto in una sessione precedente e consegnato in chat: se serve di nuovo, va recuperato/rigenerato e caricato qui.

---

<!-- fonte: kb/02-mercato/autotrasporto-pmi.md -->

# Mercato: autotrasporto PMI conto terzi (Italia/Europa)

## Segmento

B2B SaaS / TMS AI-native per PMI di autotrasporto stradale, mercato italiano ed europeo. A differenza degli spedizionieri (che coordinano vettori terzi senza possedere mezzi), qui il cliente **possiede la flotta**.

## ICP

- 5-100 camion, 5-150 dipendenti
- Operazioni: trasporto multi-carico / multi-tappa quotidiano
- Stack attuale tipico: Excel, email, WhatsApp, TMS legacy, software GPS/gestione flotta, software contabile
- Pain principale: alta complessità operativa gestita manualmente da dispacciatori/titolari

## Flusso operativo attuale (dove nasce il problema)

1. Ordini arrivano via email/PDF/Excel/telefono
2. Il dispacciatore interpreta manualmente gli ordini
3. Assegna camion e autisti
4. Pianifica i percorsi
5. Comunica con gli autisti
6. Reagisce ai ritardi
7. Cerca carichi aggiuntivi (specialmente per i rientri)
8. Controlla i documenti di consegna
9. L'amministrazione riconcilia viaggi e fatture

Insight centrale: il prodotto di valore non è un'altra dashboard, è un layer AI che decide continuamente cosa deve succedere dopo, lasciando al dispacciatore il ruolo di "gestore di eccezioni" invece che coordinatore manuale di ogni viaggio.

## Segmenti software adiacenti da mappare (vedi `03-competitor/`)

TMS (Transportation Management System), fleet management, last mile, WMS, shipping SaaS, freight marketplace, supply chain SaaS, logistica AI-native.

## Geografie di interesse per la ricerca competitor

Italia, Germania, Francia, Spagna, Polonia, Paesi Bassi, Belgio, UK.

## Metriche di successo tipiche del settore

Km a vuoto, utilizzo flotta, ricavo per camion, margine per viaggio, ore dispacciatore risparmiate, tasso di consegne puntuali, interventi manuali, ordini processati automaticamente.

## Nota metodologica importante

Il piano di pianificazione per questo verticale usa un motore **deterministico** per capacità/routing/vincoli, non un LLM, coerente con come si dovrebbe costruire un vero prodotto in questo spazio (vedi `01-prodotto/ai-transport-manager-autotrasportatori.md` per il principio completo). Un LLM qui serve solo per capire ordini non strutturati, spiegare decisioni, orchestrare, mai per calcolare il routing stesso.

---

<!-- fonte: kb/03-competitor/da-mappare.md -->

# Competitor — mappa da costruire

Stato: **vuoto, nessuna ricerca competitor sistematica fatta finora.** Questo file è il posto dove far confluire quello che troviamo, con il template qui sotto per tenerlo confrontabile.

## Perché è la prossima cosa da fare

Prima di investire oltre la demo tecnica su AI Transport Manager (e per validare meglio anche il modulo Porti), serve sapere: chi altro sta già risolvendo questo problema, con che prodotto, a che prezzo, con quanto successo.

## Obiettivo della ricerca

Mappare il mercato europeo del software TMS/fleet per PMI e identificare il miglior "wedge" iniziale (per entrambi i verticali: spedizionieri doganali e autotrasportatori PMI).

## Geografie

Italia, Germania, Francia, Spagna, Polonia, Paesi Bassi, Belgio, UK.

## Segmenti da coprire

TMS, fleet management, last mile, WMS, shipping SaaS, freight marketplace, supply chain SaaS, logistica AI-native.

## Template per ogni competitor (una sezione per azienda)

```
### [Nome azienda]

- Paese:
- Segmento:
- Cliente target:
- Dimensione azienda (dipendenti):
- Prodotto (in 1-2 frasi):
- Feature chiave:
- Pricing:
- Fatturato (se noto, 2023/2024/2025):
- Funding / investitori:
- Numero clienti / copertura geografica:
- Capacità AI (se presenti):
- Integrazioni principali:
- Punti di forza:
- Punti deboli / gap:
- Fonte:
```

## Competitor noti da verificare per primi (non ancora ricercati in dettaglio)

Per il segmento spedizionieri/PCS: nessun nome noto specificamente focalizzato sui porti italiani al momento — è uno dei punti di forza dichiarati del modulo Porti ("0 piattaforme come Movr già focalizzate sui porti italiani").

Per il segmento TMS/fleet PMI generico: da ricercare, categoria affollata a livello europeo/globale (player storici enterprise + startup AI-native più recenti), nessuno ancora mappato in questa KB.

## Analisi finale da produrre una volta raccolti abbastanza dati

- Dimensione di mercato stimata
- Densità competitiva per segmento/geografia
- Benchmark di pricing
- Segmento cliente più scoperto
- Miglior wedge di prodotto iniziale
- Stima TAM/SAM/SOM
- Percorso plausibile verso un'azienda da €100M+ di valore

---

<!-- fonte: kb/04-clienti-e-outreach/aziende-genovesi-da-contattare.md -->

# Aziende genovesi da contattare (design partner Movr)

Fonte di verità: `README.md` nella root del repo. Questa è una copia sincronizzata per la KB. Se diverge dal README della root, il README prevale: aggiorna prima lì, poi rifletti qui.

ICP: spedizioniere doganale genovese, 5-30 dipendenti, import/export container su Genova/Savona-Vado, lavora con vettori terzi (non ha flotta propria), idealmente associato Spediporto.

## Priorità alta — contattare per prime (4)

| Azienda | Sede | Dipendenti | Fondata | Note | Fonte |
|---|---|---|---|---|---|
| Lena Spedizioni Srl | Genova | 20-49 | 1993 | Spedizioni internazionali + servizi doganali, struttura solida | Verificato |
| Ambra Mar Srl | Genova | 20-49 | 1990 | Spedizioni internazionali globali, supporto multi-settore | Verificato |
| GDT Logistic SpA | Genova | 20-49 | 1981 | Groupage + spedizioni internazionali, buon fit coordinamento vettori | Verificato |
| Spedimar Srl | Genova | 20-49 | — | Spedizionieri internazionali, dimensione confermata | Verificato |

## Secondo giro — dimensione da confermare (8)

| Azienda | Sede | Dipendenti | Fondata | Note | Fonte |
|---|---|---|---|---|---|
| Spediservices Srl | Genova | — | 2005 | Braccio consulenziale/digitale di Spediporto, miglior primo contatto per aprire la rete verso l'associazione | Da confermare |
| Lanza International Srl | Genova | 20-49 | 1996 | Groupage e logistica, focus più su groupage stradale che container | Verificato |
| Parodi Forwarding | Genova | — | — | Comunicazione online curata | Da confermare |
| CNS Casasco & Nardi SpA | Genova, consorzio Goas | 50-99 | 1956 | Leggermente sopra target dimensionale ma storica e strutturata | Verificato |
| Oliaro Casa di Spedizioni | Genova, consorzio Goas | — | — | Storica, dimensione da verificare | Da confermare |
| Mastarmar Spedizioni | Genova, consorzio Goas | — | — | Taglia media presunta | Da confermare |
| Sinergy Cargo Management | Genova, consorzio Goas | — | — | Nome suggerisce focus operativo/gestionale | Da confermare |
| Ocean Sped | Genova | — | anni '90 | Comunicazione orientata a flessibilità/soluzioni su misura | Da confermare |

## Escluse dal primo giro (3)

| Azienda | Sede | Fondata | Motivo esclusione |
|---|---|---|---|
| Priano Marchelli | Genova | — | Ha già fornitore IT esterno (Digilogix) |
| Cav. Placido Macor & C. | Genova, dal 1930 | 1930 | Molto storica/familiare, possibile resistenza al cambiamento |
| Weltra | Genova, 60 anni di attività | — | Profilo tradizionale, poco orientato al digitale |

## Nota sui dati

Dipendenti "Verificato" provengono da Europages (aggregatore B2B), non da fonti camerali ufficiali: indicativi. Le voci "Da confermare" vanno controllate su LinkedIn (numero dipendenti, attività recente = segnale di apertura digitale) prima del primo contatto.

## Stato contatti (da tenere aggiornato qui)

Nessun contatto ancora avviato al 26 agosto 2026. Aggiorna questa sezione mano a mano: azienda contattata, data, esito, prossimo step.

---

<!-- fonte: kb/04-clienti-e-outreach/aziende-autotrasporto-nazionale.md -->

# Aziende autotrasporto PMI da contattare (design partner Movr, modulo Flotte)

ICP: PMI italiana di autotrasporto conto terzi, 10-50 camion, 5-150 dipendenti, gestione familiare, senza vincolo geografico (a differenza del modulo Porti che è Genova-specifica).

**Metodologia e limiti**: ricerca via web search (non accesso diretto ai siti aziendali, bloccato in questo ambiente), incrociando risultati Europages e directory B2B (Kompass, Paginebianche, FatturatoItalia). Dati indicativi, non da fonti camerali ufficiali — vanno confermati (visura, sito aziendale, LinkedIn) prima del primo contatto. Ricerca preliminare, molto meno approfondita di quella su Genova: da espandere.

## Priorità alta — dati concreti, buon fit dimensionale (3)

| Azienda | Sede | Dipendenti | Fondata | Note | Fonte |
|---|---|---|---|---|---|
| Iblea Transport (Nuova Logistica Ragusana Srl) | Ragusa, Sicilia | 21 | Gennaio 2008 | 34 mezzi con unità frigo, distribuzione alimentare regionale/nazionale — fit quasi perfetto con l'ICP | Directory B2B |
| Prota Trasporti e Logistica Srl | Capaccio Paestum (SA), Campania | 20-49 | 2022 (possibile marchio precedente "La Prota" più vecchio, da verificare) | Trasporto nazionale/internazionale, si presenta come leader di settore locale | Directory B2B |
| Autotrasporti F.lli D'Anella | Marsico Nuovo (PZ), Basilicata | 20-49 | Attiva da 30+ anni | Trasporto merci su strada, azienda storica familiare | Europages |

## Da confermare — solo nome e regione, dati da verificare (9)

| Azienda | Sede | Note | Fonte |
|---|---|---|---|
| L.S. Trasporti | Padova, Veneto | Conto terzi, opera multi-regione (Lombardia, Veneto, Friuli, Piemonte, Liguria, Toscana, Emilia-Romagna, Marche, Lazio, Umbria) | Sito aziendale (snippet) |
| Autotrasporti Marrassini (Marrassini Giancarlo Srl) | Pisa, Toscana | Attiva dagli anni '60, conto terzi + trasporto rifiuti | Directory B2B |
| Corriere Giudici Bortolo Srl | Italia (regione da confermare) | Dal 1955, pallet espresso, spedizioni, trasporto merci | Europages |
| FE Logistics and Transport | Italia (regione da confermare) | Familiare, 20-49 dipendenti dichiarati | Europages |
| Vuerre Trasporti | Prato, Toscana | Trasporto merci conto terzi | Directory B2B |
| Portolano Trasporti | Italia, multi-regione (Toscana, Emilia-Romagna, Lombardia, Piemonte, Umbria, Marche) | Autotrasporti per fiere, stoccaggio, logistica | Directory B2B |
| Comatra Uno | Italia, multi-regione (Lombardia, Veneto, Toscana, Piemonte, Friuli, Liguria, Emilia-Romagna) | Trasporti nazionali conto terzi | Directory B2B |
| Badalassi Trasporti e Sollevamenti | Pisa, Toscana | Conto terzi, movimentazione, noleggio container con gru su camion | Directory B2B |
| LA L.R. Autotrasporti | Italia (regione da confermare) | Azienda familiare, fondata 2013 | Europages |

## Escluse (1)

| Azienda | Sede | Motivo esclusione |
|---|---|---|
| Movitrans Group Società Cooperativa | Modena, Emilia-Romagna | Cooperativa artigiana di ~120 soci, non una singola PMI: profilo organizzativo diverso dall'ICP (che presuppone un'azienda unica con dipendenti diretti, non una struttura consortile) |

## Prossimi passi

1. Verificare le 9 "da confermare" (regione esatta, dipendenti, LinkedIn/sito aziendale)
2. Espandere la ricerca: mancano ancora Nord-Ovest (Piemonte, Liguria) e Nord-Est (Trentino, Friuli) con nomi propri, coperti finora solo come "opera anche in" di aziende multi-regione
3. Decidere se ha senso partire il contatto ora o aspettare l'esito della ricerca competitor (vedi `03-competitor/da-mappare.md`) e la decisione sul destino del modulo Flotte (vedi `todo.md`)

## Stato contatti

Nessun contatto ancora avviato al 26 agosto 2026.

---

<!-- fonte: kb/04-clienti-e-outreach/playbook-outreach.md -->

# Playbook outreach — design partner

## Fase attuale

Fase 1 del go-to-market Movr (modulo Porti): 3-4 design partner gratuiti in cambio di feedback settimanale strutturato, sul wedge stretto slot booking + notifiche multi-terminal (non integrazione PCS).

## Chi contattare per primo

Vedi `aziende-genovesi-da-contattare.md` in questa stessa cartella. Ordine consigliato:
1. **Spediservices**, non è il target ICP diretto (è il braccio digitale di Spediporto), ma è il contatto che apre la rete verso l'intera associazione: primo contatto ideale per ottenere introduzioni.
2. Le 4 aziende a priorità alta (Lena Spedizioni, Ambra Mar, GDT Logistic, Spedimar).
3. Il secondo giro, dopo aver verificato su LinkedIn le dimensioni non confermate.

## Cosa offrire

- Uso gratuito della piattaforma
- Demo personalizzata con dati vicini ai loro (nomi clienti/vettori plausibili, non i dati demo generici)
- Canale diretto: 15 minuti a settimana di feedback, cambiamenti rapidi invece di roadmap trimestrali

## Cosa chiedere in cambio

- Feedback strutturato settimanale
- Permesso di usarli come caso studio (una volta che il prodotto funziona per loro)

## Oltre Genova

La fase 2 (referral via Spediporto/Federlogistica Liguria) e la fase 3 (replica su La Spezia, Livorno, Trieste, poi un porto estero) presuppongono che la fase 1 funzioni. Non c'è ancora una lista di aziende per queste fasi successive: da costruire quando ci si arriva, con lo stesso criterio ICP adattato al porto specifico.

## Materiali di supporto già prodotti (verificare dove sono salvati, non in questa cartella)

- Un PDF "lezione sul mercato spedizionieri" (dimensioni, meccaniche, ICP, pain, jargon)
- Un file .md di riassunto outreach con lista clienti potenziali, generato in una sessione precedente

Se servono di nuovo, chiedili a Claude: possono essere rigenerati, e andrebbero caricati in questa cartella per non perderli di nuovo.

---

<!-- fonte: kb/05-stato-tecnico/architettura-e-stack.md -->

# Architettura e stack tecnico

## Repository

`github.com/lasagnealpesto/logistic`, branch di lavoro `claude/repo-access-push-7v25nf`. Monorepo con due progetti Next.js indipendenti:
- root (`/`) — piattaforma Movr: modulo Porti (`/`, `/calendario`, ecc.) + modulo Flotte/AI Transport Manager (`/flotta`) + modulo Dogana/Customs Brain (`/customs`)
- `clyo-site/` — sito marketing Movr, progetto Next.js separato nello stesso repo (nome cartella legacy, non aggiornato per non rompere la config Vercel — vedi nota in `clyo-site/README.md`)

## Stack piattaforma (root)

- Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- Backend: Supabase (Postgres), solo per il modulo Porti. Client server-only in `lib/supabase/server.ts`, usa `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SECRET_KEY` (service role, bypassa RLS)
- Server Actions (`app/actions.ts`) per le mutazioni, con `revalidatePath` sulle route coinvolte
- Stato condiviso lato client: `lib/store.tsx` (`OperationsProvider`) per Porti, `lib/customs/store.tsx` (`CustomsProvider`) per Dogana — entrambi montati nel root `app/layout.tsx`, aggiornamento ottimistico in UI
- API REST dedicate (`app/api/driver/*`) per la futura app iOS driver, protette da header `Authorization: Bearer <DRIVER_API_KEY>`

## Stack sito marketing (`clyo-site/`)

Next.js 16 indipendente, stessa palette, deploy Vercel separato. Sezioni a schermo intero con scroll-snap su desktop.

## Deploy

Due progetti Vercel distinti sullo stesso repo GitHub, differenziati per "Root Directory":
- progetto **"logistic"** → root directory vuota → piattaforma
- progetto **"logistic-site"** → root directory `clyo-site` → sito marketing

Account Vercel che deploya davvero: `lormilano99@gmail.com`, team "lormilano-projects". (Diverso dall'account Vercel raggiungibile dagli strumenti MCP di Claude in alcune sessioni: attenzione a questo quando si debugga da qui.)

## Variabili d'ambiente richieste (piattaforma)

- `NEXT_PUBLIC_SUPABASE_URL` — tipo Config, non Secret (deve essere esposta al client)
- `SUPABASE_SECRET_KEY` — service role key
- `DRIVER_API_KEY` — chiave condivisa per le route `/api/driver/*`, usata anche dall'app iOS

## Modulo AI Transport Manager (`/flotta`)

Self-contained in `lib/flotta/` e `app/flotta/`. Non collegato a Supabase: stato locale React, dati demo generati deterministicamente in `lib/flotta/datiDemo.ts`. Switch Porti/Flotte/Dogana nella sidebar (`components/Sidebar.tsx`).

## Modulo Dogana / Customs Brain (`/customs`)

Terzo modulo Movr, a differenza di Flotte **agganciato** al modulo Porti invece che isolato: `lib/customs/tipi.ts` (`CasoDoganale`) ha un `spedizioneId` opzionale verso `lib/data.ts` (`Spedizione`). Nessun Supabase: stato in `lib/customs/store.tsx` (`CustomsProvider`/`useCustoms`), montato nel root `app/layout.tsx` (non più in un layout annidato sotto `/customs` — deve restare così, altrimenti la dashboard Porti e `/customs` finiscono su due copie separate dello stesso stato). Dati demo deterministici in `lib/customs/datiDemo.ts`, motore (readiness, validazione, copilot a template) in `lib/customs/motore.ts`.

`lib/exceptions/` (Exception Center): pure funzioni che leggono sia `Spedizione` che `CasoDoganale` e producono la lista "Attenzione oggi" mostrata in cima a `app/DashboardClient.tsx` — nessuno stato proprio, nessuna scrittura. Vedi `01-prodotto/roadmap-ai-operations-layer.md` per la visione completa (fasi 1-6) e cosa resta deliberatamente non costruito.

## App driver iOS

Codice Swift/SwiftUI in `ios-driver-app/MovrDriver/` (modelli, client HTTP verso `/api/driver/*`, schermata principale). **Compilata e pubblicata su TestFlight** (Internal Testing) dall'utente su Xcode, con il mio supporto passo-passo da questa sessione — build 1 caricata e installata su dispositivo reale. Guida completa in `ios-driver-app/README.md`. Setup di Xcode Cloud proposto (non ancora confermato fatto) per automatizzare build/upload futuri ad ogni push, invece del giro manuale Archive → Distribute.

## Cosa NON è ancora vero (limiti noti)

- Nessuna integrazione reale con PCS/terminal/sistemi terzi (deliberato, fuori scope MVP)
- Nessuna autenticazione multi-tenant reale
- Nessuna notifica push reale (solo simulata in UI, sia web che iOS)
- Il modulo AI Transport Manager non ha un vero motore LLM collegato: le risposte "chiedi all'AI" sono template su dati reali calcolati, non generate da un modello
- Il modulo Dogana non ha OCR/estrazione documenti reale né un vero motore LLM: intake, estrazione e classificazione HS sono dati mock deterministici, non generati da un modello

## Limiti dell'ambiente di sviluppo (per chi riprende il progetto, incluso un altro LLM)

- Le sessioni Claude in questo ambiente non hanno accesso diretto al database Supabase live: build e lint si possono verificare, il comportamento runtime va confermato dall'utente dopo il deploy
- Nessun accesso a Xcode/macOS: il codice per l'app iOS viene scritto qui ma compilato/archiviato/caricato sempre dall'utente sul proprio Mac, guidato passo-passo via screenshot
- L'account Vercel raggiungibile dagli strumenti MCP di Claude in questa sessione può differire da quello che deploya davvero (`lormilano99@gmail.com`): verificare sempre quale account è collegato prima di agire
- L'egress di rete verso domini generici (es. `*.vercel.app`, siti aziendali per ricerca competitor/clienti) è bloccato per fetch diretto: solo la ricerca web (query, non URL specifici) funziona

---

_Bundle generato il 27 agosto 2026 dalla sessione Claude Code collegata al repo._

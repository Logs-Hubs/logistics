# AI Transport Manager — verticale per autotrasportatori PMI

## Stato

Secondo mercato in valutazione, esplorato in parallelo al modulo Porti (ex Clyo). Non è ancora una decisione di andare avanti: è una demo tecnica costruita per vedere se il concetto regge, dentro lo stesso repo, con uno switch nella UI ("Porti" / "Flotte") sotto il brand ombrello Movr.

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

Non lasciare mai che un LLM prenda decisioni di routing matematicamente critiche. L'AI (LLM) serve per capire informazioni non strutturate, ragionare, spiegare, orchestrare. Un motore di ottimizzazione deterministico gestisce vincoli, capacità, finestre orarie e routing.

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

## Pivot: "Documenti trasporto" come nuovo ingresso (document-to-cash)

Arrivato come secondo brief esterno, valutato e costruito. Tesi aggiornata: **non partire dal planner AI, partire dall'intelligenza documentale** — la pianificazione ottimale richiede dati strutturati e affidabili, che oggi restano intrappolati in email, PDF, foto WhatsApp. Stessa lezione già imparata con Customs Brain sul lato Porti, applicata qui.

**Costruito** (`/flotta/documenti`, `lib/flotta/documenti/`): documenti disordinati (ordine cliente, DDT, POD) diventano un "lavoro di trasporto" strutturato, agganciato quando possibile a un `Ordine` reale già pianificato (`ordineId`). Stato di fatturazione (`non_completo` / `documenti_mancanti` / `tariffa_da_verificare` / `pronto_fatturazione` / `fatturato`) sempre calcolato dai documenti presenti, mai scritto a mano. Wow feature: dashboard del **fatturato bloccato**, con breakdown per motivo ("DDT mancante", "POD ricevuto ma non validato", ecc.) — la stessa idea di "hai già fatto il lavoro, ecco cosa ti impedisce di essere pagato" indicata nel brief come feature primaria. Intake simulato (inoltro email con PDF → lavoro creato), sollecito documenti con bozza di testo generata (non invia nulla), copilot contestuale.

**Non toccato**: il centro comando pianificazione esistente (`/flotta`, `lib/flotta/pianificatore.ts`) resta com'era — il brief lo classificava come fase successiva (7 di 9), ma esiste già da una sessione precedente. Le fasi realmente nuove costruite sono le prime tre del nuovo brief (AI Transport Inbox, Transport Job Graph in forma minima, Invoice Readiness / fatturato bloccato); il resto (chaser automatico via WhatsApp/email reali, command center dedicato, predizioni) richiede canali/integrazioni che non esistono in questo ambiente — stesso motivo per cui restano ferme le fasi 4-6 della roadmap Porti, vedi `roadmap-ai-operations-layer.md`.

Nella sidebar, "Documenti trasporto" è ora la prima voce del modulo Flotte (prima di "Centro comando flotta"), per riflettere il nuovo ingresso — l'URL `/flotta` non è cambiato per non rompere link esistenti.

## Exception Center di Flotte

Pannello "Attenzione oggi" in cima al centro comando (`/flotta`), stesso principio di quello già costruito per Porti: correla i problemi del planner (ordini non assegnati, autisti vicini al limite ore, rischio ritardo, rientri a vuoto) con i lavori a fatturato bloccato di Documenti trasporto, in un'unica lista prioritizzata per severità. Ha richiesto di sollevare lo stato del piano fuori da `FlottaClient` (prima locale, quindi invisibile a qualunque altro pannello) in un `PianoProvider` condiviso — vedi `05-stato-tecnico/`.

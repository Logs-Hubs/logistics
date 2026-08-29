# To-do Movr

Fonte unica per la lista di cose da fare. La tengo aggiornata io direttamente (Edit tool, non serve chiedermelo ogni volta) man mano che completiamo cose o ne emergono di nuove, e la uso per proporre proattivamente i prossimi passi quando ha senso nel contesto.

## Clienti / outreach

- [ ] Trovare numeri di telefono e referente giusto per le 12 aziende genovesi (ricerca web, blocco prima di poter chiamare — vedi `04-clienti-e-outreach/piano-outreach-telefonico.md`)
- [ ] Fissare le prime interview telefoniche di discovery (vedi `piano-outreach-telefonico.md` + `guida-interview-design-partner.md`): partire da Spediservices, poi le 4 aziende a priorità alta
- [ ] Contattare le 4 aziende a priorità alta: Lena Spedizioni, Ambra Mar, GDT Logistic, Spedimar
- [ ] Primo contatto Spediservices (apre la rete verso Spediporto)
- [ ] Verificare su LinkedIn le aziende "da confermare" del secondo giro (dimensione, attività recente)
- [ ] Modulo Flotte: verificare le 9 aziende "da confermare" in `aziende-autotrasporto-nazionale.md` (regione, dipendenti, LinkedIn/sito)
- [ ] Modulo Flotte: espandere la ricerca aziende a Nord-Ovest (Piemonte, Liguria) e Nord-Est (Trentino, Friuli), oggi coperti solo da operatori multi-regione

## Tecnico / deploy

- [ ] Verificare che il deploy `logistic-site` su Vercel mostri il rebrand Movr (in corso, controllare tab Deployments)
- [ ] Sostituire l'email placeholder `ciao@movr.app` con una vera
- [ ] Verificare disponibilità del dominio `movr.app` (o altro TLD)
- [ ] Aggiungere `DRIVER_API_KEY` su Vercel (progetto "logistic") con valore `movr-demo-driver-2026`, poi redeploy: sblocca la demo live app↔piattaforma (premi il pulsante sull'app, SP-2461 cambia stato anche sulla dashboard web)
- [ ] Invitare più tester al gruppo TestFlight oltre al primo
- [ ] Verificare su TestFlight la nuova schermata driver a tutto schermo (stepper animato + pulsante grande): confermare che l'animazione e il layout siano quelli voluti

## Prodotto / decisioni

- [ ] Ricerca competitor (vedi `03-competitor/da-mappare.md`): prossimo passo prima di investire di più sul modulo Flotte
- [ ] Decidere il destino del modulo Flotte (AI Transport Manager): secondo prodotto, pivot, o esperimento da chiudere
- [ ] Validare il modulo Dogana (Customs Brain) con un design partner reale: oggi è tutto mock, serve un caso vero (o quasi) per capire se il flusso di readiness/validazione regge
- [ ] Decidere se/quando riprendere la roadmap AI Operations Layer oltre le fasi 1-3 (vedi `01-prodotto/roadmap-ai-operations-layer.md`) — fasi 4-6 richiedono integrazioni reali (email, storico dati) non ancora disponibili
- [ ] Validare "Documenti trasporto" (modulo Flotte) con un'azienda di autotrasporto vera: capire se il flusso ordine → DDT → POD → fatturazione corrisponde davvero a come lavorano

## Idee da scoping-are (non ancora iniziate)

- [ ] Gestione appuntamenti via audio WhatsApp: definire il caso d'uso preciso (dispacciatore o autista?) prima di costruirla
- [ ] Feature aggiuntive calendario: creazione spedizione al volo dallo slot, riprogrammazione appuntamenti, vista filtrata per vettore, prenotazione ricorrente

## Fatto di recente

- [x] Piano di outreach telefonico (`04-clienti-e-outreach/piano-outreach-telefonico.md`) e tracker (`tracker-outreach.md`): script apertura, gestione obiezioni/centralino, timing, adattamento dell'interview al canale telefonico — su richiesta esplicita dell'utente ("tutto in call")
- [x] App driver iOS: le conferme ritiro/rientro vuoto ora mandano anche la richiesta reale in background verso `/api/driver/*` — unica interazione demo davvero connessa alla piattaforma (in attesa solo di `DRIVER_API_KEY` su Vercel, vedi sopra)
- [x] App driver iOS: build di test standalone (demo mode, senza login né rete) e nuova schermata driver a tutto schermo con stepper animato, pulsante d'azione grande e centrale con anelli pulsanti, effetto particelle alla conferma di ogni step
- [x] Salvata in KB la guida alle interview di discovery spedizionieri (`guida-interview-design-partner.md`), condensata dal PDF caricato dall'utente; prodotta lista ordinata delle prime aziende genovesi da intervistare
- [x] Xcode Cloud attivo su MovrDriver: repo dedicato `lasagnealpesto/movr-driver-ios`, build e upload TestFlight automatici ad ogni push su `main`
- [x] Exception Center di Flotte: "Attenzione oggi" nel centro comando, correla problemi planner + fatturato bloccato
- [x] Documenti trasporto (modulo Flotte): pivot da "solo pianificatore" a "document-to-cash", dashboard fatturato bloccato, lavori agganciati agli ordini reali
- [x] Modulo Dogana (Customs Brain): terzo modulo Movr, intake documenti simulato, casi doganali agganciati alle spedizioni reali, readiness score, classificazione HS con approvazione umana
- [x] Exception Center: pannello "Attenzione oggi" sulla dashboard Porti, correla blocchi doganali + demurrage + appuntamenti non pianificati in un'unica lista prioritizzata
- [x] Rebrand da Clyo a Movr, ovunque (piattaforma, sito, KB, app iOS)
- [x] Modulo Flotte (AI Transport Manager): vertical slice funzionante con motore deterministico
- [x] Knowledge base creata (repo + mirror Drive ristretto a mercato/competitor/clienti)
- [x] Annullamento appuntamenti + alert demurrage nel calendario piattaforma
- [x] To-do spostata dal mirror Drive (link che si rompeva ad ogni modifica) a qui nel repo
- [x] Prima lista aziende autotrasporto nazionale per il modulo Flotte (3 verificate, 9 da confermare)
- [x] App driver iOS compilata e pubblicata su TestFlight (Internal Testing), installata e testata su dispositivo reale

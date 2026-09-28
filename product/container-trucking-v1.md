# Movr per container trucking — spec prodotto V1

Tutto in questo documento è **HYPOTHESIS di prodotto**, non un piano approvato da discovery reale: nessuna delle capability sotto è stata validata con un'azienda di autotrasporto container vera. Serve come canovaccio da portare alle prime interview e correggere, non da costruire subito. Per ogni capability: perché potrebbe servire, quale pain di `research/container-trucking-workflow.md` cerca di validare, a quale KPI si collega, e cosa esiste già nel codice attuale che potrebbe essere riusato.

## Workflow centrale (l'unico verso cui progettare)

```
TRANSPORT ORDER
  ↓
CONTAINER READINESS
  ↓
PLANNING / DISPATCH
  ↓
EXECUTION
  ↓
DELIVERY
  ↓
EMPTY RETURN
  ↓
DOCUMENTS / ACCESSORIALS
  ↓
INVOICE READY
```

Ogni schermata futura deve rispondere alla domanda "dove si trova questo ordine in questa catena, e cosa serve fare adesso" — non essere un cruscotto generico. Il progetto è centrato sul **dispatcher/responsabile traffico**, non sul cliente finale né sull'autista (che ha il suo flusso separato, capability F).

## KPI di riferimento (ogni capability sotto si collega ad almeno uno)

1. Container moves per dispatcher al giorno
2. Minuti di lavoro umano per ordine
3. € di accessorial recuperati
4. Tempo da job-completato a fattura pronta
5. Empty moves / km a vuoto
6. Waiting time
7. Eccezioni intercettate prima che diventino un problema

## Capability

### A. AI order intake

**Cosa fa (hypothesis):** legge email/PDF/Excel in ingresso, struttura i dati, crea il transport order, segnala i campi mancanti invece di richiederli tutti a mano.

**Pain da validare:** "Order intake" e "Data entry" in `container-trucking-workflow.md` — quanto tempo/errori genera oggi la ricopiatura manuale dei dati dell'ordine.

**KPI collegato:** minuti di lavoro umano per ordine (#2).

**Cosa esiste già:** nulla di direttamente riusabile — il modulo Dogana (`lib/customs/`) ha un concetto di "intake documenti simulato" ma è mock, non un vero parser AI, ed è pensato per documenti doganali, non ordini di trasporto. Da costruire da zero, ma l'architettura (intake → struttura → segnala mancanze) può prendere ispirazione da come `lib/customs/motore.ts` gestisce readiness/validazione.

### B. Container readiness

**Cosa fa (hypothesis):** per ogni container, un solo posto che aggrega: carrier release, customs release, terminal availability, slot, last free day, empty return deadline.

**Pain da validare:** "Readiness check" — oggi disperso su portali/telefonate separate, il blocco si scopre spesso solo al gate (pain molto concreto, alta priorità da confermare in discovery).

**KPI collegato:** eccezioni intercettate prima che diventino un problema (#7), waiting time (#6).

**Cosa esiste già:** il modulo Dogana ha già un concetto di "readiness score" (`lib/customs/motore.ts`) applicato al caso doganale — la logica concettuale (più segnali → uno stato aggregato → azione consigliata) è riusabile, ma va estesa a carrier release/terminal/slot, non solo dogana. **Dipendenza critica**: se l'integrazione con i terminal liguri non è disponibile (vedi `research/container-trucking-terminal-integrations.md`), questa capability deve comunque funzionare mostrando "slot missing — action required" invece di richiedere automazione completa (vedi sezione 9 sotto).

### C. Exception management ("Attenzione oggi")

**Cosa fa (hypothesis):** la home non è una dashboard di grafici. Dice: "queste sono le 6 cose che richiedono la tua attenzione oggi" — container pronto ma senza autista, customs hold, slot mancante, empty return cambiato, driver in attesa oltre soglia, last free day domani, POD mancante, accessorial non fatturato.

**Pain da validare:** tutta la riga "Sì diretto" della matrice pain in `container-trucking-workflow.md` — è l'unico punto che le tocca tutte insieme, quindi il valore percepito dipende dal fatto che il dispatcher scopra qui, non altrove, i problemi.

**KPI collegato:** eccezioni intercettate prima che diventino un problema (#7) — è la capability che esiste già più vicina concettualmente: **l'Exception Center del modulo Porti/Flotte (`lib/exceptions/motore.ts`) è quasi esattamente questa idea**, già costruito e funzionante, solo applicato oggi a spedizionieri/PMI generiche invece che a container trucking. È il pezzo di codice più riusabile di tutto il prodotto attuale per la nuova tesi.

### D. Dispatch assistito

**Cosa fa (hypothesis):** Movr suggerisce autista/trattore/sequenza/compatibilità (reefer, ADR, posizione), l'essere umano conferma — non decide da solo.

**Pain da validare:** "Dispatch" nella matrice — quanto è oggi solo esperienza del dispatcher, quanto genera assegnazioni sub-ottimali (km a vuoto, straordinari).

**KPI collegato:** container moves per dispatcher al giorno (#1), empty moves/km (#5).

**Cosa esiste già:** il modulo Flotte ha già un **motore deterministico di pianificazione** (confronto piano manuale vs ottimizzato, backhaul finder) — concettualmente il pezzo più vicino a questa capability, ma pensato per trasporto generico, non per compatibilità container-specifiche (reefer, ADR, terminal di ritiro/consegna).

### E. Street turn / triangolazione

**Non costruire nulla finché non è chiaro**: frequenza reale in Italia, autorizzazioni richieste dalla shipping line, compatibilità container, valore economico reale. Vedi OPEN QUESTION dedicata in `container-trucking-workflow.md`. Se la discovery conferma che è raro o burocraticamente complesso sui porti liguri, questa capability va derisked o rimossa dal V1, non solo rimandata.

### F. Driver flow

**Cosa fa (hypothesis):** istruzioni del job, stato (arrivo/ritiro/rientro), raccolta POD/EIR da foto, cattura tempi di attesa.

**Pain da validare:** "Comunicazione autista" ed "Esecuzione (EIR, danni)" nella matrice.

**KPI collegato:** waiting time (#6), minuti di lavoro umano per ordine (#2, la raccolta POD/EIR è dove oggi si perde tempo di ritrascrizione).

**Cosa esiste già:** app driver iOS (`movr-driver-ios`) — oggi è una demo standalone (dati locali, un solo container finto, nessun concetto di readiness/dogana/terminal reale) collegata al modulo Porti (spedizioniere), non al workflow container trucking. È il pezzo di codice concettualmente più vicino alla persona giusta (l'autista), ma il contenuto/dominio va riscritto: non più "segnala ritiro per lo spedizioniere" ma "esegui il job assegnato dal dispatcher del trasportatore", con cattura POD/EIR reale (foto) invece che solo stati testuali.

### G. Billing / margin recovery

**Cosa fa (hypothesis):** a job completato, capisce quali extra fatturare (waiting time, accessorial), trova i documenti necessari, prepara la fattura.

**Pain da validare:** "Accessorial billing" e "Fatturazione finale" — probabilmente il pain economico più concreto e misurabile di tutta la matrice.

**KPI collegato:** € accessorial recuperati (#3), tempo da job-completato a fattura pronta (#4) — questi sono probabilmente i due KPI più vendibili in una demo, perché traducibili direttamente in euro.

**Cosa esiste già:** il modulo Flotte ha già fatto un pivot analogo per un'altra persona — "Documenti trasporto" (`/flotta/documenti`) è già un flusso document-to-cash (ordine → DDT → POD → fatturazione, dashboard fatturato bloccato) per l'autotrasporto generico. **È probabilmente il secondo pezzo più riusabile di tutto il prodotto attuale** dopo l'Exception Center — va reso container-specifico (aggiungere EIR, waiting time, readiness come trigger) invece di costruito da zero.

## Sintesi audit riuso (per chi deve decidere cosa buttare e cosa evolvere)

| Capability nuova | Codice esistente più vicino | Giudizio |
|---|---|---|
| C. Exception management | `lib/exceptions/motore.ts` (Exception Center) | **Riusabile quasi direttamente**, cambia solo il dominio dei segnali |
| G. Billing/margin recovery | `app/flotta/documenti/` (Documenti trasporto) | **Riusabile come struttura**, va esteso con EIR/waiting time |
| D. Dispatch assistito | Motore pianificazione modulo Flotte | Riusabile come logica, va esteso con vincoli container-specifici |
| B. Container readiness | `lib/customs/motore.ts` (readiness score Dogana) | Riusabile come pattern concettuale, non come dominio (oggi solo dogana) |
| F. Driver flow | `movr-driver-ios` | Persona giusta, dominio/contenuto da riscrivere |
| A. AI order intake | Nessuno | Da costruire da zero |
| Modulo Porti (spedizionieri) | — | **Persona sbagliata per la nuova tesi** — vedi `MOVR_HANDOFF.md` §2, decisione rimandata a dopo la discovery |

## Nota su modifiche al codice

Nessuna modifica al codice è stata fatta insieme a questo documento. Per istruzione esplicita: prima si documenta cosa cambiare e perché (fatto sopra, capability per capability), poi — solo dopo discussione con l'utente su quali capability portare avanti per prime — si passa all'implementazione.

## 10. Audit v1 → v1.1: cosa manca rispetto alle azioni reali del dispatcher (2026-09-28)

Il modulo `/container` (capability B+C) è stato costruito e mergiato su `main`. Questo audit confronta cosa fa oggi con cosa farebbe davvero un dispatcher durante la giornata (§2 di `container-trucking-workflow.md`), per decidere cosa aggiungere prima di mostrarlo a un design partner. Quattro gap concreti, ognuno legato a un pain già documentato — non aggiunte decorative:

1. **Nessun modo di far entrare un ordine nuovo.** Gli ordini esistono solo come dati demo precaricati: non si può replicare dal vivo la domanda di discovery "apri l'ultimo ordine ricevuto e fammi vedere cosa succede da lì" (`gtm/discovery-playbook.md`). Pain collegato: "Order intake" nella matrice (§5). Non si tratta di costruire capability A (parsing AI di email/PDF — resta HYPOTHESIS non validata, fuori scope), ma di un intake **strutturato manuale minimo**: un form che crea l'ordine con readiness tutta a zero, esattamente come arriva un ordine reale il giorno 1.
2. **L'assegnazione autista/mezzo ignora la compatibilità reefer/ADR.** I campi `Mezzo.reefer` / `Mezzo.adr` esistono nei tipi fin dall'inizio ma nel flusso di dispatch non venivano mai letti: si poteva assegnare un container reefer a un mezzo senza presa elettrica. È esattamente il pain descritto per capability D ("assegnazione sub-ottimale... compatibilità reefer/ADR"). Azione: la UI di assegnazione deve segnalare/impedire le combinazioni incompatibili, non solo elencare tutti i mezzi.
3. **"Segna come fatturato" non richiede EIR/POD raccolti.** Nella realtà non si fattura senza aver raccolto entrambi (§2.10) — è la riga della matrice pain con più "Sì diretto" messi insieme (POD, EIR, accessorial, fatturazione finale — §5). Oggi il bottone flippa lo stato senza controllare nulla. Azione: aggiungere lo stato documenti (EIR/POD raccolti) all'ordine, bloccare la fatturazione finché mancano, spiegare il motivo — stesso pattern già in produzione in `lib/flotta/documenti/motore.ts` (`spiegaBlocco`), non una nuova idea.
4. **La vista non rispetta il principio dichiarato in questo stesso documento** ("ogni schermata deve rispondere a dove si trova l'ordine nella catena, cosa serve fare ora — non un cruscotto generico", vedi sopra): la dashboard è oggi una tabella piatta in ordine di inserimento. Azione: raggruppare per fase operativa (le stesse fasi del workflow centrale), ordinare per urgenza (giorni al last free day) dentro ogni gruppo, filtro per porto.

Le prossime modifiche al codice implementano questi 4 punti, non altro (niente aggiunto solo perché "sembra bello").

**Implementato (stesso giorno):** tutti e 4 i punti. `lib/container/tipi.ts` aggiunge `richiedeReefer`/`richiedeAdr`/`eirRaccolto`/`podRaccolto` e la funzione `compatibile()`; `lib/container/motore.ts` aggiunge `motiviBloccoFatturazione()`/`prontoPerFatturazione()` e le eccezioni `ECC-COMPAT` (mezzo incompatibile) ed `ECC-DOCUMENTI` (EIR/POD mancanti al rientro vuoto); `lib/container/store.tsx` aggiunge `creaOrdine()` (intake), filtra l'assegnazione per compatibilità, e blocca `segnalaFatturato()` finché `prontoPerFatturazione()` non è vero; la dashboard (`app/container/ContainerDashboardClient.tsx`) è passata da tabella piatta a colonne per fase operativa (ordinate per giorni al last free day) con filtro porto e modale "Nuovo ordine"; il dettaglio ordine (`app/container/ordini/[id]/OrdineDetailClient.tsx`) aggiunge la card Documenti e spiega perché il bottone fatturazione è disabilitato, sullo stesso pattern di `spiegaBlocco` in Documenti Trasporto. Verificato con `next build` (typecheck+compile) e `lint`, entrambi puliti.

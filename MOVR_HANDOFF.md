# Movr — Handoff strategico

**Questo file è la fonte di verità strategica del progetto.** Chi riprende il lavoro (umano o LLM) legge questo file per primo. Va aggiornato solo quando emerge qualcosa che merita di diventare contesto permanente — non per ogni dettaglio operativo (quelli restano in `kb/`).

Convenzione usata in questo file e nei documenti collegati: ogni affermazione è etichettata **FACT** (fonte diretta verificabile), **ESTIMATE** (elaborazione con metodologia dichiarata), **HYPOTHESIS** (non verificata, da testare in discovery), **DECISION** (scelta fatta, non un dato) o **OPEN QUESTION** (da risolvere). Nessun dato è inventato: dove manca una fonte, il documento dice `UNKNOWN` invece di stimare in modo plausibile.

---

## 1. Decisione strategica (28/09/2026) — DECISION

Da questo momento Movr si concentra su **un solo verticale: container trucking / autotrasporto container.** Non più un software generico per la logistica.

**Beachhead geografico:**
1. Genova
2. Savona / Vado Ligure
3. La Spezia
4. Poi: Livorno, Trieste, altri porti italiani
5. Poi: Europa, potenzialmente a partire da Barcelona / Valencia

**Tesi corrente (da validare, non assumere corretta):**

> MOVR = AI Transport Manager for container trucking companies.

**Vision di lungo periodo:** the operating system for container trucking.

**Core promise da validare:**

> "Movr receives the transport order and makes the administrative work disappear until the invoice."

**Principio di prodotto:**

> "Humans handle exceptions. Movr handles everything else."

Il lavoro da qui in avanti è duplice: (A) approfondire questa tesi e trasformarla in prodotto, (B) cercare attivamente evidenze che la confermino o la smentiscano — non solo conferme.

---

## 2. Perché questo è un cambio importante — audit del prodotto attuale

**FACT**, dalla lettura diretta del codice (28/09/2026): la piattaforma oggi ha 3 aree funzionali sotto un solo deploy Next.js (`README.md`, `app/`):

| Modulo | Route | Persona target attuale | Fit con la nuova tesi |
|---|---|---|---|
| **Porti** | `/`, `/calendario`, `/spedizioni/[id]`, `/driver` | **Spedizioniere doganale** (freight forwarder/customs broker) — chi coordina il trasporto per conto del cliente finale, non chi possiede i camion | **Disallineato.** È il modulo più sviluppato (dashboard, calendario slot multi-terminal, tracking, Exception Center), ma costruito per la persona sbagliata: uno spedizioniere non è un'azienda di autotrasporto container |
| **Flotte** (AI Transport Manager) | `/flotta`, `/flotta/documenti` | **PMI di autotrasporto generico** (non specifico container) — pianificazione flotta, backhaul, "Documenti trasporto" (document-to-cash) | **Il punto di partenza più vicino.** Persona giusta (chi possiede/gestisce i camion), ma oggi generico: nessun concetto di container, terminal, dogana, slot, demurrage |
| **Dogana** (Customs Brain) | `/customs`, `/customs/[id]` | **Spedizioniere/importatore** — readiness doganale, classificazione HS | **Disallineato come modulo standalone**, ma i concetti (customs release, readiness) sono un input diretto del workflow container trucking — probabilmente da assorbire come segnale dentro il flusso principale, non restare un'app a sé |

**App driver iOS** (`movr-driver-ios`, repo separato): persona **autista**, coerente con la nuova tesi (capability F, "driver flow"), ma oggi è solo una demo standalone (dati locali, un'unica spedizione finta collegata al modulo Porti) — da ripensare per il nuovo workflow.

**Conclusione DECISION-pending (OPEN QUESTION):** il modulo Porti — quello con più lavoro dentro — è costruito per il cliente sbagliato sotto la nuova tesi. Il modulo Flotte è il punto di partenza più vicino ma va riscritto attorno al workflow container-specifico (vedi `product/container-trucking-v1.md`). Non è ancora deciso se il modulo Porti va: (a) ripensato per servire il trasportatore invece dello spedizioniere, (b) tenuto in vita come modulo separato per un'altra persona, o (c) messo in pausa. Da decidere dopo la discovery, non ora — costruire prodotto prima di parlare con 10 trasportatori sarebbe il preciso errore che questa strategia vuole evitare.

Dettaglio completo dell'audit, capability-per-capability della richiesta, in `product/container-trucking-v1.md`.

---

## 3. Documenti collegati

| Documento | Contenuto | Stato al 28/09/2026 |
|---|---|---|
| `research/container-trucking-workflow.md` | Workflow import/export, ruoli, terminologia (carrier release, demurrage, VGM, EIR, street turn, ecc.), cosa è manuale oggi | In scrittura |
| `research/container-trucking-market.md` | Market research: mercato, TAM/SAM bottom-up Liguria | In scrittura (ricerca in corso) |
| `research/container-trucking-competitors.md` | PortPro, Qargo, TruckerZoom, Rose Rocket, Raft + competitor IT/EU | In scrittura (ricerca in corso) |
| `gtm/container-trucking-prospects.csv` | Database prospect (obiettivo: 100+, si parte da Liguria) | In scrittura (ricerca in corso, prima tranche ~30) |
| `gtm/top-20-design-partners.md` | Shortlist prioritizzata con motivazione | Da fare dopo il database prospect |
| `gtm/discovery-playbook.md` | Script outreach + domande discovery | Da fare |
| `product/container-trucking-v1.md` | Spec prodotto V1 rifocalizzato | In scrittura |
| `product/container-trucking-roadmap.md` | V1 → V2 → OS completo | Da fare |

---

## 4. Cosa NON stiamo (ancora) assumendo

Per esplicita istruzione dell'utente, non trattiamo come vere finché non verificate:

- Che il mercato ligure sia abbastanza grande da sostenere Movr — da quantificare bottom-up, non con report generici
- Che street turn/triangolazione sia una pratica diffusa o autorizzata in Italia come negli USA — da verificare prima di costruire qualunque feature dedicata
- Che l'integrazione con i terminal/PCS liguri sia tecnicamente fattibile in V1 — V1 deve poter funzionare anche se lo slot resta "azione manuale nel portale esterno"
- Che PortPro sia un modello direttamente trapiantabile in Italia — probabile che parte del suo prodotto sia specifico del mercato USA (ELD, chassis pool, EDI con CBP/AMS)

## 5. Prossimi passi concreti (sprint 1, in corso)

1. ✅ Audit prodotto attuale (sezione 2 sopra)
2. 🔄 Ricostruzione workflow container trucking reale (`research/container-trucking-workflow.md`)
3. 🔄 Prime 30 aziende Liguria (ricerca in corso)
4. ⏳ Top 10 dalla lista
5. ⏳ Proposta di come rifocalizzare la demo attuale per quelle 10 aziende
6. ⏳ Preparazione outreach (LinkedIn/email/WhatsApp/script call)
7. ⏳ Estensione a 100 prospect
8. 🔄 TAM/SAM bottom-up (ricerca in corso)

Obiettivo finale dello sprint: non produrre documenti, ma arrivare a **4 design partner + un prodotto che risolve un pain misurabile + una lista ripetibile di aziende a cui venderlo.**

# Movr — contesto completo del progetto

_Ultimo aggiornamento: 2026-10-09. Scritto per essere dato in mano a chi si unisce al progetto (umano) e incollato/letto da un assistente AI (ChatGPT, Claude, ecc.) per avere subito tutto il contesto necessario._

---

## TL;DR — 30 secondi

- **Movr** vuole essere l'**AI Transport Manager per l'autotrasporto container** ("l'operating system for container trucking").
- **Promessa**: Movr riceve l'ordine di trasporto e fa sparire il lavoro amministrativo fino alla fattura. Principio guida: *"gli umani gestiscono le eccezioni, Movr gestisce tutto il resto."*
- **Decisione presa**: un solo verticale, deciso, non un test su più ipotesi — **container trucking**, beachhead **Genova + Savona/Vado + La Spezia**.
- **Stato oggi**: ricerca di mercato fatta, prodotto demo funzionante (modulo "Container" nel repo, deployato live ma protetto da login Vercel), 62 aziende-prospect profilate e caricate su Notion, pronte da chiamare. **Zero vendite, zero design partner confermati, zero utenti reali.**
- **Prossimo passo**: assumere un sales/generalista per fare outreach manuale (chiamate, discovery, richiesta design partnership) + un developer per far evolvere il prodotto sui feedback reali.

---

## 1. Cos'è Movr e da dove viene

Movr è nato come piattaforma AI per la logistica in senso ampio — moduli separati per **Porti** (spedizionieri/freight forwarder, pratiche doganali), **Flotte** (autotrasportatori generici, pianificazione mezzi/autisti) e **Dogana** (estrazione documenti doganali). Tutto questo esiste ancora nel codice.

Il **28 settembre 2026** è stata presa una decisione strategica netta: smettere di testare più ipotesi di mercato in parallelo e concentrare tutto su **un solo verticale**: il **container trucking** (il trasporto su gomma dei container tra porto/terminal e cliente finale — in inglese "drayage"). Questo non è uno dei tre ICP in test, è *la* scelta.

Perché questo verticale: è operativamente più complesso del trasporto generico perché il trasportatore dipende da attori esterni (shipping line, terminal portuale, dogana, spedizioniere) e oggi quasi tutto quel coordinamento è manuale — telefonate, email, portali diversi per ogni terminal, Excel. È terreno fertile per un software che tolga lavoro amministrativo, non solo per un "tracking" in più.

---

## 2. Il mercato — cosa sappiamo (e cosa NO)

Fatto con disciplina esplicita FACT / ESTIMATE / HYPOTHESIS — vedi `research/container-trucking-market.md` per i dettagli e le fonti citate.

- **Traffico container Liguria (2025)**: ~4,3 milioni di TEU/anno sui tre porti (Genova + Savona-Vado + La Spezia) — FACT, da fonti pubbliche portuali.
- **Truck moves stimati**: ~1,5 milioni/anno (range onesto 1,1–2,0M), con metodologia esplicita a 6 assunzioni dichiarate — **ESTIMATE**, verificato di ordine di grandezza contro un dato indipendente (~4.000 mezzi/giorno ai varchi di Genova, fonte Trasportounito).
- **Numero di aziende target in Liguria** (trasportatori "core container", non autotrasporto generico): **100–180, centro ~140** — **ESTIMATE con incertezza dichiarata ±30-35%**. Non esiste un elenco pubblico diretto: nessuna fonte filtra l'Albo Autotrasportatori per "fa container".
- **SAM annuo Liguria** (scenario centrale, 140 aziende): **€1,4M (ACV 10k€) / €2,8M (ACV 20k€) / €4,2M (ACV 30k€)**.
- **Attenzione**: c'è una discrepanza non risolta tra due numeri trovati in sessioni di ricerca diverse per lo stesso Albo Autotrasportatori (99.321 vs 76.083 aziende attive) — nessuna fonte primaria raggiunta direttamente. **Non usare nessuno dei due numeri in un deck o investor doc senza verificarlo prima su alboautotrasporto.it.**
- **TAM nazionale/Europa**: non calcolato seriamente, richiederebbe ricerca dedicata porto per porto (Livorno, Trieste, Venezia, poi Barcellona/Valencia). Qualsiasi numero oggi in giro è una proiezione grezza, da trattare come tale.

---

## 3. Il workflow che il prodotto deve coprire

Il cuore del prodotto è questa catena (ogni schermata deve rispondere a "dove si trova questo ordine qui dentro, cosa serve fare adesso"):

```
TRANSPORT ORDER → CONTAINER READINESS → DISPATCH → EXECUTION → DELIVERY → EMPTY RETURN → DOCUMENTS/ACCESSORIALS → INVOICE READY
```

Persona: il **dispatcher/responsabile traffico** dentro un'azienda di autotrasporto container (non lo spedizioniere, non il cliente finale, non l'autista — quello ha un flusso separato).

Glossario minimo per capire di cosa si parla (dettagli completi in `research/container-trucking-workflow.md`):

| Termine | Significato |
|---|---|
| Carrier release | la shipping line autorizza il rilascio del container |
| Customs release | la dogana ha sdoganato la merce |
| Terminal availability | il container è fisicamente disponibile nel piazzale |
| Slot/appointment | prenotazione oraria per il ritiro al terminal |
| Last free day (LFD) | ultimo giorno senza penale |
| Demurrage / Detention | penali per container fermo oltre il LFD (al terminal / fuori dal terminal) |
| EIR | verbale di stato del container al momento del ritiro |
| POD | prova di consegna firmata dal cliente |
| Empty return | restituzione del container vuoto dopo l'uso |
| Street turn / triangolazione | il container vuoto va direttamente a un altro cliente invece di tornare al deposito — **non costruito**, serve conferma che sia una pratica reale e frequente in Italia prima di investirci |
| Accessorial | costi extra (attese, pesature) spesso dimenticati in fattura — probabilmente il pain economico più concreto e misurabile |

**Dove si perde tempo/soldi oggi** (matrice pain, stessa fonte): i pain più "diretti" su denaro/fatturazione sono readiness check, empty return/LFD tracking, raccolta POD, waiting time non fatturato, accessorial billing, fatturazione finale. Da confermare quali pesano di più con discovery reale — la domanda di apertura in ogni call è: **"apri l'ultimo ordine che hai ricevuto e fammi vedere cosa succede da lì."**

---

## 4. Competitor

Dettagli in `research/container-trucking-competitors.md`. Nessun competitor europeo specializzato in drayage trovato — il vero "competitor" oggi è il PCS regionale + processo manuale.

- **PortPro** (USA, drayOS): il riferimento più vicino concettualmente. Ha già un'espansione a Rotterdam — trattarlo come concorrente europeo potenziale, non solo riferimento USA. Cosa copiare: auto-order-entry da email/PDF, notifiche demurrage-prevention, portale self-service cliente. Cosa NON copiare: tutto ciò che è USA-specifico (chassis pool, ELD/FMCSA, EDI doganale USA).
- **Qargo**: TMS generalista belga (non drayage-specifico), mercato UK/BE/NL/IE/FR, non Italia. Non è un vero competitor diretto.
- **Raft**: piattaforma AI per freight forwarder/customs broker — non è un competitor di trasportatori.
- **TruckerZoom, Rose Rocket**: altri riferimenti minori, vedi documento per dettagli.

---

## 5. Cosa esiste oggi nel prodotto (stato tecnico)

Repo: **`lasagnealpesto/logistic`**, branch principale `main`. Next.js (App Router) + Supabase + Tailwind, deployato su Vercel con deploy automatico a ogni merge su `main`.

Il repo ha **4 moduli** (si passa da uno all'altro con uno switcher in alto nella sidebar):

1. **Porti** — modulo originale per spedizionieri/freight forwarder. Persona sbagliata per la tesi attuale, il suo destino è deliberatamente non deciso (si decide dopo la discovery sul container trucking).
2. **Flotte** — autotrasporto generico, motore di pianificazione mezzi/autisti + "Documenti trasporto" (flusso ordine → DDT → POD → fattura).
3. **Dogana** — estrazione documenti doganali (mock).
4. **Container** ⭐ — **il modulo nuovo, costruito per la tesi attuale**. È quello che conta.

### Il modulo Container, nel dettaglio

Copre oggi le capability **B (container readiness)**, **C (exception management)** e un pezzo di **D (dispatch)** e **G (billing)** del workflow sopra — non tutte le 7 capability pensate (A: AI order intake vero e proprio con parsing email/PDF non è ancora costruito, è ancora solo intake strutturato manuale; E: street turn deliberatamente escluso; F: driver flow non toccato in questo modulo).

Cosa fa oggi, concretamente:

- **Dashboard "Centro comando container"**: non una tabella piatta, ma colonne per fase operativa (le stesse fasi del workflow sopra), ordinate per urgenza (giorni al last free day), con filtro per porto.
- **"Attenzione oggi"**: non un cruscotto di grafici — una lista prioritizzata delle cose che richiedono attenzione ORA (blocco doganale, container pronto senza autista assegnato, slot non prenotato, last free day imminente/scaduto, attesa oltre soglia, mezzo incompatibile col container reefer/ADR assegnato, documenti mancanti per fatturare).
- **Nuovo ordine**: form per far entrare un ordine come arriva davvero il giorno 1 (readiness a zero, tutto da verificare).
- **Dettaglio ordine**: checklist readiness (carrier/customs/terminal/slot), assegnazione autista+mezzo (con controllo di compatibilità reefer/ADR — non si può assegnare un container frigo a un mezzo senza presa elettrica), timeline esecuzione, raccolta EIR/POD, e **non si può segnare un ordine come fatturato finché EIR e POD non sono raccolti** — rispecchia un pain reale, non è un dettaglio tecnico.

**È tutto demo/dati finti**: nessun collegamento a terminal/PCS reali, nessuna integrazione email/EDI, nessun backend persistente per questo modulo (stato solo in memoria nel browser). Serve a mostrare il concetto a un prospect, non è ancora uno strumento operativo vero.

**Link live**: deployato automaticamente su Vercel ad ogni merge su `main`. Il dominio `*.vercel.app` ha però la **protezione SSO di Vercel attiva** — chi non ha accesso all'account Vercel del team vede una pagina di login, non l'app. Prima di mostrarlo a un prospect o dare il link al nuovo dev, va disattivata la protezione oppure collegato un dominio custom (che bypassa la SSO).

### Ricerca su integrazioni terminal (per capire cosa è automatizzabile)

Vedi `research/container-trucking-terminal-integrations.md`. Trovata **una sola API pubblica confermata e gratuita**: **Vado Gateway (APM Terminals)**, TERMPoint. Genova (PSA Prà/SECH) e La Spezia (LSCT/Terminal del Golfo) non hanno API pubblica documentata — serve contatto diretto. C'è uno sforzo nazionale di interoperabilità PCS (PNRR, ~250M€) ma con orizzonte 1-2 anni, non utilizzabile oggi. **Decisione presa**: il prodotto V1 non dipende dall'automazione dello slot — mostrare "slot mancante — azione richiesta" ed eseguire manualmente nel portale esterno è un comportamento accettabile, non un difetto da risolvere subito.

---

## 6. GTM — a che punto siamo con le vendite

Tutto documentato in `gtm/` e sincronizzato su Notion (workspace personale, pagina **"Movr - Container Trucking Liguria"**, separata dal vecchio database spedizionieri).

- **62 aziende** profilate finora (obiettivo: 100), ognuna con: sito, città, porti serviti, se è "core container" o no, flotta, dipendenti, fatturato, proprietà/subappalto mezzi, reefer/ADR, TMS attuale, decision maker, LinkedIn, contatto, fonti, classificazione A/B/C.
- **Classificazione**: 8 aziende A (contattare subito), 18 B (interessanti), 36 C (fit debole).
- Notion ha viste pronte: Kanban per stato outreach, vista "Da chiamare (in ordine)" con le 26 A/B in ordine di priorità, grafico KPI per misurare il lavoro fatto. C'è una **"Guida operativa Day 1"** pensata per chi non ha accesso al repo (il sales da assumere) — autosufficiente, con script di chiamata pronti.
- **`gtm/discovery-playbook.md`**: script pronti LinkedIn/email/WhatsApp/chiamata da 30 minuti, con la domanda di apertura ("apri l'ultimo ordine ricevuto...") e una scala di evidenza (da "bello" a "paga/firma una LOI").
- **Due nomi da verificare prima di chiamare**: "Mainoldi Autotrasporti" (possibile collegamento non confermato col presidente regionale CNA FITA Liguria — se confermato, contatto ad alto valore per la rete associativa) e "NSH/Overservice/Overlogistics/Triton" (dati che sembrano precedere il 2019, verificare che esista ancora con lo stesso assetto).
- **Stato reale**: nessuna chiamata ancora fatta. Zero design partner. Il prossimo passo pratico è iniziare l'outreach manuale su questa lista.

---

## 7. Decisioni prese finora (non ridiscutere senza un buon motivo)

1. **Un solo verticale**: container trucking, non 3 ICP in parallelo.
2. **Beachhead geografico**: Genova, Savona/Vado, La Spezia prima di tutto il resto (poi eventualmente Livorno/Trieste, poi Europa — Barcellona/Valencia).
3. **V1 non dipende da integrazioni terminal reali** — comportamento manuale-assistito accettabile.
4. **Street turn escluso dal V1** finché la discovery non conferma che è un pain reale e frequente in Italia.
5. **Niente feature aggiunte "perché sembrano belle"** — ogni pezzo di prodotto deve rispondere a un pain già documentato nella ricerca, documentato PRIMA di scrivere codice (vedi `product/container-trucking-v1.md` per il pattern: ogni capability è legata a un pain + un KPI + cosa del codice esistente si riusa).
6. **Si assumono due persone**: un sales/generalista per l'outreach manuale (demo + domande + richiesta design partnership) e un developer per far evolvere il prodotto sui feedback reali dei design partner.

---

## 8. Cosa resta aperto (da risolvere con discovery reale, non a tavolino)

- Quale fascia di flotta (numero mezzi) ha la willingness-to-pay più alta?
- Chi è davvero il buyer: titolare, ops manager, transport manager?
- I trasportatori vogliono sostituire il loro TMS attuale o aggiungere Movr sopra?
- Quanto pesa davvero in euro/anno l'accessorial non fatturato?
- Quanto è diffusa la pratica dello street turn in Liguria?
- Qual è l'ACV chiudibile senza procurement enterprise?
- Risolvere la discrepanza sul numero di aziende Albo Autotrasportatori (99.321 vs 76.083) su fonte primaria prima di usarla in un documento esterno.

---

## 9. Prossimi passi concreti

1. Disattivare la SSO protection su Vercel (o collegare un dominio custom) prima di condividere il link della demo.
2. Assumere/ingaggiare il sales per iniziare l'outreach manuale sulle 62 (presto 100) aziende in Notion, partendo dalla lista ordinata "Da chiamare".
3. Le prime chiamate sono **discovery pura**, non demo di prodotto — fino a quando il developer non ha ampliato il prodotto sui feedback reali.
4. Portare il prodotto a 100 aziende profilate (attualmente 62).
5. Completare almeno 10 interview di discovery prima di espandere ulteriormente lo scope prodotto.
6. Rivedere roadmap V1→V2 (`product/container-trucking-roadmap.md`) con i primi feedback reali, non a tavolino.

---

## 10. Come è fatto il repo (per orientarsi velocemente)

- `MOVR_HANDOFF.md` — **la fonte di verità strategica**, più dettagliata di questo file, pensata per essere letta da qualsiasi AI prima di prendere decisioni di prodotto/mercato/GTM. Se questo file e quello divergono, fidati di `MOVR_HANDOFF.md` (è quello mantenuto vivo dentro al repo).
- `research/` — le 4 ricerche: workflow/terminologia, competitor, integrazioni terminal, mercato TAM/SAM. Tutte con disciplina FACT/ESTIMATE/HYPOTHESIS esplicita e fonti citate.
- `product/` — spec prodotto (capability A-G legate a pain+KPI+riuso codice) e roadmap V1→V2→OS.
- `gtm/` — playbook discovery, CSV delle 62 aziende, shortlist top design partner, setup Notion.
- `lib/container/`, `app/container/` — il codice del modulo Container (tipi, motore eccezioni, dati demo, stato, UI).
- `kb/` — materiale più vecchio, dall'epoca spedizionieri/outreach generico. Non buttarlo, ma non è la priorità oggi.

### Com'è stato costruito finora

Questo prodotto e questa ricerca sono stati fatti con **Claude Code**, un agente AI da riga di comando che legge/scrive direttamente nel repo, fa ricerche, e può aprire pull request. Le convenzioni per farlo lavorare bene su questo repo sono scritte in `CLAUDE.md` (che importa `AGENTS.md`) — chi continua a usare un assistente AI su questo repo dovrebbe farglieli leggere prima di modificare codice. Flusso di lavoro standard usato finora: branch dedicato → commit → push → pull request → merge su `main` (Vercel fa il deploy automatico a ogni merge).

---

## 11. Una riga per ogni documento (indice rapido)

| File | Cosa contiene |
|---|---|
| `MOVR_HANDOFF.md` | Fonte di verità strategica completa (tesi, mercato, ICP, discovery plan) |
| `research/container-trucking-workflow.md` | Workflow, glossario, matrice pain |
| `research/container-trucking-market.md` | TAM/SAM bottom-up con metodologia esplicita |
| `research/container-trucking-competitors.md` | PortPro, Qargo, Raft, ecc. — cosa copiare e cosa no |
| `research/container-trucking-terminal-integrations.md` | Quali terminal hanno API vere (solo Vado Gateway) |
| `product/container-trucking-v1.md` | Spec prodotto capability per capability + audit di cosa è stato costruito |
| `product/container-trucking-roadmap.md` | V1 → V2 → visione OS completo |
| `gtm/discovery-playbook.md` | Script di chiamata/email/LinkedIn pronti |
| `gtm/container-trucking-prospects.csv` | Le 62 aziende profilate |
| `gtm/top-20-design-partners.md` | Shortlist prioritizzata |
| `gtm/notion-setup.md` | Come è organizzato il Notion operativo |

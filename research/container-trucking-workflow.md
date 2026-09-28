# Container trucking — workflow e terminologia

Ricostruzione del workflow import/export di un container gestito da un'azienda di autotrasporto (drayage), i ruoli coinvolti, e dove si perde tempo/denaro oggi. Base: conoscenza di dominio consolidata sulla pratica internazionale del container trucking/drayage (terminologia in larga parte anglosassone perché è così che circola nel settore anche in Italia). **Etichettatura**: la terminologia e la sequenza generale sono **FACT** (pratica di settore consolidata, non specifica di un singolo paese). Ogni affermazione su *come funziona specificamente in Liguria* (chi fa cosa, quali sistemi si usano, quanto è diffusa una pratica) è marcata **HYPOTHESIS** finché non confermata in discovery — questo documento descrive il modello generale da cui partire per le interview, non un fatto verificato sul campo italiano.

## 1. Ruoli

| Ruolo | Cosa fa | Chi paga chi |
|---|---|---|
| **Consignee / cliente finale** | Importatore (import) o esportatore (export) proprietario della merce | Paga il freight forwarder e/o direttamente il trasportatore per la tratta terrestre |
| **Freight forwarder / spedizioniere** | Organizza il trasporto end-to-end per conto del cliente, spesso subappalta la tratta terrestre a un'azienda di autotrasporto | Intermediario: riceve dal cliente, paga vettore/carrier/trasportatore |
| **Shipping line / carrier marittimo** | Possiede/gestisce la nave e il container (nella maggior parte dei casi il container è di proprietà della shipping line, non del cliente) | Riceve il nolo marittimo, emette il "carrier release" |
| **Terminal portuale** | Gestisce fisicamente lo sbarco/imbarco e lo stoccaggio dei container nel piazzale | Riceve tariffe di movimentazione/sosta dal cliente o dal trasportatore che ritira |
| **Dogana / Agenzia delle Dogane** | Controlla e autorizza l'ingresso/uscita della merce dal punto di vista doganale | Nessun pagamento diretto per il trasportatore, ma un blocco doganale ferma tutto il resto |
| **Trasportatore / azienda di autotrasporto container (il nostro cliente)** | Possiede/gestisce i mezzi (trattori + telai/chassis) e gli autisti, esegue il ritiro/consegna fisica del container | Fatturato dal cliente finale o dal forwarder |
| **Dispatcher / responsabile traffico** | Dentro l'azienda di trasporto: riceve l'ordine, verifica readiness, assegna mezzo/autista, gestisce le eccezioni | Dipendente dell'azienda di trasporto |
| **Autista** | Esegue fisicamente ritiro, consegna, rientro vuoto | Dipendente o subcontractor dell'azienda di trasporto |
| **Depot / deposito container vuoti** | Punto di rientro del container vuoto dopo lo svuotamento (può coincidere col terminal o essere un deposito separato) | Riceve eventuali costi di deposito |

## 2. Workflow import (dal punto di vista del trasportatore)

1. **Order intake** — il trasportatore riceve l'ordine di trasporto dal cliente/forwarder: tipicamente email con PDF/Excel allegato, a volte WhatsApp, raramente EDI diretto. Contiene: numero container, riferimento booking, terminal, cliente, luogo di consegna, scadenze note.
2. **Data entry** — il dispatcher ricopia manualmente i dati dell'ordine nel proprio sistema (foglio Excel, gestionale, o niente — solo email/WhatsApp tenuti a mente).
3. **Container readiness check** — prima di poter pianificare il ritiro, il dispatcher deve verificare più segnali indipendenti, spesso su portali diversi:
   - **Carrier release**: la shipping line ha autorizzato il rilascio del container (nolo pagato, documenti a posto)
   - **Customs release**: la dogana ha sdoganato la merce
   - **Terminal availability**: il container è fisicamente disponibile nel piazzale (è stato scaricato, non è in una posizione di difficile accesso, non ha un "hold" residuo)
   - Se anche uno solo di questi manca, il container non è ritirabile: il dispatcher spesso lo scopre solo mandando l'autista al gate e trovandolo bloccato
4. **Slot / appointment booking** — molti terminal richiedono la prenotazione di uno slot orario per il ritiro (via portale web dedicato al terminal, uno diverso per ogni terminal/porto).
5. **Dispatch / pianificazione** — il dispatcher assegna mezzo e autista, tenendo conto di: posizione attuale del mezzo, compatibilità (reefer serve trattore con presa elettrica, ADR serve patentino e mezzo abilitato), sequenza ottimale della giornata, cut-off orari.
6. **Comunicazione autista** — istruzioni al driver: telefono, WhatsApp, raramente un'app dedicata.
7. **Esecuzione — ritiro** — l'autista si presenta al gate del terminal con i documenti (spesso ancora cartacei o su email dal telefono), preleva il container. Firma/riceve un **EIR** (Equipment Interchange Receipt: documento che certifica stato del container al momento del prelievo — danni, sigillo, ecc.).
8. **Consegna al cliente** — l'autista consegna il container al piazzale/magazzino del cliente finale, ottiene una firma/timbro come prova di consegna (**POD**, Proof of Delivery).
9. **Empty return / rientro vuoto** — una volta svuotato, il container va restituito entro il **last free day** (l'ultimo giorno senza penale). Il deposito di rientro può essere diverso dal terminal di ritiro. Se si sfora il last free day, scattano le penali (vedi demurrage/detention sotto).
10. **Documenti e fatturazione** — solo dopo aver raccolto EIR, POD, eventuali ricevute di waiting time/attese, il trasportatore può emettere fattura al cliente — spesso con ritardo di giorni/settimane perché i documenti fisici (foto dal telefono dell'autista, carta) devono essere raccolti, verificati, e trascritti manualmente nel sistema di fatturazione.

## 3. Workflow export (differenze principali)

Stessa struttura di base, con differenze chiave:
- Si parte dal ritiro del container **vuoto** dal deposito/terminal, non dal ritiro pieno
- Il container va caricato presso il cliente (export packing), poi consegnato al terminal entro il **cut-off** (l'orario oltre il quale il container non fa più in tempo a imbarcarsi sulla nave prevista)
- Serve il **VGM** (Verified Gross Mass — peso verificato del container pieno, obbligatorio per l'imbarco secondo normativa SOLAS internazionale) prima del cut-off
- Il "readiness check" qui riguarda soprattutto disponibilità booking/spazio nave e cut-off, meno la dogana (che agisce più tipicamente sull'export doganale, comunque presente ma con tempistiche diverse dall'import)

## 4. Concetti chiave — glossario

| Termine | Significato |
|---|---|
| **Carrier release** | Autorizzazione della shipping line al rilascio del container (nolo/documenti a posto) |
| **Customs release** | Sdoganamento — autorizzazione doganale al rilascio della merce |
| **Terminal availability** | Il container è fisicamente disponibile e prelevabile nel piazzale del terminal |
| **Slot / appointment** | Prenotazione di una finestra oraria per il ritiro/consegna al gate del terminal |
| **Cut-off** | Orario limite oltre il quale il container non fa più in tempo per la nave prevista (export) |
| **Last free day (LFD)** | Ultimo giorno di sosta/uso del container senza penale |
| **Demurrage** | Penale per il container fermo nel terminal oltre il last free day (il terminal/carrier addebita al trasportatore/cliente) |
| **Detention** | Penale per il container fuori dal terminal (in uso dal trasportatore/cliente) oltre il tempo concesso, prima del rientro vuoto |
| **VGM** (Verified Gross Mass) | Peso lordo verificato del container pieno, obbligatorio prima dell'imbarco (regola SOLAS) |
| **EIR** (Equipment Interchange Receipt) | Documento che certifica lo stato del container (danni, sigillo) al momento del passaggio di consegna tra terminal e trasportatore |
| **POD** (Proof of Delivery) | Prova di consegna firmata dal cliente finale |
| **Empty return** | Restituzione del container vuoto dopo l'uso, a un deposito designato |
| **Street turn / triangolazione / dual transactions** | Pratica per cui un container vuoto, invece di tornare al deposito, viene portato direttamente a un altro cliente che deve fare un export, saltando un doppio viaggio a vuoto. Richiede autorizzazione della shipping line (il container resta di sua proprietà) e compatibilità (stesso tipo/dimensione container, stessa linea) |
| **Reefer** | Container refrigerato — richiede trattore con presa elettrica e monitoraggio temperatura |
| **ADR** | Merci pericolose — richiede patentino autista e mezzo abilitato |
| **Waiting time** | Tempo di attesa dell'autista al gate/cliente oltre una soglia contrattuale, spesso fatturabile come accessorial ma raramente tracciato in modo sistematico |
| **Accessorial charges** | Costi extra oltre la tariffa base (attese, pesature, riconsegne, storage) — la categoria di ricavo più a rischio di "sparire" perché non tracciata o non fatturata |
| **Port congestion** | Rallentamento generale del porto (troppe navi/container, capacità insufficiente) che si ripercuote su tutta la catena a valle |

## 5. Dove si perde tempo e denaro oggi — matrice dei pain

| Processo | Manuale? | Copia-incolla? | Telefono/email/WhatsApp? | Portali separati? | Genera errori? | Fa perdere denaro? | Rallenta la fatturazione? |
|---|---|---|---|---|---|---|---|
| Order intake | Sì (quasi sempre) | Sì | Sì | — | Sì (dati letti a mano da PDF/email) | Indiretto | Sì (parte da qui il ritardo) |
| Readiness check (carrier/customs/terminal) | Sì | — | A volte (telefonate per conferma) | **Sì, uno per fonte** | Sì (si scopre il blocco solo al gate) | Sì (viaggio a vuoto, mezzo fermo) | No diretto |
| Slot booking | Sì (portale terminal) | — | — | Sì (uno per terminal) | Sì (slot sbagliato/mancato) | Sì (attese, mancati appuntamenti) | No diretto |
| Dispatch | Parzialmente manuale (esperienza del dispatcher) | — | — | — | Possibile (assegnazione sub-ottimale) | Indiretto (km a vuoto, straordinari) | No diretto |
| Comunicazione autista | Sì (telefono/WhatsApp) | — | Sì | — | Sì (istruzioni perse/fraintese) | Indiretto | No diretto |
| Esecuzione (EIR, danni) | Sì (carta/foto telefono) | — | — | — | Sì (documenti persi) | **Sì diretto** (contestazioni danni) | Sì |
| Empty return / LFD tracking | Spesso manuale/a memoria | — | — | — | Sì (si sfora il LFD senza accorgersene) | **Sì diretto** (demurrage/detention) | No diretto |
| Street turn | Raramente sistematico (HYPOTHESIS: dipende da quanto è diffuso in Italia — da verificare) | — | Sì | — | — | Opportunità mancata più che errore | No diretto |
| POD raccolta | Sì (foto/carta) | Sì (ritrascritto per fatturare) | — | — | Sì | Indiretto | **Sì diretto** |
| Waiting time tracking | Quasi mai sistematico | — | — | — | — | **Sì diretto** (non fatturato) | Sì |
| Accessorial billing | Manuale, spesso dimenticato | Sì | — | — | Sì (dimenticanze) | **Sì diretto**, probabilmente il pain economico più concreto e misurabile | Sì |
| Fatturazione finale | Manuale, richiede tutti i documenti sopra | Sì | — | — | Sì | Indiretto | **Sì diretto** — è il collo di bottiglia finale di tutta la catena |

**Lettura**: i pain con "Sì diretto" su denaro/fatturazione (readiness, empty return/LFD, POD, waiting time, accessorial, fatturazione) sono i candidati più forti per il wedge iniziale — sono anche quelli più facilmente misurabili in euro, il che li rende più difendibili in una vendita basata su ROI (vedi KPI in `product/container-trucking-v1.md`). Da confermare quali pesano davvero di più via discovery reale (la domanda aperta: "apri l'ultimo ordine e fammi vedere cosa succede da lì" — vedi `gtm/discovery-playbook.md`), non assumerlo da questa tabella.

## 6. Domande aperte da risolvere in discovery (non assumere le risposte)

- **OPEN QUESTION**: quanto è diffusa la pratica dello street turn/triangolazione in Italia? È autorizzata facilmente dalle shipping line sui porti liguri? Vale la pena costruirci una feature dedicata in V1 o è un caso raro?
- **OPEN QUESTION**: quanto dei "readiness check" (carrier/customs/terminal) è già disponibile via portale con login, e quanto richiede telefonate/email? (collegato alla ricerca terminal/PCS in `research/`)
- **OPEN QUESTION**: qual è oggi lo strumento più usato per "tenere tutto insieme" in un'azienda di autotrasporto container ligure — Excel? Gestionale generico? Niente, solo esperienza del dispatcher?
- **OPEN QUESTION**: quanto pesa realmente in euro/anno l'accessorial non fatturato, per un'azienda tipo 20-50 mezzi? (nessuna fonte pubblica plausibile — solo la discovery diretta può rispondere)

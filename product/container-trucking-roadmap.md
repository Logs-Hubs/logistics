# Movr per container trucking — roadmap V1 → V2 → OS

Roadmap **HYPOTHESIS**, da rivedere dopo le prime interview di discovery (vedi `gtm/discovery-playbook.md`). Non è un piano di sviluppo impegnato, è la direzione di lavoro attuale.

## V1 — Beachhead Liguria, loop centrale, senza dipendenze rischiose

Obiettivo: 4 design partner che usano il loop `transport order → readiness → dispatch → execution → delivery → empty return → documents → invoice ready` su almeno una parte dei loro ordini reali, anche se manualmente in alcuni punti.

Cosa include (capability A-G di `container-trucking-v1.md`), in ordine di probabile priorità (da confermare in discovery, non deciso a tavolino):

1. **Exception management** — il pezzo più riusabile del codice attuale (Exception Center), il modo più veloce di mostrare valore in una demo
2. **Billing/margin recovery** — riusa "Documenti trasporto", probabilmente il ROI più facile da dimostrare in euro
3. **Container readiness** — riusa il pattern readiness del modulo Dogana, ma dipende da quanto sono automatizzabili i segnali (vedi vincolo sotto)
4. **Driver flow** — riscrittura dell'app iOS esistente sul dominio giusto
5. **Dispatch assistito** — estensione del motore di pianificazione Flotte
6. **AI order intake** — da costruire da zero, probabilmente la capability più complessa tecnicamente, quindi più tardi nel V1 o già in V2
7. **Street turn** — esclusa dal V1 finché non c'è evidenza che valga la pena (vedi OPEN QUESTION in `container-trucking-workflow.md`)

**Vincolo esplicito**: V1 non dipende dall'automazione dello slot/terminal. Dove l'integrazione non è disponibile (probabile, vedi `research/container-trucking-terminal-integrations.md`), Movr deve poter dire "slot missing — action required" e lasciare l'esecuzione manuale nel portale esterno, senza bloccare il resto del workflow.

**Geografia**: Genova, Savona/Vado Ligure, La Spezia. Nessuna localizzazione oltre l'italiano necessaria in questa fase.

## V2 — Consolidamento + primi tentativi di integrazione reale

Condizioni per passare a V2 (non calendario, ma soglie): almeno 3-4 design partner attivi sul loop V1, almeno un dataset reale di ordini analizzato, almeno un willingness-to-pay confermato.

Possibili direzioni (da prioritizzare con i design partner, non a priori):
- Integrazione reale con almeno un terminal/PCS ligure, se la ricerca tecnica lo conferma fattibile (vedi `research/container-trucking-terminal-integrations.md`) — anche parziale (es. solo lettura stato slot, non prenotazione automatica)
- Street turn, se la discovery V1 ha mostrato che è un pain reale e frequente
- Espansione geografica nazionale: Livorno, Trieste, altri porti italiani — stesso ICP, stesso wedge, replicare il playbook di discovery/outreach usato in Liguria
- AI order intake più maturo (se non già fatto in V1), con supporto a più formati/lingue

## OS completo — the operating system for container trucking

Visione di lungo periodo, non pianificata in dettaglio ora. Direzioni plausibili una volta consolidato il prodotto core su più mercati:

- Espansione europea, a partire potenzialmente da Barcelona/Valencia (porti spagnoli, stesso tipo di problema — da validare con la stessa disciplina usata in Liguria, non assumere che il workflow sia identico)
- Rete multi-lato: se Movr ha visibilità su molti trasportatori in una zona, possibile diventare anche il layer di coordinamento tra trasportatori e forwarder/shipping line (qui potrebbe rientrare il modulo Porti attuale, se la decisione in `MOVR_HANDOFF.md` §2 va in quella direzione — non deciso)
- Automazione più profonda del dispatch (non solo suggerimento, esecuzione autonoma per i casi semplici, sempre con eccezione gestita da umano — coerente col principio "humans handle exceptions, Movr handles everything else")

## Cosa NON fare, esplicitamente

- Non costruire feature "perché sembrano belle" senza un pain di discovery a supporto (vedi `container-trucking-v1.md`, ogni capability è legata a un pain e un KPI)
- Non rendere nessuna versione dipendente da un'integrazione terminal che non abbiamo verificato essere disponibile
- Non trattare il modulo Porti attuale come "da buttare" o "da tenere" prima della discovery — è una decisione rimandata, non presa

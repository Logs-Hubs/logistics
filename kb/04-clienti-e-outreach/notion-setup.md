# Notion come gestionale outreach (sostituisce Attio)

Decisione del 29/08/2026: Attio richiede un'email di dominio proprio per la registrazione (non accetta Gmail/Yahoo/email personali, vedi [Attio Help Center](https://attio.com/help/reference/account-settings/signing-into-attio)), e l'utente non ne ha una disponibile per questo progetto. Notion la sostituisce come gestionale operativo, con lo stesso schema già pensato in `attio-setup.md` (lasciato nel repo come riferimento, non più la scelta attiva, utile se in futuro l'utente ottiene un'email di dominio e vuole tornare su Attio).

## Perché Notion qui

- Account personale dell'utente, workspace senza team condivisi, separato dal lavoro tecnico/prodotto, come richiesto.
- Accetta email personale, nessun blocco di registrazione.
- **Connettore Notion disponibile in questa sessione** (a differenza di Attio, che non ha mai un connettore utilizzabile per nessuna sessione Claude): significa che una sessione Claude con questo connettore attivo può leggere/scrivere direttamente nel gestionale, non solo consigliare aggiornamenti manuali. Verificare comunque con `ListConnectors` a ogni nuova sessione: la disponibilità del connettore Notion non è garantita per sessione come non lo era per Attio, se assente l'aggiornamento resta manuale, fatto dall'utente nell'interfaccia Notion.
- **Attenzione (28/09/2026)**: una sessione precedente aveva il connettore Notion agganciato al workspace di lavoro dell'utente (non a quello personale): pagina irraggiungibile da lì, ricerca restituiva solo contenuti aziendali estranei a questo progetto (GTM/vendite di un'altra azienda). Risolto ricollegando esplicitamente il Notion personale a questa sessione. **Prima di assumere che il connettore Notion "funzioni", verificare con una ricerca (`notion-search`) che il workspace agganciato sia quello giusto.** Un connettore "disponibile" non garantisce che punti al workspace corretto.

## Convenzione di stile su Notion

**Mai usare il trattino lungo (em dash, "—") nel contenuto scritto su Notion** (titoli, pagine, proprietà). Usare invece punto, virgola, due punti o un trattino normale con spazi (" - "). Richiesto esplicitamente dall'utente il 28/09/2026, applicato retroattivamente a tutto il contenuto esistente in quel momento (titoli delle pagine/database, guida operativa, due campi Note che lo contenevano).

## Dove si trova

- Pagina principale: **Movr - Outreach Porti** (rinominata il 28/09/2026, prima "Movr — Outreach Porti Genova") — https://app.notion.com/p/3cb790abc4b281ee8cd3c75fc6306db7
- Database **Aziende - Outreach Porti** (rinominato allo stesso modo, dentro la pagina sopra) — https://app.notion.com/p/949243a620bc427c93c06ec35249b891. **Database unificato dal 28/09/2026**: contiene sia le aziende spedizionieri sia quelle del verticale autotrasporto container (vedi sotto), distinte dal campo **Settore**.
- **Guida operativa Day 1** (sottopagina della pagina principale) — https://app.notion.com/p/3e9790abc4b2813ebf00e5daa1bb66b1 — script di chiamata, struttura interview, pain score, script design partner ask, tutto inline: pensata per un nuovo entrato che gestisce sales/outreach/interview e non ha accesso al repo tecnico. Creata il 28/09/2026, riscritta lo stesso giorno in forma più schematica (titoli, elenchi puntati, tabelle) su richiesta esplicita dell'utente.

## Viste

- **Table** (default) — tutte le colonne, incluso Settore.
- **Pipeline (Kanban)** — raggruppata per "Stato outreach".
- **Per porto** — raggruppata per "Porto" (solo per le righe Spedizionieri: le righe Autotrasporto Container usano "Porti serviti", un campo diverso, quindi finiscono nel gruppo vuoto).
- **Per settore** (nuova, 28/09/2026) — Kanban raggruppato per "Settore": il modo più rapido per vedere solo uno dei due verticali.
- **Da chiamare (in ordine)** (nuova, 28/09/2026) — tabella filtrata su "Ordine di chiamata" non vuoto, ordinata ascendente: le 26 aziende A/B del verticale container trucking da lavorare per prime (il verticale spedizionieri non usa questo campo).
- **KPI - stato outreach** (nuova, 28/09/2026) — grafico a barre, conta le aziende per stato.

## Schema (identico nello spirito allo schema Attio già pensato, esteso il 28/09/2026 per unificare i due verticali)

| Campo | Tipo Notion | Valori | Usato da |
|---|---|---|---|
| Azienda | Title | nome azienda | entrambi |
| Settore | Select | Spedizionieri / Autotrasporto Container | entrambi (nuovo 28/09/2026) |
| Priorità | Select | P0 - apre la rete / Alta / Secondo giro | Spedizionieri |
| Classificazione | Select | A / B / C | Autotrasporto Container (nuovo 28/09/2026) |
| Stato outreach | Select | Non chiamato · Non risposto · Richiamare · Centralino - referente non raggiunto · Rifiutato · Slot fissato · Demo fissata · Interview fatta · Design partner ask fatto · Design partner confermato | entrambi ("Demo fissata" aggiunta 28/09/2026 per il container trucking) |
| Porto | Select | Genova / La Spezia / Livorno / Trieste / Venezia / Napoli / Salerno | Spedizionieri |
| Porti serviti | Multi-select | Genova / Savona-Vado / La Spezia / Altro-hinterland | Autotrasporto Container (nuovo 28/09/2026, un'azienda può servire più porti) |
| Telefono | Testo | numero principale, alternativi nelle Note | entrambi |
| Email | Email | | entrambi |
| Referente | Testo | nome e ruolo (per il container trucking: ex campo "Decision maker") | entrambi |
| Tentativi | Numero | contatore chiamate | entrambi |
| Prossimo step | Data | quando richiamare o slot fissato | entrambi |
| Interview fatta | Checkbox | | entrambi |
| Pain score compilato | Checkbox | | entrambi |
| Bozza email pronta | Checkbox | | Spedizionieri |
| Ordine di chiamata | Numero | ordine consigliato di contatto, solo per le 26 aziende A/B | Autotrasporto Container (nuovo 28/09/2026) |
| Perché interessante | Testo lungo | motivazione dalla ricerca | Autotrasporto Container (nuovo 28/09/2026) |
| Fonti | Testo lungo | citazioni delle fonti usate in ricerca | Autotrasporto Container (nuovo 28/09/2026) |
| Note | Testo lungo | anomalie, dettagli chiamata, impressioni | entrambi |

**Popolato per intero**: 117 aziende totali nel database (verificato via query il 28/09/2026) — 55 Spedizionieri (12 Genova + 43 altri porti: 7 La Spezia, 8 Livorno, 8 Trieste, 8 Venezia, 8 Napoli, 4 Salerno) + 62 Autotrasporto Container (migrate lo stesso giorno dal database separato "Aziende - Container Trucking", ora cestinato — vedi `gtm/notion-setup.md`). Dati Spedizionieri aggiornati dopo la risoluzione delle anomalie (Mastermar, Parodi Forwarding, Ambra Mar, Oliaro) e la ricerca email per la prima outreach.

**Tabella Pain Score su ogni pagina azienda**: solo per le 55 pagine Spedizionieri (dal 28/09/2026, prima della fusione), ciascuna ha in fondo una tabella pronta da compilare (Filone / Frequenza / Tempo perso / Costo / Criticità / Workaround attuale / Owner, i 5 filoni già come righe). Non presente sulle 62 pagine Autotrasporto Container — da aggiungere se si inizia a condurre interview sul serio su quel verticale.

## Uso quotidiano

Vedi **Guida operativa Day 1** (link sopra) per il processo completo, è la stessa pensata per chi entra nuovo, vale anche per l'utente. In sintesi: dopo ogni chiamata aggiornare Stato outreach, Tentativi, Prossimo step, Note; a interview completata spuntare "Interview fatta", compilare la tabella Pain Score in fondo alla pagina azienda, spuntare "Pain score compilato".

Una sessione Claude con il connettore Notion attivo **e agganciato al workspace giusto** (vedi nota sopra) può fare questi aggiornamenti direttamente su richiesta, invece di limitarsi a consigliarli.

## Continuità tra sessioni

Il repo resta la **fonte di verità durevole**, leggibile da qualunque sessione anche senza connettore Notion attivo, ma può disallinearsi da Notion nel tempo (è già successo più volte: vedi cronologia sopra). Per lo Spedizionieri: `kb/04-clienti-e-outreach/tracker-outreach.md` (Genova) e `tracker-altri-porti.md` (altri 6 porti). Per l'Autotrasporto Container: `gtm/container-trucking-prospects.csv`. Notion è lo strumento operativo per il lavoro quotidiano quando il connettore è disponibile **e punta al workspace corretto**. Se una sessione futura non ha il connettore Notion, o non è sicura che punti al posto giusto, deve trattare i file del repo come riferimento ma **verificare con l'utente lo stato reale** prima di assumere che siano sincronizzati.

# Notion come gestionale outreach (sostituisce Attio)

Decisione del 29/08/2026: Attio richiede un'email di dominio proprio per la registrazione (non accetta Gmail/Yahoo/email personali — [Attio Help Center](https://attio.com/help/reference/account-settings/signing-into-attio)), e l'utente non ne ha una disponibile per questo progetto. Notion la sostituisce come gestionale operativo, con lo stesso schema già pensato in `attio-setup.md` (lasciato nel repo come riferimento, non più la scelta attiva — utile se in futuro l'utente ottiene un'email di dominio e vuole tornare su Attio).

## Perché Notion qui

- Account personale dell'utente, workspace senza team condivisi — separato dal lavoro tecnico/prodotto, come richiesto.
- Accetta email personale, nessun blocco di registrazione.
- **Connettore Notion disponibile in questa sessione** (a differenza di Attio, che non ha mai un connettore utilizzabile per nessuna sessione Claude): significa che una sessione Claude con questo connettore attivo può leggere/scrivere direttamente nel gestionale, non solo consigliare aggiornamenti manuali. Verificare comunque con `ListConnectors` a ogni nuova sessione — la disponibilità del connettore Notion non è garantita per sessione come non lo era per Attio: se assente, l'aggiornamento resta manuale, fatto dall'utente nell'interfaccia Notion.
- **Attenzione (28/09/2026)**: una sessione precedente aveva il connettore Notion agganciato al workspace di lavoro dell'utente (non a quello personale) — pagina irraggiungibile da lì, ricerca restituiva solo contenuti aziendali estranei a questo progetto (GTM/vendite di un'altra azienda). Risolto ricollegando esplicitamente il Notion personale a questa sessione. **Prima di assumere che il connettore Notion "funzioni", verificare con una ricerca (`notion-search`) che il workspace agganciato sia quello giusto** — un connettore "disponibile" non garantisce che punti al workspace corretto.

## Dove si trova

- Pagina principale: **Movr — Outreach Porti Genova** — https://app.notion.com/p/3cb790abc4b281ee8cd3c75fc6306db7
- Database **Aziende — Outreach Porti Genova** (dentro la pagina sopra) — https://app.notion.com/p/949243a620bc427c93c06ec35249b891 — viste **Pipeline (Kanban)** raggruppata per "Stato outreach" e **Per porto** raggruppata per "Porto".
- **Guida operativa — Day 1** (sottopagina della pagina principale) — https://app.notion.com/p/3e9790abc4b2813ebf00e5daa1bb66b1 — script di chiamata, struttura interview, pain score, script design partner ask, tutto inline: pensata per un nuovo entrato che gestisce sales/outreach/interview e non ha accesso al repo tecnico. Creata il 28/09/2026.

## Schema (identico nello spirito allo schema Attio già pensato)

| Campo | Tipo Notion | Valori |
|---|---|---|
| Azienda | Title | nome azienda |
| Priorità | Select | P0 - apre la rete / Alta / Secondo giro |
| Stato outreach | Select | Non chiamato · Non risposto · Richiamare · Centralino - referente non raggiunto · Rifiutato · Slot fissato · Interview fatta · Design partner ask fatto · Design partner confermato |
| Porto | Select | Genova / La Spezia / Livorno / Trieste / Venezia / Napoli / Salerno — un unico database consolidato per tutte le liste di outreach, non uno per porto |
| Telefono | Testo | numero principale, alternativi nelle Note |
| Email | Email | |
| Referente | Testo | nome e ruolo |
| Tentativi | Numero | contatore chiamate |
| Prossimo step | Data | quando richiamare o slot fissato |
| Interview fatta | Checkbox | |
| Pain score compilato | Checkbox | |
| Bozza email pronta | Checkbox | |
| Note | Testo lungo | anomalie, dettagli chiamata, impressioni |

**Popolato per intero**: tutte e 55 le aziende sono nel database (12 Genova + 43 altri porti: 7 La Spezia, 8 Livorno, 8 Trieste, 8 Venezia, 8 Napoli, 4 Salerno — verificato via query il 28/09/2026), non solo le 12 genovesi come indicava una versione precedente di questo file. Dati aggiornati dopo la risoluzione delle anomalie (Mastermar, Parodi Forwarding, Ambra Mar, Oliaro) e la ricerca email per la prima outreach.

## Uso quotidiano

Vedi **Guida operativa — Day 1** (link sopra) per il processo completo — è la stessa pensata per chi entra nuovo, vale anche per l'utente. In sintesi: dopo ogni chiamata aggiornare Stato outreach, Tentativi, Prossimo step, Note; a interview completata spuntare "Interview fatta" e compilare il pain score.

Una sessione Claude con il connettore Notion attivo **e agganciato al workspace giusto** (vedi nota sopra) può fare questi aggiornamenti direttamente su richiesta, invece di limitarsi a consigliarli.

## Continuità tra sessioni

Il repo (`kb/04-clienti-e-outreach/tracker-outreach.md` per Genova, `tracker-altri-porti.md` per gli altri 6 porti) resta la **fonte di verità durevole**, leggibile da qualunque sessione anche senza connettore Notion attivo — ma può disallinearsi da Notion nel tempo (è già successo: Notion aveva tutte e 55 le aziende mentre questo file per settimane ha detto "solo 12", perché nessuno lo aveva aggiornato dopo l'aggiunta degli altri porti). Notion è lo strumento operativo per il lavoro quotidiano quando il connettore è disponibile **e punta al workspace corretto**. Se una sessione futura non ha il connettore Notion, o non è sicura che punti al posto giusto, deve trattare i file del repo come riferimento ma **verificare con l'utente lo stato reale** prima di assumere che siano sincronizzati.

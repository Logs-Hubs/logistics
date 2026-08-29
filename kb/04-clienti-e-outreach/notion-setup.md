# Notion come gestionale outreach (sostituisce Attio)

Decisione del 29/08/2026: Attio richiede un'email di dominio proprio per la registrazione (non accetta Gmail/Yahoo/email personali — [Attio Help Center](https://attio.com/help/reference/account-settings/signing-into-attio)), e l'utente non ne ha una disponibile per questo progetto. Notion la sostituisce come gestionale operativo, con lo stesso schema già pensato in `attio-setup.md` (lasciato nel repo come riferimento, non più la scelta attiva — utile se in futuro l'utente ottiene un'email di dominio e vuole tornare su Attio).

## Perché Notion qui

- Account personale dell'utente, workspace senza team condivisi — separato dal lavoro tecnico/prodotto, come richiesto.
- Accetta email personale, nessun blocco di registrazione.
- **Connettore Notion disponibile in questa sessione** (a differenza di Attio, che non ha mai un connettore utilizzabile per nessuna sessione Claude): significa che una sessione Claude con questo connettore attivo può leggere/scrivere direttamente nel gestionale, non solo consigliare aggiornamenti manuali. Verificare comunque con `ListConnectors` a ogni nuova sessione — la disponibilità del connettore Notion non è garantita per sessione come non lo era per Attio: se assente, l'aggiornamento resta manuale, fatto dall'utente nell'interfaccia Notion.

## Dove si trova

- Pagina principale: **Movr — Outreach Porti Genova** — https://app.notion.com/p/3cb790abc4b281ee8cd3c75fc6306db7
- Database **Aziende — Outreach Porti Genova** (dentro la pagina sopra), vista **Pipeline (Kanban)** raggruppata per "Stato outreach".

## Schema (identico nello spirito allo schema Attio già pensato)

| Campo | Tipo Notion | Valori |
|---|---|---|
| Azienda | Title | nome azienda |
| Priorità | Select | P0 - apre la rete / Alta / Secondo giro |
| Stato outreach | Select | Non chiamato · Non risposto · Richiamare · Centralino - referente non raggiunto · Rifiutato · Slot fissato · Interview fatta · Design partner ask fatto · Design partner confermato |
| Telefono | Testo | numero principale, alternativi nelle Note |
| Referente | Testo | nome e ruolo |
| Tentativi | Numero | contatore chiamate |
| Prossimo step | Data | quando richiamare o slot fissato |
| Interview fatta | Checkbox | |
| Pain score compilato | Checkbox | |
| Note | Testo lungo | anomalie, dettagli chiamata, impressioni |

Le 12 aziende sono già popolate (29/08/2026), con gli stessi dati aggiornati di `tracker-outreach.md` dopo la risoluzione delle anomalie (Mastermar, Parodi Forwarding, Ambra Mar, Oliaro).

## Uso quotidiano

Dopo ogni chiamata: aggiornare Stato outreach, Tentativi, Prossimo step, aggiungere dettagli nelle Note (o come commento/blocco nella pagina della singola azienda, se serve tenere uno storico più lungo di una singola cella testo). Quando un'interview è completata: spuntare "Interview fatta", compilare il pain score (come blocco di testo nella pagina della singola azienda, replicando la tabella di `guida-interview-design-partner.md`).

Una sessione Claude con il connettore Notion attivo può fare questi aggiornamenti direttamente su richiesta, invece di limitarsi a consigliarli.

## Continuità tra sessioni

Il repo (`kb/04-clienti-e-outreach/tracker-outreach.md`) resta la **fonte di verità durevole**, leggibile da qualunque sessione anche senza connettore Notion attivo. Notion è lo strumento operativo per il lavoro quotidiano quando il connettore è disponibile. Se una sessione futura non ha il connettore Notion (verificare sempre con `ListConnectors` prima di assumere che sia disponibile), deve trattare `tracker-outreach.md` come stato vivo e chiedere all'utente conferma dello stato reale in Notion se serve, invece di assumere che siano sincronizzati.

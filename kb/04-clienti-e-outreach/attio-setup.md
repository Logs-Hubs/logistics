# Attio come gestionale outreach (separato da HubSpot) — NON PIÙ LA SCELTA ATTIVA

**Aggiornamento 29/08/2026, stesso giorno**: Attio richiede un'email di dominio proprio per la registrazione (non accetta Gmail/Yahoo/email personali) e l'utente non ne ha una disponibile per questo progetto. Sostituito da **Notion**, vedi `notion-setup.md` — stesso schema, già impostato e popolato. Questo file resta come riferimento (schema, motivazioni) nel caso l'utente ottenga in futuro un'email di dominio e voglia tornare su Attio.

Scelta originale dell'utente (29/08/2026): Attio per l'outreach di questo progetto, non HubSpot, perché HubSpot è il CRM del lavoro dell'utente e questo deve restare un tool separato, usabile anche da un'altra sessione/account.

## Perché Attio ha senso qui

- Piano **Free**: $0, fino a 3 seat, 50.000 record, 3 oggetti custom, sync in tempo reale ed enrichment di base, nessun limite di tempo — più che sufficiente per 12-30 aziende e i relativi contatti.
- Sopra il free: $29/seat/mese (Plus) o $69/seat/mese (Pro), enrichment e "Ask Attio" (AI) su crediti mensili separati — non necessari in questa fase.

## Limite importante di questa sessione: nessuna integrazione live

Attio non ha un connector MCP disponibile in questo account/ambiente (verificato: non risulta né tra i connector installati né nel registro), e l'accesso di rete di questa sessione è ristretto a un allowlist di domini (npm, PyPI, GitHub, Anthropic) — un test diretto a `api.attio.com` è stato rifiutato dal proxy per policy dell'organizzazione. Significa che **nessuna sessione Claude in questo ambiente può leggere o scrivere in Attio via API**, né ora né in futuro, a meno che non cambi la policy di rete o venga aggiunto un connector ufficiale dal lato claude.ai.

Conseguenza pratica: Attio va aggiornato **a mano** dall'utente dopo ogni chiamata (o da un'altra sessione/tool che abbia accesso a Internet generico, se mai disponibile). Il repo (questa cartella `kb/`) resta la **fonte di verità durevole e leggibile da qualunque sessione**, Attio è lo strumento operativo per il lavoro quotidiano di chi chiama. Se emerge un modo per sincronizzarli (es. Attio pubblica un connector ufficiale, o l'utente esporta un CSV da Attio da ricaricare qui), va aggiornato questo file.

## Schema consigliato (oggetti standard di Attio, nessun oggetto custom necessario)

**Companies** (oggetto di default) — un record per azienda, con questi campi custom da creare:

| Campo | Tipo Attio | Valori |
|---|---|---|
| Priorità | Select | P0 - apre la rete / Alta / Secondo giro |
| Stato outreach | Select | Non chiamato · Non risposto · Richiamare · Centralino, referente non raggiunto · Rifiutato · Slot fissato · Interview fatta · Design partner ask fatto · Design partner confermato |
| Telefono | Testo | numero principale (eventuali alternativi in Note) |
| Tentativi | Numero | contatore chiamate |
| Prossimo step (data) | Data | quando richiamare o quando è fissato lo slot |
| Interview fatta | Checkbox | |
| Pain score compilato | Checkbox | |
| Note | Testo lungo | anomalie da chiarire, dettagli chiamata, impressioni |

**People** (oggetto di default) — un record per referente, collegato alla Company via la relazione standard "works at"/company, con ruolo nel campo Job Title.

**List** — creare una Lista "Outreach Porti Genova", aggiungere le 12 aziende, vista Kanban raggruppata per "Stato outreach": dà il colpo d'occhio sulla pipeline che oggi sta nella tabella di `tracker-outreach.md`.

Ogni chiamata: loggarla come **Nota** sul record Company (Attio la timestampa automaticamente) invece di sovrascrivere un campo — mantiene lo storico di ogni tentativo, coerente con la colonna "Tentativi".

## Come importare i dati di partenza

1. Creare i campi custom sopra su Companies (una volta sola).
2. Companies → Import → caricare `attio-import-aziende-genovesi.csv` (in questa stessa cartella) → mappare le colonne ai campi appena creati.
3. Per i referenti già noti (Michele Capodanno, Gian Luigi Ravera, Giorgio Ciman, Manlio Marino, Roberta/Luca Oliaro), crearli come record People e collegarli alla rispettiva Company — non inclusi nel CSV per tenerlo semplice da importare in un solo giro.
4. Creare la Lista "Outreach Porti Genova" e aggiungere le 12 Companies importate, vista Kanban su "Stato outreach".

## Uso quotidiano

Dopo ogni chiamata: aggiornare Stato outreach, Tentativi, Prossimo step, aggiungere una Nota con cosa è successo. Quando un'interview è completata: spuntare "Interview fatta", compilare il pain score (dove tenerlo: come Nota strutturata sul record, replicando la tabella di `guida-interview-design-partner.md`, oppure aggiungere i 5 filoni come campi custom aggiuntivi se serve confrontarli tra aziende in una vista).

## Continuità tra sessioni

Chi riprende questo progetto (umano o LLM, da questa sessione o da un'altra) deve sapere: lo stato reale e aggiornato dell'outreach vive in Attio, non più solo in `tracker-outreach.md` (che resta come snapshot dei dati di partenza — telefono/referente trovati il 29/08/2026 — non più aggiornato dopo l'adozione di Attio). Se una sessione futura non ha accesso ad Attio (nessun connector, come qui), deve chiedere all'utente lo stato attuale invece di assumere che `tracker-outreach.md` sia ancora la fonte viva.

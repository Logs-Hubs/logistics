# Notion — Container Trucking Liguria (outreach)

Gestionale operativo per il nuovo verticale (container trucking), **separato** dal gestionale spedizionieri esistente (`kb/04-clienti-e-outreach/notion-setup.md`, pagina "Movr - Outreach Porti") perché sono due ICP diversi (trasportatori con flotta propria, non spedizionieri/freight forwarder) per due wedge di prodotto diversi. Stesso workspace Notion personale dell'utente.

## Dove si trova

- Pagina principale: **Movr - Container Trucking Liguria** — https://app.notion.com/p/3e9790abc4b28118806ac32c795e988c
- Database **Aziende - Container Trucking** (dentro la pagina sopra) — https://app.notion.com/p/b662ccc390e7464aac209f21577c7841 — viste **Pipeline (Kanban)** raggruppata per "Stato outreach" e **Per classificazione** raggruppata per A/B/C.

## Popolato il 28/09/2026

Le **34 aziende** della prima tranche (`gtm/container-trucking-prospects.csv`), tutte inserite con: Classificazione (A/B/C), Porti serviti, Telefono/Email dove noti, Decision maker dove noto, Perché interessante, Fonti, Note. Stato outreach di default "Non chiamato" per tutte (nessuna chiamata ancora avviata).

## Schema

| Campo | Tipo Notion | Note |
|---|---|---|
| Azienda | Title | |
| Classificazione | Select | A = vogliamo parlarci subito · B = interessante · C = fit debole |
| Stato outreach | Select | Stessi 9 stati del database spedizionieri, per coerenza: Non chiamato · Non risposto · Richiamare · Centralino - referente non raggiunto · Rifiutato · Slot fissato · Interview fatta · Design partner ask fatto · Design partner confermato |
| Porti serviti | Multi-select | Genova / Savona-Vado / La Spezia / Altro-hinterland (un'azienda può servire più porti, a differenza del vecchio database che aveva un solo "Porto" per riga) |
| Telefono | Testo | |
| Email | Email | |
| Decision maker | Testo | fondatore/CEO/ops manager se noto |
| Tentativi | Numero | contatore chiamate |
| Prossimo step | Data | |
| Interview fatta | Checkbox | |
| Pain score compilato | Checkbox | |
| Perché interessante | Testo | dalla ricerca, per chi chiama senza aver letto il CSV |
| Fonti | Testo | citazioni delle fonti usate in ricerca |
| Note | Testo | motivazione classificazione, anomalie, aggiornamenti post-chiamata |

## Cosa manca rispetto al gestionale spedizionieri (da aggiungere se/quando servirà)

- **Nessuna "Guida operativa Day 1" ancora scritta qui** — lo script di chiamata e le domande esistono già in `gtm/discovery-playbook.md` nel repo, ma non sono ancora stati copiati come pagina Notion inline. Farlo se si assegna questo lavoro a qualcuno senza accesso al repo tecnico, sullo stesso modello di quanto fatto per il database spedizionieri.
- **Nessuna tabella Pain Score già inserita in ogni pagina azienda** — nel database spedizionieri ogni pagina ne ha una pronta da compilare; qui andrebbe replicato lo stesso pattern (struttura in `research/container-trucking-workflow.md` §5, la matrice pain, e in `gtm/discovery-playbook.md` le metriche da raccogliere) se si inizia a condurre interview sul serio.

## Uso quotidiano

Dopo ogni chiamata: aggiornare Stato outreach, Tentativi, Prossimo step, Note. A interview completata: spuntare Interview fatta, compilare pain score (vedi nota sopra: la tabella pronta va ancora aggiunta).

## Continuità tra sessioni

Fonte di verità durevole: `gtm/container-trucking-prospects.csv` nel repo, leggibile anche senza connettore Notion attivo. Notion è lo strumento operativo quando il connettore è disponibile **e punta al workspace giusto** — verificare sempre con una ricerca mirata prima di assumere che sia collegato correttamente (è già successo che puntasse al workspace di lavoro invece che personale, vedi nota in `kb/04-clienti-e-outreach/notion-setup.md`).

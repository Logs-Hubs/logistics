# Notion — Container Trucking Liguria (outreach)

Gestionale operativo per il nuovo verticale (container trucking), **separato** dal gestionale spedizionieri esistente (`kb/04-clienti-e-outreach/notion-setup.md`, pagina "Movr - Outreach Porti") perché sono due ICP diversi (trasportatori con flotta propria, non spedizionieri/freight forwarder) per due wedge di prodotto diversi. Stesso workspace Notion personale dell'utente.

## Dove si trova

- Pagina principale: **Movr - Container Trucking Liguria** — https://app.notion.com/p/3e9790abc4b28118806ac32c795e988c
- **Guida operativa Day 1** (sottopagina, creata 28/09/2026) — https://app.notion.com/p/3e9790abc4b2818a9b8de1a3c2e65905 — contesto Movr, script di chiamata, struttura discovery, quando proporre il design partner, come aggiornare Notion, KPI settimanali attesi. Autosufficiente: pensata per chi non ha accesso al repo tecnico (il sales/outreach da ingaggiare, per esempio).
- Database **Aziende - Container Trucking** (dentro la pagina sopra) — https://app.notion.com/p/b662ccc390e7464aac209f21577c7841 — viste **Pipeline (Kanban)** per "Stato outreach", **Per classificazione** per A/B/C, **Da chiamare (in ordine)** (tabella filtrata e ordinata per "Ordine di chiamata", le 26 aziende A/B da lavorare per prime), **KPI - stato outreach** (grafico a barre, conta aziende per stato — misura il lavoro fatto senza bisogno di altro).

## Popolato il 28/09/2026

Le **34 aziende** della prima tranche, popolate il 28/09/2026. Aggiornato lo stesso giorno con le **28 aziende della seconda tranche** (id 35-62), stesso schema. **Totale: 62 aziende** in `gtm/container-trucking-prospects.csv` e in Notion, tutte con: Classificazione (A/B/C), Porti serviti, Telefono/Email dove noti, Decision maker dove noto, Perché interessante, Fonti, Note. Stato outreach di default "Non chiamato" per tutte (nessuna chiamata ancora avviata).

**Segnalazione da verificare prima di contattare**: la pagina "Mainoldi Autotrasporti S.r.l." nota un possibile collegamento (non confermato) tra il decision maker e il presidente regionale CNA FITA Liguria — se confermato, contatto ad alto valore per accesso alla rete associativa, non solo alla singola azienda. La pagina "NSH / Overservice / Overlogistics / Triton" ha dati che sembrano risalire a prima del 2019 (apertura Vado Gateway) — verificare che l'azienda esista ancora con lo stesso assetto prima di chiamare.

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
| Ordine di chiamata | Numero | popolato solo per le 26 aziende A/B (da `gtm/top-20-design-partners.md`), definisce l'ordine di lavoro consigliato |
| Perché interessante | Testo | dalla ricerca, per chi chiama senza aver letto il CSV |
| Fonti | Testo | citazioni delle fonti usate in ricerca |
| Note | Testo | motivazione classificazione, anomalie, aggiornamenti post-chiamata |

Nota: "Stato outreach" ha l'opzione "Demo fissata" al posto di "Slot fissato" (rinominata il 28/09/2026: qui il significato è fissare una call/demo con l'azienda, non prenotare uno slot al terminal come nel gestionale spedizionieri da cui lo schema era stato copiato).

## Cosa manca ancora rispetto al gestionale spedizionieri

- **Nessuna tabella Pain Score già inserita in ogni pagina azienda** — nel database spedizionieri ogni pagina ne ha una pronta da compilare; qui andrebbe replicato lo stesso pattern (struttura in `research/container-trucking-workflow.md` §5, la matrice pain, e in `gtm/discovery-playbook.md` le metriche da raccogliere) se si inizia a condurre interview sul serio. Non fatto per tutte le 62 pagine per limitare il numero di chiamate API in questa sessione — da aggiungere se serve, almeno per le 26 A/B.

## Uso quotidiano

Vedi **Guida operativa Day 1** per il processo completo (pensata per chi non ha letto questo file). In sintesi: partire dalla vista "Da chiamare (in ordine)", in ordine. Dopo ogni chiamata aggiornare Stato outreach, Tentativi, Prossimo step, Note. A interview completata: spuntare Interview fatta, compilare pain score (vedi nota sopra: la tabella pronta va ancora aggiunta, per ora si scrive in Note).

## Continuità tra sessioni

Fonte di verità durevole: `gtm/container-trucking-prospects.csv` nel repo, leggibile anche senza connettore Notion attivo. Notion è lo strumento operativo quando il connettore è disponibile **e punta al workspace giusto** — verificare sempre con una ricerca mirata prima di assumere che sia collegato correttamente (è già successo che puntasse al workspace di lavoro invece che personale, vedi nota in `kb/04-clienti-e-outreach/notion-setup.md`).

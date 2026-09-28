# Notion — Container Trucking Liguria (outreach)

**Aggiornamento 28/09/2026: unificato nel database spedizionieri.** Su richiesta esplicita dell'utente ("unire tutto nello stesso db con una variabile nuova per settore"), il database separato "Aziende - Container Trucking" è stato migrato dentro `kb/04-clienti-e-outreach/notion-setup.md` (pagina "Movr - Outreach Porti", database "Aziende - Outreach Porti") e poi cestinato. Non esiste più un database Notion separato per questo verticale: tutto vive in un unico database, distinto da un campo **Settore** (Spedizionieri / Autotrasporto Container). Questo file resta come riferimento storico su come sono stati ricercati e classificati i dati, e sulla pagina/guida dedicate che restano attive.

## Dove si trova ora

- Database unico: **Aziende - Outreach Porti** — https://app.notion.com/p/949243a620bc427c93c06ec35249b891 (vedi `kb/04-clienti-e-outreach/notion-setup.md` per lo schema completo).
- Viste utili per questo verticale: **Da chiamare (in ordine)** (le 26 aziende A/B ordinate), **Per settore** (Kanban raggruppato per Settore, filtra su "Autotrasporto Container"), **KPI - stato outreach** (grafico a barre).
- Pagina di contesto: **Movr - Container Trucking Liguria** — https://app.notion.com/p/3e9790abc4b28118806ac32c795e988c — aggiornata per rimandare al database unico.
- **Guida operativa Day 1** (specifica per questo verticale) — https://app.notion.com/p/3e9790abc4b2818a9b8de1a3c2e65905 — script di chiamata, struttura discovery, KPI settimanali attesi, aggiornata per puntare al database unico.

## Popolato il 28/09/2026, migrato lo stesso giorno

Le **62 aziende** (34 prima tranche + 28 seconda tranche) sono nel database unico con **Settore = Autotrasporto Container**, mappate sui campi condivisi: Referente (era "Decision maker"), Note, Fonti, Perché interessante, Ordine di chiamata, Porti serviti, Classificazione (A/B/C), Telefono, Email, Stato outreach. Fonte di verità durevole nel repo invariata: `gtm/container-trucking-prospects.csv`.

**Mainoldi Autotrasporti confermato come priorità assoluta** (28/09/2026): Pier Luca Mainoldi è presidente CNA Fita La Spezia dal maggio 2025 — promosso a Classificazione A, primo nell'ordine di chiamata. Vedi `gtm/top-20-design-partners.md` per il dettaglio. La segnalazione su NSH (dati forse antecedenti al 2019) resta da verificare prima di contattare.

## Mappatura campi (verticale → database unico)

| Campo verticale (vecchio) | Campo nel database unico |
|---|---|
| Decision maker | Referente |
| Classificazione | Classificazione (nuovo campo, condiviso) |
| Porti serviti | Porti serviti (nuovo campo multi-select, condiviso) |
| Ordine di chiamata | Ordine di chiamata (nuovo campo, condiviso) |
| Perché interessante | Perché interessante (nuovo campo, condiviso) |
| Fonti | Fonti (nuovo campo, condiviso) |
| Stato outreach "Demo fissata" | Aggiunta come opzione in più al select "Stato outreach" esistente (che aveva già "Slot fissato" per gli spedizionieri) |

Non migrato: nessuna tabella Pain Score nelle pagine azienda di questo verticale (esiste solo per le 55 pagine spedizionieri) — da aggiungere se si inizia a condurre interview sul serio, replicando il pattern descritto in `research/container-trucking-workflow.md` §5.

## Uso quotidiano

Vedi **Guida operativa Day 1** per il processo completo. In sintesi: partire dalla vista "Da chiamare (in ordine)" nel database unico, in ordine (Mainoldi prima di tutti). Dopo ogni chiamata aggiornare Stato outreach, Tentativi, Prossimo step, Note.

## Continuità tra sessioni

Fonte di verità durevole invariata: `gtm/container-trucking-prospects.csv` nel repo. Il database Notion vivo è ora quello unico descritto in `kb/04-clienti-e-outreach/notion-setup.md` — verificare sempre con una ricerca mirata che il connettore Notion punti al workspace giusto prima di assumere che sia collegato correttamente.

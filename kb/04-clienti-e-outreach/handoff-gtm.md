# Handoff GTM — riprendere da qui in una nuova chat

Scritto il 29/08/2026, aggiornato lo stesso giorno tre volte: prima per il piano di outreach telefonico ("tutto in call"), poi per la scelta di Attio come gestionale, poi per il passaggio da Attio a Notion (Attio richiede un'email di dominio proprio, non disponibile). Chi riprende (umano o LLM) dovrebbe leggere questo file per primo, poi i file collegati sotto, in ordine.

## Obiettivo immediato

Contattare le spedizioniere genovesi **per telefono** (scelta esplicita dell'utente, non email-first) per interview di discovery (metodologia in `guida-interview-design-partner.md`), con l'obiettivo finale di reclutare 3-4 design partner gratuiti per il modulo Porti (wedge: slot booking + notifiche multi-terminal).

## Stato ad oggi

- **Lista pronta**, ordinata, in `aziende-genovesi-da-contattare.md`. Ordine: Spediservices (apre la rete verso Spediporto) → 4 aziende priorità alta (Lena Spedizioni, Ambra Mar, GDT Logistic, Spedimar) → secondo giro (8 aziende, dimensioni da confermare su LinkedIn).
- **Metodologia interview pronta**, in `guida-interview-design-partner.md`: struttura, 5 filoni di pain, domande killer, pain score, script di chiusura per l'ask design partner.
- **Piano di outreach telefonico pronto**, in `piano-outreach-telefonico.md`: script di apertura, gestione centralino/obiezioni, timing e cadenza delle chiamate, come adattare l'interview al canale telefonico, obiettivi quantitativi di fase 1.
- **Telefono + referente trovati** per tutte e 12 le aziende (ricerca web del 29/08/2026), compilati in `tracker-outreach.md`. Tutte le anomalie iniziali risolte con ricerche successive lo stesso giorno: nome esatto **Mastermar Spedizioni e Controlli Internazionali S.r.l.** (era "Mastarmar", refuso), referente **Parodi Forwarding** confermato (Manlio Marino, ancora direttore dopo l'acquisizione da Gaston Schul), sede legale **Ambra Mar** confermata (Piazza Cavour 15/12, numero centralino aggiornato — ma resta un numero alternativo da un'altra fonte da verificare a voce), riferimento operativo **Oliaro** confermato (Roberta Oliaro, Amministratore Delegato).
- **Gestionale: Notion**, non HubSpot (HubSpot è il CRM del lavoro dell'utente, va tenuto separato), non più Attio (richiede un'email di dominio proprio per la registrazione, non disponibile — vedi `attio-setup.md` per lo storico). Schema, URL e istruzioni in `notion-setup.md`. **Già impostato e popolato** (29/08/2026): pagina "Movr — Outreach Porti Genova" con database "Aziende — Outreach Porti Genova" e vista Kanban su "Stato outreach", tutte e 12 le aziende inserite con i dati aggiornati del tracker. Il connettore Notion era attivo in questa sessione (workspace personale dell'utente, separato dal lavoro tecnico) — non garantito disponibile in ogni sessione futura, verificare con ListConnectors.
- **Nessuna chiamata ancora avviata** al 29/08/2026.

## Cosa chiede l'utente

1. Contattare davvero le aziende della lista, per telefono.
2. Capire cosa si può automatizzare di più in questo processo (vedi `piano-outreach-telefonico.md`).
3. Un gestionale separato da HubSpot per tracciare liste e stato contatti, ottimizzato e con routine di lavoro il più automatizzate possibile — Notion (piano gratuito), vedi `notion-setup.md` per lo schema e cosa una sessione con connettore attivo può fare direttamente.

## Prossimo passo concreto

Le anomalie del tracker sono tutte chiarite e Notion è già pronto e popolato: si può iniziare le chiamate seguendo `piano-outreach-telefonico.md`, partendo da Spediservices, aggiornando Notion (`notion-setup.md`) e/o `tracker-outreach.md` dopo ogni chiamata.

## Piste di automazione ancora da valutare

Non ancora implementate, solo da proporre e validare con l'utente prima di agire (un contatto esterno reale, telefonico o via email, è un'azione visibile esternamente: va confermata, non fatta di iniziativa):

- **Scheduling interview**: se disponibile un connettore Google Calendar, proporre slot una volta fissata una call telefonica, invece di andare avanti e indietro per l'orario.
- **Bozze email**: connettore Gmail disponibile in questa sessione — `create_draft`, mai `send_message` senza conferma esplicita di messaggio e destinatario. Solo come fallback per chi chiede esplicitamente una mail invece del telefono, o per confermare per iscritto uno slot già fissato per telefono — mai come canale primario in questo piano.
- **Sync Attio**: abbandonata, vedi sopra — non più rilevante a meno che l'utente non ottenga un'email di dominio proprio in futuro.

## File da leggere, in ordine

1. `piano-outreach-telefonico.md` — il piano di outreach telefonico, leggere per primo
2. `aziende-genovesi-da-contattare.md` — la lista e l'ordine di contatto
3. `guida-interview-design-partner.md` — come condurre l'interview e quando fare l'ask design partner
4. `notion-setup.md` — perché Notion (al posto di Attio), schema, URL, cosa può fare una sessione con connettore attivo (`attio-setup.md` resta come riferimento storico/di riserva)
5. `tracker-outreach.md` — fonte di verità durevole, leggibile anche senza connettore Notion; dati aggiornati al 29/08/2026 dopo la risoluzione delle anomalie
6. `playbook-outreach.md` — cosa offrire/chiedere una volta che un'azienda accetta di diventare design partner (fase successiva all'interview)

## Sessione GTM da un altro account

L'utente gestisce il GTM da un account diverso da quello tecnico/prodotto. `prompt-nuova-sessione.md` (in questa stessa cartella) contiene il prompt pronto da incollare per inizializzare quella sessione: convenzioni di lavoro sul repo, limiti noti (Notion/Attio, connettori), obiettivo immediato. Tenerlo aggiornato se cambia sostanzialmente lo stato del progetto.

## Promemoria di processo

Standing instruction dell'utente: dopo modifiche in questo repo, commit + push sul branch di lavoro, poi PR e merge diretto su `main`, senza chiedere conferma ogni volta.

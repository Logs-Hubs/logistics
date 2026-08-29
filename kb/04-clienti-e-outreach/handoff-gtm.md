# Handoff GTM — riprendere da qui in una nuova chat

Scritto il 29/08/2026, aggiornato lo stesso giorno due volte: prima per il piano di outreach telefonico ("tutto in call"), poi per la scelta di Attio come gestionale. Chi riprende (umano o LLM) dovrebbe leggere questo file per primo, poi i file collegati sotto, in ordine.

## Obiettivo immediato

Contattare le spedizioniere genovesi **per telefono** (scelta esplicita dell'utente, non email-first) per interview di discovery (metodologia in `guida-interview-design-partner.md`), con l'obiettivo finale di reclutare 3-4 design partner gratuiti per il modulo Porti (wedge: slot booking + notifiche multi-terminal).

## Stato ad oggi

- **Lista pronta**, ordinata, in `aziende-genovesi-da-contattare.md`. Ordine: Spediservices (apre la rete verso Spediporto) → 4 aziende priorità alta (Lena Spedizioni, Ambra Mar, GDT Logistic, Spedimar) → secondo giro (8 aziende, dimensioni da confermare su LinkedIn).
- **Metodologia interview pronta**, in `guida-interview-design-partner.md`: struttura, 5 filoni di pain, domande killer, pain score, script di chiusura per l'ask design partner.
- **Piano di outreach telefonico pronto**, in `piano-outreach-telefonico.md`: script di apertura, gestione centralino/obiezioni, timing e cadenza delle chiamate, come adattare l'interview al canale telefonico, obiettivi quantitativi di fase 1.
- **Telefono + referente trovati** per tutte e 12 le aziende (ricerca web del 29/08/2026), compilati in `tracker-outreach.md` — con alcune anomalie da chiarire a mano prima di chiamare (omonimia Mastarmar/Mastermar, acquisizione Parodi Forwarding, sedi multiple Ambra Mar, doppio titolare Oliaro).
- **Gestionale scelto: Attio**, non HubSpot (HubSpot è il CRM del lavoro dell'utente, va tenuto separato). Schema e istruzioni di setup in `attio-setup.md`, dati di partenza pronti per l'import in `attio-import-aziende-genovesi.csv`. **Non ancora impostato su Attio stesso** — nessuna sessione Claude in questo ambiente può leggere/scrivere in Attio via API (nessun connector disponibile, egress di rete bloccato dalla policy verso `api.attio.com`, verificato il 29/08/2026): l'import e l'uso quotidiano restano manuali, fatti dall'utente nell'interfaccia Attio.
- **Nessuna chiamata ancora avviata** al 29/08/2026.

## Cosa chiede l'utente

1. Contattare davvero le aziende della lista, per telefono.
2. Capire cosa si può automatizzare di più in questo processo (vedi `piano-outreach-telefonico.md`).
3. Un gestionale separato da HubSpot per tracciare liste e stato contatti, ottimizzato e con routine di lavoro il più automatizzate possibile — scelto Attio (piano Free), vedi `attio-setup.md` per lo schema e i limiti reali di automazione in questo ambiente.

## Prossimo passo concreto

L'utente crea l'account Attio (piano Free) e importa `attio-import-aziende-genovesi.csv` seguendo `attio-setup.md`; in parallelo, chiarire le anomalie nel tracker (in particolare nome esatto di Mastarmar/Mastermar e referente attuale di Parodi Forwarding dopo l'acquisizione) prima di iniziare le chiamate seguendo `piano-outreach-telefonico.md`, partendo da Spediservices.

## Piste di automazione ancora da valutare

Non ancora implementate, solo da proporre e validare con l'utente prima di agire (un contatto esterno reale, telefonico o via email, è un'azione visibile esternamente: va confermata, non fatta di iniziativa):

- **Scheduling interview**: se disponibile un connettore Google Calendar, proporre slot una volta fissata una call telefonica, invece di andare avanti e indietro per l'orario.
- **Bozze email**: connettore Gmail disponibile in questa sessione — `create_draft`, mai `send_message` senza conferma esplicita di messaggio e destinatario. Solo come fallback per chi chiede esplicitamente una mail invece del telefono, o per confermare per iscritto uno slot già fissato per telefono — mai come canale primario in questo piano.
- **Sync Attio**: non fattibile in questo ambiente (vedi sopra e `attio-setup.md`) — da rivalutare se cambia la policy di rete o Attio pubblica un connector ufficiale.

## File da leggere, in ordine

1. `piano-outreach-telefonico.md` — il piano di outreach telefonico, leggere per primo
2. `aziende-genovesi-da-contattare.md` — la lista e l'ordine di contatto
3. `guida-interview-design-partner.md` — come condurre l'interview e quando fare l'ask design partner
4. `attio-setup.md` — perché Attio, schema, limiti di automazione, come importare i dati
5. `tracker-outreach.md` — snapshot dei dati di partenza (telefono/referente al 29/08/2026); dopo l'adozione di Attio, lo stato vivo dell'outreach vive lì, non più qui
6. `playbook-outreach.md` — cosa offrire/chiedere una volta che un'azienda accetta di diventare design partner (fase successiva all'interview)

## Sessione GTM da un altro account

L'utente gestisce il GTM da un account diverso da quello tecnico/prodotto. `prompt-nuova-sessione.md` (in questa stessa cartella) contiene il prompt pronto da incollare per inizializzare quella sessione: convenzioni di lavoro sul repo, limiti noti (Attio, connettori), obiettivo immediato. Tenerlo aggiornato se cambia sostanzialmente lo stato del progetto.

## Promemoria di processo

Standing instruction dell'utente: dopo modifiche in questo repo, commit + push sul branch di lavoro, poi PR e merge diretto su `main`, senza chiedere conferma ogni volta.

# Handoff GTM — riprendere da qui in una nuova chat

Scritto il 29/08/2026, aggiornato più volte da allora — vedi "Stato ad oggi" per l'ultimo aggiornamento sostanziale (28/09/2026). Chi riprende (umano o LLM) dovrebbe leggere questo file per primo, poi i file collegati sotto, in ordine.

## Obiettivo immediato

Contattare gli spedizionieri di Genova e di altri 6 porti italiani **per telefono** (scelta esplicita dell'utente, non email-first, anche se ora esistono anche bozze email come fallback — vedi sotto) per interview di discovery (metodologia in `guida-interview-design-partner.md`), con l'obiettivo finale di reclutare 3-4 design partner gratuiti per il modulo Porti (wedge: slot booking + notifiche multi-terminal). L'utente vuole anche far gestire una parte di questo (sales/ricerca design partner/interview) a un nuovo entrato.

## Stato ad oggi (28/09/2026)

- **Due liste, 55 aziende totali**: 12 a Genova (`aziende-genovesi-da-contattare.md`) + 43 su altri 6 porti — La Spezia, Livorno, Trieste, Venezia, Napoli, Salerno (`aziende-altri-porti-da-contattare.md`, aggiunta su richiesta esplicita dell'utente dopo l'avvio del primo giro). Stesso ICP, stessa metodologia.
- **Metodologia interview pronta**, in `guida-interview-design-partner.md`. **Piano di outreach telefonico pronto**, in `piano-outreach-telefonico.md`.
- **Contatti trovati per (quasi) tutte**: telefono per tutte e 55, email per 30/55 (8 Genova + 22 altri porti) con bozza di prima outreach pronta su Gmail (oggetto standardizzato "Intro Lorenzo <> [azienda]"), **mai inviate**. Tutte le anomalie iniziali di Genova risolte (Mastermar, Parodi Forwarding, Ambra Mar, Oliaro).
- **Zero chiamate ed email inviate finora**, un mese dopo la preparazione — il collo di bottiglia è stato interamente l'esecuzione, non la ricerca.
- **Gestionale: Notion**, non HubSpot (CRM del lavoro dell'utente), non Attio (richiede email di dominio proprio, non disponibile, vedi `attio-setup.md` per lo storico). Database consolidato **"Aziende - Outreach Porti"**, un solo database per tutte e 55 le aziende (campo "Porto" per distinguere), viste Kanban per Stato outreach e per Porto. Schema/URL in `notion-setup.md`.
- **Attenzione workspace (28/09/2026)**: il connettore Notion di una sessione può risultare agganciato al workspace di lavoro dell'utente invece che al personale (è successo). La pagina/database di questo progetto diventa irraggiungibile e la ricerca restituisce solo contenuti aziendali estranei. Risolto quando l'utente ha ricollegato esplicitamente il Notion personale. **Verificare sempre con una ricerca Notion mirata prima di assumere che il connettore punti al posto giusto.**
- **Pagina "Guida operativa Day 1"** dentro lo spazio Notion (creata 28/09/2026, riscritta lo stesso giorno in forma schematica), con script di chiamata, struttura interview, pain score, script design partner ask, tutto inline, pensata per un nuovo entrato senza accesso al repo tecnico. Vedi `notion-setup.md` per il link.
- **Tabella Pain Score su ogni pagina azienda** (28/09/2026): tutte e 55 le pagine azienda hanno in fondo la tabella pronta da compilare durante o dopo l'interview, non serve più ricostruirla a mano.
- **Convenzione di stile**: mai usare il trattino lungo (em dash) nel contenuto scritto su Notion, richiesto esplicitamente dall'utente il 28/09/2026 e applicato a tutto il contenuto esistente in quel momento. Vedi `notion-setup.md`.

## Cosa chiede l'utente

1. Contattare davvero le aziende delle liste, per telefono (email come fallback quando disponibile).
2. Automatizzare il più possibile il processo (vedi `piano-outreach-telefonico.md` e `notion-setup.md` per i limiti reali).
3. Un gestionale facile da passare a **un nuovo entrato** che gestirà parte di sales/ricerca design partner/interview — Notion, con la Guida operativa Day 1 come materiale di onboarding auto-contenuto (l'utente ha confermato di voler tenere questo lavoro separato dagli strumenti della sua azienda attuale).

## Prossimo passo concreto

Il vero blocco non è più preparazione: è iniziare a chiamare/scrivere davvero (Genova prima), o assegnare il lavoro al nuovo entrato usando la Guida operativa Day 1 su Notion. Prima di scalare a un nuovo entrato, vale la pena che l'utente stesso validi lo script con 5-6 tentativi reali.

## Piste di automazione ancora da valutare

- **Scheduling interview**: se disponibile un connettore Google Calendar, proporre slot una volta fissata una call telefonica.
- **Bozze email**: connettore Gmail — `create_draft`, mai `send_message` senza conferma esplicita. 30 bozze già pronte e non inviate, vedi `tracker-outreach.md` e `tracker-altri-porti.md`.
- **Sync Attio**: abbandonata, non più rilevante a meno che l'utente non ottenga un'email di dominio proprio.

## File da leggere, in ordine

1. `piano-outreach-telefonico.md` — il piano di outreach telefonico, leggere per primo
2. `aziende-genovesi-da-contattare.md` e `aziende-altri-porti-da-contattare.md` — le liste e l'ordine di contatto
3. `guida-interview-design-partner.md` — come condurre l'interview e quando fare l'ask design partner
4. `notion-setup.md` — perché Notion, schema, URL (inclusa la Guida operativa Day 1), come verificare che il connettore punti al workspace giusto
5. `tracker-outreach.md` e `tracker-altri-porti.md` — fonte di verità durevole nel repo, leggibile anche senza connettore Notion; può disallinearsi da Notion nel tempo, verificare con l'utente se in dubbio
6. `playbook-outreach.md` — cosa offrire/chiedere una volta che un'azienda accetta di diventare design partner

## Sessione GTM da un altro account

L'utente gestisce il GTM da un account diverso da quello tecnico/prodotto. `prompt-nuova-sessione.md` (in questa stessa cartella) contiene il prompt pronto da incollare per inizializzare quella sessione. Tenerlo aggiornato se cambia sostanzialmente lo stato del progetto.

## Promemoria di processo

Standing instruction dell'utente: dopo modifiche in questo repo, commit + push sul branch di lavoro, poi PR e merge diretto su `main`, senza chiedere conferma ogni volta.

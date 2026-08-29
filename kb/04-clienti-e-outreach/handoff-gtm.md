# Handoff GTM — riprendere da qui in una nuova chat

Scritto il 29/08/2026, aggiornato lo stesso giorno dopo aver definito il piano di outreach telefonico (l'utente ha chiesto esplicitamente: "tutto in call"). Chi riprende (umano o LLM) dovrebbe leggere questo file per primo, poi i file collegati sotto, in ordine.

## Obiettivo immediato

Contattare le spedizioniere genovesi **per telefono** (scelta esplicita dell'utente, non email-first) per interview di discovery (metodologia in `guida-interview-design-partner.md`), con l'obiettivo finale di reclutare 3-4 design partner gratuiti per il modulo Porti (wedge: slot booking + notifiche multi-terminal).

## Stato ad oggi

- **Lista pronta**, ordinata, in `aziende-genovesi-da-contattare.md`. Ordine: Spediservices (apre la rete verso Spediporto) → 4 aziende priorità alta (Lena Spedizioni, Ambra Mar, GDT Logistic, Spedimar) → secondo giro (8 aziende, dimensioni da confermare su LinkedIn).
- **Metodologia interview pronta**, in `guida-interview-design-partner.md`: struttura, 5 filoni di pain, domande killer, pain score, script di chiusura per l'ask design partner.
- **Piano di outreach telefonico pronto**, in `piano-outreach-telefonico.md`: script di apertura, gestione centralino/obiezioni, timing e cadenza delle chiamate, come adattare l'interview al canale telefonico, obiettivi quantitativi di fase 1.
- **Tracker pronto ma vuoto**, in `tracker-outreach.md`: le 12 aziende già inserite con le colonne di stato, da compilare mano a mano dopo ogni chiamata.
- **Nessun contatto ancora avviato** al 29/08/2026.
- **Gap noto, ancora aperto**: nessun numero di telefono verificato per nessuna delle 12 aziende. È il primo blocco reale prima di poter chiamare chiunque — richiede una ricerca web mirata (centralino + nome del referente giusto), non ancora fatta.

## Cosa chiede l'utente

Le stesse due cose di prima, con il canale ora esplicito:
1. Contattare davvero le aziende della lista, per telefono.
2. Capire cosa si può automatizzare di più in questo processo (vedi `piano-outreach-telefonico.md` per le proposte aggiornate al canale telefonico).

## Prossimo passo concreto

Trovare i numeri di telefono e il nome del referente giusto (ricerca web mirata — azione a basso rischio, solo query, nessun contatto esterno) per popolare `tracker-outreach.md`, poi iniziare le chiamate seguendo `piano-outreach-telefonico.md`, partendo da Spediservices.

## Piste di automazione ancora da valutare

Non ancora implementate, solo da proporre e validare con l'utente prima di agire (un contatto esterno reale, telefonico o via email, è un'azione visibile esternamente: va confermata, non fatta di iniziativa):

- **Trovare i contatti**: ricerca web mirata per telefono/PEC/LinkedIn di ciascuna azienda (WebSearch); niente fetch diretto di URL aziendali specifici (bloccato in questo ambiente, vedi limiti in `context-bundle.md`), solo query di ricerca.
- **Scheduling interview**: se disponibile un connettore Google Calendar, proporre slot una volta fissata una call telefonica, invece di andare avanti e indietro per l'orario.
- **Compilazione pain score**: subito dopo ogni interview, popolare la tabella Pain Score di `guida-interview-design-partner.md` per quell'azienda, per non perdere il dettaglio a mente fredda.
- **Bozze email**: solo come fallback per chi chiede esplicitamente una mail invece del telefono, o per confermare per iscritto uno slot già fissato per telefono — mai come canale primario in questo piano.

## File da leggere, in ordine

1. `piano-outreach-telefonico.md` — il piano di outreach telefonico, leggere per primo
2. `aziende-genovesi-da-contattare.md` — la lista e l'ordine di contatto
3. `guida-interview-design-partner.md` — come condurre l'interview e quando fare l'ask design partner
4. `tracker-outreach.md` — stato reale dei contatti, da tenere aggiornato
5. `playbook-outreach.md` — cosa offrire/chiedere una volta che un'azienda accetta di diventare design partner (fase successiva all'interview)

## Promemoria di processo

Standing instruction dell'utente: dopo modifiche in questo repo, commit + push sul branch di lavoro, poi PR e merge diretto su `main`, senza chiedere conferma ogni volta.

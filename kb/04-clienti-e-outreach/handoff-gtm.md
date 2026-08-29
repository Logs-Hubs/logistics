# Handoff GTM — riprendere da qui in una nuova chat

Scritto il 29/08/2026 per aprire una sessione dedicata al go-to-market, separata dal lavoro tecnico (app iOS, piattaforma). Chi riprende (umano o LLM) dovrebbe leggere questo file per primo, poi i tre file collegati sotto.

## Obiettivo immediato

Contattare le spedizioniere genovesi per interview di discovery (metodologia in `guida-interview-design-partner.md`), con l'obiettivo finale di reclutare 3-4 design partner gratuiti per il modulo Porti (wedge: slot booking + notifiche multi-terminal).

## Stato ad oggi

- **Lista pronta**, ordinata, in `aziende-genovesi-da-contattare.md`. Ordine: Spediservices (apre la rete verso Spediporto) → 4 aziende priorità alta (Lena Spedizioni, Ambra Mar, GDT Logistic, Spedimar) → secondo giro (8 aziende, dimensioni da confermare su LinkedIn).
- **Metodologia interview pronta**, in `guida-interview-design-partner.md`: struttura, 5 filoni di pain, domande killer, pain score, script di chiusura per l'ask design partner.
- **Nessun contatto ancora avviato** (confermato l'ultima volta il 26/08/2026, probabilmente ancora vero).
- **Gap noto**: la lista aziende ha nomi/dimensioni/anno fondazione (da Europages, quindi indicativo), ma **non ha email o telefono verificati**. Questo è il primo cancelletto da sbloccare prima di poter mandare qualunque messaggio.

## Cosa chiede l'utente

Due cose, esplicitamente:
1. Contattare davvero le aziende della lista (non solo pianificare).
2. Capire cosa si può automatizzare di più in questo processo di outreach.

## Piste di automazione da valutare nella nuova chat

Non ancora implementate, solo da proporre e validare con l'utente prima di agire (mandare email reali a terzi è un'azione visibile esternamente: va confermata, non fatta di iniziativa):

- **Trovare i contatti**: ricerca web mirata per email/PEC/LinkedIn di ciascuna azienda (WebSearch); niente fetch diretto di URL aziendali specifici (bloccato in questo ambiente, vedi limiti in `context-bundle.md`), solo query di ricerca.
- **Bozze email personalizzate**: se disponibile un connettore Gmail nella sessione, usare `create_draft` (non `send_message` finché l'utente non conferma esplicitamente il messaggio e il destinatario) per preparare le prime bozze, una per azienda, basate sul framing da ricerca (non da vendita) descritto in `guida-interview-design-partner.md`.
- **Tracciamento outreach**: oggi non esiste una tabella di stato (contattato/risposto/interview fissata/esito). Vale la pena crearne una in questa cartella (es. `tracker-outreach.md` o uno .xlsx) invece di tenerlo a mente conversazione per conversazione.
- **Scheduling interview**: se disponibile un connettore Google Calendar, proporre slot una volta che un'azienda risponde positivamente, invece di andare avanti e indietro via email per l'orario.
- **Compilazione pain score**: subito dopo ogni interview, popolare la tabella Pain Score di `guida-interview-design-partner.md` per quell'azienda, per non perdere il dettaglio a mente fredda.

## File da leggere, in ordine

1. `aziende-genovesi-da-contattare.md` — la lista e l'ordine di contatto
2. `guida-interview-design-partner.md` — come condurre l'interview e quando fare l'ask design partner
3. `playbook-outreach.md` — cosa offrire/chiedere una volta che un'azienda accetta di diventare design partner (fase successiva all'interview)

## Promemoria di processo

Standing instruction dell'utente: dopo modifiche in questo repo, commit + push sul branch di lavoro, poi PR e merge diretto su `main`, senza chiedere conferma ogni volta.

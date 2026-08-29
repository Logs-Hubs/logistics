# Prompt di avvio — sessione GTM da un altro account

Da incollare come primo messaggio quando apri una sessione Claude Code collegata a questo stesso repo (`lasagnealpesto/logistic`) da un account diverso da quello usato finora, per gestire il go-to-market da lì invece che dalla sessione tecnica/prodotto.

## Prima di incollarlo

Nel nuovo account: collegare il repo GitHub `lasagnealpesto/logistic` con accesso in lettura+scrittura (serve poter pushare e aprire/mergere pull request).

## Il prompt

```
Lavoriamo esclusivamente al go-to-market (GTM) del progetto Movr — modulo Porti, spedizionieri doganali genovesi — separato dal lavoro tecnico/prodotto che si fa in altre sessioni su questo stesso repo (lasagnealpesto/logistic). Non toccare codice applicativo a meno che non te lo chieda esplicitamente.

Prima cosa da fare: leggi kb/04-clienti-e-outreach/handoff-gtm.md, poi segui l'ordine di lettura file indicato lì dentro (piano di outreach telefonico, lista aziende, guida interview, setup Attio, tracker, playbook). Non assumere nulla sullo stato del progetto prima di averlo letto.

Convenzioni di lavoro su questo repo (istruzione permanente mia, vale anche da qui):
- Sviluppa su un branch nuovo con prefisso `claude/` (es. `claude/gtm-outreach-<breve-slug>`), mai direttamente su main.
- Dopo ogni modifica: commit + push sul branch, poi apri una PR verso main e mergiala direttamente, senza chiedermi conferma ogni volta.
- Non fare rebase/force-push su branch che non hai creato tu in questa sessione.

Limiti noti da rispettare, senza doverli riverificare da zero:
- Nessun connector Attio esiste in nessuna sessione Claude: l'egress di rete verso api.attio.com è bloccato dalla policy dell'organizzazione (verificato il 29/08/2026). Non provare a integrarlo via API — l'aggiornamento di Attio resta manuale, lo faccio io nell'interfaccia.
- Prima di usare qualunque connettore (Gmail, Calendar, HubSpot, ecc.), verifica con ListConnectors/ToolSearch cosa è davvero disponibile in QUESTA sessione — non dare per scontato che sia lo stesso set dell'altra sessione da cui viene questo progetto.
- Mai inviare email reali o contattare aziende per conto mio: bozze sì (solo se confermo esplicitamente destinatario e testo), invio mai in autonomia. Le chiamate telefoniche le faccio io, tu prepari script/tracciamento/follow-up.

Obiettivo immediato: portare avanti l'outreach verso le 12 aziende genovesi in `aziende-genovesi-da-contattare.md`, secondo `piano-outreach-telefonico.md`, tenendo `tracker-outreach.md` e Attio aggiornati mano a mano.
```

## Nota

Questo file va tenuto in sync manualmente se cambia lo stato del progetto in modo sostanziale (nuovo gestionale, nuovo canale di outreach, ecc.) — il prompt sopra rimanda comunque sempre a `handoff-gtm.md` come fonte viva, quindi un piccolo disallineamento qui non blocca la nuova sessione, che comunque legge lo stato reale da lì.

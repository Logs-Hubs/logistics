# Port Trucking OS — Demo MVP

Piattaforma dimostrativa per spedizionieri doganali genovesi: coordina appuntamenti multi-terminal, tracking spedizioni e comunicazione con i vettori, in un'unica vista — invece di telefono, email e piattaforme separate per ogni terminal.

**Stato: demo con dati mock**, pensata per raccogliere feedback da design partner. Nessuna integrazione reale con il Port Community System o i sistemi dei terminal — vedi `project_spec.json` per lo scope esatto e cosa è volutamente fuori perimetro in questa fase.

## Schermate

- `/` — Dashboard spedizioniere: colpo d'occhio su spedizioni attive, da pianificare, in scadenza
- `/calendario` — Calendario appuntamenti multi-terminal (Genova Porto Vecchio, PSA Prà, Savona-Vado) con prenotazione interattiva
- `/spedizioni/[id]` — Timeline di tracking di una spedizione, dal ritiro al rientro container vuoto
- `/driver` — Anteprima mobile di cosa vedrebbe l'autista, con notifica push simulata

## Sviluppo locale

```bash
npm install
npm run dev
```

Apri http://localhost:3000

## Deploy

Pensato per Vercel: collega il repo su vercel.com/new, nessuna variabile d'ambiente richiesta per la demo (dati mock in `lib/data.ts`).

## Struttura dati

Tutti i dati mock vivono in `lib/data.ts` (spedizioni, vettori, terminal, generazione slot calendario). Modificare quel file per adattare la demo a un'azienda specifica prima di una call.

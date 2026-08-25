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

## Aziende genovesi da contattare (design partner)

Spedizionieri doganali e case di spedizione di Genova, filtrate per dimensione e priorità di contatto. Dati verificati dove indicato — quelli senza badge "verificato" vanno confermati (LinkedIn / visura) prima del primo contatto.

### Priorità alta — contattare per prime (4)

| Azienda | Sede | Dipendenti | Fondata | Note | Fonte |
|---|---|---|---|---|---|
| Lena Spedizioni Srl | Genova | 20–49 | 1993 | Spedizioni internazionali + servizi doganali — struttura solida, fascia dimensionale ideale. | Verificato |
| Ambra Mar Srl | Genova | 20–49 | 1990 | Spedizioni internazionali su scala globale, supporto a più settori industriali — probabile coordinamento multi-cliente. | Verificato |
| GDT Logistic SpA | Genova | 20–49 | 1981 | Groupage + spedizioni internazionali, gestione carichi parziali e completi — buon fit per coordinamento vettori terzi. | Verificato |
| Spedimar Srl | Genova | 20–49 | — | Spedizionieri internazionali — dimensione confermata, da approfondire il profilo online. | Verificato |

### Secondo giro — dimensione da confermare (8)

| Azienda | Sede | Dipendenti | Fondata | Note | Fonte |
|---|---|---|---|---|---|
| Spediservices Srl | Genova | — | 2005 | Non è uno spedizioniere ma il braccio consulenziale/digitale di Spediporto — miglior primo contatto per aprire la rete verso l'intera associazione. | Da confermare |
| Lanza International Srl | Genova | 20–49 | 1996 | Groupage e logistica, rete di distribuzione nazionale — dimensione confermata ma focus più su groupage stradale che container. | Verificato |
| Parodi Forwarding | Genova | — | — | Comunicazione online curata, segno di attenzione al digitale. Taglia media presunta. | Da confermare |
| CNS Casasco & Nardi SpA | Genova · membro storico consorzio Goas | 50–99 | 1956 | Leggermente sopra il target dimensionale ma storica e strutturata — verificare se corrisponde a "S.T.S. Casasco & Nardi" del consorzio Goas. | Verificato |
| Oliaro Casa di Spedizioni | Genova · membro consorzio Goas | — | — | Storica, membro del consorzio Goas (2019) — dimensione attuale da verificare su LinkedIn. | Da confermare |
| Mastarmar Spedizioni | Genova · membro consorzio Goas | — | — | Membro consorzio Goas, taglia media presunta. | Da confermare |
| Sinergy Cargo Management | Genova · membro consorzio Goas | — | — | Nome suggerisce focus operativo/gestionale — potenzialmente più ricettivi a un tool software. | Da confermare |
| Ocean Sped | Genova | — | anni '90 | Comunicazione online orientata a flessibilità/soluzioni su misura — segnale positivo di apertura. | Da confermare |

### Escluse dal primo giro (3)

| Azienda | Sede | Fondata | Motivo esclusione | Fonte |
|---|---|---|---|---|
| Priano Marchelli | Genova | — | Ha già un fornitore IT esterno (Digilogix) — probabile sistema proprio già in uso. | Esclusa |
| Cav. Placido Macor & C. | Genova · dal 1930 | 1930 | Azienda molto storica/familiare — possibile resistenza al cambiamento più alta. | Esclusa |
| Weltra | Genova · 60 anni di attività | — | Profilo molto tradizionale, comunicazione poco orientata al digitale. | Esclusa |

**Nota sui dati.** I dipendenti indicati come "Verificato" provengono da un aggregatore B2B (Europages), non da fonti camerali ufficiali — trattali come indicativi. Le voci "Da confermare" vanno controllate su LinkedIn (numero dipendenti, attività recente = segnale di apertura digitale) prima del primo contatto. Aggiorna questa sezione man mano che verifichi ogni azienda.

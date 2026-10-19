# Movr

Piattaforma di coordinamento logistico, in due moduli sotto lo stesso brand: **Porti** (spedizionieri doganali genovesi: appuntamenti multi-terminal, tracking spedizioni, container vuoti) e **Flotte** (AI Transport Manager per PMI di autotrasporto: pianificazione flotta, backhaul, gestione eccezioni). Un solo deploy, uno switch nella sidebar dell'app per passare dall'uno all'altro.

## Guida: come orientarsi in questo repo

Se torni su questo progetto dopo un po' e non ricordi a che punto eravamo, leggi in quest'ordine:

1. **`kb/todo.md`** — cosa è aperto adesso, cosa è stato fatto di recente. Il punto di partenza più veloce.
2. **`kb/README.md`** — indice della knowledge base: prodotto, mercato, competitor, clienti/outreach, stato tecnico. Ogni cartella dentro `kb/` è un documento a sé su un argomento specifico.
3. **`handoff.json`** e **`project_spec.json`** — contesto di business più esteso e spec funzionale originale (parzialmente sovrapposti a `kb/`, ma con qualche dettaglio storico in più).

Il codice, in breve:

- **root** (questo progetto Next.js): la piattaforma. `app/` = modulo Porti (`/`, `/calendario`, `/spedizioni/[id]`, `/driver`) + modulo Flotte (`/flotta`). `lib/` contiene la logica di dominio: `lib/data.ts`, `lib/queries.ts`, `lib/store.tsx` per Porti (dati veri su Supabase), `lib/flotta/` per Flotte (dati demo locali, non collegato a un database).
- **`clyo-site/`** — sito marketing di Movr, progetto Next.js indipendente, deploy Vercel separato (il nome della cartella è storico, risale a quando il brand si chiamava Clyo: vedi `clyo-site/README.md`).
- **`ios-driver-app/`** — scaffold Swift/SwiftUI per l'app driver iOS (non ancora compilata), più la guida completa per arrivare a TestFlight in `ios-driver-app/README.md`.
- **`supabase/schema.sql`** — schema del database della piattaforma.

## Schermate — modulo Porti

- `/` — Dashboard spedizioniere: colpo d'occhio su spedizioni attive, da pianificare, in scadenza
- `/calendario` — Calendario appuntamenti multi-terminal (Genova Porto Vecchio, PSA Prà, Savona-Vado) con prenotazione, modifica, annullamento
- `/spedizioni/[id]` — Timeline di tracking di una spedizione, dal ritiro al rientro container vuoto
- `/driver` — Anteprima mobile di cosa vedrebbe l'autista, con notifica push simulata

## Schermate — modulo Flotte

- `/flotta` — Centro comando: pianificazione flotta con motore deterministico, confronto piano manuale vs ottimizzato, backhaul finder, simulatore di ritardo

## Sviluppo locale

```bash
npm install
npm run dev
```

Apri http://localhost:3000. Richiede le variabili d'ambiente Supabase (vedi sotto) per funzionare: il modulo Porti legge/scrive dal database reale, non più da dati mock.

## Deploy

Due progetti Vercel separati sullo stesso repo, differenziati per "Root Directory":

- **piattaforma** (root directory vuota): richiede `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `DRIVER_API_KEY` (quest'ultima per le route `/api/driver/*` usate dalla futura app iOS), `BASIC_AUTH_USER`/`BASIC_AUTH_PASS` (login piattaforma, vedi `/login`) e `ANTHROPIC_API_KEY` (estrazione AI dell'intake ordini container, `/api/container/intake` — senza questa variabile il pulsante "Estrai con AI" risponde con un errore leggibile, il form manuale continua a funzionare)
- **sito marketing** (root directory `clyo-site`): nessuna variabile richiesta

## Struttura dati

Modulo Porti: schema in `supabase/schema.sql`, query in `lib/queries.ts`, mutazioni in `app/actions.ts`. Modulo Flotte: dati demo generati deterministicamente in `lib/flotta/datiDemo.ts`, nessun database.

## Aziende genovesi da contattare (design partner, modulo Porti)

Come da strategia in `handoff.json` (`business_context.strategy`), la fase 1 del go-to-market prevede design partner gratuiti (3-4 aziende) in cambio di feedback settimanale strutturato, sul wedge stretto slot booking + notifiche — non integrazione reale col PCS. L'ICP target: spedizioniere doganale genovese, 5-30 dipendenti, import/export container su Genova/Savona-Vado, lavora con vettori terzi (non ha flotta propria), idealmente associato Spediporto.

Le aziende qui sotto sono spedizionieri doganali e case di spedizione di Genova filtrate su questo ICP, in ordine di priorità di contatto. Dati verificati dove indicato — quelli senza badge "verificato" vanno confermati (LinkedIn / visura) prima del primo contatto. Questa sezione è la lista di lavoro aggiornata: se diverge da `kb/04-clienti-e-outreach/aziende-genovesi-da-contattare.md`, questa qui prevale (sincronizzala dopo ogni modifica).

Per il modulo Flotte (autotrasportatori PMI, ambito nazionale) la lista equivalente vive solo in `kb/04-clienti-e-outreach/aziende-autotrasporto-nazionale.md`, ancora preliminare.

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
| Parodi Forwarding | Genova | — | — | Comunicazione online curata, segno di attenzione al digitale. Taglia media presunta. Acquisita al 100% dal gruppo olandese Gaston Schul (1° giugno 2026), ma ha mantenuto nome, sede e organico — Manlio Marino confermato ancora direttore. | Da confermare |
| CNS Casasco & Nardi SpA | Genova · membro storico consorzio Goas | 50–99 | 1956 | Leggermente sopra il target dimensionale ma storica e strutturata — verificare se corrisponde a "S.T.S. Casasco & Nardi" del consorzio Goas. | Verificato |
| Oliaro Casa di Spedizioni | Genova · membro consorzio Goas | — | — | Storica, membro del consorzio Goas (2019) — dimensione attuale da verificare su LinkedIn. | Da confermare |
| Mastermar Spedizioni e Controlli Internazionali S.r.l. | Genova · membro consorzio Goas | — | — | Nome corretto (era riportato come "Mastarmar", refuso). Membro consorzio Goas, dal 1995, sede Piazza Fossatello 3/5/B, stato AEO. | Verificato |
| Sinergy Cargo Management | Genova · membro consorzio Goas | — | — | Nome suggerisce focus operativo/gestionale — potenzialmente più ricettivi a un tool software. | Da confermare |
| Ocean Sped | Genova | — | anni '90 | Comunicazione online orientata a flessibilità/soluzioni su misura — segnale positivo di apertura. | Da confermare |

### Escluse dal primo giro (3)

| Azienda | Sede | Fondata | Motivo esclusione | Fonte |
|---|---|---|---|---|
| Priano Marchelli | Genova | — | Ha già un fornitore IT esterno (Digilogix) — probabile sistema proprio già in uso. | Esclusa |
| Cav. Placido Macor & C. | Genova · dal 1930 | 1930 | Azienda molto storica/familiare — possibile resistenza al cambiamento più alta. | Esclusa |
| Weltra | Genova · 60 anni di attività | — | Profilo molto tradizionale, comunicazione poco orientata al digitale. | Esclusa |

**Nota sui dati.** I dipendenti indicati come "Verificato" provengono da un aggregatore B2B (Europages), non da fonti camerali ufficiali — trattali come indicativi. Le voci "Da confermare" vanno controllate su LinkedIn (numero dipendenti, attività recente = segnale di apertura digitale) prima del primo contatto. Aggiorna questa sezione man mano che verifichi ogni azienda.

# Roadmap — Movr come AI Operations Layer per spedizionieri

Arrivata come brief esterno ("MOVR Product Strategy and Software Upgrade Brief"), valutata e in
parte già costruita. Riassume la visione a lungo termine e distingue cosa è già reale da cosa resta
solo dichiarato per ora — non modificare questa distinzione senza aver verificato lo stato reale nel
codice.

## La tesi

Movr non è solo un tool di coordinamento portuale né un software di gestione documentale: è un
layer di intelligenza operativa sopra i sistemi logistici frammentati (email, PDF, Excel, terminal,
dogana). Loop di prodotto: **Intake → Struttura → Comprendi → Decidi → Esegui → Memoria**. La
Spedizione resta sempre l'oggetto centrale — i moduli si agganciano ad essa, non vivono isolati.

## Stato per fase

| Fase | Nome | Stato | Dove |
|---|---|---|---|
| 1 | **Customs Brain** — documenti disordinati → caso doganale strutturato | **Costruita** | `/customs`, `lib/customs/` |
| 2 | **Exception Center** — "cosa serve guardare oggi" | **Costruita**, assorbita nella dashboard Porti | `AttenzioneOggi` in `app/DashboardClient.tsx`, `lib/exceptions/` |
| 3 | **Cost Brain** — esposizione economica da demurrage/detention | **Costruita in forma minima**, assorbita nell'Exception Center | stessa dashboard: badge "€ stimati" solo su demurrage già scaduto |
| 4 | Communication Brain (email → eventi strutturati) | Non costruita | — |
| 5 | Action Agents (esecuzione automatica con permessi) | Non costruita | — |
| 6 | Predictive Operations | Non costruita | — |

Moduli aggiuntivi del brief (Shipment Memory, Carrier/Trucking Orchestration, Customer Portal) sono
strategicamente sensati ma non hanno priorità: richiedono dati o integrazioni che oggi non esistono.

## Cosa è stato effettivamente costruito (fasi 1-3)

**Customs Brain** (`lib/customs/tipi.ts`, `motore.ts`, `datiDemo.ts`, `store.tsx`, `app/customs/`):
- Terzo modulo Movr nella Sidebar (Porti / Flotte / Dogana)
- `CasoDoganale` collegato opzionalmente a una `Spedizione` reale via `spedizioneId`
- Dashboard doganale: casi raggruppati in Attenzione richiesta / In revisione / Pronte per la dogana
- Simulazione di document intake ("drop" di uno ZIP demo) con sequenza di stati di elaborazione
- Readiness score calcolato deterministicamente da problemi aperti + classificazioni HS non approvate
- Validazione: problemi con severità (bloccante/errore/attenzione/info), azione "Richiedi informazioni"
  che genera una bozza di testo (non invia nulla)
- Classificazione HS: suggerita dall'IA con confidenza, richiede approvazione esplicita dell'operatore
  (mai auto-approvata) — coerente con la regola "non far decidere all'IA cose ad alto rischio"
- Copilot contestuale al caso, risposte a template su dati reali calcolati (nessun LLM reale collegato)
- "Crea bozza dichiarazione": abilitata solo a readiness 100, dichiaratamente demo (nessuna
  integrazione reale con la dogana)

**Exception Center + Cost Brain** (`lib/exceptions/`):
- Pannello "Attenzione oggi" in cima alla dashboard Porti, prima delle stat card esistenti
- Correla in un'unica lista prioritizzata: blocchi doganali aperti (da Dogana) + appuntamento non
  pianificato + demurrage in scadenza (da Porti) — non introduce segnali nuovi, incrocia quelli già
  calcolati altrove
- Un caso doganale bloccante spiega concretamente perché una spedizione Porti è "in ritardo"
  (collegamento a monte reso visibile, non solo dichiarato)
- Esposizione economica stimata (tariffa flat/giorno) mostrata **solo** quando il demurrage è già
  scaduto — deliberatamente non proiettata su rischio futuro, per non inventare un numero
- `CustomsProvider` promosso da `app/customs/layout.tsx` (rimosso) al root `app/layout.tsx`: serve
  perché la dashboard Porti, fuori dal namespace `/customs`, possa leggere lo stato dei casi
  doganali dallo stesso Context — attenzione a non re-innestare un secondo `CustomsProvider` più in
  basso nell'albero, altrimenti dashboard e `/customs` divergono su due copie di stato

## Perché le fasi 4-6 restano ferme per ora

Customs Brain ha funzionato come demo convincente perché il "drop di un file" è un'interazione reale
anche senza backend: si può simulare in modo credibile con dati mock deterministici. Le fasi
successive non hanno lo stesso trucco disponibile:

- **Communication Brain** richiede ingestion email reale (nessun accesso IMAP/webhook in questo
  ambiente) — uno screen "email in arrivo" con dati finti sarebbe l'esatto placeholder poco
  convincente che il brief stesso chiede di evitare
- **Action Agents** presuppone un sistema di permessi e canali di esecuzione reali (invio email,
  notifiche) che non esistono ancora nemmeno per le funzioni già costruite
- **Predictive Operations** richiede dati storici reali per essere credibile, non demo con 4-7
  spedizioni

Quando si vorrà riprendere da qui: la fase più economica da aggiungere dopo non è una di queste, è
probabilmente estendere l'Exception Center con più fonti di segnale mano a mano che il modulo Flotte
o l'uso reale del prodotto generano dati veri da correlare — vedi `todo.md` per lo stato dei prossimi
passi.

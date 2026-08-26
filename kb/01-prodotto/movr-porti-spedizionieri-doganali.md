# Movr Porti — piattaforma per spedizionieri doganali (Genova)

## Cos'è

Piattaforma di coordinamento portuale per spedizionieri doganali genovesi. Mette in un'unica vista: appuntamenti multi-terminal, tracking del mezzo (ritiro container pieno / rientro vuoto) e comunicazione con i vettori terzi, al posto di telefono, email, WhatsApp e le piattaforme di prenotazione separate di ogni terminal.

## Il problema che risolve

Il Port Community System (PCS) di Genova ha "coni d'ombra": traccia la merce, non il mezzo. In particolare:
- Ogni terminal (Genova Porto Vecchio, PSA Prà, Savona-Vado) ha il proprio sistema di appuntamenti, orari e logica
- Il rientro del container vuoto dopo la consegna non è tracciato da nessun sistema, gestito a telefono, con rischio concreto di detention
- Lo spedizioniere non ha flotta propria: coordina vettori terzi via telefonate, senza vista d'insieme su cosa succede oggi

## ICP (Ideal Customer Profile)

Spedizioniere doganale genovese, 5-30 dipendenti, gestisce import/export container su Genova/Savona-Vado, lavora con vettori terzi (non ha flotta propria), idealmente associato Spediporto.

## Cosa fa oggi la piattaforma (stato reale)

- Dashboard con colpo d'occhio su spedizioni attive, da pianificare, in scadenza (con alert demurrage)
- Calendario multi-terminal con prenotazione, modifica e annullamento appuntamenti
- Timeline di tracking per spedizione: arrivo nave → scarico → sdoganamento → appuntamento gate → ritiro → consegna → rientro vuoto
- Vista "cosa vede l'autista" in tempo reale, con notifiche push simulate e azioni (segnala ritiro, segnala rientro vuoto)
- Backend reale su Supabase (Postgres), non più dati mock: persistenza vera, aggiornamenti ottimistici in UI
- API dedicate (`/api/driver/*`) pensate per una futura app iOS nativa per l'autista (scaffold Swift già scritto, non ancora compilato/pubblicato)

Vedi `05-stato-tecnico/` per i dettagli implementativi e cosa manca.

## Strategia go-to-market

**Fase 1 (0-6 mesi):** design partner gratuiti (3-4 aziende) in cambio di feedback settimanale strutturato. Wedge stretto: slot booking + notifiche, NON integrazione reale col PCS (troppo lenta/dipendente da terzi in questa fase).

**Fase 2 (6-18 mesi):** referral via Spediporto/Federlogistica Liguria, dialogo formale con AdSP/Liguria Digitale.

**Fase 3 (18-36 mesi):** replica su La Spezia, Livorno, Trieste, poi eventualmente un porto estero (Barcellona/Valencia).

## Deliberatamente fuori perimetro (per ora)

- Integrazione reale con le API del PCS di Liguria Digitale
- Integrazione reale con i sistemi proprietari dei singoli terminal
- Autenticazione multi-tenant reale
- Fatturazione, pagamenti, compliance documentale reale

## Brand

Nome: **Movr** (modulo "Porti"). Sito marketing separato (deploy Vercel indipendente dalla piattaforma), palette navy/teal/accent arancione. Vedi `05-stato-tecnico/` per URL e dettagli deploy.

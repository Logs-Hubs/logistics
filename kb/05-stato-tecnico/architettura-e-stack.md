# Architettura e stack tecnico

## Repository

`github.com/lasagnealpesto/logistic`, branch di lavoro `claude/repo-access-push-7v25nf`. Monorepo con due progetti Next.js indipendenti:
- root (`/`) — piattaforma Movr: modulo Porti (`/`, `/calendario`, ecc.) + modulo Flotte/AI Transport Manager (`/flotta`)
- `clyo-site/` — sito marketing Movr, progetto Next.js separato nello stesso repo (nome cartella legacy, non aggiornato per non rompere la config Vercel — vedi nota in `clyo-site/README.md`)

## Stack piattaforma (root)

- Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- Backend: Supabase (Postgres). Client server-only in `lib/supabase/server.ts`, usa `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SECRET_KEY` (service role, bypassa RLS)
- Server Actions (`app/actions.ts`) per le mutazioni, con `revalidatePath` sulle route coinvolte
- Stato condiviso lato client: `lib/store.tsx` (`OperationsProvider`), aggiornamento ottimistico in UI + scrittura reale in background su Supabase
- API REST dedicate (`app/api/driver/*`) per la futura app iOS driver, protette da header `Authorization: Bearer <DRIVER_API_KEY>`

## Stack sito marketing (`clyo-site/`)

Next.js 16 indipendente, stessa palette, deploy Vercel separato. Sezioni a schermo intero con scroll-snap su desktop.

## Deploy

Due progetti Vercel distinti sullo stesso repo GitHub, differenziati per "Root Directory":
- progetto **"logistic"** → root directory vuota → piattaforma
- progetto **"logistic-site"** → root directory `clyo-site` → sito marketing

Account Vercel che deploya davvero: `lormilano99@gmail.com`, team "lormilano-projects". (Diverso dall'account Vercel raggiungibile dagli strumenti MCP di Claude in alcune sessioni: attenzione a questo quando si debugga da qui.)

## Variabili d'ambiente richieste (piattaforma)

- `NEXT_PUBLIC_SUPABASE_URL` — tipo Config, non Secret (deve essere esposta al client)
- `SUPABASE_SECRET_KEY` — service role key
- `DRIVER_API_KEY` — chiave condivisa per le route `/api/driver/*`, usata anche dall'app iOS

## Modulo AI Transport Manager (`/flotta`)

Self-contained in `lib/flotta/` e `app/flotta/`. Non collegato a Supabase: stato locale React, dati demo generati deterministicamente in `lib/flotta/datiDemo.ts`. Switch Porti/Flotte nella sidebar (`components/Sidebar.tsx`).

## App driver iOS

Scaffold Swift/SwiftUI completo in `ios-driver-app/` (modelli, client HTTP verso `/api/driver/*`, schermata principale), non ancora compilato/pubblicato: serve un Mac con Xcode. Guida passo-passo per TestFlight in `ios-driver-app/README.md`.

## Cosa NON è ancora vero (limiti noti)

- Nessuna integrazione reale con PCS/terminal/sistemi terzi (deliberato, fuori scope MVP)
- Nessuna autenticazione multi-tenant reale
- Nessuna notifica push reale (solo simulata in UI)
- Il modulo AI Transport Manager non ha un vero motore LLM collegato: le risposte "chiedi all'AI" sono template su dati reali calcolati, non generate da un modello

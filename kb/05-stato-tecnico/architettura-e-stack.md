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

Self-contained in `lib/flotta/` e `app/flotta/`. Non collegato a Supabase: stato locale React, dati demo generati deterministicamente in `lib/flotta/datiDemo.ts`. Switch Porti/Flotte/Dogana nella sidebar (`components/Sidebar.tsx`).

## Modulo Dogana / Customs Brain (`/customs`)

Terzo modulo Movr, a differenza di Flotte **agganciato** al modulo Porti invece che isolato: `lib/customs/tipi.ts` (`CasoDoganale`) ha un `spedizioneId` opzionale verso `lib/data.ts` (`Spedizione`). Nessun Supabase: stato in `lib/customs/store.tsx` (`CustomsProvider`/`useCustoms`), montato nel root `app/layout.tsx` (non più in un layout annidato sotto `/customs` — deve restare così, altrimenti la dashboard Porti e `/customs` finiscono su due copie separate dello stesso stato). Dati demo deterministici in `lib/customs/datiDemo.ts`, motore (readiness, validazione, copilot a template) in `lib/customs/motore.ts`.

`lib/exceptions/` (Exception Center): pure funzioni che leggono sia `Spedizione` che `CasoDoganale` e producono la lista "Attenzione oggi" mostrata in cima a `app/DashboardClient.tsx` — nessuno stato proprio, nessuna scrittura. Vedi `01-prodotto/roadmap-ai-operations-layer.md` per la visione completa (fasi 1-6) e cosa resta deliberatamente non costruito.

## App driver iOS

Codice Swift/SwiftUI in `ios-driver-app/MovrDriver/` (modelli, client HTTP verso `/api/driver/*`, schermata principale). **Compilata e pubblicata su TestFlight** (Internal Testing) dall'utente su Xcode, con il mio supporto passo-passo da questa sessione — build 1 caricata e installata su dispositivo reale. Guida completa in `ios-driver-app/README.md`. Setup di Xcode Cloud proposto (non ancora confermato fatto) per automatizzare build/upload futuri ad ogni push, invece del giro manuale Archive → Distribute.

## Cosa NON è ancora vero (limiti noti)

- Nessuna integrazione reale con PCS/terminal/sistemi terzi (deliberato, fuori scope MVP)
- Nessuna autenticazione multi-tenant reale
- Nessuna notifica push reale (solo simulata in UI, sia web che iOS)
- Il modulo AI Transport Manager non ha un vero motore LLM collegato: le risposte "chiedi all'AI" sono template su dati reali calcolati, non generate da un modello

## Limiti dell'ambiente di sviluppo (per chi riprende il progetto, incluso un altro LLM)

- Le sessioni Claude in questo ambiente non hanno accesso diretto al database Supabase live: build e lint si possono verificare, il comportamento runtime va confermato dall'utente dopo il deploy
- Nessun accesso a Xcode/macOS: il codice per l'app iOS viene scritto qui ma compilato/archiviato/caricato sempre dall'utente sul proprio Mac, guidato passo-passo via screenshot
- L'account Vercel raggiungibile dagli strumenti MCP di Claude in questa sessione può differire da quello che deploya davvero (`lormilano99@gmail.com`): verificare sempre quale account è collegato prima di agire
- L'egress di rete verso domini generici (es. `*.vercel.app`, siti aziendali per ricerca competitor/clienti) è bloccato per fetch diretto: solo la ricerca web (query, non URL specifici) funziona

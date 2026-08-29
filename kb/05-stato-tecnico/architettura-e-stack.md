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

Self-contained in `lib/flotta/` e `app/flotta/`. Non collegato a Supabase: stato demo deterministico in `lib/flotta/datiDemo.ts`. Switch Porti/Flotte/Dogana nella sidebar (`components/Sidebar.tsx`).

**Stato del piano condiviso**: `lib/flotta/store.tsx` (`PianoProvider`/`usePianoFlotta`) — piano, problemi, KPI e le azioni (`ottimizzaOggi`, `applicaProblema`, `simula`). Era locale a `FlottaClient` (invisibile a qualunque altra vista); sollevato in un provider quando è servito all'Exception Center di Flotte (sotto) per leggere i problemi realmente visti/risolti dall'operatore, non uno snapshot ricalcolato da zero.

### Sotto-modulo Documenti trasporto (`/flotta/documenti`)

Come Dogana per Porti: `lib/flotta/documenti/tipi.ts` (`LavoroTrasporto`) ha un `ordineId` opzionale verso `lib/flotta/tipi.ts` (`Ordine`). Stato in `lib/flotta/documenti/store.tsx` (`DocumentiProvider`). Dati demo in `lib/flotta/documenti/datiDemo.ts`, motore (stato fatturazione, copilot) in `lib/flotta/documenti/motore.ts`.

`PianoProvider` e `DocumentiProvider` sono entrambi montati in `app/flotta/layout.tsx` (non più annidato solo sotto `/flotta/documenti`): l'Exception Center di Flotte, su `/flotta`, deve leggere anche i dati dei documenti. Restano comunque fuori dal root layout — Porti e Dogana non li usano.

La Sidebar gestisce due voci di navigazione sotto lo stesso prefisso (`/flotta` e `/flotta/documenti`): l'evidenziazione dell'item attivo usa "il match più specifico vince" (vedi `corrisponde()` in `components/Sidebar.tsx`) invece del semplice confronto per primo segmento di path usato quando ogni modulo aveva un solo prefisso a testa.

### Exception Center di Flotte (`lib/flotta/attenzione/`)

Come `lib/exceptions/` per Porti, ma resta dentro `lib/flotta/` perché correla solo dati del mercato autotrasportatori (non incrocia moduli diversi): problemi aperti del planner (`Problema`) + lavori con fatturato bloccato (`LavoroTrasporto`) in un'unica lista "Attenzione oggi" mostrata in cima a `FlottaClient` (`/flotta`). Nessuno stato proprio, nessuna scrittura, nessuna proiezione: l'esposizione in euro copre solo denaro già a rischio o già maturato, mai un rischio futuro stimato.

## Modulo Dogana / Customs Brain (`/customs`)

Terzo modulo Movr, a differenza di Flotte **agganciato** al modulo Porti invece che isolato: `lib/customs/tipi.ts` (`CasoDoganale`) ha un `spedizioneId` opzionale verso `lib/data.ts` (`Spedizione`). Nessun Supabase: stato in `lib/customs/store.tsx` (`CustomsProvider`/`useCustoms`), montato nel root `app/layout.tsx` (non più in un layout annidato sotto `/customs` — deve restare così, altrimenti la dashboard Porti e `/customs` finiscono su due copie separate dello stesso stato). Dati demo deterministici in `lib/customs/datiDemo.ts`, motore (readiness, validazione, copilot a template) in `lib/customs/motore.ts`.

`lib/exceptions/` (Exception Center): pure funzioni che leggono sia `Spedizione` che `CasoDoganale` e producono la lista "Attenzione oggi" mostrata in cima a `app/DashboardClient.tsx` — nessuno stato proprio, nessuna scrittura. Vedi `01-prodotto/roadmap-ai-operations-layer.md` per la visione completa (fasi 1-6) e cosa resta deliberatamente non costruito.

## App driver iOS

Codice Swift/SwiftUI di riferimento in `ios-driver-app/MovrDriver/` di **questo** repo (modelli, client HTTP verso `/api/driver/*`, schermata principale) — ma il progetto Xcode vero e proprio vive nel repo dedicato **`lasagnealpesto/movr-driver-ios`** (necessario perché Xcode Cloud osserva un solo repo Git contenente il `.xcodeproj` reale). **Compilata e pubblicata su TestFlight** (Internal Testing), build 1 installata e testata su dispositivo reale.

**Xcode Cloud attivo**: ogni push su `main` di `movr-driver-ios` builda e carica da solo una nuova build su TestFlight (gruppo "Movr - Internal Testing"), senza Archive/Distribute manuale. Ho accesso push diretto a `movr-driver-ios` — per modifiche all'app iOS lavoro lì, non in `ios-driver-app/` di questo repo (che resta solo sorgente di riferimento/documentazione). Guida completa, incluse le due trappole reali del setup (scheme non condiviso, "Distribution Preparation" non impostata sull'azione Archive), in `ios-driver-app/README.md`.

**Build di test (demo mode, `AppConfig.swift` → `AppMode.demo = true`)**: dati locali (spedizione seed coerente con `supabase/schema.sql`, SP-2461), salta la schermata di login e va dritto alla vista driver. Serve a validare UI e pipeline Xcode Cloud senza dipendere da un vero login. La schermata driver (`SpedizioneFlowView.swift`) è a tutto schermo: barra di avanzamento animata, timeline verticale dei 3 step operativi (arrivo, ritiro, rientro vuoto) con stato visivo per step, un pulsante d'azione grande e centrale con anelli pulsanti in continuo (per farsi notare) e un effetto particelle alla conferma di ogni step. Rimettere `AppMode.demo = false` per tornare al comportamento reale collegato a Movr.

**Unica interazione davvero connessa**: le conferme "ritiro" e "rientro vuoto" (non "arrivo", solo UI locale) mandano anche — in background, best-effort, senza bloccare l'interfaccia — la stessa richiesta della build reale verso `/api/driver/ritiro` e `/api/driver/rientro-vuoto`. Risultato: premendo il pulsante sull'app, lo stato della spedizione demo SP-2461 cambia davvero anche sulla dashboard web (dopo un refresh). Autenticazione con `AppMode.demoVettoreId`/`demoApiKey` in `AppConfig.swift` (`v1` / `movr-demo-driver-2026`, valore non sensibile: apre solo la scrittura su quella spedizione demo già pubblica). **Richiede la variabile d'ambiente `DRIVER_API_KEY` impostata su Vercel** (progetto "logistic", stesso valore di `demoApiKey`) — non gestibile dagli strumenti di questa sessione, va aggiunta manualmente da Vercel → progetto "logistic" → Settings → Environment Variables, poi un redeploy della produzione perché la nuova variabile venga letta. Finché non è impostata, le chiamate falliscono silenziosamente e la demo resta comunque fluida (fallback locale).

## Cosa NON è ancora vero (limiti noti)

- Nessuna integrazione reale con PCS/terminal/sistemi terzi (deliberato, fuori scope MVP)
- Nessuna autenticazione multi-tenant reale
- Nessuna notifica push reale (solo simulata in UI, sia web che iOS)
- Il modulo AI Transport Manager non ha un vero motore LLM collegato: le risposte "chiedi all'AI" sono template su dati reali calcolati, non generate da un modello
- Il modulo Dogana non ha OCR/estrazione documenti reale né un vero motore LLM: intake, estrazione e classificazione HS sono dati mock deterministici
- Stesso discorso per Documenti trasporto (`/flotta/documenti`): nessun OCR/email ingestion reale, nessun invio reale dei solleciti generati (restano bozze)

## Limiti dell'ambiente di sviluppo (per chi riprende il progetto, incluso un altro LLM)

- Le sessioni Claude in questo ambiente non hanno accesso diretto al database Supabase live: build e lint si possono verificare, il comportamento runtime va confermato dall'utente dopo il deploy
- Nessun accesso a Xcode/macOS: il codice per l'app iOS viene scritto e pushato qui, ma non posso compilare né vedere l'interfaccia — build/archive/upload sono automatici via Xcode Cloud dopo il push, la verifica visiva (l'animazione è quella voluta? il layout è leggibile?) resta sempre da fare sul dispositivo reale via TestFlight
- L'account Vercel raggiungibile dagli strumenti MCP di Claude in questa sessione può differire da quello che deploya davvero (`lormilano99@gmail.com`): verificare sempre quale account è collegato prima di agire
- L'egress di rete verso domini generici (es. `*.vercel.app`, siti aziendali per ricerca competitor/clienti) è bloccato per fetch diretto: solo la ricerca web (query, non URL specifici) funziona

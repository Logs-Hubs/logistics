# Movr Driver — app iOS per l'autista

Non ho accesso a un Mac/Xcode in questo ambiente, quindi non posso creare il
progetto Xcode né compilarlo. Qui dentro trovi però il codice Swift vero e
funzionante (SwiftUI + networking) da incollare in un progetto nuovo, più la
guida per arrivare a TestFlight.

Il codice replica esattamente il flusso che già vedi nella demo web su
`/driver`: arrivo al gate → ritiro container → rientro container vuoto,
chiamando le stesse API della piattaforma (`app/api/driver/*`, già in
`main`).

## Cosa c'è già pronto

- `MovrDriver/Models.swift` — i tipi che rispecchiano `Spedizione` in `lib/data.ts`
- `MovrDriver/APIClient.swift` — client HTTP verso `app/api/driver/*`
- `MovrDriver/AppConfig.swift` — salva ID vettore e chiave API sul device
- `MovrDriver/SetupView.swift` — schermata di configurazione al primo avvio
- `MovrDriver/DriverHomeView.swift` — schermata principale (stessa logica di `DriverPhonePreview.tsx`)
- `MovrDriver/MovrDriverApp.swift` — entry point dell'app

## Passo 1 — Crea il progetto Xcode

1. Apri Xcode (se non ce l'hai: App Store → cerca "Xcode", è gratis, ~15 GB)
2. `File → New → Project`
3. Scegli **iOS → App**
4. Product Name: `MovrDriver`. Interface: **SwiftUI**. Language: **Swift**
5. Salvalo dove preferisci sul Mac (non deve stare per forza dentro questa repo)

## Passo 2 — Sostituisci i file generati con questi

1. Xcode crea da solo un `MovrDriverApp.swift` e un `ContentView.swift`: cancella `ContentView.swift`
2. Trascina dentro il progetto (dal Finder al pannello di sinistra di Xcode, dentro la cartella `MovrDriver`) tutti i file da `ios-driver-app/MovrDriver/` di questa repo, incluso `MovrDriverApp.swift` (sostituisce quello generato)
3. Quando Xcode chiede, spunta "Copy items if needed" e assicurati che il target `MovrDriver` sia selezionato

## Passo 3 — Punta l'app al deploy giusto

In `APIClient.swift`, riga `baseURL`, sostituisci con l'URL vero del progetto
Vercel **"logistic"** (la piattaforma, non il sito marketing).

Su Vercel, nel progetto della piattaforma, aggiungi la variabile d'ambiente:

```
DRIVER_API_KEY=<una-stringa-lunga-a-caso>
```

Quella stessa stringa è la "Chiave API" che inserirai nell'app al primo
avvio (schermata `SetupView`). Senza questa variabile le route
`/api/driver/*` rispondono sempre 401.

## Passo 4 — Prova in simulatore

`Cmd+R` in Xcode con un simulatore iPhone selezionato in alto. Al primo
avvio l'app chiede ID vettore e la chiave API. Gli ID vettore veri sono
quelli seminati in `supabase/schema.sql` (tabella `vettori`): `v1`, `v2`,
`v3`, `v4` — `v1` ha già un appuntamento confermato (SP-2461), buon primo
test. Da lì carica l'appuntamento e i bottoni chiamano davvero la
piattaforma: se confermi un ritiro qui, lo vedrai aggiornarsi anche nella
demo web.

## Passo 5 — Apple Developer Program

Serve per firmare l'app e distribuirla, anche solo su TestFlight a te
stesso:

1. [developer.apple.com](https://developer.apple.com) → **Enroll** → serve un Apple ID (anche personale) → **99 USD/anno**
2. L'iscrizione può richiedere da qualche minuto a 24-48h di verifica

## Passo 6 — Firma l'app

1. In Xcode, seleziona il progetto `MovrDriver` nel pannello di sinistra → tab **Signing & Capabilities**
2. **Team**: seleziona il tuo account sviluppatore (dopo l'iscrizione al passo 5)
3. **Bundle Identifier**: qualcosa di univoco, es. `it.movr.driver` (deve essere diverso da quello di chiunque altro al mondo, di solito basta usare un dominio che controlli)
4. Xcode gestisce da solo certificati e provisioning se lasci "Automatically manage signing" attivo

## Passo 7 — App Store Connect

1. [appstoreconnect.apple.com](https://appstoreconnect.apple.com) → **My Apps** → **+** → **New App**
2. Platform iOS, nome (es. "Movr Driver"), lingua principale italiano, Bundle ID quello del passo 6, SKU un codice a piacere (es. `movr-driver-001`)

## Passo 8 — Carica la build su TestFlight

1. In Xcode, seleziona in alto **Any iOS Device** (non un simulatore) come destinazione
2. `Product → Archive` (richiede qualche minuto)
3. Si apre l'**Organizer**: seleziona l'archivio appena creato → **Distribute App** → **App Store Connect** → **Upload**
4. Segui i default finché non arriva "Upload Successful"
5. La build compare in App Store Connect dopo qualche minuto (a volte fino a mezz'ora), sotto TestFlight, con lo stato "Processing" poi "Ready to Test"

## Passo 9 — Invita i tester

1. In App Store Connect → la tua app → tab **TestFlight**
2. **Internal Testing** → crea un gruppo, aggiungi la tua email Apple ID (e quelle di chi vuoi che provi l'app, devono avere un Apple ID)
3. I tester interni possono provare la build appena è "Ready to Test", senza revisione Apple
4. Ricevono un invito via email → installano l'app **TestFlight** dall'App Store → aprono l'invito → installano Movr Driver

Per test interni (fino a 100 persone del tuo team Apple Developer) non
serve nessuna revisione Apple: è la strada più veloce per far provare
l'app a un autista vero. La revisione Apple serve solo per External
Testing con più di 100 tester o per la pubblicazione pubblica sull'App
Store, che non ti serve ora.

## Passo 10 — Xcode Cloud: build automatica ad ogni modifica

Con questo, modificare l'app non richiede più passare da Xcode a mano
(Archive → Distribute) ogni volta: basta pushare su un repo Git e una build
nuova arriva da sola su TestFlight, anche quando le modifiche le faccio io
da qui.

**Perché serve un repo dedicato solo per il progetto Xcode**: Xcode Cloud
collega un progetto Xcode a *un* repository Git — ma il progetto Xcode
vero e proprio (il `.xcodeproj`, la firma, i target) esiste solo sul tuo
Mac, creato al Passo 1. Questa repo (`logistic`) contiene solo i sorgenti
Swift da incollare, non un progetto Xcode completo. Il primo passo è quindi
mettere il progetto Xcode reale in un repo suo.

### Fase 1 — Crea il repo dedicato e caricaci il progetto (sul Mac)

1. Su GitHub crea un nuovo repo, es. `movr-driver-ios` (privato va bene)
2. Sul Mac, apri il Terminal e vai nella cartella del progetto Xcode (quella con dentro `MovrDriver.xcodeproj`)
3. ```
   git init
   git remote add origin https://github.com/<tuo-utente>/movr-driver-ios.git
   git add .
   git commit -m "Progetto iniziale MovrDriver"
   git push -u origin main
   ```
4. Se Xcode ti chiede le credenziali GitHub, usa un Personal Access Token invece della password (GitHub → Settings → Developer settings → Personal access tokens)

### Fase 2 — Attiva Xcode Cloud (in Xcode)

1. Apri il progetto in Xcode
2. Menu **Product → Xcode Cloud → Create Workflow** (o dal Report Navigator, icona a forma di nuvola sulla sinistra)
3. Accedi con lo stesso Apple ID sviluppatore: Xcode collega automaticamente l'app **Movr Driver** già esistente su App Store Connect
4. Xcode chiede accesso al repo: si apre il browser, autorizzi la GitHub App "Xcode Cloud" **solo** sul repo `movr-driver-ios` (non su tutto l'account)
5. Configura il Workflow:
   - **Start Condition**: "Branch Changes" su `main` — ogni push a `main` parte una build
   - **Actions**: Xcode aggiunge da solo "Archive" (build per App Store Connect)
   - **Post-Actions**: aggiungi **TestFlight (Internal Testing Only)** e seleziona il gruppo tester interno già creato al Passo 9
6. Salva. Parte subito una prima build di prova — gira su un Mac nel cloud di Apple, non sul tuo, richiede qualche minuto
7. Se la build va a buon fine, compare da sola in App Store Connect → TestFlight: i tester interni la vedono senza che tu tocchi più Archive/Distribute

Se la prima build si blocca per firma/provisioning: con "Automatically manage
signing" attivo (Passo 6) di solito Xcode Cloud gestisce tutto da sé
("Cloud managed"); a volte la primissima build chiede una conferma manuale
in Xcode per autorizzare un nuovo certificato — basta cliccare "Allow"
quando richiesto.

**Costi**: gratis fino a 25 ore di build al mese con un solo Apple Developer
Program attivo — abbondante per un progetto di queste dimensioni.

### Fase 3 — Come lavoriamo dopo, con me

Perché io possa modificare l'app "da qui" e farla arrivare su TestFlight da
sola, devo lavorare nello stesso repo che Xcode Cloud osserva — non in
questa repo (`logistic`), che resta solo per i sorgenti di riferimento.
Una volta che `movr-driver-ios` esiste: aggiungilo a una sessione Claude
Code (repository access), e da lì modifico i file Swift direttamente lì,
pusho su `main`, e Xcode Cloud fa il resto — build e upload TestFlight,
senza che tu debba aprire Xcode per ogni modifica.

## Cosa manca per un v2 (non necessario per il primo test)

- **Notifiche push vere** (oggi l'autista deve aprire l'app per vedere il nuovo appuntamento): serve un Apple Push Notification certificate/key + un servizio che invii la notifica quando lo spedizioniere conferma dal calendario. Fattibile, ma è un altro giro di lavoro a parte.
- **Login vero** invece della chiave API condivisa incollata a mano: oggi va bene per un test con pochi autisti fidati, non per un rollout più ampio.

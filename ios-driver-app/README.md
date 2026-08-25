# Clyo Driver — app iOS per l'autista

Non ho accesso a un Mac/Xcode in questo ambiente, quindi non posso creare il
progetto Xcode né compilarlo. Qui dentro trovi però il codice Swift vero e
funzionante (SwiftUI + networking) da incollare in un progetto nuovo, più la
guida per arrivare a TestFlight.

Il codice replica esattamente il flusso che già vedi nella demo web su
`/driver`: arrivo al gate → ritiro container → rientro container vuoto,
chiamando le stesse API della piattaforma (`app/api/driver/*`, già in
`main`).

## Cosa c'è già pronto

- `ClyoDriver/Models.swift` — i tipi che rispecchiano `Spedizione` in `lib/data.ts`
- `ClyoDriver/APIClient.swift` — client HTTP verso `app/api/driver/*`
- `ClyoDriver/AppConfig.swift` — salva ID vettore e chiave API sul device
- `ClyoDriver/SetupView.swift` — schermata di configurazione al primo avvio
- `ClyoDriver/DriverHomeView.swift` — schermata principale (stessa logica di `DriverPhonePreview.tsx`)
- `ClyoDriver/ClyoDriverApp.swift` — entry point dell'app

## Passo 1 — Crea il progetto Xcode

1. Apri Xcode (se non ce l'hai: App Store → cerca "Xcode", è gratis, ~15 GB)
2. `File → New → Project`
3. Scegli **iOS → App**
4. Product Name: `ClyoDriver`. Interface: **SwiftUI**. Language: **Swift**
5. Salvalo dove preferisci sul Mac (non deve stare per forza dentro questa repo)

## Passo 2 — Sostituisci i file generati con questi

1. Xcode crea da solo un `ClyoDriverApp.swift` e un `ContentView.swift`: cancella `ContentView.swift`
2. Trascina dentro il progetto (dal Finder al pannello di sinistra di Xcode, dentro la cartella `ClyoDriver`) tutti i file da `ios-driver-app/ClyoDriver/` di questa repo, incluso `ClyoDriverApp.swift` (sostituisce quello generato)
3. Quando Xcode chiede, spunta "Copy items if needed" e assicurati che il target `ClyoDriver` sia selezionato

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
avvio l'app chiede ID vettore (uno di quelli già nel seed, es. `V-01`) e la
chiave API. Da lì carica l'appuntamento e i bottoni chiamano davvero la
piattaforma: se confermi un ritiro qui, lo vedrai aggiornarsi anche nella
demo web.

## Passo 5 — Apple Developer Program

Serve per firmare l'app e distribuirla, anche solo su TestFlight a te
stesso:

1. [developer.apple.com](https://developer.apple.com) → **Enroll** → serve un Apple ID (anche personale) → **99 USD/anno**
2. L'iscrizione può richiedere da qualche minuto a 24-48h di verifica

## Passo 6 — Firma l'app

1. In Xcode, seleziona il progetto `ClyoDriver` nel pannello di sinistra → tab **Signing & Capabilities**
2. **Team**: seleziona il tuo account sviluppatore (dopo l'iscrizione al passo 5)
3. **Bundle Identifier**: qualcosa di univoco, es. `it.clyo.driver` (deve essere diverso da quello di chiunque altro al mondo, di solito basta usare un dominio che controlli)
4. Xcode gestisce da solo certificati e provisioning se lasci "Automatically manage signing" attivo

## Passo 7 — App Store Connect

1. [appstoreconnect.apple.com](https://appstoreconnect.apple.com) → **My Apps** → **+** → **New App**
2. Platform iOS, nome (es. "Clyo Driver"), lingua principale italiano, Bundle ID quello del passo 6, SKU un codice a piacere (es. `clyo-driver-001`)

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
4. Ricevono un invito via email → installano l'app **TestFlight** dall'App Store → aprono l'invito → installano Clyo Driver

Per test interni (fino a 100 persone del tuo team Apple Developer) non
serve nessuna revisione Apple: è la strada più veloce per far provare
l'app a un autista vero. La revisione Apple serve solo per External
Testing con più di 100 tester o per la pubblicazione pubblica sull'App
Store, che non ti serve ora.

## Cosa manca per un v2 (non necessario per il primo test)

- **Notifiche push vere** (oggi l'autista deve aprire l'app per vedere il nuovo appuntamento): serve un Apple Push Notification certificate/key + un servizio che invii la notifica quando lo spedizioniere conferma dal calendario. Fattibile, ma è un altro giro di lavoro a parte.
- **Login vero** invece della chiave API condivisa incollata a mano: oggi va bene per un test con pochi autisti fidati, non per un rollout più ampio.

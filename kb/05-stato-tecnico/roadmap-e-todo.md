# Roadmap e prossimi passi

## Fatto

- Piattaforma Movr (modulo Porti): dashboard, calendario multi-terminal, tracking spedizione, vista driver, tutto su Supabase con persistenza reale
- Annullamento/modifica appuntamenti, alert scadenza demurrage nel calendario
- API `/api/driver/*` per l'app iOS (non ancora usate da un'app reale)
- Sito marketing Movr, deploy separato, con scroll-snap tra sezioni
- Scaffold completo app driver iOS in Swift (non compilato: serve Xcode/Mac)
- Modulo demo AI Transport Manager (secondo mercato), self-contained, non collegato a Supabase
- Knowledge base (questa cartella + mirror su Google Drive)

## In corso / da decidere

- **Ricerca competitor** (vedi `03-competitor/da-mappare.md`): non ancora iniziata, prossimo passo consigliato prima di investire di più su AI Transport Manager
- **AI Transport Manager**: capire se è un secondo prodotto, un pivot, o resta un esperimento — dipende in parte dalla ricerca competitor
- **App driver iOS**: scaffold pronto, serve qualcuno con Mac/Xcode per compilarla e caricarla su TestFlight (guida in `ios-driver-app/README.md`)

## Idee non ancora scoping-ate

- **Gestione appuntamenti via audio WhatsApp**: idea "wow" proposta dall'utente. Tecnicamente fattibile (WhatsApp Business API/Twilio → trascrizione Whisper → estrazione intento → stessa Server Action già usata dai bottoni dell'app). Il pezzo difficile è il matching (capire quale spedizione intende un vocale ambiguo tipo "ho ritirato"). Prima di costruirla va deciso il caso d'uso preciso: la userebbe il dispacciatore per aggiornare stati, o l'autista al posto dell'app? Sono due prodotti diversi.
- **Feature aggiuntive calendario appuntamenti** (proposte non ancora scelte): creazione spedizione al volo dallo slot, riprogrammazione appuntamenti, vista filtrata per vettore/autista, prenotazione ricorrente per vettore abituale.

## Limiti dell'ambiente di sviluppo (per chi riprende il progetto)

- Le sessioni Claude in questo ambiente non hanno accesso diretto al database Supabase live: build e lint si possono verificare, il comportamento runtime va confermato dall'utente dopo il deploy
- Nessun accesso a Xcode/macOS: il lavoro sull'app iOS può essere solo scritto qui, mai compilato/testato da questa sessione
- L'account Vercel raggiungibile dagli strumenti MCP di Claude in questa sessione può differire da quello che deploya davvero (`lormilano99@gmail.com`): verificare sempre quale account è collegato prima di agire

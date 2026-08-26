# To-do Movr

Fonte unica per la lista di cose da fare. La tengo aggiornata io direttamente (Edit tool, non serve chiedermelo ogni volta) man mano che completiamo cose o ne emergono di nuove, e la uso per proporre proattivamente i prossimi passi quando ha senso nel contesto.

## Clienti / outreach

- [ ] Contattare le 4 aziende a priorità alta: Lena Spedizioni, Ambra Mar, GDT Logistic, Spedimar
- [ ] Primo contatto Spediservices (apre la rete verso Spediporto)
- [ ] Verificare su LinkedIn le aziende "da confermare" del secondo giro (dimensione, attività recente)

## Tecnico / deploy

- [ ] Verificare che il deploy `logistic-site` su Vercel mostri il rebrand Movr (in corso, controllare tab Deployments)
- [ ] Sostituire l'email placeholder `ciao@movr.app` con una vera
- [ ] Verificare disponibilità del dominio `movr.app` (o altro TLD)
- [ ] Aggiungere `DRIVER_API_KEY` su Vercel (progetto piattaforma) per abilitare le route `/api/driver/*`
- [ ] Compilare e pubblicare l'app driver iOS su TestFlight (guida completa in `ios-driver-app/README.md`)

## Prodotto / decisioni

- [ ] Ricerca competitor (vedi `03-competitor/da-mappare.md`): prossimo passo prima di investire di più sul modulo Flotte
- [ ] Decidere il destino del modulo Flotte (AI Transport Manager): secondo prodotto, pivot, o esperimento da chiudere

## Idee da scoping-are (non ancora iniziate)

- [ ] Gestione appuntamenti via audio WhatsApp: definire il caso d'uso preciso (dispacciatore o autista?) prima di costruirla
- [ ] Feature aggiuntive calendario: creazione spedizione al volo dallo slot, riprogrammazione appuntamenti, vista filtrata per vettore, prenotazione ricorrente

## Fatto di recente

- [x] Rebrand da Clyo a Movr, ovunque (piattaforma, sito, KB, app iOS)
- [x] Modulo Flotte (AI Transport Manager): vertical slice funzionante con motore deterministico
- [x] Knowledge base creata (repo + mirror Drive ristretto a mercato/competitor/clienti)
- [x] Annullamento appuntamenti + alert demurrage nel calendario piattaforma
- [x] To-do spostata dal mirror Drive (link che si rompeva ad ogni modifica) a qui nel repo

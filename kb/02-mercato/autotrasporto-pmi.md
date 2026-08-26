# Mercato: autotrasporto PMI conto terzi (Italia/Europa)

## Segmento

B2B SaaS / TMS AI-native per PMI di autotrasporto stradale, mercato italiano ed europeo. A differenza degli spedizionieri (che coordinano vettori terzi senza possedere mezzi), qui il cliente **possiede la flotta**.

## ICP

- 5-100 camion, 5-150 dipendenti
- Operazioni: trasporto multi-carico / multi-tappa quotidiano
- Stack attuale tipico: Excel, email, WhatsApp, TMS legacy, software GPS/gestione flotta, software contabile
- Pain principale: alta complessità operativa gestita manualmente da dispacciatori/titolari

## Flusso operativo attuale (dove nasce il problema)

1. Ordini arrivano via email/PDF/Excel/telefono
2. Il dispacciatore interpreta manualmente gli ordini
3. Assegna camion e autisti
4. Pianifica i percorsi
5. Comunica con gli autisti
6. Reagisce ai ritardi
7. Cerca carichi aggiuntivi (specialmente per i rientri)
8. Controlla i documenti di consegna
9. L'amministrazione riconcilia viaggi e fatture

Insight centrale: il prodotto di valore non è un'altra dashboard, è un layer AI che decide continuamente cosa deve succedere dopo, lasciando al dispacciatore il ruolo di "gestore di eccezioni" invece che coordinatore manuale di ogni viaggio.

## Segmenti software adiacenti da mappare (vedi `03-competitor/`)

TMS (Transportation Management System), fleet management, last mile, WMS, shipping SaaS, freight marketplace, supply chain SaaS, logistica AI-native.

## Geografie di interesse per la ricerca competitor

Italia, Germania, Francia, Spagna, Polonia, Paesi Bassi, Belgio, UK.

## Metriche di successo tipiche del settore

Km a vuoto, utilizzo flotta, ricavo per camion, margine per viaggio, ore dispacciatore risparmiate, tasso di consegne puntuali, interventi manuali, ordini processati automaticamente.

## Nota metodologica importante

Il piano di pianificazione per questo verticale usa un motore **deterministico** per capacità/routing/vincoli, non un LLM, coerente con come si dovrebbe costruire un vero prodotto in questo spazio (vedi `01-prodotto/ai-transport-manager-autotrasportatori.md` per il principio completo). Un LLM qui serve solo per capire ordini non strutturati, spiegare decisioni, orchestrare, mai per calcolare il routing stesso.

# Discovery playbook — container trucking

Adattamento di `kb/04-clienti-e-outreach/guida-interview-design-partner.md` (metodologia già validata per un altro segmento — spedizionieri) al nuovo target: **dispatcher/responsabile traffico o titolare di un'azienda di autotrasporto container**. Stesso principio di fondo — passato reale, non opinioni sul futuro — applicato al workflow di `research/container-trucking-workflow.md` invece che a quello degli spedizionieri.

## Principio guida (invariato)

Non chiedere "usereste un software che...". Far raccontare l'ultimo ordine reale, passo passo. Il miglior segnale è quando mostrano spontaneamente il loro workaround vero (Excel, WhatsApp, lavagna, Post-it) invece di dire "sarebbe utile".

## La domanda che apre l'interview

> "Non spiegarmi come lavorate in generale. Apri l'ultimo ordine ricevuto e fammi vedere cosa è successo da lì, passo passo, fino alla consegna e alla fattura."

Se possibile, farla schermo condiviso o de visu guardando il loro sistema/Excel/email reali — è molto più forte di una descrizione a parole.

## Aree da osservare (basate sul workflow reale, non su ipotesi di prodotto)

| Area | Cosa capire |
|---|---|
| Order intake | Email / PDF / Excel / EDI / WhatsApp? Chi lo riceve, chi lo trascrive |
| Data entry | Quanti dati vengono ricopiati a mano, dove |
| Readiness | Come controllano carrier release / customs release / terminal availability — quanti portali aprono, quante telefonate fanno |
| Terminal | Quali portali usano, per quali terminal, con quali credenziali |
| Slot | Come viene prenotato, chi lo fa, cosa succede se salta |
| Dispatch | Come scelgono mezzo/autista — a mente, su Excel, su un gestionale? |
| Driver comms | Telefono / WhatsApp / app dedicata? |
| Tracking | Automatico o manuale (l'autista chiama per aggiornare)? |
| Empty return | Come sanno qual è il last free day, come si accorgono se lo sforano |
| Triangulation / street turn | Lo fanno mai? Con che frequenza? Con quali blocchi? (risposta diretta all'OPEN QUESTION in `container-trucking-workflow.md`) |
| POD/EIR | Come arrivano (foto? carta?), chi li archivia, si perdono mai |
| Waiting time | Viene registrato? Viene fatturato? |
| Accessorials | Cosa viene fatturato, cosa probabilmente si perde |
| Billing | Come nasce la fattura, quanto tempo passa dal job completato |
| Exceptions | Come scoprono un problema — prima o dopo che sia già un problema? |
| Software | Quanti sistemi usano oggi, si parlano tra loro? |

## Metriche da raccogliere (quantitative, per KPI in `product/container-trucking-v1.md`)

- Numero di trattori/mezzi
- Numero di autisti
- Numero di dispatcher
- Container moves/giorno
- Moves/dispatcher/giorno
- Minuti di lavoro amministrativo stimati per ordine
- Numero di chiamate/messaggi per ordine
- Ore di attesa (waiting time) stimate a settimana/mese
- Empty moves / km a vuoto stimati
- € di accessorial non fatturati stimati (spesso la domanda più difficile da far rispondere con un numero — va bene anche una stima grezza, o "non lo sappiamo" come risposta, che è di per sé un segnale)
- Tempo da job completato a fattura emessa

## Scala delle evidenze (l'obiettivo non è un complimento sulla demo)

1. "Bello" — segnale debole, non significa nulla da solo
2. Feedback approfondito e specifico
3. Introduce il dispatcher o un collega
4. Fa osservare le operations dal vivo (anche solo per un paio d'ore)
5. Condivide un dataset reale di ordini (anche 100-500 righe storiche)
6. Accetta un pilot
7. Accetta di pagare, o una LOI condizionata a KPI misurabili

Obiettivo dello sprint discovery: 10 aziende intervistate, almeno 2 mezze giornate osservate dal vivo accanto a un dispatcher, 3-4 potenziali design partner, almeno 1 dataset reale di ordini, almeno 1 test di willingness-to-pay.

## Script di apertura — LinkedIn

> Ciao [Nome], lavoro su Movr — stiamo studiando da vicino come funziona oggi il trasporto container per un'azienda come [Azienda]: dall'ordine alla fattura, non un pitch di prodotto. Avresti 30 minuti per farmi vedere come gestite un ordine reale? Mi interessa il vostro punto di vista, non vendervi niente in questa fase.

## Script di apertura — email

Oggetto: 30 minuti su come gestite un ordine container, non una demo

> Ciao [Nome],
> mi chiamo Lorenzo, lavoro su Movr — un progetto per capire davvero come funziona oggi la gestione di un trasporto container per un'azienda di autotrasporto come [Azienda]. Non è una demo di prodotto: vorrei solo farmi raccontare, con l'ultimo ordine che avete gestito, cosa succede dal momento in cui arriva a quando emettete la fattura.
> Avreste 30 minuti in settimana? Vengo con le domande, portate voi l'esempio reale.
> Grazie,
> Lorenzo

## Script di apertura — WhatsApp / warm intro

> Ciao [Nome], sono Lorenzo — [chi ci presenta] mi ha detto che siete tra le aziende più organizzate per il trasporto container su [Genova/Savona/La Spezia]. Sto studiando da vicino questo mercato (non vendo niente in questa fase) e mi piacerebbe farmi raccontare 30 minuti su come gestite un ordine reale. Quando vi va bene?

## Script call di 30 minuti

1. **Warm-up (3-5 min)** — ruolo, giornata tipo, nessuna domanda su software
2. **"Apri l'ultimo ordine" (15-20 min)** — la domanda centrale sopra, seguendo il workflow passo passo, con le aree da osservare come traccia mentale, non come questionario rigido
3. **3 domande must-ask**:
   - "Qual è la cosa che vi fa perdere più tempo ogni settimana, di cui nessuno vi chiede mai?"
   - "Se domani sparisse la persona che tiene tutto in testa per [il processo appena descritto], cosa succederebbe?"
   - "L'ultima volta che qualcosa è andato storto — un container bloccato, una scadenza sforata — come ve ne siete accorti e chi l'ha risolto?"
4. **Chiusura (5 min)** — riflessione a voce ("mi sembra che il punto più doloroso sia X, corretto?"), poi *se* il pain è emerso chiaro, propone il passo successivo (osservare le operations dal vivo, o direttamente il design partner ask) — mai come apertura, mai come pitch.

Tono: diretto, da founder a founder, zero linguaggio corporate. Meglio una domanda scomoda in più che una demo patinata.

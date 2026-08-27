# Guida alle interview con spedizionieri — Customer Discovery → Pain Discovery → Design Partner

Condensato da `movrinterviewspedizionieridesignpartner.pdf` (caricato 27/08/2026), per non perderlo come già successo con altri materiali (vedi nota in `playbook-outreach.md`). Questa è la metodologia da seguire per le interview di discovery, distinta dal playbook di vendita/onboarding design partner.

## Principio guida

Non chiedere del futuro ("useresti un software che..."), fai raccontare il passato recente e reale ("l'ultima volta che è successo X, cosa hai fatto esattamente"). Le opinioni sul futuro sono quasi sempre ottimistiche e inaffidabili; il racconto di un episodio concreto rivela il vero workaround, il vero costo, il vero owner del problema.

Il miglior segnale possibile: l'intervistato mostra spontaneamente il proprio workaround reale (un Excel, una chat WhatsApp, una cartella di email) invece di dire "sì, sarebbe utile". Se questo succede, è oro — annotalo per intero.

## Struttura dell'interview

1. **Warm-up** — rompighiaccio, farli parlare del loro ruolo e della giornata tipo, nessuna domanda su Movr o software.
2. **Ricostruzione di una pratica reale** — far raccontare passo-passo l'ultima spedizione/pratica gestita (o una recente particolarmente rappresentativa): chi fa cosa, con quali strumenti, dove si perde tempo, dove nascono gli errori.
3. **Pain discovery** — approfondire sui 5 filoni specifici (vedi sotto), con le "domande killer" per ciascuno.
4. **Dependency test** — capire se esiste già un "software umano": una persona che tiene tutto insieme a memoria/manualmente, senza cui il processo si romperebbe. Segnale forte di un processo fragile e di valore da automatizzare.
5. **3 domande must-ask** (da porre sempre, in qualunque punto naturale dell'interview):
   - Qual è la cosa che ti fa perdere più tempo ogni settimana, di cui nessuno ti chiede mai?
   - Se domani sparisse la persona che tiene in testa [il processo appena descritto], cosa succederebbe?
   - L'ultima volta che qualcosa è andato storto (demurrage, container bloccato, documento mancante...), come te ne sei accorto e chi ha risolto?
6. **Reflection close + Design Partner ask** — mai aprire chiedendo "vuoi essere design partner?". Prima rifletti insieme a loro su quanto emerso ("mi sembra che il punto più doloroso sia X, è corretto?"), poi *se* il pain è emerso chiaro, proponi il design partner come naturale prossimo passo (non come pitch di vendita).

## I 5 filoni di pain da esplorare

Per ciascuno, cerca frequenza, tempo perso, costo, criticità, workaround attuale, owner del problema, budget implicito (vedi tabella Pain Score sotto).

1. **Documenti e dogana** — quanti documenti, quante volte si rifanno per errori, chi li controlla, cosa succede se manca un documento all'arrivo.
2. **Exception management** — cosa succede quando qualcosa non va secondo piano (ritardi, blocchi, cambi last-minute), chi se ne accorge e come, quanto è manuale la gestione.
3. **Email e comunicazione** — quante email/telefonate per singola pratica, con chi (cliente, vettore, terminal, dogana), quanto è disperso il tracciamento delle comunicazioni.
4. **Demurrage, detention e scadenze** — come vengono monitorate le scadenze, chi se ne accorge in anticipo vs a posteriori, quanto costano gli sforamenti in un anno/mese tipico.
5. **Carrier e trasportatori** — come si coordinano gli appuntamenti/slot con i vettori terzi, quanto è manuale, quante volte saltano/cambiano.

### Domande killer per filone (esempi da adattare)

- Documenti/dogana: "Raccontami l'ultima volta che è mancato un documento al momento del ritiro: cosa è successo, quanto è costato in tempo?"
- Exception: "L'ultima volta che un container è rimasto bloccato o è saltato un appuntamento, come ve ne siete accorti e chi ha gestito il seguito?"
- Email: "Per la pratica di cui mi hai parlato, quante email/telefonate stimi siano servite in totale, e con chi?"
- Demurrage: "Negli ultimi 3 mesi vi è mai capitato di sforare una scadenza di demurrage/detention? Come ve ne siete accorti?"
- Carrier: "Come confermate oggi un appuntamento con un vettore terzo? Cosa succede se il vettore non si presenta o cambia orario?"

## Pain Score (da compilare durante o subito dopo l'interview)

| Filone | Frequenza | Tempo perso | Costo | Criticità | Workaround attuale | Owner | Budget implicito |
|---|---|---|---|---|---|---|---|
| Documenti e dogana | | | | | | | |
| Exception management | | | | | | | |
| Email e comunicazione | | | | | | | |
| Demurrage/detention/scadenze | | | | | | | |
| Carrier e trasportatori | | | | | | | |

Compilare una riga per filone subito dopo ogni interview, finché il ricordo è fresco. Il pain score guida quale filone attaccare per primo con il wedge di prodotto.

## Design Partner ask — script di chiusura

Non chiedere mai come apertura. Sequenza:
1. Rifletti a voce quanto emerso: "da quello che mi hai raccontato, il punto che ti costa di più sembra essere [filone con pain score più alto], corretto?"
2. Lascia che confermino o correggano.
3. Solo dopo la conferma, proponi: uso gratuito della piattaforma su quel punto specifico, in cambio di un canale diretto di feedback (vedi `playbook-outreach.md` per i dettagli di cosa offrire/chiedere).
4. Se il pain non è emerso chiaro durante l'interview, non forzare l'ask: ringrazia e richiudi il cerchio più avanti, dopo aver eventualmente approfondito con una seconda conversazione.

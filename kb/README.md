# Knowledge base — Logistic / Movr

Tutto quello che sappiamo sul progetto: prodotto, mercato, competitor, clienti, stato tecnico. Fonte di verità, letta e aggiornata di default ad ogni sessione rilevante.

Un sottoinsieme è mantenuto anche su Google Drive (cartella "logistic" nell'account `lormilano99@gmail.com`) come mirror per consultazione veloce da telefono/browser senza passare da git: solo **02-mercato/**, **03-competitor/** e **04-clienti-e-outreach/**, quello che serve leggere al volo (analisi di mercato, stato dei contatti clienti). **01-prodotto/** e **05-stato-tecnico/** restano solo qui nel repo: sono più per continuità tecnica tra sessioni che per lettura veloce.

I miei strumenti su Drive possono aggiornare solo titolo/cartella di un file, non il contenuto: ogni refresh del mirror è un cancella-e-ricrea, quindi il link del documento cambia. Per questo lo aggiorno solo quando cambia qualcosa di sostanziale nelle 3 cartelle mirrorate, non ad ogni commit. Il mirror non va modificato direttamente su Drive: se lo fai, dillo esplicitamente o rischia di andare perso al prossimo refresh.

## Struttura

- **01-prodotto/**: cosa sono i moduli Porti e Flotte di Movr, a chi si rivolgono, cosa fanno oggi (solo repo)
- **02-mercato/**: dimensioni, ICP, pain, jargon dei due mercati (anche su Drive)
- **03-competitor/**: mappa concorrenti (vuoto, da costruire — vedi il template dentro) (anche su Drive)
- **04-clienti-e-outreach/**: liste aziende da contattare, playbook, stato dei contatti (anche su Drive)
- **05-stato-tecnico/**: architettura, stack, repo, cosa è live e cosa no, limiti dell'ambiente (solo repo)

## Bundle per altri LLM

`context-bundle.md` in questa cartella è la concatenazione di tutta la KB in un solo file, pensato per essere copiato/allegato comodamente in una conversazione con un altro LLM (ChatGPT, Gemini, ecc.) quando serve dargli in un colpo solo tutto il contesto del progetto. Lo rigenero ogni volta che cambia qualcosa di sostanziale nei documenti sorgente — non modificarlo a mano, si perderebbe al prossimo refresh.

## To-do

Vive in `todo.md` in questa cartella, non su Drive: qui posso modificarla direttamente riga per riga (Edit tool), senza il problema del link che cambia ad ogni refresh. La tengo aggiornata di mia iniziativa mentre lavoriamo, non solo su richiesta, e la uso per proporre proattivamente i prossimi passi quando è rilevante nel contesto.

## Come tenerla aggiornata

Aggiorna il file pertinente ogni volta che scopriamo qualcosa di rilevante su un competitor, un cliente, o cambiamo direzione di prodotto — invece di lasciarlo solo in una conversazione chat. Se un file diventa troppo lungo, dividilo per argomento.

Ultimo aggiornamento: 27 agosto 2026.

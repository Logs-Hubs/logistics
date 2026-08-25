# Clyo — sito

Landing page marketing per Clyo, separata dal prodotto (cartella `app/` alla radice del repo).
Deploy indipendente su Vercel (progetto separato, root directory `clyo-site`), niente Supabase:
è una singola pagina statica.

## Sviluppo locale

```bash
cd clyo-site
npm install
npm run dev
```

Apri http://localhost:3000 (o la porta indicata).

## Struttura

- `app/page.tsx` — l'intera landing page (hero, problema, prodotto, come funziona, numeri, CTA)
- `components/mockups.tsx` — mockup illustrativi della UI del prodotto (non screenshot: stessa
  palette e struttura del vero prodotto in `../app`, ricostruita per non dipendere da Supabase)

## Prima di andare online

- Il CTA punta a `ciao@clyo.app`, una casella non ancora esistente — sostituire con un'email vera.
- Nessun favicon in `public/` — aggiungerne uno prima del lancio pubblico.
- Verificare la disponibilità del dominio `clyo.app` (o altro TLD) prima di comunicarlo.

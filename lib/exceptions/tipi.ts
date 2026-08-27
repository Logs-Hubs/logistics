// Domain model dell'Exception Center: nessuna entità propria, solo una lettura correlata di
// Spedizione (Porti) e CasoDoganale (Dogana) — vedi motore.ts. Deliberatamente qui e non dentro
// lib/data.ts o lib/customs/tipi.ts: incrocia i due mondi, non appartiene a nessuno dei due.
export type SeveritaEccezione = "critica" | "alta" | "media";

export type CategoriaEccezione = "dogana" | "demurrage" | "appuntamento";

export type Eccezione = {
  id: string;
  severita: SeveritaEccezione;
  spedizioneId: string | null;
  casoDoganaleId: string | null;
  titolo: string;
  ragioni: string[];
  categorie: CategoriaEccezione[];
  azioneConsigliata: string;
  href: string;
  /** Stima economica solo quando il demurrage è già scaduto — non inventiamo un numero se non sta ancora maturando. */
  esposizioneEuro: number | null;
};

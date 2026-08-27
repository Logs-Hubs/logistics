// Domain model dell'Exception Center di Flotte: come lib/exceptions/ per Porti, nessuna entità
// propria — solo una lettura correlata di Problema (planner) e LavoroTrasporto (documenti), vedi
// motore.ts. Vive dentro lib/flotta/ perché, a differenza di quello di Porti, non incrocia moduli
// diversi: resta tutto dentro il mercato autotrasportatori.
export type SeveritaEccezioneFlotta = "critica" | "alta" | "media";

export type CategoriaEccezioneFlotta = "pianificazione" | "fatturazione";

export type EccezioneFlotta = {
  id: string;
  severita: SeveritaEccezioneFlotta;
  titolo: string;
  ragioni: string[];
  categorie: CategoriaEccezioneFlotta[];
  azioneConsigliata: string;
  href: string;
  /** Solo per il fatturato già maturato e bloccato — mai una proiezione di rischio futuro. */
  esposizioneEuro: number | null;
};

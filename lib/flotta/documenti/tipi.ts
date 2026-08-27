// Domain model "Documenti trasporto": la stessa idea di lib/customs (documenti disordinati -> caso
// strutturato) applicata al lato autotrasportatore invece che spedizioniere doganale. Un
// LavoroTrasporto può nascere da un ordine già pianificato in lib/flotta/tipi.ts (Ordine) o da un
// documento arrivato prima ancora che il lavoro sia stato assegnato — vedi motore.ts.
export type TipoDocumentoTrasporto = "ordine_cliente" | "ddt" | "cmr" | "pod" | "fattura" | "altro";

export type StatoDocumentoTrasporto =
  | "atteso"
  | "mancante"
  | "ricevuto"
  | "in_elaborazione"
  | "abbinato"
  | "validato"
  | "rifiutato";

export type DocumentoTrasporto = {
  id: string;
  nome: string;
  tipo: TipoDocumentoTrasporto;
  stato: StatoDocumentoTrasporto;
  confidenza: number | null; // 0-100, null se non ancora ricevuto
  campiEstratti: Record<string, string>;
  caricatoIl: string | null;
};

export type StatoFatturazione =
  | "non_completo" // consegna non ancora avvenuta
  | "documenti_mancanti"
  | "tariffa_da_verificare"
  | "pronto_fatturazione"
  | "fatturato";

export type EventoAttivitaLavoro = {
  id: string;
  quando: string; // ISO datetime
  testo: string;
  fonte: "ai" | "operatore" | "sistema";
};

export type LavoroTrasporto = {
  id: string;
  riferimento: string;
  clienteNome: string;
  /** Id dell'Ordine pianificato in lib/flotta/tipi.ts, se esiste già — un lavoro può nascere prima. */
  ordineId: string | null;
  mezzoId: string | null;
  autistaId: string | null;
  ritiroCitta: string;
  consegnaCitta: string;
  /** ISO date della consegna effettiva, null se il viaggio non è ancora concluso. */
  dataConsegna: string | null;
  tariffaConcordata: number | null; // EUR
  documenti: DocumentoTrasporto[];
  /** Impostato manualmente solo quando l'operatore emette davvero la fattura — il resto della catena
   * di stati (non_completo/documenti_mancanti/tariffa_da_verificare/pronto_fatturazione) è derivato,
   * vedi calcolaStatoFatturazione in motore.ts. */
  fatturato: boolean;
  attivita: EventoAttivitaLavoro[];
  creatoIl: string;
  aggiornatoIl: string;
};

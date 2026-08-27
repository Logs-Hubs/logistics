// Domain model del modulo Dogana (Customs Brain). Deliberatamente separato da lib/data.ts:
// un CasoDoganale può esistere prima che la Spedizione corrispondente sia nemmeno stata creata
// (arriva a monte, dai documenti del cliente), quindi il collegamento è un id opzionale, non una
// relazione stretta. Vedi motore.ts per la logica derivata (readiness, stato, risposte AI).

export type Parte = {
  nome: string;
  paese: string | null;
  partitaIva: string | null;
  eori: string | null;
};

export type ModalitaTrasporto = "mare" | "strada" | "aereo" | "ferrovia" | "altro";

export type DatiTrasporto = {
  modalita: ModalitaTrasporto;
  billOfLading: string | null;
  nave: string | null;
  viaggio: string | null;
  portoImbarco: string | null;
  portoSbarco: string | null;
  container: string[];
};

export type StatoClassificazione = "non_avviata" | "suggerita" | "da_rivedere" | "approvata";

export type VoceMerce = {
  id: string;
  descrizione: string;
  quantita: number | null;
  unita: string | null;
  pesoLordoKg: number | null;
  pesoNettoKg: number | null;
  paeseOrigine: string | null;
  valoreDichiarato: number | null;
  valuta: string | null;
  hsCodeSuggerito: string | null;
  hsConfidenza: number | null; // 0-100
  hsMotivazione: string | null;
  statoClassificazione: StatoClassificazione;
  hsCodeApprovato: string | null;
};

export type TipoDocumento =
  | "fattura_commerciale"
  | "packing_list"
  | "bill_of_lading"
  | "certificato_origine"
  | "eur1"
  | "documento_trasporto"
  | "autorizzazione_doganale"
  | "certificato"
  | "altro";

export type StatoDocumento = "in_elaborazione" | "estratto" | "da_rivedere" | "approvato" | "mancante";

export type DocumentoDoganale = {
  id: string;
  nome: string;
  tipo: TipoDocumento;
  fonte: "upload" | "email" | "api" | "generato";
  stato: StatoDocumento;
  versione: number;
  confidenza: number | null; // 0-100, null se il documento non è ancora arrivato
  campiEstratti: Record<string, string>;
  caricatoIl: string | null; // ISO datetime, null se manca ancora
};

export type SeveritaProblema = "info" | "attenzione" | "errore" | "bloccante";

export type CategoriaProblema =
  | "documento_mancante"
  | "dato_mancante"
  | "incongruenza"
  | "classificazione"
  | "requisito_doganale"
  | "trasporto"
  | "origine"
  | "valore";

export type ProblemaValidazione = {
  id: string;
  severita: SeveritaProblema;
  categoria: CategoriaProblema;
  titolo: string;
  descrizione: string;
  entitaCoinvolte: string[];
  azioneSuggerita: string | null;
  stato: "aperto" | "risolto" | "ignorato";
};

export type DatiDoganali = {
  incoterm: string | null;
  regimeDoganale: string | null;
  paeseOrigine: string | null;
  originePreferenziale: boolean | null;
  valoreDoganale: number | null;
  valuta: string | null;
  dazioStimato: number | null;
  ivaStimata: number | null;
};

export type EventoAttivita = {
  id: string;
  quando: string; // ISO datetime
  testo: string;
  fonte: "ai" | "operatore" | "sistema";
};

export type StatoCasoDoganale =
  | "raccolta_documenti"
  | "elaborazione"
  | "revisione_necessaria"
  | "bloccato"
  | "pronto_per_dogana"
  | "inviato"
  | "sdoganato";

export type CasoDoganale = {
  id: string;
  riferimento: string;
  /** Id della Spedizione Porti collegata, se esiste già — vedi lib/data.ts. Un caso può nascere prima. */
  spedizioneId: string | null;
  importatore: Parte;
  esportatore: Parte;
  trasporto: DatiTrasporto;
  merci: VoceMerce[];
  documenti: DocumentoDoganale[];
  problemi: ProblemaValidazione[];
  datiDoganali: DatiDoganali;
  attivita: EventoAttivita[];
  stato: StatoCasoDoganale;
  creatoIl: string;
  aggiornatoIl: string;
};

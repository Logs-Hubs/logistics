export type Citta =
  | "Milano"
  | "Torino"
  | "Genova"
  | "Bologna"
  | "Firenze"
  | "Roma"
  | "Napoli"
  | "Bari"
  | "Padova"
  | "Verona"
  | "Brescia"
  | "Parma"
  | "Piacenza"
  | "Bergamo";

export type Mezzo = {
  id: string;
  targa: string;
  tipo: "furgone" | "motrice" | "bilico";
  capacitaKg: number;
  capacitaPallet: number;
  adr: boolean;
  frigo: boolean;
  baseCitta: Citta;
};

export type Autista = {
  id: string;
  nome: string;
  baseCitta: Citta;
  patenteAdr: boolean;
  oreMaxGiorno: number;
};

export type Ordine = {
  id: string;
  cliente: string;
  ritiroCitta: Citta;
  consegnaCitta: Citta;
  finestraConsegna: string; // es. "09:00-13:00"
  pesoKg: number;
  pallet: number;
  adrRichiesto: boolean;
  frigoRichiesto: boolean;
  ricavo: number; // EUR
  priorita: "standard" | "urgente";
};

// Carico "di mercato" non tra gli ordini clienti dell'azienda: usato dal backhaul finder
// per riempire i rientri vuoti.
export type CaricoSpot = {
  id: string;
  broker: string;
  ritiroCitta: Citta;
  consegnaCitta: Citta;
  pesoKg: number;
  pallet: number;
  ricavo: number;
};

export type TappaPiano = {
  ordineId: string;
  ritiroCitta: Citta;
  consegnaCitta: Citta;
  origine: "ordine" | "spot";
};

export type PianoMezzo = {
  mezzoId: string;
  autistaId: string;
  tappe: TappaPiano[];
  posizioneFinale: Citta;
  kmTotali: number;
  kmVuoti: number;
  oreImpegnate: number;
  ricavo: number;
  costo: number;
  margine: number;
};

export type TipoProblema = "non_assegnato" | "rischio_ritardo" | "reso_vuoto" | "ore_autista";

export type Problema = {
  id: string;
  tipo: TipoProblema;
  titolo: string;
  descrizione: string;
  impattoEuro: number;
  azione: AzionePiano | null;
  risolto: boolean;
};

export type AzionePiano =
  | { kind: "sposta_ordine"; ordineId: string; daMezzoId: string | null; aMezzoId: string }
  | { kind: "aggiungi_spot"; caricoSpotId: string; mezzoId: string };

export type Piano = {
  mezzi: PianoMezzo[];
  ordiniNonAssegnati: string[];
};

export type KpiPiano = {
  kmTotali: number;
  kmVuoti: number;
  percentualeVuoto: number;
  utilizzoMezzi: number; // 0-1, quota mezzi con almeno una tappa
  ricavo: number;
  costo: number;
  margine: number;
};

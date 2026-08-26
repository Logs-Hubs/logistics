import type { Autista, CaricoSpot, Citta, Mezzo, Ordine } from "./tipi";
import { kmTra } from "./distanze";

function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const MEZZI: Mezzo[] = [
  { id: "MZ-01", targa: "GE 001 AB", tipo: "bilico", capacitaKg: 24000, capacitaPallet: 33, adr: false, frigo: false, baseCitta: "Milano" },
  { id: "MZ-02", targa: "GE 002 AB", tipo: "bilico", capacitaKg: 24000, capacitaPallet: 33, adr: true, frigo: false, baseCitta: "Milano" },
  { id: "MZ-03", targa: "GE 003 AB", tipo: "motrice", capacitaKg: 12000, capacitaPallet: 18, adr: false, frigo: false, baseCitta: "Milano" },
  { id: "MZ-04", targa: "GE 004 AB", tipo: "motrice", capacitaKg: 12000, capacitaPallet: 18, adr: false, frigo: true, baseCitta: "Bologna" },
  { id: "MZ-05", targa: "GE 005 AB", tipo: "bilico", capacitaKg: 24000, capacitaPallet: 33, adr: false, frigo: false, baseCitta: "Bologna" },
  { id: "MZ-06", targa: "GE 006 AB", tipo: "motrice", capacitaKg: 12000, capacitaPallet: 18, adr: true, frigo: false, baseCitta: "Bologna" },
  { id: "MZ-07", targa: "GE 007 AB", tipo: "furgone", capacitaKg: 3500, capacitaPallet: 6, adr: false, frigo: false, baseCitta: "Bologna" },
  { id: "MZ-08", targa: "GE 008 AB", tipo: "bilico", capacitaKg: 24000, capacitaPallet: 33, adr: false, frigo: false, baseCitta: "Verona" },
  { id: "MZ-09", targa: "GE 009 AB", tipo: "motrice", capacitaKg: 12000, capacitaPallet: 18, adr: false, frigo: true, baseCitta: "Verona" },
  { id: "MZ-10", targa: "GE 010 AB", tipo: "furgone", capacitaKg: 3500, capacitaPallet: 6, adr: false, frigo: false, baseCitta: "Verona" },
  { id: "MZ-11", targa: "GE 011 AB", tipo: "bilico", capacitaKg: 24000, capacitaPallet: 33, adr: true, frigo: false, baseCitta: "Piacenza" },
  { id: "MZ-12", targa: "GE 012 AB", tipo: "motrice", capacitaKg: 12000, capacitaPallet: 18, adr: false, frigo: false, baseCitta: "Piacenza" },
  { id: "MZ-13", targa: "GE 013 AB", tipo: "motrice", capacitaKg: 12000, capacitaPallet: 18, adr: false, frigo: false, baseCitta: "Brescia" },
  { id: "MZ-14", targa: "GE 014 AB", tipo: "furgone", capacitaKg: 3500, capacitaPallet: 6, adr: false, frigo: false, baseCitta: "Brescia" },
  { id: "MZ-15", targa: "GE 015 AB", tipo: "bilico", capacitaKg: 24000, capacitaPallet: 33, adr: false, frigo: false, baseCitta: "Brescia" },
];

const NOMI_AUTISTI = [
  "Marco Ferrari", "Luca Colombo", "Andrea Ricci", "Simone Greco", "Davide Bruno",
  "Matteo Galli", "Stefano Conti", "Alessandro Rizzo", "Paolo Marino", "Roberto Fontana",
  "Giuseppe Villa", "Mattia Serra", "Fabio Longo", "Emanuele Costa", "Michele Barbieri",
];

export const AUTISTI: Autista[] = MEZZI.map((m, i) => ({
  id: `AU-${String(i + 1).padStart(2, "0")}`,
  nome: NOMI_AUTISTI[i],
  baseCitta: m.baseCitta,
  patenteAdr: m.adr,
  // due autisti già vicini al limite oggi, per generare un vincolo ore realistico nella demo
  oreMaxGiorno: i === 4 || i === 9 ? 3 : 9,
}));

const CLIENTI = [
  "Ceramiche Bianchi Srl", "Distribuzione Rossi", "Alimentari Verdi SpA", "MecTech Componenti",
  "Tessile Lombardi", "Farmalogistica Neri", "Arredo Casa Marchetti", "Chimica Industriale Colombo",
  "Elettronica Ferraro", "Packaging Sud Srl", "Beverage Group Ricci", "Automotive Parts Villa",
  "Carta e Cartone Longo", "Cosmetica Bruno", "Metalmeccanica Costa",
];

// Perlopiù regionali (Nord Italia, entro un giorno di guida): l'assegnazione della
// maggior parte degli ordini deve riuscire pulita, altrimenti la demo affoga in
// "non assegnabile" invece di mostrare 7-9 problemi veri su cui l'AI può agire.
// Ordinate per km crescenti: la selezione più sotto pesca con più probabilità dalle
// prime (tratte più corte, tipiche della distribuzione regionale multi-tappa).
const ROTTE_REGIONALI: [Citta, Citta][] = (
  [
    ["Milano", "Bologna"], ["Milano", "Torino"], ["Milano", "Verona"], ["Milano", "Brescia"],
    ["Milano", "Parma"], ["Milano", "Piacenza"], ["Milano", "Padova"], ["Milano", "Bergamo"],
    ["Milano", "Genova"], ["Bologna", "Firenze"], ["Bologna", "Verona"], ["Bologna", "Padova"],
    ["Bologna", "Parma"], ["Bologna", "Piacenza"], ["Verona", "Padova"], ["Verona", "Brescia"],
    ["Verona", "Bergamo"], ["Piacenza", "Genova"], ["Piacenza", "Parma"], ["Brescia", "Padova"],
    ["Brescia", "Bergamo"], ["Torino", "Genova"], ["Genova", "Firenze"], ["Parma", "Firenze"],
  ] as [Citta, Citta][]
).sort((a, b) => kmTra(...a) - kmTra(...b));

// Lunga percorrenza: sforano facilmente le ore disponibili in giornata, generano di
// proposito i problemi (non assegnato, rischio ritardo, rientro a vuoto) che l'AI segnala.
const ROTTE_LUNGHE: [Citta, Citta][] = [
  ["Milano", "Roma"], ["Milano", "Napoli"], ["Milano", "Bari"], ["Bologna", "Napoli"],
  ["Bologna", "Bari"], ["Verona", "Roma"], ["Verona", "Napoli"], ["Brescia", "Roma"],
  ["Brescia", "Bari"], ["Torino", "Roma"], ["Genova", "Roma"], ["Genova", "Napoli"],
  ["Padova", "Bari"], ["Firenze", "Napoli"],
];

const FINESTRE = ["08:00-12:00", "09:00-13:00", "10:00-14:00", "14:00-18:00", "13:00-17:00"];

function generaOrdini(): Ordine[] {
  const ordini: Ordine[] = [];
  let seed = 7;
  for (let i = 0; i < 40; i++) {
    seed += 1;
    const rLunga = pseudoRandom(seed * 11);
    const pool = rLunga > 0.88 ? ROTTE_LUNGHE : ROTTE_REGIONALI;
    // esponente >1 spinge la selezione verso l'inizio dell'array: nel pool regionale
    // (ordinato per km crescenti) privilegia le tratte più corte, coerente con un
    // giro multi-tappa nella stessa giornata
    const indice = Math.floor(pseudoRandom(seed * 17) ** 1.6 * pool.length);
    const [ritiroCitta, consegnaCitta] = pool[Math.min(indice, pool.length - 1)];
    const cliente = CLIENTI[Math.floor(pseudoRandom(seed * 3) * CLIENTI.length)];
    const r1 = pseudoRandom(seed);
    const r2 = pseudoRandom(seed + 100);
    const r3 = pseudoRandom(seed + 200);
    const pesoKg = Math.round(200 + r1 * 4500);
    const pallet = Math.max(1, Math.round(pesoKg / 650));
    ordini.push({
      id: `ORD-${String(i + 1).padStart(3, "0")}`,
      cliente,
      ritiroCitta,
      consegnaCitta,
      finestraConsegna: FINESTRE[Math.floor(r2 * FINESTRE.length)],
      pesoKg,
      pallet,
      adrRichiesto: r3 > 0.92,
      frigoRichiesto: r3 <= 0.92 && r3 > 0.8,
      ricavo: Math.round(180 + r1 * 700),
      priorita: r2 > 0.85 ? "urgente" : "standard",
    });
  }
  return ordini;
}

export const ORDINI: Ordine[] = generaOrdini();

const BROKER = ["TimoCom", "Trans.eu", "Cliente diretto", "Rete partner"];

// Direzione invertita rispetto agli ordini (dalle destinazioni verso gli hub): sono i
// carichi che un mezzo può intercettare per non tornare vuoto alla base.
const ROTTE_RIENTRO: [Citta, Citta][] = [...ROTTE_LUNGHE, ...ROTTE_REGIONALI].map(([a, b]) => [b, a]);

function generaCarichiSpot(): CaricoSpot[] {
  const carichi: CaricoSpot[] = [];
  let seed = 500;
  for (let i = 0; i < 14; i++) {
    seed += 1;
    const [ritiroCitta, consegnaCitta] = ROTTE_RIENTRO[(i * 5) % ROTTE_RIENTRO.length];
    const r1 = pseudoRandom(seed);
    const pesoKg = Math.round(500 + r1 * 6000);
    carichi.push({
      id: `SPOT-${String(i + 1).padStart(2, "0")}`,
      broker: BROKER[i % BROKER.length],
      ritiroCitta,
      consegnaCitta,
      pesoKg,
      pallet: Math.max(1, Math.round(pesoKg / 650)),
      ricavo: Math.round(150 + r1 * 500),
    });
  }
  return carichi;
}

export const CARICHI_SPOT: CaricoSpot[] = generaCarichiSpot();

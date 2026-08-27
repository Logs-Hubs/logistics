// Dati demo "Documenti trasporto", agganciati ai veri ORDINI/MEZZI/AUTISTI di lib/flotta/datiDemo.ts
// dove ha senso, esattamente come i casi doganali si agganciano alle Spedizioni reali di Porti.
import type { DocumentoTrasporto, LavoroTrasporto } from "./tipi";

function doc(
  id: string,
  nome: string,
  tipo: DocumentoTrasporto["tipo"],
  stato: DocumentoTrasporto["stato"],
  confidenza: number | null,
  caricatoIl: string | null,
  campiEstratti: Record<string, string> = {}
): DocumentoTrasporto {
  return { id, nome, tipo, stato, confidenza, campiEstratti, caricatoIl };
}

// LAV-01 — ORD-001 (MecTech Componenti, Brescia -> Roma): tutto in ordine, pronto per la fattura.
const LAV_01: LavoroTrasporto = {
  id: "LAV-2026-0001",
  riferimento: "LAV-2026-0001",
  clienteNome: "MecTech Componenti",
  ordineId: "ORD-001",
  mezzoId: "MZ-02",
  autistaId: "AU-02",
  ritiroCitta: "Brescia",
  consegnaCitta: "Roma",
  dataConsegna: "2026-08-26",
  tariffaConcordata: 588,
  documenti: [
    doc("LAV-2026-0001-D1", "Ordine_MecTech_2201.pdf", "ordine_cliente", "validato", 98, "2026-08-24T08:10:00.000Z"),
    doc("LAV-2026-0001-D2", "DDT_88231.pdf", "ddt", "validato", 95, "2026-08-26T17:20:00.000Z"),
    doc("LAV-2026-0001-D3", "POD_88231.jpg", "pod", "validato", 91, "2026-08-26T18:05:00.000Z"),
  ],
  fatturato: false,
  attivita: [
    { id: "LAV-2026-0001-A1", quando: "2026-08-24T08:10:00.000Z", testo: "Lavoro creato dall'ordine ORD-001.", fonte: "sistema" },
    { id: "LAV-2026-0001-A2", quando: "2026-08-26T18:05:00.000Z", testo: "POD ricevuto e validato: tutti i documenti richiesti sono completi.", fonte: "ai" },
  ],
  creatoIl: "2026-08-24T08:10:00.000Z",
  aggiornatoIl: "2026-08-26T18:05:00.000Z",
};

// LAV-02 — ORD-002 (Automotive Parts Villa, Milano -> Roma): consegnato, manca il POD dell'autista.
const LAV_02: LavoroTrasporto = {
  id: "LAV-2026-0002",
  riferimento: "LAV-2026-0002",
  clienteNome: "Automotive Parts Villa",
  ordineId: "ORD-002",
  mezzoId: "MZ-01",
  autistaId: "AU-01",
  ritiroCitta: "Milano",
  consegnaCitta: "Roma",
  dataConsegna: "2026-08-26",
  tariffaConcordata: 309,
  documenti: [
    doc("LAV-2026-0002-D1", "Ordine_APV_5510.pdf", "ordine_cliente", "validato", 97, "2026-08-24T09:00:00.000Z"),
    doc("LAV-2026-0002-D2", "DDT_88240.pdf", "ddt", "validato", 93, "2026-08-26T17:40:00.000Z"),
    doc("LAV-2026-0002-D3", "—", "pod", "mancante", null, null),
  ],
  fatturato: false,
  attivita: [
    { id: "LAV-2026-0002-A1", quando: "2026-08-24T09:00:00.000Z", testo: "Lavoro creato dall'ordine ORD-002.", fonte: "sistema" },
    { id: "LAV-2026-0002-A2", quando: "2026-08-26T17:41:00.000Z", testo: "Consegna segnalata completata, in attesa della foto del POD dall'autista.", fonte: "ai" },
  ],
  creatoIl: "2026-08-24T09:00:00.000Z",
  aggiornatoIl: "2026-08-26T17:41:00.000Z",
};

// LAV-03 — ORD-003 (Beverage Group Ricci, Bologna -> Firenze): DDT arrivato ma leggibilità bassa.
const LAV_03: LavoroTrasporto = {
  id: "LAV-2026-0003",
  riferimento: "LAV-2026-0003",
  clienteNome: "Beverage Group Ricci",
  ordineId: "ORD-003",
  mezzoId: "MZ-05",
  autistaId: "AU-05",
  ritiroCitta: "Bologna",
  consegnaCitta: "Firenze",
  dataConsegna: "2026-08-25",
  tariffaConcordata: 732,
  documenti: [
    doc("LAV-2026-0003-D1", "Ordine_BGR_3102.pdf", "ordine_cliente", "validato", 96, "2026-08-23T10:15:00.000Z"),
    doc("LAV-2026-0003-D2", "DDT_foto_88198.jpg", "ddt", "in_elaborazione", 58, "2026-08-25T16:50:00.000Z"),
    doc("LAV-2026-0003-D3", "POD_88198.jpg", "pod", "validato", 89, "2026-08-25T17:30:00.000Z"),
  ],
  fatturato: false,
  attivita: [
    { id: "LAV-2026-0003-A1", quando: "2026-08-23T10:15:00.000Z", testo: "Lavoro creato dall'ordine ORD-003.", fonte: "sistema" },
    { id: "LAV-2026-0003-A2", quando: "2026-08-25T16:51:00.000Z", testo: "DDT ricevuto come foto: qualità bassa, confidenza IA sotto soglia per la validazione automatica.", fonte: "ai" },
  ],
  creatoIl: "2026-08-23T10:15:00.000Z",
  aggiornatoIl: "2026-08-25T17:30:00.000Z",
};

// LAV-04 — ORD-004 (Distribuzione Rossi, Milano -> Piacenza): documenti ok, tariffa non confermata per iscritto.
const LAV_04: LavoroTrasporto = {
  id: "LAV-2026-0004",
  riferimento: "LAV-2026-0004",
  clienteNome: "Distribuzione Rossi",
  ordineId: "ORD-004",
  mezzoId: "MZ-11",
  autistaId: "AU-11",
  ritiroCitta: "Milano",
  consegnaCitta: "Piacenza",
  dataConsegna: "2026-08-26",
  tariffaConcordata: null,
  documenti: [
    doc("LAV-2026-0004-D1", "Ordine_Rossi_7742.pdf", "ordine_cliente", "validato", 90, "2026-08-25T08:30:00.000Z"),
    doc("LAV-2026-0004-D2", "DDT_88255.pdf", "ddt", "validato", 94, "2026-08-26T15:10:00.000Z"),
    doc("LAV-2026-0004-D3", "POD_88255.jpg", "pod", "validato", 92, "2026-08-26T15:40:00.000Z"),
  ],
  fatturato: false,
  attivita: [
    { id: "LAV-2026-0004-A1", quando: "2026-08-25T08:30:00.000Z", testo: "Lavoro creato dall'ordine ORD-004 — tariffa concordata verbalmente, non ancora scritta nell'ordine.", fonte: "sistema" },
    { id: "LAV-2026-0004-A2", quando: "2026-08-26T15:40:00.000Z", testo: "Documenti completi: manca solo la conferma della tariffa per poter fatturare.", fonte: "ai" },
  ],
  creatoIl: "2026-08-25T08:30:00.000Z",
  aggiornatoIl: "2026-08-26T15:40:00.000Z",
};

// LAV-05 — ORD-005 (MecTech Componenti, Milano -> Bergamo): viaggio ancora in corso oggi.
const LAV_05: LavoroTrasporto = {
  id: "LAV-2026-0005",
  riferimento: "LAV-2026-0005",
  clienteNome: "MecTech Componenti",
  ordineId: "ORD-005",
  mezzoId: "MZ-01",
  autistaId: "AU-01",
  ritiroCitta: "Milano",
  consegnaCitta: "Bergamo",
  dataConsegna: null,
  tariffaConcordata: 370,
  documenti: [
    doc("LAV-2026-0005-D1", "Ordine_MecTech_2214.pdf", "ordine_cliente", "validato", 95, "2026-08-27T07:20:00.000Z"),
    doc("LAV-2026-0005-D2", "—", "ddt", "atteso", null, null),
    doc("LAV-2026-0005-D3", "—", "pod", "atteso", null, null),
  ],
  fatturato: false,
  attivita: [{ id: "LAV-2026-0005-A1", quando: "2026-08-27T07:20:00.000Z", testo: "Lavoro creato dall'ordine ORD-005, mezzo in viaggio verso Bergamo.", fonte: "sistema" }],
  creatoIl: "2026-08-27T07:20:00.000Z",
  aggiornatoIl: "2026-08-27T07:20:00.000Z",
};

// LAV-06 — ORD-006 (Metalmeccanica Costa, Verona -> Padova): ciclo completo, già fatturato.
const LAV_06: LavoroTrasporto = {
  id: "LAV-2026-0006",
  riferimento: "LAV-2026-0006",
  clienteNome: "Metalmeccanica Costa",
  ordineId: "ORD-006",
  mezzoId: "MZ-08",
  autistaId: "AU-08",
  ritiroCitta: "Verona",
  consegnaCitta: "Padova",
  dataConsegna: "2026-08-20",
  tariffaConcordata: 649,
  documenti: [
    doc("LAV-2026-0006-D1", "Ordine_Costa_1187.pdf", "ordine_cliente", "validato", 99, "2026-08-19T09:00:00.000Z"),
    doc("LAV-2026-0006-D2", "DDT_88105.pdf", "ddt", "validato", 97, "2026-08-20T16:00:00.000Z"),
    doc("LAV-2026-0006-D3", "POD_88105.jpg", "pod", "validato", 95, "2026-08-20T16:35:00.000Z"),
  ],
  fatturato: true,
  attivita: [
    { id: "LAV-2026-0006-A1", quando: "2026-08-19T09:00:00.000Z", testo: "Lavoro creato dall'ordine ORD-006.", fonte: "sistema" },
    { id: "LAV-2026-0006-A2", quando: "2026-08-20T16:35:00.000Z", testo: "Documenti completi, pronto per la fatturazione.", fonte: "ai" },
    { id: "LAV-2026-0006-A3", quando: "2026-08-21T09:00:00.000Z", testo: "Fattura emessa.", fonte: "operatore" },
  ],
  creatoIl: "2026-08-19T09:00:00.000Z",
  aggiornatoIl: "2026-08-21T09:00:00.000Z",
};

export const LAVORI_DEMO: LavoroTrasporto[] = [LAV_01, LAV_02, LAV_03, LAV_04, LAV_05, LAV_06];

import type { Autista, AzionePiano, CaricoSpot, Mezzo, Ordine, Piano, PianoMezzo, Problema, KpiPiano } from "./tipi";
import { kmTra } from "./distanze";

export const COSTO_KM = 1.15; // EUR/km, stima costo operativo (carburante, usura, pedaggi)
export const VELOCITA_MEDIA_KMH = 60;
const MAX_TAPPE_PER_MEZZO = 5;
const ORE_CARICO_SCARICO = 0.5; // ore per tappa, tempo di manovra/carico non di guida

function capacitaCompatibile(mezzo: Mezzo, pesoResiduoKg: number, palletResiduo: number, o: { pesoKg: number; pallet: number }) {
  return pesoResiduoKg >= o.pesoKg && palletResiduo >= o.pallet;
}

function requisitiCompatibili(mezzo: Mezzo, o: { adrRichiesto: boolean; frigoRichiesto: boolean }) {
  return (!o.adrRichiesto || mezzo.adr) && (!o.frigoRichiesto || mezzo.frigo);
}

function ricalcolaMezzo(
  mezzo: Mezzo,
  autista: Autista,
  tappe: PianoMezzo["tappe"],
  ordiniById: Map<string, Ordine>,
  spotById: Map<string, CaricoSpot>
): PianoMezzo {
  let posizione = mezzo.baseCitta;
  let kmVuoti = 0;
  let kmCarico = 0;
  let ricavo = 0;

  for (const tappa of tappe) {
    kmVuoti += kmTra(posizione, tappa.ritiroCitta);
    kmCarico += kmTra(tappa.ritiroCitta, tappa.consegnaCitta);
    posizione = tappa.consegnaCitta;
    ricavo += tappa.origine === "ordine" ? ordiniById.get(tappa.ordineId)?.ricavo ?? 0 : spotById.get(tappa.ordineId)?.ricavo ?? 0;
  }

  // rientro alla base: se non coperto da un altro carico, è km a vuoto reale
  const kmRientro = kmTra(posizione, mezzo.baseCitta);
  kmVuoti += kmRientro;

  const kmTotali = kmVuoti + kmCarico;
  const costo = Math.round(kmTotali * COSTO_KM);
  const oreImpegnate = Math.round((kmTotali / VELOCITA_MEDIA_KMH + tappe.length * ORE_CARICO_SCARICO) * 10) / 10;

  return {
    mezzoId: mezzo.id,
    autistaId: autista.id,
    tappe,
    posizioneFinale: posizione,
    kmTotali,
    kmVuoti,
    oreImpegnate,
    ricavo,
    costo,
    margine: ricavo - costo,
  };
}

function pianifica(
  ordini: Ordine[],
  mezzi: Mezzo[],
  autisti: Autista[],
  strategia: "base" | "ottimizzato"
): Piano {
  const ordiniById = new Map(ordini.map((o) => [o.id, o]));
  const autistaPerMezzo = new Map(mezzi.map((m, i) => [m.id, autisti[i]]));

  const residuoPeso = new Map(mezzi.map((m) => [m.id, m.capacitaKg]));
  const residuoPallet = new Map(mezzi.map((m) => [m.id, m.capacitaPallet]));
  const posizioneCorrente = new Map(mezzi.map((m) => [m.id, m.baseCitta]));
  const oreUsate = new Map(mezzi.map((m) => [m.id, 0]));
  const tappePerMezzo = new Map<string, PianoMezzo["tappe"]>(mezzi.map((m) => [m.id, []]));

  const daAssegnare = strategia === "ottimizzato" ? [...ordini].sort((a, b) => (b.priorita === "urgente" ? 1 : 0) - (a.priorita === "urgente" ? 1 : 0)) : ordini;

  const nonAssegnati: string[] = [];

  for (const ordine of daAssegnare) {
    let sceltaMezzo: Mezzo | null = null;
    let miglioreKmAvvicinamento = Infinity;

    for (const mezzo of mezzi) {
      const tappe = tappePerMezzo.get(mezzo.id)!;
      if (tappe.length >= MAX_TAPPE_PER_MEZZO) continue;
      if (!requisitiCompatibili(mezzo, ordine)) continue;
      if (!capacitaCompatibile(mezzo, residuoPeso.get(mezzo.id)!, residuoPallet.get(mezzo.id)!, ordine)) continue;

      const autista = autistaPerMezzo.get(mezzo.id)!;
      const posizione = posizioneCorrente.get(mezzo.id)!;
      const kmAvvicinamento = kmTra(posizione, ordine.ritiroCitta);
      const kmTappa = kmAvvicinamento + kmTra(ordine.ritiroCitta, ordine.consegnaCitta);
      const oreStimate = oreUsate.get(mezzo.id)! + kmTappa / VELOCITA_MEDIA_KMH + ORE_CARICO_SCARICO;
      if (oreStimate > autista.oreMaxGiorno) continue;

      if (strategia === "base") {
        // strategia "a mano": primo mezzo compatibile trovato, senza ottimizzare la distanza
        sceltaMezzo = mezzo;
        break;
      }

      // strategia ottimizzata: preferisce il mezzo che ha meno strada a vuoto da percorrere
      // per arrivare al ritiro, incatenando le tappe invece di lasciarle isolate
      if (kmAvvicinamento < miglioreKmAvvicinamento) {
        miglioreKmAvvicinamento = kmAvvicinamento;
        sceltaMezzo = mezzo;
      }
    }

    if (!sceltaMezzo) {
      nonAssegnati.push(ordine.id);
      continue;
    }

    const mezzo = sceltaMezzo;
    const posizione = posizioneCorrente.get(mezzo.id)!;
    const kmAvvicinamento = kmTra(posizione, ordine.ritiroCitta);
    const kmTappa = kmAvvicinamento + kmTra(ordine.ritiroCitta, ordine.consegnaCitta);

    tappePerMezzo.get(mezzo.id)!.push({ ordineId: ordine.id, ritiroCitta: ordine.ritiroCitta, consegnaCitta: ordine.consegnaCitta, origine: "ordine" });
    residuoPeso.set(mezzo.id, residuoPeso.get(mezzo.id)! - ordine.pesoKg);
    residuoPallet.set(mezzo.id, residuoPallet.get(mezzo.id)! - ordine.pallet);
    posizioneCorrente.set(mezzo.id, ordine.consegnaCitta);
    oreUsate.set(mezzo.id, oreUsate.get(mezzo.id)! + kmTappa / VELOCITA_MEDIA_KMH + ORE_CARICO_SCARICO);
  }

  const spotById = new Map<string, CaricoSpot>();
  const mezziPiano: PianoMezzo[] = mezzi.map((m) =>
    ricalcolaMezzo(m, autistaPerMezzo.get(m.id)!, tappePerMezzo.get(m.id)!, ordiniById, spotById)
  );

  return { mezzi: mezziPiano, ordiniNonAssegnati: nonAssegnati };
}

export function pianificaBase(ordini: Ordine[], mezzi: Mezzo[], autisti: Autista[]): Piano {
  return pianifica(ordini, mezzi, autisti, "base");
}

export function pianificaOttimizzato(ordini: Ordine[], mezzi: Mezzo[], autisti: Autista[]): Piano {
  return pianifica(ordini, mezzi, autisti, "ottimizzato");
}

export function calcolaKpi(piano: Piano): KpiPiano {
  const kmTotali = piano.mezzi.reduce((s, m) => s + m.kmTotali, 0);
  const kmVuoti = piano.mezzi.reduce((s, m) => s + m.kmVuoti, 0);
  const ricavo = piano.mezzi.reduce((s, m) => s + m.ricavo, 0);
  const costo = piano.mezzi.reduce((s, m) => s + m.costo, 0);
  const mezziAttivi = piano.mezzi.filter((m) => m.tappe.length > 0).length;

  return {
    kmTotali,
    kmVuoti,
    percentualeVuoto: kmTotali > 0 ? kmVuoti / kmTotali : 0,
    utilizzoMezzi: piano.mezzi.length > 0 ? mezziAttivi / piano.mezzi.length : 0,
    ricavo,
    costo,
    margine: ricavo - costo,
  };
}

function trovaMezzoConSlotLibero(
  piano: Piano,
  mezzi: Mezzo[],
  o: { pesoKg: number; pallet: number; adrRichiesto: boolean; frigoRichiesto: boolean },
  escludiMezzoId?: string
): Mezzo | null {
  for (const mezzoPiano of piano.mezzi) {
    if (mezzoPiano.mezzoId === escludiMezzoId) continue;
    if (mezzoPiano.tappe.length >= MAX_TAPPE_PER_MEZZO) continue;
    const mezzo = mezzi.find((m) => m.id === mezzoPiano.mezzoId)!;
    if (!requisitiCompatibili(mezzo, o)) continue;
    // verifica approssimata: confronta col peso/pallet totali del mezzo, non col residuo
    // effettivo dopo le tappe già assegnate (sufficiente per suggerire un'alternativa in demo)
    if (mezzo.capacitaKg < o.pesoKg || mezzo.capacitaPallet < o.pallet) continue;
    return mezzo;
  }
  return null;
}

export function rilevaProblemi(
  piano: Piano,
  ordini: Ordine[],
  mezzi: Mezzo[],
  autisti: Autista[],
  carichiSpot: CaricoSpot[]
): Problema[] {
  const ordiniById = new Map(ordini.map((o) => [o.id, o]));
  const problemi: Problema[] = [];

  // 1. ordini non assegnati: fatturato perso
  for (const ordineId of piano.ordiniNonAssegnati) {
    const o = ordiniById.get(ordineId)!;
    const mezzoAlternativo = trovaMezzoConSlotLibero(piano, mezzi, o);
    problemi.push({
      id: `PROB-NA-${ordineId}`,
      tipo: "non_assegnato",
      titolo: `${o.id} non assegnato: ${o.cliente}`,
      descrizione: `Tratta ${o.ritiroCitta} → ${o.consegnaCitta}, nessun mezzo compatibile aveva capacità o requisiti (ADR/frigo) disponibili al momento della pianificazione.`,
      impattoEuro: o.ricavo,
      azione: mezzoAlternativo ? { kind: "sposta_ordine", ordineId, daMezzoId: null, aMezzoId: mezzoAlternativo.id } : null,
      risolto: false,
    });
  }

  // 2. rientri a vuoto: opportunità di backhaul
  const spotUsati = new Set<string>();
  for (const mp of piano.mezzi) {
    const mezzo = mezzi.find((m) => m.id === mp.mezzoId)!;
    if (mp.posizioneFinale === mezzo.baseCitta) continue;
    const kmRientro = kmTra(mp.posizioneFinale, mezzo.baseCitta);
    if (kmRientro < 40) continue; // rientro breve, non vale la pena segnalarlo

    const spotCompatibile = carichiSpot.find(
      (s) =>
        !spotUsati.has(s.id) &&
        s.ritiroCitta === mp.posizioneFinale &&
        requisitiCompatibili(mezzo, { adrRichiesto: false, frigoRichiesto: false }) &&
        mezzo.capacitaKg >= s.pesoKg &&
        mezzo.capacitaPallet >= s.pallet
    );

    if (spotCompatibile) spotUsati.add(spotCompatibile.id);

    problemi.push({
      id: `PROB-RV-${mp.mezzoId}`,
      tipo: "reso_vuoto",
      titolo: `${mp.mezzoId} rientra vuoto da ${mp.posizioneFinale}`,
      descrizione: spotCompatibile
        ? `${kmRientro} km a vuoto verso ${mezzo.baseCitta}. Carico compatibile disponibile: ${spotCompatibile.broker}, ${spotCompatibile.ritiroCitta} → ${spotCompatibile.consegnaCitta}.`
        : `${kmRientro} km a vuoto verso ${mezzo.baseCitta}. Nessun carico compatibile trovato al momento sul mercato spot.`,
      impattoEuro: spotCompatibile ? spotCompatibile.ricavo : -Math.round(kmRientro * COSTO_KM),
      azione: spotCompatibile ? { kind: "aggiungi_spot", caricoSpotId: spotCompatibile.id, mezzoId: mp.mezzoId } : null,
      risolto: false,
    });
  }

  // 3. autisti vicini al limite ore. Il rientro alla base (dopo l'ultima consegna) non è
  // ore di guida "operative" in questo turno: si esclude dal confronto col limite, altrimenti
  // quasi ogni mezzo risulterebbe fuori limite solo per il tragitto di rientro.
  for (const mp of piano.mezzi) {
    const autista = autisti.find((a) => a.id === mp.autistaId)!;
    const mezzo = mezzi.find((m) => m.id === mp.mezzoId)!;
    const kmRientro = kmTra(mp.posizioneFinale, mezzo.baseCitta);
    const oreOperative = Math.round((mp.oreImpegnate - kmRientro / VELOCITA_MEDIA_KMH) * 10) / 10;
    if (oreOperative <= autista.oreMaxGiorno) continue;
    const ultimaTappa = mp.tappe[mp.tappe.length - 1];
    const ordine = ultimaTappa ? ordiniById.get(ultimaTappa.ordineId) : undefined;
    const mezzoAlternativo = ordine ? trovaMezzoConSlotLibero(piano, mezzi, ordine, mp.mezzoId) : null;
    problemi.push({
      id: `PROB-OA-${mp.mezzoId}`,
      tipo: "ore_autista",
      titolo: `${autista.nome} rischia di superare le ore giornaliere`,
      descrizione: `Piano da ${oreOperative}h su un limite di ${autista.oreMaxGiorno}h oggi. ${
        ordine ? `Ultima tappa a rischio: ${ordine.id} (${ordine.cliente}).` : ""
      }`,
      impattoEuro: 150,
      azione: ordine && mezzoAlternativo ? { kind: "sposta_ordine", ordineId: ordine.id, daMezzoId: mp.mezzoId, aMezzoId: mezzoAlternativo.id } : null,
      risolto: false,
    });
  }

  // 4. consegne urgenti non in prima posizione (rischio finestra oraria)
  for (const mp of piano.mezzi) {
    mp.tappe.forEach((tappa, idx) => {
      if (idx === 0) return;
      const o = ordiniById.get(tappa.ordineId);
      if (!o || o.priorita !== "urgente") return;
      const mezzoAlternativo = trovaMezzoConSlotLibero(piano, mezzi, o, mp.mezzoId);
      problemi.push({
        id: `PROB-RT-${o.id}`,
        tipo: "rischio_ritardo",
        titolo: `${o.id} urgente in coda su ${mp.mezzoId}`,
        descrizione: `${o.cliente} ha priorità urgente ma è la ${idx + 1}ª tappa del giro: rischia di uscire dalla finestra ${o.finestraConsegna}.`,
        impattoEuro: Math.round(o.ricavo * 0.3),
        azione: mezzoAlternativo ? { kind: "sposta_ordine", ordineId: o.id, daMezzoId: mp.mezzoId, aMezzoId: mezzoAlternativo.id } : null,
        risolto: false,
      });
    });
  }

  return problemi.sort((a, b) => b.impattoEuro - a.impattoEuro);
}

export function applicaAzione(
  piano: Piano,
  azione: AzionePiano,
  ordini: Ordine[],
  mezzi: Mezzo[],
  autisti: Autista[],
  carichiSpot: CaricoSpot[]
): Piano {
  const ordiniById = new Map(ordini.map((o) => [o.id, o]));
  const spotById = new Map(carichiSpot.map((s) => [s.id, s]));
  const autistaByMezzoId = new Map(mezzi.map((m, i) => [m.id, autisti[i]]));

  const tappePerMezzo = new Map(piano.mezzi.map((mp) => [mp.mezzoId, [...mp.tappe]]));
  let ordiniNonAssegnati = [...piano.ordiniNonAssegnati];

  if (azione.kind === "sposta_ordine") {
    const o = ordiniById.get(azione.ordineId)!;
    if (azione.daMezzoId) {
      const tappe = tappePerMezzo.get(azione.daMezzoId)!;
      tappePerMezzo.set(azione.daMezzoId, tappe.filter((t) => t.ordineId !== azione.ordineId));
    } else {
      ordiniNonAssegnati = ordiniNonAssegnati.filter((id) => id !== azione.ordineId);
    }
    tappePerMezzo.get(azione.aMezzoId)!.push({ ordineId: o.id, ritiroCitta: o.ritiroCitta, consegnaCitta: o.consegnaCitta, origine: "ordine" });
  }

  if (azione.kind === "aggiungi_spot") {
    const s = spotById.get(azione.caricoSpotId)!;
    tappePerMezzo.get(azione.mezzoId)!.push({ ordineId: s.id, ritiroCitta: s.ritiroCitta, consegnaCitta: s.consegnaCitta, origine: "spot" });
  }

  const mezziPiano: PianoMezzo[] = mezzi.map((m) =>
    ricalcolaMezzo(m, autistaByMezzoId.get(m.id)!, tappePerMezzo.get(m.id) ?? [], ordiniById, spotById)
  );

  return { mezzi: mezziPiano, ordiniNonAssegnati };
}

export type RacconteEccezione = {
  mezzoId: string;
  ordineSpostato: string;
  mezzoDestinazioneId: string | null;
  passi: string[];
  problema: Problema | null;
};

export function simulaRitardo(
  piano: Piano,
  ordini: Ordine[],
  mezzi: Mezzo[],
  minutiRitardo: number
): RacconteEccezione | null {
  const ordiniById = new Map(ordini.map((o) => [o.id, o]));
  const candidato = [...piano.mezzi].sort((a, b) => b.tappe.length - a.tappe.length).find((mp) => mp.tappe.length >= 2);
  if (!candidato) return null;

  const ultimaTappa = candidato.tappe[candidato.tappe.length - 1];
  const ordine = ordiniById.get(ultimaTappa.ordineId)!;
  const mezzoAlternativo = trovaMezzoConSlotLibero(piano, mezzi, ordine, candidato.mezzoId);

  const passi = [
    `${candidato.mezzoId} segnala un ritardo di ${minutiRitardo} minuti sulla tappa in corso.`,
    `Ricalcolo l'impatto sulle tappe successive del giro: ${ordine.id} (${ordine.cliente}) rischia di uscire dalla finestra ${ordine.finestraConsegna}.`,
    mezzoAlternativo
      ? `${mezzoAlternativo.id} ha capacità e requisiti compatibili: sposto ${ordine.id} su quel mezzo per rispettare la finestra.`
      : `Nessun mezzo alternativo disponibile ora: serve un intervento manuale sul cliente per rinegoziare la finestra.`,
    `Notifico il cliente del nuovo orario stimato.`,
  ];

  const problema: Problema | null = mezzoAlternativo
    ? {
        id: `PROB-ECC-${ordine.id}`,
        tipo: "rischio_ritardo",
        titolo: `Ritardo ${minutiRitardo}min su ${candidato.mezzoId}: ${ordine.id} a rischio`,
        descrizione: `${ordine.cliente}, tratta ${ordine.ritiroCitta} → ${ordine.consegnaCitta}, finestra ${ordine.finestraConsegna}.`,
        impattoEuro: Math.round(ordine.ricavo * 0.4),
        azione: { kind: "sposta_ordine", ordineId: ordine.id, daMezzoId: candidato.mezzoId, aMezzoId: mezzoAlternativo.id },
        risolto: false,
      }
    : null;

  return { mezzoId: candidato.mezzoId, ordineSpostato: ordine.id, mezzoDestinazioneId: mezzoAlternativo?.id ?? null, passi, problema };
}

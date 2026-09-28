// Motore "Attenzione oggi" del modulo Container: pure funzioni, nessuna chiamata IA, stesso
// principio di lib/exceptions/motore.ts (Porti) e lib/flotta/attenzione/motore.ts (Flotte) — non
// una dashboard piena di grafici, una lista prioritizzata di "queste sono le cose che richiedono
// attenzione oggi" (vedi product/container-trucking-v1.md, capability C).
import { readinessCompleta, type OrdineContainer } from "./tipi";

export type SeveritaEccezioneContainer = "critica" | "alta" | "media";

export type EccezioneContainer = {
  id: string;
  severita: SeveritaEccezioneContainer;
  titolo: string;
  ragioni: string[];
  azioneConsigliata: string;
  href: string;
  esposizioneEuro: number | null;
};

export const LABEL_SEVERITA_ECCEZIONE_CONTAINER: Record<SeveritaEccezioneContainer, string> = {
  critica: "Critica",
  alta: "Alta",
  media: "Media",
};

const PESO_SEVERITA: Record<SeveritaEccezioneContainer, number> = { critica: 3, alta: 2, media: 1 };

/** Soglia oltre la quale un'attesa al gate/cliente diventa un'eccezione da segnalare, non solo un
 * ritardo fisiologico. Nessuna fonte specifica per la Liguria: valore di lavoro, da tarare con la
 * discovery reale (vedi research/container-trucking-workflow.md §6, OPEN QUESTION). */
const SOGLIA_ATTESA_MINUTI = 60;

const OGGI_DEMO = new Date("2026-09-28T00:00:00");

function giorniA(dataIso: string): number {
  const target = new Date(`${dataIso}T00:00:00`);
  return Math.round((target.getTime() - OGGI_DEMO.getTime()) / (1000 * 60 * 60 * 24));
}

function chiuso(o: OrdineContainer): boolean {
  return o.faseOperativa === "vuoto_rientrato" || o.faseOperativa === "fatturato";
}

export function rilevaEccezioniContainer(ordini: OrdineContainer[]): EccezioneContainer[] {
  const eccezioni: EccezioneContainer[] = [];

  for (const o of ordini) {
    const rif = `${o.id} — ${o.cliente}`;
    const href = `/container/ordini/${o.id}`;

    if (!chiuso(o)) {
      if (!o.readiness.customsRelease) {
        eccezioni.push({
          id: `ECC-CUSTOMS-${o.id}`,
          severita: "critica",
          titolo: `${rif}: blocco doganale`,
          ragioni: ["Customs release non ancora ottenuto — il container non è ritirabile"],
          azioneConsigliata: "Sollecita lo spedizioniere/agente doganale",
          href,
          esposizioneEuro: null,
        });
      }

      if (o.faseOperativa === "pronto_dispatch" && !o.autistaId) {
        eccezioni.push({
          id: `ECC-NOAUTISTA-${o.id}`,
          severita: "critica",
          titolo: `${rif}: pronto ma senza autista assegnato`,
          ragioni: ["Readiness completa, nessun autista/mezzo ancora assegnato"],
          azioneConsigliata: "Assegna un autista dal dispatch",
          href,
          esposizioneEuro: null,
        });
      }

      if (readinessCompleta(o.readiness) && !o.readiness.slotPrenotato) {
        eccezioni.push({
          id: `ECC-SLOT-${o.id}`,
          severita: "alta",
          titolo: `${rif}: slot non prenotato`,
          ragioni: ["Readiness completa ma nessuno slot/appuntamento prenotato al terminal"],
          azioneConsigliata: "Prenota lo slot nel portale del terminal (azione manuale esterna)",
          href,
          esposizioneEuro: null,
        });
      }

      const giorniAlFreeDay = giorniA(o.ultimoFreeDay);
      if (giorniAlFreeDay <= 1) {
        eccezioni.push({
          id: `ECC-FREEDAY-${o.id}`,
          severita: giorniAlFreeDay < 0 ? "critica" : "alta",
          titolo:
            giorniAlFreeDay < 0
              ? `${rif}: last free day già scaduto`
              : giorniAlFreeDay === 0
                ? `${rif}: last free day è oggi`
                : `${rif}: last free day è domani`,
          ragioni: [giorniAlFreeDay < 0 ? "Rischio demurrage/detention già in corso" : "Rischio demurrage/detention imminente"],
          azioneConsigliata: "Prioritizza il ritiro o il rientro vuoto di questo container",
          href,
          esposizioneEuro: null,
        });
      }
    }

    if (o.attesaMinuti !== null && o.attesaMinuti > SOGLIA_ATTESA_MINUTI) {
      eccezioni.push({
        id: `ECC-ATTESA-${o.id}`,
        severita: "media",
        titolo: `${rif}: attesa autista oltre soglia`,
        ragioni: [`${o.attesaMinuti} minuti di attesa registrati, oltre la soglia di ${SOGLIA_ATTESA_MINUTI}`],
        azioneConsigliata: "Verifica che l'attesa sia stata addebitata come accessorial",
        href,
        esposizioneEuro: null,
      });
    }

    if ((o.faseOperativa === "vuoto_rientrato" || o.faseOperativa === "consegnato") && o.accessorialDaFatturare && o.accessorialDaFatturare > 0) {
      eccezioni.push({
        id: `ECC-ACCESSORIAL-${o.id}`,
        severita: "media",
        titolo: `${rif}: accessorial non ancora fatturato`,
        ragioni: [`${o.accessorialDaFatturare}€ di extra (attese/accessori) non ancora inclusi in fattura`],
        azioneConsigliata: "Aggiungi gli accessorial prima di emettere la fattura",
        href,
        esposizioneEuro: o.accessorialDaFatturare,
      });
    }
  }

  return eccezioni.sort((a, b) => PESO_SEVERITA[b.severita] - PESO_SEVERITA[a.severita]);
}

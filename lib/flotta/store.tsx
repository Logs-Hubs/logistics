"use client";

// Stato del piano di pianificazione, sollevato fuori da FlottaClient perché ora anche l'Exception
// Center di Flotte (lib/flotta/attenzione/) deve leggere i problemi correnti — non quelli del piano
// base ricalcolati da zero, quelli realmente visti/risolti dall'operatore nel centro comando.
// Stesso principio già seguito altrove: mai mostrare un segnale stantio.
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { AUTISTI, CARICHI_SPOT, MEZZI, ORDINI } from "./datiDemo";
import {
  applicaAzione,
  calcolaKpi,
  pianificaBase,
  pianificaOttimizzato,
  rilevaProblemi,
  simulaRitardo,
  type RacconteEccezione,
} from "./pianificatore";
import type { Piano, Problema } from "./tipi";

type PianoContextValue = {
  piano: Piano;
  pianoBase: Piano;
  problemi: Problema[];
  problemiBase: Problema[];
  ottimizzato: boolean;
  kpi: ReturnType<typeof calcolaKpi>;
  kpiBase: ReturnType<typeof calcolaKpi>;
  ottimizzaOggi: () => void;
  applicaProblema: (problema: Problema) => void;
  simula: () => RacconteEccezione | null;
};

const PianoContext = createContext<PianoContextValue | null>(null);

export function PianoProvider({ children }: { children: ReactNode }) {
  const pianoBase = useMemo(() => pianificaBase(ORDINI, MEZZI, AUTISTI), []);
  const problemiBase = useMemo(() => rilevaProblemi(pianoBase, ORDINI, MEZZI, AUTISTI, CARICHI_SPOT), [pianoBase]);

  const [ottimizzato, setOttimizzato] = useState(false);
  const [piano, setPiano] = useState<Piano>(pianoBase);
  const [problemi, setProblemi] = useState<Problema[]>(problemiBase);

  const ottimizzaOggi = useCallback(() => {
    const nuovoPiano = pianificaOttimizzato(ORDINI, MEZZI, AUTISTI);
    setPiano(nuovoPiano);
    setProblemi(rilevaProblemi(nuovoPiano, ORDINI, MEZZI, AUTISTI, CARICHI_SPOT));
    setOttimizzato(true);
  }, []);

  const applicaProblema = useCallback(
    (problema: Problema) => {
      if (!problema.azione) return;
      setPiano((pianoAttuale) => {
        const nuovoPiano = applicaAzione(pianoAttuale, problema.azione!, ORDINI, MEZZI, AUTISTI, CARICHI_SPOT);
        return nuovoPiano;
      });
      setProblemi((prev) => prev.map((p) => (p.id === problema.id ? { ...p, risolto: true } : p)));
    },
    []
  );

  const simula = useCallback((): RacconteEccezione | null => {
    // variazione deterministica, non casuale — stessa scelta già commentata in precedenza in FlottaClient
    const minuti = 45 + Math.round((piano.mezzi.length * 7) % 50);
    const racconto = simulaRitardo(piano, ORDINI, MEZZI, minuti);
    if (racconto?.problema) {
      setProblemi((prev) => [racconto.problema!, ...prev.filter((p) => p.id !== racconto.problema!.id)]);
    }
    return racconto;
  }, [piano]);

  const kpi = calcolaKpi(piano);
  const kpiBase = calcolaKpi(pianoBase);

  const value = useMemo(
    () => ({ piano, pianoBase, problemi, problemiBase, ottimizzato, kpi, kpiBase, ottimizzaOggi, applicaProblema, simula }),
    [piano, pianoBase, problemi, problemiBase, ottimizzato, kpi, kpiBase, ottimizzaOggi, applicaProblema, simula]
  );

  return <PianoContext.Provider value={value}>{children}</PianoContext.Provider>;
}

export function usePianoFlotta() {
  const ctx = useContext(PianoContext);
  if (!ctx) throw new Error("usePianoFlotta deve essere usato dentro <PianoProvider>");
  return ctx;
}

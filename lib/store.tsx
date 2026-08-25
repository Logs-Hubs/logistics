"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { SPEDIZIONI, type FaseOperativa, type Spedizione, type StatoAppuntamento } from "./data";

type Override = Partial<
  Pick<Spedizione, "stato" | "oraAppuntamento" | "dataAppuntamento" | "faseOperativa" | "oraRitiro" | "oraRientroVuoto">
>;

type OperationsContextValue = {
  /** Spedizioni con sopra gli aggiornamenti fatti a runtime (es. conferme dal calendario, azioni del driver) */
  spedizioni: Spedizione[];
  /** Id dell'ultima spedizione aggiornata, per far pulsare la card giusta per ~6s */
  ultimoAggiornatoId: string | null;
  confermaAppuntamento: (spedizioneId: string, oraAppuntamento: string, dataAppuntamento: string) => void;
  segnalaRitiro: (spedizioneId: string, ora: string) => void;
  segnalaRientroVuoto: (spedizioneId: string, ora: string) => void;
};

const OperationsContext = createContext<OperationsContextValue | null>(null);

export function OperationsProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<Record<string, Override>>({});
  const [ultimoAggiornatoId, setUltimoAggiornatoId] = useState<string | null>(null);

  const applyOverride = useCallback((spedizioneId: string, patch: Override) => {
    setOverrides((prev) => ({ ...prev, [spedizioneId]: { ...prev[spedizioneId], ...patch } }));
    setUltimoAggiornatoId(spedizioneId);
    window.setTimeout(() => {
      setUltimoAggiornatoId((current) => (current === spedizioneId ? null : current));
    }, 6000);
  }, []);

  const confermaAppuntamento = useCallback(
    (spedizioneId: string, oraAppuntamento: string, dataAppuntamento: string) => {
      applyOverride(spedizioneId, { stato: "confermato" as StatoAppuntamento, oraAppuntamento, dataAppuntamento });
    },
    [applyOverride]
  );

  const segnalaRitiro = useCallback(
    (spedizioneId: string, ora: string) => {
      applyOverride(spedizioneId, { faseOperativa: "ritirato" as FaseOperativa, oraRitiro: ora });
    },
    [applyOverride]
  );

  const segnalaRientroVuoto = useCallback(
    (spedizioneId: string, ora: string) => {
      applyOverride(spedizioneId, { faseOperativa: "rientro_vuoto" as FaseOperativa, oraRientroVuoto: ora });
    },
    [applyOverride]
  );

  const spedizioni = SPEDIZIONI.map((s) => (overrides[s.id] ? { ...s, ...overrides[s.id] } : s));

  return (
    <OperationsContext.Provider
      value={{ spedizioni, ultimoAggiornatoId, confermaAppuntamento, segnalaRitiro, segnalaRientroVuoto }}
    >
      {children}
    </OperationsContext.Provider>
  );
}

export function useOperations() {
  const ctx = useContext(OperationsContext);
  if (!ctx) throw new Error("useOperations deve essere usato dentro <OperationsProvider>");
  return ctx;
}

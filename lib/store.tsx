"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { SPEDIZIONI, type Spedizione, type StatoAppuntamento } from "./data";

type Override = {
  stato: StatoAppuntamento;
  oraAppuntamento: string;
  dataAppuntamento: string;
};

type OperationsContextValue = {
  /** Spedizioni con sopra gli aggiornamenti fatti a runtime (es. conferme dal calendario) */
  spedizioni: Spedizione[];
  /** Id dell'ultima spedizione la cui conferma ha generato una notifica al vettore, per ~6s */
  ultimoAggiornatoId: string | null;
  confermaAppuntamento: (spedizioneId: string, oraAppuntamento: string, dataAppuntamento: string) => void;
};

const OperationsContext = createContext<OperationsContextValue | null>(null);

export function OperationsProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<Record<string, Override>>({});
  const [ultimoAggiornatoId, setUltimoAggiornatoId] = useState<string | null>(null);

  const confermaAppuntamento = useCallback(
    (spedizioneId: string, oraAppuntamento: string, dataAppuntamento: string) => {
      setOverrides((prev) => ({
        ...prev,
        [spedizioneId]: { stato: "confermato", oraAppuntamento, dataAppuntamento },
      }));
      setUltimoAggiornatoId(spedizioneId);
      window.setTimeout(() => {
        setUltimoAggiornatoId((current) => (current === spedizioneId ? null : current));
      }, 6000);
    },
    []
  );

  const spedizioni = SPEDIZIONI.map((s) => (overrides[s.id] ? { ...s, ...overrides[s.id] } : s));

  return (
    <OperationsContext.Provider value={{ spedizioni, ultimoAggiornatoId, confermaAppuntamento }}>
      {children}
    </OperationsContext.Provider>
  );
}

export function useOperations() {
  const ctx = useContext(OperationsContext);
  if (!ctx) throw new Error("useOperations deve essere usato dentro <OperationsProvider>");
  return ctx;
}

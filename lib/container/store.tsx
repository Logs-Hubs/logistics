"use client";

// Stato client-only del modulo Container: nessun backend, aggiornamenti ottimistici in memoria —
// stesso principio di lib/flotta/store.tsx. L'Exception Center (lib/container/motore.ts) ricalcola
// sempre dagli ordini correnti, mai da un elenco di eccezioni "congelato".
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { AUTISTI_DEMO, MEZZI_DEMO, ORDINI_DEMO } from "./datiDemo";
import { prontoPerFatturazione, rilevaEccezioniContainer, type EccezioneContainer } from "./motore";
import { compatibile, readinessCompleta, type Autista, type Mezzo, type NuovoOrdineInput, type OrdineContainer } from "./tipi";

type ContainerContextValue = {
  ordini: OrdineContainer[];
  autisti: Autista[];
  mezzi: Mezzo[];
  eccezioni: EccezioneContainer[];
  trovaOrdine: (id: string) => OrdineContainer | undefined;
  creaOrdine: (input: NuovoOrdineInput) => string;
  segnalaCarrierRelease: (id: string) => void;
  segnalaCustomsRelease: (id: string) => void;
  segnalaTerminalDisponibile: (id: string) => void;
  prenotaSlot: (id: string, dataOra: string) => void;
  assegnaAutista: (id: string, autistaId: string, mezzoId: string) => void;
  segnalaRitiro: (id: string) => void;
  segnalaConsegna: (id: string, attesaMinuti?: number) => void;
  segnalaRientroVuoto: (id: string) => void;
  segnalaEirRaccolto: (id: string) => void;
  segnalaPodRaccolto: (id: string) => void;
  segnalaFatturato: (id: string) => void;
};

const ContainerContext = createContext<ContainerContextValue | null>(null);

function adesso(): string {
  return new Date().toISOString();
}

export function ContainerProvider({ children }: { children: ReactNode }) {
  const [ordini, setOrdini] = useState<OrdineContainer[]>(ORDINI_DEMO);

  const aggiorna = useCallback((id: string, patch: Partial<OrdineContainer>) => {
    setOrdini((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch, aggiornatoIl: adesso() } : o)));
  }, []);

  const aggiornaReadiness = useCallback(
    (id: string, patchReadiness: Partial<OrdineContainer["readiness"]>) => {
      setOrdini((prev) =>
        prev.map((o) => {
          if (o.id !== id) return o;
          const readiness = { ...o.readiness, ...patchReadiness };
          const faseOperativa =
            o.faseOperativa === "attesa_readiness" && readinessCompleta(readiness) ? "pronto_dispatch" : o.faseOperativa;
          return { ...o, readiness, faseOperativa, aggiornatoIl: adesso() };
        })
      );
    },
    []
  );

  const segnalaCarrierRelease = useCallback((id: string) => aggiornaReadiness(id, { carrierRelease: true }), [aggiornaReadiness]);
  const segnalaCustomsRelease = useCallback((id: string) => aggiornaReadiness(id, { customsRelease: true }), [aggiornaReadiness]);
  const segnalaTerminalDisponibile = useCallback(
    (id: string) => aggiornaReadiness(id, { terminalDisponibile: true }),
    [aggiornaReadiness]
  );

  const prenotaSlot = useCallback(
    (id: string, dataOra: string) => aggiornaReadiness(id, { slotPrenotato: true, slotDataOra: dataOra }),
    [aggiornaReadiness]
  );

  const assegnaAutista = useCallback(
    (id: string, autistaId: string, mezzoId: string) => {
      const mezzo = MEZZI_DEMO.find((m) => m.id === mezzoId);
      setOrdini((prev) =>
        prev.map((o) => {
          if (o.id !== id) return o;
          if (mezzo && !compatibile(o, mezzo)) return o; // la UI non dovrebbe offrire mezzi incompatibili come scelta
          return { ...o, autistaId, mezzoId, aggiornatoIl: adesso() };
        })
      );
    },
    []
  );

  const segnalaRitiro = useCallback(
    (id: string) => aggiorna(id, { faseOperativa: "in_esecuzione", oraRitiro: adesso() }),
    [aggiorna]
  );

  const segnalaConsegna = useCallback(
    (id: string, attesaMinuti?: number) =>
      aggiorna(id, { faseOperativa: "consegnato", oraConsegna: adesso(), attesaMinuti: attesaMinuti ?? null }),
    [aggiorna]
  );

  const segnalaRientroVuoto = useCallback(
    (id: string) => aggiorna(id, { faseOperativa: "vuoto_rientrato", oraRientroVuoto: adesso() }),
    [aggiorna]
  );

  const segnalaEirRaccolto = useCallback((id: string) => aggiorna(id, { eirRaccolto: true }), [aggiorna]);
  const segnalaPodRaccolto = useCallback((id: string) => aggiorna(id, { podRaccolto: true }), [aggiorna]);

  const segnalaFatturato = useCallback(
    (id: string) => {
      setOrdini((prev) =>
        prev.map((o) => {
          if (o.id !== id || !prontoPerFatturazione(o)) return o; // il bottone in UI è comunque disabilitato finché mancano EIR/POD
          return { ...o, faseOperativa: "fatturato", accessorialDaFatturare: 0, aggiornatoIl: adesso() };
        })
      );
    },
    []
  );

  const creaOrdine = useCallback(
    (input: NuovoOrdineInput): string => {
      const numeriEsistenti = ordini.map((o) => Number(o.id.replace("ORD-", ""))).filter((n) => !Number.isNaN(n));
      const prossimoNumero = (numeriEsistenti.length > 0 ? Math.max(...numeriEsistenti) : 1000) + 1;
      const nuovoId = `ORD-${prossimoNumero}`;
      const adessoIso = adesso();
      const nuovoOrdine: OrdineContainer = {
        id: nuovoId,
        cliente: input.cliente,
        containerId: input.containerId,
        tipoContainer: input.tipoContainer,
        porto: input.porto,
        terminal: input.terminal,
        tipo: input.tipo,
        richiedeReefer: input.richiedeReefer,
        richiedeAdr: input.richiedeAdr,
        readiness: {
          carrierRelease: false,
          customsRelease: false,
          terminalDisponibile: false,
          slotPrenotato: false,
          slotDataOra: null,
        },
        ultimoFreeDay: input.ultimoFreeDay,
        faseOperativa: "attesa_readiness",
        autistaId: null,
        mezzoId: null,
        oraRitiro: null,
        oraConsegna: null,
        oraRientroVuoto: null,
        attesaMinuti: null,
        accessorialDaFatturare: null,
        tariffaConcordata: input.tariffaConcordata,
        eirRaccolto: false,
        podRaccolto: false,
        creatoIl: adessoIso,
        aggiornatoIl: adessoIso,
      };
      setOrdini((prev) => [nuovoOrdine, ...prev]);
      return nuovoId;
    },
    [ordini]
  );

  const trovaOrdine = useCallback((id: string) => ordini.find((o) => o.id === id), [ordini]);

  const eccezioni = useMemo(() => rilevaEccezioniContainer(ordini, MEZZI_DEMO), [ordini]);

  const value = useMemo(
    () => ({
      ordini,
      autisti: AUTISTI_DEMO,
      mezzi: MEZZI_DEMO,
      eccezioni,
      trovaOrdine,
      creaOrdine,
      segnalaCarrierRelease,
      segnalaCustomsRelease,
      segnalaTerminalDisponibile,
      prenotaSlot,
      assegnaAutista,
      segnalaRitiro,
      segnalaConsegna,
      segnalaRientroVuoto,
      segnalaEirRaccolto,
      segnalaPodRaccolto,
      segnalaFatturato,
    }),
    [
      ordini,
      eccezioni,
      trovaOrdine,
      creaOrdine,
      segnalaCarrierRelease,
      segnalaCustomsRelease,
      segnalaTerminalDisponibile,
      prenotaSlot,
      assegnaAutista,
      segnalaRitiro,
      segnalaConsegna,
      segnalaRientroVuoto,
      segnalaEirRaccolto,
      segnalaPodRaccolto,
      segnalaFatturato,
    ]
  );

  return <ContainerContext.Provider value={value}>{children}</ContainerContext.Provider>;
}

export function useContainer() {
  const ctx = useContext(ContainerContext);
  if (!ctx) throw new Error("useContainer deve essere usato dentro <ContainerProvider>");
  return ctx;
}

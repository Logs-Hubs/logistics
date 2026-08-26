"use client";

import { useEffect, useState } from "react";
import { Bell, MapPin, Package, Navigation, CheckCircle2, Clock3, Undo2 } from "lucide-react";
import type { Spedizione, Vettore } from "@/lib/data";
import { useOperations } from "@/lib/store";
import { cn } from "@/lib/utils";

function oraCorrente() {
  return new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
}

export function DriverPhonePreview({
  spedizione,
  vettore,
  terminaleNome,
  justUpdated = false,
}: {
  spedizione: Spedizione;
  vettore: Vettore;
  terminaleNome: string;
  justUpdated?: boolean;
}) {
  const { segnalaRitiro, segnalaRientroVuoto } = useOperations();
  const [notificaMostrata, setNotificaMostrata] = useState(false);
  const [arrivatoLocale, setArrivatoLocale] = useState(false);
  const confermato = spedizione.stato === "confermato";
  const ritirato = spedizione.faseOperativa === "ritirato" || spedizione.faseOperativa === "rientro_vuoto";
  const vuotoRientrato = spedizione.faseOperativa === "rientro_vuoto";
  // se lo stato condiviso è già oltre il gate (ritirato/rientro vuoto), l'arrivo è implicito:
  // evita che un remount (es. cambio pagina) rimostri "segnala arrivo" per uno step già passato
  const arrivato = arrivatoLocale || ritirato;

  // Aggiustamenti di stato durante il render (pattern consigliato da React al posto di un Effect
  // per "adjusting state when a prop changes"): evitano un giro di render extra e il lint
  // react-hooks/set-state-in-effect, che vieta setState sincroni nel corpo di un Effect.
  const chiaveSpedizione = `${spedizione.id}:${spedizione.oraAppuntamento ?? ""}`;
  const [chiavePrecedente, setChiavePrecedente] = useState(chiaveSpedizione);
  if (chiavePrecedente !== chiaveSpedizione) {
    setChiavePrecedente(chiaveSpedizione);
    setArrivatoLocale(false); // cambio spedizione mostrata (o ri-conferma con nuovo orario)
  }

  // inizializzato a false (non a justUpdated) così un mount con justUpdated già true
  // (es. si naviga su questa pagina subito dopo aver confermato altrove) è considerato
  // comunque una "novità" e apre la notifica, invece di essere silenziosamente ignorato
  const [justUpdatedPrecedente, setJustUpdatedPrecedente] = useState(false);
  if (justUpdatedPrecedente !== justUpdated) {
    setJustUpdatedPrecedente(justUpdated);
    if (justUpdated) setNotificaMostrata(true); // appuntamento appena confermato altrove (es. dal calendario)
  }

  // auto-dismiss della notifica push simulata, sia quella automatica sia quella aperta manualmente dalla campanella
  useEffect(() => {
    if (!notificaMostrata) return;
    const t = setTimeout(() => setNotificaMostrata(false), 4500);
    return () => clearTimeout(t);
  }, [notificaMostrata]);

  return (
    <div className="relative mx-auto w-full max-w-[300px]">
      <div
        className={cn(
          "flex aspect-[9/18.5] flex-col overflow-hidden rounded-[2rem] border-8 bg-white shadow-2xl transition-colors duration-500",
          justUpdated ? "border-accent" : "border-navy-dark"
        )}
      >
        <div className="flex flex-shrink-0 items-center justify-between bg-navy-dark px-5 py-2 text-[10px] text-white/70">
          <span>9:41</span>
          <span>Movr</span>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#F7F9FA] p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted">Ciao,</p>
              <p className="text-lg font-bold text-navy">{vettore.autista}</p>
            </div>
            <button
              onClick={() => setNotificaMostrata((v) => !v)}
              className="relative rounded-full bg-white p-2.5 shadow-sm"
            >
              <Bell className="h-5 w-5 text-navy" />
              {confermato && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-accent" />}
            </button>
          </div>

          {confermato ? (
            <div className="rounded-2xl bg-navy p-5 text-white shadow-md">
              <p className="text-[11px] uppercase tracking-wide text-teal-light">Prossimo appuntamento</p>
              <p className="mt-1 text-2xl font-bold">{spedizione.oraAppuntamento}</p>
              <div className="mt-3 flex items-center gap-2 text-sm text-teal-light">
                <MapPin className="h-4 w-4" />
                {terminaleNome}
              </div>
              <div className="mt-1.5 flex items-center gap-2 text-sm text-teal-light">
                <Package className="h-4 w-4" />
                {spedizione.containerId}
              </div>

              {!arrivato && (
                <button
                  onClick={() => setArrivatoLocale(true)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-white"
                >
                  <Navigation className="h-4 w-4" />
                  Segnala arrivo al gate
                </button>
              )}

              {arrivato && !ritirato && (
                <button
                  onClick={() => segnalaRitiro(spedizione.id, oraCorrente())}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-white"
                >
                  <Package className="h-4 w-4" />
                  Segnala ritiro container
                </button>
              )}

              {ritirato && !vuotoRientrato && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500/20 py-2.5 text-xs font-semibold text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Ritirato alle {spedizione.oraRitiro}, in consegna al cliente
                  </div>
                  <button
                    onClick={() => segnalaRientroVuoto(spedizione.id, oraCorrente())}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-white"
                  >
                    <Undo2 className="h-4 w-4" />
                    Segnala rientro container vuoto
                  </button>
                </div>
              )}

              {vuotoRientrato && (
                <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-500/20 py-3 text-sm font-semibold text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                  Vuoto rientrato alle {spedizione.oraRientroVuoto}, ciclo completato
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50 p-5 text-center">
              <Clock3 className="mx-auto h-6 w-6 text-amber-500" />
              <p className="mt-2 text-sm font-semibold text-amber-800">Nessun appuntamento confermato</p>
              <p className="mt-1 text-xs text-amber-700">
                In attesa che lo spedizioniere prenoti uno slot per il container {spedizione.containerId}.
              </p>
            </div>
          )}

          <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm">
            <p className="mb-2 text-xs font-semibold text-navy">Istruzioni per il gate</p>
            <ul className="space-y-1.5 text-xs text-muted">
              <li>• Documento di trasporto + targa {vettore.targa}</li>
              <li>• Corsia merci in {spedizione.tipo === "import" ? "arrivo" : "partenza"}</li>
              <li>• Container {spedizione.containerId}</li>
            </ul>
          </div>

          <p className="mt-5 text-center text-[11px] text-muted">
            Spedizione {spedizione.id} · {spedizione.cliente}
          </p>
        </div>
      </div>

      {notificaMostrata && confermato && (
        <div className="absolute left-1/2 top-2 z-10 w-[92%] -translate-x-1/2 animate-in rounded-xl bg-white p-3.5 shadow-2xl ring-1 ring-black/5">
          <div className="flex gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent">
              <Bell className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-navy">Movr</p>
              <p className="mt-0.5 text-[11px] text-muted">{testoNotifica(spedizione, terminaleNome)}</p>
            </div>
            <button onClick={() => setNotificaMostrata(false)} className="text-[10px] text-muted">
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Riflette lo stato più avanzato raggiunto dalla spedizione: gli stadi sono monotoni
// (confermato -> ritirato -> rientro vuoto), quindi basta guardare quello più recente.
function testoNotifica(s: Spedizione, terminaleNome: string): string {
  if (s.faseOperativa === "rientro_vuoto") {
    return `Rientro container vuoto registrato alle ${s.oraRientroVuoto} presso ${terminaleNome}.`;
  }
  if (s.faseOperativa === "ritirato") {
    return `Ritiro container confermato alle ${s.oraRitiro} presso ${terminaleNome}.`;
  }
  return `Appuntamento confermato alle ${s.oraAppuntamento} presso ${terminaleNome}. Container ${s.containerId}.`;
}

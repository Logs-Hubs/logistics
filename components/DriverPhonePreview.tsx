"use client";

import { useEffect, useState } from "react";
import { Bell, MapPin, Package, Navigation, CheckCircle2, Clock3 } from "lucide-react";
import { terminalNome, type Spedizione, type Vettore } from "@/lib/data";
import { cn } from "@/lib/utils";

export function DriverPhonePreview({
  spedizione,
  vettore,
  justUpdated = false,
}: {
  spedizione: Spedizione;
  vettore: Vettore;
  justUpdated?: boolean;
}) {
  const [notificaMostrata, setNotificaMostrata] = useState(false);
  const [arrivato, setArrivato] = useState(false);
  const confermato = spedizione.stato === "confermato";

  // Aggiustamenti di stato durante il render (pattern consigliato da React al posto di un Effect
  // per "adjusting state when a prop changes"): evitano un giro di render extra e il lint
  // react-hooks/set-state-in-effect, che vieta setState sincroni nel corpo di un Effect.
  const chiaveSpedizione = `${spedizione.id}:${spedizione.oraAppuntamento ?? ""}`;
  const [chiavePrecedente, setChiavePrecedente] = useState(chiaveSpedizione);
  if (chiavePrecedente !== chiaveSpedizione) {
    setChiavePrecedente(chiaveSpedizione);
    setArrivato(false); // cambio spedizione mostrata (o ri-conferma con nuovo orario)
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
          "overflow-hidden rounded-[2rem] border-8 bg-white shadow-2xl transition-colors duration-500",
          justUpdated ? "border-accent" : "border-navy-dark"
        )}
      >
        <div className="flex items-center justify-between bg-navy-dark px-5 py-2 text-[10px] text-white/70">
          <span>9:41</span>
          <span>Port Trucking OS</span>
        </div>

        <div className="min-h-[480px] bg-[#F7F9FA] p-5">
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
                {terminalNome(spedizione.terminalId)}
              </div>
              <div className="mt-1.5 flex items-center gap-2 text-sm text-teal-light">
                <Package className="h-4 w-4" />
                {spedizione.containerId}
              </div>

              {!arrivato ? (
                <button
                  onClick={() => setArrivato(true)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-white"
                >
                  <Navigation className="h-4 w-4" />
                  Segnala arrivo al gate
                </button>
              ) : (
                <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-500/20 py-3 text-sm font-semibold text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                  Arrivo segnalato — spedizioniere avvisato
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
              <p className="text-xs font-semibold text-navy">Port Trucking OS</p>
              <p className="mt-0.5 text-[11px] text-muted">
                Appuntamento confermato alle {spedizione.oraAppuntamento} presso {terminalNome(spedizione.terminalId)}. Container{" "}
                {spedizione.containerId}.
              </p>
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

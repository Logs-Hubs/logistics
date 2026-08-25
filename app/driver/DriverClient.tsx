"use client";

import { useState } from "react";
import type { Spedizione, Vettore } from "@/lib/data";
import { Bell, MapPin, Package, Navigation, CheckCircle2 } from "lucide-react";

type Props = {
  spedizione: Spedizione;
  vettore: Vettore;
  terminalNome: string;
};

export function DriverClient({ spedizione, vettore, terminalNome }: Props) {
  const [notificaMostrata, setNotificaMostrata] = useState(false);
  const [arrivato, setArrivato] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#e9eef1] px-6 py-10">
      <div className="w-full max-w-[380px]">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-muted">
          Anteprima app driver — {vettore.autista}
        </p>

        {/* cornice telefono */}
        <div className="overflow-hidden rounded-[2rem] border-8 border-navy-dark bg-white shadow-2xl">
          {/* status bar finta */}
          <div className="flex items-center justify-between bg-navy-dark px-5 py-2 text-[10px] text-white/70">
            <span>9:41</span>
            <span>Port Trucking OS</span>
          </div>

          <div className="min-h-[560px] bg-[#F7F9FA] p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted">Ciao,</p>
                <p className="text-lg font-bold text-navy">{vettore.autista}</p>
              </div>
              <button
                onClick={() => setNotificaMostrata(true)}
                className="relative rounded-full bg-white p-2.5 shadow-sm"
              >
                <Bell className="h-5 w-5 text-navy" />
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-accent" />
              </button>
            </div>

            {/* card prossimo appuntamento */}
            <div className="rounded-2xl bg-navy p-5 text-white shadow-md">
              <p className="text-[11px] uppercase tracking-wide text-teal-light">Prossimo appuntamento</p>
              <p className="mt-1 text-2xl font-bold">{spedizione.oraAppuntamento}</p>
              <div className="mt-3 flex items-center gap-2 text-sm text-teal-light">
                <MapPin className="h-4 w-4" />
                {terminalNome}
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

            {/* istruzioni gate */}
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
      </div>

      {/* notifica push simulata */}
      {notificaMostrata && (
        <div className="fixed left-1/2 top-6 z-50 w-[92%] max-w-sm -translate-x-1/2 animate-in rounded-xl bg-white p-4 shadow-2xl ring-1 ring-black/5">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-accent">
              <Bell className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-navy">Port Trucking OS</p>
              <p className="mt-0.5 text-xs text-muted">
                Appuntamento confermato alle {spedizione.oraAppuntamento} presso {terminalNome}. Container {spedizione.containerId}.
              </p>
            </div>
            <button onClick={() => setNotificaMostrata(false)} className="text-xs text-muted">
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

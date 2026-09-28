"use client";

import Link from "next/link";
import { ArrowRight, Box, CheckCircle2, Package, ShieldAlert, Sparkles, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useContainer } from "@/lib/container/store";
import { LABEL_SEVERITA_ECCEZIONE_CONTAINER, type EccezioneContainer } from "@/lib/container/motore";
import { LABEL_FASE_ORDINE, NOME_PORTO, readinessCompleta, type OrdineContainer } from "@/lib/container/tipi";

function euro(n: number) {
  return n.toLocaleString("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

export function ContainerDashboardClient() {
  const { ordini, eccezioni } = useContainer();

  const aperti = ordini.filter((o) => o.faseOperativa !== "fatturato" && o.faseOperativa !== "vuoto_rientrato");
  const inEsecuzione = ordini.filter((o) => o.faseOperativa === "in_esecuzione").length;
  const daFatturare = ordini.reduce((s, o) => s + (o.accessorialDaFatturare ?? 0), 0);
  const critiche = eccezioni.filter((e) => e.severita === "critica").length;

  return (
    <div className="mx-auto max-w-7xl px-8 py-8">
      <header className="mb-8">
        <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-navy/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-navy">
          <Sparkles className="h-3.5 w-3.5" />
          Movr Container · AI Transport Manager per l&apos;autotrasporto container
        </p>
        <h1 className="text-2xl font-bold text-navy">Centro comando container</h1>
        <p className="mt-1 text-sm text-muted">
          Dispatcher di un&apos;azienda di autotrasporto container: dall&apos;ordine ricevuto alla fattura pronta,
          Genova · Savona-Vado · La Spezia.
        </p>
      </header>

      <AttenzioneOggi eccezioni={eccezioni} />

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
        <StatCard icon={Package} label="Ordini aperti" value={String(aperti.length)} color="text-navy" bg="bg-navy/5" />
        <StatCard icon={Truck} label="In esecuzione" value={String(inEsecuzione)} color="text-navy" bg="bg-navy/5" />
        <StatCard icon={ShieldAlert} label="Eccezioni critiche" value={String(critiche)} color="text-rose-600" bg="bg-rose-50" />
        <StatCard icon={CheckCircle2} label="Accessorial da fatturare" value={euro(daFatturare)} color="text-amber-600" bg="bg-amber-50" />
        <StatCard icon={Box} label="Ordini totali" value={String(ordini.length)} color="text-navy" bg="bg-navy/5" />
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Ordini ({ordini.length})</h2>
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-[#F7F9FA] text-left text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="px-4 py-3">Ordine</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Container</th>
                <th className="px-4 py-3">Porto</th>
                <th className="px-4 py-3">Readiness</th>
                <th className="px-4 py-3">Fase</th>
                <th className="px-4 py-3">Last free day</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {ordini.map((o) => (
                <RigaOrdine key={o.id} ordine={o} />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function RigaOrdine({ ordine }: { ordine: OrdineContainer }) {
  return (
    <tr className="border-b border-border last:border-0 hover:bg-[#F7F9FA]">
      <td className="px-4 py-3 font-medium text-navy">{ordine.id}</td>
      <td className="px-4 py-3 text-foreground">{ordine.cliente}</td>
      <td className="px-4 py-3 text-muted">
        {ordine.containerId} <span className="text-xs">({ordine.tipoContainer})</span>
      </td>
      <td className="px-4 py-3 text-muted">{NOME_PORTO[ordine.porto]}</td>
      <td className="px-4 py-3">
        <SemaforoReadiness ordine={ordine} />
      </td>
      <td className="px-4 py-3 text-muted">{LABEL_FASE_ORDINE[ordine.faseOperativa]}</td>
      <td className="px-4 py-3 text-muted">{ordine.ultimoFreeDay}</td>
      <td className="px-4 py-3 text-right">
        <Link href={`/container/ordini/${ordine.id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-teal hover:underline">
          Apri <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </td>
    </tr>
  );
}

function SemaforoReadiness({ ordine }: { ordine: OrdineContainer }) {
  const puntini: { attivo: boolean; titolo: string }[] = [
    { attivo: ordine.readiness.carrierRelease, titolo: "Carrier release" },
    { attivo: ordine.readiness.customsRelease, titolo: "Customs release" },
    { attivo: ordine.readiness.terminalDisponibile, titolo: "Terminal disponibile" },
    { attivo: ordine.readiness.slotPrenotato, titolo: "Slot prenotato" },
  ];
  return (
    <div className="flex items-center gap-1" title={readinessCompleta(ordine.readiness) ? "Readiness completa" : "Readiness incompleta"}>
      {puntini.map((p, i) => (
        <span
          key={i}
          title={p.titolo}
          className={cn("h-2.5 w-2.5 rounded-full", p.attivo ? "bg-emerald-500" : "bg-slate-200")}
        />
      ))}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className={cn("mb-2 flex h-8 w-8 items-center justify-center rounded-lg", bg)}>
        <Icon className={cn("h-4 w-4", color)} />
      </div>
      <div className="text-lg font-bold text-navy">{value}</div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );
}

function AttenzioneOggi({ eccezioni }: { eccezioni: EccezioneContainer[] }) {
  if (eccezioni.length === 0) {
    return (
      <div className="mb-8 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
        <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
        Nessuna eccezione al momento: tutti gli ordini sono sotto controllo.
      </div>
    );
  }

  return (
    <section className="mb-8">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted">
        <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
        Attenzione oggi ({eccezioni.length})
      </h2>
      <div className="space-y-2.5">
        {eccezioni.map((e) => {
          const stile = {
            critica: "border-rose-200 bg-rose-50/50",
            alta: "border-amber-200 bg-amber-50/40",
            media: "border-border bg-card",
          }[e.severita];
          const badgeStile = {
            critica: "bg-rose-600 text-white",
            alta: "bg-amber-100 text-amber-700",
            media: "bg-slate-100 text-slate-700",
          }[e.severita];
          return (
            <Link
              key={e.id}
              href={e.href}
              className={cn(
                "flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 shadow-sm transition-colors hover:border-teal/40",
                stile
              )}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", badgeStile)}>
                    {LABEL_SEVERITA_ECCEZIONE_CONTAINER[e.severita]}
                  </span>
                  <h3 className="text-sm font-semibold text-navy">{e.titolo}</h3>
                </div>
                <p className="mt-1 text-xs text-muted">{e.ragioni.join(" · ")}</p>
                <p className="mt-1 text-xs font-medium text-teal">{e.azioneConsigliata}</p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-3">
                {e.esposizioneEuro !== null && (
                  <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700">
                    {euro(e.esposizioneEuro)}
                  </span>
                )}
                <ArrowRight className="h-4 w-4 text-muted" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

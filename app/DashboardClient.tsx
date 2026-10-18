"use client";

import { useState } from "react";
import Link from "next/link";
import { daysUntil, terminalNome, vettoreById } from "@/lib/data";
import { StatoBadge } from "@/components/StatoBadge";
import { DriverPhonePreview } from "@/components/DriverPhonePreview";
import { useOperations } from "@/lib/store";
import { useCustoms } from "@/lib/customs/store";
import { rilevaEccezioni, LABEL_SEVERITA_ECCEZIONE } from "@/lib/exceptions/motore";
import type { Eccezione } from "@/lib/exceptions/tipi";
import { AlertTriangle, Ship, Clock3, CheckCircle2, Smartphone, ArrowRight, ShieldAlert, Stamp, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardClient() {
  const { spedizioni, terminals, vettori, ultimoAggiornatoId } = useOperations();
  const { casi } = useCustoms();
  const eccezioni = rilevaEccezioni(spedizioni, casi);

  const attive = spedizioni.length;
  const daPianificare = spedizioni.filter((s) => s.stato === "da_pianificare" || s.stato === "in_ritardo").length;
  const inScadenza = spedizioni.filter((s) => daysUntil(s.scadenzaDemurrage) <= 2).length;
  const confermate = spedizioni.filter((s) => s.stato === "confermato").length;

  // null finché lo spedizioniere non clicca una riga: si segue automaticamente l'ultima novità
  // (es. l'appuntamento appena confermato dal calendario), altrimenti la prima da pianificare
  const [selezionataId, setSelezionataId] = useState<string | null>(null);
  const effettivaId =
    selezionataId ??
    ultimoAggiornatoId ??
    spedizioni.find((s) => s.stato === "da_pianificare")?.id ??
    spedizioni[0].id;
  const selezionata = spedizioni.find((s) => s.id === effettivaId)!;
  const vettoreSel = vettoreById(vettori, selezionata.vettoreId)!;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 xl:px-8">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">Dashboard</p>
        <h1 className="mt-1 text-2xl font-bold text-navy">Buongiorno, ecco la situazione di oggi</h1>
        <p className="mt-1 text-sm text-muted">Lunedì 25 agosto 2026 · Genova Porto Vecchio, PSA Prà, Savona-Vado</p>
      </header>

      <AttenzioneOggi eccezioni={eccezioni} />

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={Ship} label="Spedizioni attive" value={attive} color="text-navy" bg="bg-navy/5" />
        <StatCard icon={Clock3} label="Da pianificare" value={daPianificare} color="text-amber-600" bg="bg-amber-50" />
        <StatCard icon={AlertTriangle} label="In scadenza (≤2gg)" value={inScadenza} color="text-rose-600" bg="bg-rose-50" />
        <StatCard icon={CheckCircle2} label="Appuntamenti confermati" value={confermate} color="text-emerald-600" bg="bg-emerald-50" />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {terminals.map((t) => (
          <span key={t.id} className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-muted">
            {t.breve}
          </span>
        ))}
      </div>

      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div
          aria-label="Spedizioni attive; scorri orizzontalmente per vedere tutte le colonne"
          className="min-w-0 overflow-x-auto rounded-xl border border-border bg-card shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          role="region"
          tabIndex={0}
        >
          <table className="w-full min-w-[920px] whitespace-nowrap text-left text-sm">
            <thead className="border-b border-border bg-[#F7F9FA] text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-3 font-medium">Spedizione</th>
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-5 py-3 font-medium">Container</th>
                <th className="px-5 py-3 font-medium">Terminal</th>
                <th className="px-5 py-3 font-medium">Vettore</th>
                <th className="px-5 py-3 font-medium">Scadenza</th>
                <th className="px-5 py-3 font-medium">Stato</th>
              </tr>
            </thead>
            <tbody>
              {spedizioni.map((s) => {
                const vettore = vettoreById(vettori, s.vettoreId);
                const gg = daysUntil(s.scadenzaDemurrage);
                const attiva = s.id === effettivaId;
                return (
                  <tr
                    key={s.id}
                    onClick={() => setSelezionataId(s.id)}
                    className={cn(
                      "cursor-pointer border-b border-border last:border-0 hover:bg-[#FAFBFC]",
                      attiva && "bg-teal/5"
                    )}
                    title="Mostra cosa vede l'autista per questa spedizione"
                  >
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/spedizioni/${s.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-semibold text-navy hover:underline"
                      >
                        {s.id}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-foreground">{s.cliente}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-muted">{s.containerId}</td>
                    <td className="px-5 py-3.5 text-foreground">{terminalNome(terminals, s.terminalId)}</td>
                    <td className="px-5 py-3.5 text-foreground">{vettore?.nome}</td>
                    <td className="px-5 py-3.5">
                      <span className={gg <= 1 ? "font-semibold text-rose-600" : gg <= 3 ? "font-semibold text-amber-600" : "text-muted"}>
                        {gg <= 0 ? "Scaduto" : `tra ${gg} gg`}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatoBadge stato={s.stato} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <aside className="lg:sticky lg:top-8 lg:self-start">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
              <Smartphone className="h-3.5 w-3.5" />
              Cosa vede l&apos;autista ora
            </div>
            <p className="mb-4 text-xs text-muted">
              {vettoreSel.autista} · {vettoreSel.nome}. Clicca una riga per cambiare spedizione.
            </p>

            <DriverPhonePreview
              spedizione={selezionata}
              vettore={vettoreSel}
              terminaleNome={terminalNome(terminals, selezionata.terminalId)}
              justUpdated={ultimoAggiornatoId === selezionata.id}
            />

            {selezionata.stato !== "confermato" && (
              <Link
                href="/calendario"
                className="mt-4 flex items-center justify-center gap-1.5 rounded-lg bg-navy px-4 py-2.5 text-xs font-semibold text-white hover:bg-navy-dark"
              >
                Prenota il suo appuntamento
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </aside>
      </div>
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
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  bg: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg ${bg}`}>
        <Icon className={`h-4.5 w-4.5 ${color}`} />
      </div>
      <div className="text-2xl font-bold text-navy">{value}</div>
      <div className="mt-0.5 text-xs text-muted">{label}</div>
    </div>
  );
}

const ICONA_CATEGORIA: Record<Eccezione["categorie"][number], React.ElementType> = {
  dogana: Stamp,
  demurrage: AlertTriangle,
  appuntamento: CalendarClock,
};

function euro(n: number) {
  return n.toLocaleString("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

// Correla i segnali già calcolati in Porti (demurrage, appuntamento) e in Dogana (blocchi aperti)
// in un'unica lista prioritizzata: non un'altra dashboard da controllare, la prima cosa da guardare.
function AttenzioneOggi({ eccezioni }: { eccezioni: Eccezione[] }) {
  if (eccezioni.length === 0) {
    return (
      <div className="mb-8 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
        <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
        Nessuna spedizione o caso doganale richiede attenzione immediata.
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
              className={cn("flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 shadow-sm transition-colors hover:border-teal/40", stile)}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", badgeStile)}>
                    {LABEL_SEVERITA_ECCEZIONE[e.severita]}
                  </span>
                  <h3 className="text-sm font-semibold text-navy">{e.titolo}</h3>
                  <span className="flex items-center gap-1">
                    {e.categorie.map((c) => {
                      const Icon = ICONA_CATEGORIA[c];
                      return <Icon key={c} className="h-3.5 w-3.5 text-muted" />;
                    })}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">{e.ragioni.join(" · ")}</p>
                <p className="mt-1 text-xs font-medium text-teal">{e.azioneConsigliata}</p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-3">
                {e.esposizioneEuro !== null && (
                  <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700">
                    {euro(e.esposizioneEuro)} stimati
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

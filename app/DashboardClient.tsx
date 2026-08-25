"use client";

import { useState } from "react";
import Link from "next/link";
import { terminalNome, vettoreById } from "@/lib/data";
import { StatoBadge } from "@/components/StatoBadge";
import { DriverPhonePreview } from "@/components/DriverPhonePreview";
import { useOperations } from "@/lib/store";
import { AlertTriangle, Ship, Clock3, CheckCircle2, Smartphone, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

function daysUntil(dateStr: string) {
  const target = new Date(dateStr + "T00:00:00");
  const today = new Date("2026-08-25T00:00:00");
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function DashboardClient() {
  const { spedizioni, terminals, vettori, ultimoAggiornatoId } = useOperations();

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
    <div className="mx-auto max-w-7xl px-8 py-8">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">Dashboard</p>
        <h1 className="mt-1 text-2xl font-bold text-navy">Buongiorno, ecco la situazione di oggi</h1>
        <p className="mt-1 text-sm text-muted">Lunedì 25 agosto 2026 · Genova Porto Vecchio, PSA Prà, Savona-Vado</p>
      </header>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={Ship} label="Spedizioni attive" value={attive} color="text-navy" bg="bg-navy/5" />
        <StatCard icon={Clock3} label="Da pianificare" value={daPianificare} color="text-amber-600" bg="bg-amber-50" />
        <StatCard icon={AlertTriangle} label="In scadenza (≤2gg)" value={inScadenza} color="text-rose-600" bg="bg-rose-50" />
        <StatCard icon={CheckCircle2} label="Appuntamenti confermati" value={confermate} color="text-emerald-600" bg="bg-emerald-50" />
      </div>

      <div className="mb-4 flex items-center gap-2">
        {terminals.map((t) => (
          <span key={t.id} className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-muted">
            {t.breve}
          </span>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full text-left text-sm">
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

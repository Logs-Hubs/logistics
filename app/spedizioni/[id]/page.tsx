import { terminalNome, vettoreById, timelineSpedizione } from "@/lib/data";
import { getSpedizione, getSpedizioni, getTerminals, getVettori } from "@/lib/queries";
import { StatoBadge } from "@/components/StatoBadge";
import { notFound } from "next/navigation";
import { CheckCircle2, Circle, Truck, Package, AlertCircle } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SpedizionePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [spedizione, SPEDIZIONI, TERMINALS, VETTORI] = await Promise.all([
    getSpedizione(id),
    getSpedizioni(),
    getTerminals(),
    getVettori(),
  ]);
  if (!spedizione) notFound();

  const vettore = vettoreById(VETTORI, spedizione.vettoreId);
  const timeline = timelineSpedizione(spedizione);

  return (
    <div className="mx-auto max-w-4xl px-8 py-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-accent">Tracking spedizione</p>
      <div className="mt-1 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-navy">{spedizione.id}</h1>
        <StatoBadge stato={spedizione.stato} />
      </div>
      <p className="mt-1 text-sm text-muted">
        {spedizione.cliente} · {terminalNome(TERMINALS, spedizione.terminalId)}
      </p>

      {/* selettore rapido altre spedizioni */}
      <div className="mt-4 flex flex-wrap gap-2">
        {SPEDIZIONI.map((s) => (
          <Link
            key={s.id}
            href={`/spedizioni/${s.id}`}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              s.id === id ? "border-navy bg-navy text-white" : "border-border bg-white text-muted hover:bg-[#F7F9FA]"
            }`}
          >
            {s.id}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* dettagli laterali */}
        <div className="space-y-4 md:col-span-1">
          <InfoCard
            icon={Package}
            titolo="Container"
            righe={[
              ["ID container", spedizione.containerId],
              ["Merce", spedizione.merce],
              ["Tipo", spedizione.tipo === "import" ? "Import" : "Export"],
            ]}
          />
          <InfoCard
            icon={Truck}
            titolo="Vettore assegnato"
            righe={[
              ["Azienda", vettore?.nome ?? "—"],
              ["Autista", vettore?.autista ?? "—"],
              ["Targa mezzo", vettore?.targa ?? "—"],
              ["Telefono", vettore?.telefono ?? "—"],
            ]}
          />
          {spedizione.stato === "in_ritardo" && (
            <div className="flex gap-2.5 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <div>
                <span className="font-semibold">Rischio demurrage.</span> Nessuno slot ancora prenotato per questo container. Vai al{" "}
                <Link href="/calendario" className="underline">
                  calendario
                </Link>{" "}
                per fissare un appuntamento.
              </div>
            </div>
          )}
        </div>

        {/* timeline */}
        <div className="md:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-5 text-sm font-semibold text-navy">Ciclo di vita della spedizione</h2>
            <ol className="relative space-y-0">
              {timeline.map((ev, i) => (
                <li key={ev.step} className="relative flex gap-4 pb-7 last:pb-0">
                  {i < timeline.length - 1 && (
                    <span
                      className={`absolute left-[11px] top-6 h-full w-px ${
                        ev.completato ? "bg-teal" : "bg-border"
                      }`}
                    />
                  )}
                  <span className="relative z-10 mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white">
                    {ev.completato ? (
                      <CheckCircle2 className="h-6 w-6 text-teal" />
                    ) : ev.attuale ? (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-accent">
                        <span className="h-2 w-2 rounded-full bg-accent" />
                      </span>
                    ) : (
                      <Circle className="h-6 w-6 text-border" />
                    )}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm font-medium ${ev.completato || ev.attuale ? "text-foreground" : "text-muted"}`}>
                        {ev.label}
                      </span>
                      <span className="whitespace-nowrap text-xs text-muted">{ev.dataOra}</span>
                    </div>
                    {ev.note && (
                      <p className="mt-1 text-xs text-amber-700">{ev.note}</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  titolo,
  righe,
}: {
  icon: React.ElementType;
  titolo: string;
  righe: [string, string][];
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-navy">
        <Icon className="h-4 w-4 text-teal" />
        {titolo}
      </div>
      <dl className="space-y-2">
        {righe.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-2 text-xs">
            <dt className="text-muted">{k}</dt>
            <dd className="text-right font-medium text-foreground">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

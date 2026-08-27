"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Ship,
  Package,
  Building2,
  FileText,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  MessageCircleQuestion,
  Stamp,
  Send,
  Pencil,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useOperations } from "@/lib/store";
import { useCustoms } from "@/lib/customs/store";
import {
  calcolaReadiness,
  fasciaReadiness,
  spiegaBlocco,
  statoDaReadiness,
  LABEL_STATO,
  LABEL_SEVERITA,
  LABEL_TIPO_DOCUMENTO,
  generaBozzaRichiesta,
  rispostaCopilot,
  DOMANDE_COPILOT_BASE,
} from "@/lib/customs/motore";
import type { CasoDoganale, ProblemaValidazione, VoceMerce } from "@/lib/customs/tipi";

function euro(n: number | null) {
  if (n === null) return "—";
  return n.toLocaleString("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

export function CustomsCaseClient({ id }: { id: string }) {
  const { casi, risolviProblema, approvaClassificazione, modificaClassificazione, registraRichiestaInformazioni } = useCustoms();
  const { spedizioni } = useOperations();
  const [richiestaAperta, setRichiestaAperta] = useState<ProblemaValidazione | null>(null);
  const [bozzaGenerata, setBozzaGenerata] = useState(false);
  const [rispostaAI, setRispostaAI] = useState<{ domanda: string; risposta: string } | null>(null);

  const caso = casi.find((c) => c.id === id);

  if (!caso) {
    return (
      <div className="mx-auto max-w-4xl px-8 py-8">
        <p className="text-sm text-muted">Caso doganale {id} non trovato.</p>
        <Link href="/customs" className="mt-2 inline-flex items-center gap-1.5 text-sm text-teal hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" />
          Torna ai casi doganali
        </Link>
      </div>
    );
  }

  const spedizione = caso.spedizioneId ? spedizioni.find((s) => s.id === caso.spedizioneId) : undefined;
  const score = calcolaReadiness(caso);
  const fascia = fasciaReadiness(score);
  const motiviBlocco = spiegaBlocco(caso);
  const statoVisualizzato = statoDaReadiness(caso);
  const problemiAperti = caso.problemi.filter((p) => p.stato === "aperto");
  const barraColore = { buono: "bg-emerald-500", medio: "bg-teal", attenzione: "bg-amber-500", bloccato: "bg-rose-500" }[fascia.tono];

  return (
    <div className="mx-auto max-w-6xl px-8 py-8">
      <Link href="/customs" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-navy">
        <ArrowLeft className="h-3.5 w-3.5" />
        Casi doganali
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-navy">{caso.riferimento}</h1>
        <StatoCasoBadge stato={statoVisualizzato} />
        {spedizione && (
          <Link
            href={`/spedizioni/${spedizione.id}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-2.5 py-1 text-xs font-medium text-teal hover:bg-teal/20"
          >
            <Ship className="h-3 w-3" />
            Spedizione {spedizione.id}
          </Link>
        )}
      </div>
      <p className="mt-1 text-sm text-muted">
        {caso.importatore.nome} ← {caso.esportatore.nome} · {caso.trasporto.container.join(", ") || "container non ancora noto"}
      </p>

      {/* selettore rapido altri casi */}
      <div className="mt-4 flex flex-wrap gap-2">
        {casi.map((c) => (
          <Link
            key={c.id}
            href={`/customs/${c.id}`}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium",
              c.id === id ? "border-navy bg-navy text-white" : "border-border bg-white text-muted hover:bg-[#F7F9FA]"
            )}
          >
            {c.riferimento}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          {/* PANORAMICA */}
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Panoramica</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <InfoCard icon={Building2} titolo="Importatore" righe={parteRighe(caso.importatore)} />
              <InfoCard icon={Building2} titolo="Esportatore" righe={parteRighe(caso.esportatore)} />
              <InfoCard
                icon={Package}
                titolo="Trasporto"
                righe={[
                  ["Modalità", caso.trasporto.modalita],
                  ["Bill of lading", caso.trasporto.billOfLading ?? "—"],
                  ["Nave / viaggio", [caso.trasporto.nave, caso.trasporto.viaggio].filter(Boolean).join(" · ") || "—"],
                  ["Porto imbarco → sbarco", `${caso.trasporto.portoImbarco ?? "—"} → ${caso.trasporto.portoSbarco ?? "—"}`],
                  ["Container", caso.trasporto.container.join(", ") || "—"],
                ]}
              />
              <InfoCard
                icon={Ship}
                titolo="Collegamento operativo"
                righe={[
                  ["Spedizione Porti", spedizione?.id ?? "Non ancora collegata"],
                  ["Fase operativa", spedizione ? (spedizione.faseOperativa ?? "in attesa di ritiro") : "—"],
                ]}
              />
            </div>
          </section>

          {/* MERCI */}
          <section id="merci">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Merci ({caso.merci.length})</h2>
            <div className="space-y-3">
              {caso.merci.map((m) => (
                <VoceMerceCard
                  key={m.id}
                  merce={m}
                  onApprova={() => approvaClassificazione(caso.id, m.id)}
                  onModifica={(nuovoHs) => modificaClassificazione(caso.id, m.id, nuovoHs)}
                />
              ))}
            </div>
          </section>

          {/* DOCUMENTI */}
          <section id="documenti">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Documenti ({caso.documenti.length})</h2>
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-[#F7F9FA] text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Documento</th>
                    <th className="px-4 py-2.5 font-medium">Tipo</th>
                    <th className="px-4 py-2.5 font-medium">Stato</th>
                    <th className="px-4 py-2.5 font-medium">Confidenza</th>
                  </tr>
                </thead>
                <tbody>
                  {caso.documenti.map((d) => (
                    <tr key={d.id} className="border-b border-border last:border-0">
                      <td className={cn("px-4 py-2.5", d.stato === "mancante" ? "italic text-muted" : "text-foreground")}>{d.nome}</td>
                      <td className="px-4 py-2.5 text-muted">{LABEL_TIPO_DOCUMENTO[d.tipo]}</td>
                      <td className="px-4 py-2.5">
                        <DocumentoStatoBadge stato={d.stato} />
                      </td>
                      <td className="px-4 py-2.5">
                        {d.confidenza === null ? (
                          <span className="text-muted">—</span>
                        ) : (
                          <span className={d.confidenza < 85 ? "font-medium text-amber-600" : "text-muted"}>{d.confidenza}%</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* VALIDAZIONE */}
          <section id="validazione">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
              Validazione — problemi aperti ({problemiAperti.length})
            </h2>
            {problemiAperti.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted">
                Nessun problema aperto: tutti i controlli automatici sono passati.
              </div>
            ) : (
              <div className="space-y-3">
                {problemiAperti.map((p) => (
                  <ProblemaCard
                    key={p.id}
                    problema={p}
                    onRisolvi={() => risolviProblema(caso.id, p.id)}
                    onRichiediInfo={() => setRichiestaAperta(p)}
                  />
                ))}
              </div>
            )}
            {caso.problemi.some((p) => p.stato === "risolto") && (
              <div className="mt-3 space-y-2">
                {caso.problemi
                  .filter((p) => p.stato === "risolto")
                  .map((p) => (
                    <div key={p.id} className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-xs text-muted">
                      <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-emerald-600" />
                      <span className="line-through">{p.titolo}</span>
                      <span>— risolto</span>
                    </div>
                  ))}
              </div>
            )}
          </section>

          {/* DATI DOGANALI */}
          <section id="dati-doganali">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Dati doganali</h2>
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm md:grid-cols-3">
                <Campo k="Incoterm" v={caso.datiDoganali.incoterm ?? "—"} />
                <Campo k="Regime doganale" v={caso.datiDoganali.regimeDoganale ?? "—"} />
                <Campo k="Paese di origine" v={caso.datiDoganali.paeseOrigine ?? "—"} />
                <Campo
                  k="Origine preferenziale"
                  v={caso.datiDoganali.originePreferenziale === null ? "—" : caso.datiDoganali.originePreferenziale ? "Sì" : "No"}
                />
                <Campo k="Valore doganale" v={euro(caso.datiDoganali.valoreDoganale)} />
                <Campo k="Dazio stimato" v={euro(caso.datiDoganali.dazioStimato)} />
                <Campo k="IVA stimata" v={euro(caso.datiDoganali.ivaStimata)} />
              </dl>

              <div className="mt-5 border-t border-border pt-4">
                {bozzaGenerata ? (
                  <p className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    Bozza dichiarazione generata (demo) — nessuna integrazione reale con la dogana in questa fase.
                  </p>
                ) : (
                  <button
                    onClick={() => setBozzaGenerata(true)}
                    disabled={score < 100}
                    title={score < 100 ? "Completa il caso (readiness 100) prima di generare la bozza" : undefined}
                    className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-dark disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Stamp className="h-4 w-4" />
                    Crea bozza dichiarazione
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* ATTIVITÀ */}
          <section id="attivita">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Attività</h2>
            <ol className="space-y-3">
              {caso.attivita.map((a) => (
                <li key={a.id} className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-2.5 text-xs">
                  <span className={cn("mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full", a.fonte === "ai" ? "bg-teal" : a.fonte === "operatore" ? "bg-accent" : "bg-muted")} />
                  <span className="text-foreground">{a.testo}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* SIDEBAR: readiness + copilot */}
        <aside className="space-y-4 lg:sticky lg:top-8 lg:self-start">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">Readiness</p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-4xl font-bold text-navy">{score}</span>
              <span className="text-sm text-muted">/100</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-border">
              <div className={cn("h-full rounded-full transition-all", barraColore)} style={{ width: `${score}%` }} />
            </div>
            <p className="mt-2 text-sm font-medium text-foreground">{fascia.label}</p>
            {motiviBlocco.length > 0 ? (
              <ul className="mt-3 space-y-1.5">
                {motiviBlocco.map((m) => (
                  <li key={m} className="flex items-start gap-1.5 text-xs text-muted">
                    <AlertTriangle className="mt-0.5 h-3 w-3 flex-shrink-0 text-amber-500" />
                    {m}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 flex items-center gap-1.5 text-xs text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Niente blocca questo caso.
              </p>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-navy">
              <MessageCircleQuestion className="h-4 w-4 text-accent" />
              Copilot doganale
            </h2>
            <div className="space-y-1.5">
              {DOMANDE_COPILOT_BASE.map((d) => (
                <button
                  key={d}
                  onClick={() => setRispostaAI({ domanda: d, risposta: rispostaCopilot(d, caso) })}
                  className="w-full rounded-lg border border-border px-3 py-2 text-left text-xs text-foreground hover:bg-[#F7F9FA]"
                >
                  {d}
                </button>
              ))}
            </div>
            {rispostaAI && (
              <div className="mt-4 rounded-lg bg-navy p-4 text-xs leading-relaxed text-teal-light">
                <p className="mb-1.5 font-semibold text-white">{rispostaAI.domanda}</p>
                {rispostaAI.risposta}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-5 text-xs text-muted shadow-sm">
            <p className="mb-1.5 flex items-center gap-1.5 font-semibold text-navy">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Suggerimenti IA vs dati approvati
            </p>
            <p>
              I codici HS suggeriti e i campi estratti dai documenti restano etichettati come tali finché un operatore non li approva
              esplicitamente: nessun dato entra nella bozza di dichiarazione senza revisione umana.
            </p>
          </div>
        </aside>
      </div>

      {richiestaAperta && (
        <ModaleRichiesta
          caso={caso}
          problema={richiestaAperta}
          onChiudi={() => setRichiestaAperta(null)}
          onSegnata={() => {
            registraRichiestaInformazioni(caso.id, richiestaAperta.id);
            setRichiestaAperta(null);
          }}
        />
      )}
    </div>
  );
}

function parteRighe(p: CasoDoganale["importatore"]): [string, string][] {
  return [
    ["Ragione sociale", p.nome],
    ["Paese", p.paese ?? "—"],
    ["Partita IVA", p.partitaIva ?? "—"],
    ["EORI", p.eori ?? "—"],
  ];
}

function InfoCard({ icon: Icon, titolo, righe }: { icon: React.ElementType; titolo: string; righe: [string, string][] }) {
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

function Campo({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-xs text-muted">{k}</dt>
      <dd className="font-medium text-foreground">{v}</dd>
    </div>
  );
}

function StatoCasoBadge({ stato }: { stato: CasoDoganale["stato"] }) {
  const classi: Record<CasoDoganale["stato"], string> = {
    raccolta_documenti: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
    elaborazione: "bg-teal/10 text-teal ring-1 ring-teal/20",
    revisione_necessaria: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    bloccato: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
    pronto_per_dogana: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    inviato: "bg-navy/10 text-navy ring-1 ring-navy/20",
    sdoganato: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", classi[stato])}>
      {LABEL_STATO[stato]}
    </span>
  );
}

function DocumentoStatoBadge({ stato }: { stato: string }) {
  if (stato === "mancante") return <span className="text-xs font-medium text-rose-600">Mancante</span>;
  if (stato === "da_rivedere") return <span className="text-xs font-medium text-amber-600">Da rivedere</span>;
  if (stato === "approvato") return <span className="text-xs font-medium text-emerald-700">Approvato</span>;
  if (stato === "estratto") return <span className="text-xs font-medium text-teal">Estratto</span>;
  return <span className="text-xs font-medium text-muted">In elaborazione</span>;
}

function ProblemaCard({
  problema,
  onRisolvi,
  onRichiediInfo,
}: {
  problema: ProblemaValidazione;
  onRisolvi: () => void;
  onRichiediInfo: () => void;
}) {
  const puoChiedereInfo = ["documento_mancante", "dato_mancante", "origine", "valore", "requisito_doganale"].includes(problema.categoria);
  const stile = {
    bloccante: "border-rose-200 bg-rose-50/40",
    errore: "border-rose-200 bg-rose-50/20",
    attenzione: "border-amber-200 bg-amber-50/30",
    info: "border-border bg-card",
  }[problema.severita];
  const badgeStile = {
    bloccante: "bg-rose-600 text-white",
    errore: "bg-rose-100 text-rose-700",
    attenzione: "bg-amber-100 text-amber-700",
    info: "bg-slate-100 text-slate-700",
  }[problema.severita];

  return (
    <div className={cn("rounded-xl border p-4 shadow-sm", stile)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", badgeStile)}>{LABEL_SEVERITA[problema.severita]}</span>
            <h3 className="text-sm font-semibold text-navy">{problema.titolo}</h3>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">{problema.descrizione}</p>
          {problema.azioneSuggerita && (
            <p className="mt-1.5 flex items-start gap-1.5 text-xs text-foreground">
              <AlertCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-teal" />
              {problema.azioneSuggerita}
            </p>
          )}
        </div>
      </div>
      <div className="mt-3 flex justify-end gap-2">
        {puoChiedereInfo && (
          <button
            onClick={onRichiediInfo}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-navy hover:bg-[#F7F9FA]"
          >
            <Send className="h-3 w-3" />
            Richiedi informazioni
          </button>
        )}
        <button onClick={onRisolvi} className="rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-dark">
          Segna come risolto
        </button>
      </div>
    </div>
  );
}

function VoceMerceCard({
  merce,
  onApprova,
  onModifica,
}: {
  merce: VoceMerce;
  onApprova: () => void;
  onModifica: (nuovoHs: string) => void;
}) {
  const [inModifica, setInModifica] = useState(false);
  const [valore, setValore] = useState(merce.hsCodeSuggerito ?? "");

  const approvata = merce.statoClassificazione === "approvata";

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-navy">{merce.descrizione}</h3>
          <p className="mt-1 text-xs text-muted">
            {merce.quantita ?? "—"} {merce.unita ?? ""} · peso lordo {merce.pesoLordoKg ?? "—"} kg · origine {merce.paeseOrigine ?? "—"} · valore{" "}
            {merce.valoreDichiarato ? euro(merce.valoreDichiarato) : "—"}
          </p>
        </div>
        <span
          className={cn(
            "flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
            approvata ? "bg-emerald-50 text-emerald-700" : merce.statoClassificazione === "non_avviata" ? "bg-slate-100 text-slate-600" : "bg-amber-50 text-amber-700"
          )}
        >
          {approvata ? "HS approvato" : merce.statoClassificazione === "non_avviata" ? "Classificazione non avviata" : "HS da rivedere"}
        </span>
      </div>

      <div className="mt-4 rounded-lg bg-[#F7F9FA] p-4">
        {merce.hsCodeSuggerito ? (
          <>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-mono font-semibold text-navy">
                {approvata ? merce.hsCodeApprovato : merce.hsCodeSuggerito}
              </span>
              <span className="text-xs text-muted">suggerito dall&apos;IA, confidenza {merce.hsConfidenza}%</span>
            </div>
            {merce.hsMotivazione && <p className="mt-1.5 text-xs text-muted">{merce.hsMotivazione}</p>}
            {!approvata && !inModifica && (
              <div className="mt-3 flex gap-2">
                <button onClick={onApprova} className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-dark">
                  <CheckCircle2 className="h-3 w-3" />
                  Approva
                </button>
                <button
                  onClick={() => setInModifica(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-navy hover:bg-[#F7F9FA]"
                >
                  <Pencil className="h-3 w-3" />
                  Modifica
                </button>
              </div>
            )}
            {inModifica && (
              <div className="mt-3 flex items-center gap-2">
                <input
                  value={valore}
                  onChange={(e) => setValore(e.target.value)}
                  className="rounded-lg border border-border px-2.5 py-1.5 font-mono text-xs"
                />
                <button
                  onClick={() => {
                    onModifica(valore);
                    setInModifica(false);
                  }}
                  className="rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-dark"
                >
                  Salva
                </button>
                <button onClick={() => setInModifica(false)} className="text-xs text-muted hover:text-navy">
                  Annulla
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-xs text-muted">Dati insufficienti per una classificazione HS: mancano ancora documenti su questa voce.</p>
        )}
      </div>
    </div>
  );
}

function ModaleRichiesta({
  caso,
  problema,
  onChiudi,
  onSegnata,
}: {
  caso: CasoDoganale;
  problema: ProblemaValidazione;
  onChiudi: () => void;
  onSegnata: () => void;
}) {
  const testo = generaBozzaRichiesta(caso, problema);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-dark/40 p-4" onClick={onChiudi}>
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-navy">
          <FileText className="h-4 w-4 text-teal" />
          Bozza richiesta informazioni
        </div>
        <p className="mb-3 text-xs text-muted">
          Testo generato automaticamente su {problema.titolo.toLowerCase()}. Per il prototipo resta una bozza: copiala e inviala dal
          tuo client email, non parte nulla da qui.
        </p>
        <pre className="max-h-72 overflow-y-auto whitespace-pre-wrap rounded-lg border border-border bg-[#F7F9FA] p-4 text-xs leading-relaxed text-foreground">
          {testo}
        </pre>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onChiudi} className="rounded-lg border border-border bg-white px-4 py-2 text-xs font-semibold text-navy hover:bg-[#F7F9FA]">
            Chiudi
          </button>
          <button onClick={onSegnata} className="rounded-lg bg-navy px-4 py-2 text-xs font-semibold text-white hover:bg-navy-dark">
            Segna come richiesta
          </button>
        </div>
      </div>
    </div>
  );
}

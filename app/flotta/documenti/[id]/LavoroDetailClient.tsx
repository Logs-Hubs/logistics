"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Truck, User, CheckCircle2, AlertTriangle, Send, MessageCircleQuestion, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDocumentiTrasporto } from "@/lib/flotta/documenti/store";
import {
  calcolaStatoFatturazione,
  spiegaBlocco,
  LABEL_STATO_FATTURAZIONE,
  LABEL_TIPO_DOCUMENTO,
  DOMANDE_COPILOT_BASE,
  rispostaCopilot,
  generaBozzaSollecito,
} from "@/lib/flotta/documenti/motore";
import type { DocumentoTrasporto, LavoroTrasporto, TipoDocumentoTrasporto } from "@/lib/flotta/documenti/tipi";

function euro(n: number) {
  return n.toLocaleString("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

export function LavoroDetailClient({ id }: { id: string }) {
  const { lavori, validaDocumento, confermaTariffa, segnaFatturato, registraSollecito } = useDocumentiTrasporto();
  const [sollecitoAperto, setSollecitoAperto] = useState<TipoDocumentoTrasporto | null>(null);
  const [tariffaInput, setTariffaInput] = useState("");
  const [rispostaAI, setRispostaAI] = useState<{ domanda: string; risposta: string } | null>(null);

  const lavoro = lavori.find((l) => l.id === id);

  if (!lavoro) {
    return (
      <div className="mx-auto max-w-4xl px-8 py-8">
        <p className="text-sm text-muted">Lavoro di trasporto {id} non trovato.</p>
        <Link href="/flotta/documenti" className="mt-2 inline-flex items-center gap-1.5 text-sm text-teal hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" />
          Torna ai documenti trasporto
        </Link>
      </div>
    );
  }

  const stato = calcolaStatoFatturazione(lavoro);
  const motivi = spiegaBlocco(lavoro);
  const badgeStile = {
    non_completo: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
    documenti_mancanti: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
    tariffa_da_verificare: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    pronto_fatturazione: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    fatturato: "bg-navy/10 text-navy ring-1 ring-navy/20",
  }[stato];

  return (
    <div className="mx-auto max-w-4xl px-8 py-8">
      <Link href="/flotta/documenti" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-navy">
        <ArrowLeft className="h-3.5 w-3.5" />
        Documenti trasporto
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-navy">{lavoro.riferimento}</h1>
        <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", badgeStile)}>
          {LABEL_STATO_FATTURAZIONE[stato]}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted">
        {lavoro.clienteNome} · {lavoro.ritiroCitta} → {lavoro.consegnaCitta}
        {lavoro.tariffaConcordata !== null && ` · ${euro(lavoro.tariffaConcordata)}`}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {lavori.map((l) => (
          <Link
            key={l.id}
            href={`/flotta/documenti/${l.id}`}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium",
              l.id === id ? "border-navy bg-navy text-white" : "border-border bg-white text-muted hover:bg-[#F7F9FA]"
            )}
          >
            {l.riferimento}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="space-y-4 md:col-span-1">
          <InfoCard
            icon={Truck}
            titolo="Mezzo e ordine"
            righe={[
              ["Ordine collegato", lavoro.ordineId ?? "Non ancora collegato"],
              ["Mezzo", lavoro.mezzoId ?? "—"],
              ["Consegna", lavoro.dataConsegna ?? "In corso"],
            ]}
          />
          <InfoCard icon={User} titolo="Autista" righe={[["Autista", lavoro.autistaId ?? "—"]]} />

          {stato === "tariffa_da_verificare" && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-5 shadow-sm">
              <p className="mb-2 text-sm font-semibold text-navy">Conferma la tariffa</p>
              <div className="flex items-center gap-2">
                <input
                  value={tariffaInput}
                  onChange={(e) => setTariffaInput(e.target.value)}
                  placeholder="EUR"
                  inputMode="numeric"
                  className="w-24 rounded-lg border border-border px-2.5 py-1.5 text-xs"
                />
                <button
                  onClick={() => {
                    const v = Number(tariffaInput);
                    if (!Number.isNaN(v) && v > 0) confermaTariffa(lavoro.id, v);
                  }}
                  className="rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-dark"
                >
                  Conferma
                </button>
              </div>
            </div>
          )}

          {stato === "pronto_fatturazione" && (
            <button
              onClick={() => segnaFatturato(lavoro.id)}
              className="w-full rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-dark"
            >
              Segna come fatturato
            </button>
          )}
        </div>

        <div className="space-y-6 md:col-span-2">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent">Stato fatturazione</p>
            {motivi.length === 0 ? (
              <p className="flex items-center gap-1.5 text-sm text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                Niente blocca questo lavoro.
              </p>
            ) : (
              <ul className="space-y-1.5">
                {motivi.map((m) => (
                  <li key={m} className="flex items-start gap-1.5 text-sm text-rose-600">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                    {m}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Documenti ({lavoro.documenti.length})</h2>
            <div className="space-y-3">
              {lavoro.documenti.map((d) => (
                <DocumentoRow
                  key={d.id}
                  documento={d}
                  onValida={() => validaDocumento(lavoro.id, d.id)}
                  onSollecita={() => setSollecitoAperto(d.tipo)}
                />
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Attività</h2>
            <ol className="space-y-2">
              {lavoro.attivita.map((a) => (
                <li key={a.id} className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-2.5 text-xs">
                  <span className={cn("mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full", a.fonte === "ai" ? "bg-teal" : a.fonte === "operatore" ? "bg-accent" : "bg-muted")} />
                  <span className="text-foreground">{a.testo}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-navy">
              <MessageCircleQuestion className="h-4 w-4 text-accent" />
              Copilot
            </h2>
            <div className="space-y-1.5">
              <button
                onClick={() =>
                  setRispostaAI({
                    domanda: "Cosa serve per sbloccare questo lavoro?",
                    risposta: rispostaCopilot("Cosa serve per sbloccare questo lavoro?", lavori, lavoro),
                  })
                }
                className="w-full rounded-lg border border-border px-3 py-2 text-left text-xs text-foreground hover:bg-[#F7F9FA]"
              >
                Cosa serve per sbloccare questo lavoro?
              </button>
              {DOMANDE_COPILOT_BASE.filter((d) => d !== "Cosa serve per sbloccare questo lavoro?").map((d) => (
                <button
                  key={d}
                  onClick={() => setRispostaAI({ domanda: d, risposta: rispostaCopilot(d, lavori, lavoro) })}
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
        </div>
      </div>

      {sollecitoAperto && (
        <ModaleSollecito
          lavoro={lavoro}
          tipo={sollecitoAperto}
          onChiudi={() => setSollecitoAperto(null)}
          onSegnato={() => {
            registraSollecito(lavoro.id, sollecitoAperto);
            setSollecitoAperto(null);
          }}
        />
      )}
    </div>
  );
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

function DocumentoRow({ documento, onValida, onSollecita }: { documento: DocumentoTrasporto; onValida: () => void; onSollecita: () => void }) {
  const stile = {
    atteso: "text-muted",
    mancante: "text-rose-600",
    ricevuto: "text-teal",
    in_elaborazione: "text-amber-600",
    abbinato: "text-teal",
    validato: "text-emerald-700",
    rifiutato: "text-rose-600",
  }[documento.stato];
  const label = {
    atteso: "In attesa",
    mancante: "Mancante",
    ricevuto: "Ricevuto",
    in_elaborazione: "In elaborazione",
    abbinato: "Abbinato",
    validato: "Validato",
    rifiutato: "Rifiutato",
  }[documento.stato];

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className={cn("text-sm font-medium", documento.stato === "mancante" || documento.stato === "atteso" ? "italic text-muted" : "text-foreground")}>
            {documento.nome === "—" ? LABEL_TIPO_DOCUMENTO[documento.tipo] : documento.nome}
          </p>
          <p className="mt-0.5 text-xs text-muted">
            {LABEL_TIPO_DOCUMENTO[documento.tipo]}
            {documento.confidenza !== null && ` · confidenza ${documento.confidenza}%`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("text-xs font-semibold", stile)}>{label}</span>
          {documento.stato !== "validato" && documento.stato !== "mancante" && documento.stato !== "atteso" && (
            <button onClick={onValida} className="rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-dark">
              Valida
            </button>
          )}
          {(documento.stato === "mancante" || documento.stato === "atteso") && (
            <button
              onClick={onSollecita}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-navy hover:bg-[#F7F9FA]"
            >
              <Send className="h-3 w-3" />
              Sollecita
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ModaleSollecito({
  lavoro,
  tipo,
  onChiudi,
  onSegnato,
}: {
  lavoro: LavoroTrasporto;
  tipo: TipoDocumentoTrasporto;
  onChiudi: () => void;
  onSegnato: () => void;
}) {
  const testo = generaBozzaSollecito(lavoro, tipo);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-dark/40 p-4" onClick={onChiudi}>
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-navy">
          <FileText className="h-4 w-4 text-teal" />
          Bozza sollecito
        </div>
        <p className="mb-3 text-xs text-muted">
          Testo generato automaticamente per {LABEL_TIPO_DOCUMENTO[tipo].toLowerCase()}. Per il prototipo resta una bozza: copiala e
          inviala da WhatsApp o email, non parte nulla da qui.
        </p>
        <pre className="max-h-72 overflow-y-auto whitespace-pre-wrap rounded-lg border border-border bg-[#F7F9FA] p-4 text-xs leading-relaxed text-foreground">
          {testo}
        </pre>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onChiudi} className="rounded-lg border border-border bg-white px-4 py-2 text-xs font-semibold text-navy hover:bg-[#F7F9FA]">
            Chiudi
          </button>
          <button onClick={onSegnato} className="rounded-lg bg-navy px-4 py-2 text-xs font-semibold text-white hover:bg-navy-dark">
            Segna come sollecitato
          </button>
        </div>
      </div>
    </div>
  );
}

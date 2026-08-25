"use client";

import { vettoreById } from "@/lib/data";
import { useOperations } from "@/lib/store";
import { DriverPhonePreview } from "@/components/DriverPhonePreview";

export function DriverClient() {
  const { spedizioni, ultimoAggiornatoId } = useOperations();
  const spedizione = spedizioni.find((s) => s.id === "SP-2464")!;
  const vettore = vettoreById(spedizione.vettoreId)!;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#e9eef1] px-6 py-10">
      <div className="w-full max-w-[380px]">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-muted">
          Anteprima app driver — {vettore.autista}
        </p>
        <DriverPhonePreview
          spedizione={spedizione}
          vettore={vettore}
          justUpdated={ultimoAggiornatoId === spedizione.id}
        />
      </div>
    </div>
  );
}

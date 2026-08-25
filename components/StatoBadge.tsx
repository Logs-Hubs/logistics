import { cn } from "@/lib/utils";
import type { StatoAppuntamento } from "@/lib/data";

const CONFIG: Record<StatoAppuntamento, { label: string; classes: string; dot: string }> = {
  confermato: {
    label: "Confermato",
    classes: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    dot: "bg-emerald-500",
  },
  da_pianificare: {
    label: "Da pianificare",
    classes: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    dot: "bg-amber-500",
  },
  in_ritardo: {
    label: "In ritardo",
    classes: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
    dot: "bg-rose-500",
  },
};

export function StatoBadge({ stato }: { stato: StatoAppuntamento }) {
  const c = CONFIG[stato];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", c.classes)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
      {c.label}
    </span>
  );
}

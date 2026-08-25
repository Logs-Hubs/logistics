import "server-only";
import { getSupabaseServer } from "@/lib/supabase/server";
import type { Spedizione, Terminal, Vettore } from "@/lib/data";

type SpedizioneRow = {
  id: string;
  cliente: string;
  container_id: string;
  terminal_id: string;
  stato: Spedizione["stato"];
  vettore_id: string;
  scadenza_demurrage: string;
  ora_appuntamento: string | null;
  data_appuntamento: string | null;
  tipo: Spedizione["tipo"];
  merce: string;
};

function mapSpedizione(row: SpedizioneRow): Spedizione {
  return {
    id: row.id,
    cliente: row.cliente,
    containerId: row.container_id,
    terminalId: row.terminal_id,
    stato: row.stato,
    vettoreId: row.vettore_id,
    scadenzaDemurrage: row.scadenza_demurrage,
    oraAppuntamento: row.ora_appuntamento ?? undefined,
    dataAppuntamento: row.data_appuntamento ?? undefined,
    tipo: row.tipo,
    merce: row.merce,
  };
}

export async function getTerminals(): Promise<Terminal[]> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase.from("terminals").select("*").order("id");
  if (error) throw error;
  return data as Terminal[];
}

export async function getVettori(): Promise<Vettore[]> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase.from("vettori").select("*").order("id");
  if (error) throw error;
  return data as Vettore[];
}

export async function getSpedizioni(): Promise<Spedizione[]> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase.from("spedizioni").select("*").order("id");
  if (error) throw error;
  return (data as SpedizioneRow[]).map(mapSpedizione);
}

export async function getSpedizione(id: string): Promise<Spedizione | undefined> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase.from("spedizioni").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? mapSpedizione(data as SpedizioneRow) : undefined;
}

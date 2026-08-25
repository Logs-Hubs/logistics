"use server";

import { getSupabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function revalidateSpedizione(spedizioneId: string) {
  revalidatePath("/");
  revalidatePath("/calendario");
  revalidatePath(`/spedizioni/${spedizioneId}`);
}

export async function prenotaAppuntamento(spedizioneId: string, giorno: string, ora: string) {
  const supabase = getSupabaseServer();
  const { error } = await supabase
    .from("spedizioni")
    .update({ stato: "confermato", data_appuntamento: giorno, ora_appuntamento: ora })
    .eq("id", spedizioneId);
  if (error) throw error;

  revalidateSpedizione(spedizioneId);
}

export async function segnalaRitiro(spedizioneId: string, ora: string) {
  const supabase = getSupabaseServer();
  const { error } = await supabase
    .from("spedizioni")
    .update({ fase_operativa: "ritirato", ora_ritiro: ora })
    .eq("id", spedizioneId);
  if (error) throw error;

  revalidateSpedizione(spedizioneId);
}

export async function segnalaRientroVuoto(spedizioneId: string, ora: string) {
  const supabase = getSupabaseServer();
  const { error } = await supabase
    .from("spedizioni")
    .update({ fase_operativa: "rientro_vuoto", ora_rientro_vuoto: ora })
    .eq("id", spedizioneId);
  if (error) throw error;

  revalidateSpedizione(spedizioneId);
}

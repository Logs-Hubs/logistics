"use server";

import { getSupabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function prenotaAppuntamento(spedizioneId: string, giorno: string, ora: string) {
  const supabase = getSupabaseServer();
  const { error } = await supabase
    .from("spedizioni")
    .update({ stato: "confermato", data_appuntamento: giorno, ora_appuntamento: ora })
    .eq("id", spedizioneId);
  if (error) throw error;

  revalidatePath("/");
  revalidatePath("/calendario");
  revalidatePath(`/spedizioni/${spedizioneId}`);
}

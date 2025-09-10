import { User } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function getLocalUserFromSupabase(supabaseId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("supabaseId", supabaseId)
    .single();

  if (error) {
    console.error("Error fetching user:", error);
    throw error;
  }

  return data as User;
}

import { createClient } from "@/utils/supabase/server";
import Navbar from "@/components/shared/navbar";
import { getLocalUserFromSupabase } from "@/lib/get-local-user-from-supabase";

export default async function RSCNavbar() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = await getLocalUserFromSupabase(data.user?.id!);
  return <Navbar user={data.user} localUser={user} />;
}

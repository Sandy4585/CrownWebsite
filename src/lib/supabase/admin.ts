import { createServerSupabaseClient } from "./server";
import { redirect } from "next/navigation";

export async function getAuthenticatedUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/admin/login");
  }

  return { user, supabase };
}

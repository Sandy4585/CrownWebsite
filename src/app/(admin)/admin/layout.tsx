import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  let unreadCount = 0;
  try {
    const { count } = await supabase
      .from("enquiries")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false);
    unreadCount = count || 0;
  } catch {}

  return (
    <div className="admin-theme min-h-screen bg-[#F8F9FA]">
      <AdminSidebar unreadCount={unreadCount} />
      <main className="ml-64 min-h-screen p-6">{children}</main>
    </div>
  );
}

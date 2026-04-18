import Link from "next/link";
import {
  Package,
  MessageSquare,
  Image,
  Plus,
  Eye,
  ArrowRight,
} from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/utils";

async function getDashboardStats() {
  const supabase = await createServerSupabaseClient();

  const [products, activeProducts, enquiries, unreadEnquiries, gallery] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true),
      supabase.from("enquiries").select("*", { count: "exact", head: true }),
      supabase
        .from("enquiries")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false),
      supabase
        .from("gallery_images")
        .select("*", { count: "exact", head: true }),
    ]);

  const { data: recentEnquiries } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  return {
    totalProducts: products.count || 0,
    activeProducts: activeProducts.count || 0,
    totalEnquiries: enquiries.count || 0,
    unreadEnquiries: unreadEnquiries.count || 0,
    galleryImages: gallery.count || 0,
    recentEnquiries: recentEnquiries || [],
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Active Products",
      value: stats.activeProducts,
      icon: Package,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Total Enquiries",
      value: stats.totalEnquiries,
      icon: MessageSquare,
      color: "text-purple-600 bg-purple-50",
    },
    {
      label: "Unread Enquiries",
      value: stats.unreadEnquiries,
      icon: MessageSquare,
      color: "text-red-600 bg-red-50",
    },
    {
      label: "Gallery Images",
      value: stats.galleryImages,
      icon: Image,
      color: "text-amber-600 bg-amber-50",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back to Crown Consultants Admin</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className={`mb-3 inline-flex rounded-lg p-2 ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8 flex flex-wrap gap-3">
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#C9A84C] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#A8882E]"
        >
          <Plus className="h-4 w-4" />
          Add New Product
        </Link>
        <Link
          href="/admin/enquiries"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Eye className="h-4 w-4" />
          View Enquiries
          {stats.unreadEnquiries > 0 && (
            <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
              {stats.unreadEnquiries}
            </span>
          )}
        </Link>
        <Link
          href="/admin/gallery"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Image className="h-4 w-4" />
          Manage Gallery
        </Link>
      </div>

      {/* Recent Enquiries */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="font-semibold text-gray-900">Recent Enquiries</h2>
          <Link
            href="/admin/enquiries"
            className="flex items-center gap-1 text-sm text-[#C9A84C] hover:underline"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {stats.recentEnquiries.length === 0 ? (
          <p className="p-5 text-center text-gray-500">No enquiries yet</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {stats.recentEnquiries.map((enq: Record<string, string | boolean>) => (
              <div key={enq.id as string} className="flex items-center justify-between px-5 py-3">
                <div>
                  <div className="flex items-center gap-2">
                    {!enq.is_read && (
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                    )}
                    <p className="font-medium text-gray-900">
                      {enq.name as string}
                    </p>
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 capitalize">
                      {enq.type as string}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500 line-clamp-1">
                    {enq.product_interest || (enq.message as string)?.slice(0, 60)}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-gray-400">
                  {formatDateTime(enq.created_at as string)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

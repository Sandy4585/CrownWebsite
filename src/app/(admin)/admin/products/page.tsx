import Link from "next/link";
import { Plus } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import ProductsTable from "./ProductsTable";

export default async function ProductsPage() {
  const supabase = await createServerSupabaseClient();

  const { data: products } = await supabase
    .from("products")
    .select("*, category:categories(name)")
    .order("display_order", { ascending: true });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">
            {products?.length || 0} total products
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#C9A84C] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#A8882E]"
        >
          <Plus className="h-4 w-4" />
          Add New Product
        </Link>
      </div>

      <ProductsTable initialProducts={products || []} />
    </div>
  );
}

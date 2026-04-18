import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/products/ProductCard";
import { SectionTitle } from "@/components/common/SectionTitle";
import type { Product } from "@/types";

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("is_featured", true)
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .limit(6);

    if (error) throw error;
    return data || [];
  } catch {
    return [];
  }
}

export async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  if (products.length === 0) return null;

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Featured Products"
          subtitle="Explore our most popular gold & silver refinery equipment and accessories"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 rounded-lg border border-primary/50 px-8 py-3 font-semibold text-primary transition-all hover:bg-primary/10"
          >
            View All Products
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

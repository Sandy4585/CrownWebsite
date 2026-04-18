import { Suspense } from "react";
import type { Metadata } from "next";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { PageHero } from "@/components/layout/PageHero";
import { CategoryFilter } from "@/components/products/CategoryFilter";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductCardSkeleton } from "@/components/common/LoadingSkeleton";
import type { Product, Category } from "@/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse our range of gold refining plants, silver refinery machines, hallmarking laboratory setups, PP scrubber systems, and industrial accessories.",
};

async function getCategories(): Promise<Category[]> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });
  return data || [];
}

async function getProducts(categorySlug?: string): Promise<Product[]> {
  const supabase = createServiceRoleClient();
  let query = supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (categorySlug && categorySlug !== "all") {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();
    if (cat) {
      query = query.eq("category_id", cat.id);
    }
  }

  const { data } = await query;
  return data || [];
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(params.category),
  ]);

  return (
    <>
      <PageHero
        title="Our Products"
        subtitle="Precision-engineered refinery equipment for the precious metal industry"
        breadcrumbs={[{ label: "Products" }]}
      />

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Suspense fallback={null}>
            <CategoryFilter categories={categories} />
          </Suspense>

          <Suspense
            fallback={
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            <ProductGrid products={products} />
          </Suspense>
        </div>
      </section>
    </>
  );
}

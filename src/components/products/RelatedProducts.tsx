import { createServiceRoleClient } from "@/lib/supabase/server";
import { ProductCard } from "./ProductCard";
import { SectionTitle } from "@/components/common/SectionTitle";
import type { Product } from "@/types";

interface RelatedProductsProps {
  categoryId: string;
  currentProductId: string;
}

async function getRelatedProducts(
  categoryId: string,
  excludeId: string
): Promise<Product[]> {
  try {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("category_id", categoryId)
      .eq("is_active", true)
      .neq("id", excludeId)
      .order("display_order", { ascending: true })
      .limit(3);
    return data || [];
  } catch {
    return [];
  }
}

export async function RelatedProducts({
  categoryId,
  currentProductId,
}: RelatedProductsProps) {
  const products = await getRelatedProducts(categoryId, currentProductId);
  if (products.length === 0) return null;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Related Products"
          subtitle="Other products in this category"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

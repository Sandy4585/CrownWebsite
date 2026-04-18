import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Check } from "lucide-react";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { PageHero } from "@/components/layout/PageHero";
import { ProductImageGallery } from "@/components/products/ProductImageGallery";
import { SpecsTable } from "@/components/products/SpecsTable";
import { RelatedProducts } from "@/components/products/RelatedProducts";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { SectionTitle } from "@/components/common/SectionTitle";
import { GoldDivider } from "@/components/common/GoldDivider";
import type { Product } from "@/types";

export const revalidate = 60;

async function getProduct(slug: string): Promise<Product | null> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !data) return null;
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.meta_title || product.name,
    description: product.meta_description || product.short_description || "",
    openGraph: {
      title: product.meta_title || product.name,
      description: product.meta_description || product.short_description || "",
      images: product.thumbnail ? [{ url: product.thumbnail }] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const categoryName = product.category?.name || "Products";
  const categorySlug = product.category?.slug || "";

  const breadcrumbs = [
    { label: "Products", href: "/products" },
    ...(categorySlug
      ? [
          {
            label: categoryName,
            href: `/products?category=${categorySlug}`,
          },
        ]
      : []),
    { label: product.name },
  ];

  const images = product.images?.length
    ? product.images
    : product.thumbnail
      ? [product.thumbnail]
      : [];

  return (
    <>
      <PageHero title={product.name} breadcrumbs={breadcrumbs} />

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Image Gallery - 3 cols */}
            <div className="lg:col-span-3">
              <ProductImageGallery
                images={images}
                productName={product.name}
              />
            </div>

            {/* Product Info - 2 cols */}
            <div className="lg:col-span-2">
              <h1 className="font-heading text-2xl font-bold text-text sm:text-3xl">
                {product.name}
              </h1>

              <div className="mt-4">
                <span className="text-2xl font-bold text-primary">
                  {product.is_price_visible && product.price_display
                    ? product.price_display
                    : "Request Quote for Pricing"}
                </span>
              </div>

              {product.short_description && (
                <p className="mt-4 text-lg text-text-secondary">
                  {product.short_description}
                </p>
              )}

              {/* Specs */}
              {product.specs &&
                Object.keys(product.specs).length > 0 && (
                  <div className="mt-8">
                    <h3 className="mb-3 font-heading text-lg font-semibold text-text">
                      Specifications
                    </h3>
                    <SpecsTable specs={product.specs} />
                  </div>
                )}

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="mt-8">
                  <h3 className="mb-3 font-heading text-lg font-semibold text-text">
                    Key Features
                  </h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-text-secondary"
                      >
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-8">
                <a
                  href="#enquiry"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg gold-gradient px-8 py-4 text-base font-semibold text-bg transition-all hover:shadow-lg hover:shadow-primary/20"
                >
                  Request Quote for This Product
                </a>
              </div>
            </div>
          </div>

          {/* Full Description */}
          {product.description && (
            <div className="mt-16">
              <GoldDivider className="mb-12" />
              <h2 className="mb-6 font-heading text-2xl font-bold text-text">
                Product Description
              </h2>
              <div className="prose prose-invert max-w-none text-text-secondary prose-headings:text-text prose-strong:text-text prose-a:text-primary">
                {product.description.split("\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          )}

          {/* Applications */}
          {product.applications && product.applications.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-6 font-heading text-2xl font-bold text-text">
                Applications & Use Cases
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {product.applications.map((app, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4"
                  >
                    <Check className="h-5 w-5 shrink-0 text-primary" />
                    <span className="text-text-secondary">{app}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enquiry Form */}
          <div id="enquiry" className="mt-16 scroll-mt-32">
            <GoldDivider className="mb-12" />
            <SectionTitle
              title="Request a Quote"
              subtitle="Fill out the form below and we will get back to you within 24 hours"
              align="left"
            />
            <div className="max-w-2xl rounded-xl border border-border bg-surface p-6 sm:p-8">
              <EnquiryForm
                type="quote"
                productInterest={product.name}
                productId={product.id}
                sourcePage={`/products/${product.slug}`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {product.category_id && (
        <Suspense fallback={null}>
          <RelatedProducts
            categoryId={product.category_id}
            currentProductId={product.id}
          />
        </Suspense>
      )}
    </>
  );
}

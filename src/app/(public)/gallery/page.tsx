import type { Metadata } from "next";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { PageHero } from "@/components/layout/PageHero";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import type { GalleryImage } from "@/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "View our gallery of gold refinery installations, factory infrastructure, products, and events at Crown Consultants.",
};

async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("gallery_images")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });
    return data || [];
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <>
      <PageHero
        title="Gallery"
        subtitle="A showcase of our installations, factory, products, and events"
        breadcrumbs={[{ label: "Gallery" }]}
      />

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <GalleryGrid images={images} />
        </div>
      </section>
    </>
  );
}

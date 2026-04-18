import { createServiceRoleClient } from "@/lib/supabase/server";
import { TestimonialsCarousel } from "./TestimonialsCarousel";
import type { Testimonial } from "@/types";

async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch {
    return [];
  }
}

export async function TestimonialsSection() {
  const testimonials = await getTestimonials();
  if (testimonials.length === 0) return null;
  return <TestimonialsCarousel testimonials={testimonials} />;
}

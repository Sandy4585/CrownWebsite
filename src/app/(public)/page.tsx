import { Suspense } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { StatsBar } from "@/components/sections/StatsBar";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { IndustriesServed } from "@/components/sections/IndustriesServed";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { CTABanner } from "@/components/sections/CTABanner";
import { GoldDivider } from "@/components/common/GoldDivider";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <AboutPreview />
      <GoldDivider />
      <Suspense fallback={null}>
        <FeaturedProducts />
      </Suspense>
      <WhyChooseUs />
      <IndustriesServed />
      <Suspense fallback={null}>
        <TestimonialsSection />
      </Suspense>
      <CTABanner />
    </>
  );
}

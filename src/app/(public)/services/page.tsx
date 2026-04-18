import type { Metadata } from "next";
import Link from "next/link";
import {
  Factory,
  BadgeCheck,
  FlaskConical,
  BookOpen,
  Headphones,
  Check,
  ArrowRight,
} from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { AnimateOnScroll } from "@/components/common/AnimateOnScroll";
import { CTABanner } from "@/components/sections/CTABanner";
import { GoldDivider } from "@/components/common/GoldDivider";
import { services } from "@/data/services";
import { slideInLeft, slideInRight } from "@/lib/animations";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Crown Consultants offers turnkey refinery setup, hallmarking centre installation, fire assaying lab setup, consultancy services, and annual maintenance contracts.",
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Factory,
  BadgeCheck,
  FlaskConical,
  BookOpen,
  Headphones,
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Our Services"
        subtitle="Comprehensive solutions for the precious metal refining industry"
        breadcrumbs={[{ label: "Services" }]}
      />

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {services.map((service, i) => {
              const Icon = iconMap[service.icon] || Factory;
              const isEven = i % 2 === 0;
              return (
                <AnimateOnScroll
                  key={service.title}
                  variants={isEven ? slideInLeft : slideInRight}
                >
                  <div
                    className={`grid items-center gap-12 lg:grid-cols-2 ${
                      !isEven ? "lg:direction-rtl" : ""
                    }`}
                  >
                    <div className={!isEven ? "lg:order-2" : ""}>
                      <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <h2 className="mb-4 font-heading text-2xl font-bold text-text sm:text-3xl">
                        {service.title}
                      </h2>
                      <p className="mb-6 text-lg leading-relaxed text-text-secondary">
                        {service.description}
                      </p>
                      <ul className="mb-8 space-y-3">
                        {service.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-3 text-text-secondary"
                          >
                            <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="/contact"
                        className="group inline-flex items-center gap-2 text-base font-semibold text-primary hover:text-primary-light"
                      >
                        Enquire About This Service
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>

                    <div
                      className={`${!isEven ? "lg:order-1" : ""}`}
                    >
                      <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-surface">
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-surface to-bg">
                          <Icon className="h-24 w-24 text-primary/20" />
                        </div>
                      </div>
                    </div>
                  </div>
                  {i < services.length - 1 && (
                    <GoldDivider className="mt-20" />
                  )}
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}

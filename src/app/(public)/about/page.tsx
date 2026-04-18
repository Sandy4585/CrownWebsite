import type { Metadata } from "next";
import {
  Target,
  Eye,
  Heart,
  Award,
  Users,
  Zap,
  Shield,
  Clock,
} from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { AnimateOnScroll } from "@/components/common/AnimateOnScroll";
import { SectionTitle } from "@/components/common/SectionTitle";
import { GoldDivider } from "@/components/common/GoldDivider";
import { siteConfig } from "@/data/siteConfig";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Crown Consultants — India's trusted manufacturer of gold & silver refinery equipment since 2010. Based in Chennai, serving clients across India.",
};

const coreValues = [
  {
    title: "Quality Excellence",
    description: "Every machine is built to exacting standards with premium materials.",
    icon: Award,
  },
  {
    title: "Customer First",
    description: "Your success is our priority — from consultation to after-sales support.",
    icon: Users,
  },
  {
    title: "Innovation",
    description: "Continuously improving our designs for better efficiency and output.",
    icon: Zap,
  },
  {
    title: "Reliability",
    description: "Equipment you can depend on, day after day, year after year.",
    icon: Shield,
  },
  {
    title: "Integrity",
    description: "Transparent dealings, honest pricing, and genuine commitment.",
    icon: Heart,
  },
  {
    title: "Timely Delivery",
    description: "We respect deadlines and deliver projects on schedule.",
    icon: Clock,
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Crown Consultants"
        subtitle="India's trusted partner in precious metal refinery equipment manufacturing"
        breadcrumbs={[{ label: "About Us" }]}
      />

      {/* Company Story */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="mx-auto max-w-4xl">
              <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-primary">
                Our Story
              </span>
              <h2 className="font-heading text-3xl font-bold text-text sm:text-4xl">
                Building India&apos;s Refining Future Since{" "}
                <span className="gold-gradient-text">
                  {siteConfig.company.foundedYear}
                </span>
              </h2>
              <div className="mt-8 space-y-4 text-lg leading-relaxed text-text-secondary">
                <p>
                  Crown Consultants was founded with a singular vision — to make
                  world-class precious metal refining technology accessible to
                  Indian jewellers, refiners, and entrepreneurs. Based in
                  Chennai, Tamil Nadu, we have grown from a small consultancy
                  into one of India&apos;s most trusted manufacturers of gold
                  and silver refinery equipment.
                </p>
                <p>
                  Over the years, we have successfully designed, manufactured,
                  and installed over 500 refining systems across India —
                  spanning gold refining plants, silver recovery units,
                  hallmarking laboratories, and complete turnkey refinery setups.
                </p>
                <p>
                  Our team combines deep metallurgical knowledge with
                  cutting-edge engineering to deliver equipment that meets
                  international quality standards while being optimised for
                  Indian operating conditions.
                </p>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <GoldDivider />

      {/* Vision & Mission */}
      <section className="py-20 bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <AnimateOnScroll>
              <div className="rounded-2xl border border-border bg-bg p-8 sm:p-10">
                <div className="mb-6 inline-flex rounded-lg bg-primary/10 p-3">
                  <Eye className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-4 font-heading text-2xl font-bold text-text">
                  Our Vision
                </h3>
                <p className="text-lg leading-relaxed text-text-secondary italic">
                  &ldquo;To be India&apos;s foremost provider of precious metal
                  refinery solutions, empowering businesses with reliable,
                  efficient, and sustainable refining technology.&rdquo;
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={0.1}>
              <div className="rounded-2xl border border-border bg-bg p-8 sm:p-10">
                <div className="mb-6 inline-flex rounded-lg bg-primary/10 p-3">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-4 font-heading text-2xl font-bold text-text">
                  Our Mission
                </h3>
                <p className="text-lg leading-relaxed text-text-secondary italic">
                  &ldquo;To deliver turnkey refinery solutions with uncompromising
                  quality, customer-centric service, and continuous innovation
                  — making precious metal refining accessible and profitable
                  for businesses of all scales.&rdquo;
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Our Core Values"
            subtitle="The principles that guide everything we do"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((value, i) => {
              const Icon = value.icon;
              return (
                <AnimateOnScroll key={value.title} delay={i * 0.05}>
                  <div className="rounded-xl border border-border bg-surface p-6 transition-all hover:border-primary/50">
                    <Icon className="mb-4 h-8 w-8 text-primary" />
                    <h3 className="mb-2 font-heading text-lg font-semibold text-text">
                      {value.title}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {value.description}
                    </p>
                  </div>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      <GoldDivider />

      {/* Certifications */}
      <section className="py-20 bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Certifications & Approvals"
            subtitle="Our commitment to quality is backed by industry certifications"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "BIS Approved", desc: "Bureau of Indian Standards" },
              { label: "NABL Accredited", desc: "National Accreditation Board" },
              { label: "ISO Standards", desc: "International Quality Standards" },
              { label: "GST Registered", desc: siteConfig.company.gst },
            ].map((cert, i) => (
              <AnimateOnScroll key={cert.label} delay={i * 0.05}>
                <div className="flex flex-col items-center rounded-xl border border-border bg-bg p-6 text-center">
                  <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-text">
                    {cert.label}
                  </h3>
                  <p className="mt-1 text-sm text-text-muted">{cert.desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

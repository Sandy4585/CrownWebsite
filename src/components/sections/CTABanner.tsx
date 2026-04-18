"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, MessageCircle, ArrowRight } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";

export function CTABanner() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl border border-primary/30 bg-surface p-10 sm:p-16 text-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.1)_0%,transparent_70%)]" />

          <div className="relative">
            <h2 className="font-heading text-3xl font-bold text-text sm:text-4xl lg:text-5xl">
              Ready to Set Up Your{" "}
              <span className="gold-gradient-text">Refinery?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
              Get expert guidance from India&apos;s trusted precious metal
              refinery equipment manufacturer. Free consultation for new setups.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-lg gold-gradient px-8 py-4 text-base font-semibold text-bg transition-all hover:shadow-xl hover:shadow-primary/20"
              >
                Get a Free Quote
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="inline-flex items-center gap-2 text-base font-medium text-text-secondary transition-colors hover:text-primary"
              >
                <Phone className="h-5 w-5" />
                {siteConfig.contact.phoneDisplay}
              </a>
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-base font-medium text-text-secondary transition-colors hover:text-[#25D366]"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

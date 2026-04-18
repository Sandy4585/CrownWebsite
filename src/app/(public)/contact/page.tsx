import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { siteConfig } from "@/data/siteConfig";
import { getFullAddress } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Crown Consultants for gold refinery equipment enquiries, product quotes, or consultancy services. Based in Chennai, India.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="Have a question or need a quote? We're here to help."
        breadcrumbs={[{ label: "Contact" }]}
      />

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
                <h2 className="mb-6 font-heading text-2xl font-bold text-text">
                  Send Us a Message
                </h2>
                <ContactForm />
              </div>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Address */}
                <div className="rounded-xl border border-border bg-surface p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h3 className="font-heading text-lg font-semibold text-text">
                      Office Address
                    </h3>
                  </div>
                  <p className="text-text-secondary">
                    {getFullAddress(siteConfig.contact.address)}
                  </p>
                  <a
                    href={siteConfig.contact.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    Open in Google Maps
                  </a>
                </div>

                {/* Phone */}
                <div className="rounded-xl border border-border bg-surface p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <h3 className="font-heading text-lg font-semibold text-text">
                      Phone
                    </h3>
                  </div>
                  <a
                    href={`tel:${siteConfig.contact.phone}`}
                    className="text-lg text-text-secondary hover:text-primary transition-colors"
                  >
                    {siteConfig.contact.phoneDisplay}
                  </a>
                </div>

                {/* Email */}
                <div className="rounded-xl border border-border bg-surface p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <h3 className="font-heading text-lg font-semibold text-text">
                      Email
                    </h3>
                  </div>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-text-secondary hover:text-primary transition-colors"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>

                {/* WhatsApp */}
                <div className="rounded-xl border border-border bg-surface p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-[#25D366]" />
                    <h3 className="font-heading text-lg font-semibold text-text">
                      WhatsApp
                    </h3>
                  </div>
                  <a
                    href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#25D366]/10 px-4 py-2 text-sm font-medium text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
                  >
                    Chat on WhatsApp
                  </a>
                </div>

                {/* Hours */}
                <div className="rounded-xl border border-border bg-surface p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <h3 className="font-heading text-lg font-semibold text-text">
                      Working Hours
                    </h3>
                  </div>
                  <p className="text-text-secondary">
                    {siteConfig.contact.workingHours}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          {siteConfig.contact.googleMapsEmbed !==
            "PASTE_GOOGLE_MAPS_EMBED_URL_HERE" && (
            <div className="mt-12">
              <div className="overflow-hidden rounded-2xl border border-border">
                <iframe
                  src={siteConfig.contact.googleMapsEmbed}
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Crown Consultants Location"
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

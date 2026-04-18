import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Linkedin, Youtube } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { navLinks } from "@/data/navigation";
import { GoldDivider } from "@/components/common/GoldDivider";
import { getFullAddress } from "@/lib/utils";

const categoryLinks = [
  { label: "Gold Refining Machines", href: "/products?category=gold-refining" },
  { label: "Silver Refinery", href: "/products?category=silver-refining" },
  { label: "Hallmarking Setup", href: "/products?category=hallmarking" },
  { label: "PP Scrubber Systems", href: "/products?category=scrubbers" },
  { label: "Accessories", href: "/products?category=accessories" },
  { label: "ETP Systems", href: "/products?category=etp" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface">
      <GoldDivider />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="mb-4 flex items-center gap-3">
              <Image
                src="/logo.jpg"
                alt="Crown Consultants"
                width={56}
                height={56}
                className="h-14 w-14 object-contain"
              />
              <span className="font-heading text-xl font-bold text-text">
                CROWN CONSULTANTS
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-text-secondary">
              {siteConfig.company.description}
            </p>
            <div className="mt-6 flex gap-4">
              {siteConfig.social.linkedin && (
                <a
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-muted transition-colors hover:text-primary"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {siteConfig.social.youtube && (
                <a
                  href={siteConfig.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-muted transition-colors hover:text-primary"
                  aria-label="YouTube"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-heading text-lg font-semibold text-text">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="mb-4 font-heading text-lg font-semibold text-text">
              Products
            </h3>
            <ul className="space-y-3">
              {categoryLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-heading text-lg font-semibold text-text">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm text-text-secondary">
                  {getFullAddress(siteConfig.contact.address)}
                </span>
              </li>
              <li>
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="flex gap-3 text-sm text-text-secondary transition-colors hover:text-primary"
                >
                  <Phone className="h-5 w-5 shrink-0 text-primary" />
                  {siteConfig.contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="flex gap-3 text-sm text-text-secondary transition-colors hover:text-primary"
                >
                  <Mail className="h-5 w-5 shrink-0 text-primary" />
                  {siteConfig.contact.email}
                </a>
              </li>
            </ul>
            <a
              href={siteConfig.contact.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <MapPin className="h-4 w-4" />
              Locate Us on Maps
            </a>
          </div>
        </div>

        <GoldDivider className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-text-muted">
            &copy; {year} {siteConfig.company.name}. All Rights Reserved.
          </p>
          <p className="text-sm text-text-muted">
            GST: {siteConfig.company.gst}
          </p>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";

export function WhatsAppButton() {
  const waLink = `https://wa.me/${siteConfig.contact.whatsapp}?text=Hi%20Crown%20Consultants%2C%20I%20would%20like%20to%20know%20more%20about%20your%20products.`;

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
    >
      <MessageCircle className="h-7 w-7" fill="currentColor" />
      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-75" />
        <span className="relative inline-flex h-4 w-4 rounded-full bg-[#25D366]" />
      </span>
    </a>
  );
}

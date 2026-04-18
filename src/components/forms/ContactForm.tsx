"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { contactSchema, type ContactFormValues } from "@/lib/validations";

const subjects = [
  "General Enquiry",
  "Product Quote",
  "Service Enquiry",
  "Partnership",
  "Other",
];

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact",
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company,
          product_interest: data.subject,
          message: data.message,
          source_page: "/contact",
        }),
      });

      if (!res.ok) throw new Error("Failed to submit");

      setSubmitted(true);
      reset();
      toast.success("Thank you! We will get back to you within 24 hours.");
    } catch {
      toast.error("Something went wrong. Please try WhatsApp or call us directly.");
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-success/30 bg-success/10 p-8 text-center">
        <CheckCircle className="mx-auto mb-4 h-12 w-12 text-success" />
        <h3 className="mb-2 font-heading text-xl font-semibold text-text">
          Message Sent!
        </h3>
        <p className="text-text-secondary">
          Thank you for reaching out. We will get back to you within 24 hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 text-sm font-medium text-primary hover:underline"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">
            Name <span className="text-error">*</span>
          </label>
          <input
            {...register("name")}
            placeholder="Your full name"
            className="w-full rounded-lg border border-border bg-bg px-4 py-3 text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-error">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">
            Email <span className="text-error">*</span>
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-lg border border-border bg-bg px-4 py-3 text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-error">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">
            Phone <span className="text-error">*</span>
          </label>
          <input
            {...register("phone")}
            type="tel"
            placeholder="+91 XXXXX XXXXX"
            className="w-full rounded-lg border border-border bg-bg px-4 py-3 text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-error">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">
            Company
          </label>
          <input
            {...register("company")}
            placeholder="Your company name"
            className="w-full rounded-lg border border-border bg-bg px-4 py-3 text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-text-secondary">
          Subject <span className="text-error">*</span>
        </label>
        <select
          {...register("subject")}
          className="w-full rounded-lg border border-border bg-bg px-4 py-3 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Select a subject</option>
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {errors.subject && (
          <p className="mt-1 text-sm text-error">{errors.subject.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-text-secondary">
          Message <span className="text-error">*</span>
        </label>
        <textarea
          {...register("message")}
          rows={5}
          placeholder="How can we help you?"
          className="w-full resize-none rounded-lg border border-border bg-bg px-4 py-3 text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {errors.message && (
          <p className="mt-1 text-sm text-error">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg gold-gradient px-8 py-3.5 font-semibold text-bg transition-all hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}

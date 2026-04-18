"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { enquirySchema, type EnquiryFormValues } from "@/lib/validations";
import { cn } from "@/lib/utils";

interface EnquiryFormProps {
  type: "general" | "quote" | "contact";
  productInterest?: string;
  productId?: string;
  sourcePage: string;
  className?: string;
}

export function EnquiryForm({
  type,
  productInterest,
  productId,
  sourcePage,
  className,
}: EnquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      type,
      product_interest: productInterest || "",
      product_id: productId || "",
      source_page: sourcePage,
    },
  });

  const onSubmit = async (data: EnquiryFormValues) => {
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to submit");

      setSubmitted(true);
      reset();
      toast.success("Your enquiry has been submitted! We will contact you within 24 hours.");
    } catch {
      toast.error("Something went wrong. Please try WhatsApp or call us directly.");
    }
  };

  if (submitted) {
    return (
      <div className={cn("rounded-xl border border-success/30 bg-success/10 p-8 text-center", className)}>
        <CheckCircle className="mx-auto mb-4 h-12 w-12 text-success" />
        <h3 className="mb-2 font-heading text-xl font-semibold text-text">
          Thank You!
        </h3>
        <p className="text-text-secondary">
          Your enquiry has been submitted successfully. We will get back to you within 24 hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 text-sm font-medium text-primary hover:underline"
        >
          Submit Another Enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("space-y-5", className)}
    >
      <input type="hidden" {...register("type")} />
      <input type="hidden" {...register("source_page")} />
      {productId && <input type="hidden" {...register("product_id")} />}

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

      {productInterest && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">
            Product Interest
          </label>
          <input
            {...register("product_interest")}
            readOnly
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text-secondary"
          />
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-text-secondary">
          Message <span className="text-error">*</span>
        </label>
        <textarea
          {...register("message")}
          rows={4}
          placeholder="Tell us about your requirements..."
          className="w-full resize-none rounded-lg border border-border bg-bg px-4 py-3 text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {errors.message && (
          <p className="mt-1 text-sm text-error">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg gold-gradient px-8 py-3.5 font-semibold text-bg transition-all hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 sm:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            {type === "quote" ? "Request Quote" : "Send Enquiry"}
          </>
        )}
      </button>
    </form>
  );
}

import { z } from "zod";

export const enquirySchema = z.object({
  type: z.enum(["general", "quote", "contact"]),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .regex(/^[+]?[\d\s-]{10,15}$/, "Please enter a valid phone number"),
  company: z.string().optional(),
  product_interest: z.string().optional(),
  product_id: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  source_page: z.string(),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .regex(/^[+]?[\d\s-]{10,15}$/, "Please enter a valid phone number"),
  company: z.string().optional(),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  slug: z.string().min(2, "Slug is required"),
  category_id: z.string().uuid("Please select a category"),
  short_description: z.string().max(200, "Maximum 200 characters").optional(),
  description: z.string().optional(),
  price_display: z.string().optional(),
  is_price_visible: z.boolean().default(false),
  specs: z.record(z.string(), z.string()).optional(),
  features: z.array(z.string()).optional(),
  applications: z.array(z.string()).optional(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
});

export type EnquiryFormValues = z.infer<typeof enquirySchema>;
export type ContactFormValues = z.infer<typeof contactSchema>;
export type ProductFormValues = z.infer<typeof productSchema>;

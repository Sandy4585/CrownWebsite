export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  price_display: string | null;
  is_price_visible: boolean;
  specs: Record<string, string> | null;
  features: string[] | null;
  applications: string[] | null;
  images: string[] | null;
  thumbnail: string | null;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Enquiry {
  id: string;
  type: "general" | "quote" | "contact";
  name: string;
  email: string;
  phone: string;
  company: string | null;
  product_interest: string | null;
  product_id: string | null;
  message: string;
  source_page: string | null;
  is_read: boolean;
  is_responded: boolean;
  notes: string | null;
  created_at: string;
  product?: Product;
}

export interface Testimonial {
  id: string;
  client_name: string;
  company: string | null;
  location: string | null;
  content: string;
  rating: number;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export interface GalleryImage {
  id: string;
  title: string | null;
  category: "installations" | "factory" | "products" | "events";
  image_url: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface EnquiryFormData {
  type: "general" | "quote" | "contact";
  name: string;
  email: string;
  phone: string;
  company?: string;
  product_interest?: string;
  product_id?: string;
  message: string;
  source_page: string;
}

export interface SiteStats {
  label: string;
  value: string;
  icon: string;
}

-- =============================================
-- Crown Consultants — Supabase Database Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- Table: categories
-- =============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Table: products
-- =============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  description TEXT,
  price_display TEXT,
  is_price_visible BOOLEAN DEFAULT FALSE,
  specs JSONB,
  features TEXT[],
  applications TEXT[],
  images TEXT[],
  thumbnail TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at on product changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Table: enquiries
-- =============================================
CREATE TABLE enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('general', 'quote', 'contact')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  product_interest TEXT,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  source_page TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  is_responded BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Table: testimonials
-- =============================================
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  company TEXT,
  location TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Table: gallery_images
-- =============================================
CREATE TABLE gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  category TEXT CHECK (category IN ('installations', 'factory', 'products', 'events')),
  image_url TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Public read for all tables
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public read gallery_images" ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Public read enquiries" ON enquiries FOR SELECT USING (true);

-- Public can submit enquiries
CREATE POLICY "Public insert enquiries" ON enquiries FOR INSERT WITH CHECK (true);

-- Authenticated users (admin) can do everything
CREATE POLICY "Admin full access categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access enquiries" ON enquiries FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access gallery_images" ON gallery_images FOR ALL USING (auth.role() = 'authenticated');

-- =============================================
-- Indexes
-- =============================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_enquiries_type ON enquiries(type);
CREATE INDEX idx_enquiries_read ON enquiries(is_read) WHERE is_read = FALSE;

-- =============================================
-- Seed: Default Categories
-- =============================================
INSERT INTO categories (name, slug, description, display_order) VALUES
  ('Gold Refining', 'gold-refining', 'Semi-automatic and fully automatic gold refining plants from 500g to 50kg capacity', 1),
  ('Silver Refining', 'silver-refining', 'Complete silver refinery machines and recovery systems', 2),
  ('Hallmarking', 'hallmarking', 'BIS and NABL approved hallmarking laboratory equipment and setup', 3),
  ('Scrubbers', 'scrubbers', 'PP scrubber systems — single, double, and triple configurations', 4),
  ('Accessories', 'accessories', 'Titanium tanks, fume hoods, dryers, polishing machines, and more', 5),
  ('ETP', 'etp', 'Effluent treatment plants for refinery waste management', 6);

-- =============================================
-- Seed: Sample Testimonials
-- =============================================
INSERT INTO testimonials (client_name, company, location, content, rating, display_order) VALUES
  ('Rajesh Kumar', 'Kumar Gold Refinery', 'Mumbai, Maharashtra', 'Crown Consultants delivered our entire 10kg gold refining setup on time. The quality of equipment and after-sales support has been exceptional. Highly recommended for anyone entering the refinery business.', 5, 1),
  ('Suresh Patel', 'Patel Hallmarking Centre', 'Ahmedabad, Gujarat', 'They helped us set up our BIS-approved hallmarking lab from scratch. The team guided us through every step — from lab design to NABL documentation. Professional and reliable.', 5, 2),
  ('Mohammed Farooq', 'Chennai Gold House', 'Chennai, Tamil Nadu', 'We upgraded our refinery equipment with Crown Consultants. The new semi-automatic plant has significantly improved our output and purity levels. Great investment.', 5, 3),
  ('Anita Sharma', 'Sharma Jewellers', 'Jaipur, Rajasthan', 'As first-time refinery entrepreneurs, we were nervous about the setup. Crown Consultants provided end-to-end support — from licensing guidance to machine installation. Could not have done it without them.', 5, 4);

-- =============================================
-- Storage Buckets (create manually in Supabase Dashboard)
-- Bucket: "products" — public
-- Bucket: "gallery" — public
-- Bucket: "general" — public
-- =============================================

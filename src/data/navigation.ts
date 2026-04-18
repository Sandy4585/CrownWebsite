export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
] as const;

export const adminNavLinks = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Products", href: "/admin/products", icon: "Package" },
  { label: "Categories", href: "/admin/categories", icon: "FolderTree" },
  { label: "Enquiries", href: "/admin/enquiries", icon: "MessageSquare" },
  { label: "Gallery", href: "/admin/gallery", icon: "Image" },
  { label: "Testimonials", href: "/admin/testimonials", icon: "Quote" },
] as const;

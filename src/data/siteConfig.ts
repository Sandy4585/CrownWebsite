export const siteConfig = {
  company: {
    name: "Crown Consultants",
    legalName: "Crown Consultants",
    tagline: "Precision Engineered Gold & Silver Refinery Solutions",
    description:
      "India's trusted manufacturer of precious metal refining equipment, hallmarking laboratory setups, and industrial consultancy services.",
    foundedYear: "2010",
    gst: "33AGPPJ0853R1ZU",
  },
  contact: {
    phone: "+919841477662",
    phoneDisplay: "+91 98414 77662",
    email: "crowngold2011@gmail.com",
    whatsapp: "919841477662",
    address: {
      line1: "Behind Dunlop",
      line2: "Thiruverkadu, Ayapakkam",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600077",
      country: "India",
    },
    workingHours: "Monday to Saturday, 9:00 AM to 7:00 PM IST",
    googleMapsUrl: "https://maps.google.com/?q=Crown+Consultants+Chennai",
    googleMapsEmbed: "PASTE_GOOGLE_MAPS_EMBED_URL_HERE",
  },
  social: {
    linkedin: "https://www.linkedin.com/company/crownconsultants/?viewAsMember=true",
    youtube: "",
    instagram: "",
    facebook: "",
  },
  stats: [
    { label: "Years Experience", value: "15+", icon: "Trophy" },
    { label: "Installations", value: "500+", icon: "Factory" },
    { label: "Service Coverage", value: "Pan-India", icon: "MapPin" },
    { label: "Certification", value: "BIS/NABL", icon: "ShieldCheck" },
  ],
  seo: {
    defaultTitle:
      "Crown Consultants — Gold & Silver Refinery Machine Manufacturer in Chennai",
    defaultDescription:
      "Leading manufacturer of gold refining plants, silver refinery machines, hallmarking laboratory setups, and PP scrubber systems. Based in Chennai, serving clients across India.",
    keywords: [
      "gold refinery machine",
      "silver refinery",
      "hallmarking setup",
      "gold refining plant",
      "Chennai",
      "precious metal refinery",
      "PP scrubber",
      "BIS NABL hallmarking",
    ],
  },
} as const;

export const whyChooseUs = [
  {
    title: "Turnkey Solutions",
    description:
      "Complete end-to-end setup from consultation to installation and commissioning.",
    icon: "Wrench",
  },
  {
    title: "BIS & NABL Compliance",
    description:
      "All equipment designed to meet Bureau of Indian Standards and NABL accreditation requirements.",
    icon: "ShieldCheck",
  },
  {
    title: "Custom Configurations",
    description:
      "Machines tailored to your capacity needs — from 500g to 50kg and beyond.",
    icon: "Settings",
  },
  {
    title: "Pan-India Installation",
    description:
      "Nationwide installation and setup support with dedicated project engineers.",
    icon: "MapPin",
  },
  {
    title: "After-Sales AMC",
    description:
      "Annual maintenance contracts ensuring optimal machine performance year-round.",
    icon: "Headphones",
  },
  {
    title: "Competitive Pricing",
    description:
      "Factory-direct pricing without middlemen, ensuring the best value for your investment.",
    icon: "IndianRupee",
  },
] as const;

export const industries = [
  {
    title: "Jewellery Manufacturers",
    description: "Refining and recycling precious metals for jewellery production",
    icon: "Gem",
  },
  {
    title: "Gold Refineries",
    description: "Setting up and upgrading gold refining facilities",
    icon: "Factory",
  },
  {
    title: "Hallmarking Centres",
    description: "BIS-approved hallmarking laboratory infrastructure",
    icon: "BadgeCheck",
  },
  {
    title: "Silver Recovery Units",
    description: "Equipment for silver extraction and recovery processes",
    icon: "CircleDollarSign",
  },
  {
    title: "Precious Metal Recyclers",
    description: "Sustainable recycling solutions for precious metal waste",
    icon: "Recycle",
  },
  {
    title: "Fire Assaying Labs",
    description: "Complete fire assaying laboratory setup and equipment",
    icon: "FlaskConical",
  },
] as const;

import { ROUTES } from "@/constants/routes";

export const STORE_TAGLINE = "Elevated essentials for modern living";

export const FEATURED_CATEGORIES = [
  {
    name: "Wardrobe Refresh",
    description: "Versatile fashion staples curated for effortless everyday styling.",
    itemCount: "48 items",
    href: ROUTES.storefront.category("wardrobe-refresh"),
  },
  {
    name: "Home & Decor",
    description: "Warm details, functional accents, and elevated pieces for your space.",
    itemCount: "31 items",
    href: ROUTES.storefront.category("home-decor"),
  },
  {
    name: "Beauty Rituals",
    description: "Self-care picks that bring polish, ease, and a little indulgence.",
    itemCount: "22 items",
    href: ROUTES.storefront.category("beauty-rituals"),
  },
] as const;

export const BEST_SELLERS = [
  {
    name: "Structured Daily Tote",
    category: "Accessories",
    price: "$84.00",
    badge: "Best Seller",
    href: ROUTES.storefront.product("structured-daily-tote"),
  },
  {
    name: "Signature Lounge Set",
    category: "Apparel",
    price: "$112.00",
    badge: "Popular",
    href: ROUTES.storefront.product("signature-lounge-set"),
  },
  {
    name: "Ceramic Glow Diffuser",
    category: "Home",
    price: "$46.00",
    badge: "Top Rated",
    href: ROUTES.storefront.product("ceramic-glow-diffuser"),
  },
  {
    name: "Hydration Repair Serum",
    category: "Beauty",
    price: "$38.00",
    badge: "Customer Favorite",
    href: ROUTES.storefront.product("hydration-repair-serum"),
  },
] as const;

export const NEW_ARRIVALS = [
  {
    name: "Weekend Knit Cardigan",
    category: "Apparel",
    price: "$76.00",
    badge: "New",
    href: ROUTES.storefront.product("weekend-knit-cardigan"),
  },
  {
    name: "Minimal Glass Carafe",
    category: "Home",
    price: "$29.00",
    badge: "Just In",
    href: ROUTES.storefront.product("minimal-glass-carafe"),
  },
  {
    name: "Citrus Bloom Mist",
    category: "Beauty",
    price: "$24.00",
    badge: "Fresh Drop",
    href: ROUTES.storefront.product("citrus-bloom-mist"),
  },
  {
    name: "Canvas Market Backpack",
    category: "Accessories",
    price: "$68.00",
    badge: "Limited",
    href: ROUTES.storefront.product("canvas-market-backpack"),
  },
] as const;

export const TRUST_HIGHLIGHTS = [
  "Free delivery on orders over $75",
  "30-day easy returns",
  "Secure checkout ready for a later phase",
  "Curated single-vendor product quality",
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "The storefront already feels premium and easy to browse. I can picture the full shopping experience from this shell alone.",
    name: "Amara O.",
    role: "Early Access Shopper",
  },
  {
    quote:
      "Clean navigation, strong visual hierarchy, and a layout that would work beautifully for campaigns and launches.",
    name: "David K.",
    role: "Brand Consultant",
  },
  {
    quote:
      "It feels like a real retail experience instead of a placeholder project, which is exactly the right foundation to build on.",
    name: "Tola A.",
    role: "Operations Lead",
  },
] as const;

export const FOOTER_LINK_GROUPS = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: ROUTES.storefront.home },
      { label: "About", href: ROUTES.storefront.about },
      { label: "Shop", href: ROUTES.storefront.shop },
      { label: "Categories", href: ROUTES.storefront.categories },
      { label: "Contact", href: ROUTES.storefront.contact },
    ],
  },
  {
    title: "Customer Service",
    links: [
      { label: "FAQ", href: ROUTES.storefront.faq },
      { label: "Shipping Policy", href: ROUTES.storefront.shippingPolicy },
      { label: "Returns Policy", href: ROUTES.storefront.returnsPolicy },
      { label: "Privacy Policy", href: ROUTES.storefront.privacyPolicy },
      { label: "Terms", href: ROUTES.storefront.termsPolicy },
    ],
  },
] as const;

export const SOCIAL_PLACEHOLDERS = [
  { label: "Instagram", href: "#" },
  { label: "TikTok", href: "#" },
  { label: "Pinterest", href: "#" },
] as const;

export const ROUTES = {
  storefront: {
    home: "/",
    products: "/products",
    collections: "/collections",
  },
  admin: {
    dashboard: "/admin",
    products: "/admin/products",
    orders: "/admin/orders",
  },
  auth: {
    signIn: "/sign-in",
    signUp: "/sign-up",
  },
} as const;

export const STOREFRONT_NAV_LINKS = [
  { label: "Home", href: ROUTES.storefront.home },
  { label: "Products", href: ROUTES.storefront.products },
  { label: "Collections", href: ROUTES.storefront.collections },
  { label: "Admin", href: ROUTES.admin.dashboard },
] as const;

export const ADMIN_NAV_LINKS = [
  { label: "Overview", href: ROUTES.admin.dashboard },
  { label: "Products", href: ROUTES.admin.products },
  { label: "Orders", href: ROUTES.admin.orders },
] as const;

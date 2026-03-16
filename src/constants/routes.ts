export const ROUTES = {
  storefront: {
    home: "/",
    cart: "/cart",
    checkout: "/checkout",
    checkoutSuccess: "/checkout/success",
    checkoutFailed: "/checkout/failed",
    shop: "/shop",
    categories: "/categories",
    category: (slug: string) => `/categories/${slug}`,
    products: "/products",
    product: (slug: string) => `/products/${slug}`,
    collections: "/collections",
    contact: "/contact",
    faq: "/faq",
    policies: "/policies",
    shippingPolicy: "/policies/shipping",
    returnsPolicy: "/policies/returns",
    privacyPolicy: "/policies/privacy",
    designSystem: "/design-system",
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
  { label: "Cart", href: ROUTES.storefront.cart },
  { label: "Shop", href: ROUTES.storefront.shop },
  { label: "Categories", href: ROUTES.storefront.categories },
  { label: "Contact", href: ROUTES.storefront.contact },
  { label: "FAQ", href: ROUTES.storefront.faq },
] as const;

export const ADMIN_NAV_LINKS = [
  { label: "Overview", href: ROUTES.admin.dashboard },
  { label: "Products", href: ROUTES.admin.products },
  { label: "Orders", href: ROUTES.admin.orders },
] as const;

export const ROUTES = {
  storefront: {
    home: "/",
    cart: "/cart",
    account: "/account",
    accountProfile: "/account/profile",
    accountOrders: "/account/orders",
    accountOrder: (orderId: string) => `/account/orders/${orderId}`,
    accountWishlist: "/account/wishlist",
    accountAddresses: "/account/addresses",
    accountSettings: "/account/settings",
    orders: "/orders",
    order: (orderId: string) => `/orders/${orderId}`,
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
    wishlist: "/account/wishlist",
  },
  admin: {
    dashboard: "/admin",
    products: "/admin/products",
    orders: "/admin/orders",
    customers: "/admin/customers",
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
  { label: "Customers", href: ROUTES.admin.customers },
] as const;

export const ACCOUNT_NAV_LINKS = [
  { label: "Dashboard", href: ROUTES.storefront.account },
  { label: "Profile", href: ROUTES.storefront.accountProfile },
  { label: "Orders", href: ROUTES.storefront.accountOrders },
  { label: "Wishlist", href: ROUTES.storefront.accountWishlist },
  { label: "Addresses", href: ROUTES.storefront.accountAddresses },
  { label: "Settings", href: ROUTES.storefront.accountSettings },
] as const;

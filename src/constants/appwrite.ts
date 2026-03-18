export const APPWRITE_DATABASE_IDS = {
  core: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? "",
} as const;

export const APPWRITE_COLLECTION_IDS = {
  addresses: process.env.NEXT_PUBLIC_APPWRITE_ADDRESSES_COLLECTION_ID ?? "",
  banners: process.env.NEXT_PUBLIC_APPWRITE_BANNERS_COLLECTION_ID ?? "",
  brands: process.env.NEXT_PUBLIC_APPWRITE_BRANDS_COLLECTION_ID ?? "",
  categories: process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID ?? "",
  coupons: process.env.NEXT_PUBLIC_APPWRITE_COUPONS_COLLECTION_ID ?? "",
  notifications:
    process.env.NEXT_PUBLIC_APPWRITE_NOTIFICATIONS_COLLECTION_ID ?? "",
  orders: process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID ?? "",
  products: process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID ?? "",
  reviews: process.env.NEXT_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID ?? "",
  storeContentPages:
    process.env.NEXT_PUBLIC_APPWRITE_STORE_CONTENT_PAGES_COLLECTION_ID ?? "",
  storeSettings:
    process.env.NEXT_PUBLIC_APPWRITE_STORE_SETTINGS_COLLECTION_ID ?? "",
  shippingMethods:
    process.env.NEXT_PUBLIC_APPWRITE_SHIPPING_METHODS_COLLECTION_ID ?? "",
  userProfiles:
    process.env.NEXT_PUBLIC_APPWRITE_USER_PROFILES_COLLECTION_ID ?? "",
  wishlists:
    process.env.NEXT_PUBLIC_APPWRITE_WISHLISTS_COLLECTION_ID ??
    process.env.NEXT_PUBLIC_APPWRITE_WISHLIST_COLLECTION_ID ??
    "",
} as const;

export const APPWRITE_STORAGE_BUCKET_IDS = {
  media: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID ?? "",
} as const;

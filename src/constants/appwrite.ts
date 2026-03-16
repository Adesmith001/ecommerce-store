export const APPWRITE_DATABASE_IDS = {
  core: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? "",
} as const;

export const APPWRITE_COLLECTION_IDS = {
  brands: process.env.NEXT_PUBLIC_APPWRITE_BRANDS_COLLECTION_ID ?? "",
  categories: process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID ?? "",
  products: process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID ?? "",
  userProfiles:
    process.env.NEXT_PUBLIC_APPWRITE_USER_PROFILES_COLLECTION_ID ?? "",
} as const;

export const APPWRITE_STORAGE_BUCKET_IDS = {
  media: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID ?? "",
} as const;

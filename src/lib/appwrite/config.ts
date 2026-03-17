import {
  APPWRITE_COLLECTION_IDS,
  APPWRITE_DATABASE_IDS,
  APPWRITE_STORAGE_BUCKET_IDS,
} from "@/constants/appwrite";

export const appwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "",
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? "",
  databaseId: APPWRITE_DATABASE_IDS.core,
  bucketId: APPWRITE_STORAGE_BUCKET_IDS.media,
  addressesCollectionId: APPWRITE_COLLECTION_IDS.addresses,
  ordersCollectionId: APPWRITE_COLLECTION_IDS.orders,
  reviewsCollectionId: APPWRITE_COLLECTION_IDS.reviews,
  userProfilesCollectionId: APPWRITE_COLLECTION_IDS.userProfiles,
  wishlistsCollectionId: APPWRITE_COLLECTION_IDS.wishlists,
  apiKey: process.env.APPWRITE_API_KEY ?? "",
  catalog: {
    bannersCollectionId: APPWRITE_COLLECTION_IDS.banners,
    brandsCollectionId: APPWRITE_COLLECTION_IDS.brands,
    categoriesCollectionId: APPWRITE_COLLECTION_IDS.categories,
    couponsCollectionId: APPWRITE_COLLECTION_IDS.coupons,
    productsCollectionId: APPWRITE_COLLECTION_IDS.products,
    enableMockFallback:
      process.env.NEXT_PUBLIC_ENABLE_CATALOG_MOCKS === "true",
  },
} as const;

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
  ordersCollectionId: APPWRITE_COLLECTION_IDS.orders,
  userProfilesCollectionId: APPWRITE_COLLECTION_IDS.userProfiles,
  apiKey: process.env.APPWRITE_API_KEY ?? "",
  catalog: {
    brandsCollectionId: APPWRITE_COLLECTION_IDS.brands,
    categoriesCollectionId: APPWRITE_COLLECTION_IDS.categories,
    productsCollectionId: APPWRITE_COLLECTION_IDS.products,
    enableMockFallback:
      process.env.NEXT_PUBLIC_ENABLE_CATALOG_MOCKS === "true",
  },
} as const;

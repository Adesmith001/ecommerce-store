import { Query } from "appwrite";
import { appwriteDatabases } from "@/lib/appwrite/client";
import { appwriteConfig } from "@/lib/appwrite/config";
import { mapBannerDocumentToHomepageBanner } from "@/lib/catalog/catalog-mappers";
import type { AppwriteBannerDocument, HomepageBanner } from "@/types/catalog";

function canReadBanners() {
  return Boolean(
    appwriteConfig.databaseId && appwriteConfig.catalog.bannersCollectionId,
  );
}

function sortBannersByPriority(documents: HomepageBanner[]) {
  return [...documents].sort((left, right) => left.sortOrder - right.sortOrder);
}

export async function getHomepageBanners() {
  if (!canReadBanners()) {
    return [];
  }

  try {
    const response = await appwriteDatabases.listDocuments<AppwriteBannerDocument>({
      collectionId: appwriteConfig.catalog.bannersCollectionId,
      databaseId: appwriteConfig.databaseId,
      queries: [Query.equal("active", true), Query.orderAsc("sortOrder")],
      total: false,
    });

    return sortBannersByPriority(
      response.documents.map(mapBannerDocumentToHomepageBanner).filter((banner) => banner.active),
    );
  } catch (error) {
    console.error("Failed to load homepage banners.", error);

    return [];
  }
}

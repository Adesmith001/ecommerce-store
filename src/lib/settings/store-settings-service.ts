import "server-only";

import { ID, Query } from "appwrite";
import { APP_NAME } from "@/constants/app";
import { APPWRITE_COLLECTION_IDS } from "@/constants/appwrite";
import { ROUTES } from "@/constants/routes";
import { STORE_TAGLINE } from "@/constants/storefront";
import { appwriteConfig } from "@/lib/appwrite/config";
import {
  buildAppwriteApiUrl,
  getAppwriteErrorMessage,
  logAppwriteReadFallback,
} from "@/lib/appwrite/server-api";
import type { ProductImage } from "@/types/catalog";
import type {
  StoreContentPage,
  StoreContentPageFormValues,
  StoreContentPageSlug,
  StoreSettings,
  StoreSettingsFormValues,
} from "@/types/store-settings";

type AppwriteDocumentListResponse<T> = {
  documents: Array<T & { $id: string; $updatedAt?: string }>;
};

type RawStoreSettingsDocument = {
  $id: string;
  aboutCardCtaLabel?: string;
  aboutCardEyebrow?: string;
  announcementBarText?: string;
  campaignBannerEyebrow?: string;
  campaignDescription?: string;
  campaignEyebrow?: string;
  campaignPrimaryCtaHref?: string;
  campaignPrimaryCtaLabel?: string;
  campaignSecondaryCtaHref?: string;
  campaignSecondaryCtaLabel?: string;
  campaignTitle?: string;
  contactEmail?: string;
  currencyCode?: string;
  featuredCategoriesDescription?: string;
  featuredCategoriesEyebrow?: string;
  featuredCategoriesTitle?: string;
  featuredProductsCtaLabel?: string;
  featuredProductsDescription?: string;
  featuredProductsEyebrow?: string;
  featuredProductsTitle?: string;
  heroDescription?: string;
  heroEyebrow?: string;
  heroPrimaryCtaHref?: string;
  heroPrimaryCtaLabel?: string;
  heroSecondaryCtaHref?: string;
  heroSecondaryCtaLabel?: string;
  heroTitle?: string;
  homepageMetricsCatalogDescription?: string;
  homepageMetricsCatalogEyebrow?: string;
  homeMetricsCollectionDesc?: string;
  homepageMetricsCollectionsDescription?: string;
  homepageMetricsCollectionsEyebrow?: string;
  homepageMetricsCurrencyDescription?: string;
  homepageMetricsCurrencyEyebrow?: string;
  identityCtaHref?: string;
  identityCtaLabel?: string;
  identityDescription?: string;
  identityEyebrow?: string;
  identityTitle?: string;
  instagramUrl?: string;
  key?: string;
  logo?: unknown;
  newsletterDescription?: string;
  newsletterDisclaimer?: string;
  newsletterEyebrow?: string;
  newsletterPlaceholder?: string;
  newsletterPrimaryCtaLabel?: string;
  newsletterTitle?: string;
  newArrivalsDescription?: string;
  newArrivalsEyebrow?: string;
  newArrivalsTitle?: string;
  phoneNumber?: string;
  pinterestUrl?: string;
  seoDescription?: string;
  seoTitle?: string;
  serviceDescription?: string;
  serviceEyebrow?: string;
  serviceSupportCardEyebrow?: string;
  serviceSupportCardTitle?: string;
  serviceTitle?: string;
  showBestSellers?: boolean;
  showFeaturedCategories?: boolean;
  showNewArrivals?: boolean;
  showNewsletter?: boolean;
  storeName?: string;
  supportText?: string;
  tagline?: string;
  tiktokUrl?: string;
};

type RawStoreContentPageDocument = {
  $id: string;
  $updatedAt?: string;
  body?: string;
  description?: string;
  eyebrow?: string;
  seoDescription?: string;
  seoTitle?: string;
  slug?: StoreContentPageSlug;
  title?: string;
};

const STORE_SETTINGS_KEY = "storefront";
const STORE_CONTENT_PAGE_SPECS: Array<{
  slug: StoreContentPageSlug;
  title: string;
  eyebrow: string;
  description: string;
  body: string;
}> = [
  {
    body: "Tell your brand story here. This section can introduce the store, the product philosophy, and what customers should expect from the shopping experience.",
    description:
      "Share the brand story, product philosophy, and what makes the store distinct.",
    eyebrow: "About",
    slug: "about",
    title: "About us",
  },
  {
    body: "Use this page for data handling, cookies, customer privacy commitments, and any legal copy covering how customer information is stored and processed.",
    description:
      "Explain data handling, privacy commitments, and cookie usage.",
    eyebrow: "Policy",
    slug: "privacy-policy",
    title: "Privacy policy",
  },
  {
    body: "Use this page for return windows, condition requirements, exchanges, refunds, and any product eligibility rules you want customers to understand before purchase.",
    description: "Explain returns, refunds, and exchange expectations clearly.",
    eyebrow: "Policy",
    slug: "returns-policy",
    title: "Returns policy",
  },
  {
    body: "Use this page for shipping timelines, order processing expectations, dispatch schedules, and support guidance for delivery-related questions.",
    description: "Explain processing timelines and delivery expectations.",
    eyebrow: "Policy",
    slug: "shipping-information",
    title: "Shipping information",
  },
  {
    body: "Use this page for purchase terms, acceptable use, disclaimers, and any legal terms customers should accept before completing an order.",
    description:
      "Set out the core terms and conditions for shopping with the store.",
    eyebrow: "Policy",
    slug: "terms-and-conditions",
    title: "Terms and conditions",
  },
];

function getDefaultStoreSettings(): StoreSettings {
  return {
    aboutCardCtaLabel: "Learn more",
    aboutCardEyebrow: "About the brand",
    announcementBarText: "Free signature delivery on orders above NGN 75,000.",
    campaignBannerEyebrow: "Featured campaign",
    campaignDescription:
      "Launch limited offers, storytelling drops, and seasonal edits without touching the codebase.",
    campaignEyebrow: "Campaign",
    campaignPrimaryCtaHref: ROUTES.storefront.shop,
    campaignPrimaryCtaLabel: "Shop the campaign",
    campaignSecondaryCtaHref: ROUTES.storefront.contact,
    campaignSecondaryCtaLabel: "Talk to us",
    campaignTitle: "Launch live merchandising moments from the admin panel",
    contactEmail: "hello@asterstore.com",
    currencyCode: "NGN",
    featuredCategoriesDescription:
      "Browse real categories and current catalog sections managed from the backend.",
    featuredCategoriesEyebrow: "Featured categories",
    featuredCategoriesTitle: "Collection edits made for real discovery",
    featuredProductsCtaLabel: "View all products",
    featuredProductsDescription:
      "Featured catalog products selected from the current Appwrite product data.",
    featuredProductsEyebrow: "Featured products",
    featuredProductsTitle:
      "Customer-facing product cards powered by your live catalog",
    heroDescription:
      "A softer, editorial storefront built around premium product storytelling, calm navigation, and a checkout path that already feels trustworthy.",
    heroEyebrow: "New season collection",
    heroPrimaryCtaHref: ROUTES.storefront.shop,
    heroPrimaryCtaLabel: "Start shopping",
    heroSecondaryCtaHref: ROUTES.storefront.categories,
    heroSecondaryCtaLabel: "Explore collections",
    heroTitle: "Best leather bag collection for the way people actually shop.",
    homepageMetricsCatalogDescription: "Active products",
    homepageMetricsCatalogEyebrow: "Catalog",
    homeMetricsCollectionDesc: "Live categories",
    homepageMetricsCollectionsEyebrow: "Collections",
    homepageMetricsCurrencyDescription: "Naira checkout",
    homepageMetricsCurrencyEyebrow: "Currency",
    id: "storefront-default",
    identityCtaHref: ROUTES.storefront.about,
    identityCtaLabel: "Read our story",
    identityDescription:
      "Shape the first impression of the storefront with flexible brand storytelling and support copy managed from the admin panel.",
    identityEyebrow: "Storefront identity",
    identityTitle: APP_NAME,
    instagramUrl: "#",
    logo: null,
    newsletterDescription:
      "Invite customers to stay close to new drops, private offers, and brand updates.",
    newsletterDisclaimer:
      "Integration can be added later without changing the layout.",
    newsletterEyebrow: "Newsletter",
    newsletterPlaceholder: "Enter your email here",
    newsletterPrimaryCtaLabel: "Join the list",
    newsletterTitle: "Stay close to your customers between drops",
    newArrivalsDescription:
      "Fresh arrivals come straight from the latest active products in the catalog.",
    newArrivalsEyebrow: "New arrivals",
    newArrivalsTitle: "Recently added products from the live catalog",
    phoneNumber: "+234 800 000 0000",
    pinterestUrl: "#",
    seoDescription:
      "Shop curated fashion, accessories, and elevated essentials with a premium ecommerce experience.",
    seoTitle: APP_NAME,
    serviceDescription:
      "Core trust messaging now comes from live shipping and support configuration.",
    serviceEyebrow: "Service",
    serviceSupportCardEyebrow: "Support",
    serviceSupportCardTitle:
      "Help customers shop with confidence before and after delivery",
    serviceTitle: "Support, delivery, and policy messaging that stays on-brand",
    showBestSellers: true,
    showFeaturedCategories: true,
    showNewArrivals: true,
    showNewsletter: true,
    storeName: APP_NAME,
    supportText:
      "Reach out for order questions, product guidance, or any support you need before and after checkout.",
    tagline: STORE_TAGLINE,
    tiktokUrl: "#",
  };
}

function getDefaultContentPages(): StoreContentPage[] {
  return STORE_CONTENT_PAGE_SPECS.map((page) => ({
    ...page,
    id: page.slug,
    seoDescription: page.description,
    seoTitle: page.title,
    updatedAt: "",
  }));
}

function parseImage(value: unknown): ProductImage | null {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as ProductImage;
      return parsed?.url ? parsed : null;
    } catch {
      return value
        ? {
            alt: "",
            id: "store-logo",
            isPrimary: true,
            url: value,
          }
        : null;
    }
  }

  if (typeof value === "object" && value !== null && "url" in value) {
    const image = value as Partial<ProductImage>;
    return image.url
      ? {
          alt: image.alt ?? "",
          id: image.id ?? image.publicId ?? "store-logo",
          isPrimary: image.isPrimary ?? true,
          publicId: image.publicId,
          url: image.url,
        }
      : null;
  }

  return null;
}

function hasSettingsConfig() {
  return Boolean(
    appwriteConfig.endpoint &&
      appwriteConfig.projectId &&
      appwriteConfig.databaseId &&
      appwriteConfig.apiKey &&
      APPWRITE_COLLECTION_IDS.storeSettings &&
      APPWRITE_COLLECTION_IDS.storeContentPages,
  );
}

function createHeaders() {
  return {
    "Content-Type": "application/json",
    "X-Appwrite-Key": appwriteConfig.apiKey,
    "X-Appwrite-Project": appwriteConfig.projectId,
  };
}

function getCollectionUrl(collectionId: string) {
  return buildAppwriteApiUrl(
    `databases/${appwriteConfig.databaseId}/collections/${collectionId}/documents`,
  );
}

function getDocumentUrl(collectionId: string, documentId: string) {
  return buildAppwriteApiUrl(
    `databases/${appwriteConfig.databaseId}/collections/${collectionId}/documents/${documentId}`,
  );
}

function mapStoreSettingsDocument(
  document: RawStoreSettingsDocument,
): StoreSettings {
  const fallback = getDefaultStoreSettings();

  return {
    aboutCardCtaLabel: document.aboutCardCtaLabel ?? fallback.aboutCardCtaLabel,
    aboutCardEyebrow: document.aboutCardEyebrow ?? fallback.aboutCardEyebrow,
    announcementBarText:
      document.announcementBarText ?? fallback.announcementBarText,
    campaignBannerEyebrow:
      document.campaignBannerEyebrow ?? fallback.campaignBannerEyebrow,
    campaignDescription:
      document.campaignDescription ?? fallback.campaignDescription,
    campaignEyebrow: document.campaignEyebrow ?? fallback.campaignEyebrow,
    campaignPrimaryCtaHref:
      document.campaignPrimaryCtaHref ?? fallback.campaignPrimaryCtaHref,
    campaignPrimaryCtaLabel:
      document.campaignPrimaryCtaLabel ?? fallback.campaignPrimaryCtaLabel,
    campaignSecondaryCtaHref:
      document.campaignSecondaryCtaHref ?? fallback.campaignSecondaryCtaHref,
    campaignSecondaryCtaLabel:
      document.campaignSecondaryCtaLabel ?? fallback.campaignSecondaryCtaLabel,
    campaignTitle: document.campaignTitle ?? fallback.campaignTitle,
    contactEmail: document.contactEmail ?? fallback.contactEmail,
    currencyCode: document.currencyCode ?? fallback.currencyCode,
    featuredCategoriesDescription:
      document.featuredCategoriesDescription ??
      fallback.featuredCategoriesDescription,
    featuredCategoriesEyebrow:
      document.featuredCategoriesEyebrow ?? fallback.featuredCategoriesEyebrow,
    featuredCategoriesTitle:
      document.featuredCategoriesTitle ?? fallback.featuredCategoriesTitle,
    featuredProductsCtaLabel:
      document.featuredProductsCtaLabel ?? fallback.featuredProductsCtaLabel,
    featuredProductsDescription:
      document.featuredProductsDescription ??
      fallback.featuredProductsDescription,
    featuredProductsEyebrow:
      document.featuredProductsEyebrow ?? fallback.featuredProductsEyebrow,
    featuredProductsTitle:
      document.featuredProductsTitle ?? fallback.featuredProductsTitle,
    heroDescription: document.heroDescription ?? fallback.heroDescription,
    heroEyebrow: document.heroEyebrow ?? fallback.heroEyebrow,
    heroPrimaryCtaHref:
      document.heroPrimaryCtaHref ?? fallback.heroPrimaryCtaHref,
    heroPrimaryCtaLabel:
      document.heroPrimaryCtaLabel ?? fallback.heroPrimaryCtaLabel,
    heroSecondaryCtaHref:
      document.heroSecondaryCtaHref ?? fallback.heroSecondaryCtaHref,
    heroSecondaryCtaLabel:
      document.heroSecondaryCtaLabel ?? fallback.heroSecondaryCtaLabel,
    heroTitle: document.heroTitle ?? fallback.heroTitle,
    homepageMetricsCatalogDescription:
      document.homepageMetricsCatalogDescription ??
      fallback.homepageMetricsCatalogDescription,
    homepageMetricsCatalogEyebrow:
      document.homepageMetricsCatalogEyebrow ??
      fallback.homepageMetricsCatalogEyebrow,
    homeMetricsCollectionDesc:
      document.homeMetricsCollectionDesc ??
      document.homepageMetricsCollectionsDescription ??
      fallback.homeMetricsCollectionDesc,
    homepageMetricsCollectionsEyebrow:
      document.homepageMetricsCollectionsEyebrow ??
      fallback.homepageMetricsCollectionsEyebrow,
    homepageMetricsCurrencyDescription:
      document.homepageMetricsCurrencyDescription ??
      fallback.homepageMetricsCurrencyDescription,
    homepageMetricsCurrencyEyebrow:
      document.homepageMetricsCurrencyEyebrow ??
      fallback.homepageMetricsCurrencyEyebrow,
    id: document.$id,
    identityCtaHref: document.identityCtaHref ?? fallback.identityCtaHref,
    identityCtaLabel: document.identityCtaLabel ?? fallback.identityCtaLabel,
    identityDescription:
      document.identityDescription ?? fallback.identityDescription,
    identityEyebrow: document.identityEyebrow ?? fallback.identityEyebrow,
    identityTitle: document.identityTitle ?? fallback.identityTitle,
    instagramUrl: document.instagramUrl ?? fallback.instagramUrl,
    logo: parseImage(document.logo),
    newsletterDescription:
      document.newsletterDescription ?? fallback.newsletterDescription,
    newsletterDisclaimer:
      document.newsletterDisclaimer ?? fallback.newsletterDisclaimer,
    newsletterEyebrow: document.newsletterEyebrow ?? fallback.newsletterEyebrow,
    newsletterPlaceholder:
      document.newsletterPlaceholder ?? fallback.newsletterPlaceholder,
    newsletterPrimaryCtaLabel:
      document.newsletterPrimaryCtaLabel ?? fallback.newsletterPrimaryCtaLabel,
    newsletterTitle: document.newsletterTitle ?? fallback.newsletterTitle,
    newArrivalsDescription:
      document.newArrivalsDescription ?? fallback.newArrivalsDescription,
    newArrivalsEyebrow:
      document.newArrivalsEyebrow ?? fallback.newArrivalsEyebrow,
    newArrivalsTitle: document.newArrivalsTitle ?? fallback.newArrivalsTitle,
    phoneNumber: document.phoneNumber ?? fallback.phoneNumber,
    pinterestUrl: document.pinterestUrl ?? fallback.pinterestUrl,
    seoDescription: document.seoDescription ?? fallback.seoDescription,
    seoTitle: document.seoTitle ?? fallback.seoTitle,
    serviceDescription:
      document.serviceDescription ?? fallback.serviceDescription,
    serviceEyebrow: document.serviceEyebrow ?? fallback.serviceEyebrow,
    serviceSupportCardEyebrow:
      document.serviceSupportCardEyebrow ?? fallback.serviceSupportCardEyebrow,
    serviceSupportCardTitle:
      document.serviceSupportCardTitle ?? fallback.serviceSupportCardTitle,
    serviceTitle: document.serviceTitle ?? fallback.serviceTitle,
    showBestSellers: document.showBestSellers ?? fallback.showBestSellers,
    showFeaturedCategories:
      document.showFeaturedCategories ?? fallback.showFeaturedCategories,
    showNewArrivals: document.showNewArrivals ?? fallback.showNewArrivals,
    showNewsletter: document.showNewsletter ?? fallback.showNewsletter,
    storeName: document.storeName ?? fallback.storeName,
    supportText: document.supportText ?? fallback.supportText,
    tagline: document.tagline ?? fallback.tagline,
    tiktokUrl: document.tiktokUrl ?? fallback.tiktokUrl,
  };
}

function mapStoreContentPageDocument(
  document: RawStoreContentPageDocument,
): StoreContentPage {
  const fallback =
    getDefaultContentPages().find((page) => page.slug === document.slug) ??
    getDefaultContentPages()[0];

  return {
    body: document.body ?? fallback.body,
    description: document.description ?? fallback.description,
    eyebrow: document.eyebrow ?? fallback.eyebrow,
    id: document.$id,
    seoDescription: document.seoDescription ?? fallback.seoDescription,
    seoTitle: document.seoTitle ?? fallback.seoTitle,
    slug: document.slug ?? fallback.slug,
    title: document.title ?? fallback.title,
    updatedAt: document.$updatedAt ?? fallback.updatedAt,
  };
}

async function querySingleDocument<T>(collectionId: string, queries: string[]) {
  const url = getCollectionUrl(collectionId);

  for (const query of queries) {
    url.searchParams.append("queries[]", query);
  }

  url.searchParams.append("queries[]", Query.limit(1));

  const response = await fetch(url, {
    cache: "no-store",
    headers: createHeaders(),
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(
        response,
        "Failed to query Appwrite settings.",
      ),
    );
  }

  const payload = (await response.json()) as AppwriteDocumentListResponse<T>;

  return payload.documents[0] ?? null;
}

async function listDocuments<T>(collectionId: string, queries: string[] = []) {
  const url = getCollectionUrl(collectionId);

  for (const query of queries) {
    url.searchParams.append("queries[]", query);
  }

  const response = await fetch(url, {
    cache: "no-store",
    headers: createHeaders(),
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(
        response,
        "Failed to query Appwrite settings.",
      ),
    );
  }

  const payload = (await response.json()) as AppwriteDocumentListResponse<T>;

  return payload.documents;
}

async function createDocument(
  collectionId: string,
  documentId: string,
  data: Record<string, unknown>,
) {
  const response = await fetch(getCollectionUrl(collectionId), {
    body: JSON.stringify({ data, documentId }),
    cache: "no-store",
    headers: createHeaders(),
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(
        response,
        "Failed to create Appwrite document.",
      ),
    );
  }

  return response.json();
}

async function patchDocument(
  collectionId: string,
  documentId: string,
  data: Record<string, unknown>,
) {
  const response = await fetch(getDocumentUrl(collectionId, documentId), {
    body: JSON.stringify({ data }),
    cache: "no-store",
    headers: createHeaders(),
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(
        response,
        "Failed to update Appwrite document.",
      ),
    );
  }

  return response.json();
}

function normalizeStoreSettingsInput(
  values: StoreSettingsFormValues,
): Record<string, unknown> {
  return {
    aboutCardCtaLabel: values.aboutCardCtaLabel.trim(),
    aboutCardEyebrow: values.aboutCardEyebrow.trim(),
    announcementBarText: values.announcementBarText.trim(),
    campaignBannerEyebrow: values.campaignBannerEyebrow.trim(),
    campaignDescription: values.campaignDescription.trim(),
    campaignEyebrow: values.campaignEyebrow.trim(),
    campaignPrimaryCtaHref: values.campaignPrimaryCtaHref.trim(),
    campaignPrimaryCtaLabel: values.campaignPrimaryCtaLabel.trim(),
    campaignSecondaryCtaHref: values.campaignSecondaryCtaHref.trim(),
    campaignSecondaryCtaLabel: values.campaignSecondaryCtaLabel.trim(),
    campaignTitle: values.campaignTitle.trim(),
    contactEmail: values.contactEmail.trim(),
    currencyCode: "NGN",
    featuredCategoriesDescription: values.featuredCategoriesDescription.trim(),
    featuredCategoriesEyebrow: values.featuredCategoriesEyebrow.trim(),
    featuredCategoriesTitle: values.featuredCategoriesTitle.trim(),
    featuredProductsCtaLabel: values.featuredProductsCtaLabel.trim(),
    featuredProductsDescription: values.featuredProductsDescription.trim(),
    featuredProductsEyebrow: values.featuredProductsEyebrow.trim(),
    featuredProductsTitle: values.featuredProductsTitle.trim(),
    heroDescription: values.heroDescription.trim(),
    heroEyebrow: values.heroEyebrow.trim(),
    heroPrimaryCtaHref: values.heroPrimaryCtaHref.trim(),
    heroPrimaryCtaLabel: values.heroPrimaryCtaLabel.trim(),
    heroSecondaryCtaHref: values.heroSecondaryCtaHref.trim(),
    heroSecondaryCtaLabel: values.heroSecondaryCtaLabel.trim(),
    heroTitle: values.heroTitle.trim(),
    homepageMetricsCatalogDescription: values.homepageMetricsCatalogDescription.trim(),
    homepageMetricsCatalogEyebrow: values.homepageMetricsCatalogEyebrow.trim(),
    homeMetricsCollectionDesc: values.homeMetricsCollectionDesc.trim(),
    homepageMetricsCollectionsEyebrow: values.homepageMetricsCollectionsEyebrow.trim(),
    homepageMetricsCurrencyDescription: values.homepageMetricsCurrencyDescription.trim(),
    homepageMetricsCurrencyEyebrow: values.homepageMetricsCurrencyEyebrow.trim(),
    identityCtaHref: values.identityCtaHref.trim(),
    identityCtaLabel: values.identityCtaLabel.trim(),
    identityDescription: values.identityDescription.trim(),
    identityEyebrow: values.identityEyebrow.trim(),
    identityTitle: values.identityTitle.trim(),
    instagramUrl: values.instagramUrl.trim(),
    key: STORE_SETTINGS_KEY,
    logo: values.logo ? JSON.stringify(values.logo) : "",
    newsletterDescription: values.newsletterDescription.trim(),
    newsletterDisclaimer: values.newsletterDisclaimer.trim(),
    newsletterEyebrow: values.newsletterEyebrow.trim(),
    newsletterPlaceholder: values.newsletterPlaceholder.trim(),
    newsletterPrimaryCtaLabel: values.newsletterPrimaryCtaLabel.trim(),
    newsletterTitle: values.newsletterTitle.trim(),
    newArrivalsDescription: values.newArrivalsDescription.trim(),
    newArrivalsEyebrow: values.newArrivalsEyebrow.trim(),
    newArrivalsTitle: values.newArrivalsTitle.trim(),
    phoneNumber: values.phoneNumber.trim(),
    pinterestUrl: values.pinterestUrl.trim(),
    seoDescription: values.seoDescription.trim(),
    seoTitle: values.seoTitle.trim(),
    serviceDescription: values.serviceDescription.trim(),
    serviceEyebrow: values.serviceEyebrow.trim(),
    serviceSupportCardEyebrow: values.serviceSupportCardEyebrow.trim(),
    serviceSupportCardTitle: values.serviceSupportCardTitle.trim(),
    serviceTitle: values.serviceTitle.trim(),
    showBestSellers: values.showBestSellers,
    showFeaturedCategories: values.showFeaturedCategories,
    showNewArrivals: values.showNewArrivals,
    showNewsletter: values.showNewsletter,
    storeName: values.storeName.trim(),
    supportText: values.supportText.trim(),
    tagline: values.tagline.trim(),
    tiktokUrl: values.tiktokUrl.trim(),
  };
}

export async function getStoreSettings() {
  if (!hasSettingsConfig()) {
    return getDefaultStoreSettings();
  }

  try {
    const document = await querySingleDocument<RawStoreSettingsDocument>(
      APPWRITE_COLLECTION_IDS.storeSettings,
      [Query.equal("key", STORE_SETTINGS_KEY)],
    );

    return document
      ? mapStoreSettingsDocument(document)
      : getDefaultStoreSettings();
  } catch (error) {
    logAppwriteReadFallback(
      "Store settings service error: getStoreSettings",
      error,
      "Using default storefront settings.",
    );
    return getDefaultStoreSettings();
  }
}

export async function listStoreContentPages() {
  if (!hasSettingsConfig()) {
    return getDefaultContentPages();
  }

  try {
    const documents = await listDocuments<RawStoreContentPageDocument>(
      APPWRITE_COLLECTION_IDS.storeContentPages,
      [Query.orderAsc("slug")],
    );
    const defaults = getDefaultContentPages();
    const mapped = documents.map(mapStoreContentPageDocument);

    return defaults.map(
      (page) => mapped.find((entry) => entry.slug === page.slug) ?? page,
    );
  } catch (error) {
    logAppwriteReadFallback(
      "Store settings service error: listStoreContentPages",
      error,
      "Using default storefront content pages.",
    );
    return getDefaultContentPages();
  }
}

export async function getStoreContentPage(slug: StoreContentPageSlug) {
  const pages = await listStoreContentPages();
  return pages.find((page) => page.slug === slug) ?? null;
}

export async function upsertStoreSettings(values: StoreSettingsFormValues) {
  if (!hasSettingsConfig()) {
    throw new Error("Appwrite store settings storage is not configured.");
  }

  const data = normalizeStoreSettingsInput(values);
  const existing = await querySingleDocument<RawStoreSettingsDocument>(
    APPWRITE_COLLECTION_IDS.storeSettings,
    [Query.equal("key", STORE_SETTINGS_KEY)],
  );

  if (existing?.$id) {
    const nextDocument = (await patchDocument(
      APPWRITE_COLLECTION_IDS.storeSettings,
      existing.$id,
      data,
    )) as RawStoreSettingsDocument;

    return mapStoreSettingsDocument(nextDocument);
  }

  const nextDocument = (await createDocument(
    APPWRITE_COLLECTION_IDS.storeSettings,
    ID.unique(),
    data,
  )) as RawStoreSettingsDocument;

  return mapStoreSettingsDocument(nextDocument);
}

export async function upsertStoreContentPage(
  values: StoreContentPageFormValues,
) {
  if (!hasSettingsConfig()) {
    throw new Error("Appwrite store content storage is not configured.");
  }

  const existing = await querySingleDocument<RawStoreContentPageDocument>(
    APPWRITE_COLLECTION_IDS.storeContentPages,
    [Query.equal("slug", values.slug)],
  );
  const data = {
    body: values.body.trim(),
    description: values.description.trim(),
    eyebrow: values.eyebrow.trim(),
    seoDescription: values.seoDescription.trim(),
    seoTitle: values.seoTitle.trim(),
    slug: values.slug,
    title: values.title.trim(),
  };

  if (existing?.$id) {
    const nextDocument = (await patchDocument(
      APPWRITE_COLLECTION_IDS.storeContentPages,
      existing.$id,
      data,
    )) as RawStoreContentPageDocument;

    return mapStoreContentPageDocument(nextDocument);
  }

  const nextDocument = (await createDocument(
    APPWRITE_COLLECTION_IDS.storeContentPages,
    ID.unique(),
    data,
  )) as RawStoreContentPageDocument;

  return mapStoreContentPageDocument(nextDocument);
}

export function getStoreContentPageSpecs() {
  return STORE_CONTENT_PAGE_SPECS;
}

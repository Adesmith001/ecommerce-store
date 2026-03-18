import type { ProductImage } from "@/types/catalog";

export type StoreContentPageSlug =
  | "about"
  | "privacy-policy"
  | "returns-policy"
  | "terms-and-conditions"
  | "shipping-information";

export type StoreSettings = {
  aboutCardCtaLabel: string;
  aboutCardEyebrow: string;
  announcementBarText: string;
  campaignBannerEyebrow: string;
  campaignDescription: string;
  campaignEyebrow: string;
  campaignPrimaryCtaHref: string;
  campaignPrimaryCtaLabel: string;
  campaignSecondaryCtaHref: string;
  campaignSecondaryCtaLabel: string;
  campaignTitle: string;
  contactEmail: string;
  currencyCode: string;
  featuredCategoriesDescription: string;
  featuredCategoriesEyebrow: string;
  featuredCategoriesTitle: string;
  featuredProductsCtaLabel: string;
  featuredProductsDescription: string;
  featuredProductsEyebrow: string;
  featuredProductsTitle: string;
  heroDescription: string;
  heroEyebrow: string;
  heroPrimaryCtaHref: string;
  heroPrimaryCtaLabel: string;
  heroSecondaryCtaHref: string;
  heroSecondaryCtaLabel: string;
  heroTitle: string;
  homepageMetricsCatalogDescription: string;
  homepageMetricsCatalogEyebrow: string;
  homeMetricsCollectionDesc: string;
  homepageMetricsCollectionsEyebrow: string;
  homepageMetricsCurrencyDescription: string;
  homepageMetricsCurrencyEyebrow: string;
  id: string;
  identityCtaHref: string;
  identityCtaLabel: string;
  identityDescription: string;
  identityEyebrow: string;
  identityTitle: string;
  instagramUrl: string;
  logo: ProductImage | null;
  newsletterDescription: string;
  newsletterDisclaimer: string;
  newsletterEyebrow: string;
  newsletterPlaceholder: string;
  newsletterPrimaryCtaLabel: string;
  newsletterTitle: string;
  newArrivalsDescription: string;
  newArrivalsEyebrow: string;
  newArrivalsTitle: string;
  phoneNumber: string;
  pinterestUrl: string;
  seoDescription: string;
  seoTitle: string;
  serviceDescription: string;
  serviceEyebrow: string;
  serviceSupportCardEyebrow: string;
  serviceSupportCardTitle: string;
  serviceTitle: string;
  showBestSellers: boolean;
  showFeaturedCategories: boolean;
  showNewArrivals: boolean;
  showNewsletter: boolean;
  storeName: string;
  supportText: string;
  tagline: string;
  tiktokUrl: string;
};

export type StoreContentPage = {
  body: string;
  description: string;
  eyebrow: string;
  id: string;
  seoDescription: string;
  seoTitle: string;
  slug: StoreContentPageSlug;
  title: string;
  updatedAt: string;
};

export type StoreSettingsFormValues = Omit<StoreSettings, "id">;

export type StoreContentPageFormValues = Omit<StoreContentPage, "id" | "updatedAt">;

import type {
  Brand,
  Category,
  HomepageBanner,
  MerchandisingStatus,
  ProductImage,
} from "@/types/catalog";

export type CategoryFormValues = {
  description: string;
  featured: boolean;
  image: ProductImage | null;
  name: string;
  parentCategoryId: string;
  slug: string;
  status: MerchandisingStatus;
};

export type BrandFormValues = {
  description: string;
  image: ProductImage | null;
  name: string;
  slug: string;
  status: MerchandisingStatus;
};

export type BannerFormValues = {
  active: boolean;
  ctaLink: string;
  ctaText: string;
  image: ProductImage | null;
  sortOrder: string;
  subtitle: string;
  title: string;
};

export type CategoryFormErrors = Partial<
  Record<"description" | "image" | "name" | "slug", string>
>;

export type BrandFormErrors = Partial<
  Record<"image" | "name" | "slug", string>
>;

export type BannerFormErrors = Partial<
  Record<"ctaLink" | "ctaText" | "image" | "sortOrder" | "subtitle" | "title", string>
>;

export type CategoryFormContext = {
  initialValues: CategoryFormValues;
  mode: "create" | "edit";
  parentOptions: { id: string; label: string }[];
  categoryId?: string;
};

export type BrandFormContext = {
  initialValues: BrandFormValues;
  mode: "create" | "edit";
  brandId?: string;
};

export type BannerFormContext = {
  initialValues: BannerFormValues;
  mode: "create" | "edit";
  bannerId?: string;
};

export type AdminCategoryRecord = Category;
export type AdminBrandRecord = Brand;
export type AdminBannerRecord = HomepageBanner;

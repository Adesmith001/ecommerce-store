import type { Brand, Category, Product, ProductImage, ProductSpecification, ProductStatus } from "@/types/catalog";

export type AdminProductFormImage = Pick<
  ProductImage,
  "alt" | "id" | "isPrimary" | "publicId" | "url"
>;

export type AdminProductFormSpecification = Pick<
  ProductSpecification,
  "group" | "id" | "label" | "value"
>;

export type AdminProductFormValues = {
  brandId: string;
  categoryId: string;
  featured: boolean;
  fullDescription: string;
  images: AdminProductFormImage[];
  name: string;
  price: string;
  salePrice: string;
  shortDescription: string;
  sku: string;
  slug: string;
  specifications: AdminProductFormSpecification[];
  status: ProductStatus;
  stock: string;
  tags: string;
};

export type AdminProductFormErrors = Partial<
  Record<
    | "brandId"
    | "categoryId"
    | "fullDescription"
    | "images"
    | "name"
    | "price"
    | "salePrice"
    | "shortDescription"
    | "sku"
    | "slug"
    | "status"
    | "stock",
    string
  >
>;

export type AdminProductReferenceOption = {
  id: string;
  label: string;
  slug: string;
};

export type AdminProductFormContext = {
  brands: AdminProductReferenceOption[];
  categories: AdminProductReferenceOption[];
  initialValues: AdminProductFormValues;
  mode: "create" | "edit";
  productId?: string;
};

export type AdminManagedProduct = Product & {
  brandOptionId: string;
  categoryOptionId: string;
};

export type AdminProductListItem = AdminManagedProduct;

export type AdminProductFormOptions = {
  brands: Brand[];
  categories: Category[];
};

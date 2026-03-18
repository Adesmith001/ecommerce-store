import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AdminArchiveProductButton,
  AdminProductStatusBadge,
} from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { formatCurrency } from "@/helpers/format-currency";
import { getAdminProductById } from "@/lib/admin/admin-product-service";

type AdminProductDetailPageProps = {
  params: Promise<{ productId: string }>;
};

export default async function AdminProductDetailPage({
  params,
}: AdminProductDetailPageProps) {
  const { productId } = await params;
  const product = await getAdminProductById(productId);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-5 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <AdminProductStatusBadge status={product.status} />
              {product.featured ? (
                <span className="rounded-full border border-accent/15 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                  Featured
                </span>
              ) : null}
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Product details
              </p>
              <h1 className="font-display mt-3 text-4xl font-semibold tracking-[-0.06em]">
                {product.name}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {product.slug}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href={ROUTES.admin.products}>
              <Button variant="outline">Back to list</Button>
            </Link>
            <Link href={`${ROUTES.admin.products}/${product.id}/edit`}>
              <Button variant="outline">Edit product</Button>
            </Link>
            {product.status !== "archived" ? (
              <AdminArchiveProductButton
                productId={product.id}
                redirectTo={ROUTES.admin.products}
              />
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 text-sm sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.3rem] border border-white/80 bg-white/72 p-4">
            <p className="text-muted-foreground">Base price</p>
            <p className="mt-1 font-medium">{formatCurrency(product.price)}</p>
          </div>
          <div className="rounded-[1.3rem] border border-white/80 bg-white/72 p-4">
            <p className="text-muted-foreground">Sale price</p>
            <p className="mt-1 font-medium">
              {product.salePrice === null ? "No sale price" : formatCurrency(product.salePrice)}
            </p>
          </div>
          <div className="rounded-[1.3rem] border border-white/80 bg-white/72 p-4">
            <p className="text-muted-foreground">Stock</p>
            <p className="mt-1 font-medium">{product.stock}</p>
          </div>
          <div className="rounded-[1.3rem] border border-white/80 bg-white/72 p-4">
            <p className="text-muted-foreground">Category</p>
            <p className="mt-1 font-medium">{product.category?.name ?? "Unassigned"}</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card className="space-y-4 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Product narrative
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
                Descriptions
              </h2>
            </div>
            <div className="space-y-4 text-sm leading-7 text-muted-foreground">
              <p>{product.shortDescription}</p>
              <p>{product.fullDescription}</p>
            </div>
          </Card>

          <Card className="space-y-4 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Specifications
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
                Product facts
              </h2>
            </div>
            <div className="space-y-3">
              {product.specifications.length === 0 ? (
                <p className="text-sm text-muted-foreground">No specifications added yet.</p>
              ) : (
                product.specifications.map((specification) => (
                  <div
                    key={specification.id}
                    className="rounded-[1.3rem] border border-white/80 bg-white/72 px-4 py-3"
                  >
                    <p className="font-medium">{specification.label}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {specification.value}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-4 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Merchandising
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
                Storefront settings
              </h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Brand</span>
                <span className="font-medium">{product.brand?.name ?? "Unassigned"}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Tags</span>
                <span className="font-medium">{product.tags.join(", ") || "None"}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Updated</span>
                <span className="font-medium">
                  {new Date(product.updatedAt).toLocaleDateString("en-US")}
                </span>
              </div>
            </div>
          </Card>

          <Card className="space-y-4 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Media
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
                Images
              </h2>
            </div>
            {product.images.length === 0 ? (
              <p className="text-sm text-muted-foreground">No product images added yet.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {product.images.map((image) => (
                  <div key={image.id} className="overflow-hidden rounded-[1.2rem] bg-surface">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt={image.alt}
                      className="aspect-square w-full object-cover"
                      src={image.url}
                    />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}


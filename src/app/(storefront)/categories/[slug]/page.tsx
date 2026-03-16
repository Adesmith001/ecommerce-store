import { notFound } from "next/navigation";
import { CatalogListingView } from "@/components/storefront/catalog";
import { SectionWrapper, StorePageHero } from "@/components/storefront";
import { ROUTES } from "@/constants/routes";
import { getCategoryBySlug } from "@/lib/catalog";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return (
    <>
      <StorePageHero
        breadcrumbs={[
          { label: "Home", href: ROUTES.storefront.home },
          { label: "Categories", href: ROUTES.storefront.categories },
          { label: category.name },
        ]}
        description={category.description}
        eyebrow="Category"
        title={category.name}
      />
      <SectionWrapper>
        <CatalogListingView lockedCategorySlug={category.slug} />
      </SectionWrapper>
    </>
  );
}

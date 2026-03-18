import { CategoryCard, SectionWrapper, StorePageHero } from "@/components/storefront";
import { EmptyState } from "@/components/ui/empty-state";
import { ROUTES } from "@/constants/routes";
import { getAllCategories, getAllProducts } from "@/lib/catalog/catalog-service";

export default async function CategoriesPage() {
  const [categories, products] = await Promise.all([getAllCategories(), getAllProducts()]);

  const activeCategories = categories.filter((category) => category.status === "active");
  const categoryCards = activeCategories.map((category) => ({
    description: category.description,
    href: ROUTES.storefront.category(category.slug),
    imageUrl: category.image?.url,
    itemCount: products.filter((product) => product.category?.slug === category.slug).length,
    name: category.name,
  }));

  return (
    <>
      <StorePageHero
        breadcrumbs={[
          { label: "Home", href: ROUTES.storefront.home },
          { label: "Categories" },
        ]}
        description="Category landing pages give you room for curated merchandising, collection storytelling, and seasonal navigation."
        eyebrow="Categories"
        title="Discover the catalog by collection"
      />
      <SectionWrapper>
        {categoryCards.length === 0 ? (
          <EmptyState
            description="No live categories are available yet. Add active categories in the admin to populate this page."
            title="No categories available"
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {categoryCards.map((category) => (
              <CategoryCard key={category.href} {...category} />
            ))}
          </div>
        )}
      </SectionWrapper>
    </>
  );
}

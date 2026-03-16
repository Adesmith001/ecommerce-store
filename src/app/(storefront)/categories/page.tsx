import { CategoryCardPlaceholder, SectionWrapper, StorePageHero } from "@/components/storefront";
import { FEATURED_CATEGORIES } from "@/constants/storefront";
import { ROUTES } from "@/constants/routes";

export default function CategoriesPage() {
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
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {FEATURED_CATEGORIES.map((category) => (
            <CategoryCardPlaceholder key={category.href} {...category} />
          ))}
        </div>
      </SectionWrapper>
    </>
  );
}

import Link from "next/link";
import { ProductCard } from "@/components/storefront/catalog";
import {
  CategoryCard,
  PromoBanner,
  SectionWrapper,
} from "@/components/storefront";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import {
  getAllCategories,
  getAllProducts,
  getFeaturedProducts,
} from "@/lib/catalog/catalog-service";
import { getHomepageBanners } from "@/lib/marketing/banner-service";
import {
  getStoreContentPage,
  getStoreSettings,
} from "@/lib/settings/store-settings-service";
import { listActiveShippingMethods } from "@/lib/shipping/shipping-service";

export default async function StorefrontHomePage() {
  const [
    settings,
    aboutPage,
    banners,
    categories,
    allProducts,
    featuredProducts,
    shippingMethods,
  ] = await Promise.all([
    getStoreSettings(),
    getStoreContentPage("about"),
    getHomepageBanners(),
    getAllCategories(),
    getAllProducts(),
    getFeaturedProducts(4),
    listActiveShippingMethods(),
  ]);

  const featuredBanner = banners[0] ?? null;
  const activeProducts = allProducts.filter((product) => product.status === "active");
  const activeCategories = categories.filter((category) => category.status === "active");
  const featuredCategories = activeCategories
    .filter((category) => category.featured)
    .slice(0, 3);
  const categorySource =
    featuredCategories.length > 0 ? featuredCategories : activeCategories.slice(0, 3);
  const categoryCards = categorySource.map((category) => {
    const itemCount = activeProducts.filter(
      (product) => product.category?.slug === category.slug,
    ).length;

    return {
      description: category.description,
      href: ROUTES.storefront.category(category.slug),
      imageUrl: category.image?.url,
      itemCount,
      name: category.name,
    };
  });
  const newArrivals = activeProducts.slice(0, 4);
  const trustCards = shippingMethods.slice(0, 3);

  return (
    <>
      <section className="section-space overflow-hidden pb-8 pt-2">
        <Container className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
            <div className="editorial-panel relative overflow-hidden px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
              <div className="relative z-10 space-y-8">
                <div className="space-y-5">
                  <Badge variant="outline">{settings.heroEyebrow}</Badge>
                  <h1 className="text-display max-w-4xl">{settings.heroTitle}</h1>
                  <p className="max-w-2xl text-body">{settings.heroDescription}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    className={buttonVariants({ size: "lg", variant: "secondary" })}
                    href={settings.heroPrimaryCtaHref || ROUTES.storefront.shop}
                  >
                    {settings.heroPrimaryCtaLabel}
                  </Link>
                  <Link
                    className={buttonVariants({ size: "lg", variant: "outline" })}
                    href={settings.heroSecondaryCtaHref || ROUTES.storefront.categories}
                  >
                    {settings.heroSecondaryCtaLabel}
                  </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Card className="rounded-[1.8rem] p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      {settings.homepageMetricsCatalogEyebrow}
                    </p>
                    <p className="font-display mt-3 text-2xl font-semibold tracking-[-0.06em]">
                      {activeProducts.length}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {settings.homepageMetricsCatalogDescription}
                    </p>
                  </Card>
                  <Card className="rounded-[1.8rem] p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      {settings.homepageMetricsCollectionsEyebrow}
                    </p>
                    <p className="font-display mt-3 text-2xl font-semibold tracking-[-0.06em]">
                      {activeCategories.length}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {settings.homeMetricsCollectionDesc}
                    </p>
                  </Card>
                  <Card className="rounded-[1.8rem] p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      {settings.homepageMetricsCurrencyEyebrow}
                    </p>
                    <p className="font-display mt-3 text-2xl font-semibold tracking-[-0.06em]">
                      {settings.currencyCode}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {settings.homepageMetricsCurrencyDescription}
                    </p>
                  </Card>
                </div>
              </div>

              <div className="headline-marquee pointer-events-none absolute inset-x-0 bottom-0 translate-y-1/3 text-center">
                {settings.storeName}
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <Card className="relative overflow-hidden p-0 sm:col-span-2">
                <div className="grid gap-6 p-6 sm:grid-cols-[1fr_0.78fr] sm:p-8">
                  <div className="space-y-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                      {settings.identityEyebrow}
                    </p>
                    <h2 className="font-display max-w-sm text-3xl font-semibold tracking-[-0.06em]">
                      {settings.identityTitle}
                    </h2>
                    <p className="max-w-md text-sm leading-7 text-muted-foreground">
                      {settings.identityDescription}
                    </p>
                    <Link
                      className={buttonVariants({ variant: "outline" })}
                      href={settings.identityCtaHref || ROUTES.storefront.about}
                    >
                      {settings.identityCtaLabel}
                    </Link>
                  </div>
                  <div className="rounded-4xl bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.86),transparent_28%),linear-gradient(180deg,#d8ebf6,#edf5f9)] p-5">
                    <div className="h-full rounded-[1.8rem] border border-white/80 bg-white/60 p-4">
                      {settings.logo?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          alt={settings.logo.alt || settings.storeName}
                          className="h-full w-full rounded-[1.6rem] object-cover"
                          src={settings.logo.url}
                        />
                      ) : (
                        <div className="headline-marquee text-center">{settings.storeName}</div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {trustCards.map((method) => (
                <Card key={method.id} className="space-y-4 rounded-4xl p-6">
                  <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                    {method.code}
                  </p>
                  <p className="font-display text-2xl font-semibold tracking-[-0.06em]">
                    {method.name}
                  </p>
                  <p className="text-sm leading-7 text-muted-foreground">
                    {method.description} {method.estimatedDelivery}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {settings.showFeaturedCategories ? (
        <SectionWrapper
          description={settings.featuredCategoriesDescription}
          eyebrow={settings.featuredCategoriesEyebrow}
          title={settings.featuredCategoriesTitle}
        >
          {categoryCards.length === 0 ? (
            <Card className="p-6 text-sm text-muted-foreground">
              No active categories are available yet.
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {categoryCards.map((category) => (
                <CategoryCard key={category.href} {...category} />
              ))}
            </div>
          )}
        </SectionWrapper>
      ) : null}

      {settings.showBestSellers ? (
        <SectionWrapper
          actions={
            <Link className={buttonVariants({ variant: "outline" })} href={ROUTES.storefront.shop}>
              {settings.featuredProductsCtaLabel}
            </Link>
          }
          description={settings.featuredProductsDescription}
          eyebrow={settings.featuredProductsEyebrow}
          title={settings.featuredProductsTitle}
        >
          {featuredProducts.length === 0 ? (
            <Card className="p-6 text-sm text-muted-foreground">
              No featured products are available yet.
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </SectionWrapper>
      ) : null}

      <SectionWrapper
        className="pt-8"
        description={settings.serviceDescription}
        eyebrow={settings.serviceEyebrow}
        title={settings.serviceTitle}
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {trustCards.length === 0 ? (
            <Card className="rounded-4xl p-6 text-sm text-muted-foreground">
              No active shipping methods are configured yet.
            </Card>
          ) : (
            trustCards.map((method) => (
              <Card key={method.id} className="rounded-4xl p-6">
                <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                  {method.code}
                </p>
                <p className="font-display mt-4 text-2xl font-semibold tracking-[-0.05em]">
                  {method.name}
                </p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {method.description}
                </p>
              </Card>
            ))
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="space-y-4 p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              {settings.serviceSupportCardEyebrow}
            </p>
            <h3 className="font-display text-3xl font-semibold tracking-[-0.06em]">
              {settings.serviceSupportCardTitle}
            </h3>
            <p className="text-sm leading-7 text-muted-foreground">
              {settings.supportText}
            </p>
            <p className="text-sm leading-7 text-muted-foreground">
              {settings.contactEmail} · {settings.phoneNumber}
            </p>
          </Card>

          <Card className="space-y-4 p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              {settings.aboutCardEyebrow}
            </p>
            <h3 className="font-display text-3xl font-semibold tracking-[-0.06em]">
              {aboutPage?.title || settings.storeName}
            </h3>
            <p className="text-sm leading-7 text-muted-foreground">
              {aboutPage?.description || settings.supportText}
            </p>
            <Link
              className={buttonVariants({ variant: "outline" })}
              href={ROUTES.storefront.about}
            >
              {settings.aboutCardCtaLabel}
            </Link>
          </Card>
        </div>
      </SectionWrapper>

      <SectionWrapper
        className="bg-transparent pt-8"
        description={settings.campaignDescription}
        eyebrow={settings.campaignEyebrow}
        title={settings.campaignTitle}
      >
        <PromoBanner
          ctaHref={featuredBanner?.ctaLink || settings.campaignPrimaryCtaHref}
          ctaLabel={featuredBanner?.ctaText || settings.campaignPrimaryCtaLabel}
          description={featuredBanner?.subtitle || settings.supportText}
          eyebrow={featuredBanner ? settings.campaignBannerEyebrow : settings.campaignEyebrow}
          imageAlt={featuredBanner?.image?.alt}
          imageUrl={featuredBanner?.image?.url}
          secondaryHref={settings.campaignSecondaryCtaHref}
          secondaryLabel={settings.campaignSecondaryCtaLabel}
          title={featuredBanner?.title || settings.heroTitle}
        />
      </SectionWrapper>

      {settings.showNewArrivals ? (
        <SectionWrapper
          description={settings.newArrivalsDescription}
          eyebrow={settings.newArrivalsEyebrow}
          title={settings.newArrivalsTitle}
        >
          {newArrivals.length === 0 ? (
            <Card className="p-6 text-sm text-muted-foreground">
              No active products are available yet.
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </SectionWrapper>
      ) : null}

      {settings.showNewsletter ? (
        <SectionWrapper
          className="pb-20"
          description={settings.newsletterDescription}
          eyebrow={settings.newsletterEyebrow}
          title={settings.newsletterTitle}
        >
          <div className="editorial-panel overflow-hidden px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
              <div className="space-y-4">
                <p className="text-sm leading-7 text-muted-foreground">
                  {settings.supportText}
                </p>
                <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                  <span>{settings.contactEmail}</span>
                  <span>{settings.phoneNumber}</span>
                  <span>{settings.storeName}</span>
                  <span>{settings.currencyCode}</span>
                </div>
              </div>

              <form className="space-y-4">
                <Input placeholder={settings.newsletterPlaceholder} type="email" />
                <div className="flex flex-wrap gap-3">
                  <button
                    className={buttonVariants({ size: "lg", variant: "secondary" })}
                    type="submit"
                  >
                    {settings.newsletterPrimaryCtaLabel}
                  </button>
                  <span className="self-center text-sm text-muted-foreground">
                    {settings.newsletterDisclaimer}
                  </span>
                </div>
              </form>
            </div>
          </div>
        </SectionWrapper>
      ) : null}
    </>
  );
}

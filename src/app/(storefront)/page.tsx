import Link from "next/link";
import { ProductCard } from "@/components/storefront/catalog";
import { PromoBanner } from "@/components/storefront/promo-banner";
import { SectionWrapper } from "@/components/storefront/section-wrapper";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
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

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m20 20-3.5-3.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

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
    .slice(0, 4);
  const categorySource =
    featuredCategories.length > 0 ? featuredCategories : activeCategories.slice(0, 4);
  const heroProducts = activeProducts.slice(0, 3);
  const newThisWeek = featuredProducts.length > 0
    ? featuredProducts
    : activeProducts.slice(0, 4);
  const collectionEdit = activeProducts.slice(0, 3);
  const editorialShots = activeProducts.slice(0, 4);
  const trustCards = shippingMethods.slice(0, 3);

  const categoryCards = categorySource.map((category) => ({
    description: category.description,
    href: ROUTES.storefront.category(category.slug),
    imageUrl: category.image?.url,
    itemCount: activeProducts.filter((product) => product.category?.slug === category.slug)
      .length,
    name: category.name,
  }));

  return (
    <>
      <section className="section-space pb-10 pt-8">
        <Container className="space-y-10">
          <div className="grid gap-8 xl:grid-cols-[240px_minmax(0,1fr)]">
            <aside className="space-y-8 xl:pt-10">
              <div className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  Shop by edit
                </p>
                <div className="grid gap-2 text-sm font-medium uppercase tracking-[0.18em] text-foreground/78">
                  <Link href={ROUTES.storefront.shop}>New arrivals</Link>
                  <Link href={ROUTES.storefront.categories}>Women</Link>
                  <Link href={ROUTES.storefront.categories}>Men</Link>
                  <Link href={ROUTES.storefront.categories}>Accessories</Link>
                </div>
              </div>

              <form action={ROUTES.storefront.shop} className="relative">
                <Input className="pl-11 pr-4" name="q" placeholder="Search" />
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <SearchIcon />
                </span>
              </form>

              <div className="rounded-[1.6rem] border border-border bg-white/55 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  Shipping
                </p>
                <div className="mt-4 space-y-3">
                  {trustCards.length > 0 ? (
                    trustCards.map((method) => (
                      <div key={method.id} className="border-b border-border/70 pb-3 last:border-b-0 last:pb-0">
                        <p className="font-display text-lg font-bold tracking-[-0.05em]">
                          {method.name}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {method.estimatedDelivery || method.description}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Fast shipping updates will appear here when configured.
                    </p>
                  )}
                </div>
              </div>
            </aside>

            <div className="space-y-10">
              <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_1.08fr]">
                <div className="space-y-8">
                  <div className="space-y-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      {settings.heroEyebrow}
                    </p>
                    <h1 className="text-display max-w-[12ch]">
                      {settings.heroTitle}
                    </h1>
                    <p className="max-w-xl text-body">{settings.heroDescription}</p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      className={buttonVariants({ className: "min-w-44", size: "lg" })}
                      href={settings.heroPrimaryCtaHref || ROUTES.storefront.shop}
                    >
                      {settings.heroPrimaryCtaLabel}
                    </Link>
                    <Link
                      className={buttonVariants({
                        className: "min-w-44",
                        size: "lg",
                        variant: "outline",
                      })}
                      href={settings.heroSecondaryCtaHref || ROUTES.storefront.categories}
                    >
                      {settings.heroSecondaryCtaLabel}
                    </Link>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <Card className="rounded-[1.6rem] bg-white/50 p-5">
                      <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
                        Catalog
                      </p>
                      <p className="font-display mt-3 text-4xl font-bold tracking-[-0.08em]">
                        {activeProducts.length}
                      </p>
                    </Card>
                    <Card className="rounded-[1.6rem] bg-white/50 p-5">
                      <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
                        Collections
                      </p>
                      <p className="font-display mt-3 text-4xl font-bold tracking-[-0.08em]">
                        {activeCategories.length}
                      </p>
                    </Card>
                    <Card className="rounded-[1.6rem] bg-white/50 p-5">
                      <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
                        Currency
                      </p>
                      <p className="font-display mt-3 text-4xl font-bold tracking-[-0.08em]">
                        {settings.currencyCode}
                      </p>
                    </Card>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="overflow-hidden rounded-[1.8rem] border border-border bg-[#ece8e1]">
                    {featuredBanner?.image?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        alt={featuredBanner.image.alt || featuredBanner.title}
                        className="aspect-[4/5] h-full w-full object-cover"
                        src={featuredBanner.image.url}
                      />
                    ) : heroProducts[0]?.images[0]?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        alt={heroProducts[0].images[0].alt}
                        className="aspect-[4/5] h-full w-full object-cover"
                        src={heroProducts[0].images[0].url}
                      />
                    ) : (
                      <div className="aspect-[4/5] bg-[linear-gradient(180deg,#ebe6de,#dcd5ca)]" />
                    )}
                  </div>

                  <div className="grid gap-4">
                    {heroProducts.slice(1, 3).map((product) => (
                      <div
                        key={product.id}
                        className="overflow-hidden rounded-[1.8rem] border border-border bg-[#ece8e1]"
                      >
                        {product.images[0]?.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            alt={product.images[0].alt}
                            className="aspect-[4/5] w-full object-cover"
                            src={product.images[0].url}
                          />
                        ) : (
                          <div className="aspect-[4/5] bg-[linear-gradient(180deg,#ebe6de,#dcd5ca)]" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 border-t border-border/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    New collection
                  </p>
                  <p className="mt-2 font-display text-4xl font-bold uppercase tracking-[-0.08em] sm:text-5xl">
                    Summer 2026
                  </p>
                </div>
                <p className="max-w-xl text-sm leading-7 text-muted-foreground">
                  {featuredBanner?.subtitle || settings.identityDescription}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <SectionWrapper
        actions={
          <Link className="text-sm font-medium uppercase tracking-[0.16em]" href={ROUTES.storefront.shop}>
            See all
          </Link>
        }
        description="A sharp four-piece edit pulled from the live catalog so the homepage always feels current."
        eyebrow="New This Week"
        title="Pieces with clean lines and immediate presence"
      >
        {newThisWeek.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {newThisWeek.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <Card className="text-sm text-muted-foreground">
            Products will appear here once active merchandise is available.
          </Card>
        )}
      </SectionWrapper>

      <SectionWrapper
        description="Collections stay grounded in your real category structure, while the layout gives them a more editorial presentation."
        eyebrow="XIV Collections"
        title="Browse the store like a fashion issue"
      >
        {categoryCards.length > 0 ? (
          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="grid gap-6">
              {categoryCards.slice(0, 2).map((category) => (
                <Link
                  key={category.href}
                  className="group rounded-[1.8rem] border border-border bg-white/55 p-6"
                  href={category.href}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                        {category.itemCount} item{category.itemCount === 1 ? "" : "s"}
                      </p>
                      <h3 className="font-display mt-4 text-4xl font-bold uppercase tracking-[-0.08em]">
                        {category.name}
                      </h3>
                    </div>
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-foreground text-lg transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                  <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
                    {category.description}
                  </p>
                </Link>
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {collectionEdit.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : (
          <Card className="text-sm text-muted-foreground">
            Collections will appear here once categories are created.
          </Card>
        )}
      </SectionWrapper>

      <SectionWrapper
        className="pt-8"
        description={aboutPage?.description || settings.supportText}
        eyebrow="Our Approach To Fashion Design"
        title={aboutPage?.title || "A quieter, sharper approach to everyday dressing"}
      >
        <div className="grid gap-10 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <p className="text-body">
              {settings.identityDescription}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="rounded-[1.6rem] bg-white/50 p-5">
                <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                  Identity
                </p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {settings.tagline}
                </p>
              </Card>
              <Card className="rounded-[1.6rem] bg-white/50 p-5">
                <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                  Support
                </p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {settings.contactEmail}
                </p>
              </Card>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {editorialShots.map((product, index) => (
              <div
                key={product.id}
                className={`overflow-hidden rounded-[1.8rem] border border-border bg-[#ece8e1] ${
                  index === 2 ? "sm:translate-y-10" : ""
                } ${index === 3 ? "sm:-translate-y-6" : ""}`}
              >
                {product.images[0]?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt={product.images[0].alt}
                    className="aspect-[4/5] w-full object-cover"
                    src={product.images[0].url}
                  />
                ) : (
                  <div className="aspect-[4/5] bg-[linear-gradient(180deg,#ebe6de,#dcd5ca)]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper className="pt-8">
        <PromoBanner
          ctaHref={featuredBanner?.ctaLink || settings.campaignPrimaryCtaHref}
          ctaLabel={featuredBanner?.ctaText || settings.campaignPrimaryCtaLabel}
          description={featuredBanner?.subtitle || settings.campaignDescription}
          eyebrow={settings.campaignEyebrow}
          imageAlt={featuredBanner?.image?.alt}
          imageUrl={featuredBanner?.image?.url}
          secondaryHref={settings.campaignSecondaryCtaHref}
          secondaryLabel={settings.campaignSecondaryCtaLabel}
          title={featuredBanner?.title || settings.campaignTitle}
        />
      </SectionWrapper>
    </>
  );
}

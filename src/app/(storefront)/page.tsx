import Link from "next/link";
import {
  CategoryCardPlaceholder,
  ProductCardPlaceholder,
  PromoBanner,
  SectionWrapper,
} from "@/components/storefront";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/ui/section-heading";
import { ROUTES } from "@/constants/routes";
import {
  BEST_SELLERS,
  FEATURED_CATEGORIES,
  NEW_ARRIVALS,
  TESTIMONIALS,
  TRUST_HIGHLIGHTS,
} from "@/constants/storefront";

const SUPPORTING_BRANDS = [
  "Nike",
  "Etsy",
  "Reebok",
  "Puma",
  "ASOS",
  "eBay",
  "Zara",
  "adidas",
];

export default function StorefrontHomePage() {
  return (
    <>
      <section className="section-space overflow-hidden pb-8 pt-2">
        <Container className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
            <div className="editorial-panel relative overflow-hidden px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
              <div className="relative z-10 space-y-8">
                <div className="space-y-5">
                  <Badge variant="outline">New season collection</Badge>
                  <h1 className="text-display max-w-4xl">
                    Best leather bag collection for the way people actually shop.
                  </h1>
                  <p className="max-w-2xl text-body">
                    A softer, editorial storefront built around premium product
                    storytelling, calm navigation, and a checkout path that already
                    feels trustworthy before deeper business logic arrives.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    className={buttonVariants({ size: "lg", variant: "secondary" })}
                    href={ROUTES.storefront.shop}
                  >
                    Start shopping
                  </Link>
                  <Link
                    className={buttonVariants({ size: "lg", variant: "outline" })}
                    href={ROUTES.storefront.category("wardrobe-refresh")}
                  >
                    Explore collections
                  </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Card className="rounded-[1.8rem] p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      Season
                    </p>
                    <p className="font-display mt-3 text-2xl font-semibold tracking-[-0.06em]">
                      2026
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">Present edit</p>
                  </Card>
                  <Card className="rounded-[1.8rem] p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      Delivery
                    </p>
                    <p className="font-display mt-3 text-2xl font-semibold tracking-[-0.06em]">
                      48h
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">Express options</p>
                  </Card>
                  <Card className="rounded-[1.8rem] p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      Promise
                    </p>
                    <p className="font-display mt-3 text-2xl font-semibold tracking-[-0.06em]">
                      Easy
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">Returns & support</p>
                  </Card>
                </div>
              </div>

              <div className="headline-marquee pointer-events-none absolute inset-x-0 bottom-0 translate-y-1/3 text-center">
                Bagstore
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <Card className="relative overflow-hidden p-0 sm:col-span-2">
                <div className="grid gap-6 p-6 sm:grid-cols-[1fr_0.78fr] sm:p-8">
                  <div className="space-y-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                      Hero collection
                    </p>
                    <h2 className="font-display max-w-sm text-3xl font-semibold tracking-[-0.06em]">
                      Chelsea Malibu
                    </h2>
                    <p className="max-w-md text-sm leading-7 text-muted-foreground">
                      Clean silhouettes, waterproof finishes, and premium details that
                      make the storefront feel curated from the first glance.
                    </p>
                    <Link
                      className={buttonVariants({ variant: "outline" })}
                      href={ROUTES.storefront.shop}
                    >
                      View all catalog
                    </Link>
                  </div>
                  <div className="rounded-4xl bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.86),transparent_28%),linear-gradient(180deg,#d8ebf6,#edf5f9)] p-5">
                    <div className="h-full rounded-[1.8rem] border border-white/80 bg-white/60 p-4">
                      <div className="headline-marquee text-center">Malibu</div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="space-y-4 rounded-4xl p-6">
                <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                  Payment in 3x
                </p>
                <p className="font-display text-2xl font-semibold tracking-[-0.06em]">
                  Flexible checkout
                </p>
                <p className="text-sm leading-7 text-muted-foreground">
                  Give customers a polished payment preview before final integration.
                </p>
              </Card>

              <Card className="space-y-4 rounded-4xl p-6">
                <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                  Coupon drop
                </p>
                <p className="font-display text-2xl font-semibold tracking-[-0.06em]">
                  Use code BAG20
                </p>
                <p className="text-sm leading-7 text-muted-foreground">
                  Surface campaign moments as soft product-first content instead of loud banners.
                </p>
              </Card>
            </div>
          </div>

          <div className="editorial-panel px-6 py-6 sm:px-8">
            <div className="space-y-6">
              <SectionHeading
                align="center"
                eyebrow="We supported by"
                title="Retail-friendly sections that already feel launch ready"
              />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {SUPPORTING_BRANDS.map((brand) => (
                  <div
                    key={brand}
                    className="rounded-[1.45rem] border border-white/80 bg-white/72 px-4 py-4 text-center font-display text-2xl font-semibold tracking-[-0.04em] text-foreground/80"
                  >
                    {brand}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <SectionWrapper
        description="A warm, structured category system that feels like a curated collection wall rather than a generic grid."
        eyebrow="Featured categories"
        title="Browse collection edits made for real discovery"
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {FEATURED_CATEGORIES.map((category) => (
            <CategoryCardPlaceholder key={category.href} {...category} />
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper
        actions={
          <Link className={buttonVariants({ variant: "outline" })} href={ROUTES.storefront.shop}>
            View all products
          </Link>
        }
        description="Top-performing items should feel tactile, premium, and immediately scannable across desktop and mobile."
        eyebrow="Best selling bags"
        title="Customer favorites with a calmer, more editorial card language"
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {BEST_SELLERS.map((product) => (
            <ProductCardPlaceholder key={product.href} {...product} />
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper
        className="pt-8"
        description="Trust messaging works better when it feels integrated into the merchandising rhythm."
        eyebrow="Service"
        title="Support, payment, and return messaging that stays on-brand"
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {TRUST_HIGHLIGHTS.slice(0, 3).map((item) => (
            <Card key={item} className="rounded-4xl p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                Promise
              </p>
              <p className="font-display mt-4 text-2xl font-semibold tracking-[-0.05em]">
                {item}
              </p>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="overflow-hidden p-0">
            <div className="grid gap-6 p-6 sm:grid-cols-[0.9fr_1.1fr] sm:p-8">
              <div className="rounded-4xl bg-[linear-gradient(180deg,#f4f7fb,#ecf0f6)] p-5">
                <div className="h-full rounded-[1.8rem] border border-white/80 bg-white/72" />
              </div>
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                  Modern quality
                </p>
                <h3 className="font-display text-3xl font-semibold tracking-[-0.06em]">
                  Material stories with more emotion and less clutter
                </h3>
                <p className="text-sm leading-7 text-muted-foreground">
                  The new surface system uses soft layers, rounded framing, and more
                  intentional spacing so your storefront already feels like a product.
                </p>
              </div>
            </div>
          </Card>

          <Card className="overflow-hidden p-0">
            <div className="grid gap-6 p-6 sm:grid-cols-[1.1fr_0.9fr] sm:p-8">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                  Latest fashion
                </p>
                <h3 className="font-display text-3xl font-semibold tracking-[-0.06em]">
                  Product storytelling that can scale into real content later
                </h3>
                <p className="text-sm leading-7 text-muted-foreground">
                  Today these are static shells. Later the same slots can map to real
                  campaigns, imagery, and merchandising rules.
                </p>
              </div>
              <div className="rounded-4xl bg-[linear-gradient(180deg,#f7ede8,#f2dcd4)] p-5">
                <div className="h-full rounded-[1.8rem] border border-white/80 bg-white/72" />
              </div>
            </div>
          </Card>
        </div>
      </SectionWrapper>

      <SectionWrapper
        className="bg-transparent pt-8"
        description="The promotional layer should feel like part of the brand world, not bolted onto it."
        eyebrow="Campaign"
        title="Launch limited offers without breaking the premium feel"
      >
        <PromoBanner
          ctaHref={ROUTES.storefront.shop}
          ctaLabel="Shop the campaign"
          description="A darker, fashion-led campaign surface for coupon drops, capsule releases, or time-sensitive storytelling."
          eyebrow="Promotional banner"
          secondaryHref={ROUTES.storefront.contact}
          secondaryLabel="Talk to us"
          title="Give BAG20 a home that feels considered, not noisy"
        />
      </SectionWrapper>

      <SectionWrapper
        description="Fresh drops and social proof can still feel premium when the layout stays restrained."
        eyebrow="New arrivals"
        title="Merchandising blocks that carry straight into reviews, wishlist, and orders"
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {NEW_ARRIVALS.map((product) => (
            <ProductCardPlaceholder key={product.href} {...product} />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="space-y-4 p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Testimonial wall
            </p>
            <h3 className="font-display text-3xl font-semibold tracking-[-0.06em]">
              Built to support trust and conversion
            </h3>
            <div className="grid gap-3">
              {TRUST_HIGHLIGHTS.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.35rem] border border-white/80 bg-white/70 px-4 py-3 text-sm font-medium"
                >
                  {item}
                </div>
              ))}
            </div>
          </Card>

          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((testimonial) => (
                <Card key={testimonial.name} className="flex h-full flex-col justify-between">
                  <p className="text-base leading-7 text-foreground/90">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                <div className="mt-6">
                  <p className="font-display text-xl font-semibold tracking-[-0.05em]">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper
        className="pb-20"
        description="A newsletter block that looks like part of the premium storefront, not an afterthought."
        eyebrow="Newsletter"
        title="Stay close to your customers between drops"
      >
        <div className="editorial-panel overflow-hidden px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="space-y-4">
              <p className="text-sm leading-7 text-muted-foreground">
                Subscribe to our newsletter and be the first to know about releases,
                offers, and new product stories from the storefront.
              </p>
              <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                <span>Curated drops</span>
                <span>Campaign previews</span>
                <span>Back-in-stock notes</span>
                <span>Editorial stories</span>
              </div>
            </div>

            <form className="space-y-4">
              <Input placeholder="Enter your email here" type="email" />
              <div className="flex flex-wrap gap-3">
                <button className={buttonVariants({ size: "lg", variant: "secondary" })} type="submit">
                  Join the list
                </button>
                <span className="self-center text-sm text-muted-foreground">
                  No integration yet, just the upgraded shell.
                </span>
              </div>
            </form>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}

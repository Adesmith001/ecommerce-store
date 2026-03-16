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
import {
  BEST_SELLERS,
  FEATURED_CATEGORIES,
  NEW_ARRIVALS,
  TESTIMONIALS,
  TRUST_HIGHLIGHTS,
} from "@/constants/storefront";
import { ROUTES } from "@/constants/routes";

export default function StorefrontHomePage() {
  return (
    <>
      <section className="section-space overflow-hidden">
        <Container className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-8">
            <div className="space-y-5">
              <Badge>New Season Collection</Badge>
              <h1 className="text-display max-w-3xl">
                A storefront foundation built to feel premium from the first visit.
              </h1>
              <p className="max-w-2xl text-body">
                Explore a clean single-vendor shopping experience with curated
                categories, conversion-focused sections, and reusable components ready
                for real product data later.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                className={buttonVariants({ size: "lg" })}
                href={ROUTES.storefront.shop}
              >
                Shop now
              </Link>
              <Link
                className={buttonVariants({ size: "lg", variant: "outline" })}
                href={ROUTES.storefront.category("wardrobe-refresh")}
              >
                Browse categories
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {TRUST_HIGHLIGHTS.slice(0, 3).map((item) => (
                <Card key={item} className="p-5">
                  <p className="text-sm font-medium leading-6">{item}</p>
                </Card>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 top-8 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -right-6 bottom-10 h-36 w-36 rounded-full bg-accent/15 blur-3xl" />
            <div className="card-shell relative overflow-hidden p-6 sm:p-8">
              <div className="rounded-[2rem] bg-[linear-gradient(180deg,#eff6ff,#ffffff)] p-6">
                <div className="aspect-[4/5] rounded-[1.75rem] bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.18),transparent_30%),linear-gradient(180deg,#dbeafe,#f9fafb)] p-6">
                  <div className="flex h-full flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary">Campaign Ready</Badge>
                      <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-primary">
                        Static Preview
                      </span>
                    </div>
                    <div className="rounded-[1.5rem] border border-white/70 bg-white/80 p-5 backdrop-blur">
                      <p className="text-sm text-muted-foreground">Editorial Feature</p>
                      <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                        Merchandising layouts that already feel launch-ready
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <SectionWrapper
        description="Highlight the collections that matter most to shoppers with flexible cards that can later map to real categories."
        eyebrow="Featured Categories"
        title="Explore by category"
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
        description="Best sellers can later be powered by analytics or manually curated merchandising."
        eyebrow="Best Sellers"
        title="Customer favorites with strong retail presence"
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {BEST_SELLERS.map((product) => (
            <ProductCardPlaceholder key={product.href} {...product} />
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper
        className="bg-surface/60"
        description="Use this section for recent launches, seasonal edits, and time-sensitive product drops."
        eyebrow="New Arrivals"
        title="Fresh additions to the catalog"
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {NEW_ARRIVALS.map((product) => (
            <ProductCardPlaceholder key={product.href} {...product} />
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper className="pt-6">
        <PromoBanner
          ctaHref={ROUTES.storefront.shop}
          ctaLabel="Shop the campaign"
          description="Spotlight limited offers, new collections, or timed promotions with a banner that feels at home in a polished ecommerce storefront."
          eyebrow="Promotional Banner"
          secondaryHref={ROUTES.storefront.contact}
          secondaryLabel="Talk to us"
          title="Launch a compelling seasonal message without waiting for backend data"
        />
      </SectionWrapper>

      <SectionWrapper
        description="Use trust signals and customer voice to make the storefront feel dependable even before deeper commerce flows are added."
        eyebrow="Social Proof"
        title="Built to support trust and conversion"
      >
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="space-y-4 p-8">
            <h3 className="text-2xl font-semibold tracking-tight">
              Why customers will feel confident shopping here
            </h3>
            <div className="grid gap-3">
              {TRUST_HIGHLIGHTS.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-medium"
                >
                  {item}
                </div>
              ))}
            </div>
          </Card>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {TESTIMONIALS.map((testimonial) => (
              <Card key={testimonial.name} className="flex h-full flex-col justify-between">
                <p className="text-base leading-7 text-foreground/90">
                  “{testimonial.quote}”
                </p>
                <div className="mt-6">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper
        className="pb-20"
        description="A simple email capture shell for future lifecycle marketing, back-in-stock notifications, or launch announcements."
        eyebrow="Newsletter"
        title="Stay close to your customers"
      >
        <Card className="overflow-hidden p-0">
          <div className="grid gap-6 p-8 sm:p-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div className="space-y-4">
              <SectionHeading
                description="Invite shoppers into your brand story with an elegant opt-in section that can later connect to your marketing stack."
                title="Get product drops, offers, and curated updates"
              />
            </div>
            <form className="space-y-3">
              <Input placeholder="Enter your email address" type="email" />
              <div className="flex flex-wrap gap-3">
                <button className={buttonVariants({ size: "lg" })} type="submit">
                  Subscribe
                </button>
                <span className="self-center text-sm text-muted-foreground">
                  No integrations yet, just the visual shell.
                </span>
              </div>
            </form>
          </div>
        </Card>
      </SectionWrapper>
    </>
  );
}

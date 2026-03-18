import Link from "next/link";
import { StorePageHero, SectionWrapper } from "@/components/storefront";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { formatCurrency } from "@/helpers/format-currency";
import { getOrderByPaymentReference } from "@/lib/orders/order-service";

type CheckoutFailedPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function CheckoutFailedPage({
  searchParams,
}: CheckoutFailedPageProps) {
  const params = await searchParams;
  const paymentReference = getSingleParam(params.reference);
  const reason = getSingleParam(params.reason);
  const order = paymentReference
    ? await getOrderByPaymentReference(paymentReference).catch(() => null)
    : null;

  return (
    <>
      <StorePageHero
        breadcrumbs={[
          { label: "Home", href: ROUTES.storefront.home },
          { label: "Cart", href: ROUTES.storefront.cart },
          { label: "Checkout", href: ROUTES.storefront.checkout },
          { label: "Payment failed" },
        ]}
        description="Your order was saved, but the payment did not complete successfully."
        eyebrow="Payment failed"
        title="We could not confirm your payment"
      />
      <SectionWrapper>
        <Card className="mx-auto max-w-3xl space-y-6 p-8">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-danger">
              Payment incomplete
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">
              Your payment was not completed.
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              {reason ??
                order?.paymentMessage ??
                "Please try again or choose a different payment option on your next attempt."}
            </p>
          </div>

          {order ? (
            <div className="grid gap-4 rounded-3xl bg-surface p-5 text-sm sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground">Reference</p>
                <p className="mt-1 font-medium">{order.paymentReference}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Payment status</p>
                <p className="mt-1 font-medium capitalize">{order.paymentStatus}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Order status</p>
                <p className="mt-1 font-medium capitalize">{order.orderStatus}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Estimated total</p>
                <p className="mt-1 font-medium">
                  {formatCurrency(order.pricing.estimatedTotal, {
                    currency: order.currency,
                  })}
                </p>
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Link
              className={buttonVariants({ size: "lg" })}
              href={ROUTES.storefront.checkout}
            >
              Return to checkout
            </Link>
            <Link
              className={buttonVariants({ size: "lg", variant: "outline" })}
              href={ROUTES.storefront.cart}
            >
              Review cart
            </Link>
          </div>
        </Card>
      </SectionWrapper>
    </>
  );
}

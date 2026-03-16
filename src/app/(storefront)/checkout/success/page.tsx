import Link from "next/link";
import { redirect } from "next/navigation";
import { PaymentSuccessClient } from "@/components/storefront/checkout/payment-success-client";
import { StorePageHero, SectionWrapper } from "@/components/storefront";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { verifyAndFinalizeKoraOrder } from "@/lib/payments/kora";

type CheckoutSuccessPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const params = await searchParams;
  const paymentReference = getSingleParam(params.reference);

  if (!paymentReference) {
    redirect(ROUTES.storefront.checkoutFailed);
  }

  let result: Awaited<ReturnType<typeof verifyAndFinalizeKoraOrder>> | null = null;

  try {
    result = await verifyAndFinalizeKoraOrder(paymentReference);
  } catch (error) {
    redirect(
      `${ROUTES.storefront.checkoutFailed}?reference=${encodeURIComponent(paymentReference)}&reason=${encodeURIComponent(error instanceof Error ? error.message : "Payment verification failed.")}`,
    );
  }

  if (!result) {
    redirect(ROUTES.storefront.checkoutFailed);
  }

  if (!result.isPaid && !result.isPending) {
    redirect(
      `${ROUTES.storefront.checkoutFailed}?reference=${encodeURIComponent(paymentReference)}`,
    );
  }

  return (
    <>
      {result.isPaid ? <PaymentSuccessClient /> : null}
      <StorePageHero
        breadcrumbs={[
          { label: "Home", href: ROUTES.storefront.home },
          { label: "Cart", href: ROUTES.storefront.cart },
          { label: "Checkout", href: ROUTES.storefront.checkout },
          { label: result.isPaid ? "Payment success" : "Payment pending" },
        ]}
        description={
          result.isPaid
            ? "Your payment has been verified and your order is now confirmed."
            : "Your payment is still being processed. We will only confirm the order after verification."
        }
        eyebrow={result.isPaid ? "Payment success" : "Payment pending"}
        title={result.isPaid ? "Thank you for your order" : "We are still waiting for confirmation"}
      />
      <SectionWrapper>
        <Card className="mx-auto max-w-3xl space-y-6 p-8">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-success">
              {result.isPaid ? "Verified payment" : "Awaiting verification"}
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">
              {result.isPaid
                ? "Your order is confirmed."
                : "Your payment has not settled yet."}
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Reference: {result.order.paymentReference}
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              {result.order.paymentMessage ??
                "We have captured your payment attempt and stored the order safely."}
            </p>
          </div>

          <div className="grid gap-4 rounded-3xl bg-surface p-5 text-sm sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground">Payment status</p>
              <p className="mt-1 font-medium capitalize">{result.order.paymentStatus}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Order status</p>
              <p className="mt-1 font-medium capitalize">{result.order.orderStatus}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Delivery method</p>
              <p className="mt-1 font-medium capitalize">
                {result.order.deliveryMethod.replace("-", " ")}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Estimated total</p>
              <p className="mt-1 font-medium">
                {new Intl.NumberFormat("en-US", {
                  currency: result.order.currency,
                  style: "currency",
                }).format(result.order.pricing.estimatedTotal)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              className={buttonVariants({ size: "lg" })}
              href={ROUTES.storefront.shop}
            >
              Continue shopping
            </Link>
            <Link
              className={buttonVariants({ size: "lg", variant: "outline" })}
              href={ROUTES.storefront.home}
            >
              Back to homepage
            </Link>
            {!result.isPaid ? (
              <Link
                className={buttonVariants({ size: "lg", variant: "outline" })}
                href={`${ROUTES.storefront.checkoutSuccess}?reference=${encodeURIComponent(paymentReference)}`}
              >
                Refresh status
              </Link>
            ) : null}
          </div>
        </Card>
      </SectionWrapper>
    </>
  );
}

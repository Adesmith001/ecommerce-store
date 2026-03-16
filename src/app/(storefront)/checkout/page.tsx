import { StorePageHero, SectionWrapper } from "@/components/storefront";
import { CheckoutPageClient } from "@/components/storefront/checkout/checkout-page-client";
import { ROUTES } from "@/constants/routes";
import { requireAuthenticatedUser } from "@/lib/auth/guards";

export default async function CheckoutPage() {
  const session = await requireAuthenticatedUser(ROUTES.storefront.checkout);

  return (
    <>
      <StorePageHero
        breadcrumbs={[
          { label: "Home", href: ROUTES.storefront.home },
          { label: "Cart", href: ROUTES.storefront.cart },
          { label: "Checkout" },
        ]}
        description="Confirm your delivery details, create your order, and continue into the secure payment flow."
        eyebrow="Checkout"
        title="Secure your order"
      />
      <SectionWrapper>
        <CheckoutPageClient
          initialValues={{
            fullName: session.user?.fullName ?? "",
            email: session.user?.primaryEmailAddress?.emailAddress ?? "",
            phoneNumber: session.user?.primaryPhoneNumber?.phoneNumber ?? "",
            country: "",
            state: "",
            city: "",
            addressLine: "",
            landmark: "",
            postalCode: "",
          }}
        />
      </SectionWrapper>
    </>
  );
}

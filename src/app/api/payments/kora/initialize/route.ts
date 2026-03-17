import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { buildCheckoutOrderDraft } from "@/lib/checkout/checkout-order";
import { normalizeCheckoutOrderDraftPayload, validateCheckoutForm } from "@/lib/checkout/checkout-validation";
import { validateCouponApplication } from "@/lib/coupons/coupon-service";
import {
  createPendingOrder,
  markOrderInitializationFailed,
  updateOrderPaymentInitialization,
} from "@/lib/orders/order-service";
import {
  buildKoraPaymentReference,
  getKoraCurrency,
  initializeKoraCheckout,
} from "@/lib/payments/kora";
import { listActiveShippingMethods } from "@/lib/shipping/shipping-service";

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { message: "You need to sign in before starting checkout." },
      { status: 401 },
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Checkout payload could not be parsed." },
      { status: 400 },
    );
  }

  const draft = normalizeCheckoutOrderDraftPayload(payload);

  if (!draft) {
    return NextResponse.json(
      { message: "Checkout payload is incomplete or invalid." },
      { status: 400 },
    );
  }

  const formErrors = validateCheckoutForm(draft.customer);

  if (Object.keys(formErrors).length > 0) {
    return NextResponse.json(
      { message: "Please complete the required delivery details." },
      { status: 400 },
    );
  }

  if (draft.items.length === 0) {
    return NextResponse.json(
      { message: "Your cart is empty. Add items before checkout." },
      { status: 400 },
    );
  }

  if (
    draft.items.some(
      (item) => item.quantity < 1 || item.stock < 1 || item.quantity > item.stock,
    )
  ) {
    return NextResponse.json(
      {
        message:
          "One or more cart items are no longer available in the selected quantity.",
      },
      { status: 400 },
    );
  }

  const shippingMethods = await listActiveShippingMethods();

  if (shippingMethods.length === 0) {
    return NextResponse.json(
      { message: "No shipping methods are currently available." },
      { status: 400 },
    );
  }

  const selectedShippingMethod = shippingMethods.find(
    (method) => method.code === draft.deliveryMethod,
  );

  if (!selectedShippingMethod) {
    return NextResponse.json(
      { message: "The selected delivery method is no longer available." },
      { status: 400 },
    );
  }

  let serverDraft = buildCheckoutOrderDraft({
    deliveryMethod: draft.deliveryMethod,
    items: draft.items,
    shippingMethods,
    values: draft.customer,
  });

  if (draft.pricing.couponCode) {
    try {
      const validation = await validateCouponApplication({
        code: draft.pricing.couponCode,
        items: draft.items,
        subtotal: draft.items.reduce(
          (total, item) => total + (item.salePrice ?? item.price) * item.quantity,
          0,
        ),
      });

      serverDraft = buildCheckoutOrderDraft({
        appliedCoupon: validation.appliedCoupon,
        couponCode: validation.appliedCoupon.code,
        deliveryMethod: draft.deliveryMethod,
        items: draft.items,
        shippingMethods,
        values: draft.customer,
      });
    } catch (error) {
      return NextResponse.json(
        {
          message:
            error instanceof Error
              ? error.message
              : "This coupon could not be applied.",
        },
        { status: 400 },
      );
    }
  }

  const paymentReference = buildKoraPaymentReference();
  const currency = getKoraCurrency();

  try {
    // Critical flow: we persist the pending order before calling Kora so that
    // every payment attempt already has a durable order record to reconcile later.
    const order = await createPendingOrder({
      clerkId: userId,
      currency,
      draft: serverDraft,
      paymentProvider: "kora",
      paymentReference,
    });

    try {
      const payment = await initializeKoraCheckout({
        draft: serverDraft,
        orderId: order.id,
        paymentReference,
      });

      await updateOrderPaymentInitialization({
        checkoutUrl: payment.checkoutUrl,
        paymentReference,
      });

      return NextResponse.json({
        checkoutUrl: payment.checkoutUrl,
        orderId: order.id,
        paymentReference,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to initialize your payment session.";

      try {
        await markOrderInitializationFailed({
          message,
          paymentReference,
        });
      } catch (markOrderError) {
        console.error("Failed to mark order initialization error.", markOrderError);
      }

      return NextResponse.json({ message }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to create your order right now.",
      },
      { status: 500 },
    );
  }
}

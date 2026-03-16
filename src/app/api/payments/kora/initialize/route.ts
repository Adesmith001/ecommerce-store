import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { normalizeCheckoutOrderDraftPayload, validateCheckoutForm } from "@/lib/checkout/checkout-validation";
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

  const paymentReference = buildKoraPaymentReference();
  const currency = getKoraCurrency();

  try {
    // Critical flow: we persist the pending order before calling Kora so that
    // every payment attempt already has a durable order record to reconcile later.
    const order = await createPendingOrder({
      clerkId: userId,
      currency,
      draft,
      paymentProvider: "kora",
      paymentReference,
    });

    try {
      const payment = await initializeKoraCheckout({
        draft,
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

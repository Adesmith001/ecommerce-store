import { NextResponse } from "next/server";
import {
  verifyAndFinalizeKoraOrder,
  verifyKoraWebhookSignature,
} from "@/lib/payments/kora";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-korapay-signature") ?? "";

  let payload: {
    data?: {
      reference?: string;
      status?: string;
    };
    event?: string;
  };

  try {
    payload = JSON.parse(rawBody) as typeof payload;
  } catch {
    return NextResponse.json(
      { message: "Webhook payload is not valid JSON." },
      { status: 400 },
    );
  }

  if (!verifyKoraWebhookSignature({ payload, signature })) {
    return NextResponse.json({ message: "Invalid Kora webhook signature." }, { status: 401 });
  }

  const paymentReference = payload.data?.reference;

  if (!paymentReference) {
    return NextResponse.json(
      { message: "Payment reference is missing from the webhook." },
      { status: 400 },
    );
  }

  try {
    // Even after a trusted webhook arrives, we still verify the charge directly
    // with Kora before updating the order. The webhook is only a signal to re-check.
    await verifyAndFinalizeKoraOrder(paymentReference);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Kora webhook processing failed.", error);

    return NextResponse.json(
      { message: "Webhook processing failed." },
      { status: 500 },
    );
  }
}

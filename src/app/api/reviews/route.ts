import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getProductsByIds } from "@/lib/catalog/catalog-service";
import { createReviewSubmittedNotification } from "@/lib/notifications/notification-service";
import {
  createReview,
  getReviewDataForProduct,
  getReviewEligibility,
} from "@/lib/reviews/review-service";

type CreateReviewPayload = {
  message?: string;
  productId?: string;
  rating?: number;
  title?: string;
};

function validateReviewPayload(payload: CreateReviewPayload) {
  if (!payload.productId) {
    return "Product is required.";
  }

  if (typeof payload.rating !== "number" || payload.rating < 1 || payload.rating > 5) {
    return "Please choose a rating between 1 and 5.";
  }

  if (!payload.message?.trim()) {
    return "Please share your review message.";
  }

  if (payload.message.trim().length < 10) {
    return "Please write at least 10 characters in your review.";
  }

  if (payload.title && payload.title.trim().length > 120) {
    return "Review title must be 120 characters or fewer.";
  }

  return null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  const { userId } = await auth();

  if (!productId) {
    return NextResponse.json(
      { message: "Product id is required." },
      { status: 400 },
    );
  }

  try {
    const [product] = await getProductsByIds([productId]);

    if (!product) {
      return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }

    const [reviewData, eligibility] = await Promise.all([
      getReviewDataForProduct(productId),
      getReviewEligibility({
        clerkId: userId ?? null,
        productId,
      }),
    ]);

    return NextResponse.json({
      eligibility,
      reviews: reviewData.reviews,
      summary: reviewData.summary,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to load reviews.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { message: "You need to sign in before submitting a review." },
      { status: 401 },
    );
  }

  const payload = (await request.json().catch(() => null)) as CreateReviewPayload | null;

  if (!payload) {
    return NextResponse.json(
      { message: "Review payload is invalid." },
      { status: 400 },
    );
  }

  const validationError = validateReviewPayload(payload);

  if (validationError) {
    return NextResponse.json({ message: validationError }, { status: 400 });
  }

  try {
    const [product] = await getProductsByIds([payload.productId!]);

    if (!product) {
      return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }

    const user = await currentUser();
    const fullName =
      user?.fullName ??
      user?.firstName ??
      user?.primaryEmailAddress?.emailAddress ??
      "Verified customer";

    const review = await createReview({
      clerkId: userId,
      fullName,
      message: payload.message!.trim(),
      productId: product.id,
      rating: payload.rating!,
      title: payload.title?.trim(),
    });

    try {
      await createReviewSubmittedNotification({
        productId: product.id,
        productName: product.name,
        reviewerName: fullName,
      });
    } catch (error) {
      console.error("Failed to create review notification.", error);
    }

    const reviewData = await getReviewDataForProduct(product.id);
    const eligibility = await getReviewEligibility({
      clerkId: userId,
      productId: product.id,
    });

    return NextResponse.json({
      eligibility,
      review,
      reviews: reviewData.reviews,
      summary: reviewData.summary,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to submit review.",
      },
      { status: 500 },
    );
  }
}

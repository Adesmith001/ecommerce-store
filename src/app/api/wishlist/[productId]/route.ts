import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { removeProductFromWishlist } from "@/lib/wishlist/wishlist-service";

type WishlistDeleteRouteProps = {
  params: Promise<{ productId: string }>;
};

export async function DELETE(
  _request: Request,
  { params }: WishlistDeleteRouteProps,
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { message: "You need to sign in to manage your wishlist." },
      { status: 401 },
    );
  }

  const { productId } = await params;

  try {
    await removeProductFromWishlist({
      clerkId: userId,
      productId,
    });

    return NextResponse.json({ removed: true });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to remove wishlist item.",
      },
      { status: 500 },
    );
  }
}

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getProductsByIds } from "@/lib/catalog/catalog-service";
import { getWishlistItemsForClerkUser, addProductToWishlist } from "@/lib/wishlist/wishlist-service";

type AddWishlistPayload = {
  productId?: string;
  productSlug?: string;
};

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { message: "You need to sign in to view your wishlist." },
      { status: 401 },
    );
  }

  try {
    const items = await getWishlistItemsForClerkUser(userId);

    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to load wishlist.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { message: "You need to sign in to save products to your wishlist." },
      { status: 401 },
    );
  }

  const payload = (await request.json().catch(() => null)) as AddWishlistPayload | null;

  if (!payload?.productId || !payload.productSlug) {
    return NextResponse.json(
      { message: "Product details are required to save a wishlist item." },
      { status: 400 },
    );
  }

  try {
    const [product] = await getProductsByIds([payload.productId]);

    if (!product) {
      return NextResponse.json(
        { message: "That product could not be found." },
        { status: 404 },
      );
    }

    await addProductToWishlist({
      clerkId: userId,
      productId: product.id,
      productSlug: product.slug,
    });

    const items = await getWishlistItemsForClerkUser(userId);
    const wishlistItem =
      items.find((item) => item.product.id === product.id) ?? null;

    return NextResponse.json({ item: wishlistItem });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to save wishlist item.",
      },
      { status: 500 },
    );
  }
}

import { WishlistPageClient } from "@/components/storefront/wishlist";
import { Card } from "@/components/ui/card";

export default async function WishlistPage() {
  return (
    <div className="space-y-6">
      <Card className="space-y-3 p-6">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
          Account
        </p>
        <h1 className="font-display text-4xl font-semibold tracking-[-0.06em]">
          Wishlist
        </h1>
      </Card>
      <WishlistPageClient />
    </div>
  );
}

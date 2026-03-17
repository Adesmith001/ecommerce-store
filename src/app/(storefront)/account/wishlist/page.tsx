import { WishlistPageClient } from "@/components/storefront/wishlist";
import { Card } from "@/components/ui/card";

export default async function WishlistPage() {
  return (
    <div className="space-y-6">
      <Card className="space-y-3 p-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Account
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Wishlist</h1>
      </Card>
      <WishlistPageClient />
    </div>
  );
}

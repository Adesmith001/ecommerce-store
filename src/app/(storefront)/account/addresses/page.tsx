import { AccountAddressesManager } from "@/components/account";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { listAccountAddresses } from "@/lib/account/account-service";
import { requireAuthenticatedUser } from "@/lib/auth/guards";

export default async function AccountAddressesPage() {
  const session = await requireAuthenticatedUser(ROUTES.storefront.accountAddresses);
  const addresses = await listAccountAddresses(session.userId);

  return (
    <div className="space-y-6">
      <Card className="space-y-3 p-6">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
          Account
        </p>
        <h1 className="font-display text-4xl font-semibold tracking-[-0.06em]">
          Addresses
        </h1>
      </Card>
      <AccountAddressesManager initialAddresses={addresses} />
    </div>
  );
}

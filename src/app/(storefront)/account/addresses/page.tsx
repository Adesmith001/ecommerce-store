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
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Account
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Addresses</h1>
      </Card>
      <AccountAddressesManager
        initialAddresses={addresses}
      />
    </div>
  );
}

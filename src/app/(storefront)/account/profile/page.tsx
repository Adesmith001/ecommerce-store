import { currentUser } from "@clerk/nextjs/server";
import { AccountProfileForm } from "@/components/account";
import { getAccountProfile } from "@/lib/account/account-service";
import { requireAuthenticatedUser } from "@/lib/auth/guards";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";

export default async function AccountProfilePage() {
  const session = await requireAuthenticatedUser(ROUTES.storefront.accountProfile);
  const user = await currentUser();
  const profile = await getAccountProfile({
    clerkId: session.userId,
    clerkEmail: user?.primaryEmailAddress?.emailAddress ?? "",
    fallbacks: {
      avatar: user?.imageUrl,
      fullName: user?.fullName,
      phone: user?.primaryPhoneNumber?.phoneNumber,
    },
  });

  return (
    <div className="space-y-6">
      <Card className="space-y-3 p-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Account
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
      </Card>
      <AccountProfileForm profile={profile} />
    </div>
  );
}

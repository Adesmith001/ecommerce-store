import { auth, currentUser } from "@clerk/nextjs/server";
import { buildProfilePayload, ensureAppwriteUserProfile } from "@/lib/auth/profile-sync";
import { getRoleFromMetadata } from "@/lib/auth/roles";

export async function AuthProfileSync() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    await ensureAppwriteUserProfile(
      buildProfilePayload({
        avatar: user.imageUrl,
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        fullName: user.fullName,
        phone: user.primaryPhoneNumber?.phoneNumber,
        role: getRoleFromMetadata(user.publicMetadata?.role),
      }),
    );
  } catch (error) {
    // Profile sync should never block navigation. If Appwrite configuration is still
    // incomplete, we log the failure and let the authenticated session continue.
    console.error("Appwrite profile sync failed.", error);
  }

  return null;
}

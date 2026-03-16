import { auth, currentUser } from "@clerk/nextjs/server";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { buildProfilePayload, ensureAppwriteUserProfile } from "@/lib/auth/profile-sync";

function isMissingClerkUserError(error: unknown) {
  if (isClerkAPIResponseError(error)) {
    return error.status === 404;
  }

  return error instanceof Error && error.message.includes("Not Found");
}

export async function AuthProfileSync() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  try {
    const user = await currentUser();

    if (!user) {
      return null;
    }

    await ensureAppwriteUserProfile(
      buildProfilePayload({
        avatar: user.imageUrl,
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        fullName: user.fullName,
        phone: user.primaryPhoneNumber?.phoneNumber,
        // New profiles always start as customers. Admin access is intentionally
        // managed manually from the Appwrite userProfiles collection.
        role: "customer",
      }),
    );
  } catch (error) {
    if (isMissingClerkUserError(error)) {
      // This can happen if the Clerk session cookie survives briefly after the
      // account has been deleted. We skip profile sync and let the rest of the
      // app render instead of crashing the root layout.
      return null;
    }

    // Profile sync should never block navigation. If Appwrite configuration is still
    // incomplete, we log the failure and let the authenticated session continue.
    console.error("Appwrite profile sync failed.", error);
  }

  return null;
}

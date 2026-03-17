import { auth, currentUser } from "@clerk/nextjs/server";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { buildProfilePayload, ensureAppwriteUserProfile } from "@/lib/auth/profile-sync";

function getClaimString(claims: unknown, keys: string[]) {
  if (!claims || typeof claims !== "object") {
    return undefined;
  }

  const source = claims as Record<string, unknown>;

  for (const key of keys) {
    const value = source[key];

    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }

  return undefined;
}

function isMissingClerkUserError(error: unknown) {
  if (isClerkAPIResponseError(error)) {
    return error.status === 404;
  }

  return error instanceof Error && error.message.includes("Not Found");
}

export async function AuthProfileSync() {
  const { sessionClaims, userId } = await auth();

  if (!userId) {
    return null;
  }

  let avatar = getClaimString(sessionClaims, ["picture", "avatar", "image_url"]);
  let email = getClaimString(sessionClaims, ["email"]);
  let fullName = getClaimString(sessionClaims, ["name", "full_name"]);
  let phone = getClaimString(sessionClaims, ["phone_number", "phone"]);

  try {
    try {
      const user = await currentUser();

      if (user) {
        avatar = user.imageUrl || avatar;
        email = user.primaryEmailAddress?.emailAddress || email;
        fullName = user.fullName || fullName;
        phone = user.primaryPhoneNumber?.phoneNumber || phone;
      }
    } catch (error) {
      if (isClerkAPIResponseError(error) || isMissingClerkUserError(error)) {
        // Continue with session claims if Clerk user lookup fails transiently.
        const reason = isClerkAPIResponseError(error)
          ? `code=${error.code ?? "unknown"}, status=${error.status ?? "unknown"}`
          : "not-found";

        console.warn(
          `Clerk currentUser lookup failed during profile sync. Falling back to session claims (${reason}).`,
        );
      } else {
        throw error;
      }
    }

    await ensureAppwriteUserProfile(
      buildProfilePayload({
        avatar,
        clerkId: userId,
        email,
        fullName,
        phone,
        // New profiles always start as customers. Admin access is intentionally
        // managed manually from the Appwrite userProfiles collection.
        role: "customer",
      }),
    );
  } catch (error) {
    // Profile sync should never block navigation. If Appwrite configuration is still
    // incomplete, we log the failure and let the authenticated session continue.
    console.error("Appwrite profile sync failed.", error);
  }

  return null;
}

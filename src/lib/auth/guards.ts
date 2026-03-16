import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { isAdminRole } from "@/lib/auth/roles";
import { getUserRoleForClerkId } from "@/lib/auth/profile-sync";

export async function getCurrentUserRole() {
  const { userId } = await auth();

  if (!userId) {
    return "customer";
  }

  return getUserRoleForClerkId(userId);
}

export async function requireAuthenticatedUser(returnBackUrl?: string) {
  const { redirectToSignIn, userId } = await auth();

  if (!userId) {
    return redirectToSignIn({
      returnBackUrl: returnBackUrl ?? ROUTES.storefront.home,
    });
  }

  const user = await currentUser();
  const role = await getUserRoleForClerkId(userId);

  return {
    user,
    userId,
    role,
  };
}

export async function requireAdminUser() {
  const session = await requireAuthenticatedUser();

  if (!isAdminRole(session.role)) {
    redirect(ROUTES.storefront.home);
  }

  return session;
}

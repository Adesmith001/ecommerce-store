import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { getRoleFromMetadata, isAdminRole } from "@/lib/auth/roles";

export async function getCurrentUserRole() {
  const user = await currentUser();

  return getRoleFromMetadata(user?.publicMetadata?.role);
}

export async function requireAuthenticatedUser() {
  const { redirectToSignIn, userId } = await auth();

  if (!userId) {
    return redirectToSignIn({ returnBackUrl: ROUTES.admin.dashboard });
  }

  const user = await currentUser();

  return {
    user,
    userId,
    role: getRoleFromMetadata(user?.publicMetadata?.role),
  };
}

export async function requireAdminUser() {
  const session = await requireAuthenticatedUser();

  if (!isAdminRole(session.role)) {
    redirect(ROUTES.storefront.home);
  }

  return session;
}

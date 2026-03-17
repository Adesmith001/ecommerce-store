import "server-only";

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isAdminRole } from "@/lib/auth/roles";
import { getUserRoleForClerkId } from "@/lib/auth/profile-sync";

export async function requireAdminApiAccess() {
  const { userId } = await auth();

  if (!userId) {
    return {
      errorResponse: NextResponse.json(
        { message: "Authentication required." },
        { status: 401 },
      ),
      userId: null,
    };
  }

  const role = await getUserRoleForClerkId(userId);

  if (!isAdminRole(role)) {
    return {
      errorResponse: NextResponse.json(
        { message: "Admin access required." },
        { status: 403 },
      ),
      userId: null,
    };
  }

  return {
    errorResponse: null,
    userId,
  };
}

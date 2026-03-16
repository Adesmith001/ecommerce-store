import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserRoleForClerkId } from "@/lib/auth/profile-sync";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ role: "customer", signedIn: false });
  }

  const role = await getUserRoleForClerkId(userId);

  return NextResponse.json({ role, signedIn: true });
}

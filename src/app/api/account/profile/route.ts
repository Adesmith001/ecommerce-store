import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { updateAccountProfile } from "@/lib/account/account-service";

type UpdateProfilePayload = {
  avatar?: string;
  fullName?: string;
  phone?: string;
};

export async function PATCH(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { message: "You need to sign in to update your profile." },
      { status: 401 },
    );
  }

  const user = await currentUser();
  const payload = (await request.json().catch(() => null)) as UpdateProfilePayload | null;

  if (!payload) {
    return NextResponse.json(
      { message: "Profile payload is invalid." },
      { status: 400 },
    );
  }

  try {
    const profile = await updateAccountProfile({
      avatar: payload.avatar ?? "",
      clerkEmail: user?.primaryEmailAddress?.emailAddress ?? "",
      clerkId: userId,
      fullName: payload.fullName ?? "",
      phone: payload.phone ?? "",
    });

    return NextResponse.json({ profile });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to update profile.",
      },
      { status: 500 },
    );
  }
}

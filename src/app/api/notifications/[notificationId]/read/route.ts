import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin/admin-api-guard";
import { markNotificationAsRead } from "@/lib/notifications/notification-service";

type NotificationReadRouteContext = {
  params: Promise<{ notificationId: string }>;
};

export async function PATCH(
  request: Request,
  context: NotificationReadRouteContext,
) {
  const { searchParams } = new URL(request.url);
  const scope = searchParams.get("scope");
  const { notificationId } = await context.params;

  if (scope === "admin") {
    const access = await requireAdminApiAccess();

    if (access.errorResponse) {
      return access.errorResponse;
    }

    try {
      const notification = await markNotificationAsRead({
        clerkId: access.userId!,
        notificationId,
      });

      return NextResponse.json({ notification });
    } catch (error) {
      return NextResponse.json(
        {
          message:
            error instanceof Error
              ? error.message
              : "Failed to update notification.",
        },
        { status: 400 },
      );
    }
  }

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { message: "Authentication required." },
      { status: 401 },
    );
  }

  try {
    const notification = await markNotificationAsRead({
      clerkId: userId,
      notificationId,
    });

    return NextResponse.json({ notification });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to update notification.",
      },
      { status: 400 },
    );
  }
}

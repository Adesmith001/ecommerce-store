import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin/admin-api-guard";
import {
  listAdminNotifications,
  listCustomerNotifications,
  markAllNotificationsAsRead,
} from "@/lib/notifications/notification-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const scope = searchParams.get("scope");

  if (scope === "admin") {
    const access = await requireAdminApiAccess();

    if (access.errorResponse) {
      return access.errorResponse;
    }

    try {
      const summary = await listAdminNotifications(access.userId!);
      return NextResponse.json(summary);
    } catch (error) {
      return NextResponse.json(
        {
          message:
            error instanceof Error
              ? error.message
              : "Failed to load notifications.",
        },
        { status: 500 },
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
    const summary = await listCustomerNotifications(userId);
    return NextResponse.json(summary);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to load notifications.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const scope = searchParams.get("scope");

  if (scope === "admin") {
    const access = await requireAdminApiAccess();

    if (access.errorResponse) {
      return access.errorResponse;
    }

    try {
      await markAllNotificationsAsRead({
        clerkId: access.userId!,
        scope: "admin",
      });

      const summary = await listAdminNotifications(access.userId!);
      return NextResponse.json(summary);
    } catch (error) {
      return NextResponse.json(
        {
          message:
            error instanceof Error
              ? error.message
              : "Failed to update notifications.",
        },
        { status: 500 },
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
    await markAllNotificationsAsRead({
      clerkId: userId,
      scope: "user",
    });

    const summary = await listCustomerNotifications(userId);
    return NextResponse.json(summary);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to update notifications.",
      },
      { status: 500 },
    );
  }
}

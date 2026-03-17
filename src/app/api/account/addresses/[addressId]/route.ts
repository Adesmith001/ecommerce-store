import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { deleteAccountAddress, updateAccountAddress } from "@/lib/account/account-service";

type AddressRouteProps = {
  params: Promise<{ addressId: string }>;
};

type AddressPayload = {
  addressLine?: string;
  city?: string;
  country?: string;
  fullName?: string;
  isDefault?: boolean;
  label?: string;
  landmark?: string;
  phoneNumber?: string;
  postalCode?: string;
  state?: string;
};

function validateAddressPayload(payload: AddressPayload) {
  if (!payload.label?.trim()) return "Address label is required.";
  if (!payload.fullName?.trim()) return "Full name is required.";
  if (!payload.phoneNumber?.trim()) return "Phone number is required.";
  if (!payload.country?.trim()) return "Country is required.";
  if (!payload.state?.trim()) return "State is required.";
  if (!payload.city?.trim()) return "City is required.";
  if (!payload.addressLine?.trim()) return "Address line is required.";

  return null;
}

export async function PATCH(request: Request, { params }: AddressRouteProps) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { message: "You need to sign in to manage addresses." },
      { status: 401 },
    );
  }

  const { addressId } = await params;
  const payload = (await request.json().catch(() => null)) as AddressPayload | null;

  if (!payload) {
    return NextResponse.json(
      { message: "Address payload is invalid." },
      { status: 400 },
    );
  }

  const validationError = validateAddressPayload(payload);

  if (validationError) {
    return NextResponse.json({ message: validationError }, { status: 400 });
  }

  try {
    const address = await updateAccountAddress({
      id: addressId,
      clerkId: userId,
      label: payload.label!.trim(),
      fullName: payload.fullName!.trim(),
      phoneNumber: payload.phoneNumber!.trim(),
      country: payload.country!.trim(),
      state: payload.state!.trim(),
      city: payload.city!.trim(),
      addressLine: payload.addressLine!.trim(),
      landmark: payload.landmark?.trim() ?? "",
      postalCode: payload.postalCode?.trim() ?? "",
      isDefault: Boolean(payload.isDefault),
    });

    return NextResponse.json({ address });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to update address.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: AddressRouteProps) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { message: "You need to sign in to manage addresses." },
      { status: 401 },
    );
  }

  const { addressId } = await params;

  try {
    await deleteAccountAddress({
      addressId,
      clerkId: userId,
    });

    return NextResponse.json({ deleted: true });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to delete address.",
      },
      { status: 500 },
    );
  }
}

import "server-only";

import { Query } from "appwrite";
import { buildAppwriteApiUrl, getAppwriteErrorMessage } from "@/lib/appwrite/server-api";
import { appwriteConfig } from "@/lib/appwrite/config";
import type { AccountAddress, AccountProfile } from "@/types/account";
import type { AppwriteUserProfile } from "@/types/auth";

type AppwriteDocumentListResponse<T> = {
  documents: Array<T & { $id: string }>;
};

type AppwriteAddressDocument = {
  $id: string;
  addressLine: string;
  city: string;
  clerkId: string;
  country: string;
  createdAt: string;
  fullName: string;
  isDefault: boolean;
  label: string;
  landmark: string;
  phoneNumber: string;
  postalCode: string;
  state: string;
  updatedAt: string;
};

type AppwriteProfileDocument = AppwriteUserProfile & { $id: string };

function isAccountConfigured() {
  return Boolean(
    appwriteConfig.apiKey &&
      appwriteConfig.databaseId &&
      appwriteConfig.endpoint &&
      appwriteConfig.projectId &&
      appwriteConfig.userProfilesCollectionId &&
      appwriteConfig.addressesCollectionId,
  );
}

function isProfileConfigured() {
  return Boolean(
    appwriteConfig.apiKey &&
      appwriteConfig.databaseId &&
      appwriteConfig.endpoint &&
      appwriteConfig.projectId &&
      appwriteConfig.userProfilesCollectionId,
  );
}

function getAppwriteHeaders() {
  return {
    "Content-Type": "application/json",
    "X-Appwrite-Key": appwriteConfig.apiKey,
    "X-Appwrite-Project": appwriteConfig.projectId,
  };
}

function getProfileCollectionUrl() {
  return buildAppwriteApiUrl(
    `databases/${appwriteConfig.databaseId}/collections/${appwriteConfig.userProfilesCollectionId}/documents`,
  );
}

function getProfileDocumentUrl(documentId: string) {
  return buildAppwriteApiUrl(
    `databases/${appwriteConfig.databaseId}/collections/${appwriteConfig.userProfilesCollectionId}/documents/${documentId}`,
  );
}

function getAddressCollectionUrl() {
  return buildAppwriteApiUrl(
    `databases/${appwriteConfig.databaseId}/collections/${appwriteConfig.addressesCollectionId}/documents`,
  );
}

function getAddressDocumentUrl(documentId: string) {
  return buildAppwriteApiUrl(
    `databases/${appwriteConfig.databaseId}/collections/${appwriteConfig.addressesCollectionId}/documents/${documentId}`,
  );
}

function toAccountProfile(
  clerkId: string,
  clerkEmail: string,
  profile: AppwriteProfileDocument | null,
  fallbacks?: {
    avatar?: string | null;
    fullName?: string | null;
    phone?: string | null;
  },
): AccountProfile {
  return {
    id: profile?.$id ?? null,
    clerkId,
    email: clerkEmail,
    fullName: profile?.fullName ?? fallbacks?.fullName ?? "",
    phone: profile?.phone ?? fallbacks?.phone ?? "",
    avatar: profile?.avatar ?? fallbacks?.avatar ?? "",
    role: profile?.role ?? "customer",
  };
}

function toAccountAddress(document: AppwriteAddressDocument): AccountAddress {
  return {
    id: document.$id,
    clerkId: document.clerkId,
    label: document.label,
    fullName: document.fullName,
    phoneNumber: document.phoneNumber,
    country: document.country,
    state: document.state,
    city: document.city,
    addressLine: document.addressLine,
    landmark: document.landmark,
    postalCode: document.postalCode,
    isDefault: Boolean(document.isDefault),
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  };
}

async function queryProfileDocumentByClerkId(clerkId: string) {
  const url = getProfileCollectionUrl();

  url.searchParams.append("queries[]", Query.equal("clerkId", clerkId));
  url.searchParams.append("queries[]", Query.limit(1));

  const response = await fetch(url, {
    cache: "no-store",
    headers: getAppwriteHeaders(),
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(response, "Failed to query Appwrite profile."),
    );
  }

  const result =
    (await response.json()) as AppwriteDocumentListResponse<AppwriteProfileDocument>;

  return result.documents[0] ?? null;
}

async function listAddressDocumentsForClerkId(clerkId: string) {
  const url = getAddressCollectionUrl();

  url.searchParams.append("queries[]", Query.equal("clerkId", clerkId));
  url.searchParams.append("queries[]", Query.orderDesc("isDefault"));
  url.searchParams.append("queries[]", Query.orderDesc("$updatedAt"));

  const response = await fetch(url, {
    cache: "no-store",
    headers: getAppwriteHeaders(),
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(response, "Failed to list Appwrite addresses."),
    );
  }

  const result =
    (await response.json()) as AppwriteDocumentListResponse<AppwriteAddressDocument>;

  return result.documents.map(toAccountAddress);
}

async function unsetDefaultAddresses(clerkId: string, excludedAddressId?: string) {
  const addresses = await listAddressDocumentsForClerkId(clerkId);

  await Promise.all(
    addresses
      .filter((address) => address.isDefault && address.id !== excludedAddressId)
      .map((address) =>
        fetch(getAddressDocumentUrl(address.id), {
          body: JSON.stringify({
            data: {
              isDefault: false,
              updatedAt: new Date().toISOString(),
            },
          }),
          cache: "no-store",
          headers: getAppwriteHeaders(),
          method: "PATCH",
        }),
      ),
  );
}

export async function getAccountProfile(input: {
  clerkId: string;
  clerkEmail: string;
  fallbacks?: {
    avatar?: string | null;
    fullName?: string | null;
    phone?: string | null;
  };
}) {
  if (!isProfileConfigured()) {
    throw new Error("Appwrite profile storage is not configured.");
  }

  const profile = await queryProfileDocumentByClerkId(input.clerkId);

  return toAccountProfile(
    input.clerkId,
    input.clerkEmail,
    profile,
    input.fallbacks,
  );
}

export async function updateAccountProfile(input: {
  avatar: string;
  clerkEmail: string;
  clerkId: string;
  fullName: string;
  phone: string;
}) {
  if (!isProfileConfigured()) {
    throw new Error("Appwrite profile storage is not configured.");
  }

  const existingProfile = await queryProfileDocumentByClerkId(input.clerkId);

  if (!existingProfile) {
    const response = await fetch(getProfileCollectionUrl(), {
      body: JSON.stringify({
        data: {
          clerkId: input.clerkId,
          fullName: input.fullName.trim(),
          phone: input.phone.trim(),
          avatar: input.avatar.trim(),
          email: input.clerkEmail,
          role: "customer",
          createdAt: new Date().toISOString(),
        },
        documentId: crypto.randomUUID(),
      }),
      cache: "no-store",
      headers: getAppwriteHeaders(),
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(
        await getAppwriteErrorMessage(response, "Failed to create profile."),
      );
    }

    const createdProfile = (await response.json()) as AppwriteProfileDocument;

    return toAccountProfile(input.clerkId, input.clerkEmail, createdProfile);
  }

  const response = await fetch(getProfileDocumentUrl(existingProfile.$id), {
    body: JSON.stringify({
      data: {
        fullName: input.fullName.trim(),
        phone: input.phone.trim(),
        avatar: input.avatar.trim(),
        email: input.clerkEmail,
      },
    }),
    cache: "no-store",
    headers: getAppwriteHeaders(),
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(response, "Failed to update profile."),
    );
  }

  const updatedProfile = (await response.json()) as AppwriteProfileDocument;

  return toAccountProfile(input.clerkId, input.clerkEmail, updatedProfile);
}

export async function listAccountAddresses(clerkId: string) {
  if (!isAccountConfigured()) {
    throw new Error("Appwrite address storage is not configured.");
  }

  return listAddressDocumentsForClerkId(clerkId);
}

export async function createAccountAddress(input: Omit<AccountAddress, "createdAt" | "id" | "updatedAt">) {
  if (!isAccountConfigured()) {
    throw new Error("Appwrite address storage is not configured.");
  }

  if (input.isDefault) {
    await unsetDefaultAddresses(input.clerkId);
  }

  const now = new Date().toISOString();
  const response = await fetch(getAddressCollectionUrl(), {
    body: JSON.stringify({
      data: {
        ...input,
        createdAt: now,
        updatedAt: now,
      },
      documentId: crypto.randomUUID(),
    }),
    cache: "no-store",
    headers: getAppwriteHeaders(),
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(response, "Failed to create address."),
    );
  }

  const document = (await response.json()) as AppwriteAddressDocument;

  return toAccountAddress(document);
}

export async function updateAccountAddress(input: Omit<AccountAddress, "createdAt" | "updatedAt">) {
  if (!isAccountConfigured()) {
    throw new Error("Appwrite address storage is not configured.");
  }

  const addresses = await listAddressDocumentsForClerkId(input.clerkId);
  const targetAddress = addresses.find((address) => address.id === input.id);

  if (!targetAddress) {
    throw new Error("Address could not be found.");
  }

  if (input.isDefault) {
    await unsetDefaultAddresses(input.clerkId, input.id);
  }

  const response = await fetch(getAddressDocumentUrl(input.id), {
    body: JSON.stringify({
      data: {
        label: input.label,
        fullName: input.fullName,
        phoneNumber: input.phoneNumber,
        country: input.country,
        state: input.state,
        city: input.city,
        addressLine: input.addressLine,
        landmark: input.landmark,
        postalCode: input.postalCode,
        isDefault: input.isDefault,
        updatedAt: new Date().toISOString(),
      },
    }),
    cache: "no-store",
    headers: getAppwriteHeaders(),
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(response, "Failed to update address."),
    );
  }

  const document = (await response.json()) as AppwriteAddressDocument;

  return toAccountAddress(document);
}

export async function deleteAccountAddress(input: {
  addressId: string;
  clerkId: string;
}) {
  if (!isAccountConfigured()) {
    throw new Error("Appwrite address storage is not configured.");
  }

  const addresses = await listAddressDocumentsForClerkId(input.clerkId);
  const targetAddress = addresses.find((address) => address.id === input.addressId);

  if (!targetAddress) {
    return { deleted: false };
  }

  const response = await fetch(getAddressDocumentUrl(input.addressId), {
    cache: "no-store",
    headers: getAppwriteHeaders(),
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(response, "Failed to delete address."),
    );
  }

  return { deleted: true };
}

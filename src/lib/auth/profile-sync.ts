import "server-only";

import { Query } from "appwrite";
import { buildAppwriteApiUrl, getAppwriteErrorMessage } from "@/lib/appwrite/server-api";
import { appwriteConfig } from "@/lib/appwrite/config";
import type { AppwriteUserProfile, UserRole } from "@/types/auth";

type SyncableProfile = Omit<AppwriteUserProfile, "createdAt">;

type AppwriteDocumentListResponse<T> = {
  documents: Array<T & { $id: string }>;
};

function isProfileSyncConfigured() {
  return Boolean(
    appwriteConfig.apiKey &&
      appwriteConfig.databaseId &&
      appwriteConfig.endpoint &&
      appwriteConfig.projectId &&
      appwriteConfig.userProfilesCollectionId,
  );
}

function getAppwriteDocumentUrl() {
  return buildAppwriteApiUrl(
    `databases/${appwriteConfig.databaseId}/collections/${appwriteConfig.userProfilesCollectionId}/documents`,
  );
}

function getAppwriteHeaders() {
  return {
    "Content-Type": "application/json",
    "X-Appwrite-Key": appwriteConfig.apiKey,
    "X-Appwrite-Project": appwriteConfig.projectId,
  };
}

async function findProfileByClerkId(clerkId: string) {
  if (!isProfileSyncConfigured()) {
    return null;
  }

  const url = getAppwriteDocumentUrl();

  url.searchParams.append("queries[]", Query.equal("clerkId", clerkId));
  url.searchParams.append("queries[]", Query.limit(1));

  const response = await fetch(url, {
    cache: "no-store",
    headers: getAppwriteHeaders(),
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(
        response,
        "Failed to query Appwrite user profiles.",
      ),
    );
  }

  const result =
    (await response.json()) as AppwriteDocumentListResponse<AppwriteUserProfile>;

  return result.documents[0] ?? null;
}

async function createProfileDocument(profile: SyncableProfile) {
  const response = await fetch(getAppwriteDocumentUrl(), {
    body: JSON.stringify({
      data: {
        ...profile,
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
      await getAppwriteErrorMessage(
        response,
        "Failed to create Appwrite user profile.",
      ),
    );
  }
}

export async function ensureAppwriteUserProfile(profile: SyncableProfile) {
  if (!isProfileSyncConfigured()) {
    return { created: false, skipped: true };
  }

  const existingProfile = await findProfileByClerkId(profile.clerkId);

  if (existingProfile) {
    return { created: false, skipped: false };
  }

  await createProfileDocument(profile);

  return { created: true, skipped: false };
}

export async function getAppwriteUserProfileByClerkId(clerkId: string) {
  return findProfileByClerkId(clerkId);
}

export async function getUserRoleForClerkId(clerkId: string): Promise<UserRole> {
  try {
    const profile = await getAppwriteUserProfileByClerkId(clerkId);

    return profile?.role ?? "customer";
  } catch (error) {
    console.error("Failed to resolve user role from Appwrite profile.", error);

    return "customer";
  }
}

export function buildProfilePayload(input: {
  avatar?: string | null;
  clerkId: string;
  email?: string | null;
  fullName?: string | null;
  phone?: string | null;
  role: UserRole;
}): SyncableProfile {
  return {
    clerkId: input.clerkId,
    fullName: input.fullName ?? "",
    email: input.email ?? "",
    role: input.role,
    avatar: input.avatar ?? "",
    phone: input.phone ?? "",
  };
}

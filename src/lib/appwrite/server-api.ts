import "server-only";

import { appwriteConfig } from "@/lib/appwrite/config";

function getAppwriteApiBaseUrl() {
  return appwriteConfig.endpoint.endsWith("/")
    ? appwriteConfig.endpoint
    : `${appwriteConfig.endpoint}/`;
}

export function buildAppwriteApiUrl(pathname: string) {
  return new URL(pathname.replace(/^\//, ""), getAppwriteApiBaseUrl());
}

export async function getAppwriteErrorMessage(
  response: Response,
  fallback: string,
) {
  const responseText = await response.text();

  if (!responseText) {
    return fallback;
  }

  try {
    const payload = JSON.parse(responseText) as { message?: string; type?: string };

    if (payload.message) {
      return `${fallback} ${payload.message}`;
    }
  } catch {
    // Fall through to the raw response text below.
  }

  return `${fallback} ${responseText}`;
}

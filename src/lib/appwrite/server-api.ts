import "server-only";

import { appwriteConfig } from "@/lib/appwrite/config";

const RECOVERABLE_APPWRITE_NETWORK_CODES = new Set([
  "EAI_AGAIN",
  "ECONNREFUSED",
  "ECONNRESET",
  "ENOTFOUND",
  "ETIMEDOUT",
]);

type ErrorLike = {
  cause?: unknown;
  code?: string;
  hostname?: string;
  message?: string;
};

function getAppwriteApiBaseUrl() {
  return appwriteConfig.endpoint.endsWith("/")
    ? appwriteConfig.endpoint
    : `${appwriteConfig.endpoint}/`;
}

function readErrorDetail(
  error: unknown,
  detail: keyof Pick<ErrorLike, "code" | "hostname" | "message">,
  depth = 4,
): string | null {
  let currentError = error;

  for (let index = 0; index < depth; index += 1) {
    if (!currentError || typeof currentError !== "object") {
      return null;
    }

    const value = (currentError as ErrorLike)[detail];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    currentError = (currentError as ErrorLike).cause;
  }

  return null;
}

function isRecoverableAppwriteNetworkError(error: unknown) {
  const code = readErrorDetail(error, "code");
  const message = readErrorDetail(error, "message");

  return Boolean(
    (code && RECOVERABLE_APPWRITE_NETWORK_CODES.has(code)) ||
      message === "fetch failed",
  );
}

function formatAppwriteNetworkDetails(error: unknown) {
  const code = readErrorDetail(error, "code");
  const hostname = readErrorDetail(error, "hostname");
  const details = [code, hostname].filter(Boolean);

  return details.length > 0 ? ` (${details.join(" ")})` : "";
}

export function buildAppwriteApiUrl(pathname: string) {
  return new URL(pathname.replace(/^\//, ""), getAppwriteApiBaseUrl());
}

export function logAppwriteReadFallback(
  context: string,
  error: unknown,
  fallbackDescription: string,
) {
  if (isRecoverableAppwriteNetworkError(error)) {
    console.warn(
      `${context}. ${fallbackDescription}${formatAppwriteNetworkDetails(error)}`,
    );
    return;
  }

  console.error(context, error);
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

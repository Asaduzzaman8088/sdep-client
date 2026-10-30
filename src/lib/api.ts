"use client";

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000").replace(
  /\/$/,
  "",
);

let cachedToken: { token: string; expiresAt: number } | null = null;

function decodeTokenExpiry(token: string): number {
  try {
    const segment = token.split(".")[1];

    if (!segment) {
      return 0;
    }

    const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const payload = JSON.parse(atob(padded)) as { exp?: number };

    return typeof payload.exp === "number" ? payload.exp * 1000 : 0;
  } catch {
    return 0;
  }
}

export function clearAuthTokenCache() {
  cachedToken = null;
}

export async function getAuthToken(forceRefresh = false) {
  if (
    !forceRefresh &&
    cachedToken &&
    cachedToken.expiresAt - 30_000 > Date.now()
  ) {
    return cachedToken.token;
  }

  const response = await fetch("/api/auth/token", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    cachedToken = null;
    return null;
  }

  const data = (await response.json()) as { token?: string };

  if (!data.token) {
    cachedToken = null;
    return null;
  }

  const expiresAt = decodeTokenExpiry(data.token);

  cachedToken = {
    token: data.token,
    expiresAt: expiresAt || Date.now() + 5 * 60_000,
  };

  return data.token;
}

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

interface ApiRequestOptions extends Omit<RequestInit, "headers"> {
  headers?: Record<string, string>;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
  allowRetry = true,
): Promise<T> {
  const token = await getAuthToken();
  const { headers, ...rest } = options;

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...rest,
    headers: {
      Accept: "application/json",
      ...(rest.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const data = (await response.json().catch(() => null)) as
    | (T & { message?: string; details?: unknown })
    | null;

  if (response.status === 401 && allowRetry && token) {
    clearAuthTokenCache();
    await getAuthToken(true);
    return apiRequest<T>(path, options, false);
  }

  if (!response.ok) {
    throw new ApiError(
      data?.message ?? "Something went wrong. Please try again.",
      response.status,
      data?.details,
    );
  }

  return data as T;
}

export { apiBaseUrl };

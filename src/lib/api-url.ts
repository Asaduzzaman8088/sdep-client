const DEFAULT_API_URL = "http://localhost:5000";

export function getApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();

  return (configured || DEFAULT_API_URL).replace(/\/+$/, "");
}

export function getApiUrl(path: string): string {
  return `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

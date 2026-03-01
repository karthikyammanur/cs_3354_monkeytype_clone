// Centralized API client with Auth0 token injection
import { useAuth0 } from "@auth0/auth0-react";
import { useCallback, useMemo } from "react";
import { env } from "../config/env.ts";

export async function apiFetch<T>(
  path: string,
  options?: RequestInit & { token?: string }
): Promise<T> {
  const { token, ...init } = options ?? {};

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${env.API_URL}${path}`, { ...init, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message ?? `Request failed with status ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export async function publicFetch<T>(path: string): Promise<T> {
  return apiFetch<T>(path, { method: "GET" });
}

export function useApiClient() {
  const { getAccessTokenSilently } = useAuth0();

  const request = useCallback(
    async <T>(method: string, path: string, body?: unknown): Promise<T> => {
      const token = await getAccessTokenSilently();
      return apiFetch<T>(path, {
        method,
        token,
        body: body ? JSON.stringify(body) : undefined,
      });
    },
    [getAccessTokenSilently]
  );

  return useMemo(
    () => ({
      get: <T>(path: string) => request<T>("GET", path),
      post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
      put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
    }),
    [request]
  );
}

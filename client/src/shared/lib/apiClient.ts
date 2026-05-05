import { ApiError } from "./apiError";
import { tokenStorage } from "./tokenStorage";

const API_URL = import.meta.env.VITE_API_URL;

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiClientOptions<TBody = unknown> {
  method?: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
}

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

async function refreshToken(): Promise<string> {
  const refresh = tokenStorage.getRefresh();

  if (!refresh) throw new Error("No refresh token");

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken: refresh }),
  });

  if (!res.ok) throw new Error("Refresh failed");

  const data = await res.json();

  tokenStorage.setAccess(data.accessToken);
  tokenStorage.setRefresh(data.refreshToken);

  return data.accessToken;
}

async function executeRequest(
  endpoint: string,
  method: HttpMethod,
  body: unknown,
  headers: Record<string, string>,
): Promise<Response> {
  const token = tokenStorage.getAccess();

  return fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

async function extractErrorMessage(res: Response): Promise<string> {
  // NestJS validation errors typically come as JSON: { message: string | string[], error, statusCode }.
  // Falling back to plain text covers any non-JSON error response.
  const contentType = res.headers.get("content-type") || "";
  try {
    if (contentType.includes("application/json")) {
      const data = await res.json();
      const msg = data?.message;
      if (Array.isArray(msg)) return msg.join(", ");
      if (typeof msg === "string") return msg;
      return data?.error || res.statusText || "Request failed";
    }
    const text = await res.text();
    return text || res.statusText || "Request failed";
  } catch {
    return res.statusText || "Request failed";
  }
}

/**
 * API client for making requests to the API
 * @param endpoint - The endpoint to make the request to
 * @param options - The options for the request
 * @returns The response from the API
 */
export async function apiClient<TResponse, TBody = unknown>(
  endpoint: string,
  options: ApiClientOptions<TBody> = {},
): Promise<TResponse> {
  const { method = "GET", body, headers = {} } = options;

  let res = await executeRequest(endpoint, method, body, headers);

  if (res.status === 401 && !endpoint.startsWith("/auth/login")) {
    try {
      // Single-flight 401 -> refresh -> retry
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshToken().finally(() => {
          isRefreshing = false;
          refreshPromise = null;
        });
      }

      await refreshPromise;
      res = await executeRequest(endpoint, method, body, headers);
    } catch {
      tokenStorage.clear();
      window.location.href = "/login";
      throw new ApiError("Session expired", 401);
    }
  }

  if (!res.ok) {
    const message = await extractErrorMessage(res);
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) {
    return undefined as TResponse;
  }

  return res.json() as Promise<TResponse>;
}

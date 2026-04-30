import { ApiError } from "./apiError";

// const API_URL = "http://localhost:3000/api";
const API_URL = import.meta.env.VITE_API_URL;

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiClientOptions<TBody = unknown> {
  method?: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
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

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const message = await res.text();
    throw new ApiError(message, res.status);
  }

  return res.json() as Promise<TResponse>;
}

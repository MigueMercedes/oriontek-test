import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "./apiError";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Don't retry client errors (400/401/403/404/409) — they won't recover.
      // Retry once for transient server/network failures.
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          return false;
        }
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});

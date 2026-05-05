import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "./api";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
};

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: getDashboardStats,
    select: (res) => res.data,
  });
}

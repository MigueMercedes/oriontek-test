import { apiClient } from "../../shared/lib/apiClient";
import type { DashboardStats } from "./types";

interface ItemResponse<T> {
  data: T;
}

export const getDashboardStats = () =>
  apiClient<ItemResponse<DashboardStats>>("/dashboard/stats");

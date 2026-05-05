import { apiClient } from "../../shared/lib/apiClient";
import type { LoginResponse, LoginPayload, MeResponse } from "./types";

export const login = (data: LoginPayload) =>
  apiClient<LoginResponse, LoginPayload>("/auth/login", {
    method: "POST",
    body: data,
  });

export const logout = () =>
  apiClient<{ message: string }>("/auth/logout", { method: "POST" });

export const me = () => apiClient<MeResponse>("/auth/me");

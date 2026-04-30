import { apiClient } from "../../shared/lib/apiClient";
import type { LoginResponse, LoginPayload } from "./types";

export const login = (data: LoginPayload) =>
  apiClient<LoginResponse, LoginPayload>("/login", {
    method: "POST",
    body: data,
  });

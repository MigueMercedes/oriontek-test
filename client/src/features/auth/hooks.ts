import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { LoginPayload, LoginResponse } from "./types";
import { login } from "./api";
import { useAuthStore } from "./store";
import { ApiError } from "../../shared/lib/apiError";

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation<LoginResponse, ApiError, LoginPayload>({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      navigate("/dashboard");
    },
  });
}

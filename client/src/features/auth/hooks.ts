import { useMutation } from "@tanstack/react-query";
import type { LoginPayload, LoginResponse } from "./types";
import { login } from "./api";

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: login,
  });
}

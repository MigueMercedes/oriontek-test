import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { ApiError } from "../../shared/lib/apiError";
import {
  createCliente,
  deleteCliente,
  getCliente,
  listClientes,
  updateCliente,
} from "./api";
import type { ClientePayload } from "./types";

export const clientesKeys = {
  all: ["clientes"] as const,
  list: () => [...clientesKeys.all, "list"] as const,
  detail: (id: string) => [...clientesKeys.all, "detail", id] as const,
};

export function useClientes() {
  return useQuery({
    queryKey: clientesKeys.list(),
    queryFn: listClientes,
    select: (res) => res.data,
  });
}

export function useCliente(id: string | undefined) {
  return useQuery({
    queryKey: clientesKeys.detail(id || ""),
    queryFn: () => getCliente(id as string),
    enabled: Boolean(id),
    select: (res) => res.data,
    retry: (failureCount, error) => {
      const status = (error as ApiError | undefined)?.status;
      if (status === 404) return false;
      return failureCount < 1;
    },
  });
}

export function useCreateCliente() {
  const qc = useQueryClient();
  return useMutation<
    Awaited<ReturnType<typeof createCliente>>,
    ApiError,
    ClientePayload
  >({
    mutationFn: createCliente,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: clientesKeys.all });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      qc.invalidateQueries({ queryKey: ["direcciones"] });
    },
  });
}

export function useUpdateCliente(id: string) {
  const qc = useQueryClient();
  return useMutation<
    Awaited<ReturnType<typeof updateCliente>>,
    ApiError,
    ClientePayload
  >({
    mutationFn: (payload) => updateCliente(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: clientesKeys.all });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      qc.invalidateQueries({ queryKey: ["direcciones"] });
    },
  });
}

export function useDeleteCliente() {
  const qc = useQueryClient();
  return useMutation<{ message: string }, ApiError, string>({
    mutationFn: (id) => deleteCliente(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: clientesKeys.all });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      qc.invalidateQueries({ queryKey: ["direcciones"] });
    },
  });
}

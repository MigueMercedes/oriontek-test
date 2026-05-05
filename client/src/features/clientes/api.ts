import { apiClient } from "../../shared/lib/apiClient";
import type {
  ClienteDetail,
  ClienteListItem,
  ClientePayload,
} from "./types";

interface ListResponse<T> {
  data: T[];
}
interface ItemResponse<T> {
  data: T;
}

export const listClientes = () =>
  apiClient<ListResponse<ClienteListItem>>("/clientes");

export const getCliente = (id: string) =>
  apiClient<ItemResponse<ClienteDetail>>(`/clientes/${id}`);

export const createCliente = (payload: ClientePayload) =>
  apiClient<ItemResponse<ClienteDetail>, ClientePayload>("/clientes", {
    method: "POST",
    body: payload,
  });

export const updateCliente = (id: string, payload: ClientePayload) =>
  apiClient<ItemResponse<ClienteDetail>, ClientePayload>(`/clientes/${id}`, {
    method: "PUT",
    body: payload,
  });

export const deleteCliente = (id: string) =>
  apiClient<{ message: string }>(`/clientes/${id}`, { method: "DELETE" });

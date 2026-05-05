import { apiClient } from "../../shared/lib/apiClient";
import type { DireccionListItem } from "./types";

interface ListResponse<T> {
  data: T[];
}

export const listDirecciones = () =>
  apiClient<ListResponse<DireccionListItem>>("/direcciones");

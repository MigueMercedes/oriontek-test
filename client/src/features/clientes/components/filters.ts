export type DireccionesFilter = "all" | "none" | "one" | "multi";
export type SortBy = "recent" | "oldest" | "alpha";

export interface ClientesFilters {
  direcciones: DireccionesFilter;
  sortBy: SortBy;
}

export const DEFAULT_FILTERS: ClientesFilters = {
  direcciones: "all",
  sortBy: "recent",
};

export function countActiveFilters(filters: ClientesFilters): number {
  let count = 0;
  if (filters.direcciones !== DEFAULT_FILTERS.direcciones) count++;
  if (filters.sortBy !== DEFAULT_FILTERS.sortBy) count++;
  return count;
}

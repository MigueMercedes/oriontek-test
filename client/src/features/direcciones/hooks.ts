import { useQuery } from "@tanstack/react-query";
import { listDirecciones } from "./api";

export const direccionesKeys = {
  all: ["direcciones"] as const,
  list: () => [...direccionesKeys.all, "list"] as const,
};

export function useLocations() {
  return useQuery({
    queryKey: direccionesKeys.list(),
    queryFn: listDirecciones,
    select: (res) => res.data,
  });
}

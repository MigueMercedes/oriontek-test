import { Grid } from "@mui/material";
import { BarChart3, MapPin, TrendingUp, Users } from "lucide-react";
import KpiCard from "../../../shared/components/KpiCard";
import type { ClienteListItem } from "../types";

interface ClientesKpisProps {
  clientes: ClienteListItem[] | undefined;
  nuevosUltimaSemana: number;
  loading?: boolean;
}

export default function ClientesKpis({
  clientes,
  nuevosUltimaSemana,
  loading = false,
}: ClientesKpisProps) {
  const totalClientes = clientes?.length ?? 0;
  const totalDirecciones =
    clientes?.reduce((acc, c) => acc + (c._count?.direcciones ?? 0), 0) ?? 0;
  const promedio =
    totalClientes > 0
      ? (totalDirecciones / totalClientes).toFixed(1)
      : "0.0";

  return (
    <Grid
      container
      spacing={2}
      sx={{ mb: 3 }}
    >
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <KpiCard
          label="Total clientes"
          value={totalClientes}
          icon={Users}
          loading={loading}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <KpiCard
          label="Total direcciones"
          value={totalDirecciones}
          icon={MapPin}
          loading={loading}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <KpiCard
          label="Direcciones / cliente"
          value={promedio}
          icon={BarChart3}
          loading={loading}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <KpiCard
          label="Nuevos esta semana"
          value={nuevosUltimaSemana}
          icon={TrendingUp}
          loading={loading}
        />
      </Grid>
    </Grid>
  );
}

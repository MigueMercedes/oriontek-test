import { Grid } from "@mui/material";
import { BarChart3, MapPin, TrendingUp, Users } from "lucide-react";
import KpiCard from "../../../shared/components/KpiCard";
import type { DashboardStats } from "../types";

interface DashboardKpisProps {
  stats: DashboardStats;
  loading?: boolean;
}

export default function DashboardKpis({
  stats,
  loading = false,
}: DashboardKpisProps) {
  const promedio =
    typeof stats.promedioDireccionesPorCliente === "number"
      ? stats.promedioDireccionesPorCliente.toFixed(1)
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
          value={stats.totalClientes}
          icon={Users}
          loading={loading}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <KpiCard
          label="Total direcciones"
          value={stats.totalDirecciones}
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
          value={stats.nuevosUltimaSemana}
          icon={TrendingUp}
          loading={loading}
        />
      </Grid>
    </Grid>
  );
}

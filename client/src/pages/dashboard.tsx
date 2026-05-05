import { Box, Typography } from "@mui/material";
import DashboardKpis from "../features/dashboard/components/DashboardKpis";
import RecentClientesTable from "../features/dashboard/components/RecentClientesTable";
import { useDashboardStats } from "../features/dashboard/hooks";

const EMPTY_STATS = {
  totalClientes: 0,
  totalDirecciones: 0,
  promedioDireccionesPorCliente: 0,
  nuevosUltimaSemana: 0,
  recientes: [],
};

export default function Dashboard() {
  const { data, isLoading } = useDashboardStats();
  const stats = data ?? EMPTY_STATS;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h1"
          sx={{ mb: 0.5 }}
        >
          Resumen del sistema
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary" }}
        >
          Bienvenido. Esto es lo que está pasando con tus clientes hoy.
        </Typography>
      </Box>

      <DashboardKpis
        stats={stats}
        loading={isLoading}
      />

      <RecentClientesTable
        clientes={stats.recientes}
        loading={isLoading}
        hasClientes={stats.totalClientes > 0}
      />
    </Box>
  );
}

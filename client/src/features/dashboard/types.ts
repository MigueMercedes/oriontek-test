export interface DashboardRecentClient {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  createdAt: string;
  _count: {
    direcciones: number;
  };
}

export interface DashboardStats {
  totalClientes: number;
  totalDirecciones: number;
  promedioDireccionesPorCliente: number;
  nuevosUltimaSemana: number;
  recientes: DashboardRecentClient[];
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [totalClientes, totalDirecciones, nuevosUltimaSemana, recientes] =
      await Promise.all([
        this.prisma.cliente.count(),
        this.prisma.direccion.count(),
        this.prisma.cliente.count({
          where: { createdAt: { gte: sevenDaysAgo } },
        }),
        this.prisma.cliente.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            telefono: true,
            createdAt: true,
            _count: { select: { direcciones: true } },
          },
        }),
      ]);

    const promedio =
      totalClientes > 0
        ? Math.round((totalDirecciones / totalClientes) * 10) / 10
        : 0;

    return {
      totalClientes,
      totalDirecciones,
      promedioDireccionesPorCliente: promedio,
      nuevosUltimaSemana,
      recientes,
    };
  }
}

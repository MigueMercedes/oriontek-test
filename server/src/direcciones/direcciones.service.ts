import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DireccionesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.direccion.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        calle: true,
        ciudad: true,
        provincia: true,
        codigoPostal: true,
        createdAt: true,
        cliente: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
          },
        },
      },
    });
  }
}

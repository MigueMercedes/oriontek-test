import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.cliente.findMany({
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
    });
  }

  async findOne(id: number) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id },
      include: {
        direcciones: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado');
    }

    return cliente;
  }

  async create(dto: CreateClienteDto) {
    return this.prisma.cliente.create({
      data: {
        nombre: dto.nombre,
        apellido: dto.apellido,
        email: dto.email,
        telefono: dto.telefono,
        direcciones: {
          create: dto.direcciones.map((d) => ({
            calle: d.calle,
            ciudad: d.ciudad,
            provincia: d.provincia,
            codigoPostal: d.codigoPostal,
          })),
        },
      },
      include: { direcciones: true },
    });
  }

  async update(id: number, dto: UpdateClienteDto) {
    const existing = await this.prisma.cliente.findUnique({
      where: { id },
      include: { direcciones: { select: { id: true } } },
    });

    if (!existing) {
      throw new NotFoundException('Cliente no encontrado');
    }

    const incomingIds = new Set(
      dto.direcciones.filter((d) => typeof d.id === 'number').map((d) => d.id as number),
    );
    const idsToDelete = existing.direcciones
      .filter((d) => !incomingIds.has(d.id))
      .map((d) => d.id);

    const toUpdate = dto.direcciones.filter((d) => typeof d.id === 'number');
    const toCreate = dto.direcciones.filter((d) => typeof d.id !== 'number');

    return this.prisma.$transaction(async (tx) => {
      await tx.cliente.update({
        where: { id },
        data: {
          nombre: dto.nombre,
          apellido: dto.apellido,
          email: dto.email,
          telefono: dto.telefono,
        },
      });

      if (idsToDelete.length > 0) {
        await tx.direccion.deleteMany({
          where: { id: { in: idsToDelete }, clienteId: id },
        });
      }

      for (const d of toUpdate) {
        await tx.direccion.update({
          where: { id: d.id! },
          data: {
            calle: d.calle,
            ciudad: d.ciudad,
            provincia: d.provincia,
            codigoPostal: d.codigoPostal,
          },
        });
      }

      if (toCreate.length > 0) {
        await tx.direccion.createMany({
          data: toCreate.map((d) => ({
            calle: d.calle,
            ciudad: d.ciudad,
            provincia: d.provincia,
            codigoPostal: d.codigoPostal,
            clienteId: id,
          })),
        });
      }

      return tx.cliente.findUnique({
        where: { id },
        include: { direcciones: { orderBy: { createdAt: 'asc' } } },
      });
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.cliente.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Cliente no encontrado');
    }

    await this.prisma.cliente.delete({ where: { id } });
    return { message: 'Cliente eliminado correctamente' };
  }
}

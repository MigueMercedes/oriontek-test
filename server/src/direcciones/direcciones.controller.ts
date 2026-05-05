import { Controller, Get } from '@nestjs/common';
import { DireccionesService } from './direcciones.service';

@Controller('direcciones')
export class DireccionesController {
  constructor(private readonly direccionesService: DireccionesService) {}

  @Get()
  async findAll() {
    const data = await this.direccionesService.findAll();
    return { data };
  }
}

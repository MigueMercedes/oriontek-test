import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DireccionDto } from './direccion.dto';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  nombre!: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido es requerido' })
  apellido!: string;

  @IsEmail({}, { message: 'Email inválido' })
  email!: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Debe incluir al menos una dirección' })
  @ValidateNested({ each: true })
  @Type(() => DireccionDto)
  direcciones!: DireccionDto[];
}

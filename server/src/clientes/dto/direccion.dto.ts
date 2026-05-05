import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DireccionDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsString()
  @IsNotEmpty({ message: 'La calle es requerida' })
  calle!: string;

  @IsString()
  @IsNotEmpty({ message: 'La ciudad es requerida' })
  ciudad!: string;

  @IsString()
  @IsNotEmpty({ message: 'La provincia es requerida' })
  provincia!: string;

  @IsOptional()
  @IsString()
  codigoPostal?: string;
}

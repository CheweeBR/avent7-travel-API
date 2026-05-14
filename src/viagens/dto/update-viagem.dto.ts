import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { ViagemStatus } from '../enums/viagem.enum';

export class UpdateViagemDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ enum: ViagemStatus })
  @IsOptional()
  @IsEnum(ViagemStatus)
  status?: ViagemStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  passengerId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  coverImageUrl?: string;
}

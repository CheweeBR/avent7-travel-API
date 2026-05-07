import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsMongoId, IsOptional, IsString, Max, Min } from 'class-validator';
import { ViagemStatus } from '../enums/viagem.enum';

export class ViagemQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  clientId?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  pageSize?: number = 10;

  @ApiPropertyOptional({ enum: ViagemStatus })
  @IsOptional()
  @IsEnum(ViagemStatus)
  status?: ViagemStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}

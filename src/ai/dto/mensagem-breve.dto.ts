import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class MensagemBreveDto {
  @ApiPropertyOptional({ example: 'Paris & Côte d\'Azur — Lua de Mel' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  propostaTitle?: string;

  @ApiPropertyOptional({ example: '2025-07-10' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2025-07-20' })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  totalNights?: number;

  @ApiPropertyOptional({ example: 'João e Maria Silva' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  passengerName?: string;
}

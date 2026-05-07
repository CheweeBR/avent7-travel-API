import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreatePropostaDto {
  @ApiProperty()
  @IsMongoId()
  viagemId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;
}

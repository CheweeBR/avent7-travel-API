import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateViagemDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsMongoId()
  clientId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  passengerId?: string;
}

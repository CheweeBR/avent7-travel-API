import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { CURATED_ICON_NAMES } from '../constants/curated-icons';

export class CreateClientSegmentDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(40)
  name: string;

  @ApiProperty({ enum: CURATED_ICON_NAMES })
  @IsString()
  @IsIn(CURATED_ICON_NAMES as unknown as string[])
  icon: string;

  @ApiPropertyOptional({ example: 'var(--muted)' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  order?: number;
}

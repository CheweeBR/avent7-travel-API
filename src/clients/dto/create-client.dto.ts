import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DocumentType, Gender } from '../enums/client.enum';

export class PrimaryDocumentDto {
  @ApiProperty({ enum: DocumentType })
  @IsEnum(DocumentType)
  type: DocumentType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({ example: 'BR' })
  @IsString()
  @IsNotEmpty()
  country: string;
}

export class CreateClientDto {
  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsEmail()
  emailPrimary: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  photoUrl?: string;

  @ApiPropertyOptional({ type: PrimaryDocumentDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PrimaryDocumentDto)
  primaryDocument?: PrimaryDocumentDto;

  @ApiProperty({ description: 'ObjectId do segmento (ClientSegment) ao qual o cliente pertence' })
  @IsMongoId()
  segmentId: string;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  socialName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  profession?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  emailSecondary?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phonePrimary?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phoneAlternative?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  address?: Record<string, string>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  emergencyContact?: Record<string, string>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  travelPreferences?: Record<string, any>;
}

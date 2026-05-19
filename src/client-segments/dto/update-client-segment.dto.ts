import { PartialType } from '@nestjs/swagger';
import { CreateClientSegmentDto } from './create-client-segment.dto';

export class UpdateClientSegmentDto extends PartialType(CreateClientSegmentDto) {}

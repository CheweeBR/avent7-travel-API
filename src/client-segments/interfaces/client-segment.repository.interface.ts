import { IClientSegment } from './client-segment.interface';
import { CreateClientSegmentDto } from '../dto/create-client-segment.dto';
import { UpdateClientSegmentDto } from '../dto/update-client-segment.dto';

export const CLIENT_SEGMENT_REPOSITORY = Symbol('IClientSegmentRepository');

export interface IClientSegmentRepository {
  findAllByAgency(agencyId: string): Promise<IClientSegment[]>;
  findById(id: string): Promise<IClientSegment | null>;
  findByAgencyAndName(agencyId: string, name: string): Promise<IClientSegment | null>;
  create(dto: CreateClientSegmentDto & { agencyId: string }): Promise<IClientSegment>;
  update(id: string, dto: UpdateClientSegmentDto): Promise<IClientSegment | null>;
  remove(id: string): Promise<boolean>;
}

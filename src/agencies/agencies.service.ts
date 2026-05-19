import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AGENCY_REPOSITORY, IAgencyRepository } from './interfaces/agency.repository.interface';
import { IAgency } from './interfaces/agency.interface';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';
import { ClientSegmentsService } from '../client-segments/client-segments.service';

@Injectable()
export class AgenciesService {
  constructor(
    @Inject(AGENCY_REPOSITORY) private readonly agencyRepo: IAgencyRepository,
    private readonly segmentsService: ClientSegmentsService,
  ) {}

  async findById(id: string): Promise<IAgency> {
    const agency = await this.agencyRepo.findById(id);
    if (!agency) throw new NotFoundException('Agência não encontrada.');
    return agency;
  }

  async create(dto: CreateAgencyDto): Promise<IAgency> {
    const existing = await this.agencyRepo.findBySlug(dto.slug);
    if (existing) throw new ConflictException('Slug já está em uso.');
    const agency = await this.agencyRepo.create(dto);
    await this.segmentsService.seedDefaults(agency.id);
    return agency;
  }

  async update(id: string, dto: UpdateAgencyDto): Promise<IAgency> {
    const updated = await this.agencyRepo.update(id, dto);
    if (!updated) throw new NotFoundException('Agência não encontrada.');
    return updated;
  }
}

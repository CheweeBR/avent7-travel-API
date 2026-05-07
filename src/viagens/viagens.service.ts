import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { VIAGEM_REPOSITORY, IViagemRepository } from './interfaces/viagem.repository.interface';
import { IViagem } from './interfaces/viagem.interface';
import { CreateViagemDto } from './dto/create-viagem.dto';
import { UpdateViagemDto } from './dto/update-viagem.dto';
import { ViagemQueryDto } from './dto/viagem-query.dto';
import { PagedResult } from '../common/types/paged-result.type';

@Injectable()
export class ViagensService {
  constructor(
    @Inject(VIAGEM_REPOSITORY) private readonly repo: IViagemRepository,
  ) {}

  private generateCode(): string {
    const ts = Date.now().toString(36).toUpperCase();
    return `VGM-${ts}`;
  }

  async findPaged(agencyId: string, query: ViagemQueryDto): Promise<PagedResult<IViagem>> {
    return this.repo.findPaged(agencyId, query);
  }

  async findAll(agencyId: string): Promise<IViagem[]> {
    return this.repo.findAll(agencyId);
  }

  async findByClient(agencyId: string, clientId: string): Promise<IViagem[]> {
    return this.repo.findByClient(agencyId, clientId);
  }

  async findById(id: string): Promise<IViagem> {
    const viagem = await this.repo.findById(id);
    if (!viagem) throw new NotFoundException('Viagem não encontrada.');
    return viagem;
  }

  async create(dto: CreateViagemDto, agencyId: string, userId: string | null): Promise<IViagem> {
    const viagemCode = this.generateCode();
    return this.repo.create({ ...dto, agencyId, viagemCode, createdByUserId: userId });
  }

  async update(id: string, dto: UpdateViagemDto): Promise<IViagem> {
    const updated = await this.repo.update(id, dto);
    if (!updated) throw new NotFoundException('Viagem não encontrada.');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.repo.remove(id);
    if (!deleted) throw new NotFoundException('Viagem não encontrada.');
  }
}

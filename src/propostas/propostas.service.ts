import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PROPOSTA_REPOSITORY, IPropostaRepository } from './interfaces/proposta.repository.interface';
import { IProposta } from './interfaces/proposta.interface';
import { CreatePropostaDto } from './dto/create-proposta.dto';
import { UpdatePropostaDto } from './dto/update-proposta.dto';

@Injectable()
export class PropostasService {
  constructor(
    @Inject(PROPOSTA_REPOSITORY) private readonly repo: IPropostaRepository,
  ) {}

  private generateCode(): string {
    const ts = Date.now().toString(36).toUpperCase();
    return `PRO-${ts}`;
  }

  async findAll(agencyId: string): Promise<IProposta[]> {
    return this.repo.findAll(agencyId);
  }

  async findByViagem(agencyId: string, viagemId: string): Promise<IProposta[]> {
    return this.repo.findByViagem(agencyId, viagemId);
  }

  async findById(id: string): Promise<IProposta> {
    const proposta = await this.repo.findById(id);
    if (!proposta) throw new NotFoundException('Proposta não encontrada.');
    return proposta;
  }

  async create(dto: CreatePropostaDto, agencyId: string): Promise<IProposta> {
    const propostaCode = this.generateCode();
    return this.repo.create({ ...dto, agencyId, propostaCode });
  }

  async update(id: string, dto: UpdatePropostaDto): Promise<IProposta> {
    const updated = await this.repo.update(id, dto);
    if (!updated) throw new NotFoundException('Proposta não encontrada.');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.repo.remove(id);
    if (!deleted) throw new NotFoundException('Proposta não encontrada.');
  }
}

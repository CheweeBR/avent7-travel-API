import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PROPOSTA_BLOCK_REPOSITORY, IPropostaBlockRepository } from './interfaces/proposta-block.repository.interface';
import { IPropostaBlock } from './interfaces/proposta-block.interface';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';

@Injectable()
export class PropostaBlocksService {
  constructor(
    @Inject(PROPOSTA_BLOCK_REPOSITORY) private readonly repo: IPropostaBlockRepository,
  ) {}

  async findByProposta(propostaId: string): Promise<IPropostaBlock[]> {
    return this.repo.findByProposta(propostaId);
  }

  async findById(id: string): Promise<IPropostaBlock> {
    const block = await this.repo.findById(id);
    if (!block) throw new NotFoundException('Bloco não encontrado.');
    return block;
  }

  async create(propostaId: string, dto: CreateBlockDto): Promise<IPropostaBlock> {
    return this.repo.create({ ...dto, propostaId });
  }

  async update(id: string, dto: UpdateBlockDto): Promise<IPropostaBlock> {
    const updated = await this.repo.update(id, dto);
    if (!updated) throw new NotFoundException('Bloco não encontrado.');
    return updated;
  }

  async reorder(propostaId: string, orderedIds: string[]): Promise<IPropostaBlock[]> {
    return this.repo.reorder(propostaId, orderedIds);
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.repo.remove(id);
    if (!deleted) throw new NotFoundException('Bloco não encontrado.');
  }
}

import { IPropostaBlock } from './proposta-block.interface';
import { CreateBlockDto } from '../dto/create-block.dto';
import { UpdateBlockDto } from '../dto/update-block.dto';

export const PROPOSTA_BLOCK_REPOSITORY = Symbol('IPropostaBlockRepository');

export interface IPropostaBlockRepository {
  findByProposta(propostaId: string): Promise<IPropostaBlock[]>;
  findById(id: string): Promise<IPropostaBlock | null>;
  create(dto: CreateBlockDto & { propostaId: string }): Promise<IPropostaBlock>;
  update(id: string, dto: UpdateBlockDto): Promise<IPropostaBlock | null>;
  reorder(propostaId: string, orderedIds: string[]): Promise<IPropostaBlock[]>;
  remove(id: string): Promise<boolean>;
}

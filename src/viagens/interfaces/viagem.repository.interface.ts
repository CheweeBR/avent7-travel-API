import { IViagem } from './viagem.interface';
import { CreateViagemDto } from '../dto/create-viagem.dto';
import { UpdateViagemDto } from '../dto/update-viagem.dto';
import { ViagemQueryDto } from '../dto/viagem-query.dto';
import { PagedResult } from '../../common/types/paged-result.type';

export const VIAGEM_REPOSITORY = Symbol('IViagemRepository');

export interface IViagemRepository {
  findPaged(agencyId: string, query: ViagemQueryDto): Promise<PagedResult<IViagem>>;
  findAll(agencyId: string): Promise<IViagem[]>;
  findByClient(agencyId: string, clientId: string): Promise<IViagem[]>;
  findById(id: string): Promise<IViagem | null>;
  create(dto: CreateViagemDto & { agencyId: string; viagemCode: string; createdByUserId: string | null }): Promise<IViagem>;
  update(id: string, dto: UpdateViagemDto): Promise<IViagem | null>;
  remove(id: string): Promise<boolean>;
}

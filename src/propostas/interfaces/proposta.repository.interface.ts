import { IProposta } from './proposta.interface';
import { CreatePropostaDto } from '../dto/create-proposta.dto';
import { UpdatePropostaDto } from '../dto/update-proposta.dto';

export const PROPOSTA_REPOSITORY = Symbol('IPropostaRepository');

export interface IPropostaRepository {
  findAll(agencyId: string): Promise<IProposta[]>;
  findByPassenger(agencyId: string, passengerId: string): Promise<IProposta[]>;
  findById(id: string): Promise<IProposta | null>;
  create(dto: CreatePropostaDto & { agencyId: string; propostaCode: string }): Promise<IProposta>;
  update(id: string, dto: UpdatePropostaDto): Promise<IProposta | null>;
  remove(id: string): Promise<boolean>;
}

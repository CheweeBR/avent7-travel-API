import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  CLIENT_SEGMENT_REPOSITORY,
  IClientSegmentRepository,
} from './interfaces/client-segment.repository.interface';
import { IClientSegment, IClientSegmentWithCount } from './interfaces/client-segment.interface';
import { CreateClientSegmentDto } from './dto/create-client-segment.dto';
import { UpdateClientSegmentDto } from './dto/update-client-segment.dto';
import { Client, ClientDocument } from '../clients/schemas/client.schema';
import { DEFAULT_SEGMENT_SEEDS } from './constants/curated-icons';

@Injectable()
export class ClientSegmentsService {
  constructor(
    @Inject(CLIENT_SEGMENT_REPOSITORY) private readonly repo: IClientSegmentRepository,
    @InjectModel(Client.name) private readonly clientModel: Model<ClientDocument>,
  ) {}

  async findAllForAgency(agencyId: string): Promise<IClientSegmentWithCount[]> {
    let segments = await this.repo.findAllByAgency(agencyId);

    // Auto-seed: agências criadas antes da feature ainda não têm segmentos.
    // seedDefaults é idempotente.
    if (segments.length === 0) {
      await this.seedDefaults(agencyId);
      segments = await this.repo.findAllByAgency(agencyId);
    }

    const counts = await this.clientModel.aggregate<{ _id: Types.ObjectId; count: number }>([
      { $match: { agencyId: new Types.ObjectId(agencyId) } },
      { $group: { _id: '$segmentId', count: { $sum: 1 } } },
    ]);
    const countMap = new Map(counts.map((c) => [c._id?.toString(), c.count]));

    return segments.map((s) => ({ ...s, clientsCount: countMap.get(s.id) ?? 0 }));
  }

  async findById(id: string, agencyId: string): Promise<IClientSegment> {
    const segment = await this.repo.findById(id);
    if (!segment) throw new NotFoundException('Segmento não encontrado.');
    if (segment.agencyId !== agencyId) {
      throw new ForbiddenException('Segmento pertence a outra agência.');
    }
    return segment;
  }

  async create(dto: CreateClientSegmentDto, agencyId: string): Promise<IClientSegment> {
    const existing = await this.repo.findByAgencyAndName(agencyId, dto.name);
    if (existing) throw new ConflictException('Já existe um segmento com esse nome.');
    return this.repo.create({ ...dto, agencyId });
  }

  async update(id: string, dto: UpdateClientSegmentDto, agencyId: string): Promise<IClientSegment> {
    await this.findById(id, agencyId);

    if (dto.name) {
      const existing = await this.repo.findByAgencyAndName(agencyId, dto.name);
      if (existing && existing.id !== id) {
        throw new ConflictException('Já existe um segmento com esse nome.');
      }
    }

    const updated = await this.repo.update(id, dto);
    if (!updated) throw new NotFoundException('Segmento não encontrado.');
    return updated;
  }

  async remove(id: string, agencyId: string): Promise<void> {
    await this.findById(id, agencyId);

    const count = await this.clientModel.countDocuments({ segmentId: new Types.ObjectId(id) });
    if (count > 0) {
      throw new ConflictException(
        `Não é possível remover: ${count} cliente(s) ainda usam este segmento. Reatribua-os antes de remover.`,
      );
    }

    const removed = await this.repo.remove(id);
    if (!removed) throw new NotFoundException('Segmento não encontrado.');
  }

  async seedDefaults(agencyId: string): Promise<void> {
    const existing = await this.repo.findAllByAgency(agencyId);
    if (existing.length > 0) return;
    for (const seed of DEFAULT_SEGMENT_SEEDS) {
      await this.repo.create({ ...seed, agencyId });
    }
  }

  async assertBelongsToAgency(id: string, agencyId: string): Promise<void> {
    await this.findById(id, agencyId);
  }
}

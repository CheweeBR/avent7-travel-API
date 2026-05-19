import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ClientSegment, ClientSegmentDocument } from '../schemas/client-segment.schema';
import { IClientSegmentRepository } from '../interfaces/client-segment.repository.interface';
import { IClientSegment } from '../interfaces/client-segment.interface';
import { CreateClientSegmentDto } from '../dto/create-client-segment.dto';
import { UpdateClientSegmentDto } from '../dto/update-client-segment.dto';

type MongoSegment = ClientSegment & { _id: Types.ObjectId; createdAt: Date; updatedAt: Date };

@Injectable()
export class ClientSegmentMongooseRepository implements IClientSegmentRepository {
  constructor(
    @InjectModel(ClientSegment.name) private readonly model: Model<ClientSegmentDocument>,
  ) {}

  private toI(doc: MongoSegment): IClientSegment {
    return {
      id: doc._id.toString(),
      agencyId: doc.agencyId?.toString() ?? '',
      name: doc.name,
      icon: doc.icon,
      color: doc.color,
      order: doc.order ?? 0,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async findAllByAgency(agencyId: string): Promise<IClientSegment[]> {
    const docs = await this.model
      .find({ agencyId: new Types.ObjectId(agencyId) })
      .sort({ order: 1, name: 1 })
      .lean<MongoSegment[]>();
    return docs.map((d) => this.toI(d));
  }

  async findById(id: string): Promise<IClientSegment | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await this.model.findById(id).lean<MongoSegment>();
    return doc ? this.toI(doc) : null;
  }

  async findByAgencyAndName(agencyId: string, name: string): Promise<IClientSegment | null> {
    const doc = await this.model
      .findOne({ agencyId: new Types.ObjectId(agencyId), name })
      .lean<MongoSegment>();
    return doc ? this.toI(doc) : null;
  }

  async create(dto: CreateClientSegmentDto & { agencyId: string }): Promise<IClientSegment> {
    const created = await this.model.create({
      ...dto,
      agencyId: new Types.ObjectId(dto.agencyId),
    });
    const doc = await this.model.findById(created._id).lean<MongoSegment>();
    return this.toI(doc!);
  }

  async update(id: string, dto: UpdateClientSegmentDto): Promise<IClientSegment | null> {
    const doc = await this.model
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .lean<MongoSegment>();
    return doc ? this.toI(doc) : null;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }
}

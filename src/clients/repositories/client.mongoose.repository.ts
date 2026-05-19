import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Client, ClientDocument } from '../schemas/client.schema';
import { IClientRepository } from '../interfaces/client.repository.interface';
import { IClient } from '../interfaces/client.interface';
import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';
import { DocumentType, Gender } from '../enums/client.enum';

type PopulatedSegment = {
  _id: Types.ObjectId;
  name: string;
  icon: string;
  color: string;
} | null;

type MongoClient = Omit<Client, 'segmentId'> & {
  _id: Types.ObjectId;
  segmentId: Types.ObjectId | PopulatedSegment;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class ClientMongooseRepository implements IClientRepository {
  constructor(
    @InjectModel(Client.name) private readonly model: Model<ClientDocument>,
  ) {}

  private toIClient(doc: MongoClient): IClient {
    const seg = doc.segmentId;
    const isPopulated = seg && typeof seg === 'object' && 'name' in seg;
    const segmentIdStr = isPopulated
      ? (seg as PopulatedSegment)!._id.toString()
      : (seg as Types.ObjectId | null)?.toString() ?? '';

    return {
      id: doc._id.toString(),
      agencyId: doc.agencyId?.toString() ?? '',
      clientCode: doc.clientCode,
      fullName: doc.fullName,
      socialName: doc.socialName ?? null,
      dateOfBirth: doc.dateOfBirth ?? null,
      gender: (doc.gender as Gender) ?? null,
      nationality: doc.nationality ?? null,
      profession: doc.profession ?? null,
      company: doc.company ?? null,
      segmentId: segmentIdStr,
      segment: isPopulated
        ? {
            id: (seg as PopulatedSegment)!._id.toString(),
            name: (seg as PopulatedSegment)!.name,
            icon: (seg as PopulatedSegment)!.icon,
            color: (seg as PopulatedSegment)!.color,
          }
        : null,
      photoUrl: doc.photoUrl ?? null,
      emailPrimary: doc.emailPrimary,
      emailSecondary: doc.emailSecondary ?? null,
      phonePrimary: doc.phonePrimary ?? null,
      phoneAlternative: doc.phoneAlternative ?? null,
      address: doc.address ?? {},
      emergencyContact: doc.emergencyContact ?? {},
      primaryDocument: doc.primaryDocument
        ? {
            type: doc.primaryDocument.type as DocumentType,
            number: doc.primaryDocument.number,
            country: doc.primaryDocument.country,
          }
        : null,
      travelPreferences: doc.travelPreferences ?? {},
      isActive: doc.isActive,
      tripCount: doc.tripCount ?? 0,
      passengerCount: doc.passengerCount ?? 0,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async findAll(agencyId: string): Promise<IClient[]> {
    const docs = await this.model
      .find({ agencyId: new Types.ObjectId(agencyId) })
      .populate('segmentId', 'name icon color')
      .lean<MongoClient[]>();
    return docs.map((d) => this.toIClient(d));
  }

  async findById(id: string): Promise<IClient | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await this.model
      .findById(id)
      .populate('segmentId', 'name icon color')
      .lean<MongoClient>();
    return doc ? this.toIClient(doc) : null;
  }

  async findByClientCode(clientCode: string): Promise<IClient | null> {
    const doc = await this.model
      .findOne({ clientCode })
      .populate('segmentId', 'name icon color')
      .lean<MongoClient>();
    return doc ? this.toIClient(doc) : null;
  }

  async create(dto: CreateClientDto & { agencyId: string; clientCode: string }): Promise<IClient> {
    const created = await this.model.create({
      ...dto,
      agencyId: new Types.ObjectId(dto.agencyId),
      segmentId: new Types.ObjectId(dto.segmentId),
    });
    const doc = await this.model
      .findById(created._id)
      .populate('segmentId', 'name icon color')
      .lean<MongoClient>();
    return this.toIClient(doc!);
  }

  async update(id: string, dto: UpdateClientDto): Promise<IClient | null> {
    const updateSet: Record<string, any> = { ...dto };
    if (dto.segmentId) {
      updateSet.segmentId = new Types.ObjectId(dto.segmentId);
    }
    const doc = await this.model
      .findByIdAndUpdate(id, { $set: updateSet }, { new: true })
      .populate('segmentId', 'name icon color')
      .lean<MongoClient>();
    return doc ? this.toIClient(doc) : null;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }

  async incrementCount(id: string, field: 'tripCount' | 'passengerCount', delta: 1 | -1): Promise<void> {
    await this.model.findByIdAndUpdate(id, { $inc: { [field]: delta } });
  }
}
